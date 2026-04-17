/* =========================================================
   RESQNET — APP JAVASCRIPT
   Offline Emergency Communication System
   ========================================================= */

/* ── App Modal Open/Close ── */
function openApp() {
  const modal = document.getElementById('app-modal');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  switchTab('home');
}

function closeApp() {
  const modal = document.getElementById('app-modal');
  modal.classList.remove('open');
  document.body.style.overflow = '';
  removeModal('sos-modal');
  removeModal('detail-modal');
}

/* ── Tab Navigation ── */
function switchTab(tab) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const screen = document.getElementById('screen-' + tab);
  const navBtn = document.getElementById('nav-' + tab);
  if (screen) screen.classList.add('active');
  if (navBtn) navBtn.classList.add('active');
  removeModal('detail-modal');
  removeModal('net-modal');
}

/* ── Helper: remove modal by ID ── */
function removeModal(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

/* ── Volunteer Toggle ── */
let volActive = false;
function toggleVolunteer() {
  volActive = !volActive;
  const toggle = document.getElementById('vol-toggle');
  const statusText = document.getElementById('vol-status-text');
  toggle.classList.toggle('on', volActive);
  if (statusText) statusText.textContent = volActive ? 'Currently active' : 'Currently inactive';
}

/* ── SOS Button ── */
function triggerSOS() {
  const btn = document.getElementById('sos-btn');
  if (!btn) return;
  btn.style.transform = 'scale(0.93)';
  btn.style.boxShadow = '0 0 80px #FF0000CC, 0 0 140px #FF000066';
  setTimeout(() => {
    btn.style.transform = '';
    btn.style.boxShadow = '';
    showSOSConfirm();
  }, 200);
}

function showSOSConfirm() {
  const phone = document.getElementById('phone');
  removeModal('sos-modal');
  const overlay = createOverlay('sos-modal');
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-handle"></div>
      <div style="text-align:center;margin-bottom:14px">
        <div style="width:56px;height:56px;background:#FF3B3B22;border:2px solid #FF3B3B55;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 10px">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="#FF3B3B" stroke-width="2" stroke-linejoin="round"/>
            <line x1="12" y1="9" x2="12" y2="13" stroke="#FF3B3B" stroke-width="2" stroke-linecap="round"/>
            <line x1="12" y1="17" x2="12.01" y2="17" stroke="#FF3B3B" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
        </div>
        <div style="font-family:'Rajdhani',sans-serif;font-size:20px;font-weight:700;color:#FF3B3B">SOS Alert Sent!</div>
        <div style="font-size:12px;color:#8A9BBF;margin-top:6px;line-height:1.6">Broadcasting via Bluetooth & WiFi mesh.<br>Nearby volunteers have been notified.</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:14px">
        <div style="background:#1A2235;border-radius:10px;padding:10px;text-align:center;border:1px solid #2A3550">
          <div style="font-size:18px;font-weight:600;color:#00E5FF" id="sos-devices">0</div>
          <div style="font-size:10px;color:#8A9BBF;margin-top:2px">Devices reached</div>
        </div>
        <div style="background:#1A2235;border-radius:10px;padding:10px;text-align:center;border:1px solid #2A3550">
          <div style="font-size:18px;font-weight:600;color:#00C98D" id="sos-volunteers">0</div>
          <div style="font-size:10px;color:#8A9BBF;margin-top:2px">Volunteers alerted</div>
        </div>
        <div style="background:#1A2235;border-radius:10px;padding:10px;text-align:center;border:1px solid #2A3550">
          <div style="font-size:18px;font-weight:600;color:#7C5CFC">~4m</div>
          <div style="font-size:10px;color:#8A9BBF;margin-top:2px">Est. response</div>
        </div>
      </div>
      <button class="close-btn" onclick="removeModal('sos-modal')">Dismiss</button>
    </div>`;
  phone.appendChild(overlay);
  // Animate counters
  animateCount('sos-devices', 12, 1200);
  animateCount('sos-volunteers', 3, 900);
}

/* ── Emergency Detail Modal ── */
function showDetail(name, id, dist, time, hops, priority, color, desc) {
  const phone = document.getElementById('phone');
  removeModal('detail-modal');
  const badgeClass = color === 'red' ? 'badge-red' : 'badge-orange';
  const overlay = createOverlay('detail-modal');
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-handle"></div>
      <div class="modal-title">${name}</div>
      <div class="modal-id">ID: #${id} · <span class="${badgeClass}">${priority}</span></div>
      <div class="modal-row">
        <div class="modal-info"><div class="modal-info-val">${dist}</div><div class="modal-info-lab">Distance</div></div>
        <div class="modal-info"><div class="modal-info-val">${time}</div><div class="modal-info-lab">Reported</div></div>
        <div class="modal-info"><div class="modal-info-val">${hops}</div><div class="modal-info-lab">Hops</div></div>
      </div>
      <div class="modal-desc">${desc}</div>
      <button class="accept-btn" onclick="acceptEmergency('${name}')">Accept & Respond</button>
      <button class="close-btn" onclick="removeModal('detail-modal')">Back to List</button>
    </div>`;
  phone.appendChild(overlay);
}

function acceptEmergency(name) {
  const phone = document.getElementById('phone');
  removeModal('detail-modal');
  const overlay = createOverlay('detail-modal');
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-handle"></div>
      <div style="text-align:center;padding:10px 0">
        <div style="width:52px;height:52px;background:#00C98D22;border:2px solid #00C98D55;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 12px">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <polyline points="20 6 9 17 4 12" stroke="#00C98D" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div style="font-family:'Rajdhani',sans-serif;font-size:18px;font-weight:700;color:#00C98D">Response Accepted!</div>
        <div style="font-size:12px;color:#8A9BBF;margin-top:8px;line-height:1.6">
          You are now responding to <strong style="color:#E8EDF5">${name}</strong>.<br>
          Victim has been notified. Navigate to location.
        </div>
      </div>
      <button class="close-btn" style="margin-top:14px" onclick="removeModal('detail-modal')">Done</button>
    </div>`;
  phone.appendChild(overlay);
}

/* ── Helper: Create Modal Overlay ── */
function createOverlay(id) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = id;
  return overlay;
}

/* ── Counter Animation ── */
function animateCount(elId, target, duration) {
  const el = document.getElementById(elId);
  if (!el) return;
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    el.textContent = Math.round(progress * target);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ── Hero Stat Counter Animation ── */
function animateHeroStats() {
  const nums = document.querySelectorAll('.stat-num[data-target]');
  nums.forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    let start = null;
    const duration = 1800;
    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(ease * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

/* ── Smooth scroll for nav links ── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ── Intersection Observer for stat animation ── */
const heroSection = document.querySelector('.hero');
if (heroSection) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateHeroStats();
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });
  observer.observe(heroSection);
}

/* ── Keyboard: Escape closes modal ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (document.getElementById('app-modal')?.classList.contains('open')) {
      closeApp();
    }
  }
});

/* ── Feature cards entrance animation ── */
const featureCards = document.querySelectorAll('.feature-card');
const cardObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 80);
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

featureCards.forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(24px)';
  card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  cardObserver.observe(card);
});

/* ── Flow steps entrance animation ── */
const flowSteps = document.querySelectorAll('.flow-step');
const flowObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 120);
      flowObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

flowSteps.forEach(step => {
  step.style.opacity = '0';
  step.style.transform = 'translateY(20px)';
  step.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  flowObserver.observe(step);
});

/* ── Tech pill entrance animation ── */
const techPills = document.querySelectorAll('.tech-pill');
const techObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const pills = entry.target.querySelectorAll('.tech-pill');
      pills.forEach((pill, i) => {
        setTimeout(() => {
          pill.style.opacity = '1';
          pill.style.transform = 'scale(1)';
        }, i * 60);
      });
      techObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

const techGrid = document.querySelector('.tech-grid');
if (techGrid) {
  techPills.forEach(pill => {
    pill.style.opacity = '0';
    pill.style.transform = 'scale(0.92)';
    pill.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
  });
  techObserver.observe(techGrid);
}
