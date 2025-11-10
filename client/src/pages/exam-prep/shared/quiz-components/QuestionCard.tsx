import React from 'react';

interface QuestionCardProps {
  question: string;
  options: string[];
  selectedOption: string | null;
  onOptionChange: (option: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, options, selectedOption, onOptionChange }) => {
  return (
    <div className="p-4 my-4 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-lg font-semibold">{question}</h2>
      <div className="flex flex-col space-y-2">
        {options.map((option) => (
          <label key={option} className="flex items-center p-2 border rounded-lg">
            <input
              type="radio"
              name={question}
              value={option}
              checked={selectedOption === option}
              onChange={() => onOptionChange(option)}
              className="mr-2"
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
