import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const SalesAgentsView = () => {
  const navigate = useNavigate();

  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch(
          "https://major-project-two-backend-zeta.vercel.app/sales-agents",
        );

        const data = await response.json();

        if (response.ok) {
          setAgents(data.agents || []);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching sales agents:", error);
      }
    };

    fetchAgents();
  }, []);

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        {/* Sidebar */}
        <Sidebar/>

        {/* Sales Agent List */}
        <div className="col-md-9">
          <div className="border rounded p-4">
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

            {loading ? (
              <p>Loading agents...</p>
            ) : agents.length === 0 ? (
              <p className="text-muted">No sales agents found.</p>
            ) : (
              agents.map((agent) => (
                <div key={agent._id} className="border rounded p-3 mb-3">
                  <h5 className="mb-1">{agent.name}</h5>
                  <p className="mb-0 text-muted">{agent.email}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAgentsView;
