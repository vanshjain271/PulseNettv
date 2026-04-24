import React, { useState, useEffect } from 'react';
import BASE from '../../config';
import { Card, Table, Badge, SectionHeader } from '../../components/ui';

/* ================= DASHBOARD ================= */
export function PatientDashboard() {
  const [admission, setAdmission] = useState(null);
  const [bill, setBill] = useState([]);
  const [meds, setMeds] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user?.id) return;

    Promise.all([
      fetch(`${BASE}/api/admission/${user.id}`).then(r => r.json()),
      fetch(`${BASE}/api/bill/${user.id}`).then(r => r.json()),
      fetch(`${BASE}/api/medication/${user.id}`).then(r => r.json())
    ])
      .then(([ad, bills, medications]) => {
        setAdmission(ad);
        setBill(bills || []);
        setMeds(medications || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));

  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <SectionHeader title="Patient Dashboard" />

      <Card>
        <p>Room: {admission?.roomNumber ?? "N/A"}</p>
        <p>Doctor: {admission?.doctorName ?? "N/A"}</p>
        <p>Total Bills: ₹{bill?.reduce((a, b) => a + (b?.amount ?? 0), 0) ?? 0}</p>
        <p>Medications: {meds?.length ?? 0}</p>
      </Card>
    </div>
  );
}

/* ================= MEDICATIONS ================= */
export function PatientMedications() {
  const [meds, setMeds] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user?.id) return;

    fetch(`${BASE}/api/medication/${user.id}`)
      .then(r => r.json())
      .then(setMeds)
      .catch(console.error);
  }, []);

  return (
    <Card>
      <SectionHeader title="My Medications" />
      <Table headers={["Medicine", "Status"]}>
        {meds?.filter(Boolean).map(m => (
          <tr key={m?._id ?? Math.random()}>
            <td>{m?.medicineName ?? "N/A"}</td>
            <td><Badge>{m?.status ?? "N/A"}</Badge></td>
          </tr>
        ))}
      </Table>
    </Card>
  );
}

/* ================= ADMISSION ================= */
export function AdmissionDetails() {
  const [data, setData] = useState(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user?.id) return;

    fetch(`${BASE}/api/admission/${user.id}`)
      .then(r => r.json())
      .then(setData);
  }, []);

  return (
    <Card>
      <SectionHeader title="Admission Details" />
      {data ? (
        <>
          <p>Room: {data?.roomNumber ?? "N/A"}</p>
          <p>Doctor: {data?.doctorName ?? "N/A"}</p>
          <p>Diagnosis: {data?.diagnosis ?? "N/A"}</p>
        </>
      ) : <p>No admission found</p>}
    </Card>
  );
}

/* ================= FORM ================= */
export function AdmissionForm() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      patientId: user?.id ?? "N/A",
      roomNumber: e.target.room?.value ?? "",
      diagnosis: e.target.diagnosis?.value ?? ""
    };

    await fetch(`${BASE}/api/admission`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    alert("Submitted!");
  };

  return (
    <Card>
      <SectionHeader title="Admission Form" />
      <form onSubmit={handleSubmit}>
        <input name="room" placeholder="Room" required />
        <input name="diagnosis" placeholder="Diagnosis" required />
        <button type="submit">Submit</button>
      </form>
    </Card>
  );
}

/* ================= BILLS ================= */
export function PatientBills() {
  const [bills, setBills] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user?.id) return;

    fetch(`${BASE}/api/bill/${user.id}`)
      .then(r => r.json())
      .then(setBills);
  }, []);

  return (
    <Card>
      <SectionHeader title="My Bills" />
      <Table headers={["Amount", "Date"]}>
        {bills?.filter(Boolean).map(b => (
          <tr key={b?._id ?? Math.random()}>
            <td>₹{b?.amount ?? 0}</td>
            <td>{b?.createdAt ? new Date(b.createdAt).toLocaleDateString() : "N/A"}</td>
          </tr>
        ))}
      </Table>
    </Card>
  );
}