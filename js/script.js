const API_BASE_URL = 'https://portfolio-2a9m.onrender.com';

const PROJECT_DATA = {
  'docme': {
    badge: 'FastAPI · LangGraph · Supabase · Solo Project',
    year: 'Featured Project',
    title: 'DocMe — AI Document Research Platform',
    summary: 'An AI-powered document research and question-answering platform that helps users retrieve information from uploaded documents through conversational interaction.',
    architecture: `[Client Browser (Vercel CDN)]
              │
      (HTTPS / SSE Streaming)
              ▼
   [FastAPI & Uvicorn (Render)]
              │
    ┌─────────┴─────────┐
    ▼                   ▼
[Document Ingestion]  [LangGraph Workflow]
(PDF, DOCX, TXT)      (State Graph Orchestration)
    │                   │
    ▼                   ▼
[Google Gemini Embed] [Gemini 1.5 Flash LLM]
(text-embedding-004)  (Grounded Answers + Citations)
    │                   │
    └─────────┬─────────┘
              ▼
[PostgreSQL + pgvector (Supabase)]
(Cosine Similarity & HNSW Index)
              ▲
              │ (Durable Cloud Storage)
[Supabase Storage ('documents' bucket)]`,
    decisions: [
      'Engineered an end-to-end document research and intelligence platform enabling conversational Q&A over complex PDF, DOCX, and TXT files.',
      'Implemented semantic chunking with token overlaps and generated 768-dimensional vector embeddings via Google Gemini (text-embedding-004).',
      'Configured PostgreSQL with pgvector for persistent relational data and high-dimensional vector storage with cosine similarity indexing.',
      'Designed multi-step agentic workflows using LangGraph state graphs to retrieve relevant document chunks and synthesize grounded answers with page-level citations.',
      'Implemented real-time Server-Sent Events (SSE) streaming for live, token-by-token answer generation in the conversational chat interface.',
      'Integrated Supabase Storage for persistent cloud object storage paired with local container caching across server deployments.',
      'Enforced strict access control distinguishing private vs. public documents, document ownership, and secure JWT authentication.'
    ],
    tech: ['Python', 'FastAPI', 'LangGraph', 'LangChain', 'PostgreSQL', 'pgvector', 'SQLAlchemy', 'Gemini', 'Supabase', 'Render', 'Vercel'],
    github: 'https://github.com/Vinay-1774/DocMe',
    live: 'https://docme-frontend.vercel.app/'
  },

  'terminal-chat': {
    badge: 'FastAPI · WebSockets · Solo Project',
    year: 'Featured Project',
    title: 'NChat — Private Messaging Application',
    summary: 'A real-time private messaging application featuring WebSocket communication, asynchronous backend processing, and database-backed message handling.',
    architecture: `[Client / WebSocket Handshake] ───> [FastAPI WebSocket Endpoint]
                                              │
                                     [ConnectionManager]
                                ┌─────────────┴─────────────┐
                                ▼                           ▼
                     [User Lobby Registry]       [Isolated Room Registry]
                                │                           │
                                └─────────────┬─────────────┘
                                              ▼
                                 [Deterministic Symmetric Room ID]
                                  (Sorted User Pair Hashing)
                                              │
                                              ▼
                                [asyncio.wait(FIRST_COMPLETED)]
                                (Concurrent Send/Recv Coroutines)
                                              │
                                              ▼
                                [Redis State + async SQLAlchemy + SQLite]`,
    decisions: [
      'Built a real-time private messaging application featuring WebSocket communication, asynchronous backend processing, and database-backed message handling.',
      'Designed a ConnectionManager with isolated user, lobby, and room registries to prevent cross-talk and maintain clean channel separation.',
      'Implemented deterministic symmetric room IDs using sorted user pairs, ensuring a single consistent room for any user pair.',
      'Used asyncio coroutines to concurrently handle message transmission and reception with graceful disconnect and cancel handling.',
      'Added lobby-wide online user status broadcasts, duplicate session detection, and room management commands (/leave, /quit).',
      'Configured Redis and async database connections via pydantic-settings for scalable messaging state.'
    ],
    tech: ['Python', 'FastAPI', 'WebSockets', 'async SQLAlchemy', 'Redis', 'SQLite (aiosqlite)', 'pydantic-settings', 'asyncio'],
    github: 'https://github.com/Vinay-1774/Nexus-Let-s-connect'
  }
};

class SmoothScroller {
  constructor() {
    this.targetY = window.scrollY;
    this.currentY = window.scrollY;
    this.isTicking = false;
    this.ease = 0.088;
    this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!this.reducedMotion && !this.isTouch) {
      this.init();
    }
  }

  init() {
    window.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });

    window.addEventListener('scroll', () => {
      if (!this.isTicking) {
        this.targetY = window.scrollY;
        this.currentY = window.scrollY;
      }
    }, { passive: true });

    window.addEventListener('keydown', (e) => this.onKeyDown(e));
  }

  onWheel(e) {
    if (document.body.style.overflow === 'hidden') return;

    e.preventDefault();
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    let delta = e.deltaY;
    if (e.deltaMode === 1) delta *= 35;
    else if (e.deltaMode === 2) delta *= window.innerHeight;

    this.targetY = Math.max(0, Math.min(maxScroll, this.targetY + delta));
    this.requestTick();
  }

  onKeyDown(e) {
    if (document.body.style.overflow === 'hidden') return;
    const tag = e.target?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;

    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    let delta = 0;
    const pageStep = window.innerHeight * 0.75;

    switch (e.key) {
      case 'ArrowDown': delta = 90; break;
      case 'ArrowUp': delta = -90; break;
      case 'PageDown': delta = pageStep; break;
      case 'PageUp': delta = -pageStep; break;
      case ' ':
        delta = e.shiftKey ? -pageStep : pageStep;
        break;
      case 'Home':
        delta = -this.targetY;
        break;
      case 'End':
        delta = maxScroll - this.targetY;
        break;
      default:
        return;
    }

    e.preventDefault();
    this.targetY = Math.max(0, Math.min(maxScroll, this.targetY + delta));
    this.requestTick();
  }

  requestTick() {
    if (!this.isTicking) {
      this.isTicking = true;
      requestAnimationFrame(() => this.update());
    }
  }

  update() {
    const diff = this.targetY - this.currentY;
    if (Math.abs(diff) > 0.4) {
      this.currentY += diff * this.ease;
      window.scrollTo(0, this.currentY);
      requestAnimationFrame(() => this.update());
    } else {
      this.currentY = this.targetY;
      window.scrollTo(0, this.currentY);
      this.isTicking = false;
    }
  }

  scrollTo(targetY) {
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const clamped = Math.max(0, Math.min(maxScroll, targetY));

    if (this.reducedMotion || this.isTouch) {
      window.scrollTo({ top: clamped, behavior: 'smooth' });
    } else {
      this.targetY = clamped;
      this.requestTick();
    }
  }
}

class ScrollFadeEngine {
  constructor() {
    this.elements = [];
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this.reducedMotion) return;

    this.init();
  }

  init() {
    const selectors = [
      '#hero .hero-container',
      '#about .section-header',
      '#about .about-text',
      '#about .principle-card',
      '#skills .section-header',
      '#skills .skill-category',
      '#projects .section-header',
      '#projects .filter-bar',
      '#projects .project-card',
      '#experience .section-header',
      '#experience .timeline',
      '#experience .timeline-item',
      '#certifications .section-header',
      '#certifications .cert-card',
      '#contact .section-header',
      '#contact .contact-info',
      '#contact .contact-form-card'
    ];

    const seen = new Set();
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (!seen.has(el)) {
          seen.add(el);
          el.classList.add('scroll-fade-item');
          this.elements.push(el);
        }
      });
    });

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.update();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    this.update();
  }

  update() {
    const vh = window.innerHeight;
    const hh = 65; // sticky header threshold
    const enterThreshold = Math.min(220, vh * 0.28);
    const exitThreshold = 180;

    this.elements.forEach(el => {
      const rect = el.getBoundingClientRect();

      // Post-content: appearing from bottom
      let enterProgress = 1;
      if (rect.top > vh - enterThreshold) {
        enterProgress = Math.max(0, (vh - rect.top) / enterThreshold);
      }

      // Pre-content: disappearing past top
      let exitProgress = 1;
      if (rect.bottom < hh + exitThreshold) {
        exitProgress = Math.max(0, (rect.bottom - hh) / exitThreshold);
      }

      const progress = Math.min(enterProgress, exitProgress);
      const opacity = Math.round(progress * 100) / 100;

      let y = 0;
      if (enterProgress < 1) {
        y = Math.round((1 - enterProgress) * 32);
      } else if (exitProgress < 1) {
        y = Math.round(-(1 - exitProgress) * 22);
      }

      if (el._lastOpacity !== opacity || el._lastY !== y) {
        el._lastOpacity = opacity;
        el._lastY = y;
        el.style.setProperty('--sf-opacity', opacity);
        el.style.setProperty('--sf-y', `${y}px`);
        el.style.pointerEvents = opacity < 0.08 ? 'none' : 'auto';
      }
    });
  }

  refresh() {
    this.update();
  }
}

let globalScroller = null;
let globalFadeEngine = null;

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  globalScroller = new SmoothScroller();
  globalFadeEngine = new ScrollFadeEngine();
  initScrollProgress();
  initHeaderAndScrollSpy(globalScroller);
  initSmoothAnchors(globalScroller);
  initMobileNav();
  initProjectFilters();
  initProjectModal();
  initResumeModal();
  initCopyEmail();
  initContactForm();
  setCurrentYear();
});

function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  const saved = localStorage.getItem('vpr-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let current = saved || (prefersDark ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', current);
  toggle?.addEventListener('click', () => {
    current = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', current);
    localStorage.setItem('vpr-theme', current);
  });
}

function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  let ticking = false;
  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });

  updateProgress();
}

function initHeaderAndScrollSpy(scroller) {
  const header = document.getElementById('header');
  const backToTop = document.getElementById('back-to-top');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  let ticking = false;

  function onScroll() {
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    if (header) {
      header.classList.toggle('scrolled', scrollY > 20);
    }

    if (backToTop) {
      backToTop.classList.toggle('visible', scrollY > 400);
    }

    let currentSectionId = '';
    const scrollPos = scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = sec.id;
      }
    });

    if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 60) {
      const lastSection = sections[sections.length - 1];
      if (lastSection) currentSectionId = lastSection.id;
    }

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${currentSectionId}`);
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  backToTop?.addEventListener('click', () => {
    if (scroller) {
      scroller.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  onScroll();
}

function initSmoothAnchors(scroller) {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 72;
        const targetY = targetEl.offsetTop - headerOffset;

        if (scroller) {
          scroller.scrollTo(targetY);
        } else {
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }

        document.getElementById('nav-menu')?.classList.remove('open');
      }
    });
  });
}

function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => menu.classList.toggle('open'));
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => menu.classList.remove('open'));
  });
}

function initProjectFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const show = filter === 'all' || card.getAttribute('data-category') === filter;
        card.style.display = show ? 'flex' : 'none';
        if (show) {
          card.style.setProperty('--sf-opacity', '1');
          card.style.setProperty('--sf-y', '0px');
          card.style.pointerEvents = 'auto';
        }
      });

      if (globalFadeEngine) {
        globalFadeEngine.refresh();
      }
    });
  });
}

function initProjectModal() {
  const backdrop = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close-btn');

  document.querySelectorAll('.project-card').forEach(card => {
    const openBtn = card.querySelector('.open-modal-btn');
    const id = card.getAttribute('data-project');
    openBtn?.addEventListener('click', () => {
      const data = PROJECT_DATA[id];
      if (data) {
        renderProjectModalContent(data);
        openModal(backdrop);
      }
    });
  });

  closeBtn?.addEventListener('click', () => closeModal(backdrop));
  backdrop?.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal(backdrop);
  });
}

function renderProjectModalContent(data) {
  const modalContent = document.getElementById('modal-content');
  const liveButton = data.live
    ? `<a href="${escapeHtml(data.live)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
        Live Demo
      </a>`
    : '';

  const githubButton = data.github
    ? `<a href="${escapeHtml(data.github)}" target="_blank" rel="noopener noreferrer" class="btn ${data.live ? 'btn-secondary' : 'btn-primary'}">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
        </svg>
        View Repository on GitHub
      </a>`
    : '';

  modalContent.innerHTML = `
    <div class="modal-arch-badge">${escapeHtml(data.badge)} &bull; ${escapeHtml(data.year)}</div>
    <h3 class="modal-heading">${escapeHtml(data.title)}</h3>
    <p class="project-summary">${escapeHtml(data.summary)}</p>
    
    <div class="modal-section">
      <h4>System &amp; Data Flow Architecture</h4>
      <div class="arch-box">${escapeHtml(data.architecture)}</div>
    </div>

    <div class="modal-section">
      <h4>Key Features &amp; Implementation Details</h4>
      <ul class="focus-list">
        ${data.decisions.map(item => `<li>${escapeHtml(item)}</li>`).join('')}
      </ul>
    </div>

    <div class="modal-section">
      <h4>Technologies &amp; Libraries</h4>
      <div class="project-tags">
        ${data.tech.map(t => `<span>${escapeHtml(t)}</span>`).join('')}
      </div>
    </div>

    <div class="modal-section" style="margin-top: 2rem; display: flex; gap: 0.85rem; flex-wrap: wrap;">
      ${liveButton}
      ${githubButton}
    </div>
  `;
}

function initResumeModal() {
  const modal = document.getElementById('resume-modal');
  const triggers = [
    document.getElementById('open-resume-btn'),
    document.getElementById('hero-resume-btn')
  ].filter(Boolean);

  triggers.forEach(btn => btn.addEventListener('click', () => openModal(modal)));
  document.getElementById('resume-close-btn')?.addEventListener('click', () => closeModal(modal));
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modal);
  });
  document.getElementById('download-resume-file')?.addEventListener('click', () => window.print());
}

function openModal(el) {
  el?.classList.add('open');
  el?.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal(el) {
  el?.classList.remove('open');
  el?.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-btn');
  const email = 'vinaypratap4017@gmail.com';

  copyBtn?.addEventListener('click', () => {
    navigator.clipboard.writeText(email)
      .then(() => showToast('Copied email to clipboard!'))
      .catch(() => showToast(`Email: ${email}`));
  });
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const origText = btn.innerHTML;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    btn.disabled = true;
    btn.innerHTML = 'Sending email...';

    try {
      const res = await fetch(`${API_BASE_URL}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Thank you, ${name}! Your email has been sent.`);
        form.reset();
      } else {
        throw new Error(data.error || 'Server error sending email');
      }
    } catch (err) {
      console.warn('Resend backend error, using email client fallback:', err);
      showToast('Redirecting to email client...');
      window.location.href = `mailto:vinaypratap4017@gmail.com?subject=${encodeURIComponent('[Portfolio Contact] ' + subject)}&body=${encodeURIComponent(message)}`;
      form.reset();
    } finally {
      btn.disabled = false;
      btn.innerHTML = origText;
    }
  });
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    <span>${escapeHtml(message)}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function setCurrentYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
