import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SalesAgentView = () => {
  const [leads, setLeads] = useState([]);

  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [sortOrder, setSortOrder] = useState("default");

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch("https://major-project-two-backend-zeta.vercel.app/leads");
        const data = await response.json();

        console.log("Leads API response:", data);

        if (response.ok) {
          setLeads(Array.isArray(data.leads) ? data.leads : []);
        }
      } catch (error) {
        console.error("Error fetching leads:", error);
        setLeads([]);
      }
    };

    fetchLeads();
  }, []);

  // Group leads by sales agent
  const groupedLeads = {};

  leads.forEach((lead) => {
    lead.salesAgents?.forEach((agent) => {
      if (!groupedLeads[agent._id]) {
        groupedLeads[agent._id] = {
          agent: agent,
          leads: [],
        };
      }

      groupedLeads[agent._id].leads.push(lead);
    });
  });

  // Apply filters and sorting
  Object.values(groupedLeads).forEach((group) => {
    let filteredLeads = group.leads;

    // Filter by status
    if (selectedStatus !== "All") {
      filteredLeads = filteredLeads.filter(
        (lead) => lead.status === selectedStatus
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

    group.leads = filteredLeads;
  });

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 bg-light border-end p-4">
          <h4 className="mb-4">Sales Agent View</h4>

          <Link
            to="/"
            className="btn btn-outline-primary w-100"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Main Content */}
        <div className="col-md-9 col-lg-10 p-4">

          <h2 className="mb-4">Leads by Sales Agent</h2>

          {/* Filters */}
          <div className="card p-3 mb-4">
            <div className="row g-3">

              {/* Status */}
              <div className="col-md-4">
                <label className="form-label">
                  Status
                </label>

                <select
                  className="form-select"
                  value={selectedStatus}
                  onChange={(e) =>
                    setSelectedStatus(e.target.value)
                  }
                >
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal Sent">
                    Proposal Sent
                  </option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* Priority */}
              <div className="col-md-4">
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
                  <option value="All">All Priorities</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              {/* Sort */}
              <div className="col-md-4">
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
                    Low to High
                  </option>

                  <option value="highToLow">
                    High to Low
                  </option>
                </select>
              </div>

            </div>
          </div>

          {/* Sales Agent Groups */}
          {Object.values(groupedLeads).length === 0 ? (
            <div className="alert alert-info">
              No sales agents or leads found.
            </div>
          ) : (
            Object.values(groupedLeads).map((group) => (
              <div
                className="card mb-4"
                key={group.agent._id}
              >
                {/* Agent Header */}
                <div className="card-header">
                  <h5 className="mb-0">
                    Sales Agent: {group.agent.name}
                  </h5>

                  <small className="text-muted">
                    {group.agent.email}
                  </small>
                </div>

                {/* Leads */}
                <div className="card-body">

                  {group.leads.length === 0 ? (
                    <p className="text-muted mb-0">
                      No leads match the selected filters.
                    </p>
                  ) : (
                    group.leads.map((lead) => (
                      <div
                        key={lead._id}
                        className="border rounded p-3 mb-3"
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="mb-0">
                            {lead.name}
                          </h6>

                          <span className="badge bg-secondary">
                            {lead.status}
                          </span>
                        </div>

                        <div className="mt-2">
                          <span className="me-3">
                            <strong>Priority:</strong>{" "}
                            {lead.priority}
                          </span>

                          <span>
                            <strong>Time to Close:</strong>{" "}
                            {lead.timeToClose} days
                          </span>
                        </div>

                        <div className="mt-2">
                          <strong>Source:</strong>{" "}
                          {lead.source}
                        </div>
                      </div>
                    ))
                  )}

                </div>
              </div>
            ))
          )}

        </div>
      </div>
    </div>
  );
};

export default SalesAgentView;