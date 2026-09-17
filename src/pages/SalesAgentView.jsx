import { useEffect, useState } from "react";

const SalesAgentView = () => {
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [tags, setTags] = useState([]);

  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Fetch all leads
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
        console.error("Error fetching leads:", error);
      }
    };

    fetchLeads();
  }, []);

  // Fetch sales agents
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/sales-agents"
        );

        const data = await response.json();

        if (response.ok) {
          setAgents(data.agents || []);
        }
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };

    fetchAgents();
  }, []);

  // Fetch tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/tags"
        );

        const data = await response.json();

        if (response.ok) {
          setTags(data.tags || []);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    const statusMatches =
      !selectedStatus ||
      lead.status === selectedStatus;

    const tagMatches =
      !selectedTag ||
      lead.tags?.includes(selectedTag);

    return statusMatches && tagMatches;
  });

  // Sort leads
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
        (priorityOrder[a.priority] || 2) -
        (priorityOrder[b.priority] || 2)
      );
    }

    return 0;
  });

  // Statuses
  const statuses = [
    "New",
    "Contacted",
    "Qualified",
    "Proposal Sent",
    "Closed",
  ];

  return (
    <div className="container mt-4">

      <h2 className="mb-4">
        Sales Agent View
      </h2>

      {/* Filters and Sorting */}
      <div className="row mb-4">

        {/* Status Filter */}
        <div className="col-md-4">
          <label className="form-label">
            Filter by Status
          </label>

          <select
            className="form-select"
            value={selectedStatus}
            onChange={(event) =>
              setSelectedStatus(event.target.value)
            }
          >
            <option value="">
              All Statuses
            </option>

            {statuses.map((status) => (
              <option
                key={status}
                value={status}
              >
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Tag Filter */}
        <div className="col-md-4">
          <label className="form-label">
            Filter by Tag
          </label>

          <select
            className="form-select"
            value={selectedTag}
            onChange={(event) =>
              setSelectedTag(event.target.value)
            }
          >
            <option value="">
              All Tags
            </option>

            {tags.map((tag) => (
              <option
                key={tag._id}
                value={tag.name}
              >
                {tag.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="col-md-4">
          <label className="form-label">
            Sort Leads By
          </label>

          <select
            className="form-select"
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value)
            }
          >
            <option value="">
              Default
            </option>

            <option value="status">
              Status
            </option>

            <option value="priority">
              Priority
            </option>
          </select>
        </div>

      </div>

      {/* Sales Agent Columns */}
      <div className="row">

        {agents.map((agent) => {

          // Leads belonging to current agent
          const agentLeads = sortedLeads.filter(
            (lead) =>
              lead.salesAgent?._id === agent._id
          );

          return (
            <div
              className="col-md-6 col-lg-4 mb-4"
              key={agent._id}
            >

              <div className="card h-100">

                {/* Agent Header */}
                <div className="card-header">
                  <strong>
                    {agent.name}
                  </strong>

                  <span className="badge bg-secondary float-end">
                    {agentLeads.length} Leads
                  </span>
                </div>

                {/* Agent Leads */}
                <div className="card-body">

                  {agentLeads.length === 0 ? (
                    <p className="text-muted">
                      No leads
                    </p>
                  ) : (
                    agentLeads.map((lead) => (

                      <div
                        key={lead._id}
                        className="card mb-3"
                      >

                        <div className="card-body">

                          <h6 className="card-title">
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
                              Time to Close:
                            </strong>{" "}
                            {lead.timeToClose} days
                          </p>

                          <p className="mb-1">
                            <strong>
                              Priority:
                            </strong>{" "}
                            {lead.priority ||
                              "Medium"}
                          </p>

                          <p className="mb-0">
                            <strong>
                              Tags:
                            </strong>{" "}
                            {lead.tags?.join(", ") ||
                              "No tags"}
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
  );
};

export default SalesAgentView;
