// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize animations and interactions
  initAnimations()
  initCommunitySelection()
  initVerificationFlow()
  initRideCreation()
  initRideOptions()
  initFloatingActionButton()
  initToasts()
  initGetStartedButton()
})

// Initialize animations
function initAnimations() {
  // Create animated particles
  createParticles()

  // Add scroll animations
  const sections = document.querySelectorAll("section")

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in")
        }
      })
    },
    { threshold: 0.1 },
  )

  sections.forEach((section) => {
    observer.observe(section)
  })
}

// Create animated particles in the background
function createParticles() {
  const particlesContainer = document.querySelector(".particles")
  const particleCount = 50

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div")
    particle.classList.add("particle")

    // Random position
    const posX = Math.random() * 100
    const posY = Math.random() * 100

    // Random size
    const size = Math.random() * 3 + 1

    // Random animation duration
    const duration = Math.random() * 20 + 10

    // Random animation delay
    const delay = Math.random() * 10

    // Set styles
    particle.style.cssText = `
      position: absolute;
      top: ${posY}%;
      left: ${posX}%;
      width: ${size}px;
      height: ${size}px;
      background-color: rgba(67, 97, 238, ${Math.random() * 0.5 + 0.1});
      border-radius: 50%;
      animation: float ${duration}s ease-in-out ${delay}s infinite alternate;
    `

    particlesContainer.appendChild(particle)
  }
}

// Initialize get started button
function initGetStartedButton() {
  const getStartedBtn = document.getElementById("getStartedBtn")

  if (getStartedBtn) {
    getStartedBtn.addEventListener("click", () => {
      document.getElementById("communitySelection").scrollIntoView({ behavior: "smooth" })
    })
  }
}

// Initialize community selection
function initCommunitySelection() {
  const communityCards = document.querySelectorAll(".community-selection .community-card")

  communityCards.forEach((card) => {
    card.addEventListener("click", function () {
      // Get community type
      const communityType = this.dataset.community

      // Update community name in verification flow
      const communityNameElements = document.querySelectorAll(".community-name")
      communityNameElements.forEach((element) => {
        if (communityType === "university") {
          element.textContent = "University"
        } else if (communityType === "company") {
          element.textContent = "Company"
        } else {
          element.textContent = "Public"
        }
      })

      // Show verification flow section
      const verificationFlow = document.getElementById("verificationFlow")
      verificationFlow.style.display = "block"

      // Scroll to verification flow section
      verificationFlow.scrollIntoView({ behavior: "smooth" })

      // Update verification flow based on community type
      updateVerificationFlow(communityType)
    })
  })
}

// Update verification flow based on selected community
function updateVerificationFlow(communityType) {
  const emailVerification = document.getElementById("emailVerification")
  const idVerification = document.getElementById("idVerification")
  const domainHint = document.querySelector(".domain-hint")

  // Reset verification steps
  document.querySelectorAll(".verification-step").forEach((step) => {
    step.classList.remove("active")
  })

  // Set first step as active
  emailVerification.classList.add("active")

  // Update email placeholder and domain hint based on community type
  const emailInput = document.getElementById("email")

  if (communityType === "university") {
    emailInput.placeholder = "your@university.edu"
    domainHint.textContent = "We accept emails from: .edu, harvard.edu, mit.edu, stanford.edu, etc."
    document.querySelector("#idVerification h3").textContent = "Student ID Verification"
    document.querySelector("#idVerification .verification-description").textContent =
      "Upload your student ID card to verify your university affiliation"
  } else if (communityType === "company") {
    emailInput.placeholder = "your@company.com"
    domainHint.textContent = "We accept emails from: company.com, google.com, microsoft.com, etc."
    document.querySelector("#idVerification h3").textContent = "Employee ID Verification"
    document.querySelector("#idVerification .verification-description").textContent =
      "Upload your employee ID card to verify your company affiliation"
  } else {
    emailInput.placeholder = "your@email.com"
    domainHint.textContent = "Please use your personal email address"
    document.querySelector("#idVerification h3").textContent = "Identity Verification"
    document.querySelector("#idVerification .verification-description").textContent =
      "Upload a valid ID to verify your identity"
  }
}

// Initialize verification flow
function initVerificationFlow() {
  // Email verification form submission
  const emailForm = document.querySelector(".verification-form")

  if (emailForm) {
    emailForm.addEventListener("submit", function (e) {
      e.preventDefault()

      // Show loading state
      const verifyBtn = this.querySelector(".verify-btn")
      verifyBtn.innerHTML = '<span>Verifying...</span><div class="btn-glow"></div>'
      verifyBtn.disabled = true

      // Simulate verification process
      setTimeout(() => {
        // Move to next step
        document.getElementById("emailVerification").classList.remove("active")
        document.getElementById("idVerification").classList.add("active")

        // Reset button
        verifyBtn.innerHTML = '<span>Verify Email</span><div class="btn-glow"></div>'
        verifyBtn.disabled = false

        // Scroll to the next step
        document.getElementById("idVerification").scrollIntoView({ behavior: "smooth" })
      }, 1500)
    })
  }

  // File upload interaction
  const fileInput = document.getElementById("idDocument")
  const uploadArea = document.querySelector(".upload-area")
  const uploadPreview = document.querySelector(".upload-preview")
  const uploadText = document.querySelector(".upload-text")
  const fileName = document.querySelector(".file-name")
  const fileSize = document.querySelector(".file-size")
  const browseBtn = document.querySelector(".browse-btn")

  if (browseBtn && fileInput) {
    browseBtn.addEventListener("click", (e) => {
      e.preventDefault()
      fileInput.click()
    })
  }

  if (fileInput && uploadPreview && uploadText && fileName && fileSize) {
    fileInput.addEventListener("change", function () {
      if (this.files.length > 0) {
        const file = this.files[0]

        // Update preview
        fileName.textContent = file.name
        fileSize.textContent = formatFileSize(file.size)

        // Show preview, hide upload text
        uploadText.classList.add("hidden")
        uploadPreview.classList.remove("hidden")
      }
    })
  }

  // Remove file button
  const removeFileBtn = document.querySelector(".remove-file")

  if (removeFileBtn && fileInput && uploadText && uploadPreview) {
    removeFileBtn.addEventListener("click", () => {
      fileInput.value = ""
      uploadText.classList.remove("hidden")
      uploadPreview.classList.add("hidden")
    })
  }

  // ID verification submission
  const submitIdBtn = document.querySelector(".submit-id-btn")

  if (submitIdBtn && fileInput) {
    submitIdBtn.addEventListener("click", function () {
      // Check if file is selected
      if (fileInput.files.length === 0) {
        // Show error toast
        showToast("error", "Error", "Please upload a document for verification.")
        return
      }

      // Show loading state
      this.innerHTML = '<span>Processing...</span><div class="btn-glow"></div>'
      this.disabled = true

      // Simulate verification process
      setTimeout(() => {
        // Move to next step
        document.getElementById("idVerification").classList.remove("active")
        document.getElementById("verificationComplete").classList.add("active")

        // Reset button
        this.innerHTML = '<span>Submit for Verification</span><div class="btn-glow"></div>'
        this.disabled = false

        // Show success result (80% chance of success)
        const isSuccess = Math.random() > 0.2

        if (isSuccess) {
          document.querySelector(".verification-result.success").classList.remove("hidden")
          document.querySelector(".verification-result.error").classList.add("hidden")
        } else {
          document.querySelector(".verification-result.success").classList.add("hidden")
          document.querySelector(".verification-result.error").classList.remove("hidden")
        }

        // Scroll to the next step
        document.getElementById("verificationComplete").scrollIntoView({ behavior: "smooth" })
      }, 2000)
    })
  }

  // Continue button after verification
  const continueBtn = document.querySelector(".continue-btn")

  if (continueBtn) {
    continueBtn.addEventListener("click", () => {
      // Show ride options section
      document.getElementById("rideOptions").style.display = "block"

      // Scroll to ride options section
      document.getElementById("rideOptions").scrollIntoView({ behavior: "smooth" })
    })
  }

  // Retry button for failed verification
  const retryBtn = document.querySelector(".retry-btn")

  if (retryBtn) {
    retryBtn.addEventListener("click", () => {
      // Go back to ID verification step
      document.getElementById("verificationComplete").classList.remove("active")
      document.getElementById("idVerification").classList.add("active")

      // Reset file input
      if (fileInput) {
        fileInput.value = ""
        uploadText.classList.remove("hidden")
        uploadPreview.classList.add("hidden")
      }

      // Scroll to ID verification step
      document.getElementById("idVerification").scrollIntoView({ behavior: "smooth" })
    })
  }
}

// Initialize ride options
function initRideOptions() {
  const offerRideCard = document.getElementById("offerRideCard")
  const findRideCard = document.getElementById("findRideCard")

  if (offerRideCard) {
    offerRideCard.addEventListener("click", () => {
      // Show ride creation section
      document.getElementById("rideCreation").style.display = "block"

      // Scroll to ride creation section
      document.getElementById("rideCreation").scrollIntoView({ behavior: "smooth" })
    })
  }

  if (findRideCard) {
    findRideCard.addEventListener("click", () => {
      // Show find ride section
      document.getElementById("findRide").style.display = "block"

      // Scroll to find ride section
      document.getElementById("findRide").scrollIntoView({ behavior: "smooth" })
    })
  }

  // Offer ride button
  const offerRideBtn = document.querySelector(".offer-ride-btn")

  if (offerRideBtn) {
    offerRideBtn.addEventListener("click", () => {
      // Show ride creation section
      document.getElementById("rideCreation").style.display = "block"

      // Scroll to ride creation section
      document.getElementById("rideCreation").scrollIntoView({ behavior: "smooth" })
    })
  }

  // Find ride button
  const findRideBtn = document.querySelector(".find-ride-btn")

  if (findRideBtn) {
    findRideBtn.addEventListener("click", () => {
      // Show find ride section
      document.getElementById("findRide").style.display = "block"

      // Scroll to find ride section
      document.getElementById("findRide").scrollIntoView({ behavior: "smooth" })
    })
  }
}

// Initialize ride creation
function initRideCreation() {
  // Match option selection
  const matchOptions = document.querySelectorAll(".match-option")
  const previewBadge = document.querySelector(".preview-badge")

  if (matchOptions && previewBadge) {
    matchOptions.forEach((option) => {
      option.addEventListener("click", function () {
        // Remove active class from all options
        matchOptions.forEach((o) => o.classList.remove("active"))

        // Add active class to clicked option
        this.classList.add("active")

        // Update preview badge
        const matchType = this.dataset.match

        if (matchType === "campus") {
          previewBadge.textContent = "Campus Only"
        } else if (matchType === "event") {
          previewBadge.textContent = "Campus Event"
        } else {
          previewBadge.textContent = "Open to Public"
        }
      })
    })
  }

  // Live preview updates
  const originInput = document.getElementById("origin")
  const destinationInput = document.getElementById("destination")
  const dateInput = document.getElementById("date")
  const timeInput = document.getElementById("time")
  const seatsInput = document.getElementById("seats")

  const previewOrigin = document.getElementById("previewOrigin")
  const previewDestination = document.getElementById("previewDestination")
  const previewDate = document.getElementById("previewDate")
  const previewTime = document.getElementById("previewTime")
  const previewSeats = document.getElementById("previewSeats")

  if (originInput && previewOrigin) {
    originInput.addEventListener("input", function () {
      previewOrigin.textContent = this.value || "Enter origin"
    })
  }

  if (destinationInput && previewDestination) {
    destinationInput.addEventListener("input", function () {
      previewDestination.textContent = this.value || "Enter destination"
    })
  }

  if (dateInput && previewDate) {
    dateInput.addEventListener("change", function () {
      if (this.value) {
        const date = new Date(this.value)
        previewDate.textContent = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
      } else {
        previewDate.textContent = "Select date"
      }
    })
  }

  if (timeInput && previewTime) {
    timeInput.addEventListener("change", function () {
      if (this.value) {
        const [hours, minutes] = this.value.split(":")
        const time = new Date()

        time.setHours(Number.parseInt(hours))
        time.setMinutes(Number.parseInt(minutes))
        previewTime.textContent = time.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
      } else {
        previewTime.textContent = "Select time"
      }
    })
  }

  if (seatsInput && previewSeats) {
    seatsInput.addEventListener("change", function () {
      previewSeats.textContent = `${this.value} available`
    })
  }

  // Ride form submission
  const rideForm = document.querySelector(".ride-form")

  if (rideForm) {
    rideForm.addEventListener("submit", function (e) {
      e.preventDefault()

      // Validate form
      if (!originInput.value || !destinationInput.value || !dateInput.value || !timeInput.value) {
        showToast("error", "Error", "Please fill in all required fields.")
        return
      }

      // Show loading state
      const createRideBtn = this.querySelector(".create-ride-btn")
      createRideBtn.innerHTML = '<span>Creating...</span><div class="btn-glow"></div>'
      createRideBtn.disabled = true

      // Simulate ride creation
      setTimeout(() => {
        // Reset button
        createRideBtn.innerHTML = '<span>Create Campus Ride</span><div class="btn-glow"></div>'
        createRideBtn.disabled = false

        // Show success toast
        showToast("success", "Success!", "Your campus ride has been created successfully.")

        // Reset form
        this.reset()
        previewOrigin.textContent = "Enter origin"
        previewDestination.textContent = "Enter destination"
        previewDate.textContent = "Select date"
        previewTime.textContent = "Select time"
        previewSeats.textContent = "3 available"
      }, 1500)
    })
  }

  // Search form submission
  const searchForm = document.querySelector(".search-form")

  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault()

      // Show loading state
      const searchBtn = this.querySelector(".search-btn")
      searchBtn.innerHTML = '<span>Searching...</span><div class="btn-glow"></div>'
      searchBtn.disabled = true

      // Simulate search
      setTimeout(() => {
        // Reset button
        searchBtn.innerHTML = '<span>Search Rides</span><div class="btn-glow"></div>'
        searchBtn.disabled = false

        // Show info toast
        showToast("info", "Rides Found", "We found 2 rides matching your criteria.")
      }, 1000)
    })
  }

  // Request ride buttons
  const requestBtns = document.querySelectorAll(".request-btn")

  if (requestBtns) {
    requestBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        // Show loading state
        this.innerHTML = '<span>Requesting...</span><div class="btn-glow"></div>'
        this.disabled = true

        // Simulate request
        setTimeout(() => {
          // Reset button
          this.innerHTML = '<span>Request Ride</span><div class="btn-glow"></div>'
          this.disabled = false

          // Show success toast
          showToast("success", "Request Sent", "Your ride request has been sent to the driver.")
        }, 1000)
      })
    })
  }
}

// Initialize floating action button
function initFloatingActionButton() {
  const fabBtn = document.querySelector(".fab-btn")
  const fabMenu = document.querySelector(".fab-menu")
  const fabMenuItems = document.querySelectorAll(".fab-menu-item")

  if (fabBtn && fabMenu) {
    fabBtn.addEventListener("click", function () {
      fabMenu.classList.toggle("active")
      this.classList.toggle("active")
    })
  }

  if (fabMenuItems) {
    fabMenuItems.forEach((item) => {
      item.addEventListener("click", function () {
        const action = this.dataset.action

        if (action === "create-ride") {
          // Show ride creation section if not already visible
          document.getElementById("rideCreation").style.display = "block"
          document.getElementById("rideCreation").scrollIntoView({ behavior: "smooth" })
        } else if (action === "find-ride") {
          // Show find ride section if not already visible
          document.getElementById("findRide").style.display = "block"
          document.getElementById("findRide").scrollIntoView({ behavior: "smooth" })
        } else if (action === "community") {
          document.getElementById("communitySelection").scrollIntoView({ behavior: "smooth" })
        }

        // Close the menu
        if (fabMenu && fabBtn) {
          fabMenu.classList.remove("active")
          fabBtn.classList.remove("active")
        }
      })
    })
  }
}

// Initialize toast notifications
function initToasts() {
  const toastContainer = document.querySelector(".toast-container")
  const toasts = document.querySelectorAll(".toast")

  // Close button functionality
  if (toasts) {
    toasts.forEach((toast) => {
      const closeBtn = toast.querySelector(".toast-close")

      if (closeBtn) {
        closeBtn.addEventListener("click", () => {
          toast.classList.add("hidden")
        })
      }
    })
  }
}

// Show toast notification
function showToast(type, title, message) {
  const toastContainer = document.querySelector(".toast-container")
  const toast = document.querySelector(`.toast.${type}`)

  if (!toast) return

  // Update toast content
  toast.querySelector("h4").textContent = title
  toast.querySelector("p").textContent = message

  // Show toast
  toast.classList.remove("hidden")

  // Auto-hide after 5 seconds
  setTimeout(() => {
    toast.classList.add("hidden")
  }, 5000)
}

// Format file size
function formatFileSize(bytes) {
  if (bytes < 1024) {
    return bytes + " B"
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(2) + " KB"
  } else {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB"
  }
}

// Add parallax effect to background elements
document.addEventListener("mousemove", (e) => {
  const mouseX = e.clientX / window.innerWidth
  const mouseY = e.clientY / window.innerHeight

  const spheres = document.querySelectorAll(".gradient-sphere")
  const cards = document.querySelectorAll(".floating-card")

  // Parallax effect for background spheres
  if (spheres) {
    spheres.forEach((sphere, index) => {
      const depth = (index + 1) * 20
      const moveX = (mouseX - 0.5) * depth
      const moveY = (mouseY - 0.5) * depth

      sphere.style.transform = `translate(${moveX}px, ${moveY}px)`
    })
  }

  // Subtle parallax effect for floating cards
  if (cards) {
    cards.forEach((card, index) => {
      const depth = (index + 1) * 5
      const moveX = (mouseX - 0.5) * depth
      const moveY = (mouseY - 0.5) * depth

      // Apply transform in addition to the float animation
      card.style.transform = `translate(${moveX}px, ${moveY}px)`
    })
  }
})

// Add scroll animations
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY

  // Parallax scroll effect for hero section
  const heroContent = document.querySelector(".hero-content")
  const heroImage = document.querySelector(".hero-image")

  if (heroContent && heroImage) {
    heroContent.style.transform = `translateY(${scrollY * 0.2}px)`
    heroImage.style.transform = `translateY(${scrollY * 0.1}px)`
  }
})

// Add 3D tilt effect to cards
const cards = document.querySelectorAll(".community-selection .community-card")

if (cards) {
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const cardRect = card.getBoundingClientRect()
      const cardX = e.clientX - cardRect.left
      const cardY = e.clientY - cardRect.top

      const centerX = cardRect.width / 2
      const centerY = cardRect.height / 2

      const percentX = (cardX - centerX) / centerX
      const percentY = (cardY - centerY) / centerY

      const tiltAmount = 10
      const tiltX = percentY * tiltAmount
      const tiltY = -percentX * tiltAmount

      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`

      // Dynamic shadow based on tilt
      card.style.boxShadow = `
        ${-tiltY * 2}px ${tiltX * 2}px 30px rgba(0, 0, 0, 0.1),
        0 10px 20px rgba(0, 0, 0, 0.05)
      `
    })

    card.addEventListener("mouseleave", () => {
      card.style.transform = ""
      card.style.boxShadow = ""
    })
  })
}

// Add keyframe animations
const styleSheet = document.createElement("style")
styleSheet.textContent = `
  @keyframes float {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-20px);
    }
  }
  
  @keyframes pulse {
    0% {
      text-shadow: 0 0 10px rgba(67, 97, 238, 0.3),
                  0 0 20px rgba(67, 97, 238, 0.2),
                  0 0 30px rgba(67, 97, 238, 0.1);
    }
    100% {
      text-shadow: 0 0 15px rgba(67, 97, 238, 0.4),
                  0 0 30px rgba(67, 97, 238, 0.3),
                  0 0 40px rgba(67, 97, 238, 0.2);
    }
  }
  
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`
document.head.appendChild(styleSheet)
