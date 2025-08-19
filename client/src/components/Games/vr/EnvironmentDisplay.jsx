// frontend/src/components/games/vr/components/EnvironmentDisplay.jsx
import React, { useState, useEffect } from 'react';
import { 
  Activity, Thermometer, Zap, Volume2, Eye, Wind, 
  Gauge, TrendingUp, TrendingDown, AlertTriangle,
  Wifi, Signal, BarChart3, LineChart
} from 'lucide-react';

const EnvironmentDisplay = ({ 
  environment, 
  currentRoom, 
  ghostActivity, 
  isGhostNearby 
}) => {
  const [historicalData, setHistoricalData] = useState({
    temperature: [],
    emf: [],
    activity: []
  });
  const [alerts, setAlerts] = useState([]);

  // Update historical data for trends
  useEffect(() => {
    const interval = setInterval(() => {
      setHistoricalData(prev => ({
        temperature: [...prev.temperature.slice(-19), environment.temperature],
        emf: [...prev.emf.slice(-19), environment.emfLevel],
        activity: [...prev.activity.slice(-19), ghostActivity]
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [environment, ghostActivity]);

  // Generate alerts based on environmental changes
  useEffect(() => {
    const newAlerts = [];
    
    if (environment.temperature < 50) {
      newAlerts.push({
        id: 'cold_spot',
        type: 'warning',
        message: 'Extreme cold spot detected',
        icon: Thermometer,
        color: 'text-blue-400'
      });
    }
    
    if (environment.emfLevel > 50) {
      newAlerts.push({
        id: 'emf_spike',
        type: 'danger',
        message: 'High EMF activity detected',
        icon: Zap,
        color: 'text-red-400'
      });
    }
    
    if (ghostActivity > 70) {
      newAlerts.push({
        id: 'high_activity',
        type: 'danger',
        message: 'Intense paranormal activity',
        icon: Activity,
        color: 'text-purple-400'
      });
    }
    
    if (environment.presenceDetected) {
      newAlerts.push({
        id: 'presence',
        type: 'critical',
        message: 'Entity presence confirmed',
        icon: Eye,
        color: 'text-red-500'
      });
    }

    setAlerts(newAlerts);
  }, [environment, ghostActivity]);

  const getTemperatureColor = (temp) => {
    if (temp < 40) return 'text-cyan-400';
    if (temp < 50) return 'text-blue-400';
    if (temp < 60) return 'text-yellow-400';
    return 'text-gray-300';
  };

  const getEMFColor = (emf) => {
    if (emf > 50) return 'text-red-400';
    if (emf > 20) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getActivityColor = (activity) => {
    if (activity > 70) return 'text-red-400';
    if (activity > 40) return 'text-orange-400';
    if (activity > 20) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getTrend = (data) => {
    if (data.length < 2) return 'stable';
    const recent = data.slice(-5);
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const older = data.slice(-10, -5);
    const oldAvg = older.reduce((a, b) => a + b, 0) / older.length;
    
    if (avg > oldAvg + 2) return 'up';
    if (avg < oldAvg - 2) return 'down';
    return 'stable';
  };

  const TrendIcon = ({ trend }) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-red-400" />;
      case 'down': return <TrendingDown className="w-3 h-3 text-blue-400" />;
      default: return <BarChart3 className="w-3 h-3 text-gray-400" />;
    }
  };

  const ProgressBar = ({ value, max = 100, color = 'purple' }) => (
    <div className="w-full bg-gray-700 rounded-full h-2">
      <div
        className={`h-2 rounded-full transition-all duration-500 bg-gradient-to-r ${
          color === 'red' ? 'from-red-400 to-red-600' :
          color === 'blue' ? 'from-blue-400 to-blue-600' :
          color === 'green' ? 'from-green-400 to-green-600' :
          color === 'yellow' ? 'from-yellow-400 to-yellow-600' :
          'from-purple-400 to-purple-600'
        }`}
        style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
      ></div>
    </div>
  );

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold flex items-center">
          <Activity className="w-5 h-5 mr-2 text-green-400" />
          Environmental Readings
        </h3>
        
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isGhostNearby ? 'bg-red-400 animate-pulse' : 'bg-green-400'}`}></div>
          <span className="text-sm text-gray-300">
            {isGhostNearby ? 'Entity Nearby' : 'Area Clear'}
          </span>
        </div>
      </div>

      {/* Current Room Status */}
      <div className="mb-6 bg-white/5 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold">Current Location</h4>
          <div className="flex items-center space-x-2">
            <Signal className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400">Connected</span>
          </div>
        </div>
        <div className="text-xl font-bold text-purple-400">
          {currentRoom.replace('_', ' ').toUpperCase()}
        </div>
      </div>

      {/* Primary Environmental Readings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Temperature */}
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Thermometer className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium">Temperature</span>
            </div>
            <TrendIcon trend={getTrend(historicalData.temperature)} />
          </div>
          <div className={`text-2xl font-bold ${getTemperatureColor(environment.temperature)}`}>
            {environment.temperature.toFixed(1)}°F
          </div>
          <ProgressBar 
            value={Math.abs(environment.temperature - 70)} 
            max={50} 
            color={environment.temperature < 50 ? 'blue' : 'yellow'} 
          />
          {environment.temperature < 50 && (
            <div className="text-xs text-blue-400 mt-1">⚠ Cold spot detected</div>
          )}
        </div>

        {/* EMF Level */}
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium">EMF Level</span>
            </div>
            <TrendIcon trend={getTrend(historicalData.emf)} />
          </div>
          <div className={`text-2xl font-bold ${getEMFColor(environment.emfLevel)}`}>
            {environment.emfLevel.toFixed(1)} mG
          </div>
          <ProgressBar 
            value={environment.emfLevel} 
            max={100} 
            color={environment.emfLevel > 50 ? 'red' : environment.emfLevel > 20 ? 'yellow' : 'green'} 
          />
          {environment.emfLevel > 30 && (
            <div className="text-xs text-red-400 mt-1">⚠ Electromagnetic anomaly</div>
          )}
        </div>

        {/* Sound Level */}
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2