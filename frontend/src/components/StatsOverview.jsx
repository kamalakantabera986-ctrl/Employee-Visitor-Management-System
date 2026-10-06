import React from 'react';
import { Users, UserCheck, UserMinus, CalendarCheck, TrendingUp } from 'lucide-react';

export default function StatsOverview({ stats }) {
  const cards = [
    {
      title: 'Total Visitors',
      value: stats.total || 0,
      label: 'All-time registered',
      icon: Users,
      color: '#6366f1',
      bgGlow: 'rgba(99, 102, 241, 0.12)'
    },
    {
      title: 'Currently Checked In',
      value: stats.checkedIn || 0,
      label: 'Active on premises',
      icon: UserCheck,
      color: '#10b981',
      bgGlow: 'rgba(16, 185, 129, 0.15)',
      isLive: true
    },
    {
      title: 'Checked Out',
      value: stats.checkedOut || 0,
      label: 'Completed visits',
      icon: UserMinus,
      color: '#94a3b8',
      bgGlow: 'rgba(148, 163, 184, 0.1)'
    },
    {
      title: "Today's Visits",
      value: stats.todayVisits || 0,
      label: 'Check-ins today',
      icon: CalendarCheck,
      color: '#06b6d4',
      bgGlow: 'rgba(6, 182, 212, 0.12)'
    }
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div key={idx} className="stat-card glass-panel" style={{ '--card-accent': card.color }}>
            <div className="stat-card-inner">
              <div className="stat-info">
                <div className="stat-header-row">
                  <span className="stat-title">{card.title}</span>
                  {card.isLive && (
                    <span className="live-pill">
                      <span className="pulse-dot"></span>
                      <span>LIVE</span>
                    </span>
                  )}
                </div>
                <div className="stat-number">{card.value}</div>
                <span className="stat-label">{card.label}</span>
              </div>
              <div 
                className="stat-icon-wrapper" 
                style={{ backgroundColor: card.bgGlow, color: card.color }}
              >
                <IconComponent size={24} />
              </div>
            </div>
            <div 
              className="stat-card-progress-line" 
              style={{ backgroundColor: card.color }}
            />
          </div>
        );
      })}
    </div>
  );
}
