import axios from "axios";
import OpenAI from "openai";

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

export const AIModel = async (topic, coachingOption, message) => {
  const options = ExpertsLists.find((option) => option.name === coachingOption);
  const Prompt = options.prompt.replace("{user_topic}", topic);
  console.log(Prompt);
  const completion = await openai.chat.completions.create({
    model: "google/gemini-2.5-pro-exp-03-25:free",
    messages: [
      {
        role: "system",
        content: Prompt,
      },
      {
        role: "user",
        content: message,
      },
    ],
  });
  console.log(completion.choices[0].message);
};
