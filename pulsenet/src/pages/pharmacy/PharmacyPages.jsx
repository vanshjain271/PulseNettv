import React, { useState, useEffect } from 'react';
import BASE from '../../config';
import { Card, Table, SectionHeader, Badge } from '../../components/ui';

/* ================= Dashboard ================= */
export function PharmacyDashboard() {
  const [meds, setMeds] = useState([]);

  useEffect(() => {
    fetch(`${BASE}/api/medication/all`)
      .then(r => r.json())
      .then(setMeds)
      .catch(err => console.error("Meds fetch error:", err));
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

/* ================= Prescriptions ================= */
export function PharmacyPrescriptions() {
  return (
    <div>
      <SectionHeader title="Pharmacy Prescriptions" />
      <Card>
        <p className="p-4">Prescriptions page working ✅</p>
      </Card>
    </div>
  );
}

/* ================= Inventory ================= */
export function MedicineInventory() {
  return (
    <div>
      <SectionHeader title="Medicine Inventory" />
      <Card>
        <p className="p-4">Inventory page working ✅</p>
      </Card>
    </div>
  );
}

/* ================= Billing ================= */
export function PharmacyBilling() {
  return (
    <div>
      <SectionHeader title="Pharmacy Billing" />
      <Card>
        <p className="p-4">Billing page working ✅</p>
      </Card>
    </div>
  );
}