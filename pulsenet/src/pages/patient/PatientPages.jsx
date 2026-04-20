import React, { useState, useEffect } from 'react';
import BASE from '../../config';
import { StatCard, Card, Table, Badge, FormField, Input, Select, Textarea, SectionHeader } from '../../components/ui';
import { Pill, FileText, BedDouble, CreditCard, AlertCircle, User } from 'lucide-react';


/* ─────────────── Patient Dashboard ─────────────── */
export function PatientDashboard() {
  const [admission, setAdmission] = useState(null);
  const [bill, setbill] = useState([]);
  const [meds, setMeds] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);

    const BASE = "`${BASE}";

    fetch(`${BASE}/api/admission/${u.id}`)
      .then(res => res.json())
      .then(setAdmission);

    fetch(`${BASE}/api/bill/${u.id}`)
      .then(res => res.json())
      .then(setbill);

    fetch(`${BASE}/api/medication/${u.id}`)
      .then(res => res.json())
      .then(setMeds);

  }, []);

  const days = admission
    ? Math.ceil((new Date() - new Date(admission.admissionDate)) / (1000 * 60 * 60 * 24))
    : 0;

  const totalBill = bill.reduce((sum, b) => sum + b.amount, 0);



  return (
    <div>
      <SectionHeader title="My Dashboard" subtitle={`Welcome back, ${user?.fullname}`} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Room No." value={admission?.roomNumber} icon={BedDouble} color="blue" />
        <StatCard title="Doctor" value={admission?.doctorName} icon={User} color="teal" />
        <StatCard title="Days" value={days} icon={AlertCircle} color="amber" />
        <StatCard title="bill" value={`₹${totalBill}`} icon={CreditCard} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2" title="Patient Info">
          <div className="p-5 grid grid-cols-2 gap-4">
            <Info label="Patient ID" value={user?.id} />
            <Info label="Full Name" value={user?.fullname} />
            <Info label="Age" value={admission?.age} />
            <Info label="Blood Group" value={admission?.bloodGroup} />
            <Info label="Room" value={admission?.roomNumber} />
            <Info label="Doctor" value={admission?.doctorName} />
            <Info label="Diagnosis" value={admission?.diagnosis} />
          </div>
        </Card>

        <Card title="Today's Medications">
          <div className="p-4 space-y-3">
            {meds.map((m, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                <Pill size={16} />
                <div className="flex-1">
                  <p className="text-slate-900 dark:text-slate-100">{m.medicineName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{m.time}</p>
                </div>
                <Badge>{m.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

}
const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-slate-400 dark:text-slate-500">{label}</p>
    <p className="font-semibold text-slate-900 dark:text-slate-100">{value || "-"}</p>
  </div>
);


/* ─────────────── My Reports ─────────────── */

export function PatientReports() {

  const [reports, setReports] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(u);

    if (!u?.id) return;

    const BASE = "`${BASE}";

    fetch(`${BASE}/api/report/patient/${u.id}`) // ✅ FIXED
      .then(res => res.json())
      .then(setReports);

  }, []);

  return (
    <div>

      <SectionHeader title="My Reports" />

      <Card>
        <div className="w-full">

          <Table headers={["Patient", "Test", "Date", "Status", "Report"]}>

            {reports.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-slate-400">
                  No reports available
                </td>
              </tr>
            )}

            {reports.map((r) => (
              <tr key={r._id} className="hover:bg-slate-50">

                {/* Patient */}
                <td className="px-4 py-3 font-semibold">
                  {r.patientId}
                </td>

                {/* Test */}
                <td className="px-4 py-3">
                  {r.testName}
                </td>

                {/* Date */}
                <td className="px-4 py-3 text-sm text-slate-500">
                  {new Date(r.createdAt).toLocaleDateString()}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <Badge variant="green">
                    {r.status}
                  </Badge>
                </td>

                {/* PDF */}
                <td className="px-4 py-3">

                  {r.fileUrl ? (
                    <a
                      href={``${BASE}/uploads/${r.fileUrl}`} // ✅ FIXED
                      target="_blank"
                      className="text-blue-500 hover:underline text-sm"
                    >
                      View PDF
                    </a>
                  ) : (
                    <span className="text-slate-400 text-sm">
                      No file
                    </span>
                  )}

                </td>

              </tr>
            ))}

          </Table>

        </div>
      </Card>

    </div>
  );
}
/* ─────────────── My Medications ─────────────── */
export function PatientMedications() {

  const [meds, setMeds] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(u);

    if (!u?.id) return; // ✅ prevent crash

    const BASE = "`${BASE}";

    fetch(`${BASE}/api/medication/${u.id}`)
      .then(res => res.json())
      .then(setMeds);

  }, []);

  return (
    <div>

      <SectionHeader title="My Medications" />

      <Card>
        <div className="w-full">

          <Table
            headers={["Medicine", "Dosage", "Frequency", "Instructions", "Doctor", "Status"]}
          >

            {/* 🔥 EMPTY STATE */}
            {meds.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-slate-400">
                  No medications available
                </td>
              </tr>
            )}

            {meds.map((m) => (
              <tr
                key={m._id} // ✅ FIXED
                className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50"
              >

                <td className="px-4 py-3 font-semibold">
                  {m.medicineName}
                </td>

                <td className="px-4 py-3">
                  {m.dosage}
                </td>

                <td className="px-4 py-3 text-sm text-slate-500">
                  {m.frequency || "-"}
                </td>

                <td className="px-4 py-3 text-sm text-slate-500">
                  {m.instructions || "-"}
                </td>

                <td className="px-4 py-3">
                  {m.doctorName || "-"}
                </td>

                <td className="px-4 py-3">

                  <Badge
                    variant={
                      m.status === "taken"
                        ? "green"
                        : m.status === "pending"
                        ? "yellow"
                        : "blue"
                    }
                  >
                    {m.status}
                  </Badge>

                </td>

              </tr>
            ))}

          </Table>

        </div>
      </Card>

    </div>
  );
}
/* ─────────────── Admission Details ─────────────── */


export function AdmissionDetails() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    fetch(``${BASE}/api/admission/${user.id}`)
      .then(res => res.json())
      .then(data => {

        setData(data);
      });
  }, []);

  return (
    <div>
      <SectionHeader title="Admission Details" />

      <Card>
        <div className="p-5 space-y-2">
          <p className="text-slate-900 dark:text-slate-100">Room: {data?.roomNumber}</p>
          <p className="text-slate-900 dark:text-slate-100">Doctor: {data?.doctorName}</p>
          <p className="text-slate-900 dark:text-slate-100">Diagnosis: {data?.diagnosis}</p>
        </div>
      </Card>
    </div>
  );
}

/* ─────────────── Admission Form ─────────────── */

export function AdmissionForm() {
  const [formData, setFormData] = useState({
    fullname: "",
    dob: "",
    age: "",
    gender: "",
    bloodGroup: "",
    phone: "",
    email: "",
    address: "",

    emergencyName: "",
    relationship: "",
    emergencyPhone: "",
    alternatePhone: "",

    conditions: "",
    surgeries: "",
    medications: "",
    allergies: "",

    chiefComplaint: "",
    symptoms: "",
    duration: "",
    severity: ""
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    let isSubmitted=false;
    try {
      await fetch(``${BASE}/api/admission/${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          alert("Admission already submitted ❌");
          isSubmitted=true;
          return;
        }
      });
      if(!isSubmitted){ 
      await fetch("`${BASE}/api/admission-form/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          patientId: user.id
        })
      });

      alert("Form Submitted ✅");

    } }catch (err) {
      console.error(err);
      alert("Error ❌");
    }
  };
  const [step, setStep] = useState(0);
  const steps = ['Personal Info', 'Emergency Contact', 'Medical History', 'Symptoms'];
useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!user?.id) return;
  
  fetch(``${BASE}/api/auth/${user.id}`)
    .then(res => res.json())
    .then(data => {
      setFormData(prev => ({
        ...prev,
        fullname: data.fullname || "",
        email: data.email || "",
        phone: data.phone || ""
      }));
    });
}, []);
  return (
    <div>
      <SectionHeader title="Admission Form" />
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            <button
              onClick={() => setStep(i)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${i === step ? 'bg-pulse-500 text-white' : i < step ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
            >
              <span className="w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs">
                {i < step ? '✓' : i + 1}
              </span>
              {s}
            </button>
            {i < steps.length - 1 && <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />}
          </React.Fragment>
        ))}
      </div>

      <Card>
        <div className="p-6">
          {step === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField label="fullname"><Input placeholder="Enter full name" name="fullname" value={formData.fullname} onChange={handleChange} /></FormField>
              <FormField label="Date of Birth"><Input type="date" name="dob" value={formData.dob} onChange={handleChange} /></FormField>
              <FormField label="Age"><Input type="number" placeholder="Age in years" name="age" value={formData.age} onChange={handleChange} /></FormField>
              <FormField label="Gender">
                <Select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                </Select>
              </FormField>
              <FormField label="Blood Group">
                <Select  name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg}>{bg}</option>)}
                </Select>
              </FormField>
              <FormField label="Contact Number"><Input placeholder="+91 XXXXX XXXXX" name="phone" value={formData.phone} onChange={handleChange} /></FormField>
              <FormField label="Email Address"><Input type="email" placeholder="email@example.com" name="email" value={formData.email} onChange={handleChange} /></FormField>
              <FormField label="Address" className="md:col-span-2"><Textarea placeholder="Permanent address" name="address" value={formData.address} onChange={handleChange} /></FormField>
            </div>
          )}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField label="Emergency Contact Name"><Input placeholder="Contact name" name="emergencyName" value={formData.emergencyName} onChange={handleChange} /></FormField>
              <FormField label="Relationship"><Input placeholder="e.g. Spouse, Parent" name="relationship" value={formData.relationship} onChange={handleChange} /></FormField>
              <FormField label="Contact Number"><Input placeholder="+91 XXXXX XXXXX" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange} /></FormField>
              <FormField label="Alternate Number"><Input placeholder="+91 XXXXX XXXXX" name="alternatePhone" value={formData.alternatePhone} onChange={handleChange} /></FormField>
            </div>
          )}
          {step === 2 && (
            <div className="grid grid-cols-1 gap-5">
              <FormField label="Existing Conditions"><Textarea placeholder="e.g. Diabetes, Hypertension, Asthma..." name="conditions" value={formData.conditions} onChange={handleChange} rows={3} /></FormField>
              <FormField label="Past Surgeries"><Textarea placeholder="List any past surgeries with dates..." name="surgeries" value={formData.surgeries} onChange={handleChange} rows={3} /></FormField>
              <FormField label="Current Medications"><Textarea placeholder="List medicines you currently take..." name="currentMedications" value={formData.currentMedications} onChange={handleChange} rows={3} /></FormField>
              <FormField label="Allergies"><Input placeholder="e.g. Penicillin, Peanuts, Latex" name="allergies" value={formData.allergies} onChange={handleChange} /></FormField>
            </div>
          )}
          {step === 3 && (
            <div className="grid grid-cols-1 gap-5">
              <FormField label="Chief Complaint"><Textarea placeholder="Describe your main complaint..." name="chiefComplaint" value={formData.chiefComplaint} onChange={handleChange} rows={3} /></FormField>
              <FormField label="Symptoms"><Textarea placeholder="List all symptoms you are experiencing..." name="symptoms" value={formData.symptoms} onChange={handleChange} rows={3} /></FormField>
              <FormField label="Duration of Symptoms"><Input placeholder="e.g. 3 days, 2 weeks" name="duration" value={formData.duration} onChange={handleChange} /></FormField>
              <FormField label="Severity">
                <Select name="severity" value={formData.severity} onChange={handleChange}>
                  <option>Mild</option><option>Moderate</option><option>Severe</option>
                </Select>
              </FormField>
            </div>
          )}

          <div className="flex gap-3 mt-6 pt-5 border-t border-slate-100 dark:border-slate-700">
            {step > 0 && <button onClick={() => setStep(s => s - 1)} className="btn-secondary">Back</button>}
            <div className="flex-1" />
            {step < 3
              ? <button onClick={() => setStep(s => s + 1)} className="btn-primary">Next Step →</button>
              : <button onClick={handleSubmit} className="btn-primary">
                Submit Admission
              </button>
            }
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ─────────────── bill ─────────────── */


export function PatientBills() {
  const [summary, setSummary] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);
    fetch(``${BASE}/api/bill/summary/${u.id}`)
      .then(res => res.json())
      .then(data => { if (!data.message) setSummary(data); });
  }, []);

  const categoryColor = (cat) => ({
    Room: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    Consultation: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    Pharmacy: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    Manual: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300",
  })[cat] || "bg-slate-100 dark:bg-slate-700 text-slate-600";

  return (
    <div>
      <SectionHeader title="My Bills" />

      {!summary ? (
        <Card><p className="text-center py-10 text-sm text-slate-400 dark:text-slate-500">No billing information found</p></Card>
      ) : (
        <Card>
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-100">{user?.fullname}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Admitted: {new Date(summary.admissionDate).toLocaleDateString()} · {summary.days} day(s)
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              summary.status === "paid"
                ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                : "bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
            }`}>{summary.status}</span>
          </div>

          <div className="p-4 space-y-2">
            {summary.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-700/50 last:border-0">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColor(item.category)}`}>{item.category}</span>
                  <span className="text-sm text-slate-700 dark:text-slate-300">{item.description}</span>
                  {item.note && <span className="text-xs text-slate-400">({item.note})</span>}
                </div>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-100">
                  {item.amount > 0 ? `₹${item.amount}` : "—"}
                </span>
              </div>
            ))}
          </div>

          <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Total Amount</span>
            <span className="text-xl font-bold text-slate-900 dark:text-white">₹{summary.totalAmount}</span>
          </div>
        </Card>
      )}
    </div>
  );
}

