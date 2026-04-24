import React, { useState, useEffect } from 'react';
import BASE from '../../config';
import { Card, Table, SectionHeader, Badge } from '../../components/ui';

/* ================= Dashboard ================= */
export function DoctorDashboard() {
  const [patients, setPatients] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const doctorId = user.id;

  useEffect(() => {
    if (!doctorId) return;
    fetch(`${BASE}/api/admission/doctor/${doctorId}`)
      .then(res => res.json())
      .then(setPatients)
      .catch(err => console.error("Patients fetch error:", err));
  }, [doctorId]);

  return (
    <div>
      <SectionHeader title="Doctor Dashboard" subtitle={`Welcome, ${user.fullname}`} />
      <Card title="Recent Admissions">
        <Table headers={['Patient ID', 'Room', 'Diagnosis', 'Status']}>
          {patients?.slice(0, 5).filter(Boolean).map(p => (
            <tr key={p?._id ?? Math.random()}>
              <td className="font-mono text-xs">{p?.patientId ?? "N/A"}</td>
              <td>{p?.roomNumber ?? "N/A"}</td>
              <td className="text-sm">{p?.chiefComplaint ?? "N/A"}</td>
              <td><Badge variant="green">Active</Badge></td>
            </tr>
          ))}
        </Table>
        {patients.length === 0 && <p className="p-4 text-center text-slate-400">No active patients found.</p>}
      </Card>
    </div>
  );
}

/* ================= Patients Page ================= */
export function DoctorPatients() {
  const [patients, setPatients] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user.id) return;
    fetch(`${BASE}/api/admission/doctor/${user.id}`)
      .then(res => res.json())
      .then(setPatients)
      .catch(err => console.error("Patients fetch error:", err));
  }, []);

  return (
    <div>
      <SectionHeader title="My Patients" subtitle={`Patients assigned to Dr. ${user.fullname}`} />
      <Card>
        <Table headers={['ID', 'Room', 'Admission Date', 'Diagnosis']}>
          {patients?.filter(Boolean).map(p => (
            <tr key={p?._id ?? Math.random()}>
              <td className="font-mono text-xs">{p?.patientId ?? "N/A"}</td>
              <td>{p?.roomNumber ?? "N/A"}</td>
              <td className="text-xs">{p?.admissionDate ? new Date(p.admissionDate).toLocaleDateString() : "N/A"}</td>
              <td className="text-sm">{p?.chiefComplaint ?? "N/A"}</td>
            </tr>
          ))}
        </Table>
        {patients.length === 0 && <p className="p-4 text-center text-slate-400">No patients assigned yet.</p>}
      </Card>
    </div>
  );
}

/* ================= Prescriptions Page ================= */
export function DoctorPrescriptions() {
  const [meds, setMeds] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [formData, setFormData] = useState({
    patientId: "", medicineName: "", dosage: "", frequency: "", instructions: "", time: "", status: "pending"
  });

  useEffect(() => {
    if (!user.id) return;
    // Fetch prescriptions
    fetch(`${BASE}/api/medication/doctor/${user.id}`)
      .then(res => res.json())
      .then(setMeds);
    
    // Fetch assigned patients for the dropdown
    fetch(`${BASE}/api/admission/doctor/${user.id}`)
      .then(res => res.json())
      .then(setPatients);
  }, []);

  const handlePrescribe = async () => {
    if (!formData.patientId || !formData.medicineName) {
      alert("Please select a patient and medicine name ❌");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/api/medication/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, doctorId: user.id, doctorName: user.fullname })
      });
      if (res.ok) {
        const newMed = await res.json();
        setMeds([newMed.data, ...meds]);
        setShowForm(false);
        setFormData({ patientId: "", medicineName: "", dosage: "", frequency: "", instructions: "", time: "", status: "pending" });
        alert("Prescription added ✅");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SectionHeader title="Prescriptions" action={
        <button className="btn-primary" onClick={() => setShowForm(true)}>+ New Prescription</button>
      } />
      
      {showForm && (
        <Card className="mb-6 p-5 border-blue-100 bg-blue-50/30">
          <h3 className="font-bold mb-4">Prescribe Medication</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Patient</label>
              <select name="patientId" value={formData.patientId} onChange={(e) => setFormData({...formData, patientId: e.target.value})} className="form-input w-full">
                <option value="">Select Patient</option>
                {patients?.map(p => <option key={p.patientId} value={p.patientId}>{p.patientId}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Medicine</label>
              <input placeholder="Name" value={formData.medicineName} onChange={(e) => setFormData({...formData, medicineName: e.target.value})} className="form-input w-full" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Dosage</label>
              <input placeholder="e.g. 500mg" value={formData.dosage} onChange={(e) => setFormData({...formData, dosage: e.target.value})} className="form-input w-full" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Time</label>
              <input type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} className="form-input w-full" />
            </div>
          </div>
          <div className="flex gap-2 mt-4 justify-end">
            <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            <button className="btn-primary" onClick={handlePrescribe} disabled={loading}>{loading ? "Saving..." : "Save Prescription"}</button>
          </div>
        </Card>
      )}

      <Card>
        <Table headers={['Patient ID', 'Medicine', 'Dosage', 'Status']}>
          {meds?.filter(Boolean).map(m => (
            <tr key={m?._id ?? Math.random()}>
              <td className="font-mono text-xs">{m?.patientId ?? "N/A"}</td>
              <td className="font-semibold">{m?.medicineName ?? "N/A"}</td>
              <td>{m?.dosage ?? "N/A"}</td>
              <td><Badge variant={m?.status === 'pending' ? 'yellow' : 'green'}>{m?.status ?? "Pending"}</Badge></td>
            </tr>
          ))}
        </Table>
        {meds.length === 0 && <p className="p-4 text-center text-slate-400">No prescriptions found.</p>}
      </Card>
    </div>
  );
}