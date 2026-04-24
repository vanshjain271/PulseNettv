import React, { useState, useEffect } from 'react';
import BASE from '../../config';
import { Card, Table, SectionHeader } from '../../components/ui';

/* ================= Dashboard ================= */
export function DoctorDashboard() {
  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const doctorId = user.id;

  useEffect(() => {
    if (!doctorId) return;

    fetch(`${BASE}/api/admission/doctor/${doctorId}`)
      .then(res => res.json())
      .then(setPatients)
      .catch(err => console.error("Patients fetch error:", err));

    fetch(`${BASE}/api/medication/doctor/${doctorId}`)
      .then(res => res.json())
      .then(setPrescriptions)
      .catch(err => console.error("Prescriptions fetch error:", err));

  }, [doctorId]);

  return (
    <div>
      <SectionHeader title="Doctor Dashboard" subtitle={`Welcome, ${user.fullname}`} />

      <Card title="My Patients">
        <Table headers={['Patient', 'Room', 'Diagnosis']}>
          {patients.map(p => (
            <tr key={p._id}>
              <td>{p.patientId}</td>
              <td>{p.roomNumber}</td>
              <td>{p.diagnosis}</td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}

/* ================= Patients Page ================= */
export function DoctorPatients() {
  return (
    <div>
      <SectionHeader title="Doctor Patients" />
      <Card>
        <p className="p-4">Patients page working ✅</p>
      </Card>
    </div>
  );
}

/* ================= Prescriptions Page ================= */
export function DoctorPrescriptions() {
  return (
    <div>
      <SectionHeader title="Doctor Prescriptions" />
      <Card>
        <p className="p-4">Prescriptions page working ✅</p>
      </Card>
    </div>
  );
}