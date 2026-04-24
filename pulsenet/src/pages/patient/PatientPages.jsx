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

        fetch(`${BASE}/api/bill/summary/${u.id}`)
          .then(res => res.json())
          .then(data => setBill(data))
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

  const totalBill = bill?.totalAmount ?? 0;

  return (
    <div>
      <div className="flex items-center gap-3">
        <SectionHeader title="My Dashboard" subtitle={`Welcome back, ${user?.fullname ?? "User"}`} />
        <Badge variant="blue">v2.0 Live Data</Badge>
      </div>

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
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    fullname: "", dob: "", age: "", gender: "", bloodGroup: "", phone: "", email: "", address: "",
    emergencyName: "", relationship: "", emergencyPhone: "", alternatePhone: "",
    conditions: "", surgeries: "", currentMedications: "", allergies: "",
    chiefComplaint: "", symptoms: "", duration: "", severity: ""
  });

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(u);
    if (u) {
      setFormData(prev => ({ ...prev, fullname: u.fullname || "", email: u.email || "", patientId: u.id || "" }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/api/admission-form/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, patientId: user?.id })
      });
      if (res.ok) {
        alert("Admission request submitted successfully! ✅");
        setStep(5); // Success step
      } else {
        const err = await res.json();
        alert(err.message || "Failed to submit form ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Network error ❌");
    } finally {
      setLoading(false);
    }
  };

  const next = () => setStep(s => s + 1);
  const prev = () => setStep(s => s - 1);

  return (
    <div className="max-w-2xl mx-auto">
      <SectionHeader title="Admission Request Form" subtitle={step < 5 ? `Step ${step} of 4` : "Submission Complete"} />
      
      <Card className="p-6">
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white border-b pb-2">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Full Name</label>
                <input name="fullname" value={formData.fullname} onChange={handleChange} className="form-input w-full" placeholder="Full Name" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Date of Birth</label>
                <input name="dob" type="date" value={formData.dob} onChange={handleChange} className="form-input w-full" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Age</label>
                <input name="age" type="number" value={formData.age} onChange={handleChange} className="form-input w-full" placeholder="Age" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="form-input w-full">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Blood Group</label>
                <input name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="form-input w-full" placeholder="e.g. O+" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Phone</label>
                <input name="phone" value={formData.phone} onChange={handleChange} className="form-input w-full" placeholder="Phone Number" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Address</label>
              <textarea name="address" value={formData.address} onChange={handleChange} className="form-input w-full" placeholder="Full Address" rows="2" />
            </div>
            <button onClick={next} className="btn-primary w-full py-3">Continue to Emergency Contact</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white border-b pb-2">Emergency Contact</h3>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Contact Name</label>
              <input name="emergencyName" value={formData.emergencyName} onChange={handleChange} className="form-input w-full" placeholder="Full Name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Relationship</label>
                <input name="relationship" value={formData.relationship} onChange={handleChange} className="form-input w-full" placeholder="e.g. Spouse, Parent" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Emergency Phone</label>
                <input name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange} className="form-input w-full" placeholder="Phone Number" />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={prev} className="btn-secondary flex-1 py-3">Back</button>
              <button onClick={next} className="btn-primary flex-1 py-3">Continue to Medical History</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white border-b pb-2">Medical History</h3>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Past Medical Conditions</label>
              <textarea name="conditions" value={formData.conditions} onChange={handleChange} className="form-input w-full" placeholder="Any chronic illnesses?" rows="2" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Current Medications</label>
              <textarea name="currentMedications" value={formData.currentMedications} onChange={handleChange} className="form-input w-full" placeholder="What are you currently taking?" rows="2" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Allergies</label>
              <input name="allergies" value={formData.allergies} onChange={handleChange} className="form-input w-full" placeholder="Food, Drug, or Environmental allergies" />
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={prev} className="btn-secondary flex-1 py-3">Back</button>
              <button onClick={next} className="btn-primary flex-1 py-3">Continue to Symptoms</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white border-b pb-2">Reason for Admission</h3>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Chief Complaint</label>
              <input name="chiefComplaint" value={formData.chiefComplaint} onChange={handleChange} className="form-input w-full" placeholder="Main reason for visit" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Detailed Symptoms</label>
              <textarea name="symptoms" value={formData.symptoms} onChange={handleChange} className="form-input w-full" placeholder="Describe how you feel..." rows="3" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Duration</label>
                <input name="duration" value={formData.duration} onChange={handleChange} className="form-input w-full" placeholder="e.g. 3 days" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Severity</label>
                <select name="severity" value={formData.severity} onChange={handleChange} className="form-input w-full">
                  <option value="">Select Severity</option>
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={prev} className="btn-secondary flex-1 py-3" disabled={loading}>Back</button>
              <button onClick={handleSubmit} className="btn-primary flex-1 py-3" disabled={loading}>
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="p-8 text-center space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 text-green-500 mb-2">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Request Received!</h2>
            <p className="text-slate-500">Your admission request has been sent to the clinical team. Please wait for an administrator to approve your request and allocate a room/doctor.</p>
            <button onClick={() => setStep(1)} className="btn-secondary px-8">Submit Another Request</button>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ================= Bills ================= */
export function PatientBills() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    if (u?.id) {
      fetch(`${BASE}/api/bill/summary/${u.id}`)
        .then(res => res.json())
        .then(data => {
          setSummary(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Summary fetch error:", err);
          setLoading(false);
        });
    }
  }, []);

  if (loading) return <p className="p-8 text-center text-slate-400">Loading billing summary...</p>;

  return (
    <div className="space-y-6">
      <SectionHeader title="My Billing Summary" subtitle={summary?.status === "paid" ? "✅ All cleared" : "⏳ Outstanding Balance"} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Detailed Charges" className="lg:col-span-2">
          <Table headers={["Description", "Category", "Amount"]}>
            {summary?.items?.map((item, idx) => (
              <tr key={idx}>
                <td>
                  <p className="font-medium text-slate-800 dark:text-slate-100">{item.description}</p>
                  {item.note && <p className="text-[10px] text-amber-500 font-bold">{item.note}</p>}
                </td>
                <td>
                  <Badge variant={item.category === 'Room' ? 'blue' : item.category === 'Pharmacy' ? 'green' : 'gray'}>
                    {item.category}
                  </Badge>
                </td>
                <td className="font-mono font-bold">₹{item.amount || 0}</td>
              </tr>
            ))}
          </Table>
          {(!summary || !summary.items || summary.items.length === 0) && (
            <p className="p-8 text-center text-slate-400">No charges recorded for your current stay.</p>
          )}
        </Card>

        <div className="space-y-6">
          <Card title="Total Balance" className="bg-slate-900 text-white border-none shadow-xl">
            <div className="p-6 text-center space-y-2">
              <p className="text-slate-400 text-sm">Total Outstanding</p>
              <h2 className="text-4xl font-black text-white">₹{summary?.totalAmount || 0}</h2>
              <div className="pt-4">
                <Badge variant={summary?.status === "paid" ? "green" : "yellow"}>
                  {summary?.status?.toUpperCase() || "UNPAID"}
                </Badge>
              </div>
            </div>
          </Card>
          
          <Card title="Payment Info">
            <div className="p-5 text-sm text-slate-500 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                  <CreditCard size={16} />
                </div>
                <p>Online payments are currently disabled. Please visit the accounts desk to settle your bill.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}