/* PRXDEVS — site script
   ?shot            → still mode: everything visible, no motion (used for screenshots)
   ?shot=<section>  → still mode showing only the nav + that [data-section]        */
(() => {
  const root = document.documentElement;
  root.classList.remove('no-js');
  root.classList.add('js');

  const params = new URLSearchParams(location.search);
  const shot = params.get('shot');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const still = shot !== null || reduce;

  if (shot !== null) {
    root.classList.add('shot');
    if (shot && shot !== 'all') {
      root.classList.add('shot-one');
      document.querySelectorAll('[data-section]').forEach((s) => s.classList.toggle('is-shot', s.dataset.section === shot));
    }
  }

  /* ---------- Ahmedabad clock ---------- */
  const clock = document.getElementById('clock');
  if (clock) {
    const tick = () => {
      clock.textContent = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }).format(new Date());
    };
    tick();
    setInterval(tick, 20000);
  }

  /* ---------- Nav: mobile menu + services dropdown ---------- */
  const nav = document.getElementById('nav');
  if (nav) {
    const menuBtn = nav.querySelector('.nav__menu');
    const menu = document.getElementById('mobileMenu');
    const setMenu = (open) => {
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.textContent = open ? 'Close' : 'Menu';
      menu.hidden = !open;
    };
    menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

    const dd = nav.querySelector('.dd');
    const ddBtn = dd && dd.querySelector('.dd__btn');
    const setDd = (open) => { dd.classList.toggle('is-open', open); ddBtn.setAttribute('aria-expanded', String(open)); };
    if (dd) {
      ddBtn.addEventListener('click', () => setDd(!dd.classList.contains('is-open')));
      document.addEventListener('click', (e) => { if (!dd.contains(e.target)) setDd(false); });
    }
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (!menu.hidden) setMenu(false);
      if (dd && dd.classList.contains('is-open')) { setDd(false); ddBtn.focus(); }
    });
    addEventListener('scroll', () => nav.classList.toggle('is-stuck', scrollY > 8), { passive: true });
  }

  /* ---------- Reveal on scroll ---------- */
  const reveals = document.querySelectorAll('[data-reveal]');
  if (still || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -6% 0px' });
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- Code that types itself ---------- */
  document.querySelectorAll('.code').forEach((code) => {
    const lines = Array.from(code.querySelectorAll('.ln'));
    if (!lines.length) return;
    if (still) {
      lines.forEach((l) => l.classList.add('on'));
      lines[lines.length - 1].classList.add('cur');
      return;
    }
    let i = 0;
    const step = () => {
      lines.forEach((l) => l.classList.remove('cur'));
      if (i < lines.length) {
        lines[i].classList.add('on', 'cur');
        i += 1;
        setTimeout(step, 520);
      } else {
        setTimeout(() => { lines.forEach((l) => l.classList.remove('on', 'cur')); i = 0; step(); }, 3600);
      }
    };
    step();
  });

  /* ---------- Browser windows that cycle through several sites ---------- */
  document.querySelectorAll('.reel').forEach((reel) => {
    const imgs = Array.from(reel.querySelectorAll('img'));
    const win = reel.closest('.win');
    const tabs = win ? Array.from(win.querySelectorAll('.tab')) : [];
    if (imgs.length < 2 || still) return;
    let cur = 0;
    setInterval(() => {
      cur = (cur + 1) % imgs.length;
      imgs.forEach((img, i) => img.classList.toggle('is-on', i === cur));
      tabs.forEach((t, i) => t.classList.toggle('is-on', i === cur));
    }, 3200);
  });

  /* ---------- Draggable desk windows ---------- */
  if (matchMedia('(pointer: fine)').matches && !still) {
    let z = 20;
    document.querySelectorAll('[data-desk]').forEach((desk) => {
      desk.querySelectorAll('[data-win]').forEach((win) => {
        const handle = win.querySelector('[data-drag]') || win;
        win.addEventListener('pointerdown', () => { z += 1; win.style.zIndex = z; });
        handle.addEventListener('pointerdown', (e) => {
          if (e.button !== 0) return;
          const d = desk.getBoundingClientRect();
          const w = win.getBoundingClientRect();
          const ox = e.clientX - w.left;
          const oy = e.clientY - w.top;
          win.classList.add('is-dragging');
          handle.setPointerCapture(e.pointerId);
          const move = (ev) => {
            const x = Math.min(Math.max(ev.clientX - d.left - ox, -w.width * 0.4), d.width - w.width * 0.6);
            const y = Math.min(Math.max(ev.clientY - d.top - oy, -20), d.height - 40);
            win.style.left = `${x}px`;
            win.style.top = `${y}px`;
          };
          const up = () => {
            win.classList.remove('is-dragging');
            handle.removeEventListener('pointermove', move);
            handle.removeEventListener('pointerup', up);
          };
          handle.addEventListener('pointermove', move);
          handle.addEventListener('pointerup', up);
        });
      });
    });
  }

  /* ---------- Filters (work page) ---------- */
  document.querySelectorAll('[data-filters]').forEach((group) => {
    const scope = document.querySelector(group.dataset.filters);
    const buttons = Array.from(group.querySelectorAll('.filter'));
    buttons.forEach((btn) => btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      scope.querySelectorAll('[data-cat]').forEach((el) => {
        el.classList.toggle('is-hidden', f !== 'all' && !el.dataset.cat.split(' ').includes(f));
      });
    }));
  });

  /* ---------- Project brief forms → Web3Forms ---------- */
  const WEB3FORMS_ACCESS_KEY = '2d3dbf16-9006-4e72-86b1-d5977ca9ce9d';

  // Pre-tick a service when arriving from a service page (?service=Website)
  const wanted = params.get('service');
  if (wanted) {
    document.querySelectorAll('form[data-brief] input[name="need"]').forEach((box) => {
      box.checked = box.value.toLowerCase() === wanted.toLowerCase();
    });
  }

  document.querySelectorAll('form[data-brief]').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const note = form.querySelector('.form__note');
      const btn = form.querySelector('button[type="submit"]');
      const say = (text, kind) => {
        note.textContent = text;
        note.classList.toggle('is-ok', kind === 'ok');
        note.classList.toggle('is-err', kind === 'err');
      };

      if (!form.checkValidity()) {
        say('Please add your name and a valid email.', 'err');
        form.reportValidity();
        return;
      }

      const data = new FormData(form);
      const needs = data.getAll('need').join(', ') || 'Not specified';
      const lines = [
        `Needs: ${needs}`,
        data.get('company') ? `Company: ${data.get('company')}` : '',
        data.get('phone') ? `Phone: ${data.get('phone')}` : '',
        data.get('timeline') ? `Timeline: ${data.get('timeline')}` : '',
        '',
        'Project details:',
        data.get('message') || '(none)',
      ].filter((l, i) => l !== '' || i === 4);

      const label = btn.innerHTML;
      btn.disabled = true;
      btn.textContent = 'Sending…';
      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: WEB3FORMS_ACCESS_KEY,
            subject: `New project brief: ${needs}`,
            from_name: 'PRXDEVS website',
            name: data.get('name'),
            email: data.get('email'),
            message: lines.join('\n'),
          }),
        });
        const out = await res.json();
        if (!out.success) throw new Error(out.message || 'Send failed');
        form.reset();
        say('Thanks! Your brief is in. We’ll reply within 24 hours.', 'ok');
      } catch (err) {
        console.error(err);
        say('Something went wrong. Please email prxdevs@gmail.com instead.', 'err');
      } finally {
        btn.disabled = false;
        btn.innerHTML = label;
      }
    });
  });
})();
