'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}

// allow CTA buttons on Home to navigate without being navbar links
const pageTargets = document.querySelectorAll("[data-page-target]");
if (pageTargets.length) {
  pageTargets.forEach(btn => {
    btn.addEventListener("click", function () {
      const target = (this.getAttribute("data-page-target") || "").toLowerCase();
      if (!target) return;

      // toggle page visibility
      for (let i = 0; i < pages.length; i++) {
        if (pages[i].dataset.page === target) {
          pages[i].classList.add("active");
        } else {
          pages[i].classList.remove("active");
        }
      }

      // set corresponding navbar link active
      for (let i = 0; i < navigationLinks.length; i++) {
        const label = navigationLinks[i].textContent.trim().toLowerCase();
        if (label === target) {
          navigationLinks[i].classList.add("active");
        } else {
          navigationLinks[i].classList.remove("active");
        }
      }

      window.scrollTo(0, 0);
    });
  });
}



// GitHub Projects Integration
class GitHubProjects {
  constructor() {
    this.accounts = ['jeff-dark', 'JEFFHONTEZ'];
    this.allRepos = [];
    this.filteredRepos = [];
    this.currentFilter = 'all';
    this.init();
  }

  async init() {
    if (document.querySelector('.projects[data-page="projects"]')) {
      await this.fetchRepositories();
      this.setupFiltering();
    }
  }

  async fetchRepositories() {
    const loadingIndicator = document.getElementById('loading-indicator');
    const featuredSection = document.getElementById('featured-projects');
    const projectsGrid = document.getElementById('projects-grid');

    try {
      // Fetch repositories from both accounts
      const promises = this.accounts.map(account => 
        fetch(`https://api.github.com/users/${account}/repos?sort=updated&per_page=100`)
          .then(response => response.json())
      );

      const results = await Promise.all(promises);
      
      // Combine and process repositories
      this.allRepos = results.flat()
        .filter(repo => !repo.fork) // Exclude forks
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

      this.filteredRepos = [...this.allRepos];

      // Hide loading and show content
      loadingIndicator.style.display = 'none';
      featuredSection.style.display = 'block';

      // Display repositories
      this.displayFeaturedProjects();
      this.displayAllProjects();

    } catch (error) {
      console.error('Error fetching repositories:', error);
      loadingIndicator.innerHTML = `
        <div class="error-message">
          <p>Failed to load repositories. Please try again later.</p>
        </div>
      `;
    }
  }

  displayFeaturedProjects() {
    const featuredGrid = document.getElementById('featured-grid');
    const featuredRepos = this.allRepos.slice(0, 3); // Show top 3 repos

    featuredGrid.innerHTML = featuredRepos.map(repo => `
      <div class="featured-project">
        <div class="featured-project-img">
          <img src="https://opengraph.githubassets.com/${Date.now()}/${repo.full_name}" 
               alt="${repo.name}" 
               onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjQyOTJlIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzU4NjA2OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPiR7cmVwby5uYW1lfTwvdGV4dD48L3N2Zz4='">
        </div>
        <div class="featured-project-content">
          <h4 class="featured-project-title">${repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
          <p class="featured-project-description">${repo.description || 'No description available.'}</p>
          <div class="featured-project-tech">
            ${repo.language ? `<span class="tech-tag">${repo.language}</span>` : ''}
            ${repo.topics.slice(0, 3).map(topic => `<span class="tech-tag">${topic}</span>`).join('')}
          </div>
          <div class="featured-project-links">
            <a href="${repo.html_url}" target="_blank" class="project-link">View Code</a>
            ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="project-link">Live Demo</a>` : ''}
          </div>
        </div>
      </div>
    `).join('');
  }

  displayAllProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    
    projectsGrid.innerHTML = this.filteredRepos.map(repo => `
      <div class="project-card" data-category="${this.getProjectCategory(repo)}">
        <div class="project-card-header">
          <div class="project-icon">
            <ion-icon name="${this.getProjectIcon(repo)}"></ion-icon>
          </div>
          <div>
            <h4 class="project-card-title">${repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
            <p class="project-card-category">${this.getProjectCategory(repo)}</p>
          </div>
        </div>
        <p class="project-card-description">${repo.description || 'No description available.'}</p>
        <div class="project-card-tech">
          ${repo.language ? `<span class="tech-tag">${repo.language}</span>` : ''}
          ${repo.topics.slice(0, 4).map(topic => `<span class="tech-tag">${topic}</span>`).join('')}
        </div>
        <div class="project-card-footer">
          <div class="project-stats">
            <div class="project-stat">
              <ion-icon name="star-outline"></ion-icon>
              <span>${repo.stargazers_count}</span>
            </div>
            <div class="project-stat">
              <ion-icon name="git-branch-outline"></ion-icon>
              <span>${repo.forks_count}</span>
            </div>
          </div>
          <div class="project-actions">
            <a href="${repo.html_url}" target="_blank" class="project-action" title="View Code">
              <ion-icon name="logo-github"></ion-icon>
            </a>
            ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="project-action" title="Live Demo"><ion-icon name="open-outline"></ion-icon></a>` : ''}
          </div>
        </div>
      </div>
    `).join('');
  }

  getProjectCategory(repo) {
    const name = repo.name.toLowerCase();
    const description = (repo.description || '').toLowerCase();
    const topics = repo.topics.join(' ').toLowerCase();
    const language = (repo.language || '').toLowerCase();

    if (language.includes('php') || topics.includes('laravel') || topics.includes('php')) {
      return 'fullstack';
    }
    if (topics.includes('api') || description.includes('api') || name.includes('api')) {
      return 'api';
    }
    if (language.includes('javascript') || language.includes('typescript') || topics.includes('react') || topics.includes('vue') || topics.includes('web')) {
      return 'web';
    }
    if (topics.includes('automation') || topics.includes('script') || topics.includes('tool') || language.includes('python')) {
      return 'tools';
    }
    return 'web';
  }

  getProjectIcon(repo) {
    const category = this.getProjectCategory(repo);
    const iconMap = {
      'web': 'code-outline',
      'api': 'server-outline',
      'fullstack': 'layers-outline',
      'tools': 'build-outline'
    };
    return iconMap[category] || 'code-outline';
  }

  setupFiltering() {
    // Setup filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    const selectItems = document.querySelectorAll('.select-item button');

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        this.applyFilter(filter);
        
        // Update active states
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Setup mobile dropdown
    selectItems.forEach(item => {
      item.addEventListener('click', () => {
        const filter = item.getAttribute('data-filter');
        this.applyFilter(filter);
        
        // Update dropdown text
        const selectValue = document.querySelector('[data-select-value]');
        if (selectValue) {
          selectValue.textContent = item.textContent;
        }
      });
    });
  }

  applyFilter(filter) {
    this.currentFilter = filter;
    
    if (filter === 'all') {
      this.filteredRepos = [...this.allRepos];
    } else {
      this.filteredRepos = this.allRepos.filter(repo => 
        this.getProjectCategory(repo) === filter
      );
    }
    
    this.displayAllProjects();
  }
}

// Initialize GitHub Projects when page loads
document.addEventListener('DOMContentLoaded', () => {
  new GitHubProjects();
});