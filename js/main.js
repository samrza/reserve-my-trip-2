const form = document.querySelector("#contact form");
const nameInput = form.querySelector('input[type="text"]');
const emailInput = form.querySelector('input[type="email"]');
const messageInput = form.querySelector("textarea");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const message = messageInput.value.trim();

  // ✅ Clean & Friendly WhatsApp Message Format
  const whatsappText = `Hi, I’m ${name}.\nEmail: ${email}\n\n${message}`;
  const whatsappURL = `https://wa.me/917790909989?text=${encodeURIComponent(
    whatsappText
  )}`;

  // ✅ Open WhatsApp
  window.open(whatsappURL, "_blank");

  // ✅ Send Email using FormSubmit (no backend required)
  fetch("https://formsubmit.co/ajax/sameer4uofficial@gmail.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      message,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert("✅ Inquiry sent successfully!");
      form.reset();
    })
    .catch((error) => {
      alert("❌ Something went wrong. Try again.");
      console.error(error);
    });
});

function toggleDropdown(id) {
  const dropdown = document.getElementById(`dropdown-${id}`);
  const allDropdowns = document.querySelectorAll("[id^='dropdown-']");
  allDropdowns.forEach((d) => {
    if (d !== dropdown) d.classList.add("hidden");
  });
  dropdown.classList.toggle("hidden");
}

document.addEventListener("click", function (e) {
  const nav = document.querySelector("nav");
  const dropdowns = document.querySelectorAll("[id^='dropdown-']");

  if (!nav.contains(e.target)) {
    dropdowns.forEach((d) => d.classList.add("hidden"));
  }
});

// Search functionality for filter section
document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.querySelector("#search-btn");
  
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      // Get all filter values
      const source = document.querySelector("#source")?.value || "";
      const destination = document.querySelector("#destination")?.value || "";
      const date = document.querySelector("#date")?.value || "";
      const guests = document.querySelector("#guests-input")?.value || "";
      const budget = document.querySelector("#budget-input")?.value || "";
      const duration = document.querySelector("#duration-select")?.value || "";
      const hotel = document.querySelector("#hotel")?.value || "";
      const flight = document.querySelector("#flight")?.value || "";

      // Build URL parameters
      const params = new URLSearchParams();
      
      if (source) params.append('source', source);
      if (destination) params.append('destination', destination);
      if (date) params.append('date', date);
      if (guests) params.append('guests', guests);
      if (budget) params.append('budget', budget);
      if (duration) params.append('duration', duration);
      if (hotel) params.append('hotel', hotel);
      if (flight) params.append('flight', flight);

      console.log('Search parameters:', {
        source, destination, date, guests, budget, duration, hotel, flight
      });

      // Redirect to packages page with search parameters
      const packagesURL = `packages.html?${params.toString()}`;
      console.log('Redirecting to:', packagesURL);
      window.location.href = packagesURL;
    });
  }
});

// Quick search function
function quickSearch() {
  const searchInput = document.getElementById('quick-search-input');
  const destination = searchInput.value.trim();
  
  if (destination) {
    // Redirect to packages page with destination search
    const packagesURL = `packages.html?destination=${encodeURIComponent(destination)}`;
    console.log('Quick search for:', destination);
    window.location.href = packagesURL;
  } else {
    // If no destination entered, show all packages
    window.location.href = 'packages.html';
  }
}

// Quick search for specific destination
function quickSearchDestination(destination) {
  const packagesURL = `packages.html?destination=${encodeURIComponent(destination)}`;
  console.log('Quick search for destination:', destination);
  window.location.href = packagesURL;
}

// Allow Enter key to trigger quick search
document.addEventListener('DOMContentLoaded', () => {
  const quickSearchInput = document.getElementById('quick-search-input');
  if (quickSearchInput) {
    quickSearchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        quickSearch();
      }
    });
  }
});
