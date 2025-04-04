import React from 'react';
import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import '@/app/styles/ResultsModal.scss';

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  area: string;
  exerciseResults: Record<string, number>;
}

const ResultsModal = ({ isOpen, onClose, score, area, exerciseResults }: ResultsModalProps) => {
  return (
    <AnimatePresence>
      <Dialog
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="results-modal"
        onClose={onClose}
        open={isOpen}
      >
        <div className="modal-container">
          <span className="screen-reader-text" aria-hidden="true">&#8203;</span>
          
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="modal-content"
          >
            <Dialog.Title as="h3" className="modal-title">
              {area.toUpperCase()} Assessment Results
            </Dialog.Title>

            <div className="modal-body">
              <div className="score-container">
                <div className="overall-score">
                  {Math.round(score)}%
                </div>
                <p className="score-label">Overall Score</p>
              </div>

              <div className="results-list">
                {Object.entries(exerciseResults).map(([type, score]) => (
                  <div key={type} className="result-item">
                    <span className="result-type">{type}</span>
                    <span className="result-score">{Math.round(score)}%</span>
                  </div>
                ))}
              </div>

              <button
                onClick={onClose}
                className="continue-button"
              >
                Continue
                <ArrowRight className="button-icon" />
              </button>
            </div>
          </motion.div>
        </div>
      </Dialog>
      <div className="modal-overlay" />
    </AnimatePresence>
  );
};

export default ResultsModal;
