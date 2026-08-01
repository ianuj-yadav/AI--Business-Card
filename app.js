// Anuj Yadav — Warm Light Bento Portfolio & Interactive Utilities

const sendBtn = document.getElementById('sendBtn');
const userInput = document.getElementById('userInput');
const chatBox = document.getElementById('chatBox');

// 1. Hide preloader screen after wizard hat liquid fill animation completes
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1200);
    }
});

// 2. Custom Glowing Mouse Tracer
const cursor = document.getElementById('mouseCursor');
const follower = document.getElementById('mouseFollower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursor) {
        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;
    }
});

function animateCursor() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    if (follower) {
        follower.style.left = `${followerX}px`;
        follower.style.top = `${followerY}px`;
    }
    requestAnimationFrame(animateCursor);
}
animateCursor();

// 3. Toast Notification Helper
function copyToClipboard(text, message) {
    navigator.clipboard.writeText(text).then(() => {
        showToast(message || `Copied ${text} to clipboard!`);
    }).catch(err => {
        showToast(`Copied ${text}!`);
    });
}

function showToast(msg) {
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMessage');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = msg;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2800);
}

// 4. Interactive Project Filter Tabs
function filterProjects(category) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => btn.classList.remove('active'));

    event.target.classList.add('active');

    const projectCards = document.querySelectorAll('.lucid-project-card');
    projectCards.forEach(card => {
        if (category === 'all') {
            card.style.display = 'flex';
        } else if (category === 'ai' && card.classList.contains('cat-ai')) {
            card.style.display = 'flex';
        } else if (category === 'web' && card.classList.contains('cat-web')) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// 5. Fullscreen AI Studio Chatbot Toggle inside Bento Grid
function toggleFullScreenChat() {
    const chatCard = document.getElementById('ai-assistant');
    const icon = document.getElementById('expandIcon');
    if (!chatCard) return;

    chatCard.classList.toggle('fullscreen-chat-card');
    if (chatCard.classList.contains('fullscreen-chat-card')) {
        if (icon) icon.className = 'fas fa-compress-alt';
        document.body.style.overflow = 'hidden';
    } else {
        if (icon) icon.className = 'fas fa-expand-alt';
        document.body.style.overflow = 'auto';
    }
}

// Quick Prompt Question Trigger
function askQuestion(qText) {
    if (!userInput) return;
    userInput.value = qText;
    sendMessage();
}

// 6. 3D Card Parallax / Tilt Effect on Hover
document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const rotateX = (-y / rect.height) * 3;
        const rotateY = (x / rect.width) * 3;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
    });
});

// 7. Project Details & Screenshot Gallery Modal System
const projectData = {
    'noteshub': {
        icon: '📝',
        title: 'NotesHub Elite',
        subtitle: 'Complete Academic Study Materials Marketplace',
        github: 'https://github.com/ianuj-yadav/Notes-Elite-HUB.git',
        liveUrl: 'https://notes-elite-hub.vercel.app',
        description: 'NotesHub Elite is a full-featured academic marketplace platform enabling students to monetize their study notes and access peer-reviewed educational materials. Includes multi-page navigation, analytics dashboard, drag-and-drop note publishing, and responsive client-side session management.',
        features: [
            '✅ Complete user authentication system (Login & Registration flows)',
            '✅ Analytics dashboard with sales earnings & note view metrics',
            '✅ Advanced marketplace search with category & subject filters',
            '✅ Drag-and-drop file upload interface for uploading notes',
            '✅ Responsive design optimized for desktop, tablet, and mobile',
            '✅ Offline client-side session storage & shopping cart checkout'
        ],
        tech: ['Node.js', 'Express.js', 'PostgreSQL', 'JavaScript (ES6+)', 'HTML5', 'CSS3 Custom Props'],
        slides: [
            'images/noteshub/slide1.png',
            'images/noteshub/slide2.png',
            'images/noteshub/slide3.png'
        ]
    },
    'tdlgpt': {
        icon: '🤖',
        title: 'TDL Enterprise Assistant (TDL-GPT)',
        subtitle: 'Principal Engineer AI for Tally Definition Language (TDL)',
        github: 'https://github.com/ianuj-yadav/TDL-gpt.git',
        liveUrl: 'https://tdl-gpt.vercel.app/',
        description: 'TDL Enterprise Assistant (TDL-GPT) is a state-of-the-art domain-specific AI assistant and RAG platform designed exclusively for Tally Definition Language (TDL 4GL). Built to eliminate AI hallucinations via Tier 3 Hybrid RAG retrieval, AST Hierarchy Validation, and Permanent Teaching Memory.',
        features: [
            '🧠 Tier 3 Hybrid RAG (FAISS Dense Vector + BM25 Lexical Search + RRF Fusion)',
            '🛡️ Autonomous AST Hierarchy Guardrails (Report ➔ Form ➔ Part ➔ Line ➔ Field)',
            '⚡ Adaptive Generation Auto-Tuning (Deterministic code vs Creative architect modes)',
            '🗃️ Universal KB Source Extraction (FAISS indexing for .tdl, .pdf, .docx, compiled strings)',
            '🧠 Permanent User Teaching Memory (Remembers developer overrides permanently)',
            '🧪 10-Phase Automated Test Suite (RAG retrieval, hierarchy validation & memory tests)'
        ],
        tech: ['Python', 'FastAPI', 'React (Vite)', 'FAISS & BM25 RAG', 'NVIDIA NIM API', 'SentenceTransformers'],
        slides: [
            'images/tdlgpt/slide1.png',
            'images/tdlgpt/slide2.png',
            'images/tdlgpt/slide3.png',
            'images/tdlgpt/slide4.png'
        ]
    },
    'visualdsa': {
        icon: '📊',
        title: 'Visual DSA Algorithm',
        subtitle: 'Interactive Data Structures & Algorithm Visualizer',
        github: 'https://github.com/ianuj-yadav/Visual-Dsa-Algorithm.git',
        description: 'An interactive web visualizer for complex Data Structures and Algorithms including sorting algorithms, graph traversals (BFS/DFS), and dynamic programming step-by-step executions.',
        features: [
            '✅ Step-by-step execution control (Play, Pause, Speed adjustment)',
            '✅ Visual array sorting comparisons (QuickSort, MergeSort, HeapSort)',
            '✅ Graph node animation & pathfinding visualization'
        ],
        tech: ['Python', 'JavaScript (ES6)', 'HTML5 Canvas', 'CSS3 Animations'],
        slides: []
    },
    'workbench': {
        icon: '⚡',
        title: 'Anuj Yadav — Personal AI Workbench',
        subtitle: 'Human-Crafted Full-Page Bento Layout AI Studio',
        github: 'https://github.com/ianuj-yadav/AI-Workbench.git',
        description: 'Personal AI Workbench is a clean, human-crafted full-page Bento workbench designed and engineered by Anuj Yadav. Built with thoughtful typography, responsive full-page Obsidian layouts (#18181b), Pistachio & Lime accents (#dcf865), natural everyday conversational answering, and zero-exposure API security.',
        features: [
            '🎨 Human-Crafted Full-Page Bento Layout (Expansive edge-to-edge experience with Pistachio & Lime accents)',
            '💬 Natural Conversational Assistant (Preloaded with greetings, FAQ notes synthesis & open-domain responses)',
            '📊 Activity Overview Analytics (Words processed, saved notes distribution & clarity index tracking)',
            '⚡ 62ms Ultra-Fast Response Engine (Fast & smooth local session answering)',
            '🔐 Zero-Exposure Security (Private, self-contained architecture with zero exposed API keys)'
        ],
        tech: ['React 18', 'Vite 5', 'Node.js', 'Bento UI Grid', 'TailwindCSS', 'JavaScript (ES6+)'],
        slides: [
            'images/workbench/slide1.png'
        ]
    },
    'portfolio': {
        icon: '💼',
        title: 'Portfolio Pro (3D Cybernetic Portfolio)',
        subtitle: 'High-Performance 3D Interactive Cybernetic Developer Showcase',
        github: 'https://github.com/ianuj-yadav/Anuj-Portfolio.git',
        liveUrl: 'https://anuj-portfolio-eight-drab.vercel.app/',
        description: 'Anuj Portfolio Pro is a high-performance 3D interactive developer portfolio built with React 18, Vite 5, Three.js WebGL, GSAP ScrollTrigger, and Lenis Smooth Scroll. Features real-time AI assistant integration, interactive 3D particle stage, matrix terminal loading, and keyboard-driven command palette.',
        features: [
            '🤖 Real-Time AI Assistant — Sandra AI (Gemini 2.0 Live API & bidirectional audio streaming)',
            '🌀 3D Igloo Particle Stage & Morphing Swarm (3,500 WebGL particles morphing per tab)',
            '📜 Matrix Terminal Bio & 4-Category Core Tech Matrix (AI, Languages, Web & Cloud)',
            '💼 Interactive Project Case Study Explorer (7 production dossiers with visual switcher)',
            '⌨️ Cybernetic Command Palette (Ctrl+K / Cmd+K instant global search modal)'
        ],
        tech: ['React 18', 'Vite 5', 'Three.js (WebGL)', 'GSAP ScrollTrigger', 'Lenis Scroll', 'TailwindCSS', 'Gemini 2.0 API'],
        slides: [
            'images/portfolio/slide1.png',
            'images/portfolio/slide2.png',
            'images/portfolio/slide3.png',
            'images/portfolio/slide4.png',
            'images/portfolio/slide5.png'
        ]
    }
};

let currentProjectId = null;
let currentSlideIndex = 0;

function openProjectModal(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    currentProjectId = projectId;
    currentSlideIndex = 0;

    document.getElementById('modalProjectIcon').textContent = data.icon || '📝';
    document.getElementById('modalProjectTitle').textContent = data.title;
    document.getElementById('modalProjectSubtitle').textContent = data.subtitle;
    document.getElementById('modalDescription').textContent = data.description;
    
    // GitHub link
    const ghBtn = document.getElementById('modalGithubLink');
    if (data.github) {
        ghBtn.href = data.github;
        ghBtn.style.display = 'inline-flex';
    } else {
        ghBtn.style.display = 'none';
    }

    // Live link
    const liveBtn = document.getElementById('modalLiveLink');
    if (data.liveUrl) {
        liveBtn.href = data.liveUrl;
        liveBtn.style.display = 'inline-flex';
    } else {
        liveBtn.style.display = 'none';
    }

    // Features List
    const featList = document.getElementById('modalFeaturesList');
    featList.innerHTML = '';
    data.features.forEach(feat => {
        const li = document.createElement('li');
        li.textContent = feat;
        featList.appendChild(li);
    });

    // Tech Badges
    const techContainer = document.getElementById('modalTechBadges');
    techContainer.innerHTML = '';
    data.tech.forEach(t => {
        const span = document.createElement('span');
        span.className = 'modal-tech-badge';
        span.textContent = t;
        techContainer.appendChild(span);
    });

    // Update Carousel & Toggle Visibility
    const carouselSec = document.querySelector('.modal-carousel-section');
    if (data.slides && data.slides.length > 0) {
        if (carouselSec) carouselSec.style.display = 'flex';
        updateSlide();
    } else {
        if (carouselSec) carouselSec.style.display = 'none';
    }

    // Show Modal
    const modal = document.getElementById('projectModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function updateSlide() {
    const data = projectData[currentProjectId];
    if (!data || !data.slides || data.slides.length === 0) return;

    const imgEl = document.getElementById('modalCarouselImage');
    const counterEl = document.getElementById('carouselCounter');

    imgEl.style.opacity = 0;
    setTimeout(() => {
        imgEl.src = data.slides[currentSlideIndex];
        imgEl.style.opacity = 1;
    }, 150);

    counterEl.textContent = `Slide ${currentSlideIndex + 1} of ${data.slides.length}`;
}

function nextSlide() {
    const data = projectData[currentProjectId];
    if (!data || !data.slides) return;
    currentSlideIndex = (currentSlideIndex + 1) % data.slides.length;
    updateSlide();
}

function prevSlide() {
    const data = projectData[currentProjectId];
    if (!data || !data.slides) return;
    currentSlideIndex = (currentSlideIndex - 1 + data.slides.length) % data.slides.length;
    updateSlide();
}

// Keyboard shortcuts for modal
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('projectModal');
    if (modal && modal.classList.contains('active')) {
        if (e.key === 'Escape') closeProjectModal();
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
    }
});

// 8. Three.js Ambient Warm Star & Sparkle Scene
function initThreeCosmicScene() {
    const canvas = document.getElementById('cosmicCanvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 400;

    const particleCount = 650;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorOrange = new THREE.Color('#EA580C');
    const colorEmerald = new THREE.Color('#059669');
    const colorAmber = new THREE.Color('#D97706');

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 1000;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 1000;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 1000;

        const rand = Math.random();
        const mixColor = rand > 0.6 ? colorOrange : (rand > 0.3 ? colorEmerald : colorAmber);
        colors[i * 3] = mixColor.r;
        colors[i * 3 + 1] = mixColor.g;
        colors[i * 3 + 2] = mixColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 3.0,
        vertexColors: true,
        transparent: true,
        opacity: 0.65,
        blending: THREE.NormalBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    let targetX = 0, targetY = 0;

    document.addEventListener('mousemove', (e) => {
        targetX = (e.clientX - window.innerWidth / 2) * 0.04;
        targetY = (e.clientY - window.innerHeight / 2) * 0.04;
    });

    function renderScene() {
        particles.rotation.y += 0.0008;
        particles.rotation.x += 0.0004;

        camera.position.x += (targetX - camera.position.x) * 0.04;
        camera.position.y += (-targetY - camera.position.y) * 0.04;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
        requestAnimationFrame(renderScene);
    }

    renderScene();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

initThreeCosmicScene();

// 9. AI Wingman System Prompt
const systemPrompt = `You are Anuj Yadav's ultra-cool, witty, and charismatic AI Avatar ⚡
You speak with charm, humor, tech-savviness, and punchy enthusiasm that entertains visitors!

Key Facts about Anuj Yadav:
- 🎓 Education: B.Tech Computer Science & Engineering @ Amity University, Noida (Expected Aug 2027, CGPA: 7.89/10).
- 💼 Current Role: AI & Software Developer Intern at Binarysoft Technologies (building customizable AI chatbots, TDL code gen, Image-to-Text, market data generators).
- 📊 Past Roles: Data Analyst Virtual Intern at Deloitte (Power BI & forensic analytics) & Educational Support Intern at Serving Nicely Foundation (NGO).
- 💻 Tech Arsenal: Java, Python, C++, Node.js, Express, React, PostgreSQL, REST APIs, AWS, Azure, GenAI, Prompt Engineering.
- 🚀 Star Projects:
  1. Notes-Elitehub (Complete academic marketplace, PostgreSQL schema, full RESTful CRUD, user dashboards & drag-drop publishing)
  2. TDL GPT (AI Chatbot & RAG system generating Tally 4GL non-procedural code, Tier 3 RAG, AST hierarchy validator)
  3. Visual DSA Algorithm (Interactive DSA visualizer with Python backend)
  4. Personal AI Workbench (Human-crafted Bento layout AI Studio, 62ms response time, zero exposure security)
  5. Portfolio Pro (3D Cybernetic Interactive Portfolio with Sandra AI Gemini 2.0, WebGL particle swarm, matrix loader, & command palette)
- 🏆 Flex & Honors: AWS ML & GenAI Certifications, Anthropic AI Fluency, Apna College DSA with Java, 2nd Rank in Science Olympiad, Active Open Source Contributor at ELUSOC.
- 🎨 Vibe & Hobbies: Creative writing & poetic expressions, competitive gaming, literature, music, and turning caffeine into clean code. New Delhi, India.

Your Tone & Style Rules:
- Be witty, playful, smart, and entertaining! Use fun emojis 🚀✨
- Keep answers short and punchy (2 brief paragraphs max).
- End EVERY response with a fun interactive follow-up question inviting the visitor to explore more!
- Stay strictly in character as Anuj's AI wingman. Direct unrelated questions back to Anuj with a funny twist.`;

// 10. Add message & send message handler
function addMessage(text, type) {
    if (!chatBox) return;
    const msg = document.createElement('div');
    msg.classList.add('message', type);
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
    return msg;
}

async function sendMessage() {
    if (!userInput) return;
    const message = userInput.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    userInput.value = '';
    if (sendBtn) sendBtn.disabled = true;

    const loadingMsg = addMessage('⚡ Summoning AI wisdom...', 'loading');

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, systemPrompt })
        });

        const data = await response.json();
        chatBox.removeChild(loadingMsg);
        
        if (data.reply) {
            addMessage(data.reply, 'bot');
        } else {
            addMessage('Received unexpected response from server.', 'bot');
        }

    } catch (error) {
        if (loadingMsg && loadingMsg.parentNode) chatBox.removeChild(loadingMsg);
        console.error('Chat API Error:', error);
        addMessage(`Connection error: ${error.message || 'Server unavailable'}.`, 'bot');
    }

    if (sendBtn) sendBtn.disabled = false;
}

if (sendBtn) sendBtn.addEventListener('click', sendMessage);
if (userInput) userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});