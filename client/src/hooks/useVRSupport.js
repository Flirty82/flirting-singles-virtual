// src/hooks/useVRSupport.js
import { useState, useEffect, useRef } from 'react';

export const useVRSupport = () => {
  const [vrSupported, setVrSupported] = useState(false);
  const [vrSession, setVrSession] = useState(null);
  const [vrConnected, setVrConnected] = useState(false);
  const [vrHeadset, setVrHeadset] = useState(null);
  const [handTracking, setHandTracking] = useState(false);
  const [eyeTracking, setEyeTracking] = useState(false);
  const [roomScale, setRoomScale] = useState(false);
  const [performance, setPerformance] = useState({
    fps: 0,
    latency: 0,
    quality: 'high'
  });

  const sessionRef = useRef(null);
  const frameRef = useRef(null);

  // Check VR capabilities on mount
  useEffect(() => {
    checkVRSupport();
    return () => {
      if (sessionRef.current) {
        endVRSession();
      }
    };
  }, []);

  // Performance monitoring
  useEffect(() => {
    if (vrConnected) {
      const performanceInterval = setInterval(() => {
        updatePerformanceMetrics();
      }, 1000);
      return () => clearInterval(performanceInterval);
    }
  }, [vrConnected]);

  const checkVRSupport = async () => {
    try {
      if (!('xr' in navigator)) {
        console.log('WebXR not supported');
        setVrSupported(false);
        return;
      }

      // Check for immersive VR support
      const isVRSupported = await navigator.xr.isSessionSupported('immersive-vr');
      setVrSupported(isVRSupported);

      if (isVRSupported) {
        // Detect additional capabilities
        await detectVRCapabilities();
        detectHeadsetType();
      }
    } catch (error) {
      console.error('Error checking VR support:', error);
      setVrSupported(false);
    }
  };

  const detectVRCapabilities = async () => {
    try {
      // Check hand tracking
      const handTrackingSupported = await navigator.xr.isSessionSupported('immersive-vr', {
        optionalFeatures: ['hand-tracking']
      });
      setHandTracking(handTrackingSupported);

      // Check eye tracking
      const eyeTrackingSupported = await navigator.xr.isSessionSupported('immersive-vr', {
        optionalFeatures: ['eye-tracking']
      });
      setEyeTracking(eyeTrackingSupported);

      // Check room scale
      const roomScaleSupported = await navigator.xr.isSessionSupported('immersive-vr', {
        optionalFeatures: ['bounded-floor']
      });
      setRoomScale(roomScaleSupported);
    } catch (error) {
      console.error('Error detecting VR capabilities:', error);
    }
  };

  const detectHeadsetType = () => {
    // Detect headset based on user agent and available features
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('oculus') || userAgent.includes('meta')) {
      setVrHeadset('Meta Quest');
    } else if (userAgent.includes('vive')) {
      setVrHeadset('HTC Vive');
    } else if (userAgent.includes('wmr') || userAgent.includes('windows mixed reality')) {
      setVrHeadset('Windows Mixed Reality');
    } else if (userAgent.includes('pico')) {
      setVrHeadset('Pico VR');
    } else {
      setVrHeadset('Generic VR Headset');
    }
  };

  const startVRSession = async (requiredFeatures = [], optionalFeatures = []) => {
    if (!vrSupported) {
      throw new Error('VR not supported on this device');
    }

    try {
      const sessionInit = {
        requiredFeatures: ['local-floor', ...requiredFeatures],
        optionalFeatures: ['hand-tracking', 'eye-tracking', 'bounded-floor', ...optionalFeatures]
      };

      const session = await navigator.xr.requestSession('immersive-vr', sessionInit);
      sessionRef.current = session;
      setVrSession(session);
      setVrConnected(true);

      // Set up session event listeners
      session.addEventListener('end', handleSessionEnd);
      session.addEventListener('inputsourceschange', handleInputSourcesChange);
      session.addEventListener('select', handleSelect);
      session.addEventListener('selectstart', handleSelectStart);
      session.addEventListener('selectend', handleSelectEnd);

      // Start render loop
      session.requestAnimationFrame(onXRFrame);

      return session;
    } catch (error) {
      console.error('Failed to start VR session:', error);
      throw error;
    }
  };

  const endVRSession = async () => {
    if (sessionRef.current) {
      try {
        await sessionRef.current.end();
      } catch (error) {
        console.error('Error ending VR session:', error);
      }
    }
  };

  const handleSessionEnd = () => {
    sessionRef.current = null;
    setVrSession(null);
    setVrConnected(false);
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }
  };

  const handleInputSourcesChange = (event) => {
    // Handle controller connection/disconnection
    console.log('Input sources changed:', event);
  };

  const handleSelect = (event) => {
    // Handle controller select events
    console.log('Select event:', event);
  };

  const handleSelectStart = (event) => {
    // Handle controller select start
    console.log('Select start:', event);
  };

  const handleSelectEnd = (event) => {
    // Handle controller select end
    console.log('Select end:', event);
  };

  const onXRFrame = (time, frame) => {
    if (!sessionRef.current) return;

    // Update performance metrics
    updateFramePerformance(time);

    // Continue the render loop
    frameRef.current = sessionRef.current.requestAnimationFrame(onXRFrame);
  };

  const updateFramePerformance = (time) => {
    // Simple FPS calculation
    const now = performance.now();
    static lastFrameTime = now;
    const deltaTime = now - lastFrameTime;
    const fps = 1000 / deltaTime;
    
    setPerformance(prev => ({
      ...prev,
      fps: Math.round(fps),
      latency: Math.round(deltaTime)
    }));
    
    lastFrameTime = now;
  };

  const updatePerformanceMetrics = () => {
    // Update quality based on performance
    setPerformance(prev => {
      let quality = 'high';
      if (prev.fps < 60) quality = 'medium';
      if (prev.fps < 30) quality = 'low';
      
      return { ...prev, quality };
    });
  };

  const getControllerPose = (inputSource) => {
    if (!vrSession || !inputSource.gamepad) return null;
    
    // Get controller position and orientation
    const frame = vrSession.requestAnimationFrame(() => {});
    const pose = frame.getPose(inputSource.targetRaySpace, vrSession.baseSpace);
    
    return pose;
  };

  const getHandPose = (inputSource) => {
    if (!handTracking || !inputSource.hand) return null;
    
    // Get hand tracking data
    const handPoses = {};
    for (const [joint, jointSpace] of inputSource.hand.entries()) {
      const pose = frame.getJointPose(jointSpace, vrSession.baseSpace);
      if (pose) {
        handPoses[joint] = {
          position: pose.transform.position,
          orientation: pose.transform.orientation,
          radius: pose.radius
        };
      }
    }
    
    return handPoses;
  };

  const hapticFeedback = (intensity = 0.5, duration = 100) => {
    if (!vrSession) return;
    
    // Send haptic feedback to controllers
    vrSession.inputSources.forEach(inputSource => {
      if (inputSource.gamepad && inputSource.gamepad.hapticActuators) {
        inputSource.gamepad.hapticActuators[0].pulse(intensity, duration);
      }
    });
  };

  const setReferenceSpace = async (type = 'local-floor') => {
    if (!vrSession) return null;
    
    try {
      const referenceSpace = await vrSession.requestReferenceSpace(type);
      return referenceSpace;
    } catch (error) {
      console.error('Failed to set reference space:', error);
      return null;
    }
  };

  const exitVR = async () => {
    await endVRSession();
  };

  // VR-specific utility functions
  const isVRActive = () => vrConnected && vrSession;
  
  const getVRCapabilities = () => ({
    vrSupported,
    handTracking,
    eyeTracking,
    roomScale,
    headset: vrHeadset
  });

  const getVRPerformance = () => performance;

  return {
    // State
    vrSupported,
    vrSession,
    vrConnected,
    vrHeadset,
    handTracking,
    eyeTracking,
    roomScale,
    performance,
    
    // Functions
    checkVRSupport,
    startVRSession,
    endVRSession,
    exitVR,
    getControllerPose,
    getHandPose,
    hapticFeedback,
    setReferenceSpace,
    isVRActive,
    getVRCapabilities,
    getVRPerformance
  };
};