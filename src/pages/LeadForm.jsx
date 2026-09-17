import { useEffect, useState } from "react";

const LeadForm = () => {
  const [agents, setAgents] = useState([]);
  const [tags, setTags] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    source: "",
    salesAgent: "",
    status: "New",
    tags: [],
    timeToClose: "",
    priority: "Medium",
  });

  // Fetch sales agents
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch("http://localhost:5000/sales-agents");

        const data = await response.json();

        if (data.success) {
          setAgents(data.agents);
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
        const response = await fetch("http://localhost:5000/tags");

        const data = await response.json();

        if (data.success) {
          setTags(data.tags);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);

  // Handle normal inputs and select fields
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle multiple tags
  const handleTagsChange = (event) => {
    const selectedTags = Array.from(
      event.target.selectedOptions,
      (option) => option.value,
    );

    setFormData((prev) => ({
      ...prev,
      tags: selectedTags,
    }));
  };

  // Submit form
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          source: formData.source,
          salesAgent: formData.salesAgent,
          status: formData.status,
          tags: formData.tags,
          timeToClose: Number(formData.timeToClose),
          priority: formData.priority,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Lead created successfully!");

        // Reset form
        setFormData({
          name: "",
          source: "",
          salesAgent: "",
          status: "New",
          tags: [],
          timeToClose: "",
          priority: "Medium",
        });
      } else {
        alert(data.message || "Failed to create lead");
      }
    } catch (error) {
      console.error("Error creating lead:", error);

      alert("Something went wrong");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Create New Lead</h2>

      <form onSubmit={handleSubmit}>
        {/* Lead Name */}
        <div className="mb-3">
          <label className="form-label">Lead Name</label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter lead name"
            required
          />
        </div>

        {/* Lead Source */}
        <div className="mb-3">
          <label className="form-label">Lead Source</label>

          <select
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Select source</option>

            <option value="Website">Website</option>

            <option value="Referral">Referral</option>

            <option value="Cold Call">Cold Call</option>

            <option value="Advertisement">Advertisement</option>

            <option value="Email">Email</option>

            <option value="Other">Other</option>
          </select>
        </div>

        {/* Sales Agent */}
        <div className="mb-3">
          <label className="form-label">Assigned Sales Agent</label>

          <select
            name="salesAgent"
            value={formData.salesAgent}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Select sales agent</option>

            {agents.map((agent) => (
              <option key={agent._id} value={agent._id}>
                {agent.name}
              </option>
            ))}
          </select>
        </div>

        {/* Lead Status */}
        <div className="mb-3">
          <label className="form-label">Lead Status</label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-select"
          >
            <option value="New">New</option>

            <option value="Contacted">Contacted</option>

            <option value="Qualified">Qualified</option>

            <option value="Proposal Sent">Proposal Sent</option>

            <option value="Closed">Closed</option>
          </select>
        </div>

        {/* Priority */}
        <div className="mb-3">
          <label className="form-label">Priority</label>

          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="form-select"
          >
            <option value="High">High</option>

            <option value="Medium">Medium</option>

            <option value="Low">Low</option>
          </select>
        </div>

        {/* Time to Close */}
        <div className="mb-3">
          <label className="form-label">Time to Close (days)</label>

          <input
            type="number"
            name="timeToClose"
            value={formData.timeToClose}
            onChange={handleChange}
            className="form-control"
            min="1"
            placeholder="Enter number of days"
            required
          />
        </div>

        {/* Tags */}
        <div className="mb-3">
          <label className="form-label">Tags</label>

          <select
            name="tags"
            className="form-select"
            multiple={true}
            value={formData.tags}
            onChange={handleTagsChange}
          >
            {tags.map((tag) => (
              <option key={tag._id} value={tag.name}>
                {tag.name}
              </option>
            ))}
          </select>

          <small className="text-muted">
            Hold Ctrl to select multiple tags.
          </small>
        </div>

        {/* Submit */}
        <button type="submit" className="btn btn-primary">
          Add Lead
        </button>
      </form>
    </div>
  );
};

export default LeadForm;
