import React, { useState, useEffect } from 'react';
import BASE from '../../config';
import { StatCard, Card, Table, Badge, SectionHeader } from '../../components/ui';

export function DoctorDashboard() {
  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const doctorId = user.id;

  useEffect(() => {
    if (!doctorId) return;

    fetch(`${BASE}/api/admission/doctor/${doctorId}`)
      .then(res => res.json())
      .then(setPatients);

    fetch(`${BASE}/api/medication/doctor/${doctorId}`)
      .then(res => res.json())
      .then(setPrescriptions);

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
