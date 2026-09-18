import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SalesAgentForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newAgent = {
      name,
      email,
    };

    try {
      const response = await fetch(
        "https://major-project-two-backend-zeta.vercel.app/sales-agents",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newAgent),
        },
      );

      const data = await response.json();

      if (response.ok) {
        alert("Sales agent created successfully!");

        setName("");
        setEmail("");
      } else {
        alert(data.message || "Failed to create sales agent.");
      }
    } catch (error) {
      console.error("Error creating sales agent:", error);
      alert("Something went wrong.");
    }
  };

  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <button
        type="button"
        className="btn btn-secondary mb-3"
        onClick={() => navigate("/")}
      >
        ← Back to Dashboard
      </button>
      <div className="card">
        <div className="card-header">
          <h3 className="mb-0">Add New Sales Agent</h3>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Agent Name */}
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Agent Name:
              </label>

              <input
                type="text"
                id="name"
                className="form-control"
                placeholder="Enter agent name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email Address:
              </label>

              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary">
              Create Agent
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SalesAgentForm;
