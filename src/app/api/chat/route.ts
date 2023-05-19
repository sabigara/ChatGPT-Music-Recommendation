import { OpenAIStream, OpenAIError } from "@/lib/openai/stream";
import { OpenAIModels } from "@/lib/openai/types";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const { messageContent } = (await request.json()) as {
      messageContent: string;
    };
    if (typeof messageContent !== "string" || messageContent.length > 50) {
      return new Response(
        JSON.stringify({ error: { message: "Invalid messageContent" } }),
        {
          status: 400,
        }
      );
    }

    const stream = await OpenAIStream(
      OpenAIModels["gpt-3.5-turbo"],
      systemPrompt,
      1,
      [{ role: "user", content: messageContent }]
    );

    return new Response(stream);
  } catch (error) {
    console.error(error);
    if (error instanceof OpenAIError) {
      return new Response("Error", { status: 500, statusText: error.message });
    } else {
      return new Response("Error", { status: 500 });
    }
  }
}

const systemPrompt = `The output must be a raw JSON in the following schema in Japanese:

\`\`\`json
[
  {
    title: string, // title of the album.
    artist: string // author of the album
    description: string // description,
  },
]
\`\`\`

NOTES:

- Do not include albums that don't exist.
- Do not include anything other than JSON in your answer.
- Do not include duplicated artists.

What are recommended 2 albums to listen to that conform to the provided condition?`;
