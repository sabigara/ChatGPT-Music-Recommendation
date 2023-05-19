"use client";

import { Albums } from "@/app/Albums";
import { ChatForm } from "@/app/ChatForm";
import { Album } from "@/app/types";
import React from "react";

export default function Home() {
  const [albums, setAlbums] = React.useState<Album[]>([]);
  return (
    <main className="max-w-screen-sm mx-auto px-4 py-8">
      <ChatForm onSuccess={setAlbums} />
      <Albums albums={albums} className="mt-8" />
    </main>
  );
}
