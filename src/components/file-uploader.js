"use client";

import { useState } from "react";

export default function FileUploader({ onUpload }) {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);

  const handleFileSelection = (selectedFiles) => {
    setFiles(selectedFiles);
  };

  const processFiles = async () => {
    if (files.length === 0) {
      alert("Por favor, selecione arquivos antes de processar.");
      return;
    }

    setProcessing(true);
    setProcessed(false);

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    const response = await fetch("/api/process", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      setProcessed(true);
      onUpload?.();
    } else {
      alert("Erro ao processar os arquivos.");
    }

    setProcessing(false);
  };

  return (
    <div className="rounded-md p-4 max-w-md w-full bg-gray-100 border border-gray-300 flex flex-col items-center space-y-4">
      <h2 className="text-xl font-bold">Envie arquivos</h2>

      <input
        type="file"
        multiple
        accept="application/pdf"
        onChange={(e) => handleFileSelection(e.target.files)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-200"
        onClick={processFiles}
        disabled={processing || files.length === 0}
      >
        {processing ? "Processando..." : "Processar arquivos"}
      </button>
      {processed && <p>Arquivos processados com sucesso!</p>}
    </div>
  );
}
