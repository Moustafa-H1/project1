// Dashboard JavaScript

// Import Bootstrap
const bootstrap = window.bootstrap

let isLiveMode = true
const savedImages = []

// Import Image
function importImage() {
  const modal = new bootstrap.Modal(document.getElementById("importModal"))
  modal.show()
}

function loadImportedImage() {
  const input = document.getElementById("imageInput")
  const file = input.files[0]

  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      document.getElementById("cameraFeed").src = e.target.result
      isLiveMode = false
      updateLiveModeButton()
      addPhotoActivity("Image Imported", file.name, "upload", "warning")
      bootstrap.Modal.getInstance(document.getElementById("importModal")).hide()
    }
    reader.readAsDataURL(file)
  }
}

// Save Image
function saveImage() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
  const filename = `cable_inspection_${timestamp}.jpg`

  savedImages.push({
    filename: filename,
    timestamp: new Date(),
    src: document.getElementById("cameraFeed").src,
  })

  addPhotoActivity("Image Saved", filename, "save", "success")

  // Show success message
  showToast("Image saved successfully!", "success")
}

// Export Image
function exportImage() {
  const img = document.getElementById("cameraFeed")
  const link = document.createElement("a")
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-")

  link.href = img.src
  link.download = `defect_report_${timestamp}.jpg`
  link.click()

  addPhotoActivity("Image Exported", link.download, "download", "info")
  showToast("Image exported successfully!", "success")
}

// Show Gallery
function showGallery() {
  const modal = new bootstrap.Modal(document.getElementById("galleryModal"))
  modal.show()
}

// Toggle Live Mode
function toggleLiveMode() {
  isLiveMode = !isLiveMode

  if (isLiveMode) {
    document.getElementById("cameraFeed").src = "public/industrial-cable-manufacturing-production-line-cam.jpg"
  }

  updateLiveModeButton()
}

function updateLiveModeButton() {
  const btn = document.querySelector('[onclick="toggleLiveMode()"]')
  const text = document.getElementById("liveModeText")

  if (isLiveMode) {
    btn.classList.remove("btn-secondary")
    btn.classList.add("btn-primary")
    text.textContent = "Live Mode"
  } else {
    btn.classList.remove("btn-primary")
    btn.classList.add("btn-secondary")
    text.textContent = "Static Mode"
  }
}

// Add Photo Activity
function addPhotoActivity(action, filename, icon, color) {
  const container = document.getElementById("photoActivities")
  const activityItem = document.createElement("div")
  activityItem.className = "activity-item"

  const iconMap = {
    upload: "bi-upload",
    save: "bi-save",
    download: "bi-download",
  }

  activityItem.innerHTML = `
    <div class="activity-icon bg-${color}-subtle text-${color}">
      <i class="bi ${iconMap[icon]}"></i>
    </div>
    <div class="activity-content flex-grow-1">
      <h4>${action}</h4>
      <p>${filename} - Just now</p>
    </div>
  `

  container.insertBefore(activityItem, container.firstChild)

  // Keep only last 5 activities
  while (container.children.length > 5) {
    container.removeChild(container.lastChild)
  }
}

// Show Toast Notification
function showToast(message, type) {
  // Create toast element
  const toast = document.createElement("div")
  toast.className = `alert alert-${type} position-fixed top-0 end-0 m-3`
  toast.style.zIndex = "9999"
  toast.textContent = message

  document.body.appendChild(toast)

  setTimeout(() => {
    toast.remove()
  }, 3000)
}

// Simulate real-time updates
function simulateRealTimeUpdates() {
  if (isLiveMode) {
    // Update detection results randomly
    const defectTypes = ["Surface Scratch", "Pin Hole", "Minor Cut", "Deep Cut", "Crack"]
    const severities = ["Critical", "High", "Medium", "Low"]
    const severityClasses = ["critical", "high", "medium", "low"]

    // Randomly update every 5-10 seconds
    if (Math.random() > 0.7) {
      const randomDefect = defectTypes[Math.floor(Math.random() * defectTypes.length)]
      const randomSeverity = Math.floor(Math.random() * severities.length)
      const location = Math.floor(Math.random() * 200) + 20

      addDetectionResult(randomDefect, location, severities[randomSeverity], severityClasses[randomSeverity])
    }
  }
}

function addDetectionResult(defect, location, severity, severityClass) {
  const container = document.getElementById("detectionResults")
  const item = document.createElement("div")
  item.className = "detection-item"

  item.innerHTML = `
    <div class="detection-info">
      <h4>${defect}</h4>
      <p>Location: ${location}cm from start</p>
    </div>
    <span class="badge badge-${severityClass}">${severity}</span>
  `

  container.insertBefore(item, container.firstChild)

  // Keep only last 5 results
  while (container.children.length > 5) {
    container.removeChild(container.lastChild)
  }

  // Add to activity log
  addActivity(
    `${severity} severity defect`,
    `Cable #A-${Math.floor(Math.random() * 9000) + 1000}`,
    severity.toLowerCase(),
  )
}

function addActivity(action, cable, type) {
  const container = document.getElementById("recentActivity")
  const item = document.createElement("div")
  item.className = "activity-item"

  const iconMap = {
    critical: { icon: "bi-exclamation-triangle", color: "danger" },
    high: { icon: "bi-exclamation-circle", color: "warning" },
    medium: { icon: "bi-info-circle", color: "info" },
    low: { icon: "bi-check-circle", color: "success" },
  }

  const config = iconMap[type] || iconMap["medium"]

  item.innerHTML = `
    <div class="activity-icon bg-${config.color}-subtle text-${config.color}">
      <i class="bi ${config.icon}"></i>
    </div>
    <div class="activity-content">
      <h4>${action}</h4>
      <p>${cable} - Just now</p>
    </div>
  `

  container.insertBefore(item, container.firstChild)

  // Keep only last 5 activities
  while (container.children.length > 5) {
    container.removeChild(container.lastChild)
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Start real-time simulation
  setInterval(simulateRealTimeUpdates, 8000)
})
