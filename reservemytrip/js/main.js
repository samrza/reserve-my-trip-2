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

  const searchBar = document.getElementById("search-bar");
  const searchIcon = document.querySelector("button[onclick='toggleSearch()']");
  if (!searchBar.contains(e.target) && !searchIcon.contains(e.target)) {
    searchBar.classList.add("hidden");
  }
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    document.getElementById("search-bar").classList.add("hidden");
  }
});

function toggleSearch() {
  const popup = document.getElementById("search-popup");
  const input = document.getElementById("search-input");
  popup.classList.toggle("hidden");
  if (!popup.classList.contains("hidden")) {
    input.focus();
  }
}

// Close popup if click outside or press Esc
document.addEventListener("click", function (e) {
  const container = document.getElementById("search-container");
  const popup = document.getElementById("search-popup");

  if (!container.contains(e.target)) {
    popup.classList.add("hidden");
  }
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    document.getElementById("search-popup").classList.add("hidden");
  }
});
