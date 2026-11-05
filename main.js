/* =========================================================
   MUHAMMAD ABDULLAH — landing page interactions
   No dependencies. Respects prefers-reduced-motion.
   ========================================================= */
(() => {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const store = {
    get(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch { /* storage blocked */ } },
  };

  /* ---------------- BOOT SEQUENCE ---------------- */
  const boot = $("#boot");
  const bootLog = $("#bootLog");
  const bootLines = [
    ["dim", "[  0.000] MABAA-OS kernel boot · target: you"],
    ["ok", "[  OK  ] Mounting /dev/abdullah"],
    ["ok", "[  OK  ] Loading modules: nmap metasploit burpsuite kali"],
    ["ok", "[  OK  ] Bypassing firewall ............. done"],
    ["ok", "[  OK  ] Escalating privileges .......... root"],
    ["warn", "[ WARN ] Intrusion detected. Relax, it's a portfolio."],
  ];
  let bootSkipped = false;

  function endBoot() {
    if (!boot || boot.classList.contains("done")) return;
    boot.classList.add("done");
    document.body.classList.remove("is-booting");
    store.set("booted", "1");
    setTimeout(() => boot.classList.add("gone"), 900);
    startHero();
  }

  async function runBoot() {
    if (reduce || store.get("booted")) { boot.classList.add("done", "gone"); startHero(); return; }
    document.body.classList.add("is-booting");
    const skip = () => { bootSkipped = true; endBoot(); };
    window.addEventListener("keydown", skip, { once: true });
    boot.addEventListener("click", skip, { once: true });

    for (const [cls, text] of bootLines) {
      if (bootSkipped) return;
      const line = document.createElement("span");
      line.className = cls;
      bootLog.appendChild(line);
      for (let i = 0; i < text.length; i += 3) {
        line.textContent = text.slice(0, i + 3);
        await sleep(8);
      }
      bootLog.appendChild(document.createTextNode("\n"));
      await sleep(110);
    }
    if (bootSkipped) return;
    $("#bootGranted").classList.add("on");
    await sleep(750);
    endBoot();
  }

  /* ---------------- REVEAL ON SCROLL ---------------- */
  const revealIO = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add("in");
      revealIO.unobserve(e.target);
      e.target.dispatchEvent(new CustomEvent("revealed"));
    }
  }, { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });

  let heroStarted = false;
  function startHero() {
    if (heroStarted) return;
    heroStarted = true;
    $$("[data-reveal], .sec-head").forEach((el) => revealIO.observe(el));
    typer();
  }

  /* ---------------- ROLE TYPER ---------------- */
  async function typer() {
    const el = $("#typer");
    const roles = [
      "Penetration Tester",
      "Android Application Security",
      "OSINT Operator",
      "Cyber Threat Analyst",
      "CTF Player · National #13",
    ];
    if (reduce) { el.textContent = roles[0]; return; }
    await sleep(500);
    for (let r = 0; ; r = (r + 1) % roles.length) {
      const word = roles[r];
      for (let i = 1; i <= word.length; i++) { el.textContent = word.slice(0, i); await sleep(45 + Math.random() * 50); }
      await sleep(1700);
      for (let i = word.length; i >= 0; i--) { el.textContent = word.slice(0, i); await sleep(22); }
      await sleep(260);
    }
  }

  /* ---------------- TEXT SCRAMBLE ---------------- */
  const glyphs = "!<>-_\\/[]{}=+*^?#0123456789ABCDEF";
  function scramble(el) {
    const final = el.dataset.final || (el.dataset.final = el.textContent);
    if (reduce) return;
    const len = final.length;
    const start = performance.now();
    const dur = 650 + len * 35;
    (function frame(now) {
      const t = Math.min(1, (now - start) / dur);
      const solved = Math.floor(t * len);
      let out = "";
      for (let i = 0; i < len; i++) {
        const ch = final[i];
        out += i < solved || ch === " " ? ch : glyphs[(Math.random() * glyphs.length) | 0];
      }
      el.textContent = out;
      if (t < 1) requestAnimationFrame(frame);
    })(start);
  }
  $$(".sec-head").forEach((head) => {
    head.addEventListener("revealed", () => { const t = $("[data-scramble]", head); if (t) scramble(t); });
    const t = $("[data-scramble]", head);
    if (t) head.addEventListener("mouseenter", () => scramble(t));
  });

  /* ---------------- COUNTERS ---------------- */
  const ease = (t) => 1 - Math.pow(1 - t, 4);
  function countUp(el) {
    const target = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.decimals || "0", 10);
    const pad = parseInt(el.dataset.pad || "0", 10);
    const fmt = (v) => { const s = v.toFixed(dec); return pad ? s.padStart(pad, "0") : s; };
    if (reduce) { el.textContent = fmt(target); return; }
    const start = performance.now(), dur = 1600;
    (function f(now) {
      const t = Math.min(1, (now - start) / dur);
      el.textContent = fmt(target * ease(t));
      if (t < 1) requestAnimationFrame(f);
    })(start);
  }
  function rankDown(el) {
    // Rank "climbs" from #99 down to the real position.
    const target = parseInt(el.dataset.rank, 10);
    if (reduce) { el.textContent = target; return; }
    const from = 99, start = performance.now(), dur = 1900;
    (function f(now) {
      const t = Math.min(1, (now - start) / dur);
      const v = Math.round(from - (from - target) * ease(t));
      el.textContent = t < 1 && Math.random() < 0.12 ? String((Math.random() * 99) | 0).padStart(2, "0") : v;
      if (t < 1) requestAnimationFrame(f);
      else el.textContent = target;
    })(start);
  }
  const countIO = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const el = e.target;
      el.dataset.rank ? rankDown(el) : countUp(el);
      countIO.unobserve(el);
    }
  }, { threshold: 0.6 });
  $$("[data-count], [data-rank]").forEach((el) => countIO.observe(el));

  /* ---------------- WHOAMI TERMINAL ---------------- */
  const term = $("#whoamiTerm");
  if (term && !reduce) {
    term.classList.add("typing");
    const termIO = new IntersectionObserver(async ([e]) => {
      if (!e.isIntersecting) return;
      termIO.disconnect();
      for (const p of $$("p", term)) {
        p.classList.add("shown");
        await sleep(p.querySelector(".prompt") ? 260 : 70);
      }
    }, { threshold: 0.35 });
    termIO.observe(term);
  }

  /* ---------------- NAV / PROGRESS / TIMELINE ---------------- */
  const nav = $("#nav");
  const bar = $("#progressBar");
  const fill = $("#timelineFill");
  const timeline = $("#timeline");
  const rain = $("#rain");
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      nav.classList.toggle("is-scrolled", y > 30);
      if (timeline) {
        const r = timeline.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / r.height));
        fill.style.transform = `scaleY(${p})`;
      }
      if (rain) rain.style.opacity = y > innerHeight * 0.8 ? "0.2" : "0.55";
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // active link
  const links = $$(".nav__links a[href^='#']:not(.nav__cta)");
  const secIO = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id));
    }
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach((s) => secIO.observe(s));

  // mobile menu
  const burger = $("#burger");
  const navLinks = $("#navLinks");
  const setMenu = (open) => {
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    navLinks.classList.toggle("open", open);
  };
  burger.addEventListener("click", () => setMenu(burger.getAttribute("aria-expanded") !== "true"));
  navLinks.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });

  /* ---------------- HUD CLOCK ---------------- */
  const clock = $("#hudClock");
  const fmtTime = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Karachi", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  const tickClock = () => { clock.textContent = `${fmtTime.format(new Date())} PKT · LIVE`; };
  tickClock(); setInterval(tickClock, 1000);
  $("#year").textContent = new Date().getFullYear();

  /* ---------------- RANDOM GLITCH BURSTS ---------------- */
  if (!reduce) {
    const burst = (el, ms = 480) => { el.classList.add("is-glitching"); setTimeout(() => el.classList.remove("is-glitching"), ms); };
    const loop = () => {
      const visible = $$(".glitch").filter((g) => { const r = g.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; });
      if (visible.length) burst(visible[(Math.random() * visible.length) | 0]);
      setTimeout(loop, 1800 + Math.random() * 2600);
    };
    setTimeout(loop, 2500);
    const photo = $("#photo");
    const pLoop = () => { burst(photo, 520); setTimeout(pLoop, 3500 + Math.random() * 4000); };
    setTimeout(pLoop, 3200);
    photo.addEventListener("mouseenter", () => burst(photo, 520));
  }

  /* ---------------- SKILL HOVER ORIGIN ---------------- */
  $$(".skill").forEach((s) => {
    s.addEventListener("pointerenter", (e) => {
      const r = s.getBoundingClientRect();
      s.style.setProperty("--px", `${e.clientX - r.left}px`);
      s.style.setProperty("--py", `${e.clientY - r.top}px`);
    });
  });

  /* ---------------- CURSOR + MAGNETIC + GRID SPOTLIGHT ---------------- */
  const grid = $(".fx-grid");
  if (finePointer && !reduce) {
    document.body.classList.add("has-cursor");
    const cur = $(".cursor"), dot = $(".cursor__dot"), ring = $(".cursor__ring");
    let mx = -100, my = -100, rx = -100, ry = -100;
    window.addEventListener("pointermove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      grid.style.setProperty("--mx", mx + "px");
      grid.style.setProperty("--my", my + "px");
    }, { passive: true });
    (function follow() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      requestAnimationFrame(follow);
    })();
    document.addEventListener("pointerover", (e) => { cur.classList.toggle("is-hover", !!e.target.closest("a, button, .skill, .op__ops li, .tools li, .opsrun li")); });
    window.addEventListener("pointerdown", () => cur.classList.add("is-down"));
    window.addEventListener("pointerup", () => cur.classList.remove("is-down"));

    $$(".magnetic").forEach((m) => {
      m.addEventListener("pointermove", (e) => {
        const r = m.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
        m.style.transform = `translate(${x * 0.22}px, ${y * 0.32}px)`;
      });
      m.addEventListener("pointerleave", () => { m.style.transform = ""; });
      m.style.transition = "transform .35s cubic-bezier(.2,.8,.1,1), color .3s";
    });
  }

  /* ---------------- HEX RAIN CANVAS ---------------- */
  if (rain && !reduce) {
    const ctx = rain.getContext("2d");
    const chars = "0123456789ABCDEF<>/{}#$";
    const size = 16;
    let w, h, cols, drops, dpr;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = rain.width = Math.floor(innerWidth * dpr);
      h = rain.height = Math.floor(innerHeight * dpr);
      cols = Math.ceil(w / (size * dpr));
      drops = Array.from({ length: cols }, () => ({ y: Math.random() * -60, v: 0.25 + Math.random() * 0.7, on: Math.random() < 0.38 }));
      ctx.fillStyle = "#060608"; ctx.fillRect(0, 0, w, h);
    };
    resize();
    window.addEventListener("resize", resize);
    let last = 0;
    (function draw(now) {
      requestAnimationFrame(draw);
      if (document.hidden || now - last < 42) return; // ~24fps
      last = now;
      ctx.fillStyle = "rgba(6,6,8,0.12)";
      ctx.fillRect(0, 0, w, h);
      ctx.font = `600 ${size * dpr}px JetBrains Mono, monospace`;
      for (let i = 0; i < cols; i++) {
        const d = drops[i];
        if (!d.on) { if (Math.random() < 0.0015) d.on = true; continue; }
        const ch = chars[(Math.random() * chars.length) | 0];
        const x = i * size * dpr, y = d.y * size * dpr;
        ctx.fillStyle = Math.random() < 0.06 ? "#ffd0d6" : "rgba(255,30,60,0.85)";
        ctx.fillText(ch, x, y);
        d.y += d.v;
        if (y > h && Math.random() > 0.96) { d.y = 0; d.on = Math.random() < 0.5; }
      }
    })(0);
  }

  /* ---------------- COPY + TOAST ---------------- */
  const toast = $("#toast");
  let toastT;
  const say = (msg) => { toast.textContent = msg; toast.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove("on"), 2000); };
  $$("[data-copy]").forEach((b) => b.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); say("COPIED TO CLIPBOARD ✓"); }
    catch { say(b.dataset.copy); }
  }));

  /* ---------------- EASTER EGG SHELL ---------------- */
  const shell = $("#shell"), out = $("#shellOut"), form = $("#shellForm"), input = $("#shellInput");
  const hist = []; let hIdx = 0; let lastFocus = null;
  const print = (text, cls) => { const p = document.createElement("p"); if (cls) p.className = cls; p.textContent = text; out.appendChild(p); out.scrollTop = out.scrollHeight; };
  const cmds = {
    help: () => "available commands:\n  whoami   about    experience   skills   tools\n  certs    ranks    lead         contact  resume\n  linkedin hire     ls           clear    exit",
    whoami: () => "Muhammad Abdullah Bin Altaf Anjum",
    about: () => "BE Information Security · NUST (MCS) · CGPA 3.64\nPresident, Information Security Society\nTrack: penetration testing · red teaming · Android security",
    experience: () => "[OP-02] Cyber Threat Analyst @ CTM360     Jun 2025 – Jul 2025\n        CTI · EASM · DRP · phishing & scam detection · DMARC/SPF/DKIM · TPRM\n[OP-01] IT Specialist @ 10Pearls           Jul 2024 – Aug 2024\n        VAPT & compliance · EDR · CrowdStrike Falcon · Zscaler",
    skills: () => "VAPT · Android Application Security · OSINT · Threat Intelligence · WiFi Hacking · Discord Moderation",
    tools: () => "ASTRA (custom) · Nmap · Metasploit · Burp Suite · Kali Linux · Cisco Packet Tracer",
    certs: () => "[..] HTB Certified Penetration Testing Specialist   in progress\n[OK] Cisco NetAcad · Networking Basics             Aug 2024\n[OK] ISO/IEC 27001 Information Security Associate  May 2024\n[OK] EC-Council · Ethical Hacking Essentials       Mar 2024\n[OK] TryHackMe · Advent of Cyber                   Dec 2023",
    ranks: () => "#13  CodeCon-CUI'24 National Level CTF\n#16  Blitzstorm National Level OSINT Challenge",
    lead: () => "President · InfoSec Society NUST (MCS)            Sep 2025 – present\nClass Representative · InfoSec Society NUST (MCS) Oct 2023 – Sep 2025\nCTF Manager · NUST Hackathon DevCon '25\nCYS Bootcamp Manager · Signalianz Security Hub",
    contact: () => "email     mabaa2005@proton.me\nlinkedin  linkedin.com/in/abdullahalltaf",
    resume: () => { const a = document.createElement("a"); a.href = "assets/Muhammad-Abdullah-Resume.pdf"; a.download = ""; a.click(); return "[+] downloading Resume.pdf ..."; },
    linkedin: () => { window.open("https://www.linkedin.com/in/abdullahalltaf", "_blank", "noopener"); return "[+] opening linkedin ..."; },
    hire: () => { setTimeout(() => { location.href = "mailto:mabaa2005@proton.me?subject=Let%E2%80%99s%20talk"; }, 600); return "[+] permission granted. opening mail client ..."; },
    ls: () => "about.txt  experience.log  skills.db  certs/  flag.txt",
    nmap: () => "Starting Nmap against recruiter ...\nPORT     STATE  SERVICE\n443/tcp  open   hire-me\n1337/tcp open   ctf\nNmap done: 1 candidate up. Run 'hire'.",
    clear: () => { out.textContent = ""; return null; },
    exit: () => { closeShell(); return null; },
  };
  function run(raw) {
    const line = raw.trim();
    print(`guest@mabaa:~$ ${line}`, "cmd");
    if (!line) return;
    const [c, ...args] = line.split(/\s+/);
    const cmd = c.toLowerCase();
    let res;
    if (cmd === "sudo") res = args[0] === "hire" ? cmds.hire() : "guest is not in the sudoers file. This incident will be reported.";
    else if (cmd === "cat") res = args[0] === "flag.txt" ? "FLAG{y0u_f0und_th3_r3cru1t3r_3gg}" : args[0] ? `cat: ${args[0]}: permission denied` : "cat: missing operand";
    else if (cmd === "rm") res = "nice try.";
    else if (cmds[cmd]) res = cmds[cmd](args);
    else res = `command not found: ${cmd}. try 'help'`;
    if (res) print(res);
  }
  function openShell() {
    lastFocus = document.activeElement;
    shell.hidden = false;
    if (!out.childElementCount) print("MABAA-OS shell · type 'help' to list commands");
    setTimeout(() => input.focus(), 30);
  }
  function closeShell() { shell.hidden = true; if (lastFocus) lastFocus.focus(); }
  form.addEventListener("submit", (e) => { e.preventDefault(); const v = input.value; if (v.trim()) { hist.push(v); hIdx = hist.length; } run(v); input.value = ""; });
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && hIdx > 0) { hIdx--; input.value = hist[hIdx]; e.preventDefault(); }
    if (e.key === "ArrowDown") { hIdx = Math.min(hist.length, hIdx + 1); input.value = hist[hIdx] || ""; e.preventDefault(); }
  });
  $("#shellClose").addEventListener("click", closeShell);
  shell.addEventListener("click", (e) => { if (e.target === shell) closeShell(); });
  document.addEventListener("keydown", (e) => {
    if (!boot.classList.contains("gone") && !boot.classList.contains("done")) return;
    if (e.key === "Escape" && !shell.hidden) { closeShell(); return; }
    const typing = /^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName);
    if ((e.key === "`" || e.key === "~") && !typing) { e.preventDefault(); shell.hidden ? openShell() : closeShell(); }
  });
  $(".foot__hint").addEventListener("click", openShell);

  /* ---------------- GO ---------------- */
  document.documentElement.classList.remove("no-js");
  runBoot();
})();
