import React, { useState, useEffect } from 'react';
import BASE from '../../config';
import { StatCard, Card, Table, Badge, SectionHeader } from '../../components/ui';
import { BedDouble, CreditCard, AlertCircle, User } from 'lucide-react';

/* ================= Dashboard ================= */
export function PatientDashboard() {
  const [admission, setAdmission] = useState(null);
  const [bill, setBill] = useState([]);
  const [meds, setMeds] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      setUser(u);

      if (u?.id) {
        fetch(`${BASE}/api/admission/${u.id}`)
          .then(res => res.json())
          .then(setAdmission)
          .catch(err => console.error("Admission fetch error:", err));

        fetch(`${BASE}/api/bill/${u.id}`)
          .then(res => res.json())
          .then(setBill)
          .catch(err => console.error("Bill fetch error:", err));

        fetch(`${BASE}/api/medication/${u.id}`)
          .then(res => res.json())
          .then(setMeds)
          .catch(err => console.error("Meds fetch error:", err));
      }
    } catch (err) {
      console.error("User parse error:", err);
    }
  }, []);

  const days = admission
    ? Math.ceil((new Date() - new Date(admission.admissionDate)) / (1000 * 60 * 60 * 24))
    : 0;

  const totalBill = bill.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div>
      <SectionHeader title="My Dashboard" subtitle={`Welcome back, ${user?.fullname}`} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Room No." value={admission?.roomNumber} icon={BedDouble} />
        <StatCard title="Doctor" value={admission?.doctorName} icon={User} />
        <StatCard title="Days" value={days} icon={AlertCircle} />
        <StatCard title="Bill" value={`₹${totalBill}`} icon={CreditCard} />
      </div>
    </div>
  );
}

/* ================= Reports ================= */
export function PatientReports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      if (!u?.id) return;

      fetch(`${BASE}/api/report/patient/${u.id}`)
        .then(res => res.json())
        .then(setReports)
        .catch(err => console.error("Reports fetch error:", err));
    } catch (err) {
      console.error("User parse error:", err);
    }
  }, []);

  return (
    <div>
      <SectionHeader title="My Reports" />
      <Card>
        <Table headers={["Patient", "Test", "Date", "Status", "Report"]}>
          {reports.map(r => (
            <tr key={r._id}>
              <td>{r.patientId}</td>
              <td>{r.testName}</td>
              <td>{new Date(r.createdAt).toLocaleDateString()}</td>
              <td><Badge>{r.status}</Badge></td>
              <td>
                {r.fileUrl && (
                  <a href={`${BASE}/uploads/${r.fileUrl}`} target="_blank" rel="noreferrer">
                    View PDF
                  </a>
                )}
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}

/* ================= Medications ================= */
export function PatientMedications() {
  return (
    <div>
      <SectionHeader title="Patient Medications" />
      <Card>
        <p className="p-4">Medications page working ✅</p>
      </Card>
    </div>
  );
}

/* ================= Admission Details ================= */
export function AdmissionDetails() {
  return (
    <div>
      <SectionHeader title="Admission Details" />
      <Card>
        <p className="p-4">Admission details page working ✅</p>
      </Card>
    </div>
  );
}

/* ================= Admission Form ================= */
export function AdmissionForm() {
  return (
    <div>
      <SectionHeader title="Admission Form" />
      <Card>
        <p className="p-4">Admission form page working ✅</p>
      </Card>
    </div>
  );
}

/* ================= Bills ================= */
export function PatientBills() {
  return (
    <div>
      <SectionHeader title="Patient Bills" />
      <Card>
        <p className="p-4">Billing page working ✅</p>
      </Card>
    </div>
  );
}