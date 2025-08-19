// Theme Toggle
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

function setTheme(theme) {
    body.classList.toggle('light-mode', theme === 'light');
    themeToggle.querySelector('.theme-icon').textContent = theme === 'light' ? '☀️' : '🌙';
    localStorage.setItem('theme', theme);
}

themeToggle.addEventListener('click', () => {
    const currentTheme = body.classList.contains('light-mode') ? 'dark' : 'light';
    setTheme(currentTheme);
});

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

// Custom cursor
const cursor = document.querySelector('.cursor');
const trails = [];

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX - 10 + 'px';
    cursor.style.top = e.clientY - 10 + 'px';
    
    // Create trailing effect
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.left = e.clientX - 3 + 'px';
    trail.style.top = e.clientY - 3 + 'px';
    document.body.appendChild(trail);
    
    trails.push(trail);
    
    setTimeout(() => {
        trail.remove();
        trails.shift();
    }, 300);
});

// Particle system reacting to mouse
const particlesContainer = document.getElementById('particles');
const particles = [];

function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particlesContainer.appendChild(particle);
    particles.push(particle);
    
    setTimeout(() => {
        particle.remove();
        particles.shift();
    }, 6000);
}

document.addEventListener('mousemove', (e) => {
    if (Math.random() < 0.2) {
        createParticle(e.clientX, e.clientY);
    }
});

// Matrix rain effect
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = [];

for (let i = 0; i < columns; i++) {
    drops[i] = 1;
}

function drawMatrix() {
    ctx.fillStyle = body.classList.contains('light-mode') ? 'rgba(230, 247, 242, 0.04)' : 'rgba(10, 10, 10, 0.04)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#00ff88';
    ctx.font = fontSize + 'px monospace';
    
    for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 35);

// Typing effect
const typingElement = document.getElementById('typing');
const commands = [
    'git status',
    'npm start',
    'docker build .',
    'python train_model.py',
    'dotnet run',
    'echo "IMS Praktikum 2026 gesucht!"',
    'ls projekte/',
    'cat cv.txt',
    'cargo run',
    'git push origin main',
    'echo "Kantonsschule Baden"',
    'cat praktikum_anforderungen.txt'
];
let commandIndex = 0;
let charIndex = 0;

function typeCommand() {
    if (charIndex < commands[commandIndex].length) {
        typingElement.textContent += commands[commandIndex].charAt(charIndex);
        charIndex++;
        setTimeout(typeCommand, 100);
    } else {
        setTimeout(() => {
            typingElement.textContent = '';
            charIndex = 0;
            commandIndex = (commandIndex + 1) % commands.length;
            typeCommand();
        }, 2000);
    }
}

typeCommand();

// Skills radar chart with tooltips
const skillsCanvas = document.getElementById('skillsCanvas');
const skillsCtx = skillsCanvas.getContext('2d');
const centerX = 200;
const centerY = 200;
const maxRadius = 150;

const skills = [
    { name: 'C#', level: 90, angle: 0, description: 'Expert in building robust applications with C# and .NET.' },
    { name: 'JavaScript', level: 85, angle: Math.PI / 3, description: 'Proficient in modern JavaScript and frameworks like React.' },
    { name: 'Python', level: 80, angle: 2 * Math.PI / 3, description: 'Skilled in Python for AI, ML, and game development.' },
    { name: '.NET', level: 85, angle: Math.PI, description: 'Experienced with .NET for enterprise applications.' },
    { name: 'HTML/CSS', level: 95, angle: 4 * Math.PI / 3, description: 'Mastery in creating responsive and modern UI.' },
    { name: 'Machine Learning', level: 60, angle: 5 * Math.PI / 3, description: 'Knowledgeable in ML algorithms and TensorFlow.' }
];

function drawSkillsRadar() {
    skillsCtx.clearRect(0, 0, 400, 400);
    
    // Draw radar grid
    skillsCtx.strokeStyle = body.classList.contains('light-mode') ? '#999' : '#333';
    skillsCtx.lineWidth = 1;
    
    for (let i = 1; i <= 5; i++) {
        skillsCtx.beginPath();
        skillsCtx.arc(centerX, centerY, (maxRadius / 5) * i, 0, 2 * Math.PI);
        skillsCtx.stroke();
    }
    
    // Draw radar lines
    skills.forEach(skill => {
        skillsCtx.beginPath();
        skillsCtx.moveTo(centerX, centerY);
        skillsCtx.lineTo(
            centerX + Math.cos(skill.angle) * maxRadius,
            centerY + Math.sin(skill.angle) * maxRadius
        );
        skillsCtx.stroke();
    });
    
    // Draw skill levels
    skillsCtx.fillStyle = 'rgba(0, 255, 136, 0.3)';
    skillsCtx.strokeStyle = '#00ff88';
    skillsCtx.lineWidth = 2;
    
    skillsCtx.beginPath();
    skills.forEach((skill, index) => {
        const radius = (skill.level / 100) * maxRadius;
        const x = centerX + Math.cos(skill.angle) * radius;
        const y = centerY + Math.sin(skill.angle) * radius;
        
        if (index === 0) {
            skillsCtx.moveTo(x, y);
        } else {
            skillsCtx.lineTo(x, y);
        }
    });
    skillsCtx.closePath();
    skillsCtx.fill();
    skillsCtx.stroke();
    
    // Draw skill points and labels
    skillsCtx.fillStyle = '#00ff88';
    skillsCtx.font = '12px JetBrains Mono';
    skills.forEach(skill => {
        const radius = (skill.level / 100) * maxRadius + 10;
        const x = centerX + Math.cos(skill.angle) * radius;
        const y = centerY + Math.sin(skill.angle) * radius;
        skillsCtx.fillText(skill.name, x, y);
    });
}

drawSkillsRadar();

// Skill tooltip interaction
const tooltip = document.getElementById('skillTooltip');
skillsCanvas.addEventListener('mousemove', (e) => {
    const rect = skillsCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    let foundSkill = null;
    skills.forEach(skill => {
        const radius = (skill.level / 100) * maxRadius;
        const skillX = centerX + Math.cos(skill.angle) * radius;
        const skillY = centerY + Math.sin(skill.angle) * radius;
        const distance = Math.sqrt((x - skillX) ** 2 + (y - skillY) ** 2);
        
        if (distance < 10) {
            foundSkill = skill;
        }
    });
    
    if (foundSkill) {
        tooltip.style.left = `${e.clientX + 10}px`;
        tooltip.style.top = `${e.clientY + 10}px`;
        tooltip.textContent = `${foundSkill.name}: ${foundSkill.description}`;
        tooltip.style.opacity = '1';
    } else {
        tooltip.style.opacity = '0';
    }
});

skillsCanvas.addEventListener('mouseout', () => {
    tooltip.style.opacity = '0';
});

// Scroll progress bar
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    document.querySelector('.progress-bar').style.width = scrollPercent + '%';
    
    // Fade-in animation for sections
    document.querySelectorAll('.fade-in').forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
            section.classList.add('visible');
        }
    });
});

// Smooth scroll for nav links
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        targetElement.scrollIntoView({ behavior: 'smooth' });
        if (window.innerWidth <= 768) {
            document.querySelector('.nav-links').classList.remove('active');
        }
    });
});

// Hamburger menu toggle
document.querySelector('.hamburger').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Project modal
const projectData = {
    icontale: {
        title: '🎮 IconTale',
        description: 'Eine interaktive Emoji-Story-Plattform, die Kreativität und Spielspaß verbindet. Spieler können kreative Geschichten mit Emojis schreiben und diese von anderen erraten lassen. Das Projekt demonstriert moderne Web-Entwicklung mit Echtzeit-Kommunikation und benutzerfreundlicher Oberfläche.',
        features: [
            'Lobby-System für Multiplayer-Spiele',
            'Echtzeit-WebSocket-Kommunikation',
            'Emoji-basierte Story-Erstellung',
            'Voting-System für die besten Geschichten',
            'Responsive Design für alle Geräte'
        ],
        github: 'https://github.com/arvinka23/icontale',
        demo: 'https://icontale.onrender.com/',
        status: 'Live'
    },
    fitness: {
        title: '💪 FitnessTracker',
        description: 'Eine umfassende C# Desktop-Anwendung für Fitness-Tracking und -Management. Das Projekt zeigt fortgeschrittene Software-Entwicklung mit Datenbankintegration, Benutzeroberfläche-Design und Datenvisualisierung.',
        features: [
            'Workout-Protokollierung mit Übungen, Gewicht und Wiederholungen',
            'Körpermaße-Verfolgung mit Verlaufsdiagrammen',
            'Trainingsplan-Erstellung und -Verwaltung',
            'Entity Framework Core für Datenbankzugriff',
            'WinForms-Benutzeroberfläche mit Charts'
        ],
        github: 'https://github.com/arvinka23/Fitnesstracker',
        demo: null,
        status: 'In Entwicklung'
    },
    solana: {
        title: '🤖 Rust Solana Bot',
        description: 'Ein fortschrittlicher Trading-Bot für die Solana-Blockchain, entwickelt in Rust. Das Projekt demonstriert Blockchain-Integration, automatisierte Handelsstrategien und Echtzeit-Datenverarbeitung.',
        features: [
            'Automatisierte Handelsstrategien',
            'Solana Blockchain-Integration',
            'WebSocket-basierte Echtzeit-Daten',
            'Portfolio-Management und Risikoanalyse',
            'Rust für Performance und Sicherheit'
        ],
        github: 'https://github.com/arvinka23/rust-solana-bot',
        demo: null,
        status: 'In Entwicklung'
    },
    chess: {
        title: '♟️ Schach-Analyse Tool',
        description: 'Ein Python-basiertes Schach-Analyse-Tool, das meine Leidenschaft für Schach mit Programmierung verbindet. Analysiert Partien, erstellt Eröffnungsdatenbanken und bietet personalisierte Trainingsvorschläge.',
        features: [
            'Partie-Analyse mit Chess Engine',
            'Eröffnungsdatenbank und -Training',
            'Statistik-Dashboard für Spieler',
            'Personalisiertes Training basierend auf Schwächen',
            'Export-Funktionen für Turnierberichte'
        ],
        github: null,
        demo: null,
        status: 'Abgeschlossen'
    }
};

function openProject(projectId) {
    const modal = document.getElementById('projectModal');
    const modalBody = document.getElementById('modal-body');
    const data = projectData[projectId];
    
    let linksHTML = '';
    if (data.github) {
        linksHTML += `<a href="${data.github}" target="_blank" class="modal-link github-link">📂 GitHub Repository</a>`;
    }
    if (data.demo) {
        linksHTML += `<a href="${data.demo}" target="_blank" class="modal-link demo-link">🌐 Live Demo</a>`;
    }
    
    const featuresHTML = data.features ? `
        <div class="project-features">
            <h4>Hauptfunktionen:</h4>
            <ul>
                ${data.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
        </div>
    ` : '';
    
    modalBody.innerHTML = `
        <div class="modal-header">
            <h3 id="modalTitle">${data.title}</h3>
            <span class="project-status ${data.status.toLowerCase().replace(' ', '-')}">${data.status}</span>
        </div>
        <div class="modal-content">
            <p class="project-description">${data.description}</p>
            ${featuresHTML}
            ${linksHTML ? `<div class="modal-links">${linksHTML}</div>` : ''}
        </div>
    `;
    
    modal.style.display = 'flex';
}

document.querySelector('.close-modal').addEventListener('click', () => {
    document.getElementById('projectModal').style.display = 'none';
});

// Code editor functionality
function switchTab(language) {
    document.getElementById('javascript-code').style.display = language === 'javascript' ? 'block' : 'none';
    document.getElementById('csharp-code').style.display = language === 'csharp' ? 'block' : 'none';
    document.getElementById('python-code').style.display = language === 'python' ? 'block' : 'none';
    
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`.tab[onclick="switchTab('${language}')"]`).classList.add('active');
}

function runCode() {
    const outputConsole = document.getElementById('output-console');
    outputConsole.innerHTML = '';
    
    if (document.querySelector('.tab.active').textContent === 'JavaScript') {
        const code = document.getElementById('javascript-code').textContent.replace(/<[^>]+>/g, '');
        try {
            const result = eval(code);
            outputConsole.textContent = result !== undefined ? String(result) : 'Code executed successfully';
        } catch (error) {
            outputConsole.textContent = 'Error: ' + error.message;
        }
    } else {
        outputConsole.textContent = 'Execution only supported for JavaScript';
    }
}

// CV Download function
function downloadCV() {
    // For now, this will show an alert. In a real implementation, you would link to an actual CV file
    alert('Lebenslauf-Download wird vorbereitet...\n\nIn einer echten Implementierung würde hier Ihr Lebenslauf als PDF heruntergeladen werden.');
}

// Contact form validation with loading indicator
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const loading = document.getElementById('formLoading');
    const submitBtn = document.querySelector('.submit-btn');
    
    if (name && email && message) {
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            loading.style.display = 'block';
            submitBtn.disabled = true;
            setTimeout(() => {
                loading.style.display = 'none';
                submitBtn.disabled = false;
                alert('Thank you for your message! I will get back to you soon.');
                document.getElementById('contactForm').reset();
            }, 1000);
        } else {
            alert('Please enter a valid email address.');
        }
    } else {
        alert('Please fill out all fields.');
    }
});