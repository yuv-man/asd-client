import React from 'react';
import './styles/parentModal.scss';

interface Skill {
  question: string;
  description: string;
}

interface SkillsTableProps {
  skills: Skill[];
}

const SkillsTable: React.FC<SkillsTableProps> = ({ skills }) => {
  return (
    <table className="parent-modal-skills-table">
      <tbody>
        <tr>
          <td><strong>Question</strong></td>
          <td><strong>Skills Practiced</strong></td>
        </tr>
        {skills.map((skill, index) => (
          <tr key={index}>
            <td>{skill.question}</td>
            <td>{skill.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default SkillsTable;