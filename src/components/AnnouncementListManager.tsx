"use client";

import { useState } from "react";
import { parseAnnouncementList, serializeAnnouncementList } from "@/lib/translations";
import { Plus, Trash2, ChevronUp, ChevronDown, CheckCircle2 } from "lucide-react";

interface AnnouncementListManagerProps {
  initialNotes?: string | null;
  onSave: (serialized: string) => void;
}

export default function AnnouncementListManager({
  initialNotes,
  onSave,
}: AnnouncementListManagerProps) {
  const [items, setItems] = useState<string[]>(() =>
    parseAnnouncementList(initialNotes)
  );
  const [newItem, setNewItem] = useState("");

  const updateList = (newList: string[]) => {
    setItems(newList);
    onSave(serializeAnnouncementList(newList));
  };

  const handleAdd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newItem.trim();
    if (!trimmed) return;
    const next = [...items, trimmed];
    updateList(next);
    setNewItem("");
  };

  const handleRemove = (index: number) => {
    const next = items.filter((_, i) => i !== index);
    updateList(next);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const temp = next[index];
    next[index] = next[target];
    next[target] = temp;
    updateList(next);
  };

  return (
    <div className="space-y-2 bg-slate-50/80 p-3 rounded-xl border border-slate-200">
      {/* Existing items list */}
      {items.length === 0 ? (
        <p className="text-2xs text-slate-400 italic">
          No hay asuntos agregados aún. Escribe a continuación para crear la lista ordenada.
        </p>
      ) : (
        <div className="space-y-1.5">
          {items.map((text, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-2 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs shadow-2xs group"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-700 font-bold text-2xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="text-slate-800 truncate">{text}</span>
              </div>

              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleMove(idx, "up")}
                  disabled={idx === 0}
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 rounded-sm"
                  title="Subir"
                >
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(idx, "down")}
                  disabled={idx === items.length - 1}
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 rounded-sm"
                  title="Bajar"
                >
                  <ChevronDown className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded-sm"
                  title="Eliminar asunto"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add new matter input */}
      <div className="flex gap-1.5 pt-1">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder="Escribir asunto (ej. Sostenimiento de..., Anuncio de actividad...)"
          className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 placeholder-slate-400 text-slate-900 font-medium"
        />
        <button
          type="button"
          onClick={() => handleAdd()}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors shrink-0"
        >
          <Plus className="w-3 h-3" />
          <span>Agregar</span>
        </button>
      </div>
    </div>
  );
}
