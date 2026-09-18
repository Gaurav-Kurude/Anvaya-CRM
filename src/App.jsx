import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Dashboard from "./pages/Dashboard";

import LeadsView from "./pages/LeadsView";
import LeadForm from "./pages/LeadForm";
import LeadEditForm from "./pages/LeadEditForm";
import LeadDetailsView from "./pages/LeadDetailsView";
import LeadStatusView from "./components/LeadStatusView";

import SalesAgentsView from "./pages/SalesAgentsView";
import SalesAgentForm from "./pages/SalesAgentForm";
import SalesAgentView from "./pages/SalesAgentView";

import ReportsView from "./pages/ReportsView";

import "./App.css";

function App() {
  return (
    <>
      <Routes>
        {/* =========================
            Dashboard
        ========================== */}
        <Route path="/" element={<Dashboard />} />

        {/* =========================
            Leads
        ========================== */}

        {/* All Leads */}
        <Route path="/leads" element={<LeadsView />} />

        {/* Create New Lead */}
        <Route path="/leads/new" element={<LeadForm />} />

        <Route path="/leads/edit/:leadId" element={<LeadEditForm />} />

        {/* Lead Status View */}
        <Route path="/leads/status" element={<LeadStatusView />} />

        {/* Lead Details */}
        <Route path="/leads/:leadId" element={<LeadDetailsView />} />

        {/* =========================
            Sales Agents
        ========================== */}

        {/* Sales Agent List */}
        <Route path="/sales-agents" element={<SalesAgentsView />} />

        {/* Create New Sales Agent */}
        <Route path="/sales-agents/new" element={<SalesAgentForm />} />

        {/* Leads by Sales Agent */}
        <Route path="/sales-agents/leads" element={<SalesAgentView />} />

        {/* =========================
            Reports
        ========================== */}

        <Route path="/reports" element={<ReportsView />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

export default App;
