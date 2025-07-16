import { createChatBotMessage } from 'react-chatbot-kit';

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc, createClientMessage) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
  }

  greet = () => {
    const message = this.createChatBotMessage(
      "Hello! I'm your medical assistant. How can I help you today?",
      {
        widget: "options",
      }
    );
    this.updateChatbotState(message);
  };

  handleOptions = (id) => {
    switch (id) {
      case 1:
        this.handleTestPrediction();
        break;
      case 2:
        this.handleCommonTests();
        break;
      case 3:
        this.handleHealthAdvice();
        break;
      default:
        this.handleDefault();
    }
  };

  handleTestPrediction = () => {
    const message = this.createChatBotMessage(
      "I can help you get a prediction for clinical tests. Please fill out the form on the left side of the screen with your medical information.",
      {
        widget: "options",
      }
    );
    this.updateChatbotState(message);
  };

  handleCommonTests = () => {
    const message = this.createChatBotMessage(
      "Here are some common medical tests and their purposes:\n\n" +
      "1. Complete Blood Count (CBC): Measures different components of blood\n" +
      "2. Basic Metabolic Panel: Checks kidney function, electrolyte balance, and blood sugar\n" +
      "3. Lipid Panel: Measures cholesterol and triglyceride levels\n" +
      "4. Thyroid Function Test: Evaluates thyroid gland function\n" +
      "5. Urinalysis: Analyzes urine for various health conditions",
      {
        widget: "options",
      }
    );
    this.updateChatbotState(message);
  };

  handleHealthAdvice = () => {
    const message = this.createChatBotMessage(
      "Here are some general health tips:\n\n" +
      "1. Maintain a balanced diet\n" +
      "2. Exercise regularly\n" +
      "3. Get adequate sleep\n" +
      "4. Stay hydrated\n" +
      "5. Manage stress\n" +
      "6. Regular check-ups with your healthcare provider",
      {
        widget: "options",
      }
    );
    this.updateChatbotState(message);
  };

  handleThanks = () => {
    const message = this.createChatBotMessage(
      "You're welcome! Is there anything else I can help you with?",
      {
        widget: "options",
      }
    );
    this.updateChatbotState(message);
  };

  handleDefault = () => {
    const message = this.createChatBotMessage(
      "I'm not sure I understand. Could you please rephrase that?",
      {
        widget: "options",
      }
    );
    this.updateChatbotState(message);
  };

  updateChatbotState = (message) => {
    this.setState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  };
}

export default ActionProvider; 