import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface GlobeViewProps {
  theme?: 'dark' | 'light';
}

export function GlobeView({ theme = 'dark' }: GlobeViewProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeRef = useRef<THREE.Mesh | null>(null);
  const frameRef = useRef<number>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mouse interaction state
  const mouseRef = useRef({
    isDown: false,
    button: -1,
    startX: 0,
    startY: 0,
    rotationX: 0,
    rotationY: 0,
    targetRotationX: 0,
    targetRotationY: 0,
    zoom: 2.5,
    targetZoom: 2.5,
    panX: 0,
    panY: 0,
    targetPanX: 0,
    targetPanY: 0,
  });

  useEffect(() => {
    if (!mountRef.current) return;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let globe: THREE.Mesh;
    let autoRotation = 0;

    const initGlobe = async () => {
      try {
        // Scene setup
        scene = new THREE.Scene();
        sceneRef.current = scene;

        // Camera setup
        camera = new THREE.PerspectiveCamera(
          75,
          mountRef.current!.clientWidth / mountRef.current!.clientHeight,
          0.1,
          1000
        );
        camera.position.set(0, 0, mouseRef.current.zoom);

        // Renderer setup
        renderer = new THREE.WebGLRenderer({ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        });
        renderer.setSize(mountRef.current!.clientWidth, mountRef.current!.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        rendererRef.current = renderer;

        mountRef.current!.appendChild(renderer.domElement);

        // Lighting setup
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 3, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        scene.add(directionalLight);

        // Globe geometry
        const geometry = new THREE.SphereGeometry(1, 64, 64);

        // Create Earth texture
        const textureLoader = new THREE.TextureLoader();
        
        // Load Earth texture with fallback
        const earthTexture = await new Promise<THREE.Texture>((resolve) => {
          textureLoader.load(
            'https://unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg',
            resolve,
            undefined,
            () => {
              // Fallback to a procedural texture if image fails
              const canvas = document.createElement('canvas');
              canvas.width = 1024;
              canvas.height = 512;
              const ctx = canvas.getContext('2d')!;
              
              // Create a simple earth-like texture
              const gradient = ctx.createLinearGradient(0, 0, 0, 512);
              gradient.addColorStop(0, theme === 'dark' ? '#1a365d' : '#4299e1');
              gradient.addColorStop(0.3, theme === 'dark' ? '#2d5a87' : '#63b3ed');
              gradient.addColorStop(0.7, theme === 'dark' ? '#1a365d' : '#4299e1');
              gradient.addColorStop(1, theme === 'dark' ? '#0f2027' : '#2b6cb0');
              
              ctx.fillStyle = gradient;
              ctx.fillRect(0, 0, 1024, 512);
              
              // Add some land-like patterns
              ctx.fillStyle = theme === 'dark' ? '#2d5016' : '#68d391';
              for (let i = 0; i < 50; i++) {
                const x = Math.random() * 1024;
                const y = Math.random() * 512;
                const size = Math.random() * 100 + 20;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
              }
              
              const texture = new THREE.CanvasTexture(canvas);
              resolve(texture);
            }
          );
        });

        // Create bump map for terrain
        const bumpTexture = await new Promise<THREE.Texture>((resolve) => {
          textureLoader.load(
            'https://unpkg.com/three-globe@2.31.0/example/img/earth-topology.png',
            resolve,
            undefined,
            () => {
              // Fallback bump map
              const canvas = document.createElement('canvas');
              canvas.width = 512;
              canvas.height = 256;
              const ctx = canvas.getContext('2d')!;
              
              const imageData = ctx.createImageData(512, 256);
              for (let i = 0; i < imageData.data.length; i += 4) {
                const noise = Math.random() * 100 + 100;
                imageData.data[i] = noise;     // R
                imageData.data[i + 1] = noise; // G
                imageData.data[i + 2] = noise; // B
                imageData.data[i + 3] = 255;   // A
              }
              ctx.putImageData(imageData, 0, 0);
              
              const texture = new THREE.CanvasTexture(canvas);
              resolve(texture);
            }
          );
        });

        // Material setup
        const material = new THREE.MeshPhongMaterial({
          map: earthTexture,
          bumpMap: bumpTexture,
          bumpScale: 0.05,
          shininess: 100,
          transparent: false,
        });

        // Create globe
        globe = new THREE.Mesh(geometry, material);
        globe.castShadow = true;
        globe.receiveShadow = true;
        globeRef.current = globe;
        scene.add(globe);

        // Add atmosphere glow
        const atmosphereGeometry = new THREE.SphereGeometry(1.02, 64, 64);
        const atmosphereMaterial = new THREE.ShaderMaterial({
          vertexShader: `
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            varying vec3 vNormal;
            void main() {
              float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
              gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
            }
          `,
          blending: THREE.AdditiveBlending,
          side: THREE.BackSide,
          transparent: true,
        });
        
        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        scene.add(atmosphere);

        // Add stars background
        const starsGeometry = new THREE.BufferGeometry();
        const starsCount = 2000;
        const positions = new Float32Array(starsCount * 3);
        
        for (let i = 0; i < starsCount * 3; i++) {
          positions[i] = (Math.random() - 0.5) * 100;
        }
        
        starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const starsMaterial = new THREE.PointsMaterial({
          color: 0xffffff,
          size: 0.5,
          transparent: true,
          opacity: theme === 'dark' ? 0.8 : 0.3,
        });
        
        const stars = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(stars);

        // Mouse event handlers
        const handleMouseDown = (event: MouseEvent) => {
          event.preventDefault();
          mouseRef.current.isDown = true;
          mouseRef.current.button = event.button;
          mouseRef.current.startX = event.clientX;
          mouseRef.current.startY = event.clientY;
        };

        const handleMouseMove = (event: MouseEvent) => {
          if (!mouseRef.current.isDown) return;
          
          const deltaX = event.clientX - mouseRef.current.startX;
          const deltaY = event.clientY - mouseRef.current.startY;
          
          if (mouseRef.current.button === 0) { // Left mouse - rotate
            mouseRef.current.targetRotationY = mouseRef.current.rotationY + deltaX * 0.01;
            mouseRef.current.targetRotationX = mouseRef.current.rotationX + deltaY * 0.01;
          } else if (mouseRef.current.button === 2) { // Right mouse - pan
            mouseRef.current.targetPanX = mouseRef.current.panX + deltaX * 0.001;
            mouseRef.current.targetPanY = mouseRef.current.panY - deltaY * 0.001;
          }
        };

        const handleMouseUp = () => {
          if (mouseRef.current.isDown) {
            mouseRef.current.rotationX = mouseRef.current.targetRotationX;
            mouseRef.current.rotationY = mouseRef.current.targetRotationY;
            mouseRef.current.panX = mouseRef.current.targetPanX;
            mouseRef.current.panY = mouseRef.current.targetPanY;
          }
          mouseRef.current.isDown = false;
          mouseRef.current.button = -1;
        };

        const handleWheel = (event: WheelEvent) => {
          event.preventDefault();
          const delta = event.deltaY > 0 ? 0.1 : -0.1;
          mouseRef.current.targetZoom = Math.max(1.5, Math.min(8, mouseRef.current.targetZoom + delta));
        };

        const handleDoubleClick = () => {
          // Reset to default view
          mouseRef.current.targetRotationX = 0;
          mouseRef.current.targetRotationY = 0;
          mouseRef.current.targetZoom = 2.5;
          mouseRef.current.targetPanX = 0;
          mouseRef.current.targetPanY = 0;
        };

        const handleKeyDown = (event: KeyboardEvent) => {
          const panSpeed = 0.05;
          const zoomSpeed = 0.2;
          
          switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
              mouseRef.current.targetPanY += panSpeed;
              break;
            case 'ArrowDown':
            case 'KeyS':
              mouseRef.current.targetPanY -= panSpeed;
              break;
            case 'ArrowLeft':
            case 'KeyA':
              mouseRef.current.targetPanX -= panSpeed;
              break;
            case 'ArrowRight':
            case 'KeyD':
              mouseRef.current.targetPanX += panSpeed;
              break;
            case 'Equal':
            case 'NumpadAdd':
              mouseRef.current.targetZoom = Math.max(1.5, mouseRef.current.targetZoom - zoomSpeed);
              break;
            case 'Minus':
            case 'NumpadSubtract':
              mouseRef.current.targetZoom = Math.min(8, mouseRef.current.targetZoom + zoomSpeed);
              break;
          }
        };

        // Add event listeners
        renderer.domElement.addEventListener('mousedown', handleMouseDown);
        renderer.domElement.addEventListener('mousemove', handleMouseMove);
        renderer.domElement.addEventListener('mouseup', handleMouseUp);
        renderer.domElement.addEventListener('wheel', handleWheel);
        renderer.domElement.addEventListener('dblclick', handleDoubleClick);
        renderer.domElement.addEventListener('contextmenu', (e) => e.preventDefault());
        window.addEventListener('keydown', handleKeyDown);

        // Animation loop
        const animate = () => {
          frameRef.current = requestAnimationFrame(animate);

          // Auto rotation when not interacting
          if (!mouseRef.current.isDown) {
            autoRotation += 0.005;
          }

          // Smooth interpolation
          mouseRef.current.rotationX += (mouseRef.current.targetRotationX - mouseRef.current.rotationX) * 0.1;
          mouseRef.current.rotationY += (mouseRef.current.targetRotationY - mouseRef.current.rotationY) * 0.1;
          mouseRef.current.zoom += (mouseRef.current.targetZoom - mouseRef.current.zoom) * 0.1;
          mouseRef.current.panX += (mouseRef.current.targetPanX - mouseRef.current.panX) * 0.1;
          mouseRef.current.panY += (mouseRef.current.targetPanY - mouseRef.current.panY) * 0.1;

          // Apply transformations
          if (globe) {
            globe.rotation.x = mouseRef.current.rotationX;
            globe.rotation.y = autoRotation + mouseRef.current.rotationY;
          }

          // Update camera
          camera.position.set(mouseRef.current.panX, mouseRef.current.panY, mouseRef.current.zoom);
          camera.lookAt(0, 0, 0);

          // Rotate stars slowly
          if (stars) {
            stars.rotation.x += 0.0001;
            stars.rotation.y += 0.0002;
          }

          renderer.render(scene, camera);
        };

        animate();

        // Handle resize
        const handleResize = () => {
          if (!mountRef.current) return;
          
          const width = mountRef.current.clientWidth;
          const height = mountRef.current.clientHeight;
          
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);

        setIsLoading(false);

        // Cleanup function
        return () => {
          if (frameRef.current) {
            cancelAnimationFrame(frameRef.current);
          }
          
          window.removeEventListener('resize', handleResize);
          window.removeEventListener('keydown', handleKeyDown);
          
          if (renderer.domElement) {
            renderer.domElement.removeEventListener('mousedown', handleMouseDown);
            renderer.domElement.removeEventListener('mousemove', handleMouseMove);
            renderer.domElement.removeEventListener('mouseup', handleMouseUp);
            renderer.domElement.removeEventListener('wheel', handleWheel);
            renderer.domElement.removeEventListener('dblclick', handleDoubleClick);
            renderer.domElement.removeEventListener('contextmenu', (e) => e.preventDefault());
          }
          
          if (mountRef.current && renderer.domElement) {
            mountRef.current.removeChild(renderer.domElement);
          }
          
          // Dispose of Three.js objects
          geometry.dispose();
          material.dispose();
          atmosphereGeometry.dispose();
          atmosphereMaterial.dispose();
          starsGeometry.dispose();
          starsMaterial.dispose();
          earthTexture.dispose();
          bumpTexture.dispose();
          renderer.dispose();
        };

      } catch (err) {
        console.error('Failed to initialize globe:', err);
        setError('Failed to load 3D globe');
        setIsLoading(false);
      }
    };

    initGlobe();

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [theme]);

  if (error) {
    return (
      <div className="w-full h-[600px] rounded-xl overflow-hidden relative flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🌍</div>
          <h3 className="text-xl font-bold mb-2">Globe View Error</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <p className="text-sm text-muted-foreground">
            Please try refreshing the page or switch to Map view.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading 3D Globe...</p>
          </div>
        </div>
      )}
      
      <div 
        ref={mountRef} 
        className="w-full h-full"
        style={{ 
          background: theme === 'dark' 
            ? 'radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a0f 100%)' 
            : 'radial-gradient(ellipse at center, #e8f4f8 0%, #c9d6df 100%)'
        }}
      />

      {/* Controls info */}
      <div className="absolute bottom-4 left-4 bg-card/80 backdrop-blur-sm rounded-lg px-4 py-3 border border-border/50 max-w-xs">
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="font-semibold mb-2">Controls:</div>
          <div>🖱️ <strong>Left drag:</strong> Rotate globe</div>
          <div>🖱️ <strong>Right drag:</strong> Pan camera</div>
          <div>🖱️ <strong>Wheel:</strong> Zoom in/out</div>
          <div>⌨️ <strong>Arrow keys:</strong> Pan</div>
          <div>⌨️ <strong>+/-:</strong> Zoom</div>
          <div>🖱️ <strong>Double-click:</strong> Reset view</div>
        </div>
      </div>

      {/* Performance info */}
      <div className="absolute top-4 right-4 bg-card/80 backdrop-blur-sm rounded-lg px-3 py-1 border border-border/50">
        <p className="text-xs text-muted-foreground">
          WebGL • Interactive 3D
        </p>
      </div>
    </div>
  );
}