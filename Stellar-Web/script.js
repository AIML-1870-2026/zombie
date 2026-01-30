const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let width, height;
let nodes = [];

// Default values for reset
const defaults = {
    config: {
        nodeCount: 50,
        nodeSize: 8,
        nodeOpacity: 0.9,
        nodeGlow: 1.0,
        edgeThickness: 1.5,
        edgeOpacity: 0.5,
        connectivityRadius: 150
    },
    bounds: { x: 1200, y: 900, z: 1200 },
    camera: { z: -600, fov: 500 },
    viewTransform: { panX: 0, panY: 0, rotateX: 0, rotateY: 0 }
};

// Configuration
const config = {
    nodeCount: 50,
    nodeSize: 8,
    nodeOpacity: 0.9,
    nodeGlow: 1.0,
    edgeThickness: 1.5,
    edgeOpacity: 0.5,
    connectivityRadius: 150
};

// 3D space bounds
const bounds = {
    x: 1200,
    y: 900,
    z: 1200
};

// Camera settings for perspective
const camera = {
    fov: 500,
    z: -600
};

// View transform (moves nodes, not camera)
const viewTransform = {
    panX: 0,
    panY: 0,
    rotateX: 0,
    rotateY: 0
};

// Transform a point with rotation and pan
function transformPoint(x, y, z) {
    // Apply Y-axis rotation (left/right)
    const radY = viewTransform.rotateY * Math.PI / 180;
    const cosY = Math.cos(radY);
    const sinY = Math.sin(radY);
    let x1 = x * cosY - z * sinY;
    let z1 = x * sinY + z * cosY;

    // Apply X-axis rotation (up/down)
    const radX = viewTransform.rotateX * Math.PI / 180;
    const cosX = Math.cos(radX);
    const sinX = Math.sin(radX);
    let y1 = y * cosX - z1 * sinX;
    let z2 = y * sinX + z1 * cosX;

    // Apply pan
    x1 += viewTransform.panX;
    y1 += viewTransform.panY;

    return { x: x1, y: y1, z: z2 };
}

class Node {
    constructor() {
        this.x = (Math.random() - 0.5) * bounds.x;
        this.y = (Math.random() - 0.5) * bounds.y;
        this.z = (Math.random() - 0.5) * bounds.z;

        const speed = 0.3;
        this.vx = (Math.random() - 0.5) * speed;
        this.vy = (Math.random() - 0.5) * speed;
        this.vz = (Math.random() - 0.5) * speed;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;

        // Bounce at boundaries
        if (this.x > bounds.x / 2 || this.x < -bounds.x / 2) {
            this.vx *= -1;
            this.x = Math.max(-bounds.x / 2, Math.min(bounds.x / 2, this.x));
        }
        if (this.y > bounds.y / 2 || this.y < -bounds.y / 2) {
            this.vy *= -1;
            this.y = Math.max(-bounds.y / 2, Math.min(bounds.y / 2, this.y));
        }
        if (this.z > bounds.z / 2 || this.z < -bounds.z / 2) {
            this.vz *= -1;
            this.z = Math.max(-bounds.z / 2, Math.min(bounds.z / 2, this.z));
        }
    }

    project() {
        // Transform node position
        const transformed = transformPoint(this.x, this.y, this.z);

        // Calculate 3D distance from camera
        const dx = transformed.x;
        const dy = transformed.y;
        const dz = transformed.z - camera.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        const fov = camera.fov;

        // Spherical Near-Clip - clip based on 3D distance
        const nearClip = 30;
        if (distance < nearClip) return null;

        // Must still be in front of camera for perspective math
        if (dz <= 0) return null;

        // Fade-Out zone - gradually fade nodes approaching camera
        const fadeStart = 80;
        const fadeFactor = distance < fadeStart ? distance / fadeStart : 1;

        // Perspective projection with separate scale base
        // scaleBase controls scaling sensitivity, FOV controls position spread
        const scaleBase = 150;
        const referenceDistance = 100;
        const scale = scaleBase / (scaleBase + dz - referenceDistance);

        return {
            x: dx * fov / dz + width / 2,
            y: dy * fov / dz + height / 2,
            scale: Math.max(0.1, Math.min(scale, 5)),
            fade: fadeFactor
        };
    }
}

function initNodes() {
    nodes = [];
    for (let i = 0; i < config.nodeCount; i++) {
        nodes.push(new Node());
    }
}

function adjustNodeCount(targetCount) {
    const currentCount = nodes.length;
    if (targetCount > currentCount) {
        // Add new nodes
        for (let i = currentCount; i < targetCount; i++) {
            nodes.push(new Node());
        }
    } else if (targetCount < currentCount) {
        // Remove excess nodes
        nodes.length = targetCount;
    }
}

function randomizeNodes() {
    nodes = [];
    for (let i = 0; i < config.nodeCount; i++) {
        nodes.push(new Node());
    }
}

function getDistance3D(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// Track pause state
let isPaused = false;

// Track expensive calculations toggle
let expensiveCalculationsEnabled = false;

function calculateStats() {
    let edgeCount = 0;
    const connections = new Array(nodes.length).fill(0);
    const adjacencyList = nodes.map(() => []);

    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            if (getDistance3D(nodes[i], nodes[j]) <= config.connectivityRadius) {
                edgeCount++;
                connections[i]++;
                connections[j]++;
                adjacencyList[i].push(j);
                adjacencyList[j].push(i);
            }
        }
    }

    // Basic metrics
    const avgConnections = nodes.length > 0
        ? connections.reduce((a, b) => a + b, 0) / nodes.length
        : 0;

    const maxEdges = (nodes.length * (nodes.length - 1)) / 2;
    const density = maxEdges > 0 ? (edgeCount / maxEdges) * 100 : 0;

    const isolatedNodes = connections.filter(c => c === 0).length;
    const maxConnections = Math.max(...connections, 0);
    const nonZeroConnections = connections.filter(c => c > 0);
    const minConnections = nonZeroConnections.length > 0 ? Math.min(...nonZeroConnections) : 0;

    return {
        edgeCount,
        avgConnections,
        density,
        isolatedNodes,
        maxConnections,
        minConnections,
        connections,
        adjacencyList
    };
}

function calculateExpensiveStats(connections, adjacencyList) {
    // Connected components using Union-Find
    const parent = nodes.map((_, i) => i);
    const rank = new Array(nodes.length).fill(0);

    function find(x) {
        if (parent[x] !== x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    function union(x, y) {
        const rootX = find(x);
        const rootY = find(y);
        if (rootX !== rootY) {
            if (rank[rootX] < rank[rootY]) {
                parent[rootX] = rootY;
            } else if (rank[rootX] > rank[rootY]) {
                parent[rootY] = rootX;
            } else {
                parent[rootY] = rootX;
                rank[rootX]++;
            }
        }
    }

    // Union all connected nodes
    for (let i = 0; i < nodes.length; i++) {
        for (const j of adjacencyList[i]) {
            union(i, j);
        }
    }

    // Count components and find largest
    const componentSizes = {};
    for (let i = 0; i < nodes.length; i++) {
        const root = find(i);
        componentSizes[root] = (componentSizes[root] || 0) + 1;
    }
    const componentCount = Object.keys(componentSizes).length;
    const largestComponent = Math.max(...Object.values(componentSizes));

    // Clustering coefficient
    let totalClustering = 0;
    let countWithNeighbors = 0;

    for (let i = 0; i < nodes.length; i++) {
        const neighbors = adjacencyList[i];
        const k = neighbors.length;
        if (k < 2) continue;

        let triangles = 0;
        for (let a = 0; a < neighbors.length; a++) {
            for (let b = a + 1; b < neighbors.length; b++) {
                if (adjacencyList[neighbors[a]].includes(neighbors[b])) {
                    triangles++;
                }
            }
        }
        const possibleTriangles = (k * (k - 1)) / 2;
        totalClustering += triangles / possibleTriangles;
        countWithNeighbors++;
    }
    const clusteringCoeff = countWithNeighbors > 0 ? totalClustering / countWithNeighbors : 0;

    // Median connections
    const sortedConnections = [...connections].sort((a, b) => a - b);
    const mid = Math.floor(sortedConnections.length / 2);
    const medianConnections = sortedConnections.length % 2 !== 0
        ? sortedConnections[mid]
        : (sortedConnections[mid - 1] + sortedConnections[mid]) / 2;

    // Standard deviation
    const mean = connections.reduce((a, b) => a + b, 0) / connections.length;
    const variance = connections.reduce((sum, c) => sum + Math.pow(c - mean, 2), 0) / connections.length;
    const stdDev = Math.sqrt(variance);

    return {
        componentCount,
        largestComponent,
        clusteringCoeff,
        medianConnections,
        stdDev
    };
}

function draw() {
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, width, height);

    // Sort nodes by transformed z for proper depth rendering
    const sortedNodes = [...nodes].sort((a, b) => {
        const ta = transformPoint(a.x, a.y, a.z);
        const tb = transformPoint(b.x, b.y, b.z);
        return tb.z - ta.z;
    });

    // Draw edges first
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dist = getDistance3D(nodes[i], nodes[j]);
            if (dist <= config.connectivityRadius) {
                const p1 = nodes[i].project();
                const p2 = nodes[j].project();

                // Skip if either node is behind camera
                if (!p1 || !p2) continue;

                // Fade edge based on distance and proximity to camera
                const proximityFade = Math.min(p1.fade, p2.fade);
                const alpha = (1 - dist / config.connectivityRadius) * config.edgeOpacity * proximityFade;
                const avgScale = (p1.scale + p2.scale) / 2;

                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(107, 138, 253, ${alpha})`;
                ctx.lineWidth = config.edgeThickness * avgScale;
                ctx.stroke();
            }
        }
    }

    // Draw nodes
    for (const node of sortedNodes) {
        const projected = node.project();
        // Skip nodes behind camera or clipped
        if (!projected) continue;
        const size = config.nodeSize * projected.scale;

        // Depth-based brightness combined with proximity fade
        const depthFactor = 0.4 + 0.6 * projected.scale;
        const fadedOpacity = config.nodeOpacity * depthFactor * projected.fade;

        // Glow effect
        const glowRadius = size * 2 * config.nodeGlow;
        if (glowRadius > 0) {
            const gradient = ctx.createRadialGradient(
                projected.x, projected.y, 0,
                projected.x, projected.y, glowRadius
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${fadedOpacity * config.nodeGlow})`);
            gradient.addColorStop(0.4, `rgba(180, 200, 255, ${fadedOpacity * 0.5 * config.nodeGlow})`);
            gradient.addColorStop(1, 'rgba(107, 138, 253, 0)');

            ctx.beginPath();
            ctx.arc(projected.x, projected.y, glowRadius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        }

        // Core
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${fadedOpacity})`;
        ctx.fill();
    }

    // Update stats
    const stats = calculateStats();
    document.getElementById('totalEdges').textContent = stats.edgeCount;
    document.getElementById('avgConnections').textContent = stats.avgConnections.toFixed(2);
    document.getElementById('networkDensity').textContent = stats.density.toFixed(2) + '%';
    document.getElementById('isolatedNodes').textContent = stats.isolatedNodes;
    document.getElementById('maxConnections').textContent = stats.maxConnections;
    document.getElementById('minConnections').textContent = stats.minConnections;

    // Update expensive stats if enabled
    if (expensiveCalculationsEnabled) {
        const expensive = calculateExpensiveStats(stats.connections, stats.adjacencyList);
        document.getElementById('connectedComponents').textContent = expensive.componentCount;
        document.getElementById('largestComponent').textContent = expensive.largestComponent;
        document.getElementById('clusteringCoeff').textContent = expensive.clusteringCoeff.toFixed(3);
        document.getElementById('medianConnections').textContent = expensive.medianConnections.toFixed(1);
        document.getElementById('connectionStdDev').textContent = expensive.stdDev.toFixed(2);
    }
}

function update() {
    if (isPaused) return;
    for (const node of nodes) {
        node.update();
    }
}

function animate() {
    update();
    draw();
    requestAnimationFrame(animate);
}

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

// Controls
const controlsToggle = document.getElementById('controlsToggle');
const controlsPanel = document.getElementById('controlsPanel');

controlsToggle.addEventListener('click', () => {
    controlsPanel.classList.toggle('open');
});

// Dropdown toggle helper
function setupDropdown(toggleId, contentId) {
    const toggle = document.getElementById(toggleId);
    const content = document.getElementById(contentId);
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('open');
        content.classList.toggle('open');
    });
}

setupDropdown('nodeToggle', 'nodeContent');
setupDropdown('edgeToggle', 'edgeContent');
setupDropdown('spaceToggle', 'spaceContent');
setupDropdown('cameraToggle', 'cameraContent');

// Stats panel toggle
const statsToggle = document.getElementById('statsToggle');
const statsContent = document.getElementById('statsContent');

statsToggle.addEventListener('click', () => {
    statsToggle.classList.toggle('open');
    statsContent.classList.toggle('open');
});

// Pause toggle
const pauseToggle = document.getElementById('pauseToggle');
pauseToggle.addEventListener('change', (e) => {
    isPaused = e.target.checked;
});

// Expensive calculations toggle
const expensiveToggle = document.getElementById('expensiveToggle');
const expensiveStats = document.getElementById('expensiveStats');

expensiveToggle.addEventListener('change', (e) => {
    expensiveCalculationsEnabled = e.target.checked;
    expensiveStats.classList.toggle('visible', expensiveCalculationsEnabled);
    if (!expensiveCalculationsEnabled) {
        // Reset expensive stats display
        document.getElementById('connectedComponents').textContent = '-';
        document.getElementById('largestComponent').textContent = '-';
        document.getElementById('clusteringCoeff').textContent = '-';
        document.getElementById('medianConnections').textContent = '-';
        document.getElementById('connectionStdDev').textContent = '-';
    }
});

// Slider handlers
function setupSlider(id, configKey, displayId, transform = v => v, displayTransform = v => v) {
    const slider = document.getElementById(id);
    const display = document.getElementById(displayId);

    slider.addEventListener('input', (e) => {
        const value = transform(parseFloat(e.target.value));
        config[configKey] = value;
        display.textContent = displayTransform(value);

        if (configKey === 'nodeCount') {
            adjustNodeCount(value);
        }
    });
}

setupSlider('nodeCount', 'nodeCount', 'nodeCountValue');
setupSlider('nodeSize', 'nodeSize', 'nodeSizeValue');
setupSlider('nodeOpacity', 'nodeOpacity', 'nodeOpacityValue', v => v / 100, v => v.toFixed(1));
setupSlider('nodeGlow', 'nodeGlow', 'nodeGlowValue', v => v / 100, v => v.toFixed(1));
setupSlider('edgeThickness', 'edgeThickness', 'edgeThicknessValue', v => v / 10, v => v.toFixed(1));
setupSlider('edgeOpacity', 'edgeOpacity', 'edgeOpacityValue', v => v / 100, v => v.toFixed(1));
setupSlider('connectivityRadius', 'connectivityRadius', 'connectivityRadiusValue');

// Camera distance slider
const cameraSlider = document.getElementById('cameraDistance');
const cameraDisplay = document.getElementById('cameraDistanceValue');
cameraSlider.addEventListener('input', (e) => {
    camera.z = parseFloat(e.target.value);
    cameraDisplay.textContent = camera.z;
});

// View transform sliders
function setupViewSlider(id, key, displayId, suffix = '') {
    const slider = document.getElementById(id);
    const display = document.getElementById(displayId);
    slider.addEventListener('input', (e) => {
        viewTransform[key] = parseFloat(e.target.value);
        display.textContent = viewTransform[key] + suffix;
    });
}

// Rotation sliders with looping
function setupRotationSlider(id, key, displayId) {
    const slider = document.getElementById(id);
    const display = document.getElementById(displayId);
    slider.addEventListener('input', (e) => {
        let value = parseFloat(e.target.value);
        // Loop from -180 to 180 and vice versa
        if (value > 180) value = -180;
        if (value < -180) value = 180;
        viewTransform[key] = value;
        slider.value = value;
        display.textContent = value + '°';
    });
}

setupViewSlider('panX', 'panX', 'panXValue');
setupViewSlider('panY', 'panY', 'panYValue');
setupRotationSlider('rotateX', 'rotateX', 'rotateXValue');
setupRotationSlider('rotateY', 'rotateY', 'rotateYValue');

// FOV slider
const fovSlider = document.getElementById('fov');
const fovDisplay = document.getElementById('fovValue');
fovSlider.addEventListener('input', (e) => {
    camera.fov = parseFloat(e.target.value);
    fovDisplay.textContent = camera.fov;
});

// Space bounds sliders - scales existing nodes proportionally
function setupBoundsSlider(id, boundsKey, displayId) {
    const slider = document.getElementById(id);
    const display = document.getElementById(displayId);
    slider.addEventListener('input', (e) => {
        const oldBounds = bounds[boundsKey];
        const newBounds = parseFloat(e.target.value);
        const scale = newBounds / oldBounds;

        // Scale all existing node positions for this axis
        for (const node of nodes) {
            node[boundsKey] *= scale;
        }

        bounds[boundsKey] = newBounds;
        display.textContent = bounds[boundsKey];
    });
}

setupBoundsSlider('spaceWidth', 'x', 'spaceWidthValue');
setupBoundsSlider('spaceHeight', 'y', 'spaceHeightValue');
setupBoundsSlider('spaceDepth', 'z', 'spaceDepthValue');

// Randomize button
document.getElementById('randomizeNodes').addEventListener('click', randomizeNodes);

// Reset functions
function resetNodeSettings() {
    config.nodeCount = defaults.config.nodeCount;
    config.nodeSize = defaults.config.nodeSize;
    config.nodeOpacity = defaults.config.nodeOpacity;
    config.nodeGlow = defaults.config.nodeGlow;

    document.getElementById('nodeCount').value = 50;
    document.getElementById('nodeCountValue').textContent = 50;
    document.getElementById('nodeSize').value = 8;
    document.getElementById('nodeSizeValue').textContent = 8;
    document.getElementById('nodeOpacity').value = 90;
    document.getElementById('nodeOpacityValue').textContent = '0.9';
    document.getElementById('nodeGlow').value = 100;
    document.getElementById('nodeGlowValue').textContent = '1.0';

    adjustNodeCount(defaults.config.nodeCount);
}

function resetEdgeSettings() {
    config.edgeThickness = defaults.config.edgeThickness;
    config.edgeOpacity = defaults.config.edgeOpacity;
    config.connectivityRadius = defaults.config.connectivityRadius;

    document.getElementById('edgeThickness').value = 15;
    document.getElementById('edgeThicknessValue').textContent = '1.5';
    document.getElementById('edgeOpacity').value = 50;
    document.getElementById('edgeOpacityValue').textContent = '0.5';
    document.getElementById('connectivityRadius').value = 150;
    document.getElementById('connectivityRadiusValue').textContent = 150;
}

function resetSpaceSettings() {
    // Scale nodes back to default bounds
    for (const node of nodes) {
        node.x *= defaults.bounds.x / bounds.x;
        node.y *= defaults.bounds.y / bounds.y;
        node.z *= defaults.bounds.z / bounds.z;
    }

    bounds.x = defaults.bounds.x;
    bounds.y = defaults.bounds.y;
    bounds.z = defaults.bounds.z;

    document.getElementById('spaceWidth').value = 1200;
    document.getElementById('spaceWidthValue').textContent = 1200;
    document.getElementById('spaceHeight').value = 900;
    document.getElementById('spaceHeightValue').textContent = 900;
    document.getElementById('spaceDepth').value = 1200;
    document.getElementById('spaceDepthValue').textContent = 1200;
}

function resetCameraSettings() {
    camera.z = defaults.camera.z;
    camera.fov = defaults.camera.fov;
    viewTransform.panX = defaults.viewTransform.panX;
    viewTransform.panY = defaults.viewTransform.panY;
    viewTransform.rotateX = defaults.viewTransform.rotateX;
    viewTransform.rotateY = defaults.viewTransform.rotateY;

    document.getElementById('cameraDistance').value = -600;
    document.getElementById('cameraDistanceValue').textContent = -600;
    document.getElementById('panX').value = 0;
    document.getElementById('panXValue').textContent = 0;
    document.getElementById('panY').value = 0;
    document.getElementById('panYValue').textContent = 0;
    document.getElementById('rotateX').value = 0;
    document.getElementById('rotateXValue').textContent = '0°';
    document.getElementById('rotateY').value = 0;
    document.getElementById('rotateYValue').textContent = '0°';
    document.getElementById('fov').value = 500;
    document.getElementById('fovValue').textContent = 500;
}

function resetAllSettings() {
    resetNodeSettings();
    resetEdgeSettings();
    resetSpaceSettings();
    resetCameraSettings();
    randomizeNodes();
}

// Reset button event listeners
document.getElementById('resetNodes').addEventListener('click', resetNodeSettings);
document.getElementById('resetEdges').addEventListener('click', resetEdgeSettings);
document.getElementById('resetSpace').addEventListener('click', resetSpaceSettings);
document.getElementById('resetCamera').addEventListener('click', resetCameraSettings);
document.getElementById('resetAll').addEventListener('click', resetAllSettings);

// Initialize
window.addEventListener('resize', resize);
resize();
initNodes();
animate();
