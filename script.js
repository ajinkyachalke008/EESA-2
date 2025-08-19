/* Theme toggle and navbar */
const root = document.body;
const navToggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('primary-nav');
const themeToggle = document.getElementById('themeToggle');
const toastEl = document.getElementById('toast');

const showToast = (message) => {
  toastEl.textContent = message;
  toastEl.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toastEl.classList.remove('show'), 2400);
};

navToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

themeToggle?.addEventListener('click', () => {
  const isElectric = root.classList.toggle('theme-electric');
  root.classList.toggle('theme-warm', !isElectric);
  themeToggle.setAttribute('aria-pressed', String(isElectric));
  localStorage.setItem('eesa-theme', isElectric ? 'electric' : 'warm');
});

(() => {
  const saved = localStorage.getItem('eesa-theme');
  if (saved === 'electric') {
    root.classList.add('theme-electric');
    root.classList.remove('theme-warm');
    themeToggle?.setAttribute('aria-pressed', 'true');
  }
})();

document.getElementById('year').textContent = new Date().getFullYear();

/* Students Uploads */
const studentsKey = 'eesa-students-v1';
const studentsGrid = document.getElementById('studentsGrid');
const clearStudentsBtn = document.getElementById('clearStudents');

function getStudents() {
  try { return JSON.parse(localStorage.getItem(studentsKey)) || []; } catch { return []; }
}
function setStudents(list) { localStorage.setItem(studentsKey, JSON.stringify(list)); }

function renderStudents() {
  const students = getStudents();
  studentsGrid.innerHTML = '';
  if (!students.length) { studentsGrid.innerHTML = '<p class="card surface">No uploads yet.</p>'; return; }
  for (const s of students) {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-body">
        <h3>${s.name} <span class="chip" style="margin-left:6px">${s.branch}</span></h3>
        <p>${s.skills ? s.skills.split(',').map(t => `<span class='chip'>${t.trim()}</span>`).join(' ') : ''}</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:6px">
          ${s.github ? `<a class="btn btn-outline" href="${s.github}" target="_blank" rel="noopener">GitHub</a>` : ''}
          ${s.linkedin ? `<a class="btn btn-outline" href="${s.linkedin}" target="_blank" rel="noopener">LinkedIn</a>` : ''}
          ${s.resumeUrl ? `<a class="btn btn-primary" href="${s.resumeUrl}" download>Download CV</a>` : ''}
        </div>
      </div>`;
    studentsGrid.appendChild(card);
  }
}

document.getElementById('studentForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const data = new FormData(form);
  const file = /** @type {File} */ (data.get('resume'));
  if (!file || file.type !== 'application/pdf') { showToast('Please upload a PDF resume.'); return; }
  const obj = {
    name: String(data.get('name') || ''),
    branch: String(data.get('branch') || ''),
    skills: String(data.get('skills') || ''),
    github: String(data.get('github') || ''),
    linkedin: String(data.get('linkedin') || ''),
    resumeName: file.name,
    resumeUrl: URL.createObjectURL(file),
    ts: Date.now(),
  };
  const list = getStudents();
  list.unshift(obj);
  setStudents(list.slice(0, 24));
  form.reset();
  renderStudents();
  showToast('Resume submitted!');
});

clearStudentsBtn?.addEventListener('click', () => {
  localStorage.removeItem(studentsKey);
  renderStudents();
  showToast('Student list cleared');
});

/* Faculty Profiles */
const facultyKey = 'eesa-faculty-v1';
const facultyGrid = document.getElementById('facultyGrid');
const clearFacultyBtn = document.getElementById('clearFaculty');
const facFilter = document.getElementById('facFilter');

function getFaculty() { try { return JSON.parse(localStorage.getItem(facultyKey)) || []; } catch { return []; } }
function setFaculty(list) { localStorage.setItem(facultyKey, JSON.stringify(list)); }

function renderFaculty() {
  const filter = facFilter?.value || 'all';
  const list = getFaculty().filter(f => filter === 'all' || (f.areas || '').toLowerCase().includes(filter.toLowerCase()));
  facultyGrid.innerHTML = '';
  if (!list.length) { facultyGrid.innerHTML = '<p class="card surface">No profiles yet.</p>'; return; }
  for (const f of list) {
    const card = document.createElement('article');
    card.className = 'card';
    const photo = f.photoUrl ? `<img alt="${f.name}" src="${f.photoUrl}" style="width:100%;height:180px;object-fit:cover">` : '';
    card.innerHTML = `${photo}<div class="card-body"><h3>${f.name}</h3><p class="chip">${f.designation}</p><p>${f.areas}</p>${f.email ? `<a class="btn btn-outline" href="mailto:${f.email}">Email</a>` : ''}</div>`;
    facultyGrid.appendChild(card);
  }
}

document.getElementById('facultyForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const data = new FormData(form);
  const photo = /** @type {File} */ (data.get('photo'));
  const obj = {
    name: String(data.get('name') || ''),
    designation: String(data.get('designation') || ''),
    areas: String(data.get('areas') || ''),
    email: String(data.get('email') || ''),
    photoUrl: photo && photo.size ? URL.createObjectURL(photo) : '',
    ts: Date.now(),
  };
  const list = getFaculty();
  list.unshift(obj);
  setFaculty(list.slice(0, 24));
  form.reset();
  renderFaculty();
  showToast('Profile added!');
});

clearFacultyBtn?.addEventListener('click', () => {
  localStorage.removeItem(facultyKey);
  renderFaculty();
  showToast('Faculty list cleared');
});

facFilter?.addEventListener('change', renderFaculty);

/* Events seed + tabs */
const eventsGrid = document.getElementById('eventsGrid');
const tabs = document.querySelectorAll('.tab');
const seedEvents = [
  { id: 'e1', title: 'PCB Design Workshop', date: '2025-09-05', time: '10:00', venue: 'Lab 3', kind: 'Workshop', status: 'upcoming', roles: ['Organizer: EESA', 'Speaker: Ms. Rao', 'Volunteer: Team A'], img: '' },
  { id: 'e2', title: 'Power Systems Seminar', date: '2025-10-12', time: '14:00', venue: 'Auditorium', kind: 'Seminar', status: 'upcoming', roles: ['Speaker: Prof. K Kulkarni', 'Coordinator: Events Cell'], img: '' },
  { id: 'e3', title: 'Circuit Hackathon', date: '2025-02-21', time: '09:00', venue: 'Main Hall', kind: 'Hackathon', status: 'past', roles: ['Winners: Team Ohm', 'Mentors: Alumni'], img: '' },
];

function renderEvents(category = 'upcoming') {
  eventsGrid.innerHTML = '';
  const list = seedEvents.filter(e => e.status === category);
  if (!list.length) { eventsGrid.innerHTML = '<p class="card surface">No events.</p>'; return; }
  for (const ev of list) {
    const card = document.createElement('article');
    card.className = 'card';
    const header = `<div class="card-media" style="height:160px;background:linear-gradient(120deg, var(--primary), var(--accent));display:grid;place-items:center;color:#fff"><span style="font-weight:800">${ev.kind}</span></div>`;
    const roles = ev.roles.map(r => `<span class='chip'>${r}</span>`).join(' ');
    card.innerHTML = `${header}<div class="card-body"><h3>${ev.title}</h3><p>${new Date(ev.date).toLocaleDateString()} · ${ev.time} · ${ev.venue}</p><p>${roles}</p></div>`;
    eventsGrid.appendChild(card);
  }
}

tabs.forEach(t => t.addEventListener('click', () => {
  tabs.forEach(x => x.classList.remove('active'));
  t.classList.add('active');
  const cat = t.dataset.tab;
  renderEvents(cat);
}));

/* Contact form -> mailto */
document.getElementById('contactForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('conName').value.trim();
  const email = document.getElementById('conEmail').value.trim();
  const subject = document.getElementById('conSubject').value.trim() || 'Message from EESA site';
  const message = document.getElementById('conMessage').value.trim();
  if (!name || !email || !message) { showToast('Please complete all fields.'); return; }
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  window.location.href = `mailto:eesa@gcek.ac.in?subject=${encodeURIComponent(subject)}&body=${body}`;
});

/* Initialize */
renderStudents();
renderFaculty();
renderEvents('upcoming');

