// analytics.js - plain browser JS (no imports)

// Use global Chart from Chart.js and global bootstrap from bootstrap.bundle
const bootstrap = window.bootstrap || (window.bootstrap = null);

// Chart.js default configuration
if (window.Chart) {
  Chart.defaults.color = "#a0a0a0";
  Chart.defaults.borderColor = "#2a2a2a";
  Chart.defaults.font.family = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
}

// Color palette
const colors = {
  red: "#c41e3a",
  blue: "#3b82f6",
  green: "#10b981",
  yellow: "#f59e0b",
  purple: "#8b5cf6",
  orange: "#f97316",
};

// Helper to safely get 2d context
function getCtxById(id) {
  const el = document.getElementById(id);
  if (!el) return null;
  try {
    return el.getContext && el.getContext("2d");
  } catch (e) {
    return null;
  }
}

// Defect Trend Chart
const trendCtx = getCtxById("trendChart");
let trendChart = null;
if (trendCtx && window.Chart) {
  trendChart = new Chart(trendCtx, {
    type: "line",
    data: {
      labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
      datasets: [
        {
          label: "Total Defects",
          data: [145,178,156,189,167,198,176,154,142,168,159,147],
          borderColor: colors.red,
          backgroundColor: colors.red + "20",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Critical Defects",
          data: [12,15,11,18,14,16,13,10,9,12,11,10],
          borderColor: colors.yellow,
          backgroundColor: colors.yellow + "20",
          tension: 0.4,
          fill: true,
        },
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: "top" }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: "#2a2a2a" }
        },
        x: {
          grid: { color: "#2a2a2a" }
        }
      }
    }
  });
}

// Distribution Chart (Doughnut)
const distributionCtx = getCtxById("distributionChart");
let distributionChart = null;
if (distributionCtx && window.Chart) {
  distributionChart = new Chart(distributionCtx, {
    type: "doughnut",
    data: {
      labels: ["Critical","High","Medium","Low"],
      datasets: [
        {
          data: [127,623,983,114],
          backgroundColor: [colors.red, colors.yellow, colors.blue, colors.green],
          borderWidth: 2,
          borderColor: "#1a1a1a"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: true, position: "bottom" } }
    }
  });
}

// Defects by Type Chart
const typeCtx = getCtxById("typeChart");
let typeChart = null;
if (typeCtx && window.Chart) {
  typeChart = new Chart(typeCtx, {
    type: "bar",
    data: {
      labels: ["Surface Scratch","Pin Hole","Cut","Crack","Surface Irregularity"],
      datasets: [
        {
          label: "Count",
          data: [687,423,389,234,114],
          backgroundColor: [colors.blue, colors.red, colors.yellow, colors.orange, colors.green],
          borderWidth: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: "#2a2a2a" } },
        x: { grid: { display: false } }
      }
    }
  });
}

// Quality Rate Chart
const qualityCtx = getCtxById("qualityChart");
let qualityChart = null;
if (qualityCtx && window.Chart) {
  qualityChart = new Chart(qualityCtx, {
    type: "line",
    data: {
      labels: ["Week 1","Week 2","Week 3","Week 4","Week 5","Week 6","Week 7","Week 8"],
      datasets: [
        {
          label: "Quality Rate (%)",
          data: [91.2,92.5,91.8,93.1,92.3,93.8,92.9,92.8],
          borderColor: colors.green,
          backgroundColor: colors.green + "20",
          tension: 0.4,
          fill: true
        },
        {
          label: "Target (%)",
          data: [92,92,92,92,92,92,92,92],
          borderColor: colors.blue,
          borderDash: [5,5],
          tension: 0,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: true, position: "top" } },
      scales: {
        y: {
          beginAtZero: false,
          min: 88,
          max: 96,
          grid: { color: "#2a2a2a" }
        },
        x: { grid: { color: "#2a2a2a" } }
      }
    }
  });
}

// Export Modal Functions
function openExportModal() {
  // Set report date
  const now = new Date();
  const reportDateEl = document.getElementById("reportDate");
  if (reportDateEl) {
    reportDateEl.textContent = now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  if (bootstrap && document.getElementById("exportModal")) {
    const modal = new bootstrap.Modal(document.getElementById("exportModal"));
    modal.show();
  } else {
    // fallback: just open the modal element as visible if bootstrap is not available
    const m = document.getElementById("exportModal");
    if (m) m.style.display = "block";
  }
}

function printReport() {
  const reportContentEl = document.getElementById("reportContent");
  if (!reportContentEl) {
    showToast("No report content to print.", "warning");
    return;
  }
  const printContent = reportContentEl.innerHTML;
  const originalContent = document.body.innerHTML;

  // Create print-friendly version
  document.body.innerHTML = `
    <html>
      <head>
        <title>Defect Detection Report</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
          @media print {
            body { background: white; color: black; }
            .bg-light { background-color: #f0f0f0 !important; }
            .text-secondary { color: #666 !important; }
          }
        </style>
      </head>
      <body>
        <div class="container py-4">
          ${printContent}
        </div>
      </body>
    </html>
  `;

  window.print();

  // Restore original content
  document.body.innerHTML = originalContent;
  window.location.reload();
}

function downloadReport() {
  const reportData = {
    title: "Cable Defect Detection Report",
    date: new Date().toISOString(),
    summary: {
      totalInspections: 24567,
      defectsFound: 1847,
      qualityRate: "92.5%",
      accuracy: "98.5%"
    },
    defectsByType: {
      "Surface Scratch": 687,
      "Pin Hole": 423,
      Cut: 389,
      Crack: 234,
      "Surface Irregularity": 114
    },
    severityDistribution: {
      Critical: 127,
      High: 623,
      Medium: 983,
      Low: 114
    }
  };

  const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `defect-report-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);

  showToast("Report downloaded successfully!", "success");
}

function showToast(message, type) {
  const toast = document.createElement("div");
  toast.className = `alert alert-${type || "info"} position-fixed top-0 end-0 m-3`;
  toast.style.zIndex = "9999";
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Optional: expose functions for button handlers
window.analytics = {
  openExportModal,
  printReport,
  downloadReport,
  showToast
};
