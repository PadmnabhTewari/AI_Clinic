class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(message) {
    const lowerCase = message.toLowerCase();

    if (lowerCase.includes("hello") || lowerCase.includes("hi")) {
      this.actionProvider.greet();
    }

    if (lowerCase.includes("test prediction")) {
      this.actionProvider.handleTestPrediction();
    }

    if (lowerCase.includes("common tests")) {
      this.actionProvider.handleCommonTests();
    }

    if (lowerCase.includes("health advice")) {
      this.actionProvider.handleHealthAdvice();
    }

    if (lowerCase.includes("thanks") || lowerCase.includes("thank you")) {
      this.actionProvider.handleThanks();
    }
  }
}

export default MessageParser; 