import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

const LeadStatusView = () => {
  const [leads, setLeads] = useState([]);
  const [tags, setTags] = useState([]);

  const [selectedAgent, setSelectedAgent] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  // Fetch all leads
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch(
          "https://major-project-two-backend-zeta.vercel.app/leads",
        );

        const data = await response.json();

        // console.log("Leads API response:", data);

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

  // Fetch tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(
          "https://major-project-two-backend-zeta.vercel.app/tags",
        );

        const data = await response.json();

        // console.log("Tags API response:", data);

        if (response.ok) {
          setTags(Array.isArray(data.tags) ? data.tags : []);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
        setTags([]);
      }
    };

    fetchTags();
  }, []);

  // Get unique sales agents
  const agents = [];

  leads.forEach((lead) => {
    const agent = lead.salesAgent;

    if (agent) {
      const alreadyExists = agents.some(
        (existingAgent) => existingAgent._id === agent._id,
      );

      if (!alreadyExists) {
        agents.push(agent);
      }
    }
  });

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    const agentMatches =
      !selectedAgent || lead.salesAgent?._id === selectedAgent;

    const tagMatches = !selectedTag || lead.tags?.includes(selectedTag);

    return agentMatches && tagMatches;
  });

  // Statuses
  const statuses = ["New", "Contacted", "Qualified", "Proposal Sent", "Closed"];

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="col-md-9 col-lg-10 p-4">
          <h2 className="mb-4">Lead Status View</h2>

          {/* Filters */}
          <div className="row mb-4">
            {/* Sales Agent Filter */}
            <div className="col-md-4">
              <label className="form-label">Filter by Sales Agent</label>

              <select
                className="form-select"
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
              >
                <option value="">All Sales Agents</option>

                {agents.map((agent) => (
                  <option key={agent._id} value={agent._id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tag Filter */}
            <div className="col-md-4">
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
          </div>

          {/* Status Columns */}
          <div className="row">
            {statuses.map((status) => {
              const statusLeads = filteredLeads.filter(
                (lead) => lead.status === status,
              );

              return (
                <div className="col-md-4 col-lg-2 mb-4" key={status}>
                  <div className="card h-100">
                    {/* Status Header */}
                    <div className="card-header">
                      <strong>{status}</strong>
                    </div>

                    {/* Leads */}
                    <div className="card-body">
                      {statusLeads.length === 0 ? (
                        <p className="text-muted">No leads</p>
                      ) : (
                        statusLeads.map((lead) => (
                          <div key={lead._id} className="card mb-3">
                            <div className="card-body">
                              <h6 className="card-title">{lead.name}</h6>

                              <p className="mb-1">
                                <strong>Agent:</strong>{" "}
                                {lead.salesAgent?.name || "Not Assigned"}
                              </p>

                              <p className="mb-1">
                                <strong>Time to Close:</strong>{" "}
                                {lead.timeToClose} days
                              </p>

                              <p className="mb-1">
                                <strong>Priority:</strong>{" "}
                                {lead.priority || "Medium"}
                              </p>

                              <p className="mb-0">
                                <strong>Tags:</strong>{" "}
                                {lead.tags?.join(", ") || "No tags"}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadStatusView;
