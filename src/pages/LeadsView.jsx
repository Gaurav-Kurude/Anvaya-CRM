import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LeadsView = () => {
  const navigate = useNavigate();

  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [agentFilter, setAgentFilter] = useState("");
  const [sortBy, setSortBy] = useState("");

  const [loading, setLoading] = useState(true);

  // Fetch leads and sales agents
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leadsResponse, agentsResponse] = await Promise.all([
          fetch("https://major-project-two-backend-zeta.vercel.app/leads"),
          fetch(
            "https://major-project-two-backend-zeta.vercel.app/sales-agents",
          ),
        ]);

        const leadsData = await leadsResponse.json();
        const agentsData = await agentsResponse.json();

        if (leadsResponse.ok) {
          setLeads(leadsData.leads || []);
        }

        if (agentsResponse.ok) {
          setAgents(agentsData.agents || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort leads
  const filteredLeads = leads
    .filter((lead) => {
      if (!statusFilter) {
        return true;
      }

      return lead.status === statusFilter;
    })
    .filter((lead) => {
      if (!agentFilter) {
        return true;
      }

      return lead.salesAgent?._id === agentFilter;
    })
    .sort((a, b) => {
      if (sortBy === "priority") {
        const priorityOrder = {
          High: 1,
          Medium: 2,
          Low: 3,
        };

        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }

      if (sortBy === "timeToClose") {
        return a.timeToClose - b.timeToClose;
      }

      return 0;
    });

  if (loading) {
    return (
      <div className="container mt-4">
        <p>Loading leads...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        <button
          className="btn btn-primary d-md-none m-3"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>
        {/* Sidebar */}
        <div
          className={`sidebar col-md-3 col-lg-2 bg-light p-4 ${
            sidebarOpen ? "sidebar-open" : ""
          }`}
        >
          {/* Mobile Close Button */}
          <button
            className="btn btn-sm btn-outline-secondary d-md-none mb-3"
            onClick={() => setSidebarOpen(false)}
          >
            ✕ Close
          </button>
          <h4 className="mb-4">Anvaya CRM</h4>

          <button
            className="btn btn-outline-primary w-100 mb-3"
            onClick={() => navigate("/")}
          >
            Back to Dashboard
          </button>
          {/* All Leads */}
          <button
            className="btn btn-outline-secondary w-100"
            onClick={() => {
              setSidebarOpen(false);
              navigate("/leads");
            }}
          >
            All Leads
          </button>
        </div>

        {/* Main Content */}
        <div className="col-md-9 col-lg-10 p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Lead List</h2>

            <button
              className="btn btn-primary"
              onClick={() => navigate("/leads/new")}
            >
              Add New Lead
            </button>
          </div>

          {/* Filters */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="row">
                {/* Status Filter */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Filter by Status</label>

                  <select
                    className="form-select"
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                  >
                    <option value="">All Statuses</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                {/* Sales Agent Filter */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Filter by Sales Agent</label>

                  <select
                    className="form-select"
                    value={agentFilter}
                    onChange={(event) => setAgentFilter(event.target.value)}
                  >
                    <option value="">All Agents</option>

                    {agents.map((agent) => (
                      <option key={agent._id} value={agent._id}>
                        {agent.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sorting */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Sort By</label>

                  <select
                    className="form-select"
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                  >
                    <option value="">Default</option>
                    <option value="priority">Priority</option>
                    <option value="timeToClose">Time to Close</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Lead List */}
          <div className="card shadow-sm">
            <div className="card-header">
              <h5 className="mb-0">Lead Overview</h5>
            </div>

            <div className="card-body p-0">
              {filteredLeads.length === 0 ? (
                <div className="p-4">
                  <p className="text-muted mb-0">No leads found.</p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {filteredLeads.map((lead) => (
                    <div key={lead._id} className="list-group-item p-3">
                      <div className="row align-items-center">
                        {/* Lead Name */}
                        <div className="col-md-3">
                          <strong>{lead.name}</strong>
                        </div>

                        {/* Status */}
                        <div className="col-md-2">
                          <span className="badge text-bg-primary">
                            {lead.status}
                          </span>
                        </div>

                        {/* Sales Agent */}
                        <div className="col-md-2">
                          {lead.salesAgent?.name || "Not Assigned"}
                        </div>

                        {/* Priority */}
                        <div className="col-md-2">
                          {lead.priority || "Medium"}
                        </div>

                        {/* Time to Close */}
                        <div className="col-md-2">
                          <small>{lead.timeToClose} Days</small>
                        </div>

                        {/* View Button */}
                        <div className="col-md-1">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => navigate(`/leads/${lead._id}`)}
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadsView;
