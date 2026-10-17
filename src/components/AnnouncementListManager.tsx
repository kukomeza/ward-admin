"use client";

import { useState } from "react";
import {
  parseAnnouncementList,
  serializeAnnouncementList,
  OfficialBusinessType,
  formatOfficialBusinessEntry,
  parseOfficialBusinessItem,
} from "@/lib/translations";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Hand,
  HeartHandshake,
  UserPlus,
  Sparkles,
  Megaphone,
} from "lucide-react";

interface AnnouncementListManagerProps {
  initialNotes?: string | null;
  onSave: (serialized: string) => void;
}

const COMMON_CALLINGS = [
  "Presidente del Quórum de Élderes",
  "Primer Consejero del Quórum de Élderes",
  "Segundo Consejero del Quórum de Élderes",
  "Secretario del Quórum de Élderes",
  "Presidenta de la Sociedad de Socorro",
  "Primera Consejera de la Sociedad de Socorro",
  "Segunda Consejera de la Sociedad de Socorro",
  "Secretaria de la Sociedad de Socorro",
  "Presidenta de la Primaria",
  "Primera Consejera de la Primaria",
  "Segunda Consejera de la Primaria",
  "Maestro(a) de la Primaria",
  "Presidente de la Escuela Dominical",
  "Maestro(a) de Escuela Dominical",
  "Presidenta de las Mujeres Jóvenes",
  "Director(a) de Música de la Rama/Barrio",
  "Pianista / Organista",
  "Líder Misional de Rama/Barrio",
  "Consultor(a) de Templo e Historia Familiar",
];

export default function AnnouncementListManager({
  initialNotes,
  onSave,
}: AnnouncementListManagerProps) {
  const [items, setItems] = useState<string[]>(() =>
    parseAnnouncementList(initialNotes)
  );
  const [mode, setMode] = useState<OfficialBusinessType>("ANNOUNCEMENT");

  // Free announcement text
  const [newItem, setNewItem] = useState("");

  // Official business fields
  const [personName, setPersonName] = useState("");
  const [detail, setDetail] = useState("");

  const updateList = (newList: string[]) => {
    setItems(newList);
    onSave(serializeAnnouncementList(newList));
  };

  const handleModeChange = (nextMode: OfficialBusinessType) => {
    setMode(nextMode);
    if (nextMode === "WELCOME_MEMBER") {
      setDetail("Bautismo y Confirmación");
    } else if (nextMode === "ORDINATION") {
      setDetail("Diácono");
    } else {
      setDetail("");
    }
  };

  const handleAdd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (mode === "ANNOUNCEMENT") {
      const trimmed = newItem.trim();
      if (!trimmed) return;
      updateList([...items, trimmed]);
      setNewItem("");
      return;
    }

    if (!personName.trim() || !detail.trim()) return;
    const formatted = formatOfficialBusinessEntry(mode, personName, detail);
    updateList([...items, formatted]);
    setPersonName("");
    if (mode === "SUSTAINING" || mode === "RELEASE") {
      setDetail("");
    }
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

  const getBadgeStyle = (type: OfficialBusinessType) => {
    switch (type) {
      case "SUSTAINING":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "RELEASE":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "WELCOME_MEMBER":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "ORDINATION":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-3 bg-slate-50/90 p-3.5 rounded-xl border border-slate-200">
      {/* Existing items list */}
      {items.length === 0 ? (
        <p className="text-2xs text-slate-400 italic">
          No hay asuntos ni anuncios agregados aún. Usa las pestañas de abajo para agregar anuncios generales, sostenimientos, relevos, bienvenidas u ordenaciones con guion oficial para el púlpito.
        </p>
      ) : (
        <div className="space-y-2">
          {items.map((text, idx) => {
            const parsed = parseOfficialBusinessItem(text);
            return (
              <div
                key={idx}
                className="bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs shadow-2xs group space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0 flex-wrap">
                    <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-700 font-bold text-2xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span
                      className={`text-2xs font-bold px-2 py-0.5 rounded-md border shrink-0 ${getBadgeStyle(
                        parsed.type
                      )}`}
                    >
                      {parsed.badgeLabel}
                    </span>
                    <span className="text-slate-900 font-semibold truncate">
                      {parsed.summaryText}
                    </span>
                  </div>

                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMove(idx, "up")}
                      disabled={idx === 0}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 rounded-sm cursor-pointer"
                      title="Subir"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(idx, "down")}
                      disabled={idx === items.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 rounded-sm cursor-pointer"
                      title="Bajar"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-sm cursor-pointer"
                      title="Eliminar asunto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {parsed.pulpitScript && (
                  <p className="text-2xs text-slate-500 italic pl-7 leading-relaxed">
                    Guion de púlpito: {parsed.pulpitScript}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Selector de Tipo de Asunto / Anuncio */}
      <div className="pt-2 border-t border-slate-200/80 space-y-2.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => handleModeChange("ANNOUNCEMENT")}
            className={`px-2.5 py-1 rounded-lg text-2xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
              mode === "ANNOUNCEMENT"
                ? "bg-blue-600 text-white"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Megaphone className="w-3 h-3" />
            <span>Anuncio General</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange("SUSTAINING")}
            className={`px-2.5 py-1 rounded-lg text-2xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
              mode === "SUSTAINING"
                ? "bg-emerald-600 text-white"
                : "bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100"
            }`}
          >
            <Hand className="w-3 h-3" />
            <span>Sostenimiento</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange("RELEASE")}
            className={`px-2.5 py-1 rounded-lg text-2xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
              mode === "RELEASE"
                ? "bg-amber-600 text-white"
                : "bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100"
            }`}
          >
            <HeartHandshake className="w-3 h-3" />
            <span>Relevo</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange("WELCOME_MEMBER")}
            className={`px-2.5 py-1 rounded-lg text-2xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
              mode === "WELCOME_MEMBER"
                ? "bg-indigo-600 text-white"
                : "bg-indigo-50 border border-indigo-200 text-indigo-800 hover:bg-indigo-100"
            }`}
          >
            <UserPlus className="w-3 h-3" />
            <span>Nuevo Miembro</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange("ORDINATION")}
            className={`px-2.5 py-1 rounded-lg text-2xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
              mode === "ORDINATION"
                ? "bg-purple-600 text-white"
                : "bg-purple-50 border border-purple-200 text-purple-800 hover:bg-purple-100"
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Ordenación Sacerdocio</span>
          </button>
        </div>

        {/* Formulario dinámico según el tipo seleccionado */}
        {mode === "ANNOUNCEMENT" ? (
          <div className="flex gap-1.5">
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
              placeholder="Escribir anuncio o aviso (ej. Actividad de rama el viernes a las 19:00 hrs)..."
              className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 placeholder-slate-400 text-slate-900 font-medium"
            />
            <button
              type="button"
              onClick={() => handleAdd()}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Agregar</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2 bg-white p-2.5 rounded-xl border border-slate-200">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                placeholder="Nombre completo del hermano(a)..."
                className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-1 focus:ring-blue-500 text-slate-900 font-medium placeholder:text-slate-400"
              />

              {(mode === "SUSTAINING" || mode === "RELEASE") && (
                <>
                  <input
                    type="text"
                    list="common-callings-list"
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAdd();
                      }
                    }}
                    placeholder={
                      mode === "SUSTAINING"
                        ? "Llamamiento al que se sostiene..."
                        : "Llamamiento del que se releva..."
                    }
                    className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-1 focus:ring-blue-500 text-slate-900 font-medium placeholder:text-slate-400"
                  />
                  <datalist id="common-callings-list">
                    {COMMON_CALLINGS.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </>
              )}

              {mode === "WELCOME_MEMBER" && (
                <select
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 font-medium"
                >
                  <option value="Bautismo y Confirmación">
                    Por Bautismo y Confirmación
                  </option>
                  <option value="Traslado de Cédula">
                    Por Traslado de Cédula
                  </option>
                </select>
              )}

              {mode === "ORDINATION" && (
                <select
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 font-medium"
                >
                  <option value="Diácono">Oficio de Diácono</option>
                  <option value="Maestro">Oficio de Maestro</option>
                  <option value="Presbítero">Oficio de Presbítero</option>
                </select>
              )}

              <button
                type="button"
                onClick={() => handleAdd()}
                disabled={!personName.trim() || !detail.trim()}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 shadow-2xs transition-colors shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar Asunto</span>
              </button>
            </div>

            {personName.trim() && detail.trim() && (
              <div className="text-2xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/80 italic">
                <strong className="not-italic text-slate-700">
                  Vista previa para el púlpito:{" "}
                </strong>
                {
                  parseOfficialBusinessItem(
                    formatOfficialBusinessEntry(mode, personName, detail)
                  ).pulpitScript
                }
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
