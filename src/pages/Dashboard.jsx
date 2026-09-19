import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // --------------------------------
  // Fetch Leads
  // --------------------------------

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch(
          "https://major-project-two-backend-zeta.vercel.app/leads",
        );

        const data = await response.json();

        console.log("Dashboard Leads API:", data);

        if (response.ok) {
          setLeads(Array.isArray(data.leads) ? data.leads : []);
        }
      } catch (error) {
        console.error("Error fetching leads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  // --------------------------------
  // Lead Statuses
  // --------------------------------

  const statuses = ["New", "Contacted", "Qualified", "Proposal Sent", "Closed"];

  // --------------------------------
  // Count Leads by Status
  // --------------------------------

  const getStatusCount = (status) => {
    return leads.filter((lead) => lead.status === status).length;
  };

  // --------------------------------
  // Get Latest 3 Leads
  // --------------------------------

  const recentLeads = [...leads]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 3);

  // --------------------------------
  // Quick Status Filter
  // --------------------------------

  const handleStatusFilter = (status) => {
    navigate(`/leads?status=${encodeURIComponent(status)}`);
  };

  // --------------------------------
  // Loading State
  // --------------------------------

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="row min-vh-100">
          <Sidebar />

          <main className="col-12 col-md-9 col-lg-10 p-3 p-md-4">
            <div className="d-flex justify-content-center align-items-center py-5">
              <p className="text-muted mb-0">Loading dashboard...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // --------------------------------
  // Dashboard UI
  // --------------------------------

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="col-12 col-md-9 col-lg-10 p-3 p-md-4">
          {/* Header */}
          <div className="mb-4">
            <h2 className="mb-1">Anvaya CRM Dashboard</h2>

            <p className="text-muted mb-0">
              Manage your leads and sales activities
            </p>
          </div>

          {/* -------------------------------- */}
          {/* Lead Status Cards */}
          {/* -------------------------------- */}

          <div className="row g-3 mb-4">
            {statuses.map((status) => (
              <div className="col-12 col-sm-6 col-lg" key={status}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h6 className="text-muted mb-2">{status}</h6>

                    <h2 className="mb-1">{getStatusCount(status)}</h2>

                    <p className="text-muted mb-0">Leads</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* -------------------------------- */}
          {/* Quick Filters */}
          {/* -------------------------------- */}

          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="mb-3">Quick Filters</h5>

              <div className="d-flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <button
                    key={status}
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => handleStatusFilter(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* -------------------------------- */}
          {/* Recent Leads */}
          {/* -------------------------------- */}

          <div className="card shadow-sm mb-4">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Recent Leads</h5>

                <span className="badge text-bg-secondary">
                  {recentLeads.length}
                </span>
              </div>
            </div>

            <div className="card-body">
              {recentLeads.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted mb-0">No recent leads available.</p>
                </div>
              ) : (
                <div className="row g-3">
                  {recentLeads.map((lead) => (
                    <div className="col-12 col-md-6 col-lg-4" key={lead._id}>
                      <div className="card h-100 border shadow-sm">
                        <div className="card-body">
                          {/* Lead Name */}
                          <h6 className="fw-bold mb-3">{lead.name}</h6>

                          {/* Status */}
                          <div className="mb-2">
                            <small className="text-muted d-block">Status</small>

                            <span className="badge text-bg-primary">
                              {lead.status}
                            </span>
                          </div>

                          {/* Sales Agent */}
                          <div className="mb-2">
                            <small className="text-muted d-block">
                              Sales Agent
                            </small>

                            <span>
                              {lead.salesAgent?.name || "Not Assigned"}
                            </span>
                          </div>

                          {/* Priority */}
                          <div className="mb-2">
                            <small className="text-muted d-block">
                              Priority
                            </small>

                            <span>{lead.priority || "Medium"}</span>
                          </div>

                          {/* Source */}
                          <div className="mb-3">
                            <small className="text-muted d-block">Source</small>

                            <span>{lead.source || "Not Available"}</span>
                          </div>

                          {/* View Lead */}
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm w-100"
                            onClick={() => navigate(`/leads/${lead._id}`)}
                          >
                            View Lead
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* -------------------------------- */}
          {/* Add New Lead */}
          {/* -------------------------------- */}

          <div className="d-grid d-sm-flex">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate("/leads/new")}
            >
              + Add New Lead
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
