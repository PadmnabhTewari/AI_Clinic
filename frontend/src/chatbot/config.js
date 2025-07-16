import { createChatBotMessage } from 'react-chatbot-kit';
import Options from './components/Options';
import Quiz from './components/Quiz';

const config = {
  initialMessages: [
    createChatBotMessage(`Hello! I'm your medical assistant. How can I help you today?`, {
      widget: "options",
    }),
  ],
  widgets: [
    {
      widgetName: "options",
      widgetFunc: (props) => <Options {...props} />,
      mapStateToProps: ["options"],
    },
    {
      widgetName: "quiz",
      widgetFunc: (props) => <Quiz {...props} />,
      mapStateToProps: ["questions", "options"],
    },
  ],
};

export default config; 