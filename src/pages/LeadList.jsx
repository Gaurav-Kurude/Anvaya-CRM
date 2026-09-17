import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const LeadsView = () => {
  const [leads, setLeads] = useState([]);
  const [searchParams] = useSearchParams();

  // Get filters from URL
  const selectedAgent = searchParams.get("salesAgent");
  const selectedStatus = searchParams.get("status");
  const selectedSource = searchParams.get("source");

  // Fetch all leads
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch(
          "https://major-project-two-backend-zeta.vercel.app/leads"
        );

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

  // Filter leads based on URL
  const filteredLeads = leads.filter((lead) => {
    const agentMatches =
      !selectedAgent ||
      lead.salesAgent?.name === selectedAgent;

    const statusMatches =
      !selectedStatus ||
      lead.status === selectedStatus;

    const sourceMatches =
      !selectedSource ||
      lead.source === selectedSource;

    return (
      agentMatches &&
      statusMatches &&
      sourceMatches
    );
  });

  return (
    <div className="container mt-4">

      <h2 className="mb-4">
        Leads
      </h2>

      {/* Show active filters */}
      <div className="mb-3">

        {selectedAgent && (
          <span className="badge bg-primary me-2">
            Agent: {selectedAgent}
          </span>
        )}

        {selectedStatus && (
          <span className="badge bg-success me-2">
            Status: {selectedStatus}
          </span>
        )}

        {selectedSource && (
          <span className="badge bg-warning text-dark me-2">
            Source: {selectedSource}
          </span>
        )}

      </div>

      {/* Leads */}
      <div className="row">

        {filteredLeads.length === 0 ? (
          <div className="col-12">
            <p className="text-muted">
              No leads found.
            </p>
          </div>
        ) : (
          filteredLeads.map((lead) => (
            <div
              className="col-md-6 col-lg-4 mb-4"
              key={lead._id}
            >
              <div className="card h-100">

                <div className="card-body">

                  <h5 className="card-title">
                    {lead.name}
                  </h5>

                  <p className="mb-1">
                    <strong>Agent:</strong>{" "}
                    {lead.salesAgent?.name ||
                      "Not Assigned"}
                  </p>

                  <p className="mb-1">
                    <strong>Status:</strong>{" "}
                    {lead.status}
                  </p>

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

              </div>
            </div>
          ))
        )}

      </div>

    </div>
  );
};

export default LeadsView;
