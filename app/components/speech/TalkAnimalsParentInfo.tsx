// pages/training/quiz/speech/parents.js
import React from 'react';
import ParentModal from '@/app/components/common/ParentModal';
import InfoCard from '@/app/components/common/InfoCard';
import SkillsTable from '@/app/components/common/SkillTable';
import './styles/talkAnimals.scss';

// Animal Friends game skills data
const animalFriendsSkills = [
  {
    question: "What is your name?",
    description: "Self-identification, using \"I am\" or \"My name is\""
  },
  {
    question: "How old are you?",
    description: "Number concepts, age awareness"
  },
  {
    question: "What color do you like?",
    description: "Expressing preferences, color vocabulary"
  },
  {
    question: "Do you like carrots?",
    description: "Yes/no responses, expressing likes/dislikes"
  },
  {
    question: "What is your favorite animal?",
    description: "Expressing preferences, animal vocabulary"
  }
];

export default function TalkAnimalsParentInfo({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <ParentModal 
      title="Information for Parents"
      isOpen={isOpen}
      onClose={onClose}
    >
      <InfoCard title="About This Game">
        <p>
          Animal Friends is designed specifically for children aged 4-5 years old to practice 
          simple question-answering skills in a fun, engaging environment. The game uses voice 
          prompts instead of text since children at this age typically cannot read.
        </p>
        <p>
          This game focuses on helping your child:
        </p>
        <ul>
          <li>Practice answering common questions</li>
          <li>Develop clear speech</li>
          <li>Build confidence in verbal communication</li>
          <li>Engage in conversation turn-taking</li>
        </ul>
      </InfoCard>

      <InfoCard title="How to Support Your Child">
        <ul>
          <li>Sit with your child during the game</li>
          <li>Help them operate the "Talk Now" button when needed</li>
          <li>If they're confused by a question, press the character to hear it again</li>
          <li>Press the "Help" button if they need guidance</li>
          <li>Celebrate their successes with high-fives or hugs</li>
          <li>If they struggle, model the answer for them, then let them try again</li>
        </ul>
      </InfoCard>

      <InfoCard title="Speech Skills Practiced">
        <SkillsTable skills={animalFriendsSkills} />
      </InfoCard>

      <InfoCard title="Technical Information">
        <p>
          This game uses:
        </p>
        <ul>
          <li>Voice prompts instead of text instructions</li>
          <li>Speech recognition to understand your child's responses</li>
          <li>Colorful, expressive animal characters to maintain interest</li>
          <li>Simple reward system with stars and encouraging feedback</li>
          <li>Audio cues to guide your child through the experience</li>
        </ul>
        <p>
          <strong>Note:</strong> For best results, use this game in a quiet environment with minimal background noise.
        </p>
      </InfoCard>
    </ParentModal>
  );
}