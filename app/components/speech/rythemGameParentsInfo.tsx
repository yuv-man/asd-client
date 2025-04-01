'use client'
import React from 'react';
import ParentModal from '@/app/components/common/ParentModal';
import InfoCard from '@/app/components/common/InfoCard';
import SkillsTable from '@/app/components/common/SkillTable';
import '@/app/styles/rythemGame.scss';

// Rhyme Game skills data
const rhymeGameSkills = [
  {
    question: "What rhymes with cat?",
    description: "Phonological awareness, identifying similar ending sounds"
  },
  {
    question: "What rhymes with bed?",
    description: "Sound pattern recognition, word family understanding"
  },
  {
    question: "What rhymes with cake?",
    description: "Auditory discrimination, word structure analysis"
  },
  {
    question: "What rhymes with star?",
    description: "Phonemic awareness, sound blending abilities"
  },
  {
    question: "What rhymes with rain?",
    description: "Vocabulary development, pre-reading phonics skills"
  }
];

export default function RhymeGameParentInfo({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <ParentModal 
      title="Information for Parents"
      isOpen={isOpen}
      onClose={onClose}
    >
      <InfoCard title="About This Game">
        <p>
          Rhyme Time is designed specifically for children aged 4-5 years old to practice 
          identifying rhyming words through an audio-visual approach. The game uses spoken words
          and images since children at this age typically cannot read.
        </p>
        <p>
          This game focuses on helping your child:
        </p>
        <ul>
          <li>Develop phonological awareness essential for reading readiness</li>
          <li>Identify words that share the same ending sounds</li>
          <li>Build pre-reading skills through sound play</li>
          <li>Enhance vocabulary through word families</li>
        </ul>
      </InfoCard>

      <InfoCard title="How to Support Your Child">
        <ul>
          <li>Sit with your child during the game initially</li>
          <li>Encourage them to click the speaker button to hear each word</li>
          <li>If they're unsure about a word, help them hear it multiple times</li>
          <li>Allow time for your child to process the sounds before selecting</li>
          <li>Celebrate correct matches with positive reinforcement</li>
          <li>If they struggle, try saying the words slowly to emphasize the ending sounds</li>
        </ul>
      </InfoCard>

      <InfoCard title="Language Skills Practiced">
        <SkillsTable skills={rhymeGameSkills} />
      </InfoCard>

      <InfoCard title="Technical Information">
        <p>
          This game uses:
        </p>
        <ul>
          <li>Synthetic speech to pronounce each word clearly</li>
          <li>Visual images paired with audio to support word recognition</li>
          <li>Multiple difficulty levels that progress from simple to complex rhymes</li>
          <li>Immediate audio and visual feedback on choices</li>
          <li>Scoring system that rewards both accuracy and speed</li>
          <li>Adaptive design that works on tablets, computers, and mobile devices</li>
        </ul>
        <p>
          <strong>Note:</strong> For best results, use this game with headphones or in a quiet environment to help your child focus on the subtle sound differences.
        </p>
      </InfoCard>
    </ParentModal>
  );
}