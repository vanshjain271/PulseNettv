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
      <SectionHeader title="Pharmacy Dashboard" subtitle="Overview of all prescriptions" />
      <Card title="Pending Dispensing">
        <Table headers={['Patient ID', 'Medicine', 'Dosage', 'Status']}>
          {meds?.filter(m => (m?.status ?? "") === "Pending").filter(Boolean).map(m => (
            <tr key={m?._id ?? Math.random()}>
              <td className="font-mono text-xs">{m?.patientId ?? "N/A"}</td>
              <td className="font-semibold">{m?.medicineName ?? "N/A"}</td>
              <td>{m?.dosage ?? "N/A"}</td>
              <td><Badge variant="yellow">{m?.status ?? "Pending"}</Badge></td>
            </tr>
          ))}
        </Table>
        {meds.length === 0 && <p className="p-4 text-center text-slate-400">No prescriptions in queue.</p>}
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
  return (
    <div>
      <SectionHeader title="Medicine Inventory" />
      <Card>
        <div className="p-8 text-center text-slate-500">
          Inventory management system is under maintenance. Please check back later.
        </div>
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
        <div className="p-8 text-center text-slate-500">
          Billing module for pharmacy is currently being integrated with the main system.
        </div>
      </Card>
    </div>
  );
}