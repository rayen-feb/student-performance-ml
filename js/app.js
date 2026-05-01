/**
 * Student Performance ML - JavaScript ML Engine
 * Handles model loading, prediction, and visualization
 */

// Global state
let modelData = null;
let encodersData = null;
let scalerData = null;
let metricsData = null;

// API Functions
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

// Linear Regression Prediction
function predict(inputValues) {
    if (!modelData || !scalerData) {
        console.error('Model not loaded');
        return null;
    }
    
    // Build feature array in correct order
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
    
    // Linear regression prediction: y = intercept + sum(coef_i * x_i)
    let prediction = modelData.intercept;
    for (let i = 0; i < scaledFeatures.length; i++) {
        prediction += modelData.coefficients[i] * scaledFeatures[i];
    }
    
    // Clamp to valid range [0, 20]
    prediction = Math.max(0, Math.min(20, prediction));
    
    return Math.round(prediction * 100) / 100;
}

// Get performance classification
function getPerformanceLevel(score) {
    if (score >= 15) {
        return { level: 'Excellent', color: '#10B981', badge: 'badge-success' };
    } else if (score >= 10) {
        return { level: 'Pass', color: '#F59E0B', badge: 'badge-warning' };
    } else {
        return { level: 'High Risk', color: '#EF4444', badge: 'badge-danger' };
    }
}

// Initialize dashboard metrics
function initDashboard() {
    if (!metricsData) return;
    
    // Update dataset size
    const datasetEl = document.getElementById('dataset-size');
    if (datasetEl) {
        datasetEl.textContent = metricsData.dataset_size;
    }
    
    // Update best model
    const bestModelEl = document.getElementById('best-model');
    if (bestModelEl) {
        bestModelEl.textContent = metricsData.best_model;
    }
    
    // Update best R2
    const bestR2El = document.getElementById('best-r2');
    if (bestR2El) {
        bestR2El.textContent = metricsData.best_r2;
    }
    
    // Render model benchmark chart
    renderBenchmarkChart();
}

// Render model benchmark bar chart
function renderBenchmarkChart() {
    const canvas = document.getElementById('benchmarkChart');
    if (!canvas || !metricsData) return;
    
    const ctx = canvas.getContext('2d');
    const results = metricsData.results;
    const models = Object.keys(results);
    const r2Values = models.map(m => results[m].R2);
    const maxR2 = Math.max(...r2Values);
    
    const chartWidth = canvas.width;
    const chartHeight = canvas.height;
    const barWidth = chartWidth / models.length - 20;
    const barSpacing = 20;
    
    // Clear canvas
    ctx.clearRect(0, 0, chartWidth, chartHeight);
    
    // Draw bars
    models.forEach((model, i) => {
        const barHeight = (results[model].R2 / maxR2) * (chartHeight - 60);
        const x = i * (barWidth + barSpacing) + 15;
        const y = chartHeight - 30 - barHeight;
        
        // Bar gradient
        const gradient = ctx.createLinearGradient(x, y, x, chartHeight - 30);
        gradient.addColorStop(0, '#2563EB');
        gradient.addColorStop(1, '#3730A3');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 6);
        ctx.fill();
        
        // Model name
        ctx.fillStyle = '#374151';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'center';
        const displayName = model.length > 12 ? model.substring(0, 10) + '..' : model;
        ctx.fillText(displayName, x + barWidth/2, chartHeight - 10);
        
        // R2 value
        ctx.fillStyle = '#2563EB';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillText(results[model].R2.toFixed(2), x + barWidth/2, y - 5);
    });
}

// Render distribution chart
function renderDistributionChart() {
    const canvas = document.getElementById('distributionChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const chartWidth = canvas.width;
    const chartHeight = canvas.height;
    
    // Sample grade distribution (simulated from real data patterns)
    const grades = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
    const counts = [1,2,3,5,8,12,15,20,35,40,85,95,120,110,95,85,70,45,30,15,8];
    const total = counts.reduce((a, b) => a + b, 0);
    
    const barWidth = chartWidth / grades.length - 2;
    
    // Clear canvas
    ctx.clearRect(0, 0, chartWidth, chartHeight);
    
    // Draw bars
    grades.forEach((grade, i) => {
        const barHeight = (counts[i] / total) * (chartHeight - 40);
        const x = i * (barWidth + 2) + 2;
        const y = chartHeight - 30 - barHeight;
        
        // Color based on grade
        let color;
        if (grade >= 15) color = '#10B981';
        else if (grade >= 10) color = '#F59E0B';
        else color = '#EF4444';
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 3);
        ctx.fill();
    });
    
    // X-axis labels
    ctx.fillStyle = '#6B7280';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    for (let i = 0; i <= 20; i += 5) {
        const x = (i / 20) * chartWidth;
        ctx.fillText(i.toString(), x, chartHeight - 8);
    }
}

// Render correlation matrix
function renderCorrelationChart() {
    const canvas = document.getElementById('correlationChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const chartWidth = canvas.width;
    const chartHeight = canvas.height;
    
    // Key correlations for visualization
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
    
    // Draw bars
    keys.forEach((key, i) => {
        const corr = correlations[key];
        const barWidth = (Math.abs(corr) / maxCorr) * (chartWidth - 150);
        const x = 100;
        const y = i * itemHeight + 20;
        
        // Label
        ctx.fillStyle = '#374151';
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(key, 10, y + 12);
        
        // Bar background
        ctx.fillStyle = '#E5E7EB';
        ctx.fillRect(x, y, chartWidth - 110, 14);
        
        // Bar
        const color = corr > 0 ? '#10B981' : '#EF4444';
        ctx.fillStyle = color;
        ctx.fillRect(x, y, barWidth, 14);
        
        // Value
        ctx.fillStyle = '#374151';
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(corr.toFixed(2), chartWidth - 10, y + 12);
    });
}

// Handle prediction form submission
async function handlePrediction(event) {
    event.preventDefault();
    
    // Load artifacts if not loaded
    if (!modelData) {
        const loaded = await loadModelArtifacts();
        if (!loaded) {
            alert('Error loading model. Please refresh the page.');
            return;
        }
    }
    
    // Collect form data
    const form = event.target;
    const inputValues = {};
    
    const featureNames = modelData.feature_names;
    for (const fname of featureNames) {
        const input = form.elements[fname];
        if (input) {
            inputValues[fname] = input.value;
        }
    }
    
    // Make prediction
    const prediction = predict(inputValues);
    
    if (prediction !== null) {
        showPredictionResult(prediction);
    } else {
        alert('Error making prediction. Please check your inputs.');
    }
}

// Show prediction result
function showPredictionResult(score) {
    const resultContainer = document.getElementById('prediction-result');
    if (!resultContainer) return;
    
    const performance = getPerformanceLevel(score);
    const progressWidth = (score / 20) * 100;
    
    resultContainer.innerHTML = `
        <div class="prediction-result" style="background: linear-gradient(135deg, ${performance.color}, ${performance.color}dd);">
            <div class="prediction-score">${score.toFixed(2)} / 20</div>
            <p>Predicted Final Grade</p>
            <div class="progress-bar">
                <div class="progress-fill" style="--progress-width: ${progressWidth}%;"></div>
            </div>
            <p class="prediction-level" style="margin-top: 0.5rem;">
                <span class="badge ${performance.badge}">${performance.level}</span>
            </p>
        </div>
    `;
    
    // Show balloons for excellent score
    if (score >= 15) {
        showBalloons();
    }
}

// Simple balloon animation
function showBalloons() {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const balloon = document.createElement('div');
            balloon.innerHTML = '🎈';
            balloon.style.cssText = `
                position: fixed;
                left: ${Math.random() * 80 + 10}%;
                bottom: -50px;
                font-size: 2rem;
                animation: floatUp 3s ease-out forwards;
                z-index: 9999;
            `;
            document.body.appendChild(balloon);
            
            setTimeout(() => balloon.remove(), 3000);
        }, i * 200);
    }
}

// Add CSS animation for balloons
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(-100vh) rotate(10deg); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Initializing Student Performance ML...');
    
    const loaded = await loadModelArtifacts();
    if (loaded) {
        initDashboard();
        
        // Render charts if canvases exist
        if (document.getElementById('benchmarkChart')) {
            renderBenchmarkChart();
        }
        if (document.getElementById('distributionChart')) {
            renderDistributionChart();
        }
        if (document.getElementById('correlationChart')) {
            renderCorrelationChart();
        }
    }
    
    // Setup prediction form
    const predictionForm = document.getElementById('prediction-form');
    if (predictionForm) {
        predictionForm.addEventListener('submit', handlePrediction);
    }
    
    console.log('Initialization complete');
});

// Export functions for external use
window.StudentPerformanceML = {
    loadModelArtifacts,
    predict,
    getPerformanceLevel,
    initDashboard
};
