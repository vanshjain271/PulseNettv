import { useState,useEffect } from "react";
import React from 'react';
import Layout from './components/layout/Layout';
import { useRole } from './context/RoleContext';
// Patient Pages
import {
  PatientDashboard, PatientReports, PatientMedications,
  AdmissionDetails, AdmissionForm, PatientBills
} from './pages/patient/PatientPages';

// Nurse Pages
import {
  NurseDashboard, NursePatients, VitalsEntry,
  MedicationEntry, NurseTasks
} from './pages/nurse/NursePages';

// Doctor Pages
import { DoctorDashboard, DoctorPatients, DoctorPrescriptions } from './pages/doctor/DoctorPages';

// Pharmacy Pages
import {
  PharmacyDashboard, PharmacyPrescriptions,
  MedicineInventory, PharmacyBilling
} from './pages/pharmacy/PharmacyPages';

// Lab Pages
import { LabDashboard , LabReports, LabBilling } from './pages/lab/LabPages';

// Admin Pages
import {
  AdminDashboard, UserManagement, PatientManagement,
  RoomManagement, ChargesManagement, AdminReports, BillingManagement
} from './pages/admin/AdminPages';

// Shared
import SettingsPage from './pages/shared/Settings';

const PAGE_MAP = {
  patient: {
    dashboard: PatientDashboard,
    'my-reports': PatientReports,
    medications: PatientMedications,
    admission: AdmissionDetails,
    'admission-form': AdmissionForm,
    bills: PatientBills,
    settings: SettingsPage,
  },
  nurse: {
    dashboard: NurseDashboard,
    patients: NursePatients,
    vitals: VitalsEntry,
    'medication-entry': MedicationEntry,
    tasks: NurseTasks,
    settings: SettingsPage,
  },
  doctor: {
    dashboard: DoctorDashboard,
    patients: DoctorPatients,
    prescriptions: DoctorPrescriptions,
    settings: SettingsPage,
  },
  pharmacy: {
    dashboard: PharmacyDashboard,
    prescriptions: PharmacyPrescriptions,
    inventory: MedicineInventory,
    billing: PharmacyBilling,
    settings: SettingsPage,
  },
  lab: {
    dashboard: LabDashboard,
     
    reports: LabReports,
    billing: LabBilling,
    settings: SettingsPage,
  },
  admin: {
    dashboard: AdminDashboard,
    'user-management': UserManagement,
    'patient-management': PatientManagement,
    'room-management': RoomManagement,
    charges: ChargesManagement,
    billing: BillingManagement,
    reports: AdminReports,
    settings: SettingsPage,
  },
};
 
function AppContent() {
  const { role, activePage } = useRole();

  const pages = PAGE_MAP[role] || {};
  const Component =
    pages[activePage] ||
    pages["dashboard"] ||
    (() => <div className="p-8 text-slate-400">Page not found</div>);

  return (
    <Layout>
      <Component />
    </Layout>
  );
}

function App() {
  const { switchRole } = useRole();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      // 🔥 not logged in → go to auth page
      window.location.href = "/auth.html";
      return null;
    } else {
      // 🔥 logged in → set role
      switchRole(user.role);
    }
  }, []);

  return <AppContent />;
}

export default App;
