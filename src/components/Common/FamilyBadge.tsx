import React from 'react';
import { Baby, HeartHandshake, Footprints, CloudRain, Sun, Trees } from 'lucide-react';
import { WalkingIntensity, StairsLevel, WeatherSuitability } from '../../types/travel';

interface ScoreBadgeProps {
  score: 1 | 2 | 3 | 4 | 5;
  type: 'kid' | 'elderly' | 'stroller';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const FamilyScoreBadge: React.FC<ScoreBadgeProps> = ({ score, type, size = 'md', showLabel = true }) => {
  const getColors = () => {
    if (score >= 4) {
      return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    }
    if (score === 3) {
      return { bg: 'bg-amber-50 text-amber-700 border-amber-200' };
    }
    return { bg: 'bg-rose-50 text-rose-700 border-rose-200' };
  };

  const getDetails = () => {
    switch (type) {
      case 'kid':
        return {
          icon: <Baby className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />,
          label: '4岁幼童适宜度',
          short: '幼童: '
        };
      case 'elderly':
        return {
          icon: <HeartHandshake className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />,
          label: '长辈舒适度',
          short: '长辈: '
        };
      case 'stroller':
        return {
          icon: <span className="font-bold text-xs">🚼</span>,
          label: '推车与无障碍',
          short: '推车: '
        };
    }
  };

  const { bg } = getColors();
  const details = getDetails();

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5 font-medium',
    lg: 'px-3 py-1.5 text-sm gap-2 font-medium'
  };

  return (
    <div className={`inline-flex items-center rounded-full border ${bg} ${sizeClasses[size]} shadow-xs`}>
      {details.icon}
      {showLabel ? <span>{details.label}</span> : <span>{details.short}</span>}
      <span className="font-bold tracking-wider">
        {'★'.repeat(score)}
        <span className="opacity-25">{'★'.repeat(5 - score)}</span>
      </span>
    </div>
  );
};

export const WalkingIntensityBadge: React.FC<{ intensity: WalkingIntensity }> = ({ intensity }) => {
  const getStyle = () => {
    if (intensity.includes('轻松')) return 'bg-teal-50 text-teal-700 border-teal-200';
    if (intensity.includes('适中')) return 'bg-blue-50 text-blue-700 border-blue-200';
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full border ${getStyle()} font-medium`}>
      <Footprints className="w-3.5 h-3.5" />
      {intensity}
    </span>
  );
};

export const StairsBadge: React.FC<{ level: StairsLevel }> = ({ level }) => {
  const getStyle = () => {
    if (level.includes('平坦')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (level.includes('少量')) return 'bg-sky-50 text-sky-700 border-sky-200';
    if (level.includes('中等')) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-rose-50 text-rose-700 border-rose-200';
  };

  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full border ${getStyle()} font-medium`}>
      <span>🪜</span>
      {level}
    </span>
  );
};

export const WeatherBadge: React.FC<{ weather: WeatherSuitability }> = ({ weather }) => {
  const getIcon = () => {
    if (weather.includes('室内')) return <CloudRain className="w-3.5 h-3.5 text-indigo-600" />;
    if (weather.includes('晴天')) return <Sun className="w-3.5 h-3.5 text-amber-600" />;
    return <Trees className="w-3.5 h-3.5 text-emerald-600" />;
  };

  return (
    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-medium">
      {getIcon()}
      {weather}
    </span>
  );
};
