import React, { useState, useEffect } from 'react';
import BASE from '../../config';
import { StatCard, Card, Table, Badge, SectionHeader } from '../../components/ui';
import { FileText, CreditCard, CheckCircle, AlertTriangle, Plus, Trash2, Edit3 } from 'lucide-react';

const BASE = "`${BASE}";

/* ─────────────── Pharmacy Dashboard ─────────────── */
export function PharmacyDashboard() {
  const [meds, setMeds] = useState([]);

  useEffect(() => {
    fetch(`${BASE}/api/medication/all`).then(r => r.json()).then(data => setMeds(Array.isArray(data) ? data : []));
  }, []);

  const pending = meds.filter(m => m.status === "pending");
  const dispensedToday = meds.filter(m => m.dispensed && new Date(m.updatedAt).toDateString() === new Date().toDateString());
  const totalRevenue = meds.filter(m => m.dispensed).reduce((sum, m) => sum + (m.price || 0), 0);

  return (
    <div>
      <SectionHeader title="Pharmacy Dashboard" subtitle="Manage prescriptions and dispensing" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Pending Rx" value={pending.length} icon={FileText} color="amber" />
        <StatCard title="Dispensed Today" value={dispensedToday.length} icon={CheckCircle} color="green" />
        <StatCard title="Total Dispensed" value={meds.filter(m => m.dispensed).length} icon={CheckCircle} color="blue" />
        <StatCard title="Revenue" value={`₹${totalRevenue}`} icon={CreditCard} color="teal" />
      </div>

      <Card title="Pending Prescriptions">
        <div className="p-4 space-y-3">
          {pending.length === 0 && <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-4">No pending prescriptions</p>}
          {pending.map(rx => (
            <div key={rx._id} className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 flex items-center gap-3">
              <FileText size={16} className="text-amber-500 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{rx.patientId}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{rx.medicineName} · {rx.dosage} · {rx.doctorName || rx.doctorId}</p>
              </div>
              <Badge variant="yellow">Pending</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ─────────────── Prescriptions + Dispense ─────────────── */
export function PharmacyPrescriptions() {
  const [meds, setMeds] = useState([]);
  const [prices, setPrices] = useState([]);
  const [dispenseId, setDispenseId] = useState(null);
  const [dispensePrice, setDispensePrice] = useState("");

  useEffect(() => {
    fetch(`${BASE}/api/medication/all`).then(r => r.json()).then(data => setMeds(Array.isArray(data) ? data : []));
    fetch(`${BASE}/api/medicine-prices`).then(r => r.json()).then(data => setPrices(Array.isArray(data) ? data : []));
  }, []);

  const getSuggestedPrice = (medicineName) => {
    const match = prices.find(p => p.name.toLowerCase() === medicineName?.toLowerCase());
    return match ? match.price : "";
  };

  const openDispense = (med) => {
    setDispenseId(med._id);
    setDispensePrice(getSuggestedPrice(med.medicineName) || "");
  };

  const confirmDispense = async () => {
    const res = await fetch(`${BASE}/api/medication/dispense/${dispenseId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: parseFloat(dispensePrice) || 0 })
    });
    const data = await res.json();
    setMeds(prev => prev.map(m => m._id === dispenseId ? data : m));
    setDispenseId(null);
    setDispensePrice("");
  };

  return (
    <div>
      <SectionHeader title="Prescriptions" />
      <Card>
        <Table headers={['Patient', 'Medicine', 'Dosage', 'Frequency', 'Doctor', 'Price', 'Status', 'Action']}>
          {meds.length === 0 && (
            <tr key="empty"><td colSpan={8} className="text-center py-8 text-sm text-slate-400 dark:text-slate-500">No prescriptions found</td></tr>
          )}
          {meds.map(rx => (
            <tr key={rx._id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
              <td className="px-4 py-3 font-semibold text-sm text-slate-800 dark:text-slate-100">{rx.patientId}</td>
              <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{rx.medicineName}</td>
              <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">{rx.dosage}</td>
              <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">{rx.frequency || '—'}</td>
              <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">{rx.doctorName || rx.doctorId}</td>
              <td className="px-4 py-3 font-mono text-slate-800 dark:text-slate-100">
                {rx.dispensed ? `₹${rx.price}` : '—'}
              </td>
              <td className="px-4 py-3">
                <Badge variant={rx.dispensed ? 'green' : 'yellow'}>{rx.dispensed ? 'Dispensed' : 'Pending'}</Badge>
              </td>
              <td className="px-4 py-3">
                {!rx.dispensed && (
                  <button onClick={() => openDispense(rx)} className="btn-primary py-1.5 text-xs">Dispense</button>
                )}
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      {/* Dispense Modal */}
      {dispenseId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-sm shadow-lg border border-slate-100 dark:border-slate-700">
            <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">Confirm Dispense</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Enter the price for this medicine:</p>
            <input
              type="number"
              placeholder="₹ Price"
              className="form-input mb-4"
              value={dispensePrice}
              onChange={e => setDispensePrice(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setDispenseId(null)} className="btn-secondary">Cancel</button>
              <button onClick={confirmDispense} className="btn-primary">Confirm & Dispense</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────── Medicine Price List ─────────────── */
export function MedicineInventory() {
  const [prices, setPrices] = useState([]);
  const [show, setShow] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: "", dosage: "", price: "" });

  useEffect(() => {
    fetch(`${BASE}/api/medicine-prices`).then(r => r.json()).then(data => setPrices(Array.isArray(data) ? data : []));
  }, []);

  const openAdd = () => { setEditItem(null); setForm({ name: "", dosage: "", price: "" }); setShow(true); };
  const openEdit = (item) => { setEditItem(item); setForm({ name: item.name, dosage: item.dosage || "", price: item.price }); setShow(true); };

  const save = async () => {
    if (!form.name || !form.price) { alert("Fill all fields ❌"); return; }
    if (editItem) {
      const res = await fetch(`${BASE}/api/medicine-prices/${editItem._id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form)
      });
      const data = await res.json();
      setPrices(prev => prev.map(p => p._id === editItem._id ? data : p));
    } else {
      const res = await fetch(`${BASE}/api/medicine-prices`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form)
      });
      const data = await res.json();
      setPrices(prev => [...prev, data]);
    }
    setShow(false);
  };

  const remove = async (id) => {
    await fetch(`${BASE}/api/medicine-prices/${id}`, { method: "DELETE" });
    setPrices(prev => prev.filter(p => p._id !== id));
  };

  return (
    <div>
      <SectionHeader title="Medicine Price List" action={
        <button className="btn-primary flex items-center gap-2" onClick={openAdd}><Plus size={14} /> Add Medicine</button>
      } />
      <Card>
        <Table headers={['Medicine Name', 'Dosage', 'Price (₹)', 'Actions']}>
          {prices.length === 0 && (
            <tr key="empty"><td colSpan={4} className="text-center py-8 text-sm text-slate-400 dark:text-slate-500">No medicines added yet</td></tr>
          )}
          {prices.map(item => (
            <tr key={item._id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
              <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">{item.name}</td>
              <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">{item.dosage || '—'}</td>
              <td className="px-4 py-3 font-mono font-bold text-slate-800 dark:text-slate-100">₹{item.price}</td>
              <td className="px-4 py-3 flex gap-3">
                <button onClick={() => openEdit(item)} className="text-blue-500 hover:text-blue-600"><Edit3 size={15} /></button>
                <button onClick={() => remove(item._id)} className="text-red-400 hover:text-red-600"><Trash2 size={15} /></button>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      {show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-sm shadow-lg border border-slate-100 dark:border-slate-700">
            <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">{editItem ? 'Edit Price' : 'Add Medicine'}</h2>
            <div className="flex flex-col gap-3">
              <input placeholder="Medicine Name" className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <input placeholder="Dosage (e.g. 500mg)" className="form-input" value={form.dosage} onChange={e => setForm({ ...form, dosage: e.target.value })} />
              <input placeholder="Price (₹)" type="number" className="form-input" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setShow(false)} className="btn-secondary">Cancel</button>
              <button onClick={save} className="btn-primary">{editItem ? 'Update' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────── Pharmacy Billing ─────────────── */
export function PharmacyBilling() {
  const [meds, setMeds] = useState([]);

  useEffect(() => {
    fetch(`${BASE}/api/medication/all`).then(r => r.json()).then(data => setMeds(Array.isArray(data) ? data : []));
  }, []);

  const dispensed = meds.filter(m => m.dispensed);
  const pending = meds.filter(m => !m.dispensed);
  const totalRevenue = dispensed.reduce((sum, m) => sum + (m.price || 0), 0);

  return (
    <div>
      <SectionHeader title="Pharmacy Billing" />
      <div className="grid grid-cols-3 gap-4 mb-5">
        <StatCard title="Total Dispensed" value={dispensed.length} icon={CheckCircle} color="green" />
        <StatCard title="Pending" value={pending.length} icon={AlertTriangle} color="amber" />
        <StatCard title="Total Revenue" value={`₹${totalRevenue}`} icon={CreditCard} color="blue" />
      </div>
      <Card>
        <Table headers={['Patient', 'Medicine', 'Dosage', 'Doctor', 'Price', 'Date', 'Status']}>
          {meds.length === 0 && (
            <tr key="empty"><td colSpan={7} className="text-center py-8 text-sm text-slate-400 dark:text-slate-500">No records found</td></tr>
          )}
          {meds.map(m => (
            <tr key={m._id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
              <td className="px-4 py-3 font-semibold text-sm text-slate-800 dark:text-slate-100">{m.patientId}</td>
              <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{m.medicineName}</td>
              <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">{m.dosage}</td>
              <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">{m.doctorName || m.doctorId}</td>
              <td className="px-4 py-3 font-mono font-bold text-slate-800 dark:text-slate-100">
                {m.dispensed ? `₹${m.price}` : '—'}
              </td>
              <td className="px-4 py-3 text-xs text-slate-400 dark:text-slate-500">{new Date(m.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                <Badge variant={m.dispensed ? 'green' : 'yellow'}>{m.dispensed ? 'Dispensed' : 'Pending'}</Badge>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}

