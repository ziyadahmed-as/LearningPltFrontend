import React from 'react';

export default function StatCard({ icon: Icon, label, value, trend, variant = 'primary' }) {
  const getTrendColor = () => {
    if (variant === 'warning') return 'var(--warning)';
    if (variant === 'success') return 'var(--success)';
    return 'var(--text-muted)';
  };

  return (
    <div className="stat-card-modern">
      <div className="stat-icon-wrapper" style={{ flexShrink: 0 }}>
        <Icon size={18} />
      </div>
      <div className="stat-info" style={{ overflow: 'hidden' }}>
        <span className="stat-label-modern" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {label}
        </span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span className="stat-value-modern">{value}</span>
          {trend && (
            <span style={{ fontSize: '0.65rem', color: getTrendColor(), whiteSpace: 'nowrap' }}>
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
