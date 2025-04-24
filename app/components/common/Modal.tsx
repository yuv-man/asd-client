import Image from 'next/image';
import '@/app/styles/Modal.scss';
import { useTranslations } from 'next-intl';

interface ModalProps {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ title, isOpen, onClose, children }: ModalProps) {
  const t = useTranslations('TrainingPage');
  if (!isOpen) return null;

  return (
    <div className="generic-modal modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <button 
            onClick={onClose} 
            className="close-button"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <div className="modal-content">
          <div className="modal-title">
            <Image src={title === 'Quiz' ? '/animals/lion.svg' : '/animals/zebra.svg'} alt="zebra" width={50} height={50} />
            <h1>{t(title ?? '')}</h1>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
} 