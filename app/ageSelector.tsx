"use client";

import React from "react";
import { wendyOne } from "../assets/fonts";
import styles from './styles/ageSelector.module.scss';

type AgeSelectorProps = {
  age: number;
  onChange: (age: number) => void;
};

const AgeSelector: React.FC<AgeSelectorProps> = ({ age, onChange }) => {

  const decreaseAge = () => {
    if (age > 2) onChange(age - 1);
  };

  const increaseAge = () => {
    if (age < 18) onChange(age + 1);
  };

  return (
    <div className={styles.ageSelector}>
      {/* Left Arrow Button */}
      <button
        onClick={decreaseAge}
        className={styles.arrowButton}
      >
        ◀
      </button>

      {/* Age Display */}
      <span className={`${styles.ageDisplay} ${wendyOne.className}`}>{age}</span>

      {/* Right Arrow Button */}
      <button
        onClick={increaseAge}
        className={styles.arrowButton}
      >
        ▶
      </button>
    </div>
  );
};

export default AgeSelector;
