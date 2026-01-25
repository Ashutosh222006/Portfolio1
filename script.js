// =========================================================
//  FINAL SCRIPT.JS (Smart Bot + Contact + 3D Bg - NO GATE)
// =========================================================

// --- 1. REAL 3D BACKGROUND (Three.js) ---
const canvas = document.querySelector('#bg-3d');

if (canvas) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1200;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 5; // Spread particles
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.005,
        color: '#818cf8',
        transparent: true,
        opacity: 0.8,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    camera.position.z = 2;

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX / window.innerWidth - 0.5;
        mouseY = event.clientY / window.innerHeight - 0.5;
    });

    function animate() {
        requestAnimationFrame(animate);
        particlesMesh.rotation.y += 0.001 + mouseX * 0.05;
        particlesMesh.rotation.x += 0.0005 + mouseY * 0.05;
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// --- 2. TILT EFFECT FOR CARDS (Desktop Only) ---
if (window.innerWidth > 768) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });
}

// --- 3. SCROLL REVEAL ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { 
        if (entry.isIntersecting) {
            entry.target.classList.add('visible'); 
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// --- 4. FAQ TOGGLE ---
function toggleFaq(element) {
    const isActive = element.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    if (!isActive) {
        element.classList.add('active');
    }
}

// --- 5. MOBILE MENU ---
const hamburger = document.getElementById('hamburger-menu');
const navLinks = document.getElementById('nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        if (navLinks.style.display === 'flex') {
            navLinks.style.display = 'none';
        } else {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '70px';
            navLinks.style.right = '0';
            navLinks.style.background = 'rgba(5,5,5,0.95)';
            navLinks.style.width = '100%';
            navLinks.style.padding = '2rem';
        }
    });
}

// --- 6. CONTACT FORM (SIMPLE MAILTO) ---
function sendMail(e) {
    e.preventDefault(); 
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const subject = `Portfolio Contact from ${name}`;
    const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;
    window.location.href = `mailto:pvcashu22@gmail.com?subject=${subject}&body=${body}`;
    alert("Email App Opening... 🚀");
    document.querySelector('.contact-form').reset();
}

// --- 7. OFFLINE SMART CHATBOT (NO GATE INFO) ---
const chatToggle = document.getElementById('chat-toggle');
const chatbot = document.getElementById('chatbot');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

if (chatToggle) {
    chatToggle.addEventListener('click', () => {
        chatbot.classList.toggle('show');
        if (chatMessages.children.length === 0) {
            appendMessage("Hi! I am Ashutosh's AI Assistant. 🤖<br>Ask me about <b>Projects</b>, <b>Trading</b>, <b>Skills</b> or just say Hello!", 'bot-message');
        }
    });
}

if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && chatInput.value.trim() !== "") {
            const userMsg = chatInput.value.trim();
            appendMessage(userMsg, 'user-message');
            chatInput.value = "";
            
            setTimeout(() => {
                const botReply = getSmartReply(userMsg);
                appendMessage(botReply, 'bot-message');
            }, 600);
        }
    });
}

function appendMessage(msg, type) {
    const div = document.createElement('div');
    div.className = `chat-message ${type}`;
    div.innerHTML = msg;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// --- THE SMART BRAIN (LOGIC) ---
function getSmartReply(text) {
    text = text.toLowerCase();

    // 1. Greetings
    if (text.includes("hello") || text.includes("hi") || text.includes("hey")) 
        return "Hello ji! 👋 Kaise ho? Ashutosh ke projects dekhne hain ya trading ki baatein karni hain?";
    
    if (text.includes("kaise ho") || text.includes("how are you")) 
        return "Main ekdum First Class! 💻 Ashutosh code likh raha hai, main jawab de raha hoon.";

    // 2. Identity (Ashutosh)
    if (text.includes("who is ashutosh") || text.includes("about")) 
        return "Ashutosh Shukla is a **Final Year B.Tech CSE Student** 🎓, Gen AI Developer, and a smart Trader. 9.6 SGPA holder hai banda! 😎";

    // 3. Projects
    if (text.includes("project") || text.includes("work")) 
        return "Usne kaafi tagde projects banaye hain: <br>1. **Portfolio** (portfolio) 🤖<br>2. **Festivo** (College Fest App) 🎉<br>3. **Currency Tracker** 💱";

    // 4. Skills
    if (text.includes("skill") || text.includes("know") || text.includes("tech")) 
        return "He works with **Python, Java, C**, and **Gen AI**. Web Development mein bhi haath saaf hai! 💻";

    // 5. Trading
    if (text.includes("trade") || text.includes("trading") || text.includes("stock") || text.includes("money")) 
        return "Trading uska easy skill hai! 📈 swing trading karta hai. 🤑";

    // 6. Contact
    if (text.includes("contact") || text.includes("email") || text.includes("phone")) 
        return "Aap usse email kar sakte ho: **pvcashu22@gmail.com** 📧";

    // 7. Fun/Jokes
    if (text.includes("joke") || text.includes("masti")) 
        return "Why do programmers prefer dark mode? <br>Because light attracts bugs! 🐛😂";

    // Default Fallback
    return "Arre sorry, mujhe ye samajh nahi aaya. 😅 <br>Aap **Projects**, **Skills**, ya **Trading** ke baare mein puchiye!";
}

// --- 8. TYPING EFFECT (NO GATE ASPIRANT) ---
const words = [
    "Computer Science Student", 
    "Gen AI Developer", 
    "Python & Java Coder"
];
let i = 0;
let timer;

function typeWriter() {
    const heading = document.getElementById("typewriter");
    if (!heading) return;
    const word = words[i];
    let currentText = heading.textContent;
    if (!heading.classList.contains("deleting")) {
        if (currentText.length < word.length) {
            heading.textContent = word.substring(0, currentText.length + 1);
            timer = setTimeout(typeWriter, 100);
        } else {
            heading.classList.add("deleting");
            timer = setTimeout(typeWriter, 2000);
        }
    } else {
        if (currentText.length > 0) {
            heading.textContent = word.substring(0, currentText.length - 1);
            timer = setTimeout(typeWriter, 50);
        } else {
            heading.classList.remove("deleting");
            i = (i + 1) % words.length;
            timer = setTimeout(typeWriter, 500);
        }
    }
}
document.addEventListener('DOMContentLoaded', typeWriter);







// --- ULTRA WOW: REMOVE BOOT SCREEN ---
window.addEventListener('load', () => {
    const bootScreen = document.getElementById('boot-screen');
    
    // 3 Second baad screen hatao
    setTimeout(() => {
        bootScreen.style.transition = "opacity 0.8s ease-out";
        bootScreen.style.opacity = "0";
        
        setTimeout(() => {
            bootScreen.style.display = "none";
        }, 800);
        
    }, 2800); // Animation time se match kiya
});

// --- HEADER WOW: SCROLL PROGRESS BAR ---
window.addEventListener('scroll', () => {
    const scrollProgress = document.querySelector('.scroll-progress');
    
    // Page ki total height calculate karo
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    
    // Kitna scroll kiya (percentage mein)
    const progress = (window.scrollY / totalHeight) * 100;
    
    // Width update karo
    if (scrollProgress) {
        scrollProgress.style.width = progress + '%';
    }
});