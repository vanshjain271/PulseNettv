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
    ? Math.ceil((new Date() - new Date(admission?.admissionDate ?? new Date())) / (1000 * 60 * 60 * 24))
    : 0;

  const totalBill = bill?.reduce((sum, b) => sum + (b?.amount ?? 0), 0) ?? 0;

  return (
    <div>
      <SectionHeader title="My Dashboard" subtitle={`Welcome back, ${user?.fullname ?? "User"}`} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Room No." value={admission?.roomNumber ?? "N/A"} icon={BedDouble} />
        <StatCard title="Doctor" value={admission?.doctorName ?? "N/A"} icon={User} />
        <StatCard title="Days" value={days ?? 0} icon={AlertCircle} />
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
        .then(data => setReports(Array.isArray(data) ? data : []))
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
          {reports?.filter(Boolean).map(r => (
            <tr key={r?._id ?? Math.random()}>
              <td>{r?.patientId ?? "N/A"}</td>
              <td>{r?.testName ?? "N/A"}</td>
              <td>{r?.createdAt ? new Date(r.createdAt).toLocaleDateString() : "N/A"}</td>
              <td><Badge>{r?.status ?? "N/A"}</Badge></td>
              <td>
                {r?.fileUrl && (
                  <a href={`${BASE}/uploads/${r.fileUrl}`} target="_blank" rel="noreferrer">
                    View PDF
                  </a>
                )}
              </td>
            </tr>
          ))}
        </Table>
        {reports.length === 0 && <p className="p-4 text-center text-slate-400">No laboratory reports found.</p>}
      </Card>
    </div>
  );
}

/* ================= Medications ================= */
export function PatientMedications() {
  const [meds, setMeds] = useState([]);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    if (u?.id) {
      fetch(`${BASE}/api/medication/${u.id}`)
        .then(res => res.json())
        .then(setMeds)
        .catch(err => console.error("Meds fetch error:", err));
    }
  }, []);

  return (
    <div>
      <SectionHeader title="Patient Medications" />
      <Card>
        <Table headers={["Medicine", "Dosage", "Time", "Status"]}>
          {meds?.filter(Boolean).map(m => (
            <tr key={m?._id ?? Math.random()}>
              <td>{m?.medicineName ?? "N/A"}</td>
              <td>{m?.dosage ?? "N/A"}</td>
              <td>{m?.time ?? "N/A"}</td>
              <td><Badge>{m?.status ?? "Pending"}</Badge></td>
            </tr>
          ))}
        </Table>
        {meds.length === 0 && <p className="p-4 text-center text-slate-400">No medications prescribed yet.</p>}
      </Card>
    </div>
  );
}

/* ================= Admission Details ================= */
export function AdmissionDetails() {
  const [admission, setAdmission] = useState(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    if (u?.id) {
      fetch(`${BASE}/api/admission/${u.id}`)
        .then(res => res.json())
        .then(setAdmission)
        .catch(err => console.error("Admission fetch error:", err));
    }
  }, []);

  return (
    <div>
      <SectionHeader title="Admission Details" />
      <Card>
        {admission ? (
          <div className="p-5 space-y-4 text-slate-800 dark:text-slate-100">
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <p className="text-xs text-slate-500">Patient ID</p>
                 <p className="font-semibold">{admission?.patientId ?? "N/A"}</p>
               </div>
               <div>
                 <p className="text-xs text-slate-500">Room Number</p>
                 <p className="font-semibold">{admission?.roomNumber ?? "N/A"}</p>
               </div>
               <div>
                 <p className="text-xs text-slate-500">Doctor</p>
                 <p className="font-semibold">{admission?.doctorName ?? "N/A"}</p>
               </div>
               <div>
                 <p className="text-xs text-slate-500">Admission Date</p>
                 <p className="font-semibold">{admission?.admissionDate ? new Date(admission.admissionDate).toLocaleDateString() : "N/A"}</p>
               </div>
             </div>
             <div>
               <p className="text-xs text-slate-500">Chief Complaint</p>
               <p className="font-semibold">{admission?.chiefComplaint ?? "N/A"}</p>
             </div>
          </div>
        ) : (
          <p className="p-4 text-center text-slate-400">No active admission records found.</p>
        )}
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
        <div className="p-8 text-center space-y-4">
          <p className="text-slate-500">Admission request feature coming soon. Please contact the administrator for new admissions.</p>
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-500">
            <AlertCircle size={24} />
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ================= Bills ================= */
export function PatientBills() {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    if (u?.id) {
      fetch(`${BASE}/api/bill/${u.id}`)
        .then(res => res.json())
        .then(setBills)
        .catch(err => console.error("Bills fetch error:", err));
    }
  }, []);

  return (
    <div>
      <SectionHeader title="Patient Bills" />
      <Card>
        <Table headers={["ID", "Amount", "Status", "Date"]}>
          {bills?.filter(Boolean).map(b => (
            <tr key={b?._id ?? Math.random()}>
              <td className="font-mono text-xs">{b?._id ?? "N/A"}</td>
              <td className="font-bold">₹{b?.amount ?? 0}</td>
              <td><Badge variant={b?.status === 'paid' ? 'green' : 'yellow'}>{b?.status ?? "Pending"}</Badge></td>
              <td className="text-xs text-slate-500">{b?.createdAt ? new Date(b.createdAt).toLocaleDateString() : "N/A"}</td>
            </tr>
          ))}
        </Table>
        {bills.length === 0 && <p className="p-4 text-center text-slate-400">No billing records found.</p>}
      </Card>
    </div>
  );
}