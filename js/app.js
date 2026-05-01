/**
 * Student Performance AI - Apple-Style JavaScript
 * Handles scroll animations, navigation, model loading, and visualization
 */

// Global state
let modelData = null;
let encodersData = null;
let scalerData = null;
let metricsData = null;

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class for background change
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Handle staggered children
                const children = entry.target.querySelectorAll('.animate-child');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('visible');
                    }, index * 100);
                });
                
                // Trigger counter animation for KPI values
                const counter = entry.target.querySelector('.kpi-value');
                if (counter && !counter.classList.contains('counted')) {
                    animateCounter(counter);
                    counter.classList.add('counted');
                }
                
                // Trigger progress bar animation
                const progressFill = entry.target.querySelector('.progress-fill');
                if (progressFill && !progressFill.classList.contains('animated')) {
                    const width = progressFill.dataset.width;
                    if (width) {
                        setTimeout(() => {
                            progressFill.style.width = width + '%';
                        }, 300);
                        progressFill.classList.add('animated');
                    }
                }
            }
        });
    }, observerOptions);
    
    // Observe all elements with animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// COUNTER ANIMATION
// ============================================
function animateCounter(element) {
    const target = parseFloat(element.dataset.value);
    if (isNaN(target)) return;
    
    const duration = 1500;
    const start = performance.now();
    const isPercentage = element.textContent.includes('%');
    const isDecimal = target % 1 !== 0;
    
    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out cubic)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = target * easeOut;
        
        if (isDecimal) {
            element.textContent = current.toFixed(2) + (isPercentage ? '%' : '');
        } else {
            element.textContent = Math.round(current).toLocaleString() + (isPercentage ? '%' : '');
        }
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// API FUNCTIONS
// ============================================
async function loadModelArtifacts() {
    try {
        const [modelRes, encodersRes, scalerRes, metricsRes] = await Promise.all([
            fetch('json/model.json'),
            fetch('json/encoders.json'),
            fetch('json/scaler.json'),
            fetch('json/metrics.json')
        ]);
        
        modelData = await modelRes.json();
        encodersData = await encodersRes.json();
        scalerData = await scalerRes.json();
        metricsData = await metricsRes.json();
        
        console.log('Model artifacts loaded successfully');
        return true;
    } catch (error) {
        console.error('Error loading model artifacts:', error);
        return false;
    }
}

// ============================================
// PREDICTION
// ============================================
function predict(inputValues) {
    if (!modelData || !scalerData) {
        console.error('Model not loaded');
        return null;
    }
    
    let features = [];
    const featureNames = modelData.feature_names;
    
    for (let i = 0; i < featureNames.length; i++) {
        const fname = featureNames[i];
        let value = inputValues[fname];
        
        // Encode categorical values
        if (encodersData && encodersData[fname]) {
            const classes = encodersData[fname].classes;
            const classesTransformed = encodersData[fname].classes_transformed;
            const idx = classes.indexOf(value);
            if (idx >= 0) {
                value = classesTransformed[idx];
            }
        }
        
        features.push(parseFloat(value));
    }
    
    // Scale features
    const scaledFeatures = [];
    for (let i = 0; i < features.length; i++) {
        const scaled = (features[i] - scalerData.mean[i]) / scalerData.scale[i];
        scaledFeatures.push(scaled);
    }
    
    // Linear regression prediction
    let prediction = modelData.intercept;
    for (let i = 0; i < scaledFeatures.length; i++) {
        prediction += modelData.coefficients[i] * scaledFeatures[i];
    }
    
    // Clamp to valid range [0, 20]
    prediction = Math.max(0, Math.min(20, prediction));
    
    return Math.round(prediction * 100) / 100;
}

function getPerformanceLevel(score) {
    if (score >= 15) {
        return { level: 'Excellent', color: '#34C759', badge: 'badge-success' };
    } else if (score >= 10) {
        return { level: 'Pass', color: '#FF9500', badge: 'badge-warning' };
    } else {
        return { level: 'High Risk', color: '#FF3B30', badge: 'badge-danger' };
    }
}

// ============================================
// DASHBOARD
// ============================================
function initDashboard() {
    if (!metricsData) return;
    
    // Update dataset size
    const datasetEl = document.getElementById('dataset-size');
    if (datasetEl) {
        datasetEl.dataset.value = metricsData.dataset_size;
        datasetEl.textContent = '0';
    }
    
    // Update best model
    const bestModelEl = document.getElementById('best-model');
    if (bestModelEl) {
        bestModelEl.textContent = metricsData.best_model;
    }
    
    // Update best R2
    const bestR2El = document.getElementById('best-r2');
    if (bestR2El) {
        bestR2El.dataset.value = metricsData.best_r2;
        bestR2El.textContent = '0.00';
    }
    
    // Update prediction confidence
    const confidenceEl = document.getElementById('prediction-confidence');
    if (confidenceEl) {
        const confidence = Math.round(metricsData.best_r2 * 100);
        confidenceEl.dataset.value = confidence;
        confidenceEl.textContent = '0%';
    }
    
    // Render charts
    renderBenchmarkChart();
}

// ============================================
// CHARTS
// ============================================
function renderBenchmarkChart() {
    const canvas = document.getElementById('benchmarkChart');
    if (!canvas || !metricsData) return;
    
    const ctx = canvas.getContext('2d');
    const results = metricsData.results;
    const models = Object.keys(results);
    const r2Values = models.map(m => results[m].R2);
    const maxR2 = Math.max(...r2Values);
    
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const chartWidth = rect.width;
    const chartHeight = rect.height;
    const barWidth = (chartWidth / models.length) * 0.6;
    const barSpacing = (chartWidth / models.length) * 0.4;
    
    // Clear canvas
    ctx.clearRect(0, 0, chartWidth, chartHeight);
    
    // Draw bars with animation
    models.forEach((model, i) => {
        const targetHeight = (results[model].R2 / maxR2) * (chartHeight - 80);
        const x = i * (barWidth + barSpacing) + barSpacing / 2;
        const y = chartHeight - 50;
        
        // Animate bar height
        let currentHeight = 0;
        const startTime = performance.now();
        const duration = 1000;
        const delay = i * 150;
        
        function animateBar(currentTime) {
            const elapsed = currentTime - startTime - delay;
            if (elapsed < 0) {
                requestAnimationFrame(animateBar);
                return;
            }
            
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            currentHeight = targetHeight * easeOut;
            
            // Clear only this bar area
            ctx.clearRect(x - 2, 0, barWidth + 4, chartHeight - 50);
            
            // Bar gradient
            const gradient = ctx.createLinearGradient(x, y - currentHeight, x, y);
            gradient.addColorStop(0, '#0071E3');
            gradient.addColorStop(1, '#5856D6');
            
            // Draw bar with rounded top
            ctx.fillStyle = gradient;
            ctx.beginPath();
            const radius = 8;
            ctx.moveTo(x + radius, y - currentHeight);
            ctx.lineTo(x + barWidth - radius, y - currentHeight);
            ctx.quadraticCurveTo(x + barWidth, y - currentHeight, x + barWidth, y - currentHeight + radius);
            ctx.lineTo(x + barWidth, y);
            ctx.lineTo(x, y);
            ctx.lineTo(x, y - currentHeight + radius);
            ctx.quadraticCurveTo(x, y - currentHeight, x + radius, y - currentHeight);
            ctx.closePath();
            ctx.fill();
            
            // R2 value on top
            if (progress > 0.5) {
                ctx.fillStyle = '#0071E3';
                ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, sans-serif';
                ctx.textAlign = 'center';
                const valueOpacity = (progress - 0.5) * 2;
                ctx.globalAlpha = valueOpacity;
                ctx.fillText(results[model].R2.toFixed(2), x + barWidth / 2, y - currentHeight - 10);
                ctx.globalAlpha = 1;
            }
            
            if (progress < 1) {
                requestAnimationFrame(animateBar);
            }
        }
        
        requestAnimationFrame(animateBar);
        
        // Model name
        ctx.fillStyle = '#86868B';
        ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'center';
        const displayName = model.length > 14 ? model.substring(0, 12) + '..' : model;
        ctx.fillText(displayName, x + barWidth / 2, chartHeight - 20);
    });
}

function renderDistributionChart() {
    const canvas = document.getElementById('distributionChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const chartWidth = rect.width;
    const chartHeight = rect.height;
    
    const grades = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
    const counts = [1,2,3,5,8,12,15,20,35,40,85,95,120,110,95,85,70,45,30,15,8];
    const total = counts.reduce((a, b) => a + b, 0);
    
    const barWidth = (chartWidth / grades.length) - 2;
    
    // Clear canvas
    ctx.clearRect(0, 0, chartWidth, chartHeight);
    
    // Draw bars with animation
    grades.forEach((grade, i) => {
        const targetHeight = (counts[i] / total) * (chartHeight - 50);
        const x = i * (barWidth + 2) + 2;
        const y = chartHeight - 35;
        
        let color;
        if (grade >= 15) color = '#34C759';
        else if (grade >= 10) color = '#FF9500';
        else color = '#FF3B30';
        
        // Animate
        let currentHeight = 0;
        const startTime = performance.now();
        const duration = 800;
        const delay = i * 30;
        
        function animateBar(currentTime) {
            const elapsed = currentTime - startTime - delay;
            if (elapsed < 0) {
                requestAnimationFrame(animateBar);
                return;
            }
            
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            currentHeight = targetHeight * easeOut;
            
            ctx.clearRect(x - 1, 0, barWidth + 2, chartHeight - 35);
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.roundRect(x, y - currentHeight, barWidth, currentHeight, 4);
            ctx.fill();
            
            if (progress < 1) {
                requestAnimationFrame(animateBar);
            }
        }
        
        requestAnimationFrame(animateBar);
    });
    
    // X-axis labels
    ctx.fillStyle = '#86868B';
    ctx.font = '11px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    for (let i = 0; i <= 20; i += 5) {
        const x = (i / 20) * (chartWidth - 20) + 10;
        ctx.fillText(i.toString(), x, chartHeight - 8);
    }
}

function renderCorrelationChart() {
    const canvas = document.getElementById('correlationChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const chartWidth = rect.width;
    const chartHeight = rect.height;
    
    const correlations = {
        'G1-G2': 0.85,
        'G2-G3': 0.92,
        'G1-G3': 0.82,
        'studytime-G3': 0.15,
        'failures-G3': -0.35,
        'absences-G3': -0.18,
        'Medu-G3': 0.22,
        'Fedu-G3': 0.18
    };
    
    const keys = Object.keys(correlations);
    const itemHeight = (chartHeight - 40) / keys.length;
    const maxCorr = Math.max(...Object.values(correlations).map(Math.abs));
    
    // Clear canvas
    ctx.clearRect(0, 0, chartWidth, chartHeight);
    
    // Draw bars with animation
    keys.forEach((key, i) => {
        const corr = correlations[key];
        const targetWidth = (Math.abs(corr) / maxCorr) * (chartWidth - 150);
        const x = 100;
        const y = i * itemHeight + 20;
        
        // Label
        ctx.fillStyle = '#1D1D1F';
        ctx.font = '600 12px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(key, 10, y + 14);
        
        // Bar background
        ctx.fillStyle = '#F2F2F7';
        ctx.beginPath();
        ctx.roundRect(x, y, chartWidth - 110, 16, 8);
        ctx.fill();
        
        // Animated bar
        let currentWidth = 0;
        const startTime = performance.now();
        const duration = 1000;
        const delay = i * 100;
        
        function animateBar(currentTime) {
            const elapsed = currentTime - startTime - delay;
            if (elapsed < 0) {
                requestAnimationFrame(animateBar);
                return;
            }
            
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            currentWidth = targetWidth * easeOut;
            
            // Clear bar area
            ctx.clearRect(x, y, chartWidth - 110, 16);
            
            // Redraw background
            ctx.fillStyle = '#F2F2F7';
            ctx.beginPath();
            ctx.roundRect(x, y, chartWidth - 110, 16, 8);
            ctx.fill();
            
            // Draw bar
            const color = corr > 0 ? '#34C759' : '#FF3B30';
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.roundRect(x, y, currentWidth, 16, 8);
            ctx.fill();
            
            // Value
            if (progress > 0.7) {
                ctx.fillStyle = '#1D1D1F';
                ctx.font = '600 11px -apple-system, BlinkMacSystemFont, sans-serif';
                ctx.textAlign = 'right';
                const valueOpacity = (progress - 0.7) * 3.33;
                ctx.globalAlpha = Math.min(valueOpacity, 1);
                ctx.fillText(corr.toFixed(2), chartWidth - 10, y + 13);
                ctx.globalAlpha = 1;
            }
            
            if (progress < 1) {
                requestAnimationFrame(animateBar);
            }
        }
        
        requestAnimationFrame(animateBar);
    });
}

// ============================================
// PREDICTION FORM
// ============================================
async function handlePrediction(event) {
    event.preventDefault();
    
    if (!modelData) {
        const loaded = await loadModelArtifacts();
        if (!loaded) {
            alert('Error loading model. Please refresh the page.');
            return;
        }
    }
    
    const form = event.target;
    const inputValues = {};
    
    const featureNames = modelData.feature_names;
    for (const fname of featureNames) {
        const input = form.elements[fname];
        if (input) {
            inputValues[fname] = input.value;
        }
    }
    
    const prediction = predict(inputValues);
    
    if (prediction !== null) {
        showPredictionResult(prediction);
    } else {
        alert('Error making prediction. Please check your inputs.');
    }
}

function showPredictionResult(score) {
    const resultContainer = document.getElementById('prediction-result');
    if (!resultContainer) return;
    
    const performance = getPerformanceLevel(score);
    const progressWidth = (score / 20) * 100;
    
    resultContainer.innerHTML = `\n        <div class="prediction-result" style="background: linear-gradient(135deg, ${performance.color}, ${performance.color}dd);">\n            <div class="prediction-score">${score.toFixed(2)}</div>\n            <p style="font-size: 1.1rem; opacity: 0.9; margin-bottom: 1.5rem;">Predicted Final Grade (out of 20)</p>\n            <div class="progress-container">\n                <div class="progress-label">\n                    <span>Performance</span>\n                    <span>${score.toFixed(1)}/20</span>\n                </div>\n                <div class="progress-track">\n                    <div class="progress-fill" style="width: 0%;" data-width="${progressWidth}"></div>\n                </div>\n            </div>\n            <p style="margin-top: 1.5rem;">\n                <span class="badge ${performance.badge}">${performance.level}</span>\n            </p>\n        </div>\n    `;
    
    // Animate progress bar
    setTimeout(() => {
        const fill = resultContainer.querySelector('.progress-fill');
        if (fill) {
            fill.style.width = progressWidth + '%';
        }
    }, 100);
}

// ============================================
// INSIGHTS ANIMATION
// ============================================
function initInsightsAnimation() {
    const lists = document.querySelectorAll('.insights-list');
    
    lists.forEach(list => {
        const items = list.querySelectorAll('li');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, index * 150);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(list);
    });
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Initializing Student Performance AI...');
    
    // Initialize UI
    initNavigation();
    initScrollAnimations();
    initSmoothScroll();
    initInsightsAnimation();
    
    // Load model data
    const loaded = await loadModelArtifacts();
    if (loaded) {
        initDashboard();
        
        // Render charts if canvases exist
        if (document.getElementById('benchmarkChart')) {
            // Delay slightly to ensure layout is complete
            setTimeout(renderBenchmarkChart, 100);
        }
        if (document.getElementById('distributionChart')) {
            setTimeout(renderDistributionChart, 100);
        }
        if (document.getElementById('correlationChart')) {
            setTimeout(renderCorrelationChart, 100);
        }
    }
    
    // Setup prediction form
    const predictionForm = document.getElementById('prediction-form');
    if (predictionForm) {
        predictionForm.addEventListener('submit', handlePrediction);
    }
    
    console.log('Initialization complete');
});

// Handle window resize for charts
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (document.getElementById('benchmarkChart')) renderBenchmarkChart();
        if (document.getElementById('distributionChart')) renderDistributionChart();
        if (document.getElementById('correlationChart')) renderCorrelationChart();
    }, 250);
});

// Export functions for external use
window.StudentPerformanceML = {
    loadModelArtifacts,
    predict,
    getPerformanceLevel,
    initDashboard
};
