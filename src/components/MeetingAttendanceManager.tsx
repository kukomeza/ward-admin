"use client";

import { useState, useEffect, useCallback } from "react";
import { MeetingAttendanceItem } from "@/lib/types";
import {
  Users,
  UserPlus,
  Search,
  Plus,
  Minus,
  Check,
  Edit2,
  Trash2,
  X,
  UserCheck,
  Loader2,
  Sparkles,
} from "lucide-react";

interface MeetingAttendanceManagerProps {
  meetingId: string;
  onTotalsChange?: (totalAttendees: number, presentFamiliesCount: number) => void;
  darkMode?: boolean;
}

export default function MeetingAttendanceManager({
  meetingId,
  onTotalsChange,
  darkMode = false,
}: MeetingAttendanceManagerProps) {
  const [items, setItems] = useState<MeetingAttendanceItem[]>([]);
  const [totalAttendees, setTotalAttendees] = useState(0);
  const [presentFamiliesCount, setPresentFamiliesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  // Nuevo registro
  const [newFamilyName, setNewFamilyName] = useState("");
  const [newCount, setNewCount] = useState<number>(1);
  const [isAdding, setIsAdding] = useState(false);

  // Filtros y búsqueda
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"ALL" | "PRESENT" | "ABSENT">("ALL");

  // Edición de nombre de familia
  const [editingFamilyId, setEditingFamilyId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const applySummary = useCallback(
    (data: {
      items: MeetingAttendanceItem[];
      totalAttendees: number;
      presentFamiliesCount: number;
    }) => {
      setItems(data.items);
      setTotalAttendees(data.totalAttendees);
      setPresentFamiliesCount(data.presentFamiliesCount);
      if (onTotalsChange) {
        onTotalsChange(data.totalAttendees, data.presentFamiliesCount);
      }
    },
    [onTotalsChange]
  );

  const loadAttendance = useCallback(async () => {
    try {
      const res = await fetch(`/api/meetings/${meetingId}/attendance`);
      const json = await res.json();
      if (json.success) {
        applySummary(json.data);
      }
    } catch (err) {
      console.error("Error cargando lista de asistencia:", err);
    } finally {
      setLoading(false);
    }
  }, [meetingId, applySummary]);

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  // Agregar nueva familia/persona o actualizar si ya existe
  const handleAddFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newFamilyName.trim();
    if (!cleanName) return;

    setIsAdding(true);
    try {
      const res = await fetch(`/api/meetings/${meetingId}/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          family_name: cleanName,
          attendees_count: Math.max(1, Number(newCount) || 1),
        }),
      });
      const json = await res.json();
      if (json.success) {
        applySummary(json.data);
        setNewFamilyName("");
        setNewCount(1);
      }
    } catch (err) {
      console.error("Error agregando asistencia:", err);
    } finally {
      setIsAdding(false);
    }
  };

  // Actualizar cantidad de asistentes de una familia existente
  const handleUpdateCount = async (familyId: string, newAttendeesCount: number) => {
    const cleanCount = Math.max(0, Math.floor(Number(newAttendeesCount) || 0));

    // Actualización optimista inmediata en UI
    setItems((prev) => {
      const next = prev.map((it) =>
        it.family_id === familyId
          ? {
              ...it,
              attendees_count: cleanCount,
              default_count: cleanCount > 0 ? cleanCount : it.default_count,
            }
          : it
      );
      const nextTotal = next.reduce((acc, it) => acc + it.attendees_count, 0);
      const nextPresent = next.filter((it) => it.attendees_count > 0).length;
      setTotalAttendees(nextTotal);
      setPresentFamiliesCount(nextPresent);
      if (onTotalsChange) {
        onTotalsChange(nextTotal, nextPresent);
      }
      return next;
    });

    setSavingId(familyId);
    try {
      const res = await fetch(`/api/meetings/${meetingId}/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          family_id: familyId,
          attendees_count: cleanCount,
        }),
      });
      const json = await res.json();
      if (json.success) {
        applySummary(json.data);
      }
    } catch (err) {
      console.error("Error actualizando cantidad de asistencia:", err);
    } finally {
      setSavingId(null);
    }
  };

  // Guardar edición del nombre de una familia
  const handleSaveFamilyName = async (familyId: string) => {
    if (!editingName.trim()) {
      setEditingFamilyId(null);
      return;
    }
    setSavingId(familyId);
    try {
      const res = await fetch(`/api/meetings/${meetingId}/attendance`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          family_id: familyId,
          name: editingName.trim(),
        }),
      });
      const json = await res.json();
      if (json.success) {
        applySummary(json.data);
      }
    } catch (err) {
      console.error("Error renombrando familia:", err);
    } finally {
      setEditingFamilyId(null);
      setSavingId(null);
    }
  };

  // Eliminar una familia del catálogo general
  const handleDeleteFamily = async (familyId: string, familyName: string) => {
    if (
      !confirm(
        `¿Deseas eliminar a "${familyName}" de la lista de familias registradas? Ya no aparecerá en futuras reuniones.`
      )
    ) {
      return;
    }

    setSavingId(familyId);
    try {
      const res = await fetch(
        `/api/meetings/${meetingId}/attendance?familyId=${encodeURIComponent(familyId)}`,
        { method: "DELETE" }
      );
      const json = await res.json();
      if (json.success) {
        applySummary(json.data);
      }
    } catch (err) {
      console.error("Error eliminando familia:", err);
    } finally {
      setSavingId(null);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.family_name
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase());
    if (!matchesSearch) return false;
    if (filterTab === "PRESENT") return item.attendees_count > 0;
    if (filterTab === "ABSENT") return item.attendees_count === 0;
    return true;
  });

  if (loading) {
    return (
      <div className="p-6 rounded-2xl border border-slate-200 bg-white flex items-center justify-center gap-2 text-slate-500 text-sm">
        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
        <span>Cargando registro de asistencia...</span>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border overflow-hidden shadow-xs ${
        darkMode
          ? "bg-slate-900 border-slate-800 text-white"
          : "bg-white border-slate-200/90 text-slate-900"
      }`}
    >
      {/* Cabecera con Resumen de Asistencia */}
      <div
        className={`px-5 py-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          darkMode
            ? "bg-slate-800/70 border-slate-800"
            : "bg-gradient-to-r from-emerald-50/80 via-teal-50/50 to-white border-slate-200/80"
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`p-2.5 rounded-xl shrink-0 ${
              darkMode
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-emerald-600 text-white shadow-2xs"
            }`}
          >
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3
              className={`font-bold text-base tracking-tight ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Lista de Asistencia (Familias y Personas)
            </h3>
            <p
              className={`text-xs mt-0.5 ${
                darkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Anota las familias o personas asistentes y la cantidad de integrantes. Los nombres quedan guardados para futuras reuniones.
            </p>
          </div>
        </div>

        {/* Contadores Destacados */}
        <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
          <div
            className={`px-3.5 py-2 rounded-xl border text-center ${
              darkMode
                ? "bg-slate-900 border-slate-700"
                : "bg-white border-slate-200 shadow-2xs"
            }`}
          >
            <span
              className={`block text-2xs font-bold uppercase tracking-wider ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Familias Presentes
            </span>
            <span
              className={`text-lg font-extrabold ${
                darkMode ? "text-indigo-400" : "text-indigo-700"
              }`}
            >
              {presentFamiliesCount}
              <span className="text-xs font-normal text-slate-400 ml-1">
                / {items.length}
              </span>
            </span>
          </div>

          <div
            className={`px-4 py-2 rounded-xl border text-center ${
              darkMode
                ? "bg-emerald-950/60 border-emerald-700/60"
                : "bg-emerald-600 border-emerald-700 text-white shadow-xs"
            }`}
          >
            <span
              className={`block text-2xs font-bold uppercase tracking-wider ${
                darkMode ? "text-emerald-300" : "text-emerald-100"
              }`}
            >
              Total Asistentes
            </span>
            <span className="text-xl font-black tracking-tight">
              {totalAttendees}{" "}
              <span className="text-xs font-medium opacity-90">personas</span>
            </span>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Formulario para agregar nueva familia o persona */}
        <form
          onSubmit={handleAddFamily}
          className={`p-4 rounded-xl border ${
            darkMode
              ? "bg-slate-800/50 border-slate-700"
              : "bg-slate-50/90 border-slate-200/90"
          }`}
        >
          <label
            className={`block text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5 ${
              darkMode ? "text-slate-300" : "text-slate-700"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
            <span>Agregar Familia o Persona a la Asistencia:</span>
          </label>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={newFamilyName}
                onChange={(e) => setNewFamilyName(e.target.value)}
                placeholder="Ej. Familia Pérez, Hno. Juan López, Misioneros, Familia Visitante..."
                className={`w-full px-3.5 py-2 text-sm rounded-xl border font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500 ${
                  darkMode
                    ? "bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                    : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                }`}
              />
            </div>

            {/* Selector de cantidad de integrantes que asistieron */}
            <div className="flex items-center justify-between sm:justify-start gap-2">
              <span
                className={`text-xs font-semibold whitespace-nowrap ${
                  darkMode ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Asistentes:
              </span>
              <div
                className={`inline-flex items-center rounded-xl border p-0.5 ${
                  darkMode
                    ? "bg-slate-900 border-slate-700"
                    : "bg-white border-slate-300"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setNewCount((c) => Math.max(1, c - 1))}
                  className={`p-1.5 rounded-lg transition-colors ${
                    darkMode
                      ? "hover:bg-slate-800 text-slate-300"
                      : "hover:bg-slate-100 text-slate-700"
                  }`}
                  title="Restar 1"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={newCount}
                  onChange={(e) =>
                    setNewCount(Math.max(1, parseInt(e.target.value, 10) || 1))
                  }
                  className={`w-12 text-center text-sm font-bold focus:outline-hidden ${
                    darkMode ? "bg-transparent text-white" : "bg-transparent text-slate-900"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setNewCount((c) => c + 1)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    darkMode
                      ? "hover:bg-slate-800 text-slate-300"
                      : "hover:bg-slate-100 text-slate-700"
                  }`}
                  title="Sumar 1"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="submit"
                disabled={isAdding || !newFamilyName.trim()}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer whitespace-nowrap"
              >
                {isAdding ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span>Anotar Asistencia</span>
              </button>
            </div>
          </div>

          {/* Botones rápidos de cantidad (1 a 6) */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            <span className="text-2xs text-slate-500 mr-1">Cantidad rápida:</span>
            {[1, 2, 3, 4, 5, 6, 8].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setNewCount(num)}
                className={`px-2 py-0.5 rounded-md text-2xs font-bold border transition-colors ${
                  newCount === num
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : darkMode
                    ? "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {num} {num === 1 ? "persona" : "personas"}
              </button>
            ))}
          </div>
        </form>

        {/* Barra de Búsqueda y Filtros */}
        {items.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar familia o persona registrada..."
                className={`w-full pl-9 pr-8 py-1.5 text-xs rounded-xl border font-medium focus:outline-hidden focus:ring-1 focus:ring-blue-500 ${
                  darkMode
                    ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white"
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setFilterTab("ALL")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  filterTab === "ALL"
                    ? "bg-slate-900 text-white"
                    : darkMode
                    ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Todas ({items.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab("PRESENT")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  filterTab === "PRESENT"
                    ? "bg-emerald-600 text-white"
                    : darkMode
                    ? "bg-slate-800 text-emerald-400 hover:bg-slate-700"
                    : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                }`}
              >
                Presentes hoy ({presentFamiliesCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab("ABSENT")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  filterTab === "ABSENT"
                    ? "bg-amber-600 text-white"
                    : darkMode
                    ? "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Sin marcar ({items.length - presentFamiliesCount})
              </button>
            </div>
          </div>
        )}

        {/* Listado de Familias / Personas */}
        {items.length === 0 ? (
          <div
            className={`text-center py-8 px-4 rounded-xl border border-dashed ${
              darkMode
                ? "border-slate-800 text-slate-400"
                : "border-slate-200 text-slate-500 bg-slate-50/50"
            }`}
          >
            <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-semibold">
              Aún no hay familias o personas en el listado de asistencia
            </p>
            <p className="text-xs mt-1 max-w-md mx-auto opacity-80">
              Agrega arriba el nombre de una familia (ej. &quot;Familia García&quot;) y cuántos asistieron. Quedarán guardados automáticamente para ésta y todas las futuras reuniones.
            </p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400 italic">
            No se encontraron familias que coincidan con el filtro actual.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {filteredItems.map((item) => {
              const isPresent = item.attendees_count > 0;
              const isEditing = editingFamilyId === item.family_id;

              return (
                <div
                  key={item.family_id}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    isPresent
                      ? darkMode
                        ? "bg-emerald-950/30 border-emerald-700/70"
                        : "bg-emerald-50/70 border-emerald-300 shadow-2xs"
                      : darkMode
                      ? "bg-slate-800/40 border-slate-800 hover:border-slate-700"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {/* Izquierda: Estado y Nombre de la Familia */}
                  <div className="min-w-0 flex-1">
                    {isEditing ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveFamilyName(item.family_id);
                            if (e.key === "Escape") setEditingFamilyId(null);
                          }}
                          autoFocus
                          className={`w-full px-2 py-1 text-xs font-semibold rounded-lg border ${
                            darkMode
                              ? "bg-slate-900 border-slate-600 text-white"
                              : "bg-white border-blue-400 text-slate-900"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveFamilyName(item.family_id)}
                          className="p-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
                          title="Guardar nombre"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingFamilyId(null)}
                          className="p-1 rounded-md bg-slate-200 text-slate-700 hover:bg-slate-300"
                          title="Cancelar"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 group">
                        <span
                          className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                            isPresent ? "bg-emerald-500" : "bg-slate-300"
                          }`}
                        />
                        <span
                          className={`font-bold text-sm truncate ${
                            isPresent
                              ? darkMode
                                ? "text-emerald-200"
                                : "text-slate-900"
                              : darkMode
                              ? "text-slate-300"
                              : "text-slate-700"
                          }`}
                        >
                          {item.family_name}
                        </span>

                        {savingId === item.family_id && (
                          <Loader2 className="w-3 h-3 animate-spin text-emerald-600 shrink-0" />
                        )}

                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 ml-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingFamilyId(item.family_id);
                              setEditingName(item.family_name);
                            }}
                            className="p-1 text-slate-400 hover:text-blue-600 rounded"
                            title="Editar nombre de familia"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteFamily(item.family_id, item.family_name)
                            }
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            title="Eliminar del padrón de futuras reuniones"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="text-2xs text-slate-500 mt-0.5 pl-4">
                      {isPresent ? (
                        <span
                          className={
                            darkMode
                              ? "text-emerald-400 font-semibold"
                              : "text-emerald-700 font-semibold"
                          }
                        >
                          Asistieron {item.attendees_count}{" "}
                          {item.attendees_count === 1 ? "persona" : "personas"}
                        </span>
                      ) : (
                        <span>
                          Habitual: {item.default_count}{" "}
                          {item.default_count === 1 ? "persona" : "personas"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Derecha: Controles para anotar cantidad de asistentes */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {!isPresent && (
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateCount(item.family_id, item.default_count || 1)
                        }
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                          darkMode
                            ? "bg-emerald-950/60 border-emerald-700 text-emerald-300 hover:bg-emerald-800"
                            : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-600 hover:text-white"
                        }`}
                        title={`Marcar presente con ${item.default_count || 1} asistentes`}
                      >
                        Presente ({item.default_count || 1})
                      </button>
                    )}

                    <div
                      className={`inline-flex items-center rounded-xl border p-0.5 ${
                        isPresent
                          ? darkMode
                            ? "bg-slate-900 border-emerald-600"
                            : "bg-white border-emerald-400 shadow-2xs"
                          : darkMode
                          ? "bg-slate-900 border-slate-700"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateCount(item.family_id, item.attendees_count - 1)
                        }
                        disabled={item.attendees_count <= 0}
                        className="p-1 rounded-lg hover:bg-slate-200/60 disabled:opacity-30 text-slate-700 transition-colors cursor-pointer"
                        title="Disminuir cantidad"
                      >
                        <Minus
                          className={`w-3.5 h-3.5 ${
                            darkMode ? "text-slate-300" : "text-slate-700"
                          }`}
                        />
                      </button>

                      <input
                        type="number"
                        min={0}
                        max={50}
                        value={item.attendees_count}
                        onChange={(e) =>
                          handleUpdateCount(
                            item.family_id,
                            parseInt(e.target.value, 10) || 0
                          )
                        }
                        className={`w-10 text-center text-xs font-extrabold focus:outline-hidden ${
                          isPresent
                            ? darkMode
                              ? "text-emerald-300 bg-transparent"
                              : "text-emerald-800 bg-transparent"
                            : darkMode
                            ? "text-slate-400 bg-transparent"
                            : "text-slate-500 bg-transparent"
                        }`}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateCount(item.family_id, item.attendees_count + 1)
                        }
                        className="p-1 rounded-lg hover:bg-slate-200/60 text-slate-700 transition-colors cursor-pointer"
                        title="Aumentar cantidad"
                      >
                        <Plus
                          className={`w-3.5 h-3.5 ${
                            darkMode ? "text-slate-300" : "text-slate-700"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Nota informativa inferior */}
        <div
          className={`flex items-center gap-2 text-2xs pt-1 ${
            darkMode ? "text-slate-400" : "text-slate-500"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>
            Todas las familias o personas agregadas aquí se conservan automáticamente en el padrón de asistencia para que en las próximas reuniones solo tengas que marcar cuántos asistieron.
          </span>
        </div>
      </div>
    </div>
  );
}

