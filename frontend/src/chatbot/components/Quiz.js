import React from 'react';

const Quiz = (props) => {
  const { questions, options } = props;

  const buttonsMarkup = options.map((option) => (
    <button key={option.id} className="option-button" onClick={() => props.actionProvider.handleQuiz(option.id)}>
      {option.text}
    </button>
  ));

  return (
    <div className="quiz-container">
      <div className="question">{questions[0].text}</div>
      <div className="options-container">{buttonsMarkup}</div>
    </div>
  );
};

export default Quiz; 