// Three.js 3D 브리프케이스 모델링
let scene, camera, renderer, bagMesh;

// Three.js 초기화
function initThreeJS() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // Camera
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 10);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // Mock Bag Asset (Rounded Box representing a briefcase)
    const geometry = new THREE.BoxGeometry(4, 3, 1.5, 32, 32, 32);
    
    // Texture Sim (Leather bump/roughness)
    const material = new THREE.MeshStandardMaterial({
        color: 0x000000,
        roughness: 0.4,
        metalness: 0.1,
    });
    
    bagMesh = new THREE.Mesh(geometry, material);
    scene.add(bagMesh);

    // Handle (Mockup)
    const handleGeometry = new THREE.TorusGeometry(0.8, 0.1, 16, 100, Math.PI);
    const handleMesh = new THREE.Mesh(handleGeometry, material);
    handleMesh.position.y = 1.5;
    scene.add(handleMesh);

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        bagMesh.rotation.y += 0.005;
        handleMesh.rotation.y = bagMesh.rotation.y;
        renderer.render(scene, camera);
    }
    animate();

    // Resize Event
    window.addEventListener('resize', () => {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    });

    // Simple Mouse Interaction
    let isDragging = false;
    let previousMouseX = 0;

    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMouseX = e.clientX;
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    container.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = e.clientX - previousMouseX;
            bagMesh.rotation.y += deltaX * 0.01;
            handleMesh.rotation.y = bagMesh.rotation.y;
            previousMouseX = e.clientX;
        }
    });
}

// Color Update Function
function updateModelColor(hexColor) {
    if (bagMesh) {
        // Find all materials in scene and update
        scene.traverse((child) => {
            if (child.isMesh) {
                child.material.color.set(hexColor);
            }
        });
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // Three.js 초기화
    initThreeJS();
    
    // 윈도우 리사이즈 처리
    window.addEventListener('resize', function() {
        const container = document.getElementById('canvas-container');
        if (container && camera && renderer) {
            const newWidth = container.clientWidth;
            const newHeight = container.clientHeight;
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
        }
    });
});
