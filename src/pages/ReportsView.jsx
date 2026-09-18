import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const ReportsView = () => {
  const [leads, setLeads] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch all leads
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch(
          "https://major-project-two-backend-zeta.vercel.app/leads"
        );

        const data = await response.json();

        if (response.ok) {
          setLeads(data.leads || []);
        }
      } catch (error) {
        console.error("Error fetching leads:", error);
      }
    };

    fetchLeads();
  }, []);

  // --------------------------------
  // 1. Leads Closed Last Week
  // --------------------------------

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const now = new Date();

  const closedLastWeek = leads.filter((lead) => {
    if (
      lead.status !== "Closed" ||
      !lead.updatedAt
    ) {
      return false;
    }

    const updatedDate = new Date(lead.updatedAt);

    return (
      updatedDate >= oneWeekAgo &&
      updatedDate <= now
    );
  });

  // --------------------------------
  // 2. Total Leads in Pipeline
  // --------------------------------

  const pipelineStatuses = [
    "New",
    "Contacted",
    "Qualified",
    "Proposal Sent",
  ];

  const pipelineData = pipelineStatuses.map(
    (status) =>
      leads.filter(
        (lead) => lead.status === status
      ).length
  );

  // --------------------------------
  // 3. Leads by Sales Agent
  // --------------------------------

  const agentNames = [
    ...new Set(
      leads.map(
        (lead) =>
          lead.salesAgent?.name ||
          "Not Assigned"
      )
    ),
  ];

  const agentLeadCounts = agentNames.map(
    (agentName) =>
      leads.filter(
        (lead) =>
          (lead.salesAgent?.name ||
            "Not Assigned") === agentName &&
          lead.status === "Closed"
      ).length
  );

  // --------------------------------
  // 4. Lead Status Distribution
  // --------------------------------

  const statuses = [
    "New",
    "Contacted",
    "Qualified",
    "Proposal Sent",
    "Closed",
  ];

  const statusCounts = statuses.map(
    (status) =>
      leads.filter(
        (lead) => lead.status === status
      ).length
  );

  // --------------------------------
  // Chart Data
  // --------------------------------

  const closedLastWeekChartData = {
    labels: ["Closed Last Week"],
    datasets: [
      {
        label: "Closed Leads",
        data: [closedLastWeek.length],
      },
    ],
  };

  const pipelineChartData = {
    labels: pipelineStatuses,
    datasets: [
      {
        label: "Leads",
        data: pipelineData,
      },
    ],
  };

  const agentChartData = {
    labels: agentNames,
    datasets: [
      {
        label: "Closed Leads",
        data: agentLeadCounts,
      },
    ],
  };

  const statusChartData = {
    labels: statuses,
    datasets: [
      {
        label: "Leads",
        data: statusCounts,
      },
    ],
  };

  return (
    <div className="container mt-4">

      <h2 className="mb-4">
        Reports and Visualization
      </h2>

      {/* -------------------------------- */}
      {/* Leads Closed Last Week */}
      {/* -------------------------------- */}

      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">
            Leads Closed Last Week
          </h5>
        </div>

        <div className="card-body">

          <p>
            Total leads closed in the last 7 days:
            <strong> {closedLastWeek.length}</strong>
          </p>

          <div style={{ maxWidth: "600px" }}>
            <Bar
              data={closedLastWeekChartData}
            />
          </div>

        </div>
      </div>

      {/* -------------------------------- */}
      {/* Total Leads in Pipeline */}
      {/* -------------------------------- */}

      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">
            Total Leads in Pipeline
          </h5>
        </div>

        <div className="card-body">

          <h4>
            {pipelineData.reduce(
              (total, count) =>
                total + count,
              0
            )}
          </h4>

          <p className="text-muted">
            Leads currently in the pipeline
          </p>

          <Bar
            data={pipelineChartData}
          />

        </div>
      </div>

      {/* -------------------------------- */}
      {/* Leads by Sales Agent */}
      {/* -------------------------------- */}

      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">
            Leads by Sales Agent
          </h5>
        </div>

        <div className="card-body">

          <p className="text-muted">
            Closed leads grouped by sales agent
          </p>

          {agentNames.length === 0 ? (
            <p className="text-muted">
              No agent data available
            </p>
          ) : (
            <Bar
              data={agentChartData}
            />
          )}

        </div>
      </div>

      {/* -------------------------------- */}
      {/* Lead Status Distribution */}
      {/* -------------------------------- */}

      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">
            Lead Status Distribution
          </h5>
        </div>

        <div className="card-body">

          <div
            style={{
              maxWidth: "500px",
              margin: "0 auto",
            }}
          >
            <Pie
              data={statusChartData}
            />
          </div>

        </div>
      </div>

    </div>
  );
};

export default ReportsView;
