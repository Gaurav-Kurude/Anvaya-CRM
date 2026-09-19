import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "./Sidebar";

const LeadStatusView = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // --------------------------------------------------
  // Data
  // --------------------------------------------------
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);

  // --------------------------------------------------
  // Filters
  // --------------------------------------------------
  const [statusFilter, setStatusFilter] = useState("New");
  const [agentFilter, setAgentFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortBy, setSortBy] = useState("");

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------
  const [loading, setLoading] = useState(true);

  // --------------------------------------------------
  // Status options
  // --------------------------------------------------
  const statuses = ["New", "Contacted", "Qualified", "Proposal Sent", "Closed"];

  // --------------------------------------------------
  // Read filters from URL
  // --------------------------------------------------
  useEffect(() => {
    setStatusFilter(searchParams.get("status") || "New");
    setAgentFilter(searchParams.get("salesAgent") || "");
    setPriorityFilter(searchParams.get("priority") || "");
    setSortBy(searchParams.get("sort") || "");
  }, [searchParams]);

  // --------------------------------------------------
  // Update URL
  // --------------------------------------------------
  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    setSearchParams(params);
  };

  // --------------------------------------------------
  // Fetch leads and sales agents
  // --------------------------------------------------
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

        console.log("Lead Status View - Leads:", leadsData);
        console.log("Lead Status View - Agents:", agentsData);

        if (leadsResponse.ok) {
          setLeads(Array.isArray(leadsData.leads) ? leadsData.leads : []);
        }

        if (agentsResponse.ok) {
          setAgents(Array.isArray(agentsData.agents) ? agentsData.agents : []);
        }
      } catch (error) {
        console.error("Error fetching leads and agents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --------------------------------------------------
  // Filter and sort leads
  // --------------------------------------------------
  const filteredLeads = leads
    // Filter by Status
    .filter((lead) => {
      return lead.status === statusFilter;
    })

    // Filter by Sales Agent
    .filter((lead) => {
      if (!agentFilter) {
        return true;
      }

      return lead.salesAgent?._id === agentFilter;
    })

    // Filter by Priority
    .filter((lead) => {
      if (!priorityFilter) {
        return true;
      }

      return lead.priority === priorityFilter;
    })

    // Sort by Time to Close
    .sort((a, b) => {
      if (sortBy === "timeToClose") {
        return Number(a.timeToClose || 0) - Number(b.timeToClose || 0);
      }

      return 0;
    });

  // --------------------------------------------------
  // Loading state
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="container-fluid">
        <div className="row min-vh-100">
          <Sidebar />

          <main className="col-12 col-md-9 col-lg-10 p-3 p-md-4">
            <div className="d-flex justify-content-center align-items-center py-5">
              <p className="text-muted mb-0">Loading leads...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Page
  // --------------------------------------------------
  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="col-12 col-md-9 col-lg-10 p-3 p-md-4">
          {/* Header */}
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
            <div>
              <h2 className="mb-1">Leads by Status</h2>

              <p className="text-muted mb-0">
                View and manage leads based on their status
              </p>
            </div>

            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => navigate("/")}
            >
              Back to Dashboard
            </button>
          </div>

          {/* Status Selection */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <label className="form-label fw-semibold">Status</label>

              <div className="d-flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <button
                    key={status}
                    type="button"
                    className={`btn ${
                      statusFilter === status
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => updateFilter("status", status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="card shadow-sm mb-4">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Status: {statusFilter}</h5>

                <span className="badge text-bg-secondary">
                  {filteredLeads.length} Leads
                </span>
              </div>
            </div>

            {/* Filters */}
            <div className="card-body border-bottom">
              <div className="row">
                {/* Sales Agent */}
                <div className="col-12 col-md-4 mb-3 mb-md-0">
                  <label className="form-label">Sales Agent</label>

                  <select
                    className="form-select"
                    value={agentFilter}
                    onChange={(event) =>
                      updateFilter("salesAgent", event.target.value)
                    }
                  >
                    <option value="">All Sales Agents</option>

                    {agents.map((agent) => (
                      <option key={agent._id} value={agent._id}>
                        {agent.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority */}
                <div className="col-12 col-md-4 mb-3 mb-md-0">
                  <label className="form-label">Priority</label>

                  <select
                    className="form-select"
                    value={priorityFilter}
                    onChange={(event) =>
                      updateFilter("priority", event.target.value)
                    }
                  >
                    <option value="">All Priorities</option>

                    <option value="High">High</option>

                    <option value="Medium">Medium</option>

                    <option value="Low">Low</option>
                  </select>
                </div>

                {/* Sort */}
                <div className="col-12 col-md-4">
                  <label className="form-label">Sort by</label>

                  <select
                    className="form-select"
                    value={sortBy}
                    onChange={(event) =>
                      updateFilter("sort", event.target.value)
                    }
                  >
                    <option value="">Default</option>

                    <option value="timeToClose">Time to Close</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Lead List */}
            <div className="card-body p-0">
              {filteredLeads.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-muted mb-0">
                    No leads found for this status.
                  </p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {filteredLeads.map((lead) => (
                    <div key={lead._id} className="list-group-item p-3">
                      <div className="row align-items-center g-3">
                        {/* Lead */}
                        <div className="col-12 col-sm-6 col-lg-3">
                          <small className="text-muted d-block">Lead</small>

                          <strong>{lead.name}</strong>
                        </div>

                        {/* Status */}
                        <div className="col-6 col-sm-3 col-lg-2">
                          <small className="text-muted d-block">Status</small>

                          <span className="badge text-bg-primary">
                            {lead.status}
                          </span>
                        </div>

                        {/* Sales Agent */}
                        <div className="col-6 col-sm-3 col-lg-2">
                          <small className="text-muted d-block">
                            Sales Agent
                          </small>

                          <span>{lead.salesAgent?.name || "Not Assigned"}</span>
                        </div>

                        {/* Priority */}
                        <div className="col-6 col-sm-4 col-lg-2">
                          <small className="text-muted d-block">Priority</small>

                          <span>{lead.priority || "Medium"}</span>
                        </div>

                        {/* Time to Close */}
                        <div className="col-6 col-sm-4 col-lg-2">
                          <small className="text-muted d-block">
                            Time to Close
                          </small>

                          <span>{lead.timeToClose} Days</span>
                        </div>

                        {/* View */}
                        <div className="col-12 col-sm-4 col-lg-1">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary w-100"
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
        </main>
      </div>
    </div>
  );
};

export default LeadStatusView;
