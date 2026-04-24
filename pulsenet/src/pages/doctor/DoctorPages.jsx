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
      .then(setPatients);
  }, []);

  return (
    <div>
      <SectionHeader title="My Patients" />
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
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user.id) return;
    fetch(`${BASE}/api/medication/doctor/${user.id}`)
      .then(res => res.json())
      .then(setMeds);
  }, []);

  return (
    <div>
      <SectionHeader title="My Prescriptions" />
      <Card>
        <Table headers={['Patient ID', 'Medicine', 'Dosage', 'Status']}>
          {meds?.filter(Boolean).map(m => (
            <tr key={m?._id ?? Math.random()}>
              <td className="font-mono text-xs">{m?.patientId ?? "N/A"}</td>
              <td className="font-semibold">{m?.medicineName ?? "N/A"}</td>
              <td>{m?.dosage ?? "N/A"}</td>
              <td><Badge>{m?.status ?? "Pending"}</Badge></td>
            </tr>
          ))}
        </Table>
        {meds.length === 0 && <p className="p-4 text-center text-slate-400">No prescriptions found.</p>}
      </Card>
    </div>
  );
}