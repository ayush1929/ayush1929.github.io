document.addEventListener("DOMContentLoaded", () => {
  /* ====== CONFIG (set your simple password here) ====== */
  const ADMIN_PASSWORD = "change-me"; // <-- change this

  /* ====== NAV ====== */
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  navToggle?.addEventListener("click", () => {
    const show = !navMenu.classList.contains("show");
    navMenu.classList.toggle("show", show);
    navToggle.setAttribute("aria-expanded", String(show));
  });
  navMenu?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    navMenu.classList.remove("show");
    navToggle?.setAttribute("aria-expanded", "false");
  }));

  /* ====== SMOOTH SCROLL ====== */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: "smooth" }); }
    });
  });
// Helper: smooth-scroll to an ID
function scrollToId(id){
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

  /* ====== REVEAL ON SCROLL ====== */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        observer.unobserve(e.target);
      }
    });
  }, { threshold: .15 });
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  /* ====== KPIs: years + project counts ====== */

// Animate a number once
function animateCount(el, target, duration=900){
  if (!el) return;
  const start = Number(el.textContent.replace(/\D/g,'')) || 0;
  const startTime = performance.now();
  function step(now){
    const p = Math.min(1, (now - startTime) / duration);
    const val = Math.floor(start + (target - start) * (1 - Math.pow(1 - p, 3)));
    el.textContent = val.toLocaleString();
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ----- Certifications KPI -----
const kpiCert = document.getElementById("kpi-cert");
const certCount = document.querySelectorAll(".certs-grid .cert").length;
if (kpiCert){
  const certNum = kpiCert.querySelector(".num");
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting){
        animateCount(certNum, certCount, 900);
        obs.unobserve(kpiCert);
      }
    });
  }, { threshold: .7 });
  obs.observe(kpiCert);

  kpiCert.addEventListener("click", () => scrollToId("certifications"));
}

// ----- Technologies KPI -----
const kpiTech = document.getElementById("kpi-tech");
const techCount = document.querySelectorAll("#skills .skill").length;
if (kpiTech){
  const techNum = kpiTech.querySelector(".num");
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting){
        animateCount(techNum, techCount, 900);
        obs.unobserve(kpiTech);
      }
    });
  }, { threshold: .7 });
  obs.observe(kpiTech);

  kpiTech.addEventListener("click", () => scrollToId("skills"));
}

// Count cards inside a project section
function countCards(sectionId){
  const section = document.getElementById(sectionId);
  return section ? section.querySelectorAll(".card").length : 0;
}

// YEARS (from data-start-year)
const yearsCard = document.getElementById("kpi-years");
if (yearsCard){
  const startYear = Number(yearsCard.getAttribute("data-start-year")) || 2019;
  const now = new Date();
  // Whole years since Jan 1 of startYear
  const years = Math.max(0, now.getFullYear() - startYear);
  const numEl = yearsCard.querySelector(".num");

  // Animate when visible
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting){
        animateCount(numEl, years, 900);
        obs.unobserve(yearsCard);
      }
    });
  }, { threshold: .7 });
  obs.observe(yearsCard);
}

// PROJECT COUNTS
const kpiData = document.getElementById("kpi-data");
const kpiProg = document.getElementById("kpi-prog");
const dataCount = countCards("data-projects");
const progCount = countCards("programming-projects");

// Animate when visible
[kpiData, kpiProg].forEach((el, i) => {
  if (!el) return;
  const target = i === 0 ? dataCount : progCount;
  const numEl = el.querySelector(".num");
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting){
        animateCount(numEl, target, 900);
        obs.unobserve(el);
      }
    });
  }, { threshold: .7 });
  obs.observe(el);
});

// Click behavior: open Projects and select the right tab
function openProjectsTab(sectionId){
  const tabs = {
    "data-projects": 0,
    "programming-projects": 1
  };
  const idx = tabs[sectionId] ?? 0;
  const btns = document.querySelectorAll(".tabs .tab-button");
  const btn = btns[idx];
  if (btn){
    // use existing showSection
    showSection(sectionId, btn);
  }
  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
}

// Wire clicks (buttons already keyboard-accessible)
kpiData?.addEventListener("click", () => openProjectsTab("data-projects"));
kpiProg?.addEventListener("click", () => openProjectsTab("programming-projects"));


  /* ====== TABS ====== */
  window.showSection = function(sectionId, btnEl){
    document.querySelectorAll(".project-section").forEach(s => s.style.display = "none");
    const section = document.getElementById(sectionId);
    if (section) section.style.display = "block";
    document.querySelectorAll(".tab-button").forEach(b => b.classList.remove("active"));
    btnEl?.classList.add("active");
  };

  /* ====== CONTACT MODAL ====== */
  const popup = document.getElementById("popup-container");
  const openBtns = [document.getElementById("show-popup"), document.getElementById("contact-link")].filter(Boolean);
  const closeBtn = document.getElementById("close-popup");
  const focusable = 'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';
  let lastFocusedEl = null;

  function openPopup(){
    lastFocusedEl = document.activeElement;
    popup.style.display = "flex";
    popup.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    document.body.classList.add("modal-open"); // hide FAB
    popup.querySelector(focusable)?.focus();
    document.addEventListener("keydown", trapTab);
    document.addEventListener("keydown", onEsc);
  }
  function closePopup(){
    popup.style.display = "none";
    popup.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    document.body.classList.remove("modal-open"); // restore FAB
    document.removeEventListener("keydown", trapTab);
    document.removeEventListener("keydown", onEsc);
    lastFocusedEl?.focus();
  }
  function trapTab(e){
    if (e.key !== "Tab") return;
    const nodes = Array.from(popup.querySelectorAll(focusable));
    if (!nodes.length) return;
    const first = nodes[0], last = nodes[nodes.length-1];
    if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  }
  function onEsc(e){ if (e.key === "Escape") closePopup(); }

  openBtns.forEach(b => b.addEventListener("click", (e)=>{ e.preventDefault(); openPopup(); }));
  closeBtn?.addEventListener("click", closePopup);
  popup?.addEventListener("click", (e)=>{ if (e.target === popup) closePopup(); });

  /* ====== GALLERIES (support multiple) ====== */
  const baseAurora = [
    "photography/aurora_1.jpg",
    "photography/aurora_2.jpg",
    "photography/aurora_3.jpg",
    "photography/aurora_4.jpg",
    "photography/aurora_5.jpg",
    "photography/aurora_6.jpg",
    "photography/aurora_7.jpg",
    "photography/aurora_8.jpg"
  ];

  // Load custom data from localStorage
  const store = JSON.parse(localStorage.getItem("ap_gallery_store") || '{"galleries":{}, "sections":[]}');
  const galleries = { aurora: [...baseAurora, ...(store.galleries?.aurora || [])] };

  // Render any custom sections
  const customWrap = document.getElementById("custom-hobbies");
  (store.sections || []).forEach(sec => {
    renderSection(sec);
  });

  // Update Aurora grid with any extra photos
  if (store.galleries?.aurora?.length){
    store.galleries.aurora.forEach((url, idx) => appendAuroraThumb(url, galleries.aurora.length - store.galleries.aurora.length + idx));
  }

  let activeGalleryKey = "aurora";
  let activeIndex = 0;

  window.openSlideshow = function(index, galleryKey="aurora"){
    activeGalleryKey = galleryKey;
    activeIndex = index;
    const img = document.getElementById("slideshow-image");
    const cont = document.getElementById("slideshow-container");
    const src = (galleries[activeGalleryKey] || [])[activeIndex];
    if (img && cont && src){
      img.src = src;
      cont.style.display = "flex";
      cont.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      document.body.classList.add("slideshow-open"); // hide FAB
      cont.focus();
      document.addEventListener("keydown", onSlideKey);
    }
  };
  window.closeSlideshow = function(){
    const cont = document.getElementById("slideshow-container");
    if (cont){
      cont.style.display = "none";
      cont.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      document.body.classList.remove("slideshow-open"); // restore FAB
      document.removeEventListener("keydown", onSlideKey);
    }
  };
  window.changePhoto = function(direction){
    const list = galleries[activeGalleryKey] || [];
    activeIndex = (activeIndex + direction + list.length) % list.length;
    const img = document.getElementById("slideshow-image");
    if (img) img.src = list[activeIndex];
  };
  function onSlideKey(e){
    if (e.key === "Escape") window.closeSlideshow();
    if (e.key === "ArrowRight") window.changePhoto(1);
    if (e.key === "ArrowLeft") window.changePhoto(-1);
  }

  function appendAuroraThumb(url, index){
    const grid = document.getElementById("aurora-grid");
    if (!grid) return;
    const btn = document.createElement("button");
    btn.className = "photo-thumb reveal";
    btn.addEventListener("click", () => openSlideshow(index, "aurora"));
    const img = document.createElement("img");
    img.className = "no-save";
    img.src = url;
    img.alt = "Aurora photo (added)";
    img.loading = "lazy";
    img.decoding = "async";
    btn.appendChild(img);
    grid.appendChild(btn);
    observer.observe(btn); // animate in
  }

  function renderSection(sec){
    const key = sec.key;
    galleries[key] = sec.photos || [];
    const block = document.createElement("div");
    block.className = "hobby-block";
    block.dataset.gallery = key;

    const h3 = document.createElement("h3");
    h3.className = "subhead reveal";
    h3.textContent = sec.title || "New Photography Set";

    const p = document.createElement("p");
    p.className = "subhead reveal";
    p.textContent = sec.desc || "";

    const grid = document.createElement("div");
    grid.className = "photo-grid";
    grid.id = `grid-${key}`;

    // Thumbs
    (sec.photos || []).forEach((url, i) => {
      const btn = document.createElement("button");
      btn.className = "photo-thumb reveal";
      btn.addEventListener("click", () => openSlideshow(i, key));
      const img = document.createElement("img");
      img.className = "no-save";
      img.src = url;
      img.alt = (sec.title || "Photo");
      img.loading = "lazy";
      img.decoding = "async";
      btn.appendChild(img);
      grid.appendChild(btn);
      observer.observe(btn);
    });

    block.appendChild(h3);
    block.appendChild(p);
    block.appendChild(grid);
    customWrap.appendChild(block);
    observer.observe(h3);
    observer.observe(p);

    // Add this section to the admin "target" select
    const sel = document.getElementById("photo-target");
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = sec.title || key;
    sel.appendChild(opt);
  }

  /* ====== ADMIN (+) quick add ====== */
  const fab = document.getElementById("fab-add");
  const adminModal = document.getElementById("admin-modal");
  const adminClose = document.getElementById("admin-close");
  const passStep = document.getElementById("admin-step-password");
  const actionStep = document.getElementById("admin-step-action");
  const passInput = document.getElementById("admin-pass");
  const passSubmit = document.getElementById("admin-pass-submit");
  const photoTarget = document.getElementById("photo-target");
  const photoUrl = document.getElementById("photo-url");
  const photoAlt = document.getElementById("photo-alt");
  const photoAddBtn = document.getElementById("photo-add");
  const sectionTitle = document.getElementById("section-title");
  const sectionDesc = document.getElementById("section-desc");
  const sectionAddBtn = document.getElementById("section-add");

  // Toggle panels by radio
  document.querySelectorAll('input[name="admin-action"]').forEach(r => {
    r.addEventListener("change", () => {
      const val = document.querySelector('input[name="admin-action"]:checked').value;
      document.getElementById("panel-photo").hidden = (val !== "photo");
      document.getElementById("panel-section").hidden = (val !== "section");
    });
  });

  function openAdmin(){
    adminModal.setAttribute("aria-hidden", "false");
    adminModal.style.display = "flex";
    document.body.style.overflow = "hidden";
    document.body.classList.add("admin-open"); // hide FAB
    passStep.hidden = false;
    actionStep.hidden = true;
    passInput.value = "";
    passInput.focus();
  }
  function closeAdmin(){
    adminModal.setAttribute("aria-hidden", "true");
    adminModal.style.display = "none";
    document.body.style.overflow = "";
    document.body.classList.remove("admin-open"); // restore FAB
  }

  fab?.addEventListener("click", openAdmin);
  adminClose?.addEventListener("click", closeAdmin);
  adminModal?.addEventListener("click", (e)=>{ if (e.target === adminModal) closeAdmin(); });

  passSubmit?.addEventListener("click", () => {
    if (passInput.value === ADMIN_PASSWORD){
      passStep.hidden = true;
      actionStep.hidden = false;
    } else {
      alert("Wrong password.");
      passInput.focus();
    }
  });

  // Add Photo
  photoAddBtn?.addEventListener("click", () => {
    const url = (photoUrl.value || "").trim();
    if (!url) return alert("Please enter an image URL.");
    const key = photoTarget.value;

    // Update store
    if (!store.galleries) store.galleries = {};
    if (!store.galleries[key]) store.galleries[key] = [];
    store.galleries[key].push(url);
    localStorage.setItem("ap_gallery_store", JSON.stringify(store));

    // Update in-memory galleries and DOM
    if (!galleries[key]) galleries[key] = [];
    galleries[key].push(url);

    if (key === "aurora"){
      appendAuroraThumb(url, galleries[key].length - 1);
    } else {
      const grid = document.getElementById(`grid-${key}`);
      if (grid){
        const idx = galleries[key].length - 1;
        const btn = document.createElement("button");
        btn.className = "photo-thumb reveal";
        btn.addEventListener("click", () => openSlideshow(idx, key));
        const img = document.createElement("img");
        img.className = "no-save";
        img.src = url;
        img.alt = photoAlt.value || "Photo";
        img.loading = "lazy"; img.decoding = "async";
        btn.appendChild(img);
        grid.appendChild(btn);
        observer.observe(btn);
      }
    }

    photoUrl.value = "";
    photoAlt.value = "";
    alert("Photo added!");
  });

  // Add Section
  sectionAddBtn?.addEventListener("click", () => {
    const title = (sectionTitle.value || "").trim();
    if (!title) return alert("Please enter a section title.");

    const key = "sec_" + title.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "").slice(0, 30);
    const desc = (sectionDesc.value || "").trim();

    const newSec = { key, title, desc, photos: [] };
    if (!store.sections) store.sections = [];
    store.sections.push(newSec);
    localStorage.setItem("ap_gallery_store", JSON.stringify(store));

    renderSection(newSec);

    sectionTitle.value = "";
    sectionDesc.value = "";
    // Switch the admin to "Add Photo" with target preselected to the new section
    document.querySelector('input[name="admin-action"][value="photo"]').checked = true;
    document.getElementById("panel-photo").hidden = false;
    document.getElementById("panel-section").hidden = true;
    photoTarget.value = key;

    alert("Section created! Now add photos to it.");
  });

  /* ====== Deter saving images: disable context menu & drag in galleries ====== */
  document.addEventListener("contextmenu", (e) => {
    if (e.target.closest(".photo-grid, .slideshow, .thumbs-grid")) {
      e.preventDefault();
    }
  });
  function blockDragOn(selector){
    document.querySelectorAll(selector).forEach(img => {
      img.addEventListener("dragstart", (ev) => ev.preventDefault());
    });
  }
  blockDragOn(".photo-grid img, #slideshow-image, .thumbs-grid img");

  /* ====== LIVE BACKGROUND CODE (looped typewriter) ====== */
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const codeTargets = [
    { el: document.getElementById("bg-code-1"), blocks: [
`SELECT region, SUM(revenue) AS total_revenue
FROM sales
WHERE date BETWEEN '2024-01-01' AND '2024-12-31'
GROUP BY region
ORDER BY total_revenue DESC;`,
`WITH churn AS (
  SELECT user_id, last_active, plan
  FROM users
  WHERE last_active < CURRENT_DATE - INTERVAL '30 DAY'
)
SELECT plan, COUNT(*) AS churned
FROM churn
GROUP BY plan
ORDER BY churned DESC;`
    ]},
    { el: document.getElementById("bg-code-2"), blocks: [
`df['variance'] = df['actual'] - df['forecast']
kpi = df.groupby('dept')['variance'].mean().round(2)
kpi.sort_values(ascending=False).head()`,
`import pandas as pd
roll = df['revenue'].rolling(window=7, min_periods=1).mean()
outliers = df[ (df['revenue'] - roll).abs() > 3*df['revenue'].std() ]`
    ]}
  ];

  if (!prefersReduced) {
    codeTargets.forEach(({el, blocks}) => typewriterLoop(el, blocks));
  } else {
    // Reduced motion: just show first blocks statically
    codeTargets.forEach(({el, blocks}) => { if (el) el.textContent = blocks[0]; });
  }

  function typewriterLoop(el, blocks){
    if (!el || !blocks?.length) return;
    let i = 0;
    (function next(){
      typeText(el, blocks[i], 14, 1200, () => {
        eraseText(el, 8, 500, () => {
          i = (i + 1) % blocks.length;
          setTimeout(next, 300);
        });
      });
    })();
  }
  function typeText(el, text, cps=14, hold=1200, done){
    el.textContent = "";
    let idx = 0;
    const step = () => {
      idx++;
      el.textContent = text.slice(0, idx);
      if (idx < text.length){ setTimeout(step, 1000/cps); }
      else { setTimeout(done, hold); }
    };
    step();
  }
  function eraseText(el, cps=8, hold=500, done){
    let current = el.textContent;
    const step = () => {
      current = current.slice(0, -1);
      el.textContent = current;
      if (current.length){ setTimeout(step, 1000/cps); }
      else { setTimeout(done, hold); }
    };
    step();
  }
});
