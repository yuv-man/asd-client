import zebra from '@/assets/animals/zebra.svg'
import lion from '@/assets/animals/lion.svg'
import Image from 'next/image';
import '@/app/styles/Modal.scss';

interface ModalProps {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ title, isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
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
            <Image src={title === 'Quiz' ? lion : zebra} alt="zebra" width={50} height={50} />
            <h1>{title}</h1>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
} 