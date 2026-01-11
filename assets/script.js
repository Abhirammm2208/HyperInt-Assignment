// Sample review data with local image references
const reviews = [
  {
    id: 1,
    name: "Aarav Patel",
    avatar: "https://i.pravatar.cc/80?img=12",
    rating: 5,
    title: "Perfectly chatpata!",
    text: "Love the tangy kick — pairs great with ragi toast. The spice level is exactly what I've been looking for.",
    media: "https://picsum.photos/400/300?random=1",
    verified: true,
    helpful: 32,
    date: "2026-01-03",
    tags: ["taste", "toast", "breakfast"]
  },
  {
    id: 2,
    name: "Neha Shah",
    avatar: "https://i.pravatar.cc/80?img=5",
    rating: 4,
    title: "Snack game changed",
    text: "Adds a spicy twist to smoothies — surprisingly good! Really adds character to plain yogurt too.",
    media: "https://picsum.photos/400/300?random=2",
    verified: true,
    helpful: 18,
    date: "2026-01-05",
    tags: ["smoothie", "protein"]
  },
  {
    id: 3,
    name: "Rohan Mehta",
    avatar: "https://i.pravatar.cc/80?img=47",
    rating: 3,
    title: "Bit strong for me",
    text: "Flavour is bold, maybe better in small servings. Good quality but the spice is intense.",
    media: "https://picsum.photos/400/300?random=3",
    verified: false,
    helpful: 6,
    date: "2026-01-07",
    tags: ["flavour", "portion"]
  },
  {
    id: 4,
    name: "Simran Kaur",
    avatar: "https://i.pravatar.cc/80?img=33",
    rating: 5,
    title: "Party hit",
    text: "Used in lettuce wraps — friends asked for the brand. Perfect appetizer spread!",
    media: "https://picsum.photos/400/300?random=4",
    verified: true,
    helpful: 11,
    date: "2025-12-29",
    tags: ["party", "recipe"]
  },
  {
    id: 5,
    name: "Kabir Singh",
    avatar: "https://i.pravatar.cc/80?img=21",
    rating: 4,
    title: "Great with chaat",
    text: "Drizzled on bhel — stellar combo. Brings out flavors I didn't know were there.",
    media: "https://picsum.photos/400/300?random=5",
    verified: true,
    helpful: 22,
    date: "2025-12-20",
    tags: ["chaat", "bhel"]
  },
  {
    id: 6,
    name: "Priya Sharma",
    avatar: "https://i.pravatar.cc/80?img=58",
    rating: 5,
    title: "Health meets taste",
    text: "Finally found a peanut butter that doesn't taste like cardboard. Highly recommend!",
    media: "https://picsum.photos/400/300?random=6",
    verified: true,
    helpful: 28,
    date: "2025-12-15",
    tags: ["health", "quality"]
  }
];

// Live counters
let liveStats = {
  currentlyViewing: 42,
  purchasesToday: 18,
  viewsToday: 1247
};

// Tab switching
function setupTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const tabName = btn.getAttribute('data-tab');
      document.querySelectorAll('.view-section').forEach(section => {
        section.classList.remove('active');
      });
      document.getElementById(tabName).classList.add('active');
    });
  });
}

// Calculate stats
function avgRating(list) {
  return list.reduce((acc, r) => acc + r.rating, 0) / (list.length || 1);
}

function computeBreakdown(list) {
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  list.forEach(r => counts[r.rating]++);
  const total = list.length || 1;
  return Object.entries(counts).map(([star, count]) => ({
    star: parseInt(star, 10),
    pct: Math.round(count / total * 100)
  }));
}

function computeMentions(list) {
  const map = new Map();
  list.forEach(r => r.tags.forEach(t => map.set(t, (map.get(t) || 0) + 1)));
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
}

// Render star rating
function renderStars(rating) {
  return Array.from({ length: 5 }, (_, i) => 
    i < rating ? '<span class="star">★</span>' : '<span class="star">☆</span>'
  ).join('');
}

// Filter reviews
function applyFilters(list) {
  const ratingFilter = document.getElementById('ratingFilter').value;
  const sortBy = document.getElementById('sortBy').value;
  
  let result = list.slice();
  
  if (ratingFilter !== 'all') {
    const r = parseInt(ratingFilter, 10);
    result = result.filter(item => item.rating >= r);
  }
  
  switch (sortBy) {
    case 'recent':
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case 'helpful':
      result.sort((a, b) => b.helpful - a.helpful);
      break;
    case 'high':
      result.sort((a, b) => b.rating - a.rating);
      break;
    case 'low':
      result.sort((a, b) => a.rating - b.rating);
      break;
  }
  
  return result;
}

// Render grid
function renderGrid(list) {
  const container = document.getElementById('gridContainer');
  container.innerHTML = '';
  
  list.forEach(r => {
    const card = document.createElement('article');
    card.className = 'review-card';
    card.innerHTML = `
      <img src="${r.media}" alt="User review" class="card-media" onerror="this.src='https://via.placeholder.com/300x200?text=Review'">
      <div class="card-content">
        <div class="card-header">
          <img src="${r.avatar}" alt="${r.name}" class="reviewer-avatar" onerror="this.src='https://via.placeholder.com/40'">
          <div>
            <div class="reviewer-name">${r.name}</div>
            <div class="reviewer-meta">${new Date(r.date).toLocaleDateString()}</div>
          </div>
        </div>
        <div class="card-badges">
          ${r.verified ? '<span class="badge badge-verified">✓ Verified</span>' : ''}
          ${r.helpful > 20 ? '<span class="badge badge-top">🔥 Top</span>' : ''}
        </div>
        <div class="card-stars">${renderStars(r.rating)}</div>
        <h3 class="card-title">${r.title}</h3>
        <p class="card-text">${r.text}</p>
        <div class="card-footer">
          <span>${r.helpful} found helpful</span>
          <button class="helpful-btn" data-id="${r.id}">👍 Helpful</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// Render timeline
function renderTimeline(list) {
  const container = document.getElementById('timelineContainer');
  container.innerHTML = '';
  
  list.forEach(r => {
    const item = document.createElement('article');
    item.className = 'timeline-item';
    item.innerHTML = `
      <img src="${r.avatar}" alt="${r.name}" class="timeline-avatar" onerror="this.src='https://via.placeholder.com/60'">
      <div class="timeline-body">
        <div class="timeline-header">
          <div>
            <div class="timeline-name">${r.name}${r.verified ? ' ✓' : ''}</div>
            <div class="timeline-meta">${new Date(r.date).toLocaleDateString()} • India</div>
          </div>
        </div>
        <div class="card-stars">${renderStars(r.rating)}</div>
        <h4 class="timeline-title">${r.title}</h4>
        <p class="timeline-text">${r.text}</p>
        <div class="timeline-meta">
          <span>📦 Size: Standard</span>
          <span>🔁 Repeat</span>
          <span>${r.helpful} helpful</span>
        </div>
      </div>
    `;
    container.appendChild(item);
  });
  
  // Sidebar widgets
  const mentions = computeMentions(list);
  const mentionsUl = document.getElementById('topMentions');
  mentionsUl.innerHTML = mentions.map(([tag, count]) => 
    `<li>${tag} <span>${count}</span></li>`
  ).join('');
  
  const breakdown = computeBreakdown(list);
  const breakdownEl = document.getElementById('ratingBreakdown');
  breakdownEl.innerHTML = breakdown.map(b => `
    <div class="breakdown-item">
      <div class="breakdown-header">
        <span>${b.star}★</span>
        <span>${b.pct}%</span>
      </div>
      <div class="breakdown-bar">
        <div class="breakdown-fill" style="width:${b.pct}%"></div>
      </div>
    </div>
  `).join('');
}

// Render carousel
function renderCarousel(list) {
  const track = document.getElementById('carouselTrack');
  track.innerHTML = '';
  
  list.forEach(r => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.innerHTML = `
      <div class="slide-image">
        <img src="${r.media}" alt="User review" onerror="this.src='https://via.placeholder.com/400x300?text=Review'">
      </div>
      <div class="slide-content">
        <div class="reviewer-name">${r.name}</div>
        <div class="card-stars">${renderStars(r.rating)}</div>
        <h4 class="timeline-title">${r.title}</h4>
        <p class="timeline-text">${r.text}</p>
        <div class="card-badges">
          ${r.verified ? '<span class="badge badge-verified">✓ Verified</span>' : ''}
        </div>
      </div>
    `;
    track.appendChild(slide);
  });
  
  // Carousel navigation
  let currentIndex = 0;
  const slides = track.children;
  
  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
  }
  
  document.querySelector('.car-nav.prev').addEventListener('click', () => {
    currentIndex = Math.max(0, currentIndex - 1);
    updateCarousel();
  });
  
  document.querySelector('.car-nav.next').addEventListener('click', () => {
    currentIndex = Math.min(slides.length - 1, currentIndex + 1);
    updateCarousel();
  });
}

// Update counters
function updateCounters() {
  liveStats.currentlyViewing = Math.floor(Math.random() * 50) + 20;
  liveStats.purchasesToday = Math.floor(Math.random() * 40) + 10;
  liveStats.viewsToday = Math.floor(Math.random() * 500) + 800;
  
  // Update live activity
  const activity = document.getElementById('liveActivity');
  if (activity) {
    activity.innerHTML = `
      <div class="activity-item">
        <span>👁️ ${liveStats.currentlyViewing} people viewing</span>
      </div>
      <div class="activity-item">
        <span>🛒 ${liveStats.purchasesToday} bought today</span>
      </div>
      <div class="activity-item">
        <span>⭐ New 5★ review</span>
      </div>
    `;
  }
}

// Setup helpful buttons
function setupHelpful() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.helpful-btn');
    if (!btn) return;
    
    const id = parseInt(btn.getAttribute('data-id'), 10);
    const review = reviews.find(r => r.id === id);
    if (!review) return;
    
    review.helpful += 1;
    btn.textContent = `👍 ${review.helpful}`;
  });
}

// Setup filters
function setupFilters() {
  ['ratingFilter', 'sortBy'].forEach(id => {
    document.getElementById(id).addEventListener('change', () => refresh());
  });
}

// Theme Toggle
function setupThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const currentTheme = localStorage.getItem('theme') || 'light';
  
  // Apply saved theme
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

// Refresh all views
function refresh() {
  const list = applyFilters(reviews);
  renderGrid(list);
  renderTimeline(list);
  renderCarousel(list);
  
  // Update stats
  document.getElementById('avgRating').textContent = avgRating(list).toFixed(1);
  document.getElementById('totalReviews').textContent = list.length.toString();
  document.getElementById('verifiedCount').textContent = `${Math.round(list.filter(r => r.verified).length / list.length * 100)}%`;
  document.getElementById('carAvg').textContent = `${avgRating(list).toFixed(1)}★`;
  document.getElementById('carTotal').textContent = `${list.length} reviews`;
}

// FAQ Accordion
function setupFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });
      
      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  setupHelpful();
  setupFilters();
  setupThemeToggle();
  setupFAQ();
  updateCounters();
  refresh();
  
  // Update counters every 10 seconds to prevent performance issues
  setInterval(updateCounters, 10000);
});
