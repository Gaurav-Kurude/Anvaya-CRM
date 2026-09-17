import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [leads, setLeads] = useState([]);

  const navigate = useNavigate();

  // Fetch leads
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/leads"
        );

        const data = await response.json();

        if (response.ok) {
          setLeads(data.leads || []);
        }
      } catch (error) {
        console.error(
          "Error fetching leads:",
          error
        );
      }
    };

    fetchLeads();
  }, []);

  // Lead statuses
  const statuses = [
    "New",
    "Contacted",
    "Qualified",
    "Proposal Sent",
    "Closed",
  ];

  // Count leads by status
  const getStatusCount = (status) => {
    return leads.filter(
      (lead) => lead.status === status
    ).length;
  };

  // Quick filter
  const handleStatusFilter = (status) => {
    navigate(
      `/leads?status=${encodeURIComponent(status)}`
    );
  };

  return (
    <div className="container-fluid">

      <div className="row min-vh-100">

        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 bg-dark text-white p-4">

          <h4 className="mb-4">
            Anvaya CRM
          </h4>

          <div className="d-flex flex-column gap-2">

            <button
              className="btn btn-dark text-start"
              onClick={() => navigate("/")}
            >
              Dashboard
            </button>

            <button
              className="btn btn-dark text-start"
              onClick={() => navigate("/leads")}
            >
              Leads
            </button>

            <button
              className="btn btn-dark text-start"
              onClick={() =>
                navigate("/sales-agents")
              }
            >
              Sales Agents
            </button>

            <button
              className="btn btn-dark text-start"
              onClick={() =>
                navigate("/reports")
              }
            >
              Reports
            </button>

          </div>

        </div>

        {/* Main Content */}
        <div className="col-md-9 col-lg-10 p-4">

          <h2 className="mb-4">
            Anvaya CRM Dashboard
          </h2>

          {/* Lead Status Cards */}
          <div className="row mb-4">

            {statuses.map((status) => (

              <div
                className="col-md-6 col-lg mb-3"
                key={status}
              >

                <div className="card h-100">

                  <div className="card-body">

                    <h6 className="text-muted">
                      {status}
                    </h6>

                    <h2>
                      {getStatusCount(status)}
                    </h2>

                    <p className="mb-0">
                      Leads
                    </p>

                  </div>

                </div>

              </div>

            ))}

          </div>

          {/* Quick Filters */}
          <div className="card mb-4">

            <div className="card-body">

              <h5 className="mb-3">
                Quick Filters
              </h5>

              <div className="d-flex flex-wrap gap-2">

                {statuses.map((status) => (

                  <button
                    key={status}
                    className="btn btn-outline-primary"
                    onClick={() =>
                      handleStatusFilter(status)
                    }
                  >
                    {status}
                  </button>

                ))}

              </div>

            </div>

          </div>

          {/* Recent Leads */}
          <div className="card mb-4">

            <div className="card-header">
              <h5 className="mb-0">
                Recent Leads
              </h5>
            </div>

            <div className="card-body">

              {leads.length === 0 ? (

                <p className="text-muted">
                  No leads available.
                </p>

              ) : (

                <div className="row">

                  {leads
                    .slice(0, 3)
                    .map((lead) => (

                      <div
                        className="col-md-4 mb-3"
                        key={lead._id}
                      >

                        <div className="card h-100">

                          <div className="card-body">

                            <h6>
                              {lead.name}
                            </h6>

                            <p className="mb-1">
                              <strong>
                                Status:
                              </strong>{" "}
                              {lead.status}
                            </p>

                            <p className="mb-1">
                              <strong>
                                Agent:
                              </strong>{" "}
                              {lead.salesAgent?.name ||
                                "Not Assigned"}
                            </p>

                            <p className="mb-0">
                              <strong>
                                Priority:
                              </strong>{" "}
                              {lead.priority ||
                                "Medium"}
                            </p>

                          </div>

                        </div>

                      </div>

                    ))}

                </div>

              )}

            </div>

          </div>

          {/* Add New Lead */}
          <button
            className="btn btn-primary"
            onClick={() => navigate("/leads/new")}
          >
            + Add New Lead
          </button>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;

