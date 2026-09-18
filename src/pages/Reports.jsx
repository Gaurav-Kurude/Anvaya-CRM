import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const Reports = () => {
  const [leads, setLeads] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch("https://major-project-two-backend-zeta.vercel.app/leads")
      .then((response) => response.json())
      .then((data) => {
        setLeads(data.leads || []);
      })
      .catch((error) => {
        console.error("Error fetching leads:", error);
      });
  }, []);

  // -------------------------------
  // 1. Closed vs Pipeline
  // -------------------------------

  const closedLeads = leads.filter((lead) => lead.status === "Closed").length;

  const pipelineLeads = leads.filter((lead) => lead.status !== "Closed").length;

  const closedPipelineData = [
    {
      name: "Closed",
      value: closedLeads,
    },
    {
      name: "Pipeline",
      value: pipelineLeads,
    },
  ];

  // -------------------------------
  // 2. Leads Closed By Agent
  // -------------------------------

  const closedByAgent = {};

  leads
    .filter((lead) => lead.status === "Closed")
    .forEach((lead) => {
      lead.salesAgents?.forEach((agent) => {
        const agentName = agent.name || "Unknown";

        if (closedByAgent[agentName]) {
          closedByAgent[agentName] += 1;
        } else {
          closedByAgent[agentName] = 1;
        }
      });
    });

  const agentData = Object.entries(closedByAgent).map(([name, closed]) => ({
    name,
    closed,
  }));

  // -------------------------------
  // 3. Lead Status Distribution
  // -------------------------------

  const statusCount = {};

  leads.forEach((lead) => {
    const status = lead.status;

    if (statusCount[status]) {
      statusCount[status] += 1;
    } else {
      statusCount[status] = 1;
    }
  });

  const statusData = Object.entries(statusCount).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="container-fluid">
      <div className="row">
        <button
          className="btn btn-primary d-md-none m-3"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>
        {/* Sidebar */}
        <div
          className={`sidebar col-md-3 col-lg-2 bg-light p-4 ${
            sidebarOpen ? "sidebar-open" : ""
          }`}
        >
          {/* Mobile Close Button */}
          <button
            className="btn btn-sm btn-outline-secondary d-md-none mb-3"
            onClick={() => setSidebarOpen(false)}
          >
            ✕ Close
          </button>

          <h4 className="mb-4">Anvaya CRM</h4>

          <a href="/" className="btn btn-outline-primary w-100">
            ← Back to Dashboard
          </a>
          <button
            className="btn btn-outline-secondary w-100"
            onClick={() => {
              setSidebarOpen(false);
              navigate("/leads");
            }}
          >
            All Leads
          </button>
        </div>

        {/* Main Content */}
        <div className="col-md-9 col-lg-10 p-4">
          <h2 className="mb-4">Anvaya CRM Reports</h2>

          <div className="card">
            <div className="card-body">
              <h4 className="mb-4">Report Overview</h4>

              {/* -------------------------------- */}
              {/* Closed vs Pipeline */}
              {/* -------------------------------- */}

              <div className="border rounded p-3 mb-4">
                <h5>Total Leads Closed and in Pipeline</h5>

                <div
                  style={{
                    width: "100%",
                    height: 350,
                  }}
                >
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={closedPipelineData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label
                      >
                        {closedPipelineData.map((entry, index) => (
                          <Cell key={`cell-${index}`} />
                        ))}
                      </Pie>

                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* -------------------------------- */}
              {/* Leads Closed By Agent */}
              {/* -------------------------------- */}

              <div className="border rounded p-3 mb-4">
                <h5>Leads Closed by Sales Agent</h5>

                <div
                  style={{
                    width: "100%",
                    height: 350,
                  }}
                >
                  <ResponsiveContainer>
                    <BarChart data={agentData}>
                      <CartesianGrid />

                      <XAxis dataKey="name" />

                      <YAxis allowDecimals={false} />

                      <Tooltip />

                      <Legend />

                      <Bar dataKey="closed" name="Closed Leads" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* -------------------------------- */}
              {/* Lead Status Distribution */}
              {/* -------------------------------- */}

              <div className="border rounded p-3">
                <h5>Lead Status Distribution</h5>

                <div
                  style={{
                    width: "100%",
                    height: 350,
                  }}
                >
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={statusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} />
                        ))}
                      </Pie>

                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
