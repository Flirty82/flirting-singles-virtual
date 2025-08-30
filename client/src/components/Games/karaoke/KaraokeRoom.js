/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
  Zap, Battery, Radio, Thermometer, Camera, Flashlight, 
  Mic, Target, Eye, Shield, Activity, AlertTriangle,
  Volume2, Settings, RefreshCw, Power, Wifi, Play, Pause
} from 'lucide-react';

const EquipmentPanel = ({ 
  equipment, 
  onToggleEquipment, 
  activeEquipment, 
  setActiveEquipment,
  currentRoom,
  environment 
}) => {
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [equipmentReadings, setEquipmentReadings] = useState({});

  // Equipment definitions with VR-specific properties
  const equipmentTypes = {
    emf_detector: {
      name: 'EMF Detector',
      icon: '📡',
      color: 'text-green-400',
      bgColor: 'from-green-500/20 to-blue-500/20',
      borderColor: 'border-green-500',
      description: 'Detects electromagnetic field fluctuations',
      range: 5,
      batteryDrain: 0.1,
      vrModel: 'emf-detector.glb'
    },
    spirit_box: {
      name: 'Spirit Box',
      icon: '📻',
      color: 'text-purple-400',
      bgColor: 'from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-500',
      description: 'Scans radio frequencies for spirit communication',
      range: 3,
      batteryDrain: 0.2,
      vrModel: 'spirit-box.glb'
    },
    thermal_camera: {
      name: 'Thermal Camera',
      icon: '📷',
      color: 'text-blue-400',
      bgColor: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-500',
      description: 'Detects temperature anomalies and cold spots',
      range: 8,
      batteryDrain: 0.3,
      vrModel: 'thermal-camera.glb'
    },
    uv_light: {
      name: 'UV Light',
      icon: '🔦',
      color: 'text-yellow-400',
      bgColor: 'from-yellow-500/20 to-orange-500/20',
      borderColor: 'border-yellow-500',
      description: 'Reveals fingerprints and other evidence',
      range: 4,
      batteryDrain: 0.15,
      vrModel: 'uv-light.glb'
    },
    motion_sensor: {
      name: 'Motion Sensor',
      icon: '🎯',
      color: 'text-red-400',
      bgColor: 'from-red-500/20 to-orange-500/20',
      borderColor: 'border-red-500',
      description: 'Detects movement in the area',
      range: 10,
      batteryDrain: 0.05,
      vrModel: 'motion-sensor.glb'
    },
    voice_recorder: {
      name: 'Voice Recorder',
      icon: '🎙️',
      color: 'text-pink-400',
      bgColor: 'from-pink-500/20 to-purple-500/20',
      borderColor: 'border-pink-500',
      description: 'Records Electronic Voice Phenomena (EVP)',
      range: 6,
      batteryDrain: 0.1,
      vrModel: 'voice-recorder.glb'
    },
    camera: {
      name: 'Photo Camera',
      icon: '📸',
      color: 'text-cyan-400',
      bgColor: 'from-cyan-500/20 to-blue-500/20',
      borderColor: 'border-cyan-500',
      description: 'Captures photographic evidence',
      range: 12,
      batteryDrain: 0.25,
      vrModel: 'photo-camera.glb'
    },
    crucifix: {
      name: 'Crucifix',
      icon: '✝️',
      color: 'text-white',
      bgColor: 'from-white/20 to-gray-300/20',
      borderColor: 'border-white',
      description: 'Prevents ghost hunts when placed',
      range: 3,
      batteryDrain: 0,
      vrModel: 'crucifix.glb'
    }
  };

  // Update equipment readings based on environment
  useEffect(() => {
    const updateReadings = () => {
      const newReadings = {};
      
      Object.keys(equipment).forEach(key => {
        if (equipment[key].active) {
          const equipType = equipmentTypes[key];
          if (!equipType) return;

          switch (key) {
            case 'emf_detector':
              newReadings[key] = {
                value: environment.emfLevel + (Math.random() * 10 - 5),
                unit: 'mG',
                status: environment.emfLevel > 30 ? 'ANOMALY' : 'NORMAL'
              };
              break;
              
            case 'thermal_camera':
              newReadings[key] = {
                value: environment.temperature + (Math.random() * 5 - 2.5),
                unit: '°F',
                status: environment.temperature < 50 ? 'COLD_SPOT' : 'NORMAL'
              };
              break;
              
            case 'spirit_box':
              newReadings[key] = {
                value: equipment[key].frequency,
                unit: 'MHz',
                status: Math.random() > 0.9 ? 'RESPONSE' : 'STATIC'
              };
              break;
              
            case 'motion_sensor':
              newReadings[key] = {
                value: environment.ghostActivity,
                unit: '%',
                status: environment.ghostActivity > 50 ? 'MOTION' : 'CLEAR'
              };
              break;
              
            default:
              newReadings[key] = {
                value: Math.random() * 100,
                unit: '',
                status: 'ACTIVE'
              };
          }
        }
      });
      
      setEquipmentReadings(newReadings);
    };

    if (Object.values(equipment).some(item => item.active)) {
      const interval = setInterval(updateReadings, 1000);
      return () => clearInterval(interval);
    }
  }, [equipment, environment]);

  const handleEquipmentToggle = (equipmentKey) => {
    onToggleEquipment(equipmentKey);
    if (equipment[equipmentKey].active) {
      setActiveEquipment(null);
    } else {
      setActiveEquipment(equipmentKey);
    }
  };

  const getBatteryColor = (battery) => {
    if (battery > 60) return 'text-green-400';
    if (battery > 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ANOMALY':
      case 'COLD_SPOT':
      case 'RESPONSE':
      case 'MOTION':
        return 'text-red-400';
      case 'ACTIVE':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center">
          <Target className="w-6 h-6 mr-2 text-purple-400" />
          Ghost Hunting Equipment
        </h3>
        
        <div className="flex items-center space-x-2">
          <div className="bg-white/10 rounded-lg px-3 py-1">
            <span className="text-sm text-gray-300">Room: {currentRoom.replace('_', ' ')}</span>
          </div>
          
          {activeEquipment && (
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg px-3 py-1">
              <span className="text-sm text-green-400">
                {equipmentTypes[activeEquipment]?.name} Active
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Equipment Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(equipment).map(([key, item]) => {
          const equipType = equipmentTypes[key];
          if (!equipType) return null;
          
          const isActive = item.active;
          const isSelected = activeEquipment === key;
          const reading = equipmentReadings[key];
          
          return (
            <div
              key={key}
              className={`relative p-4 rounded-lg cursor-pointer transition-all border-2 ${
                isActive 
                  ? `bg-gradient-to-r ${equipType.bgColor} ${equipType.borderColor} shadow-lg` 
                  : 'bg-black/20 border-gray-600 hover:border-purple-400'
              } ${isSelected ? 'ring-2 ring-purple-400' : ''}`}
              onClick={() => handleEquipmentToggle(key)}
            >
              {/* Equipment Icon and Status */}
              <div className="flex items-center justify-between mb-3">
                <div className="text-3xl">{equipType.icon}</div>
                <div className="flex flex-col items-end">
                  <div className={`text-xs font-bold ${isActive ? 'text-green-400' : 'text-gray-500'}`}>
                    {isActive ? 'ON' : 'OFF'}
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mt-1"></div>
                  )}
                </div>
              </div>
              
              {/* Equipment Name */}
              <div className="text-sm font-medium mb-1 text-center">
                {equipType.name}
              </div>
              
              {/* Battery Level */}
              <div className="flex items-center justify-between text-xs mb-2">
                <div className="flex items-center space-x-1">
                  <Battery className="w-3 h-3" />
                  <span className={getBatteryColor(item.battery)}>{item.battery}%</span>
                </div>
                
                {isActive && reading && (
                  <div className={`font-bold ${getStatusColor(reading.status)}`}>
                    {reading.status}
                  </div>
                )}
              </div>
              
              {/* Equipment Reading */}
              {isActive && reading && (
                <div className="bg-black/40 rounded px-2 py-1 text-center">
                  <div className="text-lg font-bold text-white">
                    {reading.value.toFixed(1)}{reading.unit}
                  </div>
                </div>
              )}
              
              {/* Range Indicator */}
              <div className="absolute top-2 left-2">
                <div className="w-4 h-4 bg-black/60 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white">{equipType.range}m</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Equipment Details */}
      {selectedEquipment && equipmentTypes[selectedEquipment] && (
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center space-x-3 mb-3">
            <div className="text-2xl">{equipmentTypes[selectedEquipment].icon}</div>
            <div>
              <h4 className="font-bold">{equipmentTypes[selectedEquipment].name}</h4>
              <p className="text-sm text-gray-400">{equipmentTypes[selectedEquipment].description}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Range:</span>
              <span className="ml-2 font-bold">{equipmentTypes[selectedEquipment].range}m</span>
            </div>
            <div>
              <span className="text-gray-400">Battery:</span>
              <span className={`ml-2 font-bold ${getBatteryColor(equipment[selectedEquipment]?.battery || 0)}`}>
                {equipment[selectedEquipment]?.battery || 0}%
              </span>
            </div>
            <div>
              <span className="text-gray-400">Status:</span>
              <span className={`ml-2 font-bold ${equipment[selectedEquipment]?.active ? 'text-green-400' : 'text-red-400'}`}>
                {equipment[selectedEquipment]?.active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Equipment Tips */}
      <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
        <h5 className="font-medium text-blue-400 mb-2">💡 Equipment Tips:</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300">
          <div>• EMF detectors work best near electrical sources</div>
          <div>• Thermal cameras reveal temperature anomalies</div>
          <div>• Spirit boxes need quiet environments</div>
          <div>• UV lights reveal fingerprints on objects</div>
          <div>• Motion sensors detect ghost movement</div>
          <div>• Voice recorders capture EVP evidence</div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentPanel;