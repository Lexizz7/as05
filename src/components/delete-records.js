"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { debounce } from "lodash";

export default function DeleteRecords({ onDelete }) {
  const [loading, setLoading] = useState(false);

  const deleteRecords = useCallback(async () => {
    setLoading(true);

    try {
      await fetch("/api/records", {
        method: "DELETE",
      });
      onDelete?.();
    } catch (error) {
      console.error("Error fetching records:", error);
    }

    setLoading(false);
  }, [onDelete]);

  return (
    <button
      className="bg-red-500 text-white px-4 py-2 rounded disabled:bg-red-200"
      onClick={deleteRecords}
      disabled={loading}
    >
      {loading ? "Deletando..." : "Deletar registros"}
    </button>
  );
}
