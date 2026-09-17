import { Routes, Route } from "react-router-dom";
import LeadForm from "./pages/LeadForm";
import LeadList from "./pages/LeadList";
import LeadDetails from "./pages/LeadDetails";
import LeadStatusView from "./components/LeadStatusView";
import SalesAgentView from "./pages/SalesAgentView";
import ReportsView from "./pages/ReportsView";
import Dashboard from "./pages/Dashboard";
import LeadsView from "./pages/LeadsView";
import LeadDetailsView from "./pages/LeadDetailsView";
import LeadForm2 from "./pages/LeadForm2";
import SalesAgentsView from "./pages/SalesAgentsView";
import SalesAgentForm from "./pages/SalesAgentForm";
import Reports from "./pages/Reports";
import LeadStatusView2 from "./pages/LeadStatusView2";
import SalesAgentView2 from "./components/SalesAgentView2";
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/leads" element={<LeadList />} />
        <Route path="/leads/status" element={<LeadStatusView />} />
        <Route path="/leads/:leadId" element={<LeadDetails />} />
        <Route path="/reports" element={<ReportsView />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/sales-agents" element={<SalesAgentView />} />
        <Route path="/leads" element={<LeadsView />} />
        <Route path="/leads/new" element={<LeadForm />} />
        <Route path="/leads/:leadId" element={<LeadDetailsView />} />
        <Route path="/sales-agents" element={<SalesAgentsView />} />
        <Route path="/leads/new" element={<LeadForm2 />} />
        <Route path="/agents/new" element={<SalesAgentForm />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/leads/status" element={<LeadStatusView2 />} />
        <Route path="/sales-agents/leads" element={<SalesAgentView2 />} />
      </Routes>
    </>
  );
}

export default App;
