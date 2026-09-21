import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const SalesAgentView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get selected sales agent ID from URL
  const agentId = searchParams.get("agentId");

  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [tags, setTags] = useState([]);

  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [sortBy, setSortBy] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch leads, agents and tags
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [leadsResponse, agentsResponse, tagsResponse] = await Promise.all(
          [
            fetch("https://major-project-two-backend-zeta.vercel.app/leads"),
            fetch(
              "https://major-project-two-backend-zeta.vercel.app/sales-agents",
            ),
            fetch("https://major-project-two-backend-zeta.vercel.app/tags"),
          ],
        );

        const leadsData = await leadsResponse.json();
        const agentsData = await agentsResponse.json();
        const tagsData = await tagsResponse.json();

        if (!leadsResponse.ok) {
          throw new Error(leadsData.message || "Failed to fetch leads.");
        }

        if (!agentsResponse.ok) {
          throw new Error(
            agentsData.message || "Failed to fetch sales agents.",
          );
        }

        if (!tagsResponse.ok) {
          throw new Error(tagsData.message || "Failed to fetch tags.");
        }

        // Store API data safely as arrays
        setLeads(Array.isArray(leadsData.leads) ? leadsData.leads : []);

        setAgents(Array.isArray(agentsData.agents) ? agentsData.agents : []);

        setTags(Array.isArray(tagsData.tags) ? tagsData.tags : []);
      } catch (error) {
        console.error("Error fetching sales agent data:", error);

        setError(error.message || "Failed to load sales agent data.");

        setLeads([]);
        setAgents([]);
        setTags([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Find selected sales agent
  const selectedAgent = agents.find((agent) => agent._id === agentId);

  // Get only leads belonging to selected sales agent
  const agentLeads = leads.filter((lead) => lead.salesAgent?._id === agentId);

  // Filter selected agent's leads
  const filteredLeads = agentLeads.filter((lead) => {
    const statusMatches = !selectedStatus || lead.status === selectedStatus;

    const tagMatches = !selectedTag || lead.tags?.includes(selectedTag);

    return statusMatches && tagMatches;
  });

  // Sort selected agent's leads
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (sortBy === "status") {
      return a.status.localeCompare(b.status);
    }

    if (sortBy === "priority") {
      const priorityOrder = {
        High: 1,
        Medium: 2,
        Low: 3,
      };

      return (
        (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2)
      );
    }

    return 0;
  });

  // Available statuses
  const statuses = ["New", "Contacted", "Qualified", "Proposal Sent", "Closed"];

  // Loading state
  if (loading) {
    return (
      <div className="container-fluid">
        <div className="row">
          <Sidebar />

          <div className="col-12 col-md-9 col-lg-10 p-4">
            <p>Loading sales agent data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container-fluid">
        <div className="row">
          <Sidebar />

          <div className="col-12 col-md-9 col-lg-10 p-4">
            <div className="alert alert-danger">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  // Agent ID is missing
  if (!agentId) {
    return (
      <div className="container-fluid">
        <div className="row">
          <Sidebar />

          <div className="col-12 col-md-9 col-lg-10 p-4">
            <div className="alert alert-warning">No sales agent selected.</div>

            <button
              className="btn btn-primary"
              onClick={() => navigate("/sales-agents")}
            >
              Back to Sales Agents
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Selected agent not found
  if (!selectedAgent) {
    return (
      <div className="container-fluid">
        <div className="row">
          <Sidebar />

          <div className="col-12 col-md-9 col-lg-10 p-4">
            <div className="alert alert-warning">Sales agent not found.</div>

            <button
              className="btn btn-primary"
              onClick={() => navigate("/sales-agents")}
            >
              Back to Sales Agents
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="col-12 col-md-9 col-lg-10 p-3 p-md-4">
          {/* Page Header */}
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <div>
              <h2 className="mb-1">Leads by Sales Agent</h2>

              <p className="text-muted mb-0">
                Showing leads assigned to <strong>{selectedAgent.name}</strong>
              </p>
            </div>

            <button
              className="btn btn-outline-primary"
              onClick={() => navigate("/sales-agents")}
            >
              Back to Sales Agents
            </button>
          </div>

          {/* Agent Information */}
          <div className="card mb-4">
            <div className="card-body">
              <h4 className="mb-1">{selectedAgent.name}</h4>

              <p className="text-muted mb-2">{selectedAgent.email}</p>

              <span className="badge bg-primary">
                {agentLeads.length} Total Leads
              </span>
            </div>
          </div>

          {/* Filters and Sorting */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row">
                {/* Status Filter */}
                <div className="col-12 col-md-4 mb-3 mb-md-0">
                  <label className="form-label">Filter by Status</label>

                  <select
                    className="form-select"
                    value={selectedStatus}
                    onChange={(event) => setSelectedStatus(event.target.value)}
                  >
                    <option value="">All Statuses</option>

                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tag Filter */}
                <div className="col-12 col-md-4 mb-3 mb-md-0">
                  <label className="form-label">Filter by Tag</label>

                  <select
                    className="form-select"
                    value={selectedTag}
                    onChange={(event) => setSelectedTag(event.target.value)}
                  >
                    <option value="">All Tags</option>

                    {tags.map((tag) => (
                      <option key={tag._id} value={tag.name}>
                        {tag.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div className="col-12 col-md-4">
                  <label className="form-label">Sort Leads By</label>

                  <select
                    className="form-select"
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                  >
                    <option value="">Default</option>

                    <option value="status">Status</option>

                    <option value="priority">Priority</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Leads */}
          <div className="card">
            <div className="card-header">
              <strong>Assigned Leads ({sortedLeads.length})</strong>
            </div>

            <div className="card-body">
              {sortedLeads.length === 0 ? (
                <p className="text-muted mb-0">
                  No leads found for this sales agent.
                </p>
              ) : (
                sortedLeads.map((lead) => (
                  <div key={lead._id} className="card mb-3">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                        <h5 className="card-title mb-3">{lead.name}</h5>

                        <span className="badge bg-secondary">
                          {lead.status}
                        </span>
                      </div>

                      <p className="mb-2">
                        <strong>Status:</strong> {lead.status}
                      </p>

                      <p className="mb-2">
                        <strong>Time to Close:</strong> {lead.timeToClose} days
                      </p>

                      <p className="mb-2">
                        <strong>Priority:</strong> {lead.priority || "Medium"}
                      </p>

                      <p className="mb-3">
                        <strong>Tags:</strong>{" "}
                        {lead.tags?.length > 0
                          ? lead.tags.join(", ")
                          : "No tags"}
                      </p>

                      <button
                        className="btn btn-primary"
                        onClick={() => navigate(`/leads/${lead._id}`)}
                      >
                        View Lead
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAgentView;
