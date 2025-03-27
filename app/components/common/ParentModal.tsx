// components/ParentModal.js
'use client'
import React from 'react';
import './styles/parentModal.scss';

interface ParentModalProps {
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  isOpen: boolean;
}

const ParentModal: React.FC<ParentModalProps> = ({ 
  title = "Information for Parents",
  children,
  onClose,
  isOpen
}) => {
  if (!isOpen) return null;

  return (
    <div className="parent-modal-overlay">
      <div className="parent-modal-container">
        <main className="parent-modal-main">
          <div className="parent-modal-header">
            <h1 className="parent-modal-title">{title}</h1>
            <button 
              className="parent-modal-close-button"
              onClick={onClose}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
          
          {children}
        </main>
      </div>
    </div>
  );
}

export default ParentModal;