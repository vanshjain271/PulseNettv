import React, { useState, useEffect } from 'react';
import { StatCard, Card, Table, Badge, FormField, Input, Select, SectionHeader } from '../../components/ui';
import { Users, Activity, Pill, ClipboardList, User } from 'lucide-react';
import BASE from '../../config';

export function NurseDashboard() {
  const [patients, setPatients] = useState([]);
  const [meds, setMeds] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetch(`${BASE}/api/admission-form`)
      .then(res => res.json())
      .then(setPatients);
    
    fetch(`${BASE}/api/medication/all`)
      .then(res => res.json())
      .then(setMeds);
  }, []);

  const pendingMeds = meds.filter(m => m.status === 'pending');

  return (
    <div>
      <SectionHeader title="Nurse Dashboard" subtitle={`Welcome back, ${user.fullname}`} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Active Patients" value={patients.length} icon={Users} color="blue" />
        <StatCard title="Meds Pending" value={pendingMeds.length} icon={Pill} color="rose" />
        <StatCard title="Completed" value="0" subtitle="Tasks today" icon={ClipboardList} color="teal" />
        <StatCard title="Alerts" value="0" icon={Activity} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card title="Patient Overview">
          <Table headers={['Patient ID', 'Room', 'Diagnosis']}>
            {patients?.slice(0, 5).map(p => (
              <tr key={p._id}>
                <td className="table-cell font-mono text-xs">{p.patientId}</td>
                <td className="table-cell">{p.selectedRoom || "TBD"}</td>
                <td className="table-cell text-sm">{p.chiefComplaint}</td>
              </tr>
            ))}
          </Table>
        </Card>
        <Card title="Pending Medications">
          <div className="p-4 space-y-3">
            {pendingMeds?.slice(0, 4).map(m => (
              <div key={m._id} className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20">
                <Pill size={16} className="text-amber-500 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{m.patientId}</p>
                  <p className="text-xs text-slate-500">{m.medicineName} · {m.dosage}</p>
                </div>
                <Badge variant="yellow">Pending</Badge>
              </div>
            ))}
            {pendingMeds.length === 0 && <p className="text-center text-slate-400 text-sm">No pending meds.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function NursePatients() {
  const [patients, setPatients] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch(`${BASE}/api/admission-form`)
      .then(res => res.json())
      .then(setPatients);
  }, []);

  if (selected) {
    const p = patients.find(p => p._id === selected);
    return (
      <div>
        <SectionHeader
          title={p?.fullname ?? "N/A"}
          subtitle={`Patient ID: ${p?.patientId ?? "N/A"}`}
          action={<button onClick={() => setSelected(null)} className="btn-secondary">← Back</button>}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card title="Personal Info">
            <div className="p-5 space-y-3">
              {[
                ['ID', p?.patientId], 
                ['Name', p?.fullname], 
                ['Age', p?.age + ' yrs'], 
                ['Gender', p?.gender], 
                ['Blood Group', p?.bloodGroup], 
                ['Contact', p?.phone]
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-slate-50 dark:border-slate-700/30 pb-2 last:border-0">
                  <span className="text-sm text-slate-400">{k}</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{v}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card title="Admission Info">
            <div className="p-5 space-y-3">
              {[
                ['Room', p?.selectedRoom || "N/A"], 
                ['Doctor', p?.selectedDoctor || "N/A"], 
                ['Diagnosis', p?.chiefComplaint], 
                ['Status', p?.status]
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-slate-50 dark:border-slate-700/30 pb-2 last:border-0">
                  <span className="text-sm text-slate-400">{k}</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{v}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader title="Patients" subtitle="All registered patients" />
      <Card>
        <Table headers={['Patient ID', 'Name', 'Room', 'Doctor', 'Status', '']}>
          {patients?.map(p => (
            <tr key={p._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 cursor-pointer" onClick={() => setSelected(p._id)}>
              <td className="table-cell font-mono text-xs text-slate-500">{p.patientId}</td>
              <td className="table-cell font-semibold">{p.fullname}</td>
              <td className="table-cell">{p.selectedRoom || "TBD"}</td>
              <td className="table-cell text-slate-500">{p.selectedDoctor || "TBD"}</td>
              <td className="table-cell">
                <Badge variant={p.status === 'approved' ? 'green' : 'yellow'}>{p.status}</Badge>
              </td>
              <td className="table-cell"><button className="text-blue-500 text-sm font-semibold">View →</button></td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}

export function VitalsEntry() {
  return (
    <div>
      <SectionHeader title="Vitals Entry" />
      <Card>
        <div className="p-8 text-center text-slate-500">
          Vitals recording system is being updated. Please record manually in the patient chart for now.
        </div>
      </Card>
    </div>
  );
}

export function MedicationEntry() {
  const [meds, setMeds] = useState([]);

  useEffect(() => {
    fetch(`${BASE}/api/medication/all`)
      .then(res => res.json())
      .then(setMeds);
  }, []);

  return (
    <div>
      <SectionHeader title="Medication Log" />
      <Card>
        <Table headers={['Patient ID', 'Medicine', 'Dosage', 'Status']}>
          {meds?.map(m => (
            <tr key={m._id}>
              <td className="table-cell font-mono text-xs">{m.patientId}</td>
              <td className="table-cell text-sm">{m.medicineName}</td>
              <td className="table-cell font-mono text-xs">{m.dosage}</td>
              <td className="table-cell"><Badge variant={m.status === 'Given' ? 'green' : 'yellow'}>{m.status}</Badge></td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}

export function NurseTasks() {
  return (
    <div>
      <SectionHeader title="My Tasks" />
      <Card>
        <div className="p-8 text-center text-slate-500">
          Task scheduler is synced with Dr. rounds. Check back at 12:00 PM.
        </div>
      </Card>
    </div>
  );
}

