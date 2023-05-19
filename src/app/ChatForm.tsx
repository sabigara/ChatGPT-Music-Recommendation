"use client";

import { Album } from "@/app/types";
import React from "react";

type Props = {
  onSuccess: (albums: Album[]) => void;
};

export function ChatForm({ onSuccess }: Props) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [messageContent, setMessageContent] = React.useState("");

  const handleChangeInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setMessageContent(e.target.value);
  };

  const handleSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const albumText = await fetchChat({ messageContent });
      if (!albumText) return;
      const regex = /\[([\s\S]*?)\]/;
      const code = albumText.match(regex)?.[0];
      onSuccess(JSON.parse(code ?? albumText));
    } catch (e) {
      console.error(e);
      // handle
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="">
      <label>
        <div>どんな音楽を聴きたいですか？</div>
        <input
          value={messageContent}
          onChange={handleChangeInput}
          placeholder="フランスのジャズ"
          maxLength={50}
          className="border w-full px-3 py-3 rounded-md mt-1"
        />
      </label>
      <button
        type="submit"
        className="bg-purple-500 text-white rounded-md px-4 py-2 mt-4 text-lg min-w-[10rem]"
        disabled={isLoading}
      >
        {isLoading ? "探しています…" : "AIに相談する"}
      </button>
    </form>
  );
}

async function fetchChat({ messageContent }: { messageContent: string }) {
  const controller = new AbortController();

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller.signal,
    body: JSON.stringify({
      messageContent,
    }),
  });
  if (!response.ok) {
    console.error(response.statusText);
    return;
  }
  const data = response.body;
  if (!data) {
    return;
  }
  const reader = data.getReader();
  const decoder = new TextDecoder();
  let done = false;
  let text = "";
  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    const chunkValue = decoder.decode(value);
    text += chunkValue;
    console.log(text);
  }
  return text;
}
