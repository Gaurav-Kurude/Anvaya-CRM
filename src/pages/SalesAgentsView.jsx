import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const SalesAgentsView = () => {
  const navigate = useNavigate();

  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "https://major-project-two-backend-zeta.vercel.app/sales-agents",
        );

        const data = await response.json();

        // console.log("Sales Agents API response:", data);

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
        // Stop loading after API request is completed
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="col-12 col-md-9 col-lg-10 p-3 p-md-4">
          <div className="border rounded p-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Sales Agent Management</h2>

              <button
                className="btn btn-primary"
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
            {!loading &&
              !error &&
              agents.length > 0 &&
              agents.map((agent) => (
                <div key={agent._id} className="border rounded p-3 mb-3">
                  <h5 className="mb-1">{agent.name}</h5>

                  <p className="mb-0 text-muted">{agent.email}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAgentsView;
