import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const LeadsView = () => {
  const navigate = useNavigate();

  // URL search parameters
  const [searchParams, setSearchParams] = useSearchParams();

  // Leads and agents
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);

  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [agentFilter, setAgentFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Loading
  const [loading, setLoading] = useState(true);

  // --------------------------------------------------
  // Read filters from URL
  // --------------------------------------------------
  useEffect(() => {
    setStatusFilter(searchParams.get("status") || "");
    setAgentFilter(searchParams.get("salesAgent") || "");
    setTagFilter(searchParams.get("tag") || "");
    setSourceFilter(searchParams.get("source") || "");
    setPriorityFilter(searchParams.get("priority") || "");
    setSortBy(searchParams.get("sort") || "");
  }, [searchParams]);

  // --------------------------------------------------
  // Update URL when filter changes
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

        console.log("Leads API response:", leadsData);
        console.log("Agents API response:", agentsData);

        // Set leads
        if (leadsResponse.ok) {
          console.log("Leads:", leadsData.leads);

          setLeads(Array.isArray(leadsData.leads) ? leadsData.leads : []);
        }

        // Set sales agents
        if (agentsResponse.ok) {
          setAgents(Array.isArray(agentsData.agents) ? agentsData.agents : []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --------------------------------------------------
  // Get unique tags from all leads
  // --------------------------------------------------
  const availableTags = [
    ...new Set(
      leads.flatMap((lead) => (Array.isArray(lead.tags) ? lead.tags : [])),
    ),
  ];

  // --------------------------------------------------
  // Filter and sort leads
  // --------------------------------------------------
  const filteredLeads = leads
    // Filter by Status
    .filter((lead) => {
      if (!statusFilter) {
        return true;
      }

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

    // Filter by Lead Source
    .filter((lead) => {
      if (!sourceFilter) {
        return true;
      }

      return lead.source === sourceFilter;
    })

    // Filter by Tag
    .filter((lead) => {
      if (!tagFilter) {
        return true;
      }

      return lead.tags?.includes(tagFilter);
    })

    // Sort
    .sort((a, b) => {
      // Sort by Priority
      if (sortBy === "priority") {
        const priorityOrder = {
          High: 1,
          Medium: 2,
          Low: 3,
        };

        return (
          (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99)
        );
      }

      // Sort by Time to Close
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
          {/* Page Header */}
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
            <div>
              <h2 className="mb-1">Lead List</h2>

              <p className="text-muted mb-0">Manage and filter your leads</p>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate("/leads/new")}
            >
              Add New Lead
            </button>
          </div>

          {/* Filters */}
          <div className="card shadow-sm mb-4">
            <div className="card-header">
              <h5 className="mb-0">Filters & Sorting</h5>
            </div>

            <div className="card-body">
              <div className="row">
                {/* Status Filter */}
                <div className="col-12 col-md-4 mb-3">
                  <label className="form-label">Filter by Status</label>

                  <select
                    className="form-select"
                    value={statusFilter}
                    onChange={(event) =>
                      updateFilter("status", event.target.value)
                    }
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
                <div className="col-12 col-md-4 mb-3">
                  <label className="form-label">Filter by Sales Agent</label>

                  <select
                    className="form-select"
                    value={agentFilter}
                    onChange={(event) =>
                      updateFilter("salesAgent", event.target.value)
                    }
                  >
                    <option value="">All Agents</option>

                    {agents.map((agent) => (
                      <option key={agent._id} value={agent._id}>
                        {agent.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Lead Source Filter */}
                <div className="col-12 col-md-4 mb-3">
                  <label className="form-label">Filter by Lead Source</label>

                  <select
                    className="form-select"
                    value={sourceFilter}
                    onChange={(event) =>
                      updateFilter("source", event.target.value)
                    }
                  >
                    <option value="">All Sources</option>

                    <option value="Website">Website</option>

                    <option value="Referral">Referral</option>

                    <option value="Cold Call">Cold Call</option>

                    <option value="Advertisement">Advertisement</option>

                    <option value="Email">Email</option>

                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Tag Filter */}
                <div className="col-12 col-md-4 mb-3">
                  <label className="form-label">Filter by Tag</label>

                  <select
                    className="form-select"
                    value={tagFilter}
                    onChange={(event) =>
                      updateFilter("tag", event.target.value)
                    }
                  >
                    <option value="">All Tags</option>

                    {availableTags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority Filter */}
                <div className="col-12 col-md-4 mb-3">
                  <label className="form-label">Filter by Priority</label>

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

                {/* Sort By */}
                <div className="col-12 col-md-4 mb-3">
                  <label className="form-label">Sort By</label>

                  <select
                    className="form-select"
                    value={sortBy}
                    onChange={(event) =>
                      updateFilter("sort", event.target.value)
                    }
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
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Lead Overview</h5>

                <span className="badge text-bg-secondary">
                  {filteredLeads.length} Leads
                </span>
              </div>
            </div>

            <div className="card-body p-0">
              {filteredLeads.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-muted mb-0">No leads found.</p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {filteredLeads.map((lead) => (
                    <div key={lead._id} className="list-group-item p-3">
                      <div className="row align-items-center g-3">
                        {/* Lead Name */}
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

                        {/* View Button */}
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

export default LeadsView;
