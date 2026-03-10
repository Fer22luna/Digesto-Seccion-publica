import React from 'react';
import { Regulation } from '../types';

interface ActionMenuProps {
  regulation: Regulation;
  onDownload?: (regulation: Regulation) => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ regulation }) => {
  return (
    <button
      onClick={() => window.open(regulation.pdfUrl || regulation.fileUrl || '#', '_blank')}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor: '#1a3a5c',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        padding: '6px 12px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        fontFamily: 'system-ui',
        transition: 'background 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#132d47')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1a3a5c')}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14,2 14,8 20,8" />
      </svg>
      Abrir
    </button>
  );
};

export default ActionMenu;
