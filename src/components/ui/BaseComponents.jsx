// ═══════════════════════════════════════════════════════════════════
// BASE UI COMPONENTS
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { T } from '../../utils/constants';

/**
 * Primary action button
 */
export function PBtn({ children, onClick, style, disabled, variant = 'primary' }) {
  const bg = variant === 'primary' 
    ? `linear-gradient(135deg,${T.gold},${T.goldDim})`
    : variant === 'danger'
    ? `linear-gradient(135deg,${T.ruby},${T.ruby}99)`
    : `linear-gradient(135deg,${T.sapphire},${T.sapphire}99)`;
    
  return (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      style={{
        padding: "9px 18px",
        background: bg,
        color: T.bg,
        border: "none",
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 700,
        boxShadow: `0 4px 14px rgba(201,169,110,.2)`,
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style
      }}
    >
      {children}
    </button>
  );
}

/**
 * Ghost/secondary button
 */
export function GBtn({ children, onClick, color, style, size = 'sm' }) {
  const c = color || T.slateL;
  const padding = size === 'sm' ? "6px 11px" : size === 'md' ? "9px 16px" : "12px 20px";
  const fontSize = size === 'sm' ? 12 : size === 'md' ? 14 : 16;
  
  return (
    <button 
      onClick={onClick} 
      style={{
        padding,
        background: `${c}15`,
        color: c,
        border: `1px solid ${c}30`,
        borderRadius: 7,
        fontSize,
        fontWeight: 600,
        whiteSpace: "nowrap",
        transition: "all .12s",
        cursor: "pointer",
        ...style
      }}
    >
      {children}
    </button>
  );
}

/**
 * Card container
 */
export function Card({ children, style, onClick, hoverable = false }) {
  return (
    <div 
      onClick={onClick}
      style={{
        background: T.card,
        border: `1px solid ${T.borderSub}`,
        borderRadius: 13,
        padding: 18,
        cursor: onClick ? 'pointer' : 'default',
        transition: hoverable ? 'all .15s' : 'none',
        ...(hoverable && {
          ':hover': {
            background: T.cardHov,
            borderColor: T.gold,
          }
        }),
        ...style
      }}
    >
      {children}
    </div>
  );
}

/**
 * Stat card for dashboard
 */
export function StatCard({ label, value, icon, color = T.white, subtext }) {
  return (
    <div style={{
      background: T.card,
      border: `1px solid ${T.borderSub}`,
      borderRadius: 11,
      padding: "14px 16px"
    }}>
      {icon && <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>}
      <div style={{
        fontFamily: "Georgia,serif",
        fontSize: 20,
        fontWeight: 700,
        color: color,
        marginBottom: subtext ? 4 : 0
      }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: T.slate, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </div>
      {subtext && <div style={{ fontSize: 10, color: T.slate, marginTop: 4 }}>{subtext}</div>}
    </div>
  );
}

/**
 * Page header with title and actions
 */
export function PH({ title, subtitle, children }) {
  return (
    <div className="page-header" style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 22,
      flexWrap: "wrap",
      gap: 10
    }}>
      <div>
        <h1 style={{
          fontFamily: "Georgia,serif",
          fontSize: 22,
          fontWeight: 700,
          color: T.white,
          margin: 0,
          letterSpacing: "-0.02em"
        }}>
          {title}
        </h1>
        {subtitle && (
          <div style={{ fontSize: 12, color: T.slate, marginTop: 3 }}>
            {subtitle}
          </div>
        )}
      </div>
      {children && (
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * Section title
 */
export function ST({ children }) {
  return (
    <div style={{
      fontSize: 11,
      fontWeight: 700,
      color: T.slate,
      letterSpacing: "0.07em",
      textTransform: "uppercase",
      marginBottom: 12
    }}>
      {children}
    </div>
  );
}

/**
 * Toast notification
 */
export function Toast({ message, type = 'success', onClose }) {
  const colors = {
    success: T.emerald,
    error: T.ruby,
    warning: T.amber,
    info: T.sapphire
  };
  
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  return (
    <div style={{
      position: "fixed",
      bottom: 24,
      right: 24,
      background: colors[type] || T.emerald,
      color: "#fff",
      padding: "12px 20px",
      borderRadius: 10,
      fontWeight: 600,
      fontSize: 13,
      boxShadow: "0 8px 28px rgba(0,0,0,.4)",
      zIndex: 999,
      display: "flex",
      alignItems: "center",
      gap: 8,
      animation: "fadeIn 0.25s ease"
    }}>
      <span>{icons[type]}</span>
      <span>{message}</span>
      <button 
        onClick={onClose}
        style={{
          background: "transparent",
          border: "none",
          color: "#fff",
          fontSize: 16,
          marginLeft: 8,
          cursor: "pointer",
          padding: 0,
          lineHeight: 1
        }}
      >
        ×
      </button>
    </div>
  );
}

/**
 * Modal dialog
 */
export function Modal({ title, onClose, children, size = 'md' }) {
  const sizes = {
    sm: 380,
    md: 440,
    lg: 600,
    xl: 800
  };

  return (
    <div 
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.75)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(4px)"
      }}
    >
      <div style={{
        background: T.navy,
        border: `1px solid ${T.border}`,
        borderRadius: 15,
        padding: 26,
        width: sizes[size],
        maxWidth: "95vw",
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 30px 80px rgba(0,0,0,.5)",
        animation: "fadeIn 0.25s ease"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 18,
          alignItems: "center"
        }}>
          <div style={{
            fontFamily: "Georgia,serif",
            fontSize: 17,
            fontWeight: 700,
            color: T.white
          }}>
            {title}
          </div>
          <button 
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: T.slate,
              fontSize: 21,
              lineHeight: 1,
              cursor: "pointer",
              padding: 4
            }}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/**
 * Loading spinner
 */
export function Spinner({ size = 24, color = T.gold }) {
  return (
    <div style={{
      width: size,
      height: size,
      border: `2px solid ${color}30`,
      borderTopColor: color,
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite"
    }} />
  );
}

/**
 * Badge component
 */
export function Badge({ children, color = T.slate, size = 'sm' }) {
  const sizes = {
    sm: { padding: "2px 7px", fontSize: 10 },
    md: { padding: "4px 10px", fontSize: 12 },
    lg: { padding: "6px 14px", fontSize: 14 }
  };

  return (
    <span style={{
      background: `${color}22`,
      color: color,
      borderRadius: 10,
      padding: sizes[size].padding,
      fontSize: sizes[size].fontSize,
      fontWeight: 600,
      display: "inline-block"
    }}>
      {children}
    </span>
  );
}

/**
 * Input field wrapper
 */
export function Input({ label, type = "text", value, onChange, placeholder, disabled, error, hint, style }) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && (
        <label style={{
          display: "block",
          fontSize: 12,
          fontWeight: 600,
          color: T.slateL,
          marginBottom: 6
        }}>
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          background: "rgba(255,255,255,0.05)",
          border: `1px solid ${error ? T.ruby : T.border}`,
          color: T.white,
          borderRadius: 8,
          padding: "10px 13px",
          fontSize: 13,
          width: "100%",
          outline: "none",
          transition: "border-color .2s",
          ...(disabled && { opacity: 0.5, cursor: 'not-allowed' }),
          ...style
        }}
      />
      {error && (
        <div style={{ fontSize: 11, color: T.ruby, marginTop: 4 }}>{error}</div>
      )}
      {hint && !error && (
        <div style={{ fontSize: 11, color: T.slate, marginTop: 4 }}>{hint}</div>
      )}
    </div>
  );
}

/**
 * Select field
 */
export function Select({ label, value, onChange, options, disabled, placeholder, style }) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && (
        <label style={{
          display: "block",
          fontSize: 12,
          fontWeight: 600,
          color: T.slateL,
          marginBottom: 6
        }}>
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        style={{
          background: "rgba(255,255,255,0.05)",
          border: `1px solid ${T.border}`,
          color: T.white,
          borderRadius: 8,
          padding: "10px 13px",
          fontSize: 13,
          width: "100%",
          outline: "none",
          cursor: disabled ? 'not-allowed' : 'pointer',
          ...style
        }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * Textarea field
 */
export function Textarea({ label, value, onChange, placeholder, rows = 4, disabled, style }) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && (
        <label style={{
          display: "block",
          fontSize: 12,
          fontWeight: 600,
          color: T.slateL,
          marginBottom: 6
        }}>
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        style={{
          background: "rgba(255,255,255,0.05)",
          border: `1px solid ${T.border}`,
          color: T.white,
          borderRadius: 8,
          padding: "10px 13px",
          fontSize: 13,
          width: "100%",
          outline: "none",
          resize: "vertical",
          fontFamily: "inherit",
          ...(disabled && { opacity: 0.5, cursor: 'not-allowed' }),
          ...style
        }}
      />
    </div>
  );
}
