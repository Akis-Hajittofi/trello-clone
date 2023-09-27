import openai from "@/openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { todos } = await request.json();
  console.log(todos);

  // Communicate with openAI GPT
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0.8,
    n: 1,
    stream: false,
    messages: [
      {
        role: "system",
        content: `When responding, welcome the user always as Mr. Haji and say welcome to Phanakis' Todo app! Limit the response to 200 characters`,
      },
      {
        role: "user",
        content: `Hey there, provide a summary of the following todos. Count how many todos are in each category such as To do in progress and done, then tell the user to have a productive day! Here's the data: ${JSON.stringify(
          todos
        )}`,
      },
    ],
  });

  //   const { data } = response;
  console.log("RESPONSE IN ROUTE ===", response.choices[0].message);
  //   console.log("ROUTE.TS ===>", response.choices[0].message);

  return NextResponse.json(response.choices[0].message);
}
