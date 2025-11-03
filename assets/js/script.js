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
  initHomeAnimations();
  initThemeToggle();
  initTimeAndWeather();
  initGitHubStats();
  initContactForms();
});

// Home page animations and interactions
function initHomeAnimations() {
  // Only run if home page exists
  if (!document.querySelector('.home[data-page="home"]')) return;
  
  // Typing animation
  const typingElement = document.getElementById('typing-text');
  if (typingElement) {
    const texts = [
      'Software Engineer',
      'Full-Stack Developer', 
      'Problem Solver',
      'Tech Enthusiast',
      'API Developer',
      'Code Craftsman'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function typeText() {
      const currentText = texts[textIndex];
      
      if (isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        typingElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
      }
      
      if (!isDeleting && charIndex === currentText.length) {
        setTimeout(() => { isDeleting = true; }, 2000);
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
      }
      
      setTimeout(typeText, typingSpeed);
    }
    
    typeText();
  }
  
  // Counter animation
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (counters.length > 0) {
    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
  }
  
  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        element.textContent = target + (target > 10 ? '+' : '');
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 16);
  }

  // Intersection Observer for animations
  const animateElements = document.querySelectorAll('.service-card, .stat-card, .process-step');
  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
      }
    });
  }, { threshold: 0.1 });

  animateElements.forEach(el => animationObserver.observe(el));
}

// Theme Toggle Functionality
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  
  // Check for saved theme preference or default to dark mode
  const currentTheme = localStorage.getItem('theme') || 'dark';
  body.setAttribute('data-theme', currentTheme);
  
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = body.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      // Add click animation
      themeToggle.style.transform = 'scale(0.9)';
      setTimeout(() => {
        themeToggle.style.transform = 'scale(1)';
      }, 150);
    });
  }
}

// Time and Weather Updates
function initTimeAndWeather() {
  updateTime();
  updateWeather();
  
  // Update time every minute
  setInterval(updateTime, 60000);
  
  // Update weather every 30 minutes
  setInterval(updateWeather, 1800000);
}

function updateTime() {
  const timeElements = document.querySelectorAll('#current-time, #local-time');
  const now = new Date();
  const options = {
    timeZone: 'Africa/Nairobi',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  
  const timeString = now.toLocaleTimeString('en-US', options);
  timeElements.forEach(el => {
    if (el) el.textContent = timeString;
  });
}

function updateWeather() {
  const weatherElement = document.getElementById('weather-info');
  if (!weatherElement) return;
  
  // Simple weather simulation (in real app, you'd use a weather API)
  const conditions = ['⛅ Partly Cloudy', '☀️ Sunny', '🌧️ Light Rain', '⛈️ Thunderstorm', '🌤️ Mostly Sunny'];
  const temps = ['22°C', '25°C', '19°C', '21°C', '27°C'];
  
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  const randomTemp = temps[Math.floor(Math.random() * temps.length)];
  
  weatherElement.textContent = `${randomCondition} ${randomTemp}`;
}

// GitHub Stats Integration
async function initGitHubStats() {
  try {
    const accounts = ['jeff-dark', 'JEFFHONTEZ'];
    let totalRepos = 0;
    let totalFollowers = 0;
    let totalStars = 0;
    let recentActivity = [];
    
    // Fetch data from both accounts
    for (const account of accounts) {
      try {
        // Get user data
        const userResponse = await fetch(`https://api.github.com/users/${account}`);
        const userData = await userResponse.json();
        
        if (userData && !userData.message) {
          totalRepos += userData.public_repos || 0;
          totalFollowers += userData.followers || 0;
        }
        
        // Get repositories
        const reposResponse = await fetch(`https://api.github.com/users/${account}/repos?sort=updated&per_page=10`);
        const reposData = await reposResponse.json();
        
        if (Array.isArray(reposData)) {
          // Calculate total stars
          reposData.forEach(repo => {
            totalStars += repo.stargazers_count || 0;
          });
        }
        
        // Get recent events
        const eventsResponse = await fetch(`https://api.github.com/users/${account}/events/public?per_page=5`);
        const eventsData = await eventsResponse.json();
        
        if (Array.isArray(eventsData)) {
          recentActivity = recentActivity.concat(eventsData.slice(0, 3));
        }
        
      } catch (error) {
        console.warn(`Failed to fetch data for ${account}:`, error);
      }
    }
    
    // Update stats in UI
    updateStatElement('repos', totalRepos);
    updateStatElement('followers', totalFollowers);
    updateStatElement('stars', totalStars);
    updateStatElement('contributions', Math.floor(Math.random() * 500) + 200); // Simulated
    
    // Update recent activity
    updateGitHubActivity(recentActivity);
    
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    // Fallback to sample data
    updateStatElement('repos', 45);
    updateStatElement('followers', 28);
    updateStatElement('stars', 156);
    updateStatElement('contributions', 342);
  }
}

function updateStatElement(stat, value) {
  const element = document.querySelector(`[data-stat="${stat}"]`);
  if (element) {
    element.setAttribute('data-count', value);
    
    // Trigger counter animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    });
    
    observer.observe(element);
  }
}

function updateGitHubActivity(activities) {
  const activityFeed = document.getElementById('github-activity');
  if (!activityFeed) return;
  
  if (activities.length === 0) {
    activityFeed.innerHTML = `
      <div class="activity-item">
        <div class="activity-icon">
          <ion-icon name="information-outline"></ion-icon>
        </div>
        <div class="activity-content">
          <div class="activity-text">No recent public activity</div>
          <div class="activity-time">Check GitHub profiles for updates</div>
        </div>
      </div>
    `;
    return;
  }
  
  const activityHTML = activities.slice(0, 5).map(activity => {
    const icon = getActivityIcon(activity.type);
    const text = getActivityText(activity);
    const time = getRelativeTime(activity.created_at);
    
    return `
      <div class="activity-item">
        <div class="activity-icon">
          <ion-icon name="${icon}"></ion-icon>
        </div>
        <div class="activity-content">
          <div class="activity-text">${text}</div>
          <div class="activity-time">${time}</div>
        </div>
      </div>
    `;
  }).join('');
  
  activityFeed.innerHTML = activityHTML;
}

function getActivityIcon(type) {
  const iconMap = {
    'PushEvent': 'git-commit-outline',
    'CreateEvent': 'add-outline',
    'WatchEvent': 'star-outline',
    'ForkEvent': 'git-branch-outline',
    'IssuesEvent': 'bug-outline',
    'PullRequestEvent': 'git-pull-request-outline'
  };
  return iconMap[type] || 'code-outline';
}

function getActivityText(activity) {
  const repo = activity.repo.name.split('/')[1];
  switch (activity.type) {
    case 'PushEvent':
      const commits = activity.payload.commits ? activity.payload.commits.length : 1;
      return `Pushed ${commits} commit${commits > 1 ? 's' : ''} to ${repo}`;
    case 'CreateEvent':
      return `Created ${activity.payload.ref_type} in ${repo}`;
    case 'WatchEvent':
      return `Starred ${repo}`;
    case 'ForkEvent':
      return `Forked ${repo}`;
    case 'IssuesEvent':
      return `${activity.payload.action} an issue in ${repo}`;
    case 'PullRequestEvent':
      return `${activity.payload.action} a pull request in ${repo}`;
    default:
      return `Activity in ${repo}`;
  }
}

function getRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

// Contact Forms Functionality
function initContactForms() {
  // Mini contact form
  const miniForm = document.getElementById('mini-contact-form');
  if (miniForm) {
    miniForm.addEventListener('submit', handleFormSubmit);
  }
  
  // Main contact form
  const mainForm = document.getElementById('main-contact-form');
  if (mainForm) {
    mainForm.addEventListener('submit', handleFormSubmit);
  }
  
  // Newsletter form
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', handleNewsletterSubmit);
  }
  
  // Download resume
  const downloadBtn = document.getElementById('download-resume');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', handleResumeDownload);
  }
}

async function handleFormSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  const submitBtn = form.querySelector('button[type="submit"]');
  const isMainForm = form.id === 'main-contact-form';
  
  // Store original button content
  const originalContent = submitBtn.innerHTML;
  
  // Disable button and show loading
  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <div class="activity-spinner" style="width: 16px; height: 16px; border: 2px solid ${isMainForm ? 'var(--smoky-black)' : 'white'}; border-top: 2px solid ${isMainForm ? 'var(--orange-yellow-crayola)' : 'var(--orange-yellow-crayola)'}; border-radius: 50%; animation: spin 1s linear infinite;"></div>
    <span>Sending...</span>
  `;
  
  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      // Success state
      submitBtn.className = submitBtn.className.replace(/\b(success|error)\b/g, '') + ' success';
      submitBtn.innerHTML = `
        <ion-icon name="checkmark-outline"></ion-icon>
        <span>Message Sent!</span>
      `;
      
      // Reset form
      form.reset();
      
      // Reset button after 4 seconds
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.className = submitBtn.className.replace(/\b(success|error)\b/g, '');
        submitBtn.innerHTML = originalContent;
      }, 4000);
      
    } else {
      throw new Error('Form submission failed');
    }
    
  } catch (error) {
    // Error state
    submitBtn.className = submitBtn.className.replace(/\b(success|error)\b/g, '') + ' error';
    submitBtn.innerHTML = `
      <ion-icon name="alert-circle-outline"></ion-icon>
      <span>An Error Occurred</span>
    `;
    
    // Reset button after 4 seconds
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.className = submitBtn.className.replace(/\b(success|error)\b/g, '');
      submitBtn.innerHTML = originalContent;
    }, 4000);
  }
}

function handleNewsletterSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const email = form.querySelector('.newsletter-input').value;
  const submitBtn = form.querySelector('.newsletter-btn');
  
  // Simple email validation
  if (!email || !email.includes('@')) {
    return;
  }
  
  // Show success feedback
  submitBtn.innerHTML = '<ion-icon name="checkmark-outline"></ion-icon>';
  submitBtn.style.background = '#27ca3f';
  
  // Reset after 2 seconds
  setTimeout(() => {
    form.reset();
    submitBtn.innerHTML = '<ion-icon name="arrow-forward-outline"></ion-icon>';
    submitBtn.style.background = '';
  }, 2000);
}

function handleResumeDownload(e) {
  e.preventDefault();
  const btn = e.target.closest('.btn-outline');
  
  // Simulate download (replace with actual resume file)
  btn.innerHTML = `
    <ion-icon name="checkmark-outline"></ion-icon>
    <span>Downloaded!</span>
  `;
  
  // Reset after 2 seconds
  setTimeout(() => {
    btn.innerHTML = `
      <ion-icon name="download-outline"></ion-icon>
      <span>Download Resume</span>
    `;
  }, 2000);
  
  // Here you would trigger actual file download
  // window.open('/path/to/resume.pdf', '_blank');
}

// Helper function for counter animation (reused)
function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-count'));
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      element.textContent = target + (target > 10 ? '+' : '');
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}