import React, { useState, useEffect } from 'react';
import { StatCard, Card, Table, Badge, FormField, Input, Select, SectionHeader } from '../../components/ui';
import { Users, UserCog, Building2, DollarSign, FileText, Activity, Plus, Trash2, Edit3 } from 'lucide-react';
import { patients, staff } from '../../data/mockData';
import BASE from '../../config';

 

export function AdminDashboard() {

  const [data, setData] = useState({});
  const [rooms, setRooms] = useState([]);

  // 🔥 Fetch dashboard stats
  useEffect(() => {
    fetch(`${BASE}/api/dashboard`)
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error("Dashboard fetch error:", err));
  }, []);

  // 🔥 Fetch rooms (IMPORTANT FIX)
  useEffect(() => {
    fetch(`${BASE}/api/rooms`)
      .then(res => res.json())
      .then(setRooms)
      .catch(err => console.error("Rooms fetch error:", err));
  }, []);

  // 🔥 Stats
  const stats = [
    {
      title: "Total Patients",
      value: data.totalPatients || 0,
    },
    {
      title: "Doctors",
      value: data.doctors || 0,
    },
    {
      title: "Nurses",
      value: data.nurses || 0,
    },
    {
      title: "Active Admissions",
      value: data.activeAdmissions || 0,
    }
  ];

  const patients = data.recent || [];

  // 🔥 Safe calculations (NO NaN)
  const totalBeds = rooms.reduce((sum, r) => sum + (r.beds || 0), 0);
  const occupiedBeds = rooms.reduce((sum, r) => sum + (r.occupied || 0), 0);
  const availableBeds = totalBeds - occupiedBeds;

  const icuRooms = rooms.filter(r => r.type === "ICU");
  const icuOccupied = icuRooms.reduce((sum, r) => sum + (r.occupied || 0), 0);
  const icuBeds = icuRooms.reduce((sum, r) => sum + (r.beds || 0), 0);

  return (
    <div>

      <SectionHeader
        title="Admin Dashboard"
        subtitle="PulseNet Hospital Management Overview"
      />

      {/* 🔥 TOP STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats?.filter(Boolean).map(s => (
          <Card key={s?.title ?? Math.random()} className="p-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">{s?.title ?? "N/A"}</p>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{s?.value ?? 0}</h2>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* 🔥 BED OCCUPANCY */}
        <Card title="Bed Occupancy" className="lg:col-span-2">
          <div className="p-5">

            {/* 🔥 TOP BOXES */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              {[
                ['Total Beds', totalBeds, 'blue'],
                ['Occupied', occupiedBeds, 'amber'],
                ['Available', availableBeds, 'green'],
                ['ICU', icuBeds ? `${icuOccupied}/${icuBeds}` : '0/0', 'rose']
              ]?.filter(Boolean).map(([k, v, c]) => {

                const colorMap = {
                  blue: 'bg-blue-50',
                  amber: 'bg-amber-50',
                  green: 'bg-green-50',
                  rose: 'bg-rose-50',
                };

                return (
                  <div key={k ?? Math.random()} className={`p-3 rounded-xl text-center ${colorMap[c] ?? "bg-slate-50"}`}>
                    <p className="text-xl font-bold text-slate-900 ">{v ?? 0}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{k ?? "N/A"}</p>
                  </div>
                );
              })}
            </div>

            {/* 🔥 ROOM LIST */}
            <div className="space-y-2">
              {rooms?.filter(Boolean).map(r => {

                const status = (r?.occupied ?? 0) >= (r?.beds ?? 0) ? "Full" : "Available";

                return (
                  <div key={r?.number ?? Math.random()} className="flex items-center gap-3">

                    <span className="text-xs font-mono w-16 text-slate-700 dark:text-slate-300">{r?.number ?? "N/A"}</span>
                    <span className="text-xs w-20 text-slate-700 dark:text-slate-300">{r?.type ?? "N/A"}</span>

                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full ${status === 'Full' ? 'bg-rose-400' : 'bg-emerald-400'}`}
                        style={{
                          width: r?.beds ? `${(r.occupied / r.beds) * 100}%` : "0%"
                        }}
                      />
                    </div>

                    <span className="text-xs w-10 text-slate-700 dark:text-slate-300">
                      {r?.occupied ?? 0}/{r?.beds ?? 0}
                    </span>

                    <Badge variant={status === 'Full' ? 'red' : 'green'}>
                      {status}
                    </Badge>

                  </div>
                );
              })}
            </div>

          </div>
        </Card>

        {/* 🔥 RECENT ADMISSIONS */}
        <Card title="Recent Admissions">
          <div className="p-4 space-y-3">
            {patients?.filter(Boolean).map(p => (
              <div key={p?._id ?? Math.random()} className="flex items-center gap-3 py-2 border-b border-slate-100 dark:border-slate-700">

                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                  {(p?.patientId ?? "").slice(-2)}
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{p?.patientId ?? "N/A"}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {p?.roomNumber ?? "N/A"} · {p?.admissionDate ? new Date(p.admissionDate).toLocaleDateString() : "N/A"}
                  </p>
                </div>

                <Badge variant="green">Admitted</Badge>

              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
}

export function UserManagement() {
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);


  const [newUser, setNewUser] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "",
    phone: ""
  });

  // 🔥 Fetch staff users
  useEffect(() => {
    fetch(`${BASE}/api/staff`)
      .then(res => {
        if (!res.ok) throw new Error("API failed");
        return res.json();
      })
      .then(data => {
        console.log("Users:", data);
        setUsers(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error(err);
        setUsers([]);
      });
  }, []);
  const addUser = async () => {
    if (!newUser.fullname || !newUser.email || !newUser.password || !newUser.role) {
      alert("Fill all fields ❌");
      return;
    }

    const res = await fetch(`${BASE}/api/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newUser)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("User added ✅");

    // 🔥 update UI instantly
    setUsers(prev => [...prev, {
      ...newUser,
      customId: data.user.id,
      _id: Date.now()
    }]);

    // reset form
    setNewUser({
      fullname: "",
      email: "",
      password: "",
      role: "",
      phone: ""
    });

    setShow(false);
  };
  const deleteUser = async (id) => {
    await fetch(`${BASE}/api/user/${id}`, {
      method: "DELETE"
    });

    setUsers(prev => prev.filter(u => u._id !== id));
  };
  return (
    <div>
      <SectionHeader
        title="User Management"
        action={
          <button className="btn-primary" onClick={() => setShow(true)}>
            + Add User
          </button>
        }
      />

      <Card>
        <div className="overflow-x-auto">
          <Table headers={['ID', 'Name', 'Email', 'Role', 'Phone', 'Action']}>

            {users?.filter(Boolean).map(user => (
              <tr key={user?._id ?? Math.random()} className="border-b hover:bg-slate-50 transition">

                <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{user?.customId ?? "N/A"}</td>
                <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">{user?.fullname ?? "N/A"}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{user?.email ?? "N/A"}</td>

                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">
                    {user?.role ?? "N/A"}
                  </span>
                </td>

                <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{user?.phone ?? "N/A"}</td>

                <td className="px-4 py-3">
                  <button
                    onClick={() => deleteUser(user?._id)}
                    className="bg-red-100 text-red-600 px-3 py-1 rounded text-xs hover:bg-red-200"
                  >
                    Remove
                  </button>
                </td>

              </tr>
            ))}

          </Table>
          {show && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md shadow-lg border border-slate-100 dark:border-slate-700">

                <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">Add New User</h2>

                <div className="flex flex-col gap-3">

                  <input
                    placeholder="Full Name"
                    className="form-input"
                    value={newUser.fullname}
                    onChange={(e) => setNewUser({ ...newUser, fullname: e.target.value })}
                  />

                  <input
                    placeholder="Email"
                    className="form-input"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />

                  <input
                    placeholder="Password"
                    type="password"
                    className="form-input"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  />

                  <select
                    className="form-input"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  >
                    <option value="">Select Role</option>
                    <option value="doctor">Doctor</option>
                    <option value="nurse">Nurse</option>
                    <option value="lab">Lab</option>
                    <option value="pharmacy">Pharmacy</option>
                  </select>

                  <input
                    placeholder="Phone"
                    className="form-input"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  />

                </div>

                <div className="flex justify-end gap-2 mt-5">

                  <button
                    onClick={() => setShow(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={addUser}
                    className="btn-primary"
                  >
                    Add
                  </button>

                </div>

              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export function PatientManagement() {
  const [forms, setForms] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch(`${BASE}/api/admission-form`).then(res => res.json()),
      fetch(`${BASE}/api/doctors`).then(res => res.json()),
      fetch(`${BASE}/api/rooms`).then(res => res.json())
    ])
    .then(([forms, doctors, rooms]) => {
      setForms(forms);
      setDoctors(doctors);
      setRooms(rooms);
    })
    .catch(err => console.error("PatientManagement fetch error:", err));
  }, []);
  const approve = async (form) => {
    if (!form.selectedDoctor) {
      alert("Select doctor ❌");
      return;
    }

    if (!form.selectedRoom) {
      alert("Select room ❌");
      return;
    }

    await fetch(`${BASE}/api/admission/approve/${form._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        doctorId: form.selectedDoctor,
        roomNumber: form.selectedRoom
      })
    });

    alert("Approved ✅");

    setForms(prev =>
      prev.map(f =>
        f._id === form._id
          ? {
            ...f,
            status: "approved",
            selectedDoctor: form.selectedDoctor,
            selectedRoom: form.selectedRoom
          }
          : f
      )
    );
  };
  const cancelAdmission = async (form) => {
    await fetch(`${BASE}/api/admission/cancel/${form._id}`, {
      method: "DELETE"
    });

    alert("Cancelled ❌");


    // ✅ IF YOU DELETE FORM → remove from UI
    setForms(prev => prev.filter(f => f._id !== form._id));
  };
  return (
    <div>
      <SectionHeader title="Patient Management" action={<button className="btn-primary flex items-center gap-2"><Plus size={14} /> New Admission</button>} />
      <Card>
        <div className="overflow-x-auto">
          <Table headers={['Patient ID', 'Name', 'Age', 'Room', 'Doctor', 'Diagnosis', 'Status', 'Action']}>

            {forms?.filter(Boolean).map(form => (
              <tr key={form?._id ?? Math.random()} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">

                {/* Patient ID */}
                <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{form?.patientId ?? "N/A"}</td>

                {/* Name */}
                <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">{form?.fullname ?? "N/A"}</td>

                {/* Age */}
                <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{form?.age ?? "N/A"}</td>

                {/* Room */}
                <td className="px-4 py-3">
                  {(form?.status ?? "") === "approved" ? (
                    <span className="text-blue-600 font-medium">
                      {form?.selectedRoom ?? "N/A"}
                    </span>
                  ) : (
                    <select
                      className="form-input w-36"
                      value={form?.selectedRoom || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setForms(prev =>
                          prev.map(f =>
                            f._id === form._id ? { ...f, selectedRoom: value } : f
                          )
                        );
                      }}
                    >
                      <option value="">Select</option>

                      {rooms?.filter(Boolean).map(room => {
                        const isFull = (room?.occupied ?? 0) >= (room?.beds ?? 0);

                        return (
                          <option
                            key={room?.number ?? Math.random()}
                            value={room?.number ?? ""}
                            disabled={isFull}   // 🔥 prevent full rooms
                          >
                            {room?.number ?? "N/A"} ({room?.type ?? "N/A"}) {isFull ? "❌ Full" : ""}
                          </option>
                        );
                      })}
                    </select>
                  )}
                </td>

                {/* Doctor */}
                <td className="px-4 py-3">
                  {(form?.status ?? "") === "approved" ? (
                    <span className="text-purple-600 font-medium">
                      {form?.selectedDoctor ?? "N/A"}
                    </span>
                  ) : (
                    <select
                      className="form-input w-32"
                      value={form?.selectedDoctor ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setForms(prev =>
                          prev.map(f =>
                            f._id === form._id ? { ...f, selectedDoctor: value } : f
                          )
                        );
                      }}
                    >
                      <option value="">Select</option>
                      {doctors?.filter(Boolean).map(doc => (
                        <option key={doc?.customId ?? Math.random()} value={doc?.customId ?? ""}>
                          {doc?.fullname ?? "N/A"}
                        </option>
                      ))}
                    </select>
                  )}
                </td>

                {/* Diagnosis */}
                <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{form?.chiefComplaint ?? "N/A"}</td>

                {/* Status */}
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${(form?.status ?? "") === "approved"
                      ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                      : "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400"
                      }`}
                  >
                    {form?.status ?? "pending"}
                  </span>
                </td>

                {/* Action */}
                <td className="px-4 py-3">
                  {(form?.status ?? "") === "approved" ? (
                    <button
                      onClick={() => cancelAdmission(form)}
                      className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-1 rounded text-xs hover:bg-red-200 dark:hover:bg-red-900/40"
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      onClick={() => approve(form)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                      Approve
                    </button>
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

export function RoomManagement() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetch(`${BASE}/api/rooms`)
      .then(res => res.json())
      .then(setRooms)
      .catch(err => console.error("Rooms fetch error:", err));
  }, []);
  return (
    <div>
      <SectionHeader title="Room Management" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
        {rooms?.filter(Boolean).map(r => {
          const status = (r?.occupied ?? 0) >= (r?.beds ?? 0) ? "Full" : "Available";

          return (
            <Card key={r?.number ?? Math.random()} className="p-4">

              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-lg font-bold dark:text-blue-200" >{r?.number ?? "N/A"}</span>
                  <span className="ml-2 text-xs text-slate-400">{r?.type ?? "N/A"}</span>
                </div>

                <Badge variant={status === 'Full' ? 'red' : 'green'}>
                  {status}
                </Badge>
              </div>

              <div className="h-2 rounded-full bg-slate-100 mb-3 overflow-hidden">
                <div
                  className={`h-full ${status === 'Full' ? 'bg-rose-400' : 'bg-emerald-400'}`}
                  style={{
                    width: r?.beds ? `${(r.occupied / r.beds) * 100}%` : "0%"
                  }}
                />
              </div>

              <div className="flex justify-between text-xs text-slate-500">
                <span className="text-slate-500 dark:text-slate-400">{r?.occupied ?? 0} of {r?.beds ?? 0} beds occupied</span>

                <button className="text-blue-500 hover:text-blue-600 font-semibold">
                  Manage
                </button>
              </div>

            </Card>
          );
        })}
      </div>
    </div>
  );
}

export function ChargesManagement() {
  const [charges, setCharges] = useState([]);
  const [show, setShow] = useState(false);
  const [newCharge, setNewCharge] = useState({ name: "", type: "", amount: "" });

  useEffect(() => {
    fetch(`${BASE}/api/charges`)
      .then(res => res.json())
      .then(setCharges)
      .catch(err => console.error("Charges fetch error:", err));
  }, []);

  const addCharge = async () => {
    if (!newCharge.name || !newCharge.type || !newCharge.amount) {
      alert("Fill all fields ❌");
      return;
    }
    const res = await fetch(`${BASE}/api/charges/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCharge)
    });
    const data = await res.json();
    setCharges(prev => [...prev, data]);
    setNewCharge({ name: "", type: "", amount: "" });
    setShow(false);
  };

  const deleteCharge = async (id) => {
    await fetch(`${BASE}/api/charges/${id}`, { method: "DELETE" });
    setCharges(prev => prev.filter(c => c._id !== id));
  };

  return (
    <div>
      <SectionHeader title="Charges Management" action={
        <button className="btn-primary flex items-center gap-2" onClick={() => setShow(true)}>
          <Plus size={14} /> Add Charge
        </button>
      } />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {['Room', 'Test', 'Consultation'].map(type => (
          <Card key={type} title={`${type} Charges`}>
            <div className="p-4 space-y-2">
              {charges?.filter(c => (c?.type ?? "") === type).filter(Boolean).map(c => (
                <div key={c?._id ?? Math.random()} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                  <span className="text-sm text-slate-700 dark:text-slate-300">{c?.name ?? "N/A"}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">₹{c?.amount ?? 0}</span>
                    <button onClick={() => deleteCharge(c?._id)} className="text-red-400 hover:text-red-600 p-1">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md shadow-lg border border-slate-100 dark:border-slate-700">
            <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">Add Charge</h2>
            <div className="flex flex-col gap-3">
              <input
                placeholder="Charge Name"
                className="form-input"
                value={newCharge.name}
                onChange={(e) => setNewCharge({ ...newCharge, name: e.target.value })}
              />
              <select
                className="form-input"
                value={newCharge.type}
                onChange={(e) => setNewCharge({ ...newCharge, type: e.target.value })}
              >
                <option value="">Select Type</option>
                <option value="Room">Room</option>
                <option value="Test">Test</option>
                <option value="Consultation">Consultation</option>
              </select>
              <input
                placeholder="Amount (₹)"
                type="number"
                className="form-input"
                value={newCharge.amount}
                onChange={(e) => setNewCharge({ ...newCharge, amount: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setShow(false)} className="btn-secondary">Cancel</button>
              <button onClick={addCharge} className="btn-primary">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function BillingManagement() {
  const [bills, setBills] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [show, setShow] = useState(false);
  const [charges, setCharges] = useState([]);
  const [newBill, setNewBill] = useState({ patientId: "", patientName: "", items: [] });
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(`${BASE}/api/bill`).then(res => res.json()),
      fetch(`${BASE}/api/charges`).then(res => res.json())
    ])
    .then(([billsData, chargesData]) => {
      setBills(Array.isArray(billsData) ? billsData : []);
      setCharges(chargesData);
      
      const ids = [...new Set(billsData.map(b => b.patientId))];
      Promise.all(ids.map(id =>
        fetch(`${BASE}/api/bill/summary/${id}`).then(r => r.json())
      )).then(results => setSummaries(results.filter(r => !r.message)));
    })
    .catch(err => console.error("Billing fetch error:", err));
  }, []);

  const addItem = () => setNewBill(prev => ({ ...prev, items: [...prev.items, { description: "", amount: "" }] }));

  const updateItem = (i, field, value) => {
    const items = [...newBill.items];
    items[i][field] = value;
    setNewBill(prev => ({ ...prev, items }));
  };

  const removeItem = (i) => setNewBill(prev => ({ ...prev, items: prev.items.filter((_, idx) => idx !== i) }));

  const totalAmount = newBill.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  const generateBill = async () => {
    if (!newBill.patientId || newBill.items.length === 0) {
      alert("Select patient and add at least one item ❌");
      return;
    }
    const res = await fetch(`${BASE}/api/bill/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newBill, totalAmount })
    });
    const data = await res.json();
    setBills(prev => [data.data, ...prev]);
    // refresh summary
    fetch(`${BASE}/api/bill/summary/${newBill.patientId}`)
      .then(r => r.json())
      .then(s => setSummaries(prev => {
        const filtered = prev.filter(x => x.patientId !== newBill.patientId);
        return s.message ? filtered : [s, ...filtered];
      }));
    setNewBill({ patientId: "", patientName: "", items: [] });
    setShow(false);
  };

  const markPaid = async (patientId) => {
    setLoadingId(patientId);
    const bill = bills.find(b => b.patientId === patientId && b.status === "unpaid");
    if (bill) {
      const res = await fetch(`${BASE}/api/bill/pay/${bill._id}`, { method: "PUT" });
      const data = await res.json();
      setBills(prev => prev.map(b => b._id === bill._id ? data : b));
      setSummaries(prev => prev.map(s => s.patientId === patientId ? { ...s, status: "paid" } : s));
    }
    setLoadingId(null);
  };

  const categoryColor = (cat) => ({
    Room: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    Consultation: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    Pharmacy: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    Manual: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300",
  })[cat] || "bg-slate-100 dark:bg-slate-700 text-slate-600";

  const totalRevenue = summaries.filter(s => s.status === "paid").reduce((sum, s) => sum + (s.totalAmount || 0), 0);
  const totalPending = summaries.filter(s => s.status === "unpaid").reduce((sum, s) => sum + (s.totalAmount || 0), 0);

  return (
    <div>
      <SectionHeader title="Billing Management" action={
        <button className="btn-primary flex items-center gap-2" onClick={() => setShow(true)}>
          <Plus size={14} /> Add Extra Charge
        </button>
      } />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Patients Billed", value: summaries?.length ?? 0, color: "text-blue-600 dark:text-blue-400" },
          { label: "Revenue Collected", value: `₹${totalRevenue ?? 0}`, color: "text-green-600 dark:text-green-400" },
          { label: "Pending Amount", value: `₹${totalPending ?? 0}`, color: "text-amber-600 dark:text-amber-400" }
        ]?.filter(Boolean).map(s => (
          <Card key={s?.label ?? Math.random()} className="p-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">{s?.label ?? "N/A"}</p>
            <h2 className={`text-xl font-bold mt-1 ${s?.color ?? ""}`}>{s?.value ?? 0}</h2>
          </Card>
        ))}
      </div>

      {/* Per-patient bill summaries */}
      <div className="space-y-4">
        {summaries?.filter(Boolean).map(summary => (
          <Card key={summary?.patientId ?? Math.random()}>
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-100">{summary?.patientName ?? summary?.patientId ?? "N/A"}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{summary?.patientId ?? "N/A"} · Admitted: {summary?.admissionDate ? new Date(summary.admissionDate).toLocaleDateString() : "N/A"} · {summary?.days ?? 0} day(s)</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  (summary?.status ?? "") === "paid"
                    ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                    : "bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
                }`}>{summary?.status ?? "unpaid"}</span>
                <p className="font-bold text-slate-800 dark:text-white">₹{summary?.totalAmount ?? 0}</p>
                {(summary?.status ?? "") === "unpaid" && (
                  <button
                    onClick={() => markPaid(summary?.patientId)}
                    disabled={loadingId === summary?.patientId}
                    className="btn-primary text-xs px-3 py-1.5"
                  >
                    Mark Paid
                  </button>
                )}
              </div>
            </div>
            <div className="p-4 space-y-2">
              {summary?.items?.filter(Boolean).map((item, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-50 dark:border-slate-700/50 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColor(item?.category ?? "Manual")}`}>{item?.category ?? "Manual"}</span>
                    <span className="text-sm text-slate-700 dark:text-slate-300">{item?.description ?? "N/A"}</span>
                    {item?.note && <span className="text-xs text-slate-400">({item.note})</span>}
                  </div>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-100">
                    {(item?.amount ?? 0) > 0 ? `₹${item.amount}` : "—"}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}
        {summaries.length === 0 && (
          <Card><p className="text-center py-10 text-sm text-slate-400 dark:text-slate-500">No admitted patients found</p></Card>
        )}
      </div>

      {/* Add Extra Charge Modal */}
      {show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-lg shadow-lg border border-slate-100 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">Add Extra Charge</h2>
            <div className="flex flex-col gap-3 mb-4">
              <input placeholder="Patient ID (e.g. PT-1001)" className="form-input" value={newBill.patientId} onChange={(e) => setNewBill({ ...newBill, patientId: e.target.value })} />
              <input placeholder="Patient Name" className="form-input" value={newBill.patientName} onChange={(e) => setNewBill({ ...newBill, patientName: e.target.value })} />
            </div>
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Items</p>
                <button onClick={addItem} className="text-xs text-blue-500 hover:text-blue-600 font-semibold">+ Add Item</button>
              </div>
              {newBill?.items?.filter(Boolean).map((item, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <select
                    className="form-input flex-1"
                    value={item?.description ?? ""}
                    onChange={(e) => {
                      const selected = charges?.find(c => c?.name === e.target.value);
                      const items = [...newBill.items];
                      items[i] = { description: e.target.value, amount: selected ? selected.amount : "" };
                      setNewBill(prev => ({ ...prev, items }));
                    }}
                  >
                    <option value="">Select charge</option>
                    {charges?.filter(Boolean).map(c => <option key={c?._id ?? Math.random()} value={c?.name ?? ""}>{c?.name ?? "N/A"} (₹{c?.amount ?? 0})</option>)}
                    <option value="custom">Custom</option>
                  </select>
                  <input placeholder="₹" type="number" className="form-input w-24" value={item?.amount ?? ""} onChange={(e) => updateItem(i, "amount", e.target.value)} />
                  <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
            {newBill.items.length > 0 && (
              <div className="text-right text-sm font-bold text-slate-800 dark:text-white mb-4">Total: ₹{totalAmount}</div>
            )}
            <div className="flex justify-end gap-2">
              <button onClick={() => setShow(false)} className="btn-secondary">Cancel</button>
              <button onClick={generateBill} className="btn-primary">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminReports() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch(`${BASE}/api/logs`)
      .then(res => res.json())
      .then(setLogs)
      .catch(err => console.error("Logs fetch error:", err));
  }, []);

  return (
    <div>
      <SectionHeader title="Activity Logs" />
      <Card>
        <div className="p-5">
          {logs.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-6">No activity yet</p>
          ) : (
          <div className="relative">
            <div className="absolute left-3.5 top-0 bottom-0 w-px bg-slate-100 dark:bg-slate-700" />
            <div className="space-y-4">
              {logs?.filter(Boolean).map((log) => (
                <div key={log?._id ?? Math.random()} className="flex gap-4 relative">
                  <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-900/30 border-2 border-white dark:border-slate-800 flex items-center justify-center z-10 shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{log?.action ?? "N/A"}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{log?.detail ?? "N/A"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                          {log?.createdAt ? new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A"}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{log?.user ?? "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          )}
        </div>
      </Card>
    </div>
  );
}
