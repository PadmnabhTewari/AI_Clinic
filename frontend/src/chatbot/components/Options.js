import React from 'react';

const Options = (props) => {
  const options = [
    {
      text: "Get test prediction",
      id: 1,
    },
    {
      text: "Learn about common tests",
      id: 2,
    },
    {
      text: "General health advice",
      id: 3,
    },
  ];

  const buttonsMarkup = options.map((option) => (
    <button key={option.id} className="option-button" onClick={() => props.actionProvider.handleOptions(option.id)}>
      {option.text}
    </button>
  ));

  return <div className="options-container">{buttonsMarkup}</div>;
};

export default Options; 