"use client";

import React, { useState } from "react";
import { wendyOne } from "../assets/fonts";
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
    <div className="flex items-center space-x-4 p-4 w-64 justify-center m-auto">
      {/* Left Arrow Button */}
      <button
        onClick={decreaseAge}
        className="p-2 text-darkPurple inline-button w-10 h-10 flex items-center justify-center hover:text-pastelOrange"
      >
        ◀
      </button>

      {/* Age Display */}
      <span className={`text-6xl font-bold text-pastelOrange ${wendyOne.className}`}>{age}</span>

      {/* Right Arrow Button */}
      <button
        onClick={increaseAge}
        className="p-2 text-darkPurple inline-button w-10 h-10 flex items-center justify-center hover:text-pastelOrange"
      >
        ▶
      </button>
    </div>
  );
};

export default AgeSelector;
