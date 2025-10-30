// ------------------------------
// main.js
// ------------------------------
const GITHUB_USER = "nisaiqbal000";
const MAX_REPOS = 9;
const projectsGrid = document.getElementById("projects-grid");
const menuToggle = document.getElementById("menuToggle");
const menuDrawer = document.getElementById("menuDrawer");

// Mobile menu toggle
if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    menuDrawer.classList.toggle("hidden");
  });
}

// Fetch public repos from GitHub and render cards
async function loadGitHubRepos() {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=30`);
    if (!res.ok) throw new Error("GitHub API rate or network issue");
    const repos = await res.json();
    // filter: exclude forks and pick top updated repos
    const filtered = repos.filter(r => !r.fork).slice(0, MAX_REPOS);
    // clear existing fallback cards
    projectsGrid.innerHTML = "";

    if (filtered.length === 0) {
      projectsGrid.innerHTML = `<div class="card">No repos found.</div>`;
      return;
    }

    filtered.forEach(repo => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <h3 class="text-lg font-semibold" style="color:var(--teal)"><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a></h3>
        <p class="text-gray-300 text-sm mt-2">${repo.description ? repo.description : "No description available."}</p>
        <div class="mt-3 flex gap-2 flex-wrap">
          <span class="chip">${repo.language ? repo.language : "Repo"}</span>
          <a class="ml-auto text-xs text-gray-400" href="${repo.html_url}" target="_blank">View on GitHub ↗</a>
        </div>
      `;
      projectsGrid.appendChild(div);
    });
  } catch (err) {
    console.warn("Could not fetch GitHub repos:", err);
    // leave fallback content if present
  }
}

// Contact form (simple client-side UX)
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    formStatus.textContent = "Sending...";
    const formData = new FormData(contactForm);

    // Example: client-side send via fetch to your serverless endpoint
    try {
      const res = await fetch(contactForm.action || "/api/send-email", {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        formStatus.textContent = "Message sent — thank you!";
        contactForm.reset();
      } else {
        formStatus.textContent = "Unable to send message right now.";
      }
    } catch (err) {
      formStatus.textContent = "Network error. Try again later.";
    }
    setTimeout(()=> formStatus.textContent = "", 4000);
  });
}

// Smooth scroll offset for fixed header links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const headerOffset = document.querySelector('header').offsetHeight + 12;
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
  });
});

// Initialize
loadGitHubRepos();
