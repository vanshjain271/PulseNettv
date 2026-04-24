import React, { useState, useEffect } from 'react';
import BASE from '../../config';
import { Card, Table, SectionHeader, Badge } from '../../components/ui';

/* ================= Dashboard ================= */
export function PharmacyDashboard() {
  const [meds, setMeds] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMeds = () => {
    fetch(`${BASE}/api/medication/all`)
      .then(r => r.json())
      .then(setMeds)
      .catch(err => console.error("Meds fetch error:", err));
  };

  useEffect(() => {
    fetchMeds();
  }, []);

  const handleDispense = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/api/medication/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Given", dispensed: true })
      });
      if (res.ok) {
        alert("Medication dispensed ✅");
        fetchMeds();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SectionHeader title="Pharmacy Dashboard" subtitle="Overview of all prescriptions" />
      <Card title="Pending Dispensing">
        <Table headers={['Patient ID', 'Medicine', 'Dosage', 'Action']}>
          {meds?.filter(m => (m?.status ?? "") === "pending").filter(Boolean).map(m => (
            <tr key={m?._id ?? Math.random()}>
              <td className="font-mono text-xs">{m?.patientId ?? "N/A"}</td>
              <td className="font-semibold">{m?.medicineName ?? "N/A"}</td>
              <td>{m?.dosage ?? "N/A"}</td>
              <td>
                <button 
                  onClick={() => handleDispense(m._id)}
                  disabled={loading}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                >
                  Dispense
                </button>
              </td>
            </tr>
          ))}
        </Table>
        {meds.filter(m => m.status === "pending").length === 0 && <p className="p-4 text-center text-slate-400">No prescriptions in queue.</p>}
      </Card>
    </div>
  );
}

/* ================= Prescriptions ================= */
export function PharmacyPrescriptions() {
  const [meds, setMeds] = useState([]);

  useEffect(() => {
    fetch(`${BASE}/api/medication/all`)
      .then(r => r.json())
      .then(setMeds);
  }, []);

  return (
    <div>
      <SectionHeader title="All Prescriptions" />
      <Card>
        <Table headers={['Patient ID', 'Medicine', 'Dosage', 'Time', 'Status']}>
          {meds?.filter(Boolean).map(m => (
            <tr key={m?._id ?? Math.random()}>
              <td className="font-mono text-xs">{m?.patientId ?? "N/A"}</td>
              <td>{m?.medicineName ?? "N/A"}</td>
              <td>{m?.dosage ?? "N/A"}</td>
              <td className="text-xs text-slate-500">{m?.time ?? "N/A"}</td>
              <td><Badge variant={(m?.status ?? "") === "Given" ? "green" : "yellow"}>{m?.status ?? "Pending"}</Badge></td>
            </tr>
          ))}
        </Table>
        {meds.length === 0 && <p className="p-4 text-center text-slate-400">No data found.</p>}
      </Card>
    </div>
  );
}

/* ================= Inventory ================= */
export function MedicineInventory() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", stock: "", unit: "mg", expiryDate: "" });

  const fetchItems = () => {
    fetch(`${BASE}/api/inventory`)
      .then(r => r.json())
      .then(setItems);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = async () => {
    const res = await fetch(`${BASE}/api/inventory`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem)
    });
    if (res.ok) {
      alert("Item added ✅");
      setShowForm(false);
      setNewItem({ name: "", stock: "", unit: "mg", expiryDate: "" });
      fetchItems();
    }
  };

  return (
    <div>
      <SectionHeader title="Medicine Inventory" action={
        <button className="btn-primary" onClick={() => setShowForm(true)}>+ Add Stock</button>
      } />
      
      {showForm && (
        <Card className="mb-6 p-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <input placeholder="Medicine Name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="form-input" />
            <input placeholder="Stock Qty" type="number" value={newItem.stock} onChange={e => setNewItem({...newItem, stock: e.target.value})} className="form-input" />
            <input placeholder="Expiry (YYYY-MM-DD)" value={newItem.expiryDate} onChange={e => setNewItem({...newItem, expiryDate: e.target.value})} className="form-input" />
            <div className="flex gap-2">
              <button onClick={handleAdd} className="btn-primary flex-1">Save</button>
              <button onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <Table headers={['Name', 'Stock', 'Expiry', 'Status']}>
          {items?.map(i => (
            <tr key={i._id}>
              <td className="font-semibold">{i.name}</td>
              <td>{i.stock} {i.unit}</td>
              <td className="text-xs text-slate-500">{i.expiryDate}</td>
              <td><Badge variant={i.stock < 10 ? 'red' : 'green'}>{i.stock < 10 ? 'Low Stock' : 'In Stock'}</Badge></td>
            </tr>
          ))}
        </Table>
        {items.length === 0 && <p className="p-4 text-center text-slate-400">Inventory is empty.</p>}
      </Card>
    </div>
  );
}

/* ================= Billing ================= */
export function PharmacyBilling() {
  const [prices, setPrices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newPrice, setNewPrice] = useState({ name: "", price: "" });

  const fetchPrices = () => {
    fetch(`${BASE}/api/medicine-prices`)
      .then(r => r.json())
      .then(setPrices);
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const handleAdd = async () => {
    const res = await fetch(`${BASE}/api/medicine-prices`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPrice)
    });
    if (res.ok) {
      alert("Price set ✅");
      setShowForm(false);
      setNewPrice({ name: "", price: "" });
      fetchPrices();
    }
  };

  return (
    <div>
      <SectionHeader title="Medicine Pricing" action={
        <button className="btn-primary" onClick={() => setShowForm(true)}>+ Set Price</button>
      } />

      {showForm && (
        <Card className="mb-6 p-5">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <input placeholder="Medicine Name" value={newPrice.name} onChange={e => setNewPrice({...newPrice, name: e.target.value})} className="form-input" />
            <input placeholder="Price (₹)" type="number" value={newPrice.price} onChange={e => setNewPrice({...newPrice, price: e.target.value})} className="form-input" />
            <div className="flex gap-2">
              <button onClick={handleAdd} className="btn-primary flex-1">Save</button>
              <button onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <Table headers={['Medicine Name', 'Price (₹)', 'Action']}>
          {prices?.map(p => (
            <tr key={p._id}>
              <td className="font-semibold">{p.name}</td>
              <td className="font-mono">₹{p.price}</td>
              <td><button className="text-red-500 text-xs">Delete</button></td>
            </tr>
          ))}
        </Table>
        {prices.length === 0 && <p className="p-4 text-center text-slate-400">No price records found.</p>}
      </Card>
    </div>
  );
}