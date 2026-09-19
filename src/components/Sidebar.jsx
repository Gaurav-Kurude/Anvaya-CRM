import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        type="button"
        className="btn btn-primary mobile-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle navigation menu"
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        className={`sidebar col-md-3 col-lg-2 bg-light p-4 ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >
        <h4
          className="mb-4"
          style={{ cursor: "pointer" }}
          onClick={() => handleNavigation("/")}
        >
          Anvaya CRM
        </h4>

        <button
          className="btn btn-outline-primary w-100 mb-3"
          onClick={() => handleNavigation("/")}
        >
          Dashboard
        </button>

        <button
          className="btn btn-outline-primary w-100 mb-3"
          onClick={() => handleNavigation("/leads")}
        >
          Leads
        </button>

        <button
          className="btn btn-outline-primary w-100 mb-3"
          onClick={() => handleNavigation("/sales-agents")}
        >
          Sales Agents
        </button>

        <button
          className="btn btn-outline-primary w-100"
          onClick={() => handleNavigation("/reports")}
        >
          Reports
        </button>
      </div>
    </>
  );
};

export default Sidebar;
