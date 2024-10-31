// Данные телефонов
const phones = [
    {
        name: "Ultra Gaming Pro X",
        price: 129999,
        specs: {
            "Процессор": "Snapdragon 8 Gen 3",
            "ОЗУ": "24GB LPDDR5X",
            "Накопитель": "1TB UFS 4.0",
            "Дисплей": "6.8\" 165Hz AMOLED",
            "Батарея": "6000mAh"
        },
        benchmarks: {
            "AnTuTu": 1850000,
            "GeekBench": 5890,
            "3DMark": 12500
        },
        gaming: {
            "Genshin Impact": { fps: 60, stability: 98 },
            "PUBG Mobile": { fps: 90, stability: 99 },
            "Call of Duty Mobile": { fps: 120, stability: 97 }
        },
        thermals: {
            "Idle": 32,
            "Gaming": 42,
            "Stress Test": 45
        }
    },
    // Добавьте остальные телефоны по аналогии
];

// Инициализация частиц
function initParticles() {
    const particlesContainer = document.getElementById('particles-container');
    const particles = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particlesContainer.appendChild(particle);
        
        const animation = particle.animate([
            {
                transform: `translate(${Math.random() * 100}vw, ${Math.random() * 100}vh)`,
                opacity: Math.random()
            },
            {
                transform: `translate(${Math.random() * 100}vw, ${Math.random() * 100}vh)`,
                opacity: Math.random()
            }
        ], {
            duration: 3000 + Math.random() * 3000,
            iterations: Infinity
        });
        
        particles.push({ element: particle, animation });
    }
}

// Инициализация 3D моделей телефонов
function initPhoneModel(index) {
    const container = document.getElementById(`phone-model-${index}`);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Создание упрощенной 3D модели телефона
    const geometry = new THREE.BoxGeometry(1, 2, 0.1);
    const material = new THREE.MeshPhongMaterial({
        color: 0x00f7ff,
        emissive: 0x00f7ff,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.8
    });
    
    const phone = new THREE.Mesh(geometry, material);
    scene.add(phone);

    // Добавление освещения
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 2);
    scene.add(light);

    camera.position.z = 3;

    // Анимация вращения
    function animate() {
        requestAnimationFrame(animate);
        phone.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    animate();
}

// Создание карточек телефонов
function createPhoneCards() {
    const grid = document.getElementById('phones-grid');
    
    phones.forEach((phone, index) => {
        const card = document.createElement('div');
        card.className = 'holo-card';
        card.innerHTML = `
            <div id="phone-model-${index}" class="phone-model-3d"></div>
            <h2>${phone.name}</h2>
            <div class="price">₽${phone.price.toLocaleString()}</div>
            <div class="specs-grid">
                ${Object.entries(phone.specs).map(([key, value]) => `
                    <div class="spec-item">
                        <div class="spec-label">${key}</div>
                        <div class="spec-value">${value}</div>
                        <div class="spec-bar" style="width: ${getSpecScore(key, value)}%"></div>
                    </div>
                `).join('')}
            </div>
        `;

        // Добавление 3D эффекта при наведении
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            
            gsap.to(card, {
                duration: 0.5,
                rotateX: angleX,
                rotateY: angleY,
                ease: 'power2.out',
                transformPerspective: 1000,
                transformOrigin: 'center'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                duration: 0.5,
                rotateX: 0,
                rotateY: 0,
                ease: 'power2.out'
            });
        });

        card.addEventListener('click', () => showPhoneDetails(phone, index));
        grid.appendChild(card);
        initPhoneModel(index);
    });
}

// Показ детального просмотра
function showPhoneDetails(phone, index) {
    const detailView = document.getElementById('detail-view');
    detailView.style.display = 'block';
    
    // Инициализация графиков
    initDetailCharts(phone);
    
    gsap.fromTo(detailView, 
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
    );
}
       // Радар производительности
    const performanceCtx = document.getElementById('performance-radar').getContext('2d');
    new Chart(performanceCtx, {
        type: 'radar',
        data: {
            labels: ['Процессор', 'Графика', 'Память', 'Охлаждение', 'Батарея'],
            datasets: [{
                data: [
                    getPerformanceScore(phone.benchmarks.AnTuTu),
                    getPerformanceScore(phone.benchmarks['3DMark']),
                    getPerformanceScore(phone.specs.ОЗУ),
                    100 - getMaxTemperature(phone.thermals),
                    getBatteryScore(phone.specs.Батарея)
                ],
                backgroundColor: 'rgba(0, 247, 255, 0.2)',
                borderColor: 'rgba(0, 247, 255, 1)',
                pointBackgroundColor: 'rgba(0, 247, 255, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(0, 247, 255, 1)'
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    pointLabels: { color: '#fff' },
                    ticks: { 
                        display: false,
                        maxTicksLimit: 5
                    }
                }
            },
            plugins: {
                legend: { display: false }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            }
        }
    });

    // График игровой производительности
    const gamingCtx = document.getElementById('gaming-chart').getContext('2d');
    const gradientFill = gamingCtx.createLinearGradient(0, 0, 0, 400);
    gradientFill.addColorStop(0, 'rgba(0, 247, 255, 0.5)');
    gradientFill.addColorStop(1, 'rgba(0, 247, 255, 0)');

    new Chart(gamingCtx, {
        type: 'line',
        data: {
            labels: Object.keys(phone.gaming),
            datasets: [{
                label: 'FPS',
                data: Object.values(phone.gaming).map(g => g.fps),
                borderColor: 'rgba(0, 247, 255, 1)',
                backgroundColor: gradientFill,
                tension: 0.4,
                fill: true
            }, {
                label: 'Стабильность',
                data: Object.values(phone.gaming).map(g => g.stability),
                borderColor: 'rgba(255, 0, 255, 1)',
                backgroundColor: 'rgba(255, 0, 255, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: { color: '#fff' }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: { color: '#fff' }
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#fff' }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            }
        }
    });

    // Тепловая карта
    const thermalCtx = document.getElementById('thermal-chart').getContext('2d');
    const thermalData = createThermalData(phone.thermals);
    
    new Chart(thermalCtx, {
        type: 'scatter',
        data: {
            datasets: [{
                data: thermalData,
                backgroundColor: (context) => {
                    const value = context.raw.v;
                    return getTempColor(value);
                },
                pointRadius: 8
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: { 
                        color: '#fff',
                        callback: (value) => `${value}°C`
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: { color: '#fff' }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (context) => `Температура: ${context.raw.v}°C`
                    }
                }
            },
            animation: {
                duration: 1500
            }
        }
    });
}

// Вспомогательные функции
function getPerformanceScore(value) {
    // Нормализация значений к шкале 0-100
    if (typeof value === 'number') {
        return Math.min(100, (value / 2000000) * 100);
    }
    // Для строковых значений (например, ОЗУ)
    const numValue = parseInt(value);
    return Math.min(100, (numValue / 24) * 100);
}

function getBatteryScore(batterySpec) {
    const capacity = parseInt(batterySpec);
    return Math.min(100, (capacity / 6000) * 100);
}

function getMaxTemperature(thermals) {
    return Math.max(...Object.values(thermals));
}

function getTempColor(temp) {
    const hue = Math.max(0, Math.min(240, 240 - (temp - 30) * 8));
    return `hsla(${hue}, 100%, 50%, 0.8)`;
}

function createThermalData(thermals) {
    const data = [];
    const timePoints = ['Idle', 'Gaming', 'Stress Test'];
    
    timePoints.forEach((point, index) => {
        data.push({
            x: index,
            y: thermals[point],
            v: thermals[point]
        });
    });
    
    return data;
}

// Утилиты для спецификаций
function getSpecScore(key, value) {
    switch(key) {
        case 'Процессор':
            return value.includes('Gen 3') ? 95 : 85;
        case 'ОЗУ':
            return parseInt(value) * 4;
        case 'Накопитель':
            return parseInt(value) / 10;
        case 'Дисплей':
            return parseInt(value) / 2;
        case 'Батарея':
            return parseInt(value) / 60;
        default:
            return 80;
    }
}

// Закрытие детального просмотра
function hidePhoneDetails() {
    const detailView = document.getElementById('detail-view');
    gsap.to(detailView, {
        opacity: 0,
        scale: 0.9,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
            detailView.style.display = 'none';
        }
    });
}

// Инициализация при загрузке страницы
window.addEventListener('load', () => {
    initParticles();
    createPhoneCards();
});

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    const canvas = document.querySelectorAll('canvas');
    canvas.forEach(c => {
        const chart = Chart.getChart(c);
        if (chart) {
            chart.resize();
        }
    });
});
