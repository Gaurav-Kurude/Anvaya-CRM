import { useEffect, useState } from "react";

const LeadStatusView = () => {
  const [leads, setLeads] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("New");
  const [selectedAgent, setSelectedAgent] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [sortOrder, setSortOrder] = useState("default");

  const statuses = [
    "New",
    "Contacted",
    "Qualified",
    "Proposal Sent",
    "Closed",
  ];

  // Fetch leads
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch("http://localhost:5000/leads");

        const data = await response.json();

        if (response.ok) {
          setLeads(data.leads || []);
        }
      } catch (error) {
        console.error("Error fetching leads:", error);
      }
    };

    fetchLeads();
  }, []);

  // Get all unique sales agents
  const agents = [];

  leads.forEach((lead) => {
    lead.salesAgents?.forEach((agent) => {
      const alreadyExists = agents.some(
        (existingAgent) => existingAgent._id === agent._id
      );

      if (!alreadyExists) {
        agents.push(agent);
      }
    });
  });

  // Filter leads by selected status
  let filteredLeads = leads.filter(
    (lead) => lead.status === selectedStatus
  );

  // Filter by sales agent
  if (selectedAgent !== "All") {
    filteredLeads = filteredLeads.filter((lead) =>
      lead.salesAgents?.some(
        (agent) => agent._id === selectedAgent
      )
    );
  }

  // Filter by priority
  if (selectedPriority !== "All") {
    filteredLeads = filteredLeads.filter(
      (lead) => lead.priority === selectedPriority
    );
  }

  // Sort by time to close
  if (sortOrder === "lowToHigh") {
    filteredLeads.sort(
      (a, b) => a.timeToClose - b.timeToClose
    );
  }

  if (sortOrder === "highToLow") {
    filteredLeads.sort(
      (a, b) => b.timeToClose - a.timeToClose
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">

        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 bg-light min-vh-100 p-3">
          <h5 className="mb-4">Anvaya CRM</h5>

          <a
            href="/"
            className="btn btn-outline-primary w-100"
          >
            ← Back to Dashboard
          </a>
        </div>

        {/* Main Content */}
        <div className="col-md-9 col-lg-10 p-4">

          <h2 className="mb-4">
            Leads by Status
          </h2>

          {/* Status buttons */}
          <div className="mb-4">
            {statuses.map((status) => (
              <button
                key={status}
                className={`btn me-2 mb-2 ${
                  selectedStatus === status
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => setSelectedStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="card mb-4">
            <div className="card-body">

              <div className="row">

                {/* Sales Agent */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Sales Agent
                  </label>

                  <select
                    className="form-select"
                    value={selectedAgent}
                    onChange={(e) =>
                      setSelectedAgent(e.target.value)
                    }
                  >
                    <option value="All">
                      All Agents
                    </option>

                    {agents.map((agent) => (
                      <option
                        key={agent._id}
                        value={agent._id}
                      >
                        {agent.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Priority
                  </label>

                  <select
                    className="form-select"
                    value={selectedPriority}
                    onChange={(e) =>
                      setSelectedPriority(e.target.value)
                    }
                  >
                    <option value="All">
                      All Priorities
                    </option>

                    <option value="High">
                      High
                    </option>

                    <option value="Medium">
                      Medium
                    </option>

                    <option value="Low">
                      Low
                    </option>
                  </select>
                </div>

                {/* Sort */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Sort by Time to Close
                  </label>

                  <select
                    className="form-select"
                    value={sortOrder}
                    onChange={(e) =>
                      setSortOrder(e.target.value)
                    }
                  >
                    <option value="default">
                      Default
                    </option>

                    <option value="lowToHigh">
                      Lowest to Highest
                    </option>

                    <option value="highToLow">
                      Highest to Lowest
                    </option>
                  </select>
                </div>

              </div>

            </div>
          </div>

          {/* Lead List */}
          <div className="card">

            <div className="card-header">
              <h5 className="mb-0">
                Status: {selectedStatus}
              </h5>
            </div>

            <div className="card-body">

              {filteredLeads.length === 0 ? (
                <p className="text-muted mb-0">
                  No leads found for this status.
                </p>
              ) : (
                filteredLeads.map((lead) => (
                  <div
                    key={lead._id}
                    className="border rounded p-3 mb-3"
                  >
                    <div className="row">

                      <div className="col-md-6">
                        <h5 className="mb-2">
                          {lead.name}
                        </h5>

                        <p className="mb-1">
                          <strong>Source:</strong>{" "}
                          {lead.source}
                        </p>

                        <p className="mb-1">
                          <strong>Priority:</strong>{" "}
                          {lead.priority}
                        </p>

                        <p className="mb-0">
                          <strong>Time to Close:</strong>{" "}
                          {lead.timeToClose} days
                        </p>
                      </div>

                      <div className="col-md-6">
                        <strong>
                          Sales Agent:
                        </strong>

                        {lead.salesAgents &&
                        lead.salesAgents.length > 0 ? (
                          <ul className="mb-0 mt-2">
                            {lead.salesAgents.map(
                              (agent) => (
                                <li key={agent._id}>
                                  {agent.name}
                                </li>
                              )
                            )}
                          </ul>
                        ) : (
                          <p className="text-muted">
                            No agent assigned
                          </p>
                        )}
                      </div>

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

export default LeadStatusView;

