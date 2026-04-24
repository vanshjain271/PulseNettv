import React, { useState, useEffect } from 'react';
import BASE from '../../config';
import { StatCard, Card, Table, Badge, SectionHeader } from '../../components/ui';

export function PharmacyDashboard() {
  const [meds, setMeds] = useState([]);

  useEffect(() => {
    fetch(`${BASE}/api/medication/all`)
      .then(r => r.json())
      .then(setMeds);
  }, []);

  return (
    <div>
      <SectionHeader title="Pharmacy Dashboard" />

      <Card>
        <Table headers={['Patient', 'Medicine', 'Status']}>
          {meds.map(m => (
            <tr key={m._id}>
              <td>{m.patientId}</td>
              <td>{m.medicineName}</td>
              <td><Badge>{m.status}</Badge></td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
