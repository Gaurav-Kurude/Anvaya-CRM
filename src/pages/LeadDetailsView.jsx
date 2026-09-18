import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const LeadDetailsView = () => {
  const { leadId } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);

  // Fetch lead details
  useEffect(() => {
    const fetchLead = async () => {
      try {
        const response = await fetch(
          `https://major-project-two-backend-zeta.vercel.app/leads/${leadId}`
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
          `https://major-project-two-backend-zeta.vercel.app/leads/${leadId}/comments`
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
        }
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

        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/leads")}
        >
          Back to Leads
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">

        {/* Sidebar */}
        <Sidebar/>

        {/* Main Content */}
        <div className="col-md-9 col-lg-10 p-4">

          <h2 className="mb-4">
            Lead Management: {lead.name}
          </h2>

          {/* Lead Details */}
          <div className="card shadow-sm mb-4">
            <div className="card-header">
              <h5 className="mb-0">Lead Details</h5>
            </div>

            <div className="card-body">

              <div className="row">

                {/* Lead Name */}
                <div className="col-md-6 mb-3">
                  <strong>Lead Name:</strong>
                  <p className="mb-0">
                    {lead.name}
                  </p>
                </div>

                {/* Sales Agent */}
                <div className="col-md-6 mb-3">
                  <strong>Sales Agent:</strong>
                  <p className="mb-0">
                    {lead.salesAgent?.name || "Not Assigned"}
                  </p>
                </div>

                {/* Source */}
                <div className="col-md-6 mb-3">
                  <strong>Lead Source:</strong>
                  <p className="mb-0">
                    {lead.source}
                  </p>
                </div>

                {/* Status */}
                <div className="col-md-6 mb-3">
                  <strong>Lead Status:</strong>
                  <p className="mb-0">
                    <span className="badge text-bg-primary">
                      {lead.status}
                    </span>
                  </p>
                </div>

                {/* Priority */}
                <div className="col-md-6 mb-3">
                  <strong>Priority:</strong>
                  <p className="mb-0">
                    <span className="badge text-bg-warning">
                      {lead.priority}
                    </span>
                  </p>
                </div>

                {/* Time to Close */}
                <div className="col-md-6 mb-3">
                  <strong>Time to Close:</strong>
                  <p className="mb-0">
                    {lead.timeToClose} Days
                  </p>
                </div>

              </div>

              {/* Edit Button */}
              <button
                className="btn btn-primary mt-2"
                onClick={() =>
                  navigate(`/leads/edit/${leadId}`)
                }
              >
                Edit Lead Details
              </button>

            </div>
          </div>

          {/* Comments Section */}
          <div className="card shadow-sm">

            <div className="card-header">
              <h5 className="mb-0">
                Comments
              </h5>
            </div>

            <div className="card-body">

              {/* Existing Comments */}
              {comments.length === 0 ? (
                <p className="text-muted">
                  No comments yet.
                </p>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border-bottom pb-3 mb-3"
                  >
                    <div className="d-flex justify-content-between">

                      <strong>
                        {comment.author}
                      </strong>

                      <small className="text-muted">
                        {new Date(
                          comment.createdAt
                        ).toLocaleString()}
                      </small>

                    </div>

                    <p className="mt-2 mb-0">
                      {comment.commentText}
                    </p>
                  </div>
                ))
              )}

              {/* Add Comment */}
              <form
                onSubmit={handleAddComment}
                className="mt-4"
              >
                <label className="form-label">
                  Add New Comment
                </label>

                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Write your comment..."
                  value={newComment}
                  onChange={(event) =>
                    setNewComment(event.target.value)
                  }
                />

                <button
                  type="submit"
                  className="btn btn-success mt-3"
                  disabled={commentLoading}
                >
                  {commentLoading
                    ? "Submitting..."
                    : "Submit Comment"}
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