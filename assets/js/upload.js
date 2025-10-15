// Upload JavaScript

let currentMedia = null
let currentMediaType = null
let videoElement = null

// File input change handler
document.getElementById("fileInput").addEventListener("change", handleFileSelect)

// Drag and drop handlers
const uploadArea = document.getElementById("uploadArea")

uploadArea.addEventListener("dragover", (e) => {
  e.preventDefault()
  uploadArea.classList.add("dragover")
})

uploadArea.addEventListener("dragleave", () => {
  uploadArea.classList.remove("dragover")
})

uploadArea.addEventListener("drop", (e) => {
  e.preventDefault()
  uploadArea.classList.remove("dragover")

  const files = e.dataTransfer.files
  handleFiles(files)
})

uploadArea.addEventListener("click", () => {
  document.getElementById("fileInput").click()
})

function handleFileSelect(e) {
  const files = e.target.files
  handleFiles(files)
}

function handleFiles(files) {
  if (files.length === 0) return

  const file = files[0]
  const fileType = file.type

  // Validate file type
  if (!fileType.startsWith("image/") && !fileType.startsWith("video/")) {
    showToast("Please upload an image or video file", "danger")
    return
  }

  // Validate file size (100MB max)
  if (file.size > 100 * 1024 * 1024) {
    showToast("File size must be less than 100MB", "danger")
    return
  }

  // Show upload progress
  simulateUpload(file)
}

function simulateUpload(file) {
  const progressDiv = document.getElementById("uploadProgress")
  const progressBar = document.getElementById("progressBar")
  const progressPercent = document.getElementById("progressPercent")

  progressDiv.style.display = "block"

  let progress = 0
  const interval = setInterval(() => {
    progress += 10
    progressBar.style.width = progress + "%"
    progressPercent.textContent = progress + "%"

    if (progress >= 100) {
      clearInterval(interval)
      setTimeout(() => {
        progressDiv.style.display = "none"
        loadMedia(file)
        addUploadedFile(file)
      }, 500)
    }
  }, 200)
}

function loadMedia(file) {
  const reader = new FileReader()

  reader.onload = (e) => {
    const previewContainer = document.getElementById("previewContainer")
    const mediaTypeBadge = document.getElementById("mediaType")
    const analyzeBtn = document.getElementById("analyzeBtn")

    currentMedia = e.target.result

    if (file.type.startsWith("image/")) {
      currentMediaType = "image"
      previewContainer.innerHTML = `<img src="${e.target.result}" class="camera-feed" alt="Uploaded Image">`
      mediaTypeBadge.textContent = "Image"
      mediaTypeBadge.className = "badge bg-info"
      document.getElementById("videoControls").style.display = "none"
    } else if (file.type.startsWith("video/")) {
      currentMediaType = "video"
      previewContainer.innerHTML = `<video id="videoPreview" class="camera-feed" src="${e.target.result}"></video>`
      mediaTypeBadge.textContent = "Video"
      mediaTypeBadge.className = "badge bg-success"
      document.getElementById("videoControls").style.display = "flex"
      videoElement = document.getElementById("videoPreview")
    }

    analyzeBtn.disabled = false
    showToast("Media loaded successfully!", "success")
  }

  reader.readAsDataURL(file)
}

function addUploadedFile(file) {
  const container = document.getElementById("uploadedFiles")
  const fileItem = document.createElement("div")
  fileItem.className = "d-flex justify-content-between align-items-center p-3 bg-light rounded mb-2"

  const fileIcon = file.type.startsWith("image/") ? "bi-image" : "bi-camera-video"

  fileItem.innerHTML = `
    <div class="d-flex align-items-center gap-2">
      <i class="bi ${fileIcon} text-primary" style="font-size: 1.5rem;"></i>
      <div>
        <div class="fw-bold">${file.name}</div>
        <div class="text-secondary small">${formatFileSize(file.size)}</div>
      </div>
    </div>
    <span class="badge bg-success">Uploaded</span>
  `

  container.appendChild(fileItem)
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

// Video Controls
function togglePlayPause() {
  if (!videoElement) return

  const btn = document.getElementById("playPauseBtn")

  if (videoElement.paused) {
    videoElement.play()
    btn.innerHTML = '<i class="bi bi-pause-fill"></i> Pause'
  } else {
    videoElement.pause()
    btn.innerHTML = '<i class="bi bi-play-fill"></i> Play'
  }
}

function captureFrame() {
  if (!videoElement) return

  const canvas = document.createElement("canvas")
  canvas.width = videoElement.videoWidth
  canvas.height = videoElement.videoHeight

  const ctx = canvas.getContext("2d")
  ctx.drawImage(videoElement, 0, 0)

  const frameData = canvas.toDataURL("image/png")

  // Create download link
  const link = document.createElement("a")
  link.href = frameData
  link.download = `frame-${Date.now()}.png`
  link.click()

  showToast("Frame captured successfully!", "success")
}

function resetVideo() {
  if (!videoElement) return

  videoElement.currentTime = 0
  videoElement.pause()
  document.getElementById("playPauseBtn").innerHTML = '<i class="bi bi-play-fill"></i> Play'
}

// Analyze Media
function analyzeMedia() {
  if (!currentMedia) return

  showToast("Analyzing media for defects...", "info")

  // Simulate analysis
  setTimeout(() => {
    const resultsDiv = document.getElementById("detectionResults")
    const resultsContainer = document.getElementById("resultsContainer")

    // Generate random defects
    const defects = [
      { type: "Surface Scratch", severity: "High", location: "45cm from start", confidence: 94 },
      { type: "Pin Hole", severity: "Critical", location: "78cm from start", confidence: 98 },
      { type: "Minor Cut", severity: "Medium", location: "120cm from start", confidence: 87 },
    ]

    resultsContainer.innerHTML = defects
      .map(
        (defect) => `
      <div class="detection-item">
        <div class="detection-info">
          <h4>${defect.type}</h4>
          <p>${defect.location} • Confidence: ${defect.confidence}%</p>
        </div>
        <span class="badge badge-${defect.severity.toLowerCase()}">${defect.severity}</span>
      </div>
    `,
      )
      .join("")

    resultsDiv.style.display = "block"
    showToast("Analysis complete! Found " + defects.length + " defects", "success")
  }, 3000)
}

// Feedback Form
document.getElementById("feedbackForm").addEventListener("submit", (e) => {
  e.preventDefault()

  const name = document.getElementById("feedbackName").value
  const rating = document.getElementById("feedbackRating").value
  const comments = document.getElementById("feedbackComments").value

  if (!name || !comments) {
    showToast("Please fill in all fields", "warning")
    return
  }

  // Add feedback to list
  const feedbackList = document.getElementById("feedbackList")
  const feedbackItem = document.createElement("div")
  feedbackItem.className = "activity-item"

  const stars = Array(5)
    .fill(0)
    .map((_, i) => (i < rating ? '<i class="bi bi-star-fill"></i>' : '<i class="bi bi-star"></i>'))
    .join("")

  feedbackItem.innerHTML = `
    <div class="activity-icon bg-success-subtle text-success">
      <i class="bi bi-person"></i>
    </div>
    <div class="activity-content flex-grow-1">
      <div class="d-flex justify-content-between">
        <h4>${name}</h4>
        <span class="text-warning">${stars}</span>
      </div>
      <p>${comments}</p>
    </div>
  `

  feedbackList.insertBefore(feedbackItem, feedbackList.firstChild)

  // Reset form
  document.getElementById("feedbackForm").reset()

  showToast("Feedback submitted successfully!", "success")
})

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
