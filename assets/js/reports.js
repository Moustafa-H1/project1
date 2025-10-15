// Reports JavaScript

const bootstrap = window.bootstrap

// Set default dates
document.addEventListener("DOMContentLoaded", () => {
  const today = new Date()
  const endDate = today.toISOString().split("T")[0]
  const startDate = new Date(today.setDate(today.getDate() - 7)).toISOString().split("T")[0]

  document.getElementById("startDate").value = startDate
  document.getElementById("endDate").value = endDate
})

// Handle report form submission
document.getElementById("reportForm").addEventListener("submit", (e) => {
  e.preventDefault()

  const reportType = document.getElementById("reportType").value
  const startDate = document.getElementById("startDate").value
  const endDate = document.getElementById("endDate").value

  generateReport(reportType, startDate, endDate)
})

function generateReport(type, startDate, endDate) {
  // Show loading state
  showToast("Generating report...", "info")

  // Simulate report generation
  setTimeout(() => {
    const reportId = `RPT-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`
    const defectsFound = Math.floor(Math.random() * 500) + 20

    // Add new report to table
    const tableBody = document.getElementById("reportsTable")
    const newRow = document.createElement("tr")
    newRow.innerHTML = `
      <td><strong>${reportId}</strong></td>
      <td>${formatReportType(type)}</td>
      <td>${formatDateRange(startDate, endDate)}</td>
      <td>${new Date().toLocaleString()}</td>
      <td>${defectsFound}</td>
      <td><span class="badge bg-success">Complete</span></td>
      <td>
        <button class="btn btn-sm btn-secondary" onclick="viewReport('${reportId}')">
          <i class="bi bi-eye"></i>
        </button>
        <button class="btn btn-sm btn-secondary" onclick="downloadReport('${reportId}')">
          <i class="bi bi-download"></i>
        </button>
        <button class="btn btn-sm btn-secondary" onclick="printReport('${reportId}')">
          <i class="bi bi-printer"></i>
        </button>
      </td>
    `

    tableBody.insertBefore(newRow, tableBody.firstChild)

    showToast("Report generated successfully!", "success")
  }, 2000)
}

function formatReportType(type) {
  const types = {
    daily: "Daily Summary",
    weekly: "Weekly Analysis",
    monthly: "Monthly Overview",
    custom: "Custom Range",
  }
  return types[type] || type
}

function formatDateRange(start, end) {
  const startDate = new Date(start)
  const endDate = new Date(end)

  if (start === end) {
    return startDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
}

function viewReport(reportId) {
  const modal = new bootstrap.Modal(document.getElementById("viewReportModal"))
  const content = document.getElementById("reportViewContent")

  // Generate report content
  content.innerHTML = `
    <div class="text-center mb-4">
      <img src="./public/elswady.png" alt="Elsewedy Cables" style="max-width: 200px; margin-bottom: 1rem;">
      <h2>Cable Defect Detection Report</h2>
      <p class="text-secondary">Report ID: ${reportId}</p>
      <p class="text-secondary">Generated on ${new Date().toLocaleString()}</p>
    </div>

    <div class="mb-4">
      <h4 class="mb-3">Executive Summary</h4>
      <div class="row g-3">
        <div class="col-md-3">
          <div class="p-3 bg-light rounded text-center border-1 shadow-sm">
            <div class="text-secondary small mb-1">Total Inspections</div>
            <div class="h4 mb-0">${Math.floor(Math.random() * 5000) + 1000}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="p-3 bg-light rounded text-center border-1 shadow-sm">
            <div class="text-secondary small mb-1">Defects Found</div>
            <div class="h4 mb-0">${Math.floor(Math.random() * 500) + 50}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="p-3 bg-light rounded text-center border-1 shadow-sm">
            <div class="text-secondary small mb-1">Quality Rate</div>
            <div class="h4 mb-0">${(Math.random() * 5 + 90).toFixed(1)}%</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="p-3 bg-light rounded text-center border-1 shadow-sm">
            <div class="text-secondary small mb-1">Accuracy</div>
            <div class="h4 mb-0">${(Math.random() * 2 + 97).toFixed(1)}%</div>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-4">
      <h4 class="mb-3">Defect Breakdown by Type</h4>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Defect Type</th>
            <th>Count</th>
            <th>Percentage</th>
            <th>Severity</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Surface Scratch</td>
            <td>${Math.floor(Math.random() * 200) + 100}</td>
            <td>37.2%</td>
            <td><span class="badge badge-medium">Medium</span></td>
          </tr>
          <tr>
            <td>Pin Hole</td>
            <td>${Math.floor(Math.random() * 150) + 50}</td>
            <td>22.9%</td>
            <td><span class="badge badge-critical">Critical</span></td>
          </tr>
          <tr>
            <td>Cut</td>
            <td>${Math.floor(Math.random() * 150) + 50}</td>
            <td>21.1%</td>
            <td><span class="badge badge-high">High</span></td>
          </tr>
          <tr>
            <td>Crack</td>
            <td>${Math.floor(Math.random() * 100) + 30}</td>
            <td>12.7%</td>
            <td><span class="badge badge-high">High</span></td>
          </tr>
          <tr>
            <td>Surface Irregularity</td>
            <td>${Math.floor(Math.random() * 50) + 20}</td>
            <td>6.2%</td>
            <td><span class="badge badge-low">Low</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mb-4">
      <h4 class="mb-3">Recommendations</h4>
      <ul class="list-unstyled">
        <li class="mb-2">
          <i class="bi bi-check-circle text-success me-2"></i>
          Continue monitoring pin hole defects as they represent the highest critical severity
        </li>
        <li class="mb-2">
          <i class="bi bi-check-circle text-success me-2"></i>
          Implement preventive maintenance to reduce surface scratches
        </li>
        <li class="mb-2">
          <i class="bi bi-check-circle text-success me-2"></i>
          Review production line settings to minimize cutting defects
        </li>
        <li class="mb-2">
          <i class="bi bi-check-circle text-success me-2"></i>
          System accuracy is excellent - maintain current calibration
        </li>
      </ul>
    </div>
  `

  modal.show()
}

function downloadReport(reportId) {
  showToast(`Downloading report ${reportId}...`, "info")

  // Simulate download
  setTimeout(() => {
    const reportData = {
      reportId: reportId,
      generatedDate: new Date().toISOString(),
      summary: {
        totalInspections: Math.floor(Math.random() * 5000) + 1000,
        defectsFound: Math.floor(Math.random() * 500) + 50,
        qualityRate: (Math.random() * 5 + 90).toFixed(1) + "%",
        accuracy: (Math.random() * 2 + 97).toFixed(1) + "%",
      },
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${reportId}.json`
    link.click()
    URL.revokeObjectURL(url)

    showToast("Report downloaded successfully!", "success")
  }, 1000)
}

function printReport(reportId) {
  showToast(`Preparing report ${reportId} for printing...`, "info")

  // Open view modal first, then print
  viewReport(reportId)

  setTimeout(() => {
    printCurrentReport()
  }, 500)
}

function printCurrentReport() {
  const printContent = document.getElementById("reportViewContent").innerHTML

  const printWindow = window.open("", "", "width=800,height=600")
  printWindow.document.write(`
    <html>
      <head>
        <title>Print Report</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="assets/css/style.css">
        <style>
          @media print {
            body { background: white; color: black; }
            .bg-secondary { background-color: #f0f0f0 !important; }
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
  `)
  printWindow.document.close()
  printWindow.print()
}

function downloadCurrentReport() {
  const reportContent = document.getElementById("reportViewContent").innerText

  const blob = new Blob([reportContent], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `report-${new Date().toISOString().split("T")[0]}.txt`
  link.click()
  URL.revokeObjectURL(url)

  showToast("Report downloaded successfully!", "success")
}

function refreshReports() {
  showToast("Refreshing reports...", "info")

  setTimeout(() => {
    showToast("Reports refreshed!", "success")
  }, 1000)
}

function showToast(message, type) {
  const toast = document.createElement("div")
  toast.className = `alert alert-${type} position-fixed top-0 end-0 m-3`
  toast.style.zIndex = "9999"
  toast.textContent = message

  document.body.appendChild(toast)

  setTimeout(() => {
    toast.remove()
  }, 3000)
}
