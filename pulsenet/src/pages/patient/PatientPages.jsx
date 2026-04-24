import React, { useState, useEffect } from 'react';
import BASE from '../../config';
import { StatCard, Card, Table, Badge, FormField, Input, Select, Textarea, SectionHeader } from '../../components/ui';
import { Pill, BedDouble, CreditCard, AlertCircle, User } from 'lucide-react';

export function PatientDashboard() {
  const [admission, setAdmission] = useState(null);
  const [bill, setbill] = useState([]);
  const [meds, setMeds] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);

    fetch(`${BASE}/api/admission/${u.id}`).then(res => res.json()).then(setAdmission);
    fetch(`${BASE}/api/bill/${u.id}`).then(res => res.json()).then(setbill);
    fetch(`${BASE}/api/medication/${u.id}`).then(res => res.json()).then(setMeds);

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

/* -------- Reports FIX -------- */
export function PatientReports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    if (!u?.id) return;

    fetch(`${BASE}/api/report/patient/${u.id}`)
      .then(res => res.json())
      .then(setReports);
  }, []);

  return (
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
                <a href={`${BASE}/uploads/${r.fileUrl}`} target="_blank">
                  View PDF
                </a>
              )}
            </td>
          </tr>
        ))}
      </Table>
    </Card>
  );
}
