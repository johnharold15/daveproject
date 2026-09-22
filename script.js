/* ---------- Settings you can change ---------- */
const CONFIG = {
  snackLine: "(promise bilhan kita pagkain)",
  // Optional: paste a webhook/form endpoint (Formspree, Make, Zapier, etc.)
  // to receive the answers. Leave "" to keep everything on the page only.
  webhookUrl: ""
};

const DATE_OPTIONS = [
  { e: "", t: "Juans Cafe" }, { e: "", t: "TD streetfoods" }, {  t:"", t:"Buyco" },
  { e: "", t: "Pampang view" }, { e: "", t: "Binucot" }, { e: "", t: "Sanctuary" }
];
const PLACE_OPTIONS = [
  { e: "", t: "Surprise me!" }, { e: "", t: "We'll decide together" }
];
const NO_LINES = ["Sigurado kana ba?", "ISIPIN MO NG MABUTI", "Pinaka sure na?!", "Last chance!", "please ganda", "Ang sakit mo ha!!"];
const HINTS = ["", "sige na pls", "cute mo mag no pero ayoko", "bahala ka ", "mag yes kana kasi"];

/* ---------- Icons (inline SVG) ---------- */
const svg = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const ICON = {
  sparkle: svg('<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>'),
  heart: svg('<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" fill="currentColor"/>'),
  calendar: svg('<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>'),
  pin: svg('<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>'),
  chat: svg('<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.2A8.4 8.4 0 1 1 21 11.5z"/>'),
  check: svg('<path d="M20 6L9 17l-5-5"/>'),
  send: svg('<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/>')
};

const state = { date: null, place: null, contact: "" };
const card = document.getElementById("card");
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));


const screens = {
  intro() {
    card.innerHTML = `
      <div class="icon">${ICON.sparkle}</div>
      <h1>Hi Love, Happy Monthsarry</h1>
      <p class="body">‎happy 6th months of love, lovelove hehe, thankyou for your love, patience and efforts that you've done to me, grabe no dasig lang ang 6th months hamak mo kalating tuig dun ta since nga gig sagot mo ko HAHAH, kidding aside, thankyou sa tanan na pag palangga nimo sakun, aber salawayun ko and buig natitiis mo gihapon hehe, i hope when everything's okay, we're together pa, kasi kung hindi ipakulam ko gid  kung sino gapakadlaw saimonnga bukon ko, thankyou for understanding always may situation lovelove, abo gid na salamat sa imong pag palangga, iloveyouu always lovelove💋💋💋</p>
      <button class="cta" id="go">Open mo muna to →</button>`;
    card.querySelector("#go").onclick = () => go("ask");
  },

  ask() {
    card.innerHTML = `
      <div class="icon heart">${ICON.heart}</div>
      <h1>  Lalabas ba tayo?</h1>
      <p class="sub">${esc(CONFIG.snackLine)}</p>
      <div class="answers">
        <button class="yes" id="yes">OO</button>
        <button class="no" id="no">Hindi</button>
        <p class="hint" id="hint"></p>
      </div>`;
    const yes = card.querySelector("#yes"), no = card.querySelector("#no"), hint = card.querySelector("#hint");
    let tries = 0;

    const dodge = (e) => {
      if (e) e.preventDefault();
      tries++;
      no.textContent = NO_LINES[tries % NO_LINES.length];
      yes.style.transform = `scale(${Math.min(1 + tries * 0.28, 3.2)})`;   // Yes keeps growing
      no.style.transform = `translate(${rand(-90, 60)}px, ${rand(-10, 45)}px)`; // No runs away
      hint.textContent = HINTS[Math.min(Math.floor(tries / 2), HINTS.length - 1)];
    };
    no.addEventListener("pointerenter", dodge);
    no.addEventListener("click", dodge);
    yes.onclick = () => { burst(); go("yay"); };
  },

  yay() {
    card.innerHTML = `
      <div class="hearts">💖❤️💖</div>
      <h1 class="big">YAAAAY!!!</h1>
      <p class="body">You just made me the happiest person alive Love!!</p>
      <p class="sub">It's a date!</p>`;
    setTimeout(() => go("dateType"), 2600);
  },

  dateType() {
    card.innerHTML = `
      <div class="icon">${ICON.calendar}</div>
      <h1>What kind of date?</h1>
      <p class="sub">Pili ka, sayo ang araw nato!</p>
      <div class="grid">${DATE_OPTIONS.map((o, i) => `<button class="tile" data-i="${i}"><span class="e">${o.e}</span>${o.t}</button>`).join("")}</div>`;
    card.querySelectorAll(".tile").forEach((b) => b.onclick = () => { state.date = DATE_OPTIONS[b.dataset.i]; go("place"); });
  },

  place() {
    card.innerHTML = `
      <div class="icon">${ICON.pin}</div>
      <h1>Saan?</h1>
      // <p class="sub">Saang spot mo gusto, Dine in o Take out?</p>
      <div class="grid two">${PLACE_OPTIONS.map((o, i) => `<button class="tile" data-i="${i}"><span class="e">${o.e}</span>${o.t}</button>`).join("")}</div>`;
    card.querySelectorAll(".tile").forEach((b) => b.onclick = () => { state.place = PLACE_OPTIONS[b.dataset.i]; go("contact"); });
  },

  contact() {
    card.innerHTML = `
      <div class="icon">${ICON.chat}</div>
      <h1>Pano kita cocontact?</h1>
      <p class="sub">Share your phone number or social media!</p>
      <input class="field" id="contact" type="text" placeholder="Phone, Instagram, etc..." autocomplete="off" maxlength="120">
      <button class="cta send" id="send">Send ${ICON.send.replace("<svg", '<svg width="14" height="14" style="vertical-align:-2px"')}</button>`;
    const input = card.querySelector("#contact"), send = card.querySelector("#send");
    const submit = () => {
      
      const v = input.value.trim();
      if (!v) return;
      state.contact = v;
      sendToWebhook();
      burst();
      go("done");
    };
    input.addEventListener("input", () => send.classList.toggle("ready", input.value.trim().length > 0));
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") submit(); });
    send.onclick = submit;
    input.focus();
  },

  done() {
    card.innerHTML = `
      <div class="icon ok">${ICON.check}</div>
      <h1 class="ok">Perfect! 🎉</h1>
      <div class="summary">
        <div class="row"><span class="e">${state.date.e}</span><div><b>Date Type</b><span>${esc(state.date.t)}</span></div></div>
        <div class="row"><span class="e">${state.place.e}</span><div><b>Location</b><span>${esc(state.place.t)}</span></div></div>
        <div class="row"><span class="e">📱</span><div><b>Contact</b><span>${esc(state.contact)}</span></div></div>
      </div>
      <p class="body" style="margin-bottom:4px">I'll reach out to you soonLLove! </p>
      <p class="sub" style="margin-bottom:0">Can't wait for our date!Happy Monthsarry ulit </p>
      <button class="cta memories-button" id="playMemories">Click me to play our memories</button>
      <video class="memories-video" id="memoriesVideo" controls playsinline preload="metadata">
        <source src="daveee.mp4" type="video/mp4">
        Your browser does not support video playback.
      </video>
      <button class="link" id="again">Start over</button>`;
    const playMemories = card.querySelector("#playMemories");
    const memoriesVideo = card.querySelector("#memoriesVideo");
    playMemories.onclick = () => {
      playMemories.hidden = true;
      memoriesVideo.hidden = false;
      memoriesVideo.play();
    };
    card.querySelector("#again").onclick = () => { state.date = state.place = null; state.contact = ""; go("intro"); };
  }
};

/* ---------- Helpers ---------- */
const rand = (a, b) => Math.random() * (b - a) + a;
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

function go(name) {
  card.classList.add("out");
  setTimeout(() => {
    screens[name]();
    card.classList.remove("out");
    card.classList.remove("in"); void card.offsetWidth; card.classList.add("in");
  }, reduced ? 0 : 300);
}

async function sendToWebhook() {
  if (!CONFIG.webhookUrl) return;
  try {
    await fetch(CONFIG.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: state.date.t, place: state.place.t, contact: state.contact })
    });
  } catch (err) { console.error("Could not send answers:", err); }
}

const COLORS = ["#f9a8d4", "#fde68a", "#fda4af", "#c4b5fd", "#fdba74", "#f472b6"];

// slow background dots
(function ambient() {
  const wrap = document.getElementById("confetti");
  for (let i = 0; i < 26; i++) {
    const d = document.createElement("i"); d.className = "dot";
    const s = rand(5, 11);
    Object.assign(d.style, {
      width: s + "px", height: s + "px", left: rand(0, 100) + "vw", top: rand(0, 100) + "vh",
      background: COLORS[i % COLORS.length], animationDuration: rand(6, 14) + "s", animationDirection: "alternate"
    });
    wrap.appendChild(d);
  }
})();

// celebration burst
function burst() {
  if (reduced) return;
  const wrap = document.getElementById("confetti");
  for (let i = 0; i < 50; i++) {
    const p = document.createElement("i");
    Object.assign(p.style, {
      position: "absolute", left: "50%", top: "45%", width: rand(6, 10) + "px", height: rand(6, 10) + "px",
      background: COLORS[i % COLORS.length], borderRadius: Math.random() > .5 ? "50%" : "2px"
    });
    wrap.appendChild(p);
    const a = rand(0, Math.PI * 2), dist = rand(120, 380);
    p.animate([
      { transform: "translate(0,0) rotate(0)", opacity: 1 },
      { transform: `translate(${Math.cos(a) * dist}px, ${Math.sin(a) * dist + 120}px) rotate(${rand(180, 720)}deg)`, opacity: 0 }
    ], { duration: rand(900, 1600), easing: "cubic-bezier(.2,.7,.3,1)" }).onfinish = () => p.remove();
  }
}

screens.intro();