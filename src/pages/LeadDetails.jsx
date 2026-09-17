import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const LeadDetails = () => {
  const { leadId } = useParams();

  const [lead, setLead] = useState(null);
  const [comments, setComments] = useState([]);

  const [commentText, setCommentText] = useState("");

  const [agents, setAgents] = useState([]);

  const [loading, setLoading] = useState(true);

  // Fetch lead details
  const fetchLead = async () => {
    try {
      const response = await fetch(
        `https://major-project-two-backend-zeta.vercel.app/leads/${leadId}`
      );

      const data = await response.json();

      if (response.ok) {
        setLead(data);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching lead:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch comments
  const fetchComments = async () => {
    try {
      const response = await fetch(
        `https://major-project-two-backend-zeta.vercel.app/leads/${leadId}/comments`
      );

      const data = await response.json();

      if (response.ok) {
        setComments(data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Fetch sales agents
  const fetchAgents = async () => {
    try {
      const response = await fetch(
        "https://major-project-two-backend-zeta.vercel.app/sales-agents"
      );

      const data = await response.json();

      if (response.ok) {
        setAgents(data);
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };

  useEffect(() => {
    fetchLead();
    fetchComments();
    fetchAgents();
  }, [leadId]);

  // Handle lead changes
  const handleLeadChange = (event) => {
    const { name, value } = event.target;

    setLead({
      ...lead,
      [name]: value,
    });
  };

  // Update lead
  const handleUpdateLead = async (event) => {
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
            name: lead.name,
            source: lead.source,
            salesAgent: lead.salesAgent?._id || lead.salesAgent,
            status: lead.status,
            tags: lead.tags,
            timeToClose: Number(lead.timeToClose),
            priority: lead.priority,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Lead updated successfully!");

        fetchLead();
      } else {
        alert(data.message || "Failed to update lead");
      }
    } catch (error) {
      console.error("Error updating lead:", error);
    }
  };

  // Add comment
  const handleAddComment = async (event) => {
    event.preventDefault();

    if (!commentText.trim()) {
      return;
    }

    try {
      const response = await fetch(
        `https://major-project-two-backend-zeta.vercel.app/leads/${leadId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment: commentText,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setCommentText("");

        fetchComments();
      } else {
        alert(data.message || "Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <p>Loading lead...</p>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="container mt-4">
        <h3>Lead not found</h3>
      </div>
    );
  }

  return (
    <div className="container mt-4">

      <h2 className="mb-4">Lead Details</h2>

      {/* Lead Details */}
      <div className="card p-4 mb-4">

        <h3>{lead.name}</h3>

        <p>
          <strong>Source:</strong> {lead.source}
        </p>

        <p>
          <strong>Status:</strong> {lead.status}
        </p>

        <p>
          <strong>Sales Agent:</strong>{" "}
          {lead.salesAgent?.name || "Not Assigned"}
        </p>

        <p>
          <strong>Time to Close:</strong>{" "}
          {lead.timeToClose} days
        </p>

        <p>
          <strong>Priority:</strong>{" "}
          {lead.priority || "Medium"}
        </p>

        <p>
          <strong>Tags:</strong>{" "}
          {lead.tags?.join(", ") || "No tags"}
        </p>

      </div>

      {/* Update Lead */}
      <div className="card p-4 mb-4">

        <h3 className="mb-3">Update Lead</h3>

        <form onSubmit={handleUpdateLead}>

          {/* Name */}
          <div className="mb-3">
            <label className="form-label">
              Lead Name
            </label>

            <input
              type="text"
              name="name"
              value={lead.name}
              onChange={handleLeadChange}
              className="form-control"
            />
          </div>

          {/* Status */}
          <div className="mb-3">
            <label className="form-label">
              Lead Status
            </label>

            <select
              name="status"
              value={lead.status}
              onChange={handleLeadChange}
              className="form-select"
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

          {/* Sales Agent */}
          <div className="mb-3">
            <label className="form-label">
              Sales Agent
            </label>

            <select
              name="salesAgent"
              value={
                lead.salesAgent?._id ||
                lead.salesAgent ||
                ""
              }
              onChange={handleLeadChange}
              className="form-select"
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

          {/* Source */}
          <div className="mb-3">
            <label className="form-label">
              Lead Source
            </label>

            <select
              name="source"
              value={lead.source}
              onChange={handleLeadChange}
              className="form-select"
            >
              <option value="Website">
                Website
              </option>
              <option value="Referral">
                Referral
              </option>
              <option value="Cold Call">
                Cold Call
              </option>
              <option value="Advertisement">
                Advertisement
              </option>
              <option value="Email">
                Email
              </option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Time to Close */}
          <div className="mb-3">
            <label className="form-label">
              Time to Close
            </label>

            <input
              type="number"
              name="timeToClose"
              value={lead.timeToClose}
              onChange={handleLeadChange}
              className="form-control"
              min="1"
            />
          </div>

          {/* Priority */}
          <div className="mb-3">
            <label className="form-label">
              Priority
            </label>

            <select
              name="priority"
              value={lead.priority || "Medium"}
              onChange={handleLeadChange}
              className="form-select"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
          >
            Update Lead
          </button>

        </form>
      </div>

      {/* Comments */}
      <div className="card p-4">

        <h3 className="mb-3">
          Comments & Updates
        </h3>

        {/* Add Comment */}
        <form onSubmit={handleAddComment}>

          <div className="mb-3">
            <textarea
              className="form-control"
              rows="3"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(event) =>
                setCommentText(event.target.value)
              }
            />
          </div>

          <button
            type="submit"
            className="btn btn-success"
          >
            Add Comment
          </button>

        </form>

        <hr />

        {/* Comments List */}
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="border rounded p-3 mb-3"
            >

              <h6>
                {comment.author?.name ||
                  comment.author ||
                  "Unknown"}
              </h6>

              <p className="mb-1">
                {comment.comment}
              </p>

              <small className="text-muted">
                {comment.createdAt
                  ? new Date(
                      comment.createdAt
                    ).toLocaleString()
                  : ""}
              </small>

            </div>
          ))
        )}

      </div>

    </div>
  );
};

export default LeadDetails;
