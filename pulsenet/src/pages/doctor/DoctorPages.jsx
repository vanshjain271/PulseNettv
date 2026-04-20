import React, { useState, useEffect } from 'react';
import BASE from '../../config';
import { StatCard, Card, Table, Badge, FormField, Input, Select, Textarea, SectionHeader } from '../../components/ui';
import { Users, FileText, Activity, Stethoscope, Plus, Trash2 } from 'lucide-react';
import { patients, vitals, prescriptions } from '../../data/mockData';


export function DoctorDashboard() {

  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const doctorId = user.id;
  const name = user.fullname;

  // FETCH PATIENTS FROM BACKEND
 useEffect(() => {
  if (!doctorId) return;

   fetch(``${BASE}/api/admission/doctor/${doctorId}`)
    .then(res => res.json())
    .then(setPatients);

  fetch(``${BASE}/api/medication/doctor/${doctorId}`)
    .then(res => res.json())
    .then(setPrescriptions);

}, [doctorId]);
const activeRx = prescriptions.filter(p => p.status !== "taken").length;
  return (
    <div>

      {/* 🔥 HEADER */}
      <SectionHeader
        title="Doctor Dashboard"
        subtitle={`Welcome, ${name}`}
      />

      {/* 🔥 STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="My Patients" value={patients.length} />
        <StatCard title="Active Rx" value={activeRx} />
        <StatCard title="Today Patients" value={patients.length} />
        <StatCard title="Rounds Today" value="1" subtitle="12:00 PM" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* 🔥 PATIENT TABLE */}
        <Card title="My Patients Today">
          <Table headers={['Patient', 'Room', 'Diagnosis', 'Status']}>
            {patients.map(p => (
              <tr key={p._id} className="hover:bg-slate-50">

                <td className="table-cell font-semibold">
                  {p.patientId}
                </td>

                <td className="table-cell font-mono text-xs">
                  {p.roomNumber}
                </td>

                <td className="table-cell text-xs">
                  {p.diagnosis || "N/A"}
                </td>

                <td className="table-cell">
                  <Badge variant="green">Admitted</Badge>
                </td>

              </tr>
            ))}
          </Table>
        </Card>

        {/* 🔥 PRESCRIPTIONS (STATIC FOR NOW) */}
        <Card title="Active Prescriptions">
  <div className="p-4 space-y-3">

    {prescriptions.length === 0 && (
      <p className="text-sm text-slate-400">No prescriptions yet</p>
    )}

    {prescriptions
      .filter(rx => rx.status !== "taken") // 🔥 only active
      .slice(0, 5) // optional: show latest 5
      .map(rx => (
        <div
          key={rx._id}
          className="p-3 rounded-xl border bg-slate-50 dark:bg-slate-800/50"
        >

          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-semibold">
              {rx.patientId}
            </p>
            <span className="text-xs text-blue-500">
              {rx.status}
            </span>
          </div>

          <p className="text-xs text-slate-500">
            {rx.medicineName} ({rx.dosage})
          </p>

          <p className="text-xs text-slate-400">
            {rx.frequency} · {rx.time}
          </p>

        </div>
      ))}

  </div>
</Card>

      </div>
    </div>
  );
}


export function DoctorPatients() {

  const [patients, setPatients] = useState([]);
  const [selected, setSelected] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const doctorId = user.id;

  // 🔥 FETCH PATIENTS
  useEffect(() => {

    if (!doctorId) return;

    fetch(``${BASE}/api/admission/doctor/${doctorId}`)
      .then(res => res.json())
      .then(setPatients);

  }, [doctorId]);

  // 🔥 DETAIL VIEW
  if (selected) {

    const p = patients.find(pt => pt._id === selected);

    if (!p) return null;

    return (
      <div>

        <SectionHeader
          title={p.patientId}
          subtitle={`${p.patientId} · ${p.diagnosis || "N/A"}`}
          action={
            <button
              onClick={() => setSelected(null)}
              className="btn-secondary"
            >
              ← Back
            </button>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* PERSONAL */}
          <Card title="Personal Info">
            <div className="p-4 space-y-2">
              {[
                ['Patient ID', p.patientId],
                ['Age', p.age || '-'],
                ['Blood Group', p.bloodGroup || '-']
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-1 border-b last:border-0">
                  <span className="text-xs text-slate-400">{k}</span>
                  <span className="text-xs font-semibold">{v}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* ADMISSION */}
          <Card title="Admission Details">
            <div className="p-4 space-y-2">
              {[
                ['Room', p.roomNumber],
                ['Admitted', new Date(p.admissionDate).toLocaleDateString()],
                ['Status', 'Admitted']
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-1 border-b last:border-0">
                  <span className="text-xs text-slate-400">{k}</span>
                  <span className="text-xs font-semibold">{v}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* DIAGNOSIS */}
          <Card title="Diagnosis">
            <div className="p-4">
              <p className="text-xs text-slate-400 mb-1">Primary Diagnosis</p>
              <p className="text-sm font-semibold">{p.diagnosis || "N/A"}</p>
            </div>
          </Card>

          {/* VITALS PLACEHOLDER */}
          <Card title="Vitals" className="lg:col-span-3">
            <p className="p-5 text-sm text-slate-400">
              No vitals connected yet
            </p>
          </Card>

        </div>
      </div>
    );
  }

  // 🔥 LIST VIEW
  return (
    <div>

      <SectionHeader title="My Patients" />

      <Card>
        <Table headers={['Patient ID', 'Name', 'Age', 'Room', 'Diagnosis', 'Status', 'Actions']}>

          {patients.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center text-slate-400 py-4">
                No patients assigned
              </td>
            </tr>
          )}

          {patients.map(p => (
            <tr key={p._id} className="hover:bg-slate-50">

              <td className="table-cell font-mono text-xs">
                {p.patientId}
              </td>

              <td className="table-cell font-semibold">
                {p.patientId}
              </td>

              <td className="table-cell">
                {p.age || '-'}
              </td>

              <td className="table-cell font-mono text-xs">
                {p.roomNumber}
              </td>

              <td className="table-cell text-xs">
                {p.diagnosis || "N/A"}
              </td>

              <td className="table-cell">
                <Badge variant="green">Admitted</Badge>
              </td>

              <td className="table-cell">
                <button
                  onClick={() => setSelected(p._id)}
                  className="text-blue-500 text-sm font-semibold"
                >
                  View →
                </button>
              </td>

            </tr>
          ))}

        </Table>
      </Card>

    </div>
  );
}



export function DoctorPrescriptions() {

  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");

  const [medicines, setMedicines] = useState([
    { medicineName: '', dosage: '', frequency: '', instructions: '', time: '' }
  ]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const doctorId = user.id;
  const doctorName = user.fullname;

  // 🔥 FETCH DOCTOR PATIENTS
  useEffect(() => {
    if (!doctorId) return;

    fetch(``${BASE}/api/admission/doctor/${doctorId}`)
      .then(res => res.json())
      .then(setPatients);

  }, [doctorId]);

  // 🔥 FETCH PRESCRIPTIONS
  useEffect(() => {
    if (!doctorId) return;

    fetch(``${BASE}/api/medication/doctor/${doctorId}`)
      .then(res => res.json())
      .then(setPrescriptions);

  }, [doctorId]);

  // ➕ ADD MED
  const addMed = () =>
    setMedicines(m => [
      ...m,
      { medicineName: '', dosage: '', frequency: '', instructions: '', time: '' }
    ]);

  const removeMed = (i) =>
    setMedicines(m => m.filter((_, idx) => idx !== i));

  // 🔥 SUBMIT PRESCRIPTION
  const handleSubmit = async () => {

    for (let med of medicines) {
      await fetch("`${BASE}/api/medication/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          patientId: selectedPatient,
          medicineName: med.medicineName,
          dosage: med.dosage,
          frequency: med.frequency,
          instructions: med.instructions,
          time: med.time,
          doctorId,
          doctorName,
          status: "pending"
        })
      });
    }

    alert("Prescription Added ✅");

    // refresh
    fetch(``${BASE}/api/medication/doctor/${doctorId}`)
      .then(res => res.json())
      .then(setPrescriptions);

    // reset
    setMedicines([
      { medicineName: '', dosage: '', frequency: '', instructions: '', time: '' }
    ]);
  };

  return (
    <div>
      <SectionHeader title="Prescriptions" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* 🔥 NEW PRESCRIPTION */}
        <Card title="New Prescription">
          <div className="p-5 space-y-4">

            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="text-xs">Patient</label>
                <Select
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                >
                  <option value="">Select Patient</option>
                  {patients.map(p => (
                    <option key={p._id} value={p.patientId}>
                      {p.patientId}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="text-xs">Date</label>
                <Input
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>

            </div>

            {/* MEDICINES */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs">Medicines</label>
                <button onClick={addMed} className="text-blue-500 text-xs">
                  + Add
                </button>
              </div>

              {medicines.map((m, i) => (
                <div key={i} className="mb-3 p-3 border rounded-lg">

                  {/* ROW 1 */}
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <Input
                      placeholder="Medicine"
                      value={m.medicineName}
                      onChange={e => {
                        const upd = [...medicines];
                        upd[i].medicineName = e.target.value;
                        setMedicines(upd);
                      }}
                    />
                    <Input
                      placeholder="Dosage (500mg)"
                      value={m.dosage}
                      onChange={e => {
                        const upd = [...medicines];
                        upd[i].dosage = e.target.value;
                        setMedicines(upd);
                      }}
                    />
                  </div>

                  {/* ROW 2 */}
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <Input
                      placeholder="Frequency (Twice daily)"
                      value={m.frequency}
                      onChange={e => {
                        const upd = [...medicines];
                        upd[i].frequency = e.target.value;
                        setMedicines(upd);
                      }}
                    />
                    <Input
                      placeholder="Time (08:00 AM)"
                      value={m.time}
                      onChange={e => {
                        const upd = [...medicines];
                        upd[i].time = e.target.value;
                        setMedicines(upd);
                      }}
                    />
                  </div>

                  {/* ROW 3 */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Instructions"
                      value={m.instructions}
                      onChange={e => {
                        const upd = [...medicines];
                        upd[i].instructions = e.target.value;
                        setMedicines(upd);
                      }}
                      className="flex-1"
                    />

                    {medicines.length > 1 && (
                      <button
                        onClick={() => removeMed(i)}
                        className="text-red-500"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>

            <button onClick={handleSubmit} className="btn-primary w-full">
              Issue Prescription
            </button>

          </div>
        </Card>

        {/* 🔥 RECENT PRESCRIPTIONS */}
        <Card title="Recent Prescriptions">
          <div className="p-4 space-y-3">

            {prescriptions.length === 0 && (
              <p className="text-sm text-slate-400">No prescriptions</p>
            )}

            {prescriptions.map(rx => (
              <div key={rx._id} className="p-3 border rounded-lg">

                <div className="flex justify-between">
                  <p className="font-semibold">{rx.patientId}</p>
                  <Badge variant="green">{rx.status}</Badge>
                </div>

                <p className="text-xs text-slate-400">
                  {rx.medicineName} ({rx.dosage})
                </p>

                <p className="text-xs text-slate-500">
                  {rx.instructions}
                </p>

              </div>
            ))}

          </div>
        </Card>

      </div>
    </div>
  );
}

