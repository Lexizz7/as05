"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { debounce } from "lodash";

export default function AskCard() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const ask = useCallback(async (text) => {
    if (!text) return;
    setLoading(true);

    try {
      const response = await fetch(`/api/ask?text=${encodeURIComponent(text)}`);

      const json = await response.json();
      setResult(json);
    } catch (error) {
      console.error("Error fetching records:", error);
    }

    setLoading(false);
  }, []);

  const debouncedAsk = useMemo(() => debounce(ask, 500), [ask]);

  useEffect(() => {
    return () => {
      debouncedAsk.cancel();
    };
  }, [debouncedAsk]);

  return (
    <div className="rounded-md p-4 max-w-md w-full bg-gray-100 border border-gray-300 flex flex-col items-center space-y-4">
      <h2 className="text-xl font-bold">Faça uma pergunta</h2>

      <input
        type="text"
        className="w-full max-w-md p-2 border border-gray-300 rounded mb-4"
        placeholder="Faça uma pergunta..."
        onInput={(e) => debouncedAsk(e.target.value)}
      />

      <pre className="bg-gray-200 p-2 rounded w-full overflow-auto whitespace-pre-wrap break-words">
        {loading
          ? "Carregando..."
          : result
          ? result.answer || "Nenhuma resposta encontrada."
          : ""}
      </pre>
    </div>
  );
}
