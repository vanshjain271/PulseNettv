import React from 'react';
import BASE from '../../config';
import { useState, useEffect } from 'react';
import { StatCard, Card, Table, Badge, FormField, Input, SectionHeader } from '../../components/ui';
import { TestTube2, FileText, CreditCard, Clock, CheckCircle, Upload } from 'lucide-react';



export function LabDashboard() {

  const [reports, setReports] = useState([]);
  const [patients, setPatients] = useState([]);
  const [file, setFile] = useState(null);
  const submitReport = async () => {

  const formData = new FormData();

  formData.append("patientId", form.patientId);
  formData.append("testName", form.testName);
  formData.append("result", form.result);
  formData.append("file", file);

  await fetch("`${BASE}/api/report/upload", {
    method: "POST",
    body: formData
  });

  alert("Report Uploaded ✅");
};
  const [form, setForm] = useState({
    patientId: "",
    testName: "",
    result: ""
  });

  // 🔥 fetch patients
  useEffect(() => {
    fetch("`${BASE}/api/admission-form")
      .then(res => res.json())
      .then(setPatients);
  }, []);

  // 🔥 fetch reports
  

  return (
    <div>

      <SectionHeader
        title="Laboratory Dashboard"
        subtitle="Upload and manage reports"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* 🔥 LEFT: FORM */}
        <Card title="Upload Report" className="lg:col-span-1">
          <div className="p-4 space-y-4">

            <div>
              <label className="text-xs text-slate-500">Patient</label>
              <select
                className="w-full border rounded-md p-2 text-sm"
                value={form.patientId}
                onChange={(e) =>
                  setForm({ ...form, patientId: e.target.value })
                }
              >
                <option value="">Select Patient</option>
                {patients.map(p => (
                  <option key={p._id} value={p.patientId}>
                    {p.patientId}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-500">Test Name</label>
              <input
                className="w-full border rounded-md p-2 text-sm"
                placeholder="Blood Test / X-Ray"
                value={form.testName}
                onChange={(e) =>
                  setForm({ ...form, testName: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-xs text-slate-500">Result</label>
              <textarea
                className="w-full border rounded-md p-2 text-sm"
                placeholder="Enter result..."
                value={form.result}
                onChange={(e) =>
                  setForm({ ...form, result: e.target.value })
                }
              />
            </div>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <button onClick={submitReport} className="btn-primary w-full">
              Upload Report
            </button>

          </div>
        </Card>

        {/* 🔥 RIGHT: TABLE */}
        <Card title="Reports Queue" className="lg:col-span-2">
          <Table headers={['Patient', 'Test', 'Result', 'Status', 'Date']}>

            {reports.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-slate-400">
                  No reports available
                </td>
              </tr>
            )}

            {reports.map(r => (
              <tr key={r._id} className="hover:bg-slate-50">

                <td className="table-cell font-semibold">
                  {r.patientId}
                </td>

                <td className="table-cell">
                  {r.testName}
                </td>

                <td className="table-cell text-xs text-slate-500">
                  {r.result || "-"}
                </td>

                <td className="table-cell">
                  <Badge variant="green">
                    {r.status}
                  </Badge>
                </td>

                <td className="table-cell text-xs text-slate-400">
                  {new Date(r.createdAt).toLocaleDateString()}
                </td>

              </tr>
            ))}

          </Table>
        </Card>

      </div>
    </div>
  );
}


export function LabReports() {
  const reports = [
    { id: 'RPT-001', patient: 'Aarav Mehta', pid: 'PT-20041', test: 'Complete Blood Count', date: '2025-04-10', status: 'Ready' },
    { id: 'RPT-002', patient: 'Mohan Das', pid: 'PT-20045', test: 'ECG', date: '2025-04-09', status: 'Ready' },
  ];

  return (
    <div>
      <SectionHeader title="Lab Reports" action={<button className="btn-primary flex items-center gap-2"><Upload size={14} /> Upload Report</button>} />
      <Card>
        <Table headers={['Report ID', 'Patient', 'Test', 'Date', 'Status', 'Actions']}>
          {reports.map(r => (
            <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
              <td className="table-cell font-mono text-xs">{r.id}</td>
              <td className="table-cell">
                <p className="font-semibold text-sm">{r.patient}</p>
                <p className="text-xs text-slate-400">{r.pid}</p>
              </td>
              <td className="table-cell">{r.test}</td>
              <td className="table-cell text-xs text-slate-400">{r.date}</td>
              <td className="table-cell"><Badge variant="green">{r.status}</Badge></td>
              <td className="table-cell flex gap-2">
                <button className="text-pulse-500 text-xs font-semibold">View</button>
                <span className="text-slate-300">|</span>
                <button className="text-slate-500 text-xs font-semibold">Download</button>
              </td>
            </tr>
          ))}
        </Table>
        <div className="m-4 p-6 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center gap-2">
          <Upload size={24} className="text-slate-400" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Drop report files here or click to upload</p>
          <p className="text-xs text-slate-400">PDF, JPG, PNG up to 20MB</p>
          <button className="btn-secondary mt-1">Browse Files</button>
        </div>
      </Card>
    </div>
  );
}

export function LabBilling() {
  const labBills = [
    { id: 'LBL001', patient: 'Aarav Mehta', pid: 'PT-20041', test: 'Complete Blood Count', amount: 450, status: 'Paid' },
    { id: 'LBL002', patient: 'Neha Gupta', pid: 'PT-20042', test: 'Dengue NS1 Antigen', amount: 800, status: 'Pending' },
    { id: 'LBL003', patient: 'Ramesh Joshi', pid: 'PT-20043', test: 'HbA1c', amount: 600, status: 'Paid' },
    { id: 'LBL004', patient: 'Mohan Das', pid: 'PT-20045', test: 'ECG', amount: 350, status: 'Pending' },
  ];

  return (
    <div>
      <SectionHeader title="Lab Billing" />
      <div className="grid grid-cols-3 gap-4 mb-5">
        <StatCard title="Total Billed" value="₹2,200" icon={CreditCard} color="blue" />
        <StatCard title="Collected" value="₹1,050" icon={CheckCircle} color="green" />
        <StatCard title="Pending" value="₹1,150" icon={Clock} color="amber" />
      </div>
      <Card>
        <Table headers={['Bill ID', 'Patient', 'Test Name', 'Amount', 'Status', 'Action']}>
          {labBills.map(b => (
            <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
              <td className="table-cell font-mono text-xs">{b.id}</td>
              <td className="table-cell">
                <p className="font-semibold text-sm">{b.patient}</p>
                <p className="text-xs text-slate-400">{b.pid}</p>
              </td>
              <td className="table-cell">{b.test}</td>
              <td className="table-cell font-mono font-bold">₹{b.amount}</td>
              <td className="table-cell"><Badge variant={b.status === 'Paid' ? 'green' : 'yellow'}>{b.status}</Badge></td>
              <td className="table-cell">
                {b.status === 'Pending' && <button className="btn-primary py-1.5 text-xs">Collect Payment</button>}
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}

