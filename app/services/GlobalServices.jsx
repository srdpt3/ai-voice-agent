import axios from "axios";
import OpenAI from "openai";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import { ExpertsLists } from "./Options";

export const getToken = async () => {
  const result = await axios.get("/api/getToken");
  console.log(result.data);
  return result.data;
};

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const AIModel = async (topic, coachingOption, lastTwoMsg) => {
  try {
    const options = ExpertsLists.find(
      (option) => option.name === coachingOption,
    );
    const Prompt = options.prompt.replace("{user_topic}", topic);

    // Set a timeout for the API call
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("API request timeout")), 5000),
    );

    // Add request parameters to optimize for speed
    const apiPromise = openai.chat.completions.create({
      model: "google/gemini-2.5-pro-exp-03-25:free", // Using your original model
      messages: [
        {
          role: "system",
          content: Prompt,
        },
        ...lastTwoMsg,
      ],
      temperature: 0.7, // Lower temperature for faster responses
      max_tokens: 150, // Limit response length for speed
    });

    // Race the API call against the timeout
    const completion = await Promise.race([apiPromise, timeoutPromise]);

    if (!completion.choices || completion.choices.length === 0) {
      console.error("No choices returned from API");
      return {
        role: "assistant",
        content: "I'm sorry, I couldn't generate a response. Please try again.",
      };
    }

    return completion.choices[0].message;
  } catch (error) {
    console.error("Error in AIModel:", error);
    // Return a quick fallback response
    return {
      role: "assistant",
      content:
        "I understand. Let me think about that and get back to you. Please continue.",
    };
  }
};

export const ConvertTextToSpeech = async (text, expertName) => {
  const pollyClient = new PollyClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    },
  });
  const command = new SynthesizeSpeechCommand({
    Text: text,
    OutputFormat: "mp3",
    VoiceId: "Amy",
  });
  try {
    const { AudioStream } = await pollyClient.send(command);
    const audioArrayBuffer = await AudioStream.transformToByteArray();

    const audioBlob = new Blob([audioArrayBuffer], { type: "audio/mp3" });
    const audioUrl = URL.createObjectURL(audioBlob);
    return audioUrl;
  } catch (error) {
    console.error("Error in ConvertTextToSpeech:", error);
    return null;
  }
};
