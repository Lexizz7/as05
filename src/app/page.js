"use client";

import { useState } from "react";
import FileUploader from "@/components/file-uploader";
import AskCard from "@/components/ask-card";
import ListRecords from "@/components/list-records";

export default function Home() {
  const [updateNumber, setUpdateNumber] = useState(0);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center space-y-6 p-6">
      <h1 className="text-5xl font-bold mb-2 text-center">
        Assistente Conversacional Baseado em LLM
      </h1>

      <FileUploader onUpload={() => setUpdateNumber((number) => number + 1)} />

      <AskCard />

      <ListRecords key={updateNumber} />
    </main>
  );
}
