import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

const NeuralMeshBackground = () => {
  const mountRef = useRef(null);
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Configuration - exactly from neural.html
    let NEURON_COUNT = 800; // Reduced from 3000 for background performance
    const BASE_RADIUS = 10;
    const MAX_SYNAPSES_PER_NEURON = 8;
    const MIN_SYNAPSES_PER_EVENT = 4;
    const MAX_SYNAPSES_PER_EVENT = 8;
    const STIFFNESS = 0.003;
    const MAX_SYNAPSE_DISTANCE = 8;
    const MIN_SYNAPSE_DISTANCE = 2;
    const MERGE_ANIMATION_MIN = 500;
    const MERGE_ANIMATION_MAX = 1800;
    
    // Rotation configuration
    const ROTATION_SPEED_X = 0.0001;
    const ROTATION_SPEED_Y = 0.0012;
    const ROTATION_SPEED_Z = 0.0000;
    
    // Camera position configuration
    const CAMERA_POSITION_X = 0;
    const CAMERA_POSITION_Y = 0;
    const CAMERA_POSITION_Z = 18;
    
    // Visual configuration
    const SYNAPSE_THICKNESS = 2.0;
    const BLUR_AMOUNT = 0.002;
    const BLUR_FOCUS = 0.5;
    
    // Color configuration (HSL values)
    const NEURON_HUE = 0.58;
    const NEURON_SATURATION = 0.8;
    const NEURON_LIGHTNESS = 0.5;
    const SYNAPSE_COLOR = '#4a7ba7';
    
    // Electrical spark configuration
    const MAX_CONCURRENT_SPARKS = 5;
    const SPARK_SPEED = 0.02;
    const SPARK_COLOR = '#FFFFFF';
    const SPARK_SIZE = 0.08;
    
    const container = mountRef.current;
    const containerRect = container.getBoundingClientRect();
    
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog('#0f0f17', 5, 40);
    
    const camera = new THREE.PerspectiveCamera(50, containerRect.width / containerRect.height, 0.1, 100);
    camera.position.set(CAMERA_POSITION_X, CAMERA_POSITION_Y, CAMERA_POSITION_Z);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRect.width, containerRect.height);
    container.appendChild(renderer.domElement);
    
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    
    // Bloom for glow effect
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(containerRect.width, containerRect.height), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0;
    bloomPass.strength = 1.2;
    bloomPass.radius = 0.85;
    composer.addPass(bloomPass);
    
    // Custom depth blur shader
    const depthBlurShader = {
      uniforms: {
        tDiffuse: { value: null },
        focus: { value: BLUR_FOCUS },
        blur: { value: BLUR_AMOUNT }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float focus;
        uniform float blur;
        varying vec2 vUv;
        
        void main() {
          vec4 color = texture2D(tDiffuse, vUv);
          
          // Add radial blur from center
          vec2 center = vec2(0.5, 0.5);
          float dist = distance(vUv, center);
          float blurAmount = smoothstep(0.2, 0.8, dist) * blur;
          
          // Sample surrounding pixels for blur
          vec4 blurred = color;
          for (float i = -2.0; i <= 2.0; i += 1.0) {
            for (float j = -2.0; j <= 2.0; j += 1.0) {
              vec2 offset = vec2(i, j) * blurAmount;
              blurred += texture2D(tDiffuse, vUv + offset);
            }
          }
          blurred /= 25.0;
          
          // Mix original and blurred based on distance from center
          gl_FragColor = mix(color, blurred, smoothstep(0.1, 0.7, dist));
        }
      `
    };
    
    const depthBlurPass = new ShaderPass(depthBlurShader);
    composer.addPass(depthBlurPass);
    
    const neurons = [];
    const neuronMap = new Map();
    const pulseTimers = new Map();
    const connections = new Set();
    const mergingNeurons = new Map();
    const adjacencyMap = new Map();
    let nextNeuronId = 0;
    
    // Spark tracking
    const sparks = [];
    let nextSparkId = 0;
    let lastSparkTime = 0;
    
    // Create a group to hold all neurons
    const neuronGroup = new THREE.Group();
    scene.add(neuronGroup);
    
    // Create line mesh for synapses
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: SYNAPSE_COLOR, 
      transparent: true, 
      opacity: 0.25,
      blending: THREE.AdditiveBlending
    });
    const MAX_CONNECTIONS = 30000;
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(MAX_CONNECTIONS * 2 * 3);
    const lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    neuronGroup.add(lineMesh);
    
    function createNeuron(x, y, z) {
      const geo = new THREE.SphereGeometry(0.15, 12, 12);
      const mat = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color().setHSL(NEURON_HUE, NEURON_SATURATION, NEURON_LIGHTNESS),
        transparent: true,
        opacity: 0.7
      });
      const sphere = new THREE.Mesh(geo, mat);
      const id = nextNeuronId++;
      
      sphere.position.set(x, y, z);
      sphere.userData.id = id;
      sphere.userData.baseScale = 1;
      sphere.userData.originalMaterial = mat;
      
      neuronGroup.add(sphere);
      neurons.push(sphere);
      neuronMap.set(id, sphere);
      adjacencyMap.set(id, new Set());
      pulseTimers.set(sphere, Math.random() * Math.PI * 2);
      
      return sphere;
    }
    
    // Create neurons in a filled ellipsoid volume
    for (let i = 0; i < NEURON_COUNT; i++) {
      let x, y, z;
      let isInside = false;
      
      while (!isInside) {
        x = (Math.random() - 0.5) * 2 * BASE_RADIUS * 3.5;
        y = (Math.random() - 0.5) * 2 * BASE_RADIUS * 1.0;
        z = (Math.random() - 0.5) * 2 * BASE_RADIUS * 1.5;
        
        const ellipsoidCheck = (x / (BASE_RADIUS * 3.5)) ** 2 + 
                              (y / (BASE_RADIUS * 1.0)) ** 2 + 
                              (z / (BASE_RADIUS * 1.5)) ** 2;
        
        if (ellipsoidCheck <= 1) {
          const noise = 0.8 + Math.random() * 0.4;
          x *= noise;
          y *= noise;
          z *= noise;
          isInside = true;
        }
      }
      
      const neuron = createNeuron(x, y, z);
      neuron.userData.originalPos = new THREE.Vector3(x, y, z);
    }
    
    function createConnection(neuronId1, neuronId2) {
      const adj1 = adjacencyMap.get(neuronId1);
      const adj2 = adjacencyMap.get(neuronId2);
      
      if (!adj1 || !adj2) return;
      
      const key = neuronId1 < neuronId2 ? `${neuronId1}-${neuronId2}` : `${neuronId2}-${neuronId1}`;
      connections.add(key);
      adj1.add(neuronId2);
      adj2.add(neuronId1);
    }
    
    function removeConnection(neuronId1, neuronId2) {
      const key = neuronId1 < neuronId2 ? `${neuronId1}-${neuronId2}` : `${neuronId2}-${neuronId1}`;
      connections.delete(key);
      
      const adj1 = adjacencyMap.get(neuronId1);
      const adj2 = adjacencyMap.get(neuronId2);
      
      if (adj1) adj1.delete(neuronId2);
      if (adj2) adj2.delete(neuronId1);
    }
    
    function initializeConnections() {
      const minConnections = MIN_SYNAPSES_PER_EVENT;
      const maxConnections = Math.max(5, minConnections);
      
      for (const neuron1 of neurons) {
        const id1 = neuron1.userData.id;
        const distances = [];
        
        for (const neuron2 of neurons) {
          const id2 = neuron2.userData.id;
          if (id1 !== id2) {
            const dist = neuron1.position.distanceToSquared(neuron2.position);
            distances.push({ id: id2, dist });
          }
        }
        
        distances.sort((a, b) => a.dist - b.dist);
        let connectionsMade = adjacencyMap.get(id1).size;
        
        for (let k = 0; k < distances.length && connectionsMade < maxConnections; k++) {
          const id2 = distances[k].id;
          if (!adjacencyMap.get(id1).has(id2)) {
            createConnection(id1, id2);
            connectionsMade++;
          }
        }
        
        if (connectionsMade < minConnections) {
          for (let k = 0; k < distances.length && connectionsMade < minConnections; k++) {
            const id2 = distances[k].id;
            if (!adjacencyMap.get(id1).has(id2)) {
              createConnection(id1, id2);
              connectionsMade++;
            }
          }
        }
      }
      
      // Update neuron sizes based on connections
      for (const neuron of neurons) {
        const id = neuron.userData.id;
        const connectionCount = adjacencyMap.get(id).size;
        const size = 0.15 + 0.05 * Math.min(connectionCount, MAX_SYNAPSES_PER_NEURON);
        neuron.userData.baseScale = size;
        neuron.scale.set(size, size, size);
      }
    }
    
    // Create spark mesh
    function createSpark(startNeuron, endNeuron) {
      const geo = new THREE.SphereGeometry(SPARK_SIZE, 8, 8);
      const mat = new THREE.MeshBasicMaterial({
        color: SPARK_COLOR,
        transparent: true,
        opacity: 0
      });
      const spark = new THREE.Mesh(geo, mat);
      spark.userData.id = nextSparkId++;
      spark.userData.startNeuron = startNeuron;
      spark.userData.endNeuron = endNeuron;
      spark.userData.progress = 0;
      
      neuronGroup.add(spark);
      sparks.push(spark);
      
      return spark;
    }
    
    let time = 0;
    
    function animate() {
      const delta = 0.016;
      time += delta;
      
      // Create new sparks periodically
      if (time - lastSparkTime > 0.5 && sparks.length < MAX_CONCURRENT_SPARKS && connections.size > 0) {
        lastSparkTime = time;
        
        // Pick a random connection
        const connectionArray = Array.from(connections);
        const randomConn = connectionArray[Math.floor(Math.random() * connectionArray.length)];
        const [id1, id2] = randomConn.split('-').map(Number);
        const neuron1 = neuronMap.get(id1);
        const neuron2 = neuronMap.get(id2);
        
        if (neuron1 && neuron2) {
          createSpark(neuron1, neuron2);
        }
      }
      
      // Update sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const spark = sparks[i];
        spark.userData.progress += SPARK_SPEED;
        
        if (spark.userData.progress >= 1) {
          // Remove completed spark
          neuronGroup.remove(spark);
          sparks.splice(i, 1);
        } else {
          // Update spark position
          const start = spark.userData.startNeuron.position;
          const end = spark.userData.endNeuron.position;
          spark.position.lerpVectors(start, end, spark.userData.progress);
          
          // Fade in and out
          const opacity = spark.userData.progress < 0.1 ? spark.userData.progress * 10 : 
                         spark.userData.progress > 0.9 ? (1 - spark.userData.progress) * 10 : 
                         1;
          spark.material.opacity = opacity;
        }
      }
      
      // Animate neurons
      for (const n of neurons) {
        if (!n.userData.id) continue;
        
        const p = n.position;
        const originalPos = n.userData.originalPos;
        
        // Create organic movement
        const wobbleX = Math.sin(time * 0.5 + n.userData.id * 0.1) * 0.3;
        const wobbleY = Math.cos(time * 0.4 + n.userData.id * 0.2) * 0.2;
        const wobbleZ = Math.sin(time * 0.3 + n.userData.id * 0.15) * 0.25;
        
        // Breathing effect
        const breathe = 1 + Math.sin(time * 0.2) * 0.05;
        
        p.x = originalPos.x * breathe + wobbleX;
        p.y = originalPos.y * breathe + wobbleY;
        p.z = originalPos.z * breathe + wobbleZ;
        
        if (!n.userData.baseScale) continue;
        
        const pulsePhase = pulseTimers.get(n) || 0;
        const baseScale = n.userData.baseScale;
        const activity = Math.sin(time * 2 + pulsePhase) * 0.5 + 0.5;
        const pulse = baseScale * (1 + activity * 0.15);
        n.scale.setScalar(pulse);
        
        // Change brightness based on activity
        const brightness = NEURON_LIGHTNESS * (0.8 + activity * 0.4);
        n.material.color.setHSL(NEURON_HUE, NEURON_SATURATION, brightness);
      }
      
      // Update connections - simplified for now (no merging/splitting)
      let ptr = 0;
      for (const connectionKey of connections) {
        const [id1, id2] = connectionKey.split('-').map(Number);
        const neuron1 = neuronMap.get(id1);
        const neuron2 = neuronMap.get(id2);
        
        if (!neuron1 || !neuron2 || ptr + 6 > linePositions.length) continue;
        
        linePositions.set(neuron1.position.toArray(), ptr);
        ptr += 3;
        linePositions.set(neuron2.position.toArray(), ptr);
        ptr += 3;
      }
      
      lineGeometry.setDrawRange(0, ptr / 3);
      lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions.slice(0, ptr), 3));
      lineGeometry.attributes.position.needsUpdate = true;
      
      // Rotate the group
      neuronGroup.rotation.x += ROTATION_SPEED_X;
      neuronGroup.rotation.y += ROTATION_SPEED_Y;
      neuronGroup.rotation.z += ROTATION_SPEED_Z;
      
      composer.render();
      requestAnimationFrame(animate);
    }
    
    initializeConnections();
    animate();
    
    // Handle resize
    const handleResize = () => {
      const newRect = container.getBoundingClientRect();
      camera.aspect = newRect.width / newRect.height;
      camera.updateProjectionMatrix();
      renderer.setSize(newRect.width, newRect.height);
      composer.setSize(newRect.width, newRect.height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);
  
  return <div ref={mountRef} className="neural-mesh-background" />;
};

export default NeuralMeshBackground;