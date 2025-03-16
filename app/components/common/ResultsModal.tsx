import React from 'react';
import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

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
      {isOpen && (
        <Dialog
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={onClose}
        >
          <div className="min-h-screen px-4 text-center">
            <div className="fixed inset-0 bg-black opacity-30" />
            
            <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
            
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
            >
              <Dialog.Title as="h3" className="text-2xl font-medium leading-6 text-gray-900 mb-4">
                Assessment Results
              </Dialog.Title>

              <div className="mt-4">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-purple-600 mb-2">
                    {Math.round(score)}%
                  </div>
                  <p className="text-gray-600">Overall Score</p>
                </div>

                <div className="space-y-3">
                  {Object.entries(exerciseResults).map(([type, score]) => (
                    <div key={type} className="flex justify-between items-center">
                      <span className="text-gray-700">{type}</span>
                      <span className="font-medium">{Math.round(score)}%</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={onClose}
                  className="mt-6 w-full bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 flex items-center justify-center"
                >
                  Continue to Training
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default ResultsModal;
