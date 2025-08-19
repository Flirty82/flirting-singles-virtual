// frontend/src/utils/vrUtils.js

/**
 * VR Utility Functions for Paranormal Investigation Game
 */

// VR Device Detection
export const detectVRCapabilities = async () => {
  const capabilities = {
    vrSupported: false,
    handTracking: false,
    eyeTracking: false,
    roomScale: false,
    headsetType: 'unknown',
    controllers: 0,
    displayRefreshRate: 60
  };

  if (!('xr' in navigator)) {
    return capabilities;
  }

  try {
    // Check basic VR support
    capabilities.vrSupported = await navigator.xr.isSessionSupported('immersive-vr');
    
    if (capabilities.vrSupported) {
      // Detect headset type from user agent
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.includes('oculus') || userAgent.includes('meta')) {
        capabilities.headsetType = 'meta_quest';
      } else if (userAgent.includes('vive')) {
        capabilities.headsetType = 'htc_vive';
      } else if (userAgent.includes('wmr')) {
        capabilities.headsetType = 'windows_mr';
      } else if (userAgent.includes('pico')) {
        capabilities.headsetType = 'pico';
      }

      // Check advanced features
      try {
        capabilities.handTracking = await navigator.xr.isSessionSupported('immersive-vr', {
          optionalFeatures: ['hand-tracking']
        });
      } catch (e) {
        capabilities.handTracking = false;
      }

      try {
        capabilities.roomScale = await navigator.xr.isSessionSupported('immersive-vr', {
          optionalFeatures: ['bounded-floor']
        });
      } catch (e) {
        capabilities.roomScale = false;
      }
    }
  } catch (error) {
    console.warn('Error detecting VR capabilities:', error);
  }

  return capabilities;
};

// VR Session Management
export const createVRSession = async (requiredFeatures = [], optionalFeatures = []) => {
  if (!('xr' in navigator)) {
    throw new Error('WebXR not supported');
  }

  const sessionInit = {
    requiredFeatures: ['local-floor', ...requiredFeatures],
    optionalFeatures: [
      'hand-tracking',
      'eye-tracking', 
      'bounded-floor',
      'layers',
      ...optionalFeatures
    ]
  };

  try {
    const session = await navigator.xr.requestSession('immersive-vr', sessionInit);
    return session;
  } catch (error) {
    throw new Error(`Failed to create VR session: ${error.message}`);
  }
};

// Spatial Audio Utilities
export const calculateSpatialAudio = (listenerPos, sourcePos, maxDistance = 10) => {
  const distance = Math.sqrt(
    Math.pow(listenerPos.x - sourcePos.x, 2) +
    Math.pow(listenerPos.y - sourcePos.y, 2) +
    Math.pow(listenerPos.z - sourcePos.z, 2)
  );

  const volume = Math.max(0, 1 - (distance / maxDistance));
  
  // Calculate panning based on X position
  const pan = Math.max(-1, Math.min(1, (sourcePos.x - listenerPos.x) / maxDistance));
  
  return { volume, pan, distance };
};

// Hand Tracking Utilities
export const getHandGestures = (handPose) => {
  if (!handPose) return null;

  const gestures = {
    pointing: false,
    grabbing: false,
    openPalm: false,
    thumbsUp: false
  };

  try {
    const indexTip = handPose['index-finger-tip'];
    const indexPip = handPose['index-finger-pip'];
    const thumbTip = handPose['thumb-tip'];
    const middleTip = handPose['middle-finger-tip'];
    const ringTip = handPose['ring-finger-tip'];
    const pinkyTip = handPose['pinky-finger-tip'];

    if (indexTip && indexPip) {
      // Pointing gesture - index finger extended
      const indexExtended = indexTip.position.z < indexPip.position.z;
      gestures.pointing = indexExtended;
    }

    if (thumbTip && indexTip) {
      // Grabbing gesture - thumb and index close together
      const distance = Math.sqrt(
        Math.pow(thumbTip.position.x - indexTip.position.x, 2) +
        Math.pow(thumbTip.position.y - indexTip.position.y, 2) +
        Math.pow(thumbTip.position.z - indexTip.position.z, 2)
      );
      gestures.grabbing = distance < 0.03; // 3cm threshold
    }

    // Open palm - all fingers extended
    if (indexTip && middleTip && ringTip && pinkyTip) {
      gestures.openPalm = true; // Simplified check
    }

  } catch (error) {
    console.warn('Error processing hand gestures:', error);
  }

  return gestures;
};

// Equipment Interaction
export const checkEquipmentInteraction = (handPosition, equipmentPosition, threshold = 0.1) => {
  const distance = Math.sqrt(
    Math.pow(handPosition.x - equipmentPosition.x, 2) +
    Math.pow(handPosition.y - equipmentPosition.y, 2) +
    Math.pow(handPosition.z - equipmentPosition.z, 2)
  );

  return distance <= threshold;
};

// Room Scale Utilities
export const definePlayArea = (bounds) => {
  return {
    center: { x: 0, y: 0, z: 0 },
    width: bounds.width || 2,
    depth: bounds.depth || 2,
    height: bounds.height || 2.5,
    boundaries: bounds.geometry || []
  };
};

export const checkBoundaries = (position, playArea) => {
  const halfWidth = playArea.width / 2;
  const halfDepth = playArea.depth / 2;

  return {
    inBounds: (
      position.x >= -halfWidth && position.x <= halfWidth &&
      position.z >= -halfDepth && position.z <= halfDepth &&
      position.y >= 0 && position.y <= playArea.height
    ),
    distanceToEdge: Math.min(
      halfWidth - Math.abs(position.x),
      halfDepth - Math.abs(position.z)
    )
  };
};

// Haptic Feedback
export const triggerHapticFeedback = (session, intensity = 0.5, duration = 100) => {
  if (!session || !session.inputSources) return;

  session.inputSources.forEach(inputSource => {
    if (inputSource.gamepad && inputSource.gamepad.hapticActuators) {
      inputSource.gamepad.hapticActuators.forEach(actuator => {
        actuator.pulse(intensity, duration).catch(console.warn);
      });
    }
  });
};

// Performance Monitoring
export const monitorVRPerformance = () => {
  const stats = {
    fps: 0,
    frameTime: 0,
    droppedFrames: 0,
    lastFrameTime: performance.now()
  };

  let frameCount = 0;
  let totalFrameTime = 0;

  const updateStats = (timestamp) => {
    const deltaTime = timestamp - stats.lastFrameTime;
    stats.frameTime = deltaTime;
    stats.fps = 1000 / deltaTime;
    
    frameCount++;
    totalFrameTime += deltaTime;

    // Calculate average every 60 frames
    if (frameCount >= 60) {
      stats.avgFps = 60000 / totalFrameTime;
      frameCount = 0;
      totalFrameTime = 0;
    }

    stats.lastFrameTime = timestamp;
    return stats;
  };

  return { updateStats, getStats: () => stats };
};

// VR Audio Context
export const createVRAudioContext = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  const createPositionalAudio = (audioBuffer, position = { x: 0, y: 0, z: 0 }) => {
    const source = audioContext.createBufferSource();
    const panner = audioContext.createPanner();
    
    source.buffer = audioBuffer;
    
    panner.panningModel = 'HRTF';
    panner.distanceModel = 'inverse';
    panner.refDistance = 1;
    panner.maxDistance = 10000;
    panner.rolloffFactor = 1;
    panner.coneInnerAngle = 360;
    panner.coneOuterAngle = 0;
    panner.coneOuterGain = 0;
    
    panner.positionX.setValueAtTime(position.x, audioContext.currentTime);
    panner.positionY.setValueAtTime(position.y, audioContext.currentTime);
    panner.positionZ.setValueAtTime(position.z, audioContext.currentTime);
    
    source.connect(panner);
    panner.connect(audioContext.destination);
    
    return { source, panner };
  };

  const updateListenerPosition = (position, orientation) => {
    const listener = audioContext.listener;
    
    if (listener.positionX) {
      listener.positionX.setValueAtTime(position.x, audioContext.currentTime);
      listener.positionY.setValueAtTime(position.y, audioContext.currentTime);
      listener.positionZ.setValueAtTime(position.z, audioContext.currentTime);
      
      listener.forwardX.setValueAtTime(orientation.forward.x, audioContext.currentTime);
      listener.forwardY.setValueAtTime(orientation.forward.y, audioContext.currentTime);
      listener.forwardZ.setValueAtTime(orientation.forward.z, audioContext.currentTime);
      
      listener.upX.setValueAtTime(orientation.up.x, audioContext.currentTime);
      listener.upY.setValueAtTime(orientation.up.y, audioContext.currentTime);
      listener.upZ.setValueAtTime(orientation.up.z, audioContext.currentTime);
    }
  };

  return { audioContext, createPositionalAudio, updateListenerPosition };
};

// Equipment-specific VR functions
export const vrEquipmentFunctions = {
  emfDetector: {
    getReadingFromPosition: (position, ghostPosition, baseReading = 0) => {
      const distance = Math.sqrt(
        Math.pow(position.x - ghostPosition.x, 2) +
        Math.pow(position.y - ghostPosition.y, 2) +
        Math.pow(position.z - ghostPosition.z, 2)
      );
      
      const maxRange = 5; // meters
      const intensity = Math.max(0, 1 - (distance / maxRange));
      return baseReading + (intensity * 50);
    }
  },

  thermalCamera: {
    detectColdSpots: (viewDirection, ghostPosition, playerPosition) => {
      // Check if ghost is in camera's field of view
      const toGhost = {
        x: ghostPosition.x - playerPosition.x,
        y: ghostPosition.y - playerPosition.y,
        z: ghostPosition.z - playerPosition.z
      };

      const dotProduct = 
        viewDirection.x * toGhost.x +
        viewDirection.y * toGhost.y +
        viewDirection.z * toGhost.z;

      const angle = Math.acos(dotProduct / (
        Math.sqrt(viewDirection.x ** 2 + viewDirection.y ** 2 + viewDirection.z ** 2) *
        Math.sqrt(toGhost.x ** 2 + toGhost.y ** 2 + toGhost.z ** 2)
      ));

      return angle < Math.PI / 6; // 30 degree field of view
    }
  },

  spiritBox: {
    processAudioForResponses: (audioData, ghostActivity) => {
      // Simulate spirit box responses based on ghost activity
      const responseChance = ghostActivity / 100 * 0.1; // 10% max chance
      return Math.random() < responseChance;
    }
  }
};

// Error Handling
export const handleVRError = (error) => {
  const errorMessages = {
    'NotSupportedError': 'VR is not supported on this device',
    'NotAllowedError': 'VR access was denied by the user',
    'InvalidStateError': 'VR session is in an invalid state',
    'SecurityError': 'VR access blocked by security policy',
    'AbortError': 'VR session was aborted',
    'NetworkError': 'Network error during VR session'
  };

  const message = errorMessages[error.name] || `VR Error: ${error.message}`;
  
  console.error('VR Error:', error);
  
  return {
    type: error.name,
    message,
    recoverable: ['InvalidStateError', 'AbortError'].includes(error.name)
  };
};

// VR Comfort Settings
export const applyComfortSettings = (session, settings) => {
  const {
    snapTurning = false,
    teleportMovement = false,
    motionSmoothing = true,
    vignetteOnMotion = true,
    reducedMotion = false
  } = settings;

  // These would typically be applied to the VR renderer
  // Implementation depends on the specific VR framework being used
  return {
    snapTurning,
    teleportMovement,
    motionSmoothing,
    vignetteOnMotion,
    reducedMotion
  };
};

export default {
  detectVRCapabilities,
  createVRSession,
  calculateSpatialAudio,
  getHandGestures,
  checkEquipmentInteraction,
  definePlayArea,
  checkBoundaries,
  triggerHapticFeedback,
  monitorVRPerformance,
  createVRAudioContext,
  vrEquipmentFunctions,
  handleVRError,
  applyComfortSettings
};