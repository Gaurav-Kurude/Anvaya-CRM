import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";

const LeadDetailsView = () => {
  const { leadId } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fetch lead details
  useEffect(() => {
    const fetchLead = async () => {
      try {
        const response = await fetch(
          `https://major-project-two-backend-zeta.vercel.app/leads/${leadId}`,
        );

        const data = await response.json();

        if (response.ok) {
          setLead(data.lead);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching lead:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLead();
  }, [leadId]);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `https://major-project-two-backend-zeta.vercel.app/leads/${leadId}/comments`,
        );

        const data = await response.json();

        if (response.ok) {
          setComments(data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [leadId]);

  // Add comment
  const handleAddComment = async (event) => {
    event.preventDefault();

    if (!newComment.trim()) {
      return;
    }

    try {
      setCommentLoading(true);

      const response = await fetch(
        "https://major-project-two-backend-zeta.vercel.app/addcomment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lead: leadId,
            author: lead.salesAgent?._id,
            commentText: newComment.trim(),
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setComments((previousComments) => [
          ...previousComments,
          {
            id: data.data._id,
            commentText: data.data.commentText,
            author: lead.salesAgent?.name || "Unknown",
            createdAt: data.data.createdAt,
          },
        ]);

        setNewComment("");
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setCommentLoading(false);
    }
  };

  // Delete lead
  const handleDeleteLead = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this lead?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeleting(true);

      const response = await fetch(
        `https://major-project-two-backend-zeta.vercel.app/leads/${leadId}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Lead deleted successfully!");

        // Go back to Leads page
        navigate("/leads");
      } else {
        toast.error(data.message || "Failed to delete lead.");
      }
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast.error("Something went wrong while deleting the lead.");
    } finally {
      setDeleting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container-fluid">
        <div className="row min-vh-100">
          <Sidebar />

          <div className="col-md-9 col-lg-10 p-4">
            <p>Loading lead details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Lead not found
  if (!lead) {
    return (
      <div className="container-fluid">
        <div className="row min-vh-100">
          <Sidebar />

          <div className="col-md-9 col-lg-10 p-4">
            <h3>Lead not found.</h3>

            <button
              type="button"
              className="btn btn-primary mt-3"
              onClick={() => navigate("/leads")}
            >
              Back to Leads
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        <Sidebar />

        <div className="col-md-9 col-lg-10 p-4">
          <h2 className="mb-4">Lead Management: {lead.name}</h2>

          {/* Lead Details */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h4 className="card-title mb-4">Lead Details</h4>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <strong>Name:</strong>
                  <p className="mb-0">{lead.name}</p>
                </div>

                <div className="col-md-6 mb-3">
                  <strong>Source:</strong>
                  <p className="mb-0">{lead.source}</p>
                </div>

                <div className="col-md-6 mb-3">
                  <strong>Status:</strong>
                  <p className="mb-0">{lead.status}</p>
                </div>

                <div className="col-md-6 mb-3">
                  <strong>Priority:</strong>
                  <p className="mb-0">{lead.priority}</p>
                </div>

                <div className="col-md-6 mb-3">
                  <strong>Sales Agent:</strong>
                  <p className="mb-0">
                    {lead.salesAgent?.name || "Not assigned"}
                  </p>
                </div>

                <div className="col-md-6 mb-3">
                  <strong>Time to Close:</strong>
                  <p className="mb-0">{lead.timeToClose} days</p>
                </div>

                {/* Tags */}
                <div className="col-12 mb-3">
                  <strong>Tags:</strong>

                  <p className="mb-0">
                    {lead.tags?.length > 0 ? lead.tags.join(", ") : "No tags"}
                  </p>
                </div>
              </div>

              {/* Edit and Delete Buttons */}
              <div className="d-flex gap-2 mt-2">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => navigate(`/leads/edit/${leadId}`)}
                  disabled={deleting}
                >
                  Edit Lead Details
                </button>

                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteLead}
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Delete Lead"}
                </button>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="card-title mb-4">Comments</h4>

              {/* Existing Comments */}
              {comments.length === 0 ? (
                <p className="text-muted">No comments yet.</p>
              ) : (
                <div className="mb-4">
                  {comments.map((comment) => (
                    <div
                      key={comment._id || comment.id}
                      className="border rounded p-3 mb-3"
                    >
                      <p className="mb-1">
                        <strong>
                          {comment.author?.name || comment.author || "Unknown"}
                        </strong>
                      </p>

                      <p className="mb-1">{comment.commentText}</p>

                      {comment.createdAt && (
                        <small className="text-muted">
                          {new Date(comment.createdAt).toLocaleString()}
                        </small>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment}>
                <div className="mb-3">
                  <label htmlFor="comment" className="form-label">
                    Add Comment
                  </label>

                  <textarea
                    id="comment"
                    className="form-control"
                    rows="3"
                    value={newComment}
                    onChange={(event) => setNewComment(event.target.value)}
                    placeholder="Write a comment..."
                    disabled={commentLoading}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={commentLoading}
                >
                  {commentLoading ? "Adding Comment..." : "Add Comment"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailsView;
