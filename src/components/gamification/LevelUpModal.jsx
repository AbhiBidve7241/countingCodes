import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const LevelUpModal = ({ isOpen, onClose, newLevel = 2 }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="LEVEL UP!" maxWidth="max-w-md">
      <div className="text-center py-4">
        <div className="w-24 h-24 mx-auto mb-5 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-amber-400 p-1 flex items-center justify-center shadow-2xl shadow-indigo-500/40 animate-pulse">
          <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
            <span className="font-display font-black text-4xl text-amber-400">
              {newLevel}
            </span>
          </div>
        </div>

        <h2 className="text-2xl font-display font-black text-white mb-2">
          Rank Promoted!
        </h2>
        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          You have achieved <strong className="text-indigo-400">Level {newLevel}</strong>. Your engineering mastery continues to expand!
        </p>

        <Button variant="primary" size="lg" onClick={onClose} className="w-full">
          Claim Rewards & Continue
        </Button>
      </div>
    </Modal>
  );
};
