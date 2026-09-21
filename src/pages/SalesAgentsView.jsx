import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const SalesAgentsView = () => {
  const navigate = useNavigate();

  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // Fetch Sales Agents
  // --------------------------------------------------
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "https://major-project-two-backend-zeta.vercel.app/sales-agents",
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setAgents(Array.isArray(data.agents) ? data.agents : []);
        } else {
          setAgents([]);

          setError(data.message || "Failed to fetch sales agents.");
        }
      } catch (error) {
        console.error("Error fetching sales agents:", error);

        setAgents([]);
        setError("Unable to load sales agents.");
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  // --------------------------------------------------
  // Open leads for a particular sales agent
  // --------------------------------------------------
  const handleViewLeads = (agentId) => {
    navigate(`/sales-agents/leads?agentId=${agentId}`);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="col-12 col-md-9 col-lg-10 p-3 p-md-4 dashboard-content">
          <div className="border rounded p-4">
            {/* Header */}
            <div className="sales-agent-header">
              <h2 className="sales-agent-title mb-0">Sales Agent Management</h2>

              <button
                type="button"
                className="btn btn-primary btn-sm sales-agent-add-btn"
                onClick={() => navigate("/sales-agents/new")}
              >
                Add New Agent
              </button>
            </div>

            <hr />

            {/* Loading */}
            {loading && <p>Loading agents...</p>}

            {/* Error */}
            {!loading && error && (
              <div className="alert alert-danger">{error}</div>
            )}

            {/* No Agents */}
            {!loading && !error && agents.length === 0 && (
              <p className="text-muted">No sales agents found.</p>
            )}

            {/* Agent List */}
            {!loading && !error && agents.length > 0 && (
              <div>
                {agents.map((agent) => (
                  <div key={agent._id} className="border rounded p-3 mb-3">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                      {/* Agent Information */}
                      <div>
                        <h5 className="mb-1">{agent.name}</h5>

                        <p className="mb-0 text-muted">{agent.email}</p>
                      </div>

                      {/* View Leads Button */}
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleViewLeads(agent._id)}
                      >
                        View Leads
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAgentsView;
