import React, { useState } from 'react';
import { StatCard, Card, Table, Badge, FormField, Input, Select, SectionHeader } from '../../components/ui';
import { Users, Activity, Pill, ClipboardList, User } from 'lucide-react';
import { patients, vitals, medications } from '../../data/mockData';

export function NurseDashboard() {
  return (
    <div>
      <SectionHeader title="Nurse Dashboard" subtitle="Good morning, Priya" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="My Patients" value="8" icon={Users} color="blue" />
        <StatCard title="Vitals Due" value="3" icon={Activity} color="amber" />
        <StatCard title="Meds Pending" value="5" icon={Pill} color="rose" />
        <StatCard title="Tasks Today" value="12" subtitle="4 completed" icon={ClipboardList} color="teal" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card title="Recent Vitals">
          <Table headers={['Patient', 'SpO2', 'Temp', 'BP', 'HR', 'Time']}>
            {vitals?.slice(0, 4).filter(Boolean).map(v => (
              <tr key={v?.id ?? Math.random()} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="table-cell font-medium">{v?.patientName ?? "N/A"}</td>
                <td className="table-cell font-mono text-sm">{v?.spo2 ?? "N/A"}</td>
                <td className="table-cell font-mono text-sm">{v?.temp ?? "N/A"}</td>
                <td className="table-cell font-mono text-sm">{v?.bp ?? "N/A"}</td>
                <td className="table-cell font-mono text-sm">{v?.heartRate ?? "N/A"}</td>
                <td className="table-cell text-slate-400 text-xs">{v?.time ?? "N/A"}</td>
              </tr>
            ))}
          </Table>
        </Card>
        <Card title="Pending Medications">
          <div className="p-4 space-y-3">
            {medications?.filter(m => (m?.status ?? "") === 'Pending').filter(Boolean).map(m => (
              <div key={m?.id ?? Math.random()} className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20">
                <Pill size={16} className="text-amber-500 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{m?.patientName ?? "N/A"}</p>
                  <p className="text-xs text-slate-500">{m?.medicine ?? "N/A"} · {m?.dosage ?? "N/A"} · {m?.time ?? "N/A"}</p>
                </div>
                <button className="btn-primary py-1.5 text-xs">Give</button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function NursePatients() {
  const [selected, setSelected] = useState(null);

  if (selected) {
    const p = patients.find(p => p.id === selected);
    return (
      <div>
        <SectionHeader
          title={p?.name ?? "N/A"}
          subtitle={`Patient ID: ${p?.id ?? "N/A"}`}
          action={<button onClick={() => setSelected(null)} className="btn-secondary">← Back</button>}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card title="Personal Info">
            <div className="p-5 space-y-3">
              {[['ID', p?.id], ['Name', p?.name], ['Age', (p?.age ?? 0) + ' yrs'], ['Gender', p?.gender], ['Blood Group', p?.bloodGroup], ['Contact', p?.contact]]?.filter(Boolean).map(([k, v]) => (
                <div key={k ?? Math.random()} className="flex justify-between border-b border-slate-50 dark:border-slate-700/30 pb-2 last:border-0">
                  <span className="text-sm text-slate-400">{k ?? "N/A"}</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{v ?? "N/A"}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card title="Admission & Diagnosis">
            <div className="p-5 space-y-3">
              {[['Room', p?.room], ['Bed', p?.bed], ['Doctor', p?.doctor], ['Admitted', p?.admitted], ['Diagnosis', p?.diagnosis], ['Status', p?.status]]?.filter(Boolean).map(([k, v]) => (
                <div key={k ?? Math.random()} className="flex justify-between border-b border-slate-50 dark:border-slate-700/30 pb-2 last:border-0">
                  <span className="text-sm text-slate-400">{k ?? "N/A"}</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{v ?? "N/A"}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card title="Latest Vitals" className="lg:col-span-2">
            <Table headers={['SpO2', 'Temperature', 'Blood Pressure', 'Heart Rate', 'Time', 'Date']}>
              {vitals?.filter(v => v?.patientId === p?.id).filter(Boolean).map(v => (
                <tr key={v?.id ?? Math.random()}>
                  <td className="table-cell font-mono">{v?.spo2 ?? "N/A"}</td>
                  <td className="table-cell font-mono">{v?.temp ?? "N/A"}</td>
                  <td className="table-cell font-mono">{v?.bp ?? "N/A"}</td>
                  <td className="table-cell font-mono">{v?.heartRate ?? "N/A"}</td>
                  <td className="table-cell text-slate-400 text-xs">{v?.time ?? "N/A"}</td>
                  <td className="table-cell text-slate-400 text-xs">{v?.date ?? "N/A"}</td>
                </tr>
              ))}
            </Table>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader title="Patients" subtitle="All patients assigned to you" />
      <Card>
        <Table headers={['Patient ID', 'Name', 'Room', 'Doctor', 'Diagnosis', 'Status', '']}>
          {patients?.filter(Boolean).map(p => (
            <tr key={p?.id ?? Math.random()} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 cursor-pointer" onClick={() => setSelected(p?.id)}>
              <td className="table-cell font-mono text-xs text-slate-500">{p?.id ?? "N/A"}</td>
              <td className="table-cell font-semibold">{p?.name ?? "N/A"}</td>
              <td className="table-cell"><span className="font-mono text-xs bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-md">{p?.room ?? "N/A"}</span></td>
              <td className="table-cell text-slate-500">{p?.doctor ?? "N/A"}</td>
              <td className="table-cell">{p?.diagnosis ?? "N/A"}</td>
              <td className="table-cell">
                <Badge variant={(p?.status ?? "") === 'Critical' ? 'red' : (p?.status ?? "") === 'Observation' ? 'yellow' : 'green'}>{p?.status ?? "N/A"}</Badge>
              </td>
              <td className="table-cell"><button className="text-pulse-500 text-sm font-semibold">View →</button></td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}

export function VitalsEntry() {
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <SectionHeader title="Vitals Entry" subtitle="Record patient vitals" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card title="Record Vitals">
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Patient Name">
                <Select>
                  {patients?.filter(Boolean).map(p => <option key={p?.id ?? Math.random()}>{p?.name ?? "N/A"}</option>)}
                </Select>
              </FormField>
              <FormField label="Patient ID"><Input value="PT-20041" readOnly className="form-input bg-slate-50 dark:bg-slate-800" /></FormField>
              <FormField label="SpO2 (%)"><Input placeholder="e.g. 98" type="number" /></FormField>
              <FormField label="Temperature (°F)"><Input placeholder="e.g. 98.6" type="number" step="0.1" /></FormField>
              <FormField label="Blood Pressure"><Input placeholder="e.g. 120/80" /></FormField>
              <FormField label="Heart Rate (bpm)"><Input placeholder="e.g. 72" type="number" /></FormField>
              <FormField label="Time"><Input type="time" defaultValue="08:00" /></FormField>
              <FormField label="Date"><Input type="date" defaultValue={new Date().toISOString().split('T')[0]} /></FormField>
            </div>
            <button onClick={() => setSaved(true)} className="btn-primary w-full">Save Vitals</button>
            {saved && <p className="text-center text-sm text-emerald-600 font-semibold">✓ Vitals recorded successfully!</p>}
          </div>
        </Card>

        <Card title="Today's Vitals Log">
          <Table headers={['Patient', 'SpO2', 'BP', 'HR', 'Time']}>
            {vitals?.filter(Boolean).map(v => (
              <tr key={v?.id ?? Math.random()} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="table-cell font-medium text-xs">{v?.patientName ?? "N/A"}</td>
                <td className="table-cell font-mono text-xs">{v?.spo2 ?? "N/A"}</td>
                <td className="table-cell font-mono text-xs">{v?.bp ?? "N/A"}</td>
                <td className="table-cell font-mono text-xs">{v?.heartRate ?? "N/A"}</td>
                <td className="table-cell text-xs text-slate-400">{v?.time ?? "N/A"}</td>
              </tr>
            ))}
          </Table>
        </Card>
      </div>
    </div>
  );
}

export function MedicationEntry() {
  return (
    <div>
      <SectionHeader title="Medication Entry" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card title="Record Medication">
          <div className="p-5 space-y-4">
            <FormField label="Patient Name">
              <Select>{patients?.filter(Boolean).map(p => <option key={p?.id ?? Math.random()}>{p?.name ?? "N/A"}</option>)}</Select>
            </FormField>
            <FormField label="Medicine Name"><Input placeholder="e.g. Paracetamol" /></FormField>
            <FormField label="Dosage"><Input placeholder="e.g. 500mg" /></FormField>
            <FormField label="Time"><Input type="time" /></FormField>
            <button className="btn-primary w-full">Record Administration</button>
          </div>
        </Card>
        <Card title="Medication Log">
          <Table headers={['Patient', 'Medicine', 'Dosage', 'Time', 'Status']}>
            {medications?.filter(Boolean).map(m => (
              <tr key={m?.id ?? Math.random()} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="table-cell font-medium text-xs">{m?.patientName ?? "N/A"}</td>
                <td className="table-cell text-xs">{m?.medicine ?? "N/A"}</td>
                <td className="table-cell font-mono text-xs">{m?.dosage ?? "N/A"}</td>
                <td className="table-cell text-xs text-slate-400">{m?.time ?? "N/A"}</td>
                <td className="table-cell"><Badge variant={(m?.status ?? "") === 'Given' ? 'green' : 'yellow'}>{m?.status ?? "Pending"}</Badge></td>
              </tr>
            ))}
          </Table>
        </Card>
      </div>
    </div>
  );
}

export function NurseTasks() {
  const tasks = [
    { id: 1, task: 'Check vitals for Room 302-A', priority: 'High', time: '09:00 AM', done: true },
    { id: 2, task: 'Administer medications - Neha Gupta', priority: 'High', time: '10:00 AM', done: false },
    { id: 3, task: 'Change IV drip - Mohan Das (ICU)', priority: 'Urgent', time: '10:30 AM', done: false },
    { id: 4, task: 'Update vitals chart for Ward 3', priority: 'Normal', time: '11:00 AM', done: false },
    { id: 5, task: 'Assist Dr. Verma with rounds', priority: 'Normal', time: '12:00 PM', done: true },
  ];

  return (
    <div>
      <SectionHeader title="My Tasks" subtitle="Today's task list" />
      <Card>
        <div className="p-5 space-y-3">
          {tasks?.filter(Boolean).map(t => (
            <div key={t?.id ?? Math.random()} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
              (t?.done ?? false) ? 'border-slate-100 dark:border-slate-700 opacity-60' : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50'
            }`}>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${(t?.done ?? false) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-500'}`}>
                {(t?.done ?? false) && <span className="text-xs">✓</span>}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${(t?.done ?? false) ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>{t?.task ?? "N/A"}</p>
                <p className="text-xs text-slate-400 mt-0.5">{t?.time ?? "N/A"}</p>
              </div>
              <Badge variant={(t?.priority ?? "") === 'Urgent' ? 'red' : (t?.priority ?? "") === 'High' ? 'yellow' : 'gray'}>{t?.priority ?? "Normal"}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
