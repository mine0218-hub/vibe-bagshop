// Three.js 3D 가방 모델링
let scene, camera, renderer, bagModel, controls;
let originalMaterials = [];

// Three.js 초기화
function initThreeJS() {
    const container = document.getElementById('canvas-container');
    if (!container) {
        console.error('Canvas container를 찾을 수 없습니다.');
        return;
    }

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // Camera
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1, 5);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Orbit Controls 설정 확인
    if (typeof THREE.OrbitControls !== 'undefined') {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = true;
        controls.enablePan = false;
        controls.minDistance = 2;
        controls.maxDistance = 10;
        controls.maxPolarAngle = Math.PI / 2;
    } else {
        console.error('OrbitControls를 찾을 수 없습니다.');
    }

    // Load GLB Model
    loadGLBModel();

    // Animation Loop
    animate();

    // Resize Event
    window.addEventListener('resize', onWindowResize);
}

// GLB 모델 로드
function loadGLBModel() {
    // GLTFLoader 확인
    if (typeof THREE.GLTFLoader === 'undefined') {
        console.error('GLTFLoader를 찾을 수 없습니다.');
        createFallbackModel();
        return;
    }

    const loader = new THREE.GLTFLoader();
    
    loader.load(
        './leatherhandbag3dmodel.glb',
        function (gltf) {
            console.log('GLB 모델 로드 성공:', gltf);
            
            bagModel = gltf.scene;
            
            // 모델 스케일 및 위치 조정
            bagModel.scale.set(1.5, 1.5, 1.5);
            bagModel.position.set(0, -0.5, 0);
            
            // 원본 재질 저장
            bagModel.traverse((child) => {
                if (child.isMesh) {
                    originalMaterials.push({
                        mesh: child,
                        material: child.material.clone()
                    });
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            
            scene.add(bagModel);
            console.log('3D 가방 모델이 성공적으로 로드되었습니다.');
        },
        function (xhr) {
            const percent = (xhr.loaded / xhr.total * 100);
            console.log(Math.round(percent) + '% 로드됨');
        },
        function (error) {
            console.error('모델 로드 중 오류 발생:', error);
            createFallbackModel();
        }
    );
}

// 모델 로드 실패 시 기본 모델 생성
function createFallbackModel() {
    console.log('기본 모델을 생성합니다.');
    
    const geometry = new THREE.BoxGeometry(2, 2, 1);
    const material = new THREE.MeshStandardMaterial({
        color: 0x000000,
        roughness: 0.4,
        metalness: 0.1,
    });
    
    bagModel = new THREE.Mesh(geometry, material);
    bagModel.position.set(0, -0.5, 0);
    scene.add(bagModel);
    
    originalMaterials.push({
        mesh: bagModel,
        material: material.clone()
    });
}

// 색상 업데이트 함수
function updateModelColor(hexColor) {
    if (!bagModel) {
        console.log('모델이 아직 로드되지 않았습니다.');
        return;
    }
    
    originalMaterials.forEach(({mesh, material}) => {
        const newMaterial = material.clone();
        newMaterial.color.set(hexColor);
        mesh.material = newMaterial;
    });
}

// 애니메이션 루프
function animate() {
    requestAnimationFrame(animate);
    
    if (controls) {
        controls.update();
    }
    
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

// 윈도우 리사이즈 처리
function onWindowResize() {
    const container = document.getElementById('canvas-container');
    if (!container || !camera || !renderer) return;
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM 로드 완료, 3D 초기화 시작...');
    
    // Three.js가 로드되었는지 확인
    if (typeof THREE === 'undefined') {
        console.error('Three.js를 찾을 수 없습니다.');
        return;
    }
    
    initThreeJS();
});
