const SERVICES = [
  { name: 'Classic Cut', price: 220, minutes: 45, description: 'A clean, tailored cut finished with hot-towel detail.' },
  { name: 'Skin Fade', price: 280, minutes: 60, description: 'Precision fade work with sharp lines and a polished finish.' },
  { name: 'Beard Sculpt', price: 180, minutes: 30, description: 'Shape, line-up and conditioning for a defined beard.' },
  { name: 'Cut + Beard', price: 360, minutes: 75, description: 'Our full signature service for hair and beard in one visit.' },
  { name: 'Kids Cut', price: 170, minutes: 35, description: 'A patient, neat cut for young gents aged 12 and under.' },
  { name: 'The Crown Package', price: 490, minutes: 100, description: 'Cut, beard sculpt, hot towel and finishing treatment.' }
];

const BARBERS = [
  { name: 'Marcus', role: 'Master Barber', focus: 'Fades & classic cuts' },
  { name: 'Theo', role: 'Senior Barber', focus: 'Beards & textured styles' },
  { name: 'Lebo', role: 'Barber', focus: 'Modern cuts & kids' },
  { name: 'Any barber', role: 'Next available', focus: 'Let us match you' }
];

const siteHeader = `
<header class="site-header">
  <div class="container navbar">
    <a class="brand" href="/">
      <img src="/assets/logo.svg" alt="Crown & Clipper logo" width="42" height="42">
      <span>Crown & Clipper<small>Barber Co.</small></span>
    </a>
    <nav class="nav-links" id="navLinks" aria-label="Primary navigation">
      <a href="/" data-nav="home">Home</a>
      <a href="/services" data-nav="services">Services</a>
      <a href="/about" data-nav="about">About</a>
      <a href="/contact" data-nav="contact">Contact</a>
    </nav>
    <div class="nav-actions">
      <a class="btn btn-dark btn-small" href="/booking">Book Now</a>
      <button class="mobile-menu" type="button" aria-label="Open menu" aria-controls="navLinks" aria-expanded="false"><span></span></button>
    </div>
  </div>
</header>`;

const siteFooter = `
<footer class="site-footer">
  <div class="container footer-grid">
    <div class="footer-brand">
      <a class="brand" href="/"><img src="/assets/logo.svg" alt="Crown & Clipper logo"><span>Crown & Clipper<small>Barber Co.</small></span></a>
      <p>Modern barbering, old-school hospitality. Precision cuts, beard work and an easy booking experience in Johannesburg.</p>
      <a class="btn btn-gold btn-small" href="/booking">Book an appointment</a>
    </div>
    <div class="footer-col"><h4>Explore</h4><a href="/services">Services</a><a href="/about">Our barbers</a><a href="/contact">Contact</a><a href="/booking">Book now</a><a href="/photos">Manage photos</a></div>
    <div class="footer-col"><h4>Visit</h4><a href="https://www.google.com/maps/search/?api=1&query=14%20Crown%20Lane%2C%20Parkhurst%2C%20Johannesburg" target="_blank" rel="noreferrer">14 Crown Lane<br>Parkhurst, Johannesburg ↗</a><a href="tel:+27105550148">+27 10 555 0148</a><a href="mailto:hello@crownandclipper.co.za">hello@crownandclipper.co.za</a></div>
    <div class="footer-col"><h4>Hours & social</h4><span>Mon–Fri: 09:00–18:30</span><span>Sat: 08:30–17:00</span><span>Sun: Closed</span><a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram ↗</a><a href="https://www.facebook.com/" target="_blank" rel="noreferrer">Facebook ↗</a></div>
  </div>
  <div class="container footer-bottom"><span>© ${new Date().getFullYear()} Crown & Clipper Barber Co.</span><a href="/terms">Terms & Conditions</a></div>
</footer>`;

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('site-header');
  const footer = document.getElementById('site-footer');
  if (header) header.innerHTML = siteHeader;
  if (footer) footer.innerHTML = siteFooter;

  const current = document.body.dataset.page;
  document.querySelector(`[data-nav="${current}"]`)?.classList.add('active');

  const mobileButton = document.querySelector('.mobile-menu');
  const nav = document.getElementById('navLinks');
  mobileButton?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    mobileButton.setAttribute('aria-expanded', String(open));
    mobileButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

  initPopup();
  initBooking();
  initServiceCards();
  initSiteImages();
  initPhotoManager();
  initTeamNames();
});

async function initTeamNames() {
  try {
    const response = await fetch('/api/team');
    if (!response.ok) return;
    const names = await response.json();
    document.querySelectorAll('[data-team-name]').forEach(el => {
      if (names[el.dataset.teamName]) el.textContent = names[el.dataset.teamName];
    });
    document.querySelectorAll('[data-team-image]').forEach(el => {
      if (names[el.dataset.teamImage]) el.alt = `${names[el.dataset.teamImage]}, barber`;
    });
    const barber = document.getElementById('barber');
    if (barber) {
      const selected = barber.value;
      for (const [index,slot] of ['marcus','theo','lebo'].entries()) if (names[slot]) BARBERS[index].name = names[slot];
      barber.innerHTML = `<option value="">Choose a barber</option>` + BARBERS.map(b => `<option value="${escapeHtml(b.name)}">${escapeHtml(b.name)} — ${escapeHtml(b.role)}</option>`).join('');
      barber.value = selected || '';
    }
    document.querySelectorAll('[data-edit-name]').forEach(input => { input.value = names[input.dataset.editName] || ''; });
  } catch { /* Keep the default names if the service is unavailable. */ }
}

async function initSiteImages() {
  const images = document.querySelectorAll('[data-site-image]');
  if (!images.length) return;
  try {
    const response = await fetch('/api/images');
    if (!response.ok) return;
    const uploaded = await response.json();
    images.forEach(img => {
      const choice = uploaded[img.dataset.siteImage];
      if (choice) { img.src = choice.url; img.style.objectPosition = `50% ${choice.position}%`; }
    });
  } catch { /* Keep the existing picture when offline. */ }
}

function initPhotoManager() {
  const manager = document.getElementById('photoManager');
  if (!manager) return;
  const slots = [
    ['home-hero', 'Home: main photo'], ['home-tools', 'Home: grooming tools'],
    ['about-story', 'About: barber at work'], ['marcus', 'Marcus'],
    ['theo', 'Theo'], ['lebo', 'Lebron'], ['any-barber', 'Isaiah']
  ];
  manager.innerHTML = slots.map(([slot, label]) => `<form class="photo-row" data-slot="${slot}"><label for="upload-${slot}">${label}</label><input id="upload-${slot}" type="file" accept=".jpg,.jpeg,image/jpeg"><div class="photo-preview-wrap"><img class="photo-preview ${['home-hero', 'home-tools', 'about-story'].includes(slot) ? 'wide' : 'portrait'}" alt="Preview of ${label}" hidden><label class="photo-focus" hidden>Move crop up/down <input type="range" min="0" max="100" value="50"></label></div><button class="btn btn-dark btn-small" type="submit">Upload photo</button>${['marcus','theo','lebo','any-barber'].includes(slot) ? `<div class="name-edit"><label for="name-${slot}">Barber name</label><input id="name-${slot}" data-edit-name="${slot}" maxlength="40" autocomplete="off"><button class="btn btn-outline btn-small" type="button" data-save-name>Save name</button></div>` : ''}<p class="photo-row-status" role="status" aria-live="polite"></p></form>`).join('');
  manager.querySelectorAll('[data-save-name]').forEach(button => button.addEventListener('click', async () => {
    const form=button.closest('form');
    const status=form.querySelector('.photo-row-status');
    const name=form.querySelector('[data-edit-name]').value.trim();
    const password=document.getElementById('photoPassword').value;
    if (!password) { status.textContent='Enter your image password above.'; return; }
    if (!name) { status.textContent='Enter a barber name.'; return; }
    button.disabled=true;
    try {
      const response=await fetch('/api/team',{method:'PUT',headers:{'Content-Type':'application/json','X-Admin-Password':password},body:JSON.stringify({slot:form.dataset.slot,name})});
      const result=await response.json();
      if (!response.ok) throw new Error(result.error||'Unable to save name');
      status.textContent='Name saved. Refresh the About or booking page to see it.';
      form.querySelector('label').textContent=name;
    } catch(error) { status.textContent=error.message; }
    finally { button.disabled=false; }
  }));
  manager.querySelectorAll('form').forEach(form => {
    const input = form.querySelector('input[type=file]');
    const preview = form.querySelector('.photo-preview');
    const focus = form.querySelector('.photo-focus');
    input.addEventListener('change', () => {
      form.querySelector('.photo-row-status').textContent = '';
      if (preview.dataset.url) URL.revokeObjectURL(preview.dataset.url);
      preview.hidden = focus.hidden = true;
      if (!input.files[0]) return;
      preview.dataset.url = URL.createObjectURL(input.files[0]);
      preview.src = preview.dataset.url;
      preview.hidden = focus.hidden = false;
    });
    focus.querySelector('input').addEventListener('input', event => { preview.style.objectPosition = `50% ${event.target.value}%`; });
  });
  manager.querySelectorAll('form').forEach(form => form.addEventListener('submit', async event => {
    event.preventDefault();
    const status = form.querySelector('.photo-row-status');
    const file = form.querySelector('input[type=file]').files[0];
    const password = document.getElementById('photoPassword').value;
    if (!file) { status.textContent = 'Choose a JPG photo first.'; form.querySelector('input[type=file]').focus(); return; }
    if (!password) { status.textContent = 'Enter your image password above, then upload again.'; document.getElementById('photoPassword').focus(); return; }
    if ((file.type && file.type !== 'image/jpeg') || !/\.jpe?g$/i.test(file.name)) { status.textContent = 'Choose a JPG photo (.jpg or .jpeg).'; return; }
    if (file.size > 5 * 1024 * 1024) { status.textContent = 'Choose a photo smaller than 5 MB.'; return; }
    const preview = form.querySelector('.photo-preview');
    try { await preview.decode(); } catch { status.textContent = 'This file is not a readable image.'; return; }
    const wide = ['home-hero', 'home-tools', 'about-story'].includes(form.dataset.slot);
    if (wide && (preview.naturalWidth < 1000 || preview.naturalHeight < 700)) { status.textContent = 'For this section, choose a clear photo at least 1000 × 700 pixels.'; return; }
    if (!wide && (preview.naturalWidth < 800 || preview.naturalHeight < 900)) { status.textContent = 'For barber profiles, choose a clear photo at least 800 × 900 pixels.'; return; }
    const button = form.querySelector('button');
    button.disabled = true;
    status.textContent = `Uploading ${file.name}…`;
    try {
      const position = form.querySelector('.photo-focus input').value;
      const response = await fetch(`/api/images/${form.dataset.slot}?position=${position}`, { method: 'PUT', headers: { 'Content-Type': 'image/jpeg', 'X-Admin-Password': password }, body: file });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Upload failed');
      status.textContent = 'Photo saved. Open or refresh the Home or About page to see it.';
      if (preview.dataset.url) URL.revokeObjectURL(preview.dataset.url);
      preview.hidden = form.querySelector('.photo-focus').hidden = true;
      form.reset();
    } catch (error) { status.textContent = error.message; }
    finally { button.disabled = false; }
  }));
}

function initPopup() {
  const modal = document.getElementById('welcomeModal');
  if (!modal || localStorage.getItem('cc-popup-dismissed') === '1') return;
  setTimeout(() => modal.classList.add('open'), 4200);
  modal.querySelector('[data-close]')?.addEventListener('click', () => { modal.classList.remove('open'); localStorage.setItem('cc-popup-dismissed', '1'); });
  modal.addEventListener('click', e => { if (e.target === modal) { modal.classList.remove('open'); localStorage.setItem('cc-popup-dismissed', '1'); } });
}

function initServiceCards() {
  document.querySelectorAll('[data-service-grid]').forEach(grid => {
    grid.innerHTML = SERVICES.map((s, i) => `
      <article class="card service-card">
        <div class="service-top"><div class="service-icon">${String(i + 1).padStart(2, '0')}</div><div class="price">R${s.price}</div></div>
        <h3>${s.name}</h3>
        <p>${s.description}</p>
        <div class="service-meta"><span>${s.minutes} min</span><a href="/booking?service=${encodeURIComponent(s.name)}">Book this service ↗</a></div>
      </article>`).join('');
  });
}

function initBooking() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  const serviceEl = form.elements.service;
  const barberEl = form.elements.barber;
  const dateEl = form.elements.date;
  const timeEl = form.elements.time;
  const messageEl = document.getElementById('formMessage');
  const submitBtn = form.querySelector('button[type="submit"]');
  const successPanel = document.getElementById('bookingSuccess');
  const formPanel = document.getElementById('bookingFormPanel');

  serviceEl.innerHTML = `<option value="">Choose a service</option>` + SERVICES.map(s => `<option value="${escapeHtml(s.name)}">${escapeHtml(s.name)} — R${s.price}</option>`).join('');
  barberEl.innerHTML = `<option value="">Choose a barber</option>` + BARBERS.map(b => `<option value="${escapeHtml(b.name)}">${escapeHtml(b.name)} — ${escapeHtml(b.role)}</option>`).join('');

  const queryService = new URLSearchParams(location.search).get('service');
  if (queryService && SERVICES.some(s => s.name === queryService)) serviceEl.value = queryService;

  dateEl.min = shopToday();
  dateEl.value = shopToday();
  refreshTimes();

  dateEl.addEventListener('change', refreshTimes);
  serviceEl.addEventListener('change', () => {
    const selected = SERVICES.find(s => s.name === serviceEl.value);
    refreshTimes();
    const helper = document.getElementById('durationHint');
    if (helper) helper.textContent = selected ? `${selected.minutes} minutes • R${selected.price}` : 'Choose a service to see duration and price.';
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    messageEl.className = 'form-message';
    messageEl.textContent = '';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Confirming…';

    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch('/api/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Booking failed');

      const service = SERVICES.find(s => s.name === payload.service);
      const end = addMinutesToTime(payload.date, payload.time, service?.minutes || 45);
      const booking = { ...payload, barber: result.booking.barber, id: result.booking.id, duration: service?.minutes || 45, price: result.booking.total, endTime: end };
      localStorage.setItem('cc-last-booking', JSON.stringify(booking));
      renderSuccess(booking, formPanel, successPanel);
    } catch (err) {
      messageEl.className = 'form-message error';
      messageEl.textContent = err.message;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Confirm booking';
    }
  });

  document.getElementById('bookAnother')?.addEventListener('click', () => {
    successPanel.classList.remove('open');
    formPanel.style.display = 'block';
    form.reset();
    dateEl.value = shopToday();
    refreshTimes();
    submitBtn.disabled = false;
    submitBtn.textContent = 'Confirm booking';
    window.scrollTo({ top: 250, behavior: 'smooth' });
  });

  function refreshTimes() {
    const date = dateEl.value;
    if (!date) return;
    const day = new Date(`${date}T12:00:00Z`).getUTCDay();
    if (day === 0) {
      timeEl.innerHTML = '<option value="">We are closed on Sundays</option>';
      timeEl.disabled = true;
      return;
    }
    timeEl.disabled = false;
    const slots = [];
    const start = day === 6 ? 8.5 : 9;
    const closing = day === 6 ? 17 : 18.5;
    const selectedService = SERVICES.find(s => s.name === serviceEl.value);
    const duration = selectedService?.minutes || 45;
    for (let mins = start * 60; mins + duration <= closing * 60; mins += 30) {
      const hh = String(Math.floor(mins / 60)).padStart(2, '0');
      const mm = String(mins % 60).padStart(2, '0');
      const slotTime = `${hh}:${mm}`;
      // If booking today, hide time slots that have already started.
      if (date < shopToday() || (date === shopToday() && mins <= shopMinutesNow())) continue;
      slots.push(`<option value="${slotTime}">${formatTime(slotTime)}</option>`);
    }
    timeEl.innerHTML = slots.length ? '<option value="">Choose a time</option>' + slots.join('') : '<option value="">No times available for this date</option>';
  }
}

function renderSuccess(booking, formPanel, successPanel) {
  formPanel.style.display = 'none';
  successPanel.classList.add('open');
  const selected = SERVICES.find(s => s.name === booking.service);
  successPanel.querySelector('[data-ref]').textContent = booking.id;
  successPanel.querySelector('[data-service]').textContent = booking.service;
  successPanel.querySelector('[data-barber]').textContent = booking.barber;
  successPanel.querySelector('[data-datetime]').textContent = `${formatDate(booking.date)} at ${formatTime(booking.time)}`;
  successPanel.querySelector('[data-total]').textContent = `R${booking.price ?? selected?.price ?? 0}${booking.coupon ? ' (FIRSTCUT10 applied)' : ''}`;

  const googleBtn = successPanel.querySelector('[data-google]');
  const icsBtn = successPanel.querySelector('[data-ics]');
  googleBtn.href = googleCalendarUrl(booking);
  icsBtn.onclick = () => downloadICS(booking);
  successPanel.querySelector('[data-print]')?.addEventListener('click', () => window.print());
}

function googleCalendarUrl(b) {
  const start = utcIcsStamp(b.date, b.time);
  const end = utcIcsStamp(b.date, b.endTime);
  const details = `Booking ${b.id}. ${b.service} with ${b.barber}. Please arrive 5 minutes early. Phone: ${b.phone}.`;
  const params = new URLSearchParams({ action: 'TEMPLATE', text: `Crown & Clipper — ${b.service}`, dates: `${start}/${end}`, details, location: '14 Crown Lane, Parkhurst, Johannesburg', ctz: 'Africa/Johannesburg' });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function downloadICS(b) {
  const start = utcIcsStamp(b.date, b.time);
  const end = utcIcsStamp(b.date, b.endTime);
  const body = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//CrownAndClipper//Booking//EN', 'CALSCALE:GREGORIAN', 'X-WR-TIMEZONE:Africa/Johannesburg', 'BEGIN:VEVENT',
    `UID:${b.id}@crownandclipper.co.za`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z')}`,
    `DTSTART:${start}`, `DTEND:${end}`,
    `SUMMARY:Crown & Clipper — ${b.service}`, `LOCATION:14 Crown Lane, Parkhurst, Johannesburg`,
    `DESCRIPTION:Booking ${b.id}. ${b.service} with ${b.barber}. Please arrive 5 minutes early. Phone: ${b.phone}.`, 'END:VEVENT', 'END:VCALENDAR'
  ].join('\r\n');
  const blob = new Blob([body], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `${b.id}-crown-and-clipper.ics`; a.click();
  URL.revokeObjectURL(url);
}

function utcIcsStamp(date, time) { const d = new Date(`${date}T${time}:00+02:00`); return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z'); }
function addMinutesToTime(date, time, minutes) { const total = Number(time.slice(0,2)) * 60 + Number(time.slice(3)) + minutes; return `${String(Math.floor(total / 60)).padStart(2,'0')}:${String(total % 60).padStart(2,'0')}`; }
function shopParts() { return Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Johannesburg', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).map(p => [p.type, p.value])); }
function shopToday() { const p = shopParts(); return `${p.year}-${p.month}-${p.day}`; }
function shopMinutesNow() { const p = shopParts(); return Number(p.hour) * 60 + Number(p.minute); }
function formatDate(date) { return new Date(`${date}T12:00:00`).toLocaleDateString('en-ZA', { weekday:'long', day:'numeric', month:'long', year:'numeric' }); }
function formatTime(time) { const [h,m] = time.split(':').map(Number); const suffix = h >= 12 ? 'PM' : 'AM'; const hour = h % 12 || 12; return `${hour}:${String(m).padStart(2,'0')} ${suffix}`; }
function escapeHtml(text) { return String(text).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;'); }
