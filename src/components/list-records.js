"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { debounce } from "lodash";
import DeleteRecords from "./delete-records";

export default function ListRecords({ onDelete }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRecords = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/records");

      const json = await response.json();
      setData(json);
      console.log(json);
    } catch (error) {
      console.error("Error fetching records:", error);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return (
    <div className="rounded-md p-4 max-w-md w-full bg-gray-100 border border-gray-300 flex flex-col items-center space-y-4">
      <h2 className="text-xl font-bold">Registros</h2>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <ul className="w-full">
          {data &&
            `Total de arquivos no contexto do Pinecone: ${data.totalRecordCount}`}
        </ul>
      )}

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={fetchRecords}
      >
        Atualizar registros
      </button>

      <DeleteRecords
        onDelete={() => {
          setData(null);
          fetchRecords();
          onDelete?.();
        }}
      />
    </div>
  );
}
