import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar col-md-3 col-lg-2 bg-light p-4">
      <h4
        className="mb-4"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        Anvaya CRM
      </h4>

      <button
        className="btn btn-outline-primary w-100 mb-3"
        onClick={() => navigate("/")}
      >
        Dashboard
      </button>

      <button
        className="btn btn-outline-primary w-100 mb-3"
        onClick={() => navigate("/leads")}
      >
        Leads
      </button>

      <button
        className="btn btn-outline-primary w-100 mb-3"
        onClick={() => navigate("/sales-agents")}
      >
        Sales Agents
      </button>

      <button
        className="btn btn-outline-primary w-100"
        onClick={() => navigate("/reports")}
      >
        Reports
      </button>
    </div>
  );
};

export default Sidebar;
