import zebra from '@/assets/animals/zebra.svg'
import lion from '@/assets/animals/lion.svg'
import Image from 'next/image';

interface ModalProps {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ title, isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.50)] flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full m-4 text-darkPurple">
        <div className="flex justify-end">
          <button 
            onClick={onClose} 
            className="close-button hover:text-gray-900 text-md font-bold"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <div className="flex flex-col items-center">
          <div className='flex flex-row items-center justify-center mb-4' >
            <Image src={title === 'Quiz' ? lion : zebra} alt="zebra" width={50} height={50} />
            <h1 className="text-2xl">{title}</h1>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
} 