import React, { useState, useEffect } from 'react';
import BASE from '../../config';
import { StatCard, Card, Table, Badge, FormField, Input, SectionHeader } from '../../components/ui';
import { TestTube2, FileText, CreditCard, Clock, CheckCircle, Upload } from 'lucide-react';

/* ================= Dashboard ================= */
export function LabDashboard() {
  const [reports, setReports] = useState([]);
  const [patients, setPatients] = useState([]);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({ patientId: "", testName: "", result: "" });
  const [loading, setLoading] = useState(false);

  const fetchReports = () => {
    fetch(`${BASE}/api/report`)
      .then(res => res.json())
      .then(setReports)
      .catch(err => console.error("Reports fetch error:", err));
  };

  useEffect(() => {
    fetch(`${BASE}/api/admission-form`)
      .then(res => res.json())
      .then(setPatients);
    fetchReports();
  }, []);

  const submitReport = async () => {
    if (!form.patientId || !form.testName || !file) {
      alert("Please fill all fields and select a file ❌");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("patientId", form.patientId);
    formData.append("testName", form.testName);
    formData.append("result", form.result);
    formData.append("file", file);

    try {
      const res = await fetch(`${BASE}/api/report/upload`, {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        alert("Report Uploaded ✅");
        setForm({ patientId: "", testName: "", result: "" });
        setFile(null);
        fetchReports();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SectionHeader title="Laboratory Dashboard" subtitle="Upload and manage reports" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card title="Upload Report" className="lg:col-span-1">
          <div className="p-4 space-y-4">
            <div>
              <label className="text-xs text-slate-500">Patient</label>
              <select className="w-full border rounded-md p-2 text-sm" value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })}>
                <option value="">Select Patient</option>
                {patients?.map(p => <option key={p._id} value={p.patientId}>{p.patientId}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500">Test Name</label>
              <input className="w-full border rounded-md p-2 text-sm" placeholder="Blood Test / X-Ray" value={form.testName} onChange={(e) => setForm({ ...form, testName: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-slate-500">Result</label>
              <textarea className="w-full border rounded-md p-2 text-sm" placeholder="Enter result..." value={form.result} onChange={(e) => setForm({ ...form, result: e.target.value })} />
            </div>
            <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} className="text-xs" />
            <button onClick={submitReport} disabled={loading} className="btn-primary w-full">{loading ? "Uploading..." : "Upload Report"}</button>
          </div>
        </Card>

        <Card title="Recent Reports" className="lg:col-span-2">
          <Table headers={['Patient', 'Test', 'Result', 'Status', 'Date']}>
            {reports?.slice(0, 8).map(r => (
              <tr key={r._id}>
                <td className="font-semibold">{r.patientId}</td>
                <td>{r.testName}</td>
                <td className="text-xs text-slate-500">{r.result}</td>
                <td><Badge variant="green">{r.status}</Badge></td>
                <td className="text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </Table>
          {reports.length === 0 && <p className="p-4 text-center text-slate-400">No reports found.</p>}
        </Card>
      </div>
    </div>
  );
}

export function LabReports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetch(`${BASE}/api/report`)
      .then(res => res.json())
      .then(setReports);
  }, []);

  return (
    <div>
      <SectionHeader title="Full Reports Log" />
      <Card>
        <Table headers={['Patient', 'Test Name', 'Date', 'Status', 'Action']}>
          {reports?.map(r => (
            <tr key={r._id}>
              <td className="font-semibold">{r.patientId}</td>
              <td>{r.testName}</td>
              <td className="text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</td>
              <td><Badge variant="green">{r.status}</Badge></td>
              <td>
                <a href={`${BASE}/uploads/${r.fileUrl}`} target="_blank" rel="noreferrer" className="text-blue-500 text-xs font-bold">View PDF</a>
              </td>
            </tr>
          ))}
        </Table>
        {reports.length === 0 && <p className="p-4 text-center text-slate-400">No reports found.</p>}
      </Card>
    </div>
  );
}

export function LabBilling() {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    fetch(`${BASE}/api/bill`)
      .then(res => res.json())
      .then(setBills);
  }, []);

  const totalBilled = bills.reduce((sum, b) => sum + (b.amount || 0), 0);

  return (
    <div>
      <SectionHeader title="Lab Billing Overview" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <StatCard title="Total Lab Revenue" value={`₹${totalBilled}`} icon={CreditCard} color="blue" />
        <StatCard title="Active Bills" value={bills.length} icon={Clock} color="amber" />
        <StatCard title="Ready for Collection" value={bills.filter(b => b.status === "unpaid").length} icon={CheckCircle} color="green" />
      </div>
      <Card>
        <Table headers={['Patient', 'Amount', 'Status', 'Date']}>
          {bills?.map(b => (
            <tr key={b._id}>
              <td className="font-semibold">{b.patientId}</td>
              <td className="font-mono font-bold">₹{b.amount}</td>
              <td><Badge variant={b.status === 'paid' ? 'green' : 'yellow'}>{b.status}</Badge></td>
              <td className="text-xs text-slate-400">{new Date(b.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </Table>
        {bills.length === 0 && <p className="p-4 text-center text-slate-400">No billing data found.</p>}
      </Card>
    </div>
  );
}


