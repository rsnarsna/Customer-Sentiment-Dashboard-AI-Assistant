
# Customer Sentiment Dashboard & AI Assistant

This is an advanced single-page application designed to provide deep insights into customer feedback. It leverages powerful AI models to analyze raw text reviews and generates a visual, easy-to-understand dashboard. Additionally, it features a versatile AI assistant with a special "Thinking Mode" for handling complex queries.

The application is built to be model-agnostic, allowing users to switch between different AI providers like Google Gemini, OpenAI, and Mistral on the fly.

## ✨ Features

- **Sentiment Analysis**: Paste raw, unstructured customer reviews and receive a structured analysis.
- **Dynamic Visualizations**:
    - **Sentiment Trend Chart**: A line chart that visualizes the fluctuation of sentiment across the provided reviews.
    - **Keyword Word Cloud**: A word cloud that highlights the most frequent and impactful positive and negative keywords.
- **AI-Powered Executive Summary**: Get a concise, actionable summary written by the AI, detailing the top areas for improvement.
- **Multi-Provider AI Assistant**:
    - Engage in a conversation with a powerful AI assistant to ask follow-up questions or explore data further.
    - **Thinking Mode**: A high-power mode that utilizes Google's `gemini-2.5-pro` model with its maximum thinking budget, perfect for deep, complex, and nuanced queries.
    - **Provider Agnostic**: Seamlessly switch between Google, OpenAI, and Mistral models to compare responses or use your preferred provider. *(Note: OpenAI and Mistral integrations are placeholders and require their respective SDKs and API keys to be fully functional.)*
- **Responsive Design**: A clean, modern UI that works beautifully on all screen sizes, built with Tailwind CSS.

## 🚀 Tech Stack

- **Frontend**: React, TypeScript
- **AI Integration**: `@google/genai` for Google Gemini
- **Styling**: Tailwind CSS
- **Data Visualization**:
    - **Charts**: Recharts
    - **Word Cloud**: D3.js & d3-cloud

## 🔧 How to Use

### Analyzing Sentiment

1.  Navigate to the **Customer Sentiment Dashboard** section.
2.  Select your preferred AI provider (Google, OpenAI, or Mistral) using the selector buttons.
3.  Paste your customer reviews into the text area. For best results, place each review on a new line. You can also click **Use Sample Data** to populate the field with example reviews.
4.  Click the **Analyze Sentiment** button.
5.  The dashboard will update with the **Executive Summary**, **Sentiment Trend** chart, and **Keywords Word Cloud**.

### Using the AI Assistant

1.  Scroll down to the **AI Assistant** section.
2.  Select your desired AI provider.
3.  For complex or creative tasks that require deep reasoning, enable **Thinking Mode**. This will switch to a more powerful model and configuration. The chat history will reset when you change modes or providers.
4.  Type your message in the input field and press `Enter` or click the send button.
5.  The conversation will appear in the chat window. The Google provider supports real-time streaming of responses.

## 🔑 API Key Configuration

This application is designed to use API keys from environment variables for security.

- **Google Gemini**: The application uses `process.env.API_KEY` to initialize the Google GenAI client in `services/aiService.ts`.
- **OpenAI & Mistral**: To enable these providers, you would need to:
    1.  Add your API keys as environment variables (e.g., `OPENAI_API_KEY`, `MISTRAL_API_KEY`).
    2.  Install their respective client SDKs.
    3.  Update the placeholder functions in `services/aiService.ts` to make the actual API calls.

## 📂 Project Structure

```
/
├── public/
├── src/
│   ├── components/
│   │   ├── Chatbot.tsx
│   │   ├── ProviderSelector.tsx
│   │   ├── SentimentDashboard.tsx
│   │   ├── TrendChart.tsx
│   │   ├── WordCloud.tsx
│   │   └── icons.tsx
│   ├── services/
│   │   └── aiService.ts       # Handles all AI API interactions
│   ├── App.tsx                # Main app layout
│   ├── index.tsx              # React entry point
│   └── types.ts               # TypeScript type definitions
├── index.html                 # Main HTML file
└── metadata.json
└── README.md                  # This file
```

---
*This project was created as a demonstration of modern AI capabilities in a practical business application.*
