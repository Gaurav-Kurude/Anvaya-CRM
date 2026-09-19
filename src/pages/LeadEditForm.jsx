import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";

const LeadEditForm = () => {
  const { leadId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    source: "",
    status: "New",
    salesAgent: "",
    priority: "Medium",
    timeToClose: "",
    tags: [],
  });

  const [loading, setLoading] = useState(true);

  // Fetch lead details
  useEffect(() => {
    const fetchLead = async () => {
      try {
        const response = await fetch(
          `https://major-project-two-backend-zeta.vercel.app/leads/${leadId}`,
        );

        const data = await response.json();

        if (response.ok) {
          setFormData({
            name: data.lead.name || "",
            source: data.lead.source || "",
            status: data.lead.status || "New",
            salesAgent: lead.salesAgent?._id || "",
            priority: data.lead.priority || "Medium",
            timeToClose: data.lead.timeToClose || "",
            tags: lead.tags || [],
          });
        } else {
          toast.error(data.message || "Failed to fetch lead");
        }
      } catch (error) {
        console.error("Error fetching lead:", error);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchLead();
  }, [leadId]);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // Update lead
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `https://major-project-two-backend-zeta.vercel.app/leads/${leadId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            timeToClose: Number(formData.timeToClose),
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Lead updated successfully!");
        navigate(`/leads/${leadId}`);
      } else {
        toast.error(data.message || "Failed to update lead");
      }
    } catch (error) {
      console.error("Error updating lead:", error);
      toast.error("Something went wrong");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="col-md-9 col-lg-10 p-4">
            <p>Loading lead...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="col-md-9 col-lg-10 p-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="mb-4">Edit Lead</h2>

              <form onSubmit={handleSubmit}>
                {/* Name */}
                <div className="mb-3">
                  <label className="form-label">Lead Name</label>

                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Source */}
                <div className="mb-3">
                  <label className="form-label">Lead Source</label>

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
                    <option value="Advertisement">Advertisement</option>
                    <option value="Email">Email</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Status */}
                <div className="mb-3">
                  <label className="form-label">Status</label>

                  <select
                    className="form-select"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
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
                  <label className="form-label">Time to Close</label>

                  <input
                    type="number"
                    className="form-control"
                    name="timeToClose"
                    value={formData.timeToClose}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Tags</label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter tags separated by commas"
                    value={formData.tags.join(", ")}
                    onChange={(event) => {
                      const tags = event.target.value
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter((tag) => tag !== "");

                      setFormData({
                        ...formData,
                        tags,
                      });
                    }}
                  />

                  <small className="text-muted">
                    Example: High Value, Follow-up, Important
                  </small>
                </div>

                {/* Submit */}
                <button type="submit" className="btn btn-primary">
                  Update Lead
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadEditForm;
