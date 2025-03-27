import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import './styles/talkAnimals.scss';

export default function Parents() {
  return (
    <div className="container">
      <Head>
        <title>For Parents | Animal Friends Speech Game</title>
        <meta name="description" content="Information for parents about the speech therapy game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <h1 className="title">Information for Parents</h1>
        
        <div className="infoCard">
          <h2>About This Game</h2>
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
        </div>

        <div className="infoCard">
          <h2>How to Support Your Child</h2>
          <ul>
            <li>Sit with your child during the game</li>
            <li>Help them operate the "Talk Now" button when needed</li>
            <li>If they're confused by a question, press the character to hear it again</li>
            <li>Press the "Help" button if they need guidance</li>
            <li>Celebrate their successes with high-fives or hugs</li>
            <li>If they struggle, model the answer for them, then let them try again</li>
          </ul>
        </div>

        <div className="infoCard">
          <h2>Speech Skills Practiced</h2>
          <table className="skillsTable">
            <tbody>
              <tr>
                <td><strong>Question</strong></td>
                <td><strong>Skills Practiced</strong></td>
              </tr>
              <tr>
                <td>What is your name?</td>
                <td>Self-identification, using "I am" or "My name is"</td>
              </tr>
              <tr>
                <td>How old are you?</td>
                <td>Number concepts, age awareness</td>
              </tr>
              <tr>
                <td>What color do you like?</td>
                <td>Expressing preferences, color vocabulary</td>
              </tr>
              <tr>
                <td>Do you like carrots?</td>
                <td>Yes/no responses, expressing likes/dislikes</td>
              </tr>
              <tr>
                <td>What is your favorite animal?</td>
                <td>Expressing preferences, animal vocabulary</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="infoCard">
          <h2>Technical Information</h2>
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
        </div>

        <Link href="/training/quiz/speech">
          <button className="homeButton">
            Back
          </button>
        </Link>
      </main>
    </div>
  );
}