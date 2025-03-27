import React from 'react';
import './styles/parentModal.scss';

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, children }) => {
  return (
    <div className="parent-modal-info-card">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

export default InfoCard;