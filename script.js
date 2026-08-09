// ── Grid canvas animation ──
const canvas = document.getElementById('grid');
const ctx = canvas.getContext('2d');
let W, H, dots = [];

function resize() {
  W = canvas.width = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
  dots = [];
  const cols = Math.floor(W / 60), rows = Math.floor(H / 60);
  for (let i = 0; i <= cols; i++) for (let j = 0; j <= rows; j++) {
    dots.push({ x: i*(W/cols), y: j*(H/rows), vx: (Math.random()-.5)*.3, vy: (Math.random()-.5)*.3 });
  }
}
resize();
window.addEventListener('resize', resize);

let mx = -999, my = -999;
document.getElementById('hero').addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function draw() {
  ctx.clearRect(0, 0, W, H);
  dots.forEach(d => {
    d.x += d.vx; d.y += d.vy;
    if (d.x < 0 || d.x > W) d.vx *= -1;
    if (d.y < 0 || d.y > H) d.vy *= -1;
  });
  dots.forEach((a, i) => {
    dots.forEach((b, j) => {
      if (j <= i) return;
      const dx = a.x - b.x, dy = a.y - b.y, dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 90) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(37,99,235,${(1 - dist / 90) * .2})`;
        ctx.lineWidth = .7;
        ctx.stroke();
      }
    });
    const mdx = a.x - mx, mdy = a.y - my, md = Math.sqrt(mdx*mdx + mdy*mdy);
    const r = md < 100 ? 3 : 1.5;
    const col = md < 100 ? 'rgba(8,145,178,0.7)' : 'rgba(37,99,235,0.3)';
    ctx.beginPath();
    ctx.arc(a.x, a.y, r, 0, Math.PI * 2);
    ctx.fillStyle = col;
    ctx.fill();
  });
  requestAnimationFrame(draw);
}
draw();

// ── Nav scroll ──
window.addEventListener('scroll', () => {
  document.getElementById('navbar').style.background =
    window.scrollY > 40 ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.92)';
});

// ── Mobile menu ──
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

// ── Step toggle ──
function activateStep(el) {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
}

// ── Fade-in on scroll ──
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: .1 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ── Form submit ──
function submitForm() {
  document.getElementById('contactForm').style.display = 'none';
  document.getElementById('formSuccess').style.display = 'block';
}


const chatToggle = document.getElementById("chatToggle");
const chatWidget = document.getElementById("chatWidget");

chatToggle.addEventListener("click", toggleChat);

function toggleChat() {
    if (chatWidget.style.display === "block") {
        chatWidget.style.display = "none";
    } else {
        chatWidget.style.display = "block";
    }
}

let step = 0;

const lead = {
    name: "",
    phone: "",
    email: ""
};

window.onload = () => {
    addBot("Hi 👋 Welcome!");
    addBot("What is your name?");
};

function addBot(text) {
    const box = document.getElementById("chatBox");

    box.innerHTML += `
        <div class="bot-message">${text}</div>
    `;

    box.scrollTop = box.scrollHeight;
}

function addUser(text) {
    const box = document.getElementById("chatBox");

    box.innerHTML += `
        <div class="user-message">${text}</div>
    `;

    box.scrollTop = box.scrollHeight;
}

function sendMessage() {

    const input = document.getElementById("message");
    const text = input.value.trim();

    if (!text) return;

    addUser(text);

    if (step === 0) {
        lead.name = text;
        addBot("Please enter your phone number.");
        step++;
    }

    else if (step === 1) {
        lead.phone = text;
        addBot("Please enter your email address.");
        step++;
    }

    else if (step === 2) {
        lead.email = text;

        console.log("Lead Data:", lead);

        addBot("Thank you! Ask anything about our company.");
        step++;
    }

    else {

        addBot("Searching our company information...");

        setTimeout(() => {

            const query = encodeURIComponent(text);

            window.open(
                "https://www.google.com/" + query,
                "_blank"
            );

        }, 1000);
    }

    input.value = "";
}

document.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});