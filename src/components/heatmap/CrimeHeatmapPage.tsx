import React, { useState } from 'react';
import { 
  MapPin, 
  Layers, 
  Filter, 
  Flame, 
  ShieldAlert, 
  Info, 
  ChevronRight, 
  Eye, 
  Crosshair,
  Compass
} from 'lucide-react';
import { Crime, CrimeCategory, CrimeSeverity } from '../../types';
import { DISTRICTS } from '../../lib/localStorage';

interface CrimeHeatmapPageProps {
  crimes: Crime[];
  onSelectCrime: (c: Crime) => void;
}

export const CrimeHeatmapPage: React.FC<CrimeHeatmapPageProps> = ({ crimes, onSelectCrime }) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showHeatGlow, setShowHeatGlow] = useState<boolean>(true);
  const [showIncidentPins, setShowIncidentPins] = useState<boolean>(true);
  const [hoveredCrime, setHoveredCrime] = useState<Crime | null>(null);

  // Filter crimes based on controls
  const filteredCrimes = crimes.filter((c) => {
    const matchesDistrict = selectedDistrict === 'All' || c.district.includes(selectedDistrict) || selectedDistrict.includes(c.district);
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesDistrict && matchesCategory;
  });

  // Calculate sector density
  const districtStats = DISTRICTS.map((dist) => {
    const count = crimes.filter(c => c.district.toLowerCase().includes(dist.name.toLowerCase().split(' ')[0])).length;
    const critical = crimes.filter(c => c.district.toLowerCase().includes(dist.name.toLowerCase().split(' ')[0]) && c.severity === 'Critical').length;
    return {
      ...dist,
      liveCount: count,
      liveCritical: critical,
    };
  });

  const getSeverityGlow = (severity: CrimeSeverity) => {
    switch (severity) {
      case 'Critical':
        return 'rgba(239, 68, 68, 0.7)'; // Rose red
      case 'High':
        return 'rgba(245, 158, 11, 0.6)'; // Amber
      case 'Medium':
        return 'rgba(59, 130, 246, 0.5)'; // Blue
      case 'Low':
        return 'rgba(100, 116, 139, 0.4)'; // Slate
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Metropolitan Geospatial Crime Heatmap</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tactical incident density visualization, high-risk sector clusters, and patrol deployment analysis.
          </p>
        </div>

        {/* Map Legend */}
        <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl text-[11px] self-start sm:self-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            <span className="text-slate-300">Critical / High Severity</span>
          </div>
          <span className="text-slate-700">·</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-300">Moderate Threat</span>
          </div>
          <span className="text-slate-700">·</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-slate-300">Routine Incidents</span>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-400" />
            <span className="font-semibold text-slate-300">Sector:</span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Metropolitan Sectors</option>
              {DISTRICTS.map((d) => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-300">Offense:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Incident Types</option>
              <option value="Armed Robbery">Armed Robbery</option>
              <option value="Homicide">Homicide</option>
              <option value="Cybercrime">Cybercrime</option>
              <option value="Narcotics">Narcotics</option>
              <option value="Financial Fraud">Financial Fraud</option>
              <option value="Burglary">Burglary</option>
            </select>
          </div>
        </div>

        {/* View toggles */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={showHeatGlow}
              onChange={(e) => setShowHeatGlow(e.target.checked)}
              className="rounded border-slate-700 text-blue-600 focus:ring-0"
            />
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" /> Heat Intensity Rays
            </span>
          </label>

          <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={showIncidentPins}
              onChange={(e) => setShowIncidentPins(e.target.checked)}
              className="rounded border-slate-700 text-blue-600 focus:ring-0"
            />
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-400" /> Tactical Pins
            </span>
          </label>
        </div>
      </div>

      {/* Main Heatmap Canvas Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* SVG Tactical Interactive Map */}
        <div className="lg:col-span-3 rounded-2xl bg-slate-950 border border-slate-800 p-4 relative overflow-hidden flex flex-col justify-between min-h-[560px]">
          
          {/* Grid lines styling */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-25 pointer-events-none" />

          {/* Interactive SVG Radar / Heatmap */}
          <div className="relative w-full h-full min-h-[500px] flex items-center justify-center">
            <svg 
              viewBox="0 0 800 550" 
              className="w-full h-full max-h-[560px] select-none"
            >
              <defs>
                {/* Radial Gradient for Heat aura */}
                <radialGradient id="heatGlowCritical" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.85" />
                  <stop offset="40%" stopColor="#f97316" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="heatGlowHigh" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.75" />
                  <stop offset="50%" stopColor="#eab308" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="heatGlowMedium" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.65" />
                  <stop offset="60%" stopColor="#60a5fa" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Metropolitan Sector Polygons */}
              {DISTRICTS.map((dist) => {
                const isFiltered = selectedDistrict === 'All' || dist.name === selectedDistrict;
                return (
                  <g key={dist.id} className="transition-opacity duration-300" opacity={isFiltered ? 1 : 0.25}>
                    <rect
                      x={dist.svgCoords.x}
                      y={dist.svgCoords.y}
                      width={dist.svgCoords.width}
                      height={dist.svgCoords.height}
                      rx={12}
                      className="fill-slate-900/60 stroke-slate-700/60 hover:fill-slate-800/80 transition-all cursor-pointer"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                      onClick={() => setSelectedDistrict(dist.name)}
                    />
                    <text
                      x={dist.svgCoords.x + 12}
                      y={dist.svgCoords.y + 24}
                      fill="#94a3b8"
                      fontSize="11"
                      fontFamily="JetBrains Mono"
                      fontWeight="bold"
                    >
                      {dist.code} · {dist.name}
                    </text>
                  </g>
                );
              })}

              {/* Heatmap Intensity Clouds */}
              {showHeatGlow && filteredCrimes.map((crime, idx) => {
                // Map coordinates roughly into the SVG plane
                const targetDist = DISTRICTS.find(d => crime.district.includes(d.name.split(' ')[0])) || DISTRICTS[idx % DISTRICTS.length];
                const jitterX = ((idx * 37) % 60) - 30;
                const jitterY = ((idx * 43) % 50) - 25;
                const cx = targetDist.svgCoords.x + targetDist.svgCoords.width / 2 + jitterX;
                const cy = targetDist.svgCoords.y + targetDist.svgCoords.height / 2 + jitterY;

                const gradId = crime.severity === 'Critical' ? 'url(#heatGlowCritical)' : crime.severity === 'High' ? 'url(#heatGlowHigh)' : 'url(#heatGlowMedium)';
                const radius = crime.severity === 'Critical' ? 65 : crime.severity === 'High' ? 52 : 38;

                return (
                  <circle
                    key={`heat-${crime.id}`}
                    cx={cx}
                    cy={cy}
                    r={radius}
                    fill={gradId}
                    className="animate-pulse"
                    style={{ animationDuration: `${2.5 + (idx % 2)}s` }}
                    pointerEvents="none"
                  />
                );
              })}

              {/* Tactical Incident Pins */}
              {showIncidentPins && filteredCrimes.map((crime, idx) => {
                const targetDist = DISTRICTS.find(d => crime.district.includes(d.name.split(' ')[0])) || DISTRICTS[idx % DISTRICTS.length];
                const jitterX = ((idx * 37) % 60) - 30;
                const jitterY = ((idx * 43) % 50) - 25;
                const cx = targetDist.svgCoords.x + targetDist.svgCoords.width / 2 + jitterX;
                const cy = targetDist.svgCoords.y + targetDist.svgCoords.height / 2 + jitterY;

                const pinFill = crime.severity === 'Critical' ? '#ef4444' : crime.severity === 'High' ? '#f59e0b' : '#3b82f6';

                return (
                  <g
                    key={`pin-${crime.id}`}
                    className="cursor-pointer group"
                    onClick={() => onSelectCrime(crime)}
                    onMouseEnter={() => setHoveredCrime(crime)}
                    onMouseLeave={() => setHoveredCrime(null)}
                  >
                    {/* Ring aura on hover */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={9}
                      fill="none"
                      stroke={pinFill}
                      strokeWidth={2}
                      opacity={0.6}
                      className="group-hover:scale-125 transition-transform origin-center"
                    />
                    <circle
                      cx={cx}
                      cy={cy}
                      r={4.5}
                      fill={pinFill}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredCrime && (
              <div className="absolute top-4 right-4 p-3 rounded-xl bg-slate-900/95 border border-blue-500/40 shadow-2xl backdrop-blur-md max-w-xs text-xs pointer-events-none animate-in fade-in zoom-in-95">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-blue-400 font-bold">{hoveredCrime.caseNumber}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                    {hoveredCrime.severity}
                  </span>
                </div>
                <div className="font-semibold text-white truncate">{hoveredCrime.title}</div>
                <div className="text-[11px] text-slate-400 mt-1">{hoveredCrime.district}</div>
                <div className="text-[10px] text-blue-400 mt-1 font-mono">Click pin to inspect full file</div>
              </div>
            )}
          </div>

          {/* Bottom Coordinates & Audit Bar */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-3">
              <span className="font-mono">Lat: 40.7128° N, Lng: 74.0060° W</span>
              <span>·</span>
              <span>Showing {filteredCrimes.length} geo-referenced active incidents</span>
            </div>
            <div className="text-slate-500 font-mono">
              Projection: WGS84 Tactical Grid
            </div>
          </div>
        </div>

        {/* Right Tactical Sector Breakdown & Patrol Dispatch */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>District Risk Matrix</span>
              <ShieldAlert className="w-4 h-4 text-amber-400" />
            </h3>

            <div className="space-y-2.5">
              {districtStats.map((dist) => (
                <div
                  key={dist.id}
                  onClick={() => setSelectedDistrict(dist.name)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    selectedDistrict === dist.name
                      ? 'bg-blue-600/15 border-blue-500/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-white">{dist.name}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      dist.riskRating === 'High' ? 'text-rose-400 bg-rose-950/60' : 'text-amber-400 bg-amber-950/60'
                    }`}>
                      {dist.riskRating} Risk
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>{dist.liveCount} Active Incidents</span>
                    <span className="text-rose-400">{dist.liveCritical} Critical</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tactical Patrol Recommendation Card */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
              <Crosshair className="w-4 h-4" />
              <span>Patrol Dispatch Recommendation</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Harbor Docks and Downtown Financial sectors exhibit high multi-incident density. Recommend reallocating 2 tactical patrol units to Shoreline Way and Grand Avenue corridors between 20:00 and 04:00 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
