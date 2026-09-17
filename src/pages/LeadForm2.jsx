import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LeadForm = () => {
  const navigate = useNavigate();

  const [agents, setAgents] = useState([]);
  const [tags, setTags] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    source: "",
    salesAgent: "",
    status: "New",
    priority: "Medium",
    timeToClose: "",
    tags: [],
  });

  const [loading, setLoading] = useState(false);

  // Fetch sales agents and tags
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agentsResponse, tagsResponse] = await Promise.all([
          fetch("https://major-project-two-backend-zeta.vercel.app/sales-agents"),
          fetch("https://major-project-two-backend-zeta.vercel.app/tags"),
        ]);

        const agentsData = await agentsResponse.json();
        const tagsData = await tagsResponse.json();

        if (agentsResponse.ok) {
          setAgents(agentsData.agents || []);
        }

        if (tagsResponse.ok) {
          setTags(tagsData.tags || []);
        }
      } catch (error) {
        console.error("Error fetching agents and tags:", error);
      }
    };

    fetchData();
  }, []);

  // Handle normal inputs
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // Handle tags
  const handleTagsChange = (event) => {
    const selectedTags = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );

    setFormData((previousData) => ({
      ...previousData,
      tags: selectedTags,
    }));
  };

  // Submit form
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.name ||
      !formData.source ||
      !formData.salesAgent ||
      !formData.timeToClose
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://major-project-two-backend-zeta.vercel.app/leads",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            source: formData.source,
            salesAgent: formData.salesAgent,
            status: formData.status,
            priority: formData.priority,
            timeToClose: Number(formData.timeToClose),
            tags: formData.tags,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Lead created successfully!");

        navigate("/leads");
      } else {
        alert(data.message || "Failed to create lead.");
      }
    } catch (error) {
      console.error("Error creating lead:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Add New Lead</h2>

        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/leads")}
        >
          Back to Leads
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-4">

          <form onSubmit={handleSubmit}>

            {/* Lead Name */}
            <div className="mb-3">
              <label className="form-label">
                Lead Name
              </label>

              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter lead name"
                required
              />
            </div>

            {/* Lead Source */}
            <div className="mb-3">
              <label className="form-label">
                Lead Source
              </label>

              <select
                className="form-select"
                name="source"
                value={formData.source}
                onChange={handleChange}
                required
              >
                <option value="">Select Source</option>
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Cold Call">Cold Call</option>
                <option value="Advertisement">
                  Advertisement
                </option>
                <option value="Email">Email</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Sales Agent */}
            <div className="mb-3">
              <label className="form-label">
                Sales Agent
              </label>

              <select
                className="form-select"
                name="salesAgent"
                value={formData.salesAgent}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select Sales Agent
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

            {/* Lead Status */}
            <div className="mb-3">
              <label className="form-label">
                Lead Status
              </label>

              <select
                className="form-select"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="New">New</option>
                <option value="Contacted">
                  Contacted
                </option>
                <option value="Qualified">
                  Qualified
                </option>
                <option value="Proposal Sent">
                  Proposal Sent
                </option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            {/* Priority */}
            <div className="mb-3">
              <label className="form-label">
                Priority
              </label>

              <select
                className="form-select"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Time to Close */}
            <div className="mb-3">
              <label className="form-label">
                Time to Close
              </label>

              <input
                type="number"
                className="form-control"
                name="timeToClose"
                value={formData.timeToClose}
                onChange={handleChange}
                placeholder="Number of days"
                min="1"
                required
              />
            </div>

            {/* Tags */}
            <div className="mb-4">
              <label className="form-label">
                Tags
              </label>

              <select
                className="form-select"
                multiple
                value={formData.tags}
                onChange={handleTagsChange}
              >
                {tags.map((tag) => (
                  <option
                    key={tag._id}
                    value={tag.name}
                  >
                    {tag.name}
                  </option>
                ))}
              </select>

              <small className="text-muted">
                Hold Ctrl and select multiple tags.
              </small>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Lead"}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
};

export default LeadForm;