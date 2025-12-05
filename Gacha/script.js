// 正常模式卡片数据数组（4个粉色系逐渐变深，更浅一级）
const cardData = [
    {
        name: "爱心小熊",
        description: "一只充满爱心的粉色小熊，总是给大家带来温暖",
        color: 0xffa0a0 // 浅粉色加深
    },
    {
        name: "彩虹小兔",
        description: "拥有彩虹尾巴的可爱兔子，喜欢在阳光下跳跃",
        color: 0xffa0a0 // 浅粉色加深
    },
    {
        name: "星星猫咪",
        description: "眼睛像星星一样闪亮的小猫，夜晚会发出柔和的光芒",
        color: 0xffa0a0 // 浅粉色加深
    },
    {
        name: "云朵小狗",
        description: "毛茸茸的小狗，身体像云朵一样柔软",
        color: 0xffa0a0 // 浅粉色加深
    }
];

// Sexy模式卡片数据数组
const sexyCardData = [
    {
        name: "舔舐",
        description: "身下液体沾在手指并让对方舔舐 15 秒",
        color: 0xff99bb // 稍深的浅粉色
    },
    {
        name: "克制",
        description: "3 分钟不进入只摩擦",
        color: 0xff99bb // 稍深的浅粉色
    },
    {
        name: "挑战",
        description: "5 分钟后入 100 次不准射",
        color: 0xff99bb // 稍深的浅粉色
    },
    {
        name: "教学",
        description: "手把手同时触摸 a 点和 g 点 15 秒",
        color: 0xff99bb // 稍深的浅粉色
    },
    {
        name: "比赛",
        description: "一起看着对方自慰 3 分钟",
        color: 0xff99bb // 稍深的浅粉色
    },
    {
        name: "女王",
        description: "拨开 yc 让他舔 1 分钟",
        color: 0xff99bb // 稍深的浅粉色
    }
];

// 全局变量
let scene, camera, renderer, card, cardText, particles, particleSystem;
let isDrawing = false;

// 初始化Three.js场景
function initThreeJS() {
    // 创建场景
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfff0f5);
    
    // 获取容器的实际尺寸，确保在移动设备上能正确获取
    const container = document.getElementById('canvas-container');
    
    // 强制设置容器的宽度和高度，确保在移动设备上能正确显示
    container.style.width = '100%';
    container.style.height = 'auto';
    
    // 使用offsetWidth和offsetHeight获取实际渲染尺寸
    const width = container.offsetWidth;
    const height = Math.max(container.offsetHeight, 200); // 确保最小高度
    
    // 创建相机，根据移动设备调整视角
    const aspectRatio = width / height;
    camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    camera.position.z = 5;
    
    // 创建渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    
    // 确保渲染器的像素比适应移动设备
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // 清空容器并添加渲染器
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    
    // 添加灯光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0xff69b4, 1, 100);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);
    
    // 创建3D卡片
    createCard();
    
    // 创建粒子效果
    createParticles();
    
    // 动画循环
    animate();
}

// 创建3D卡片
function createCard() {
    // 卡片几何体
    const geometry = new THREE.PlaneGeometry(3, 4, 32);
    
    // 创建卡片材质
    const material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        shininess: 100,
        transparent: true,
        opacity: 1
    });
    
    // 创建卡片网格
    card = new THREE.Mesh(geometry, material);
    card.rotation.y = 0; // 初始角度为0，正对屏幕
    scene.add(card);
    
    // 创建卡片文本
    createCardText();
}

// 创建卡片文本
function createCardText() {
    // 创建Canvas元素
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    
    // 确保画布完全透明
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // 设置文本样式 - 透明背景
    context.fillStyle = '#ffffff'; // 白色文本
    context.font = 'bold 64px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.shadowColor = '#000000'; // 添加阴影
    context.shadowBlur = 5; // 阴影模糊度
    
    // 垂直排列文本
    const text = '开始抽卡';
    const lineHeight = 80;
    // 计算起始位置，使文本垂直居中
    const startY = (canvas.height - (text.length * lineHeight)) / 2;
    
    for (let i = 0; i < text.length; i++) {
        context.fillText(text[i], canvas.width / 2, startY + i * lineHeight);
    }
    
    // 创建纹理
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    // 创建文本几何体
    const textGeometry = new THREE.PlaneGeometry(0.6, 2.5, 16);
    const textMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1
    });
    
    // 创建文本网格
    cardText = new THREE.Mesh(textGeometry, textMaterial);
    cardText.position.x = 0; // 调整为居中位置
    cardText.position.z = 0.01; // 稍微向前一点，避免与卡片重叠
    
    // 将文本添加到卡片作为子元素
    card.add(cardText);
}

// 创建光子粒子效果
function createParticles() {
    const particleCount = 500;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesMaterial = new THREE.PointsMaterial({
        color: 0xff69b4,
        size: 0.05,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    // 初始化粒子位置和颜色
    for (let i = 0; i < particleCount * 3; i += 3) {
        // 位置
        positions[i] = (Math.random() - 0.5) * 10;
        positions[i + 1] = (Math.random() - 0.5) * 10;
        positions[i + 2] = (Math.random() - 0.5) * 10;
        
        // 颜色
        const r = 1.0;
        const g = Math.random() * 0.5;
        const b = Math.random() * 0.7 + 0.3;
        
        colors[i] = r;
        colors[i + 1] = g;
        colors[i + 2] = b;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // 创建粒子系统
    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
}

// 抽取卡片函数
function drawCard() {
    if (isDrawing) return;
    
    isDrawing = true;
    const drawButton = document.getElementById('draw-card');
    drawButton.disabled = true;
    drawButton.textContent = '抽取中...';
    
    // 卡片旋转动画
    let rotationSpeed = 0.1;
    let rotationCount = 0;
    const maxRotation = 20;
    
    const rotateAnimation = () => {
        rotationCount++;
        card.rotation.y += rotationSpeed;
        
        // 加速旋转
        if (rotationCount < maxRotation / 2) {
            rotationSpeed *= 1.1;
        } else {
            // 减速旋转
            rotationSpeed *= 0.95;
        }
        
        if (rotationCount < maxRotation) {
            requestAnimationFrame(rotateAnimation);
        } else {
            // 随机选择卡片
            // 根据当前模式选择卡片数据数组
            const isSexyMode = localStorage.getItem('sexy') === 'true';
            const currentCardData = isSexyMode ? sexyCardData : cardData;
            
            const randomIndex = Math.floor(Math.random() * currentCardData.length);
            const selectedCard = currentCardData[randomIndex];
            
            // 更新卡片颜色
            card.material.color.set(selectedCard.color);
            
            // 更新卡片文本
            updateCardText(selectedCard.name);
            
            // 更新卡片描述（逐字显示）
            typeWriter(selectedCard.description, document.getElementById('card-description'));
            
            // 重置卡片位置和旋转
            card.rotation.y = 0; // 保持卡片正对屏幕
            
            // 添加卡片缩放效果
            card.scale.set(0.8, 0.8, 0.8);
            const scaleUp = () => {
                card.scale.x += 0.05;
                card.scale.y += 0.05;
                card.scale.z += 0.05;
                
                if (card.scale.x < 1) {
                    requestAnimationFrame(scaleUp);
                }
            };
            scaleUp();
            
            // 重新启用按钮
            setTimeout(() => {
                drawButton.disabled = false;
                // 恢复按钮文本，根据当前模式决定是否显示星星
                updateModeTitle();
                isDrawing = false;
            }, 1000);
        }
    };
    
    rotateAnimation();
    
    // 增强粒子效果
createBurstParticles();
}

// 逐字显示文字的函数
function typeWriter(text, element) {
    element.textContent = '';
    let index = 0;
    const speed = 50; // 打字速度，单位毫秒
    
    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// 切换Sexy模式的函数
function toggleSexyMode() {
    // 获取当前模式
    let isSexyMode = localStorage.getItem('sexy') === 'true';
    
    // 切换模式
    isSexyMode = !isSexyMode;
    
    // 保存到localStorage
    localStorage.setItem('sexy', isSexyMode.toString());
    
    // 更新标题显示
    updateModeTitle();
}

// 更新模式显示
function updateModeTitle() {
    const drawButton = document.getElementById('draw-card');
    const isSexyMode = localStorage.getItem('sexy') === 'true';
    
    if (isSexyMode) {
        drawButton.innerHTML = '抽取卡片<span class="star">✨</span>';
    } else {
        drawButton.textContent = '抽取卡片';
    }
}

// 更新卡片文本
function updateCardText(text) {
    // 创建Canvas元素
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    
    // 确保画布完全透明
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // 设置文本样式
    context.fillStyle = '#ffffff'; // 白色文本
    context.font = 'bold 64px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.shadowColor = '#000000'; // 添加阴影
    context.shadowBlur = 5; // 阴影模糊度
    
    // 垂直排列文本
    const lineHeight = 80;
    // 计算起始位置，使文本垂直居中
    const startY = (canvas.height - (text.length * lineHeight)) / 2;
    
    for (let i = 0; i < text.length; i++) {
        context.fillText(text[i], canvas.width / 2, startY + i * lineHeight);
    }
    
    // 创建新纹理
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    // 更新文本材质
    cardText.material.map = texture;
}

// 创建爆发粒子效果
function createBurstParticles() {
    const burstCount = 100;
    const burstGeometry = new THREE.BufferGeometry();
    const burstMaterial = new THREE.PointsMaterial({
        color: 0xff69b4,
        size: 0.03,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending
    });
    
    const positions = new Float32Array(burstCount * 3);
    const velocities = new Float32Array(burstCount * 3);
    
    // 初始化爆发粒子
    for (let i = 0; i < burstCount * 3; i += 3) {
        // 从卡片位置开始
        positions[i] = card.position.x;
        positions[i + 1] = card.position.y;
        positions[i + 2] = card.position.z;
        
        // 随机速度
        velocities[i] = (Math.random() - 0.5) * 0.2;
        velocities[i + 1] = (Math.random() - 0.5) * 0.2;
        velocities[i + 2] = (Math.random() - 0.5) * 0.2;
    }
    
    burstGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const burstParticles = new THREE.Points(burstGeometry, burstMaterial);
    scene.add(burstParticles);
    
    // 动画爆发粒子
    let burstOpacity = 1;
    const animateBurst = () => {
        burstOpacity -= 0.02;
        burstMaterial.opacity = burstOpacity;
        
        const positions = burstGeometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += velocities[i];
            positions[i + 1] += velocities[i + 1];
            positions[i + 2] += velocities[i + 2];
        }
        
        burstGeometry.attributes.position.needsUpdate = true;
        
        if (burstOpacity > 0) {
            requestAnimationFrame(animateBurst);
        } else {
            scene.remove(burstParticles);
        }
    };
    
    animateBurst();
}

// 动画循环
function animate() {
    requestAnimationFrame(animate);
    
    // 旋转卡片
    if (!isDrawing) {
        card.rotation.y += 0.005;
    }
    
    // 粒子动画
    if (particles) {
        particles.rotation.y += 0.001;
        particles.rotation.x += 0.001;
    }
    
    renderer.render(scene, camera);
}

// 事件监听
window.addEventListener('DOMContentLoaded', () => {
    // 确保CSS完全加载后再初始化
    window.addEventListener('load', () => {
        // 强制设置canvas容器的宽度
        const canvasContainer = document.getElementById('canvas-container');
        canvasContainer.style.width = '100%';
        
        // 初始化Three.js
        initThreeJS();
        
        // 初始化模式标题显示
        updateModeTitle();
        
        // 手动触发一次窗口 resize 事件，确保 Three.js 内容正确适应容器尺寸
        window.dispatchEvent(new Event('resize'));
        
        const drawButton = document.getElementById('draw-card');
        drawButton.addEventListener('click', drawCard);
    });
});

// 窗口大小调整
window.addEventListener('resize', () => {
    if (camera && renderer) {
        const container = document.getElementById('canvas-container');
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        
        renderer.setSize(width, height);
    }
});
