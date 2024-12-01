'use client'

import { useState, useEffect, useMemo } from 'react';
import { debounce } from 'lodash';

export default function Home() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [context, setContext] = useState(null);

  const [result, setResult] = useState(null);
  const [ready, setReady] = useState(null);

  const handleFileSelection = (selectedFiles) => {
    setFiles(selectedFiles);
    setContext(false);
  };

  const processFiles = async () => {
    if (files.length === 0) {
      alert('Please select files before processing.');
      return;
    }

    setProcessing(true);

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    const response = await fetch('/api/process', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      setContext(true);
    } else {
      alert('Error processing the files.');
    }

    setProcessing(false);
  };

  const ask = async (text) => {
    if (!text) return;
    if (ready === null) setReady(false);

    const response = await fetch(`/api/ask?text=${encodeURIComponent(text)}`);

    if (!ready) setReady(true);

    const json = await response.json();
    setResult(json);
  };

  // Wrap `ask` with debounce using useMemo to prevent re-creation on every render
  const debouncedAsk = useMemo(() => debounce(ask, 500), []);

  // Ensure cleanup of the debounce function when the component unmounts
  useEffect(() => {
    return () => {
      debouncedAsk.cancel();
    };
  }, [debouncedAsk]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12">
      <h1 className="text-5xl font-bold mb-2 text-center">AS05: Implementação de Assistente Conversacional Baseado em LLM</h1>

      {/* File Upload Section */}
      <input
        type="file"
        multiple
        className="mb-4"
        accept="application/pdf"
        onChange={(e) => handleFileSelection(e.target.files)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={processFiles}
        disabled={processing}
      >
        {processing ? 'Processando...' : 'Processar arquivos'}
      </button>

      <input
        type="text"
        className="w-full max-w-xs p-2 border border-gray-300 rounded mb-4"
        placeholder="Faça uma pergunta..."
        onInput={(e) => debouncedAsk(e.target.value)}
      />

      {/* Result Section */}
      {ready !== null && (
        <pre className="bg-gray-100 p-2 rounded">
          {
            (!ready || !result) ? 'Carregando...' : JSON.stringify(result, null, 2)}
        </pre>
      )}
    </main>
  );
}
