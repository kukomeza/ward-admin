"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { PersonCandidateStatus, TaskType } from "@/lib/types";
import { 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Search, 
  Loader2,
  Calendar
} from "lucide-react";

export default function RotationPage() {
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
  const [selectedTaskTypeId, setSelectedTaskTypeId] = useState<string>("");
  const [targetDate, setTargetDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [candidates, setCandidates] = useState<PersonCandidateStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Load task types
  useEffect(() => {
    async function loadTasks() {
      try {
        const res = await fetch("/api/tasks");
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setTaskTypes(data.data);
          // Default to TALK or first
          const defaultTask =
            data.data.find((t: TaskType) => t.code === "TALK") || data.data[0];
          setSelectedTaskTypeId(defaultTask.id);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadTasks();
  }, []);

  // Load candidates when task or date changes
  useEffect(() => {
    if (!selectedTaskTypeId) return;

    async function loadCandidates() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/rotations/candidates?taskTypeId=${selectedTaskTypeId}&meetingDate=${targetDate}`
        );
        const data = await res.json();
        if (data.success) {
          setCandidates(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCandidates();
  }, [selectedTaskTypeId, targetDate]);

  const selectedTask = taskTypes.find((t) => t.id === selectedTaskTypeId);

  const availableCandidates = candidates.filter(
    (c) =>
      !c.conflict &&
      (`${c.person.first_name} ${c.person.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
        (c.person.notes || "").toLowerCase().includes(search.toLowerCase()))
  );

  const recentCandidates = candidates.filter(
    (c) =>
      c.conflict &&
      (`${c.person.first_name} ${c.person.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
        (c.person.notes || "").toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Auditoría de Rotación y Equidad (Regla de 3 Meses)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Revisa la disponibilidad de los miembros para cada tarea y asegura que todos tengan oportunidad de participar sin saturar a los mismos hermanos.
          </p>

          {/* Task selector & Date selector */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                Seleccionar Tarea a Evaluar
              </label>
              <select
                value={selectedTaskTypeId}
                onChange={(e) => setSelectedTaskTypeId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
              >
                {taskTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Fecha de Evaluación
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5 flex items-center gap-1">
                <Search className="w-3.5 h-3.5" /> Filtrar Miembros
              </label>
              <input
                type="text"
                placeholder="Nombre o llamamiento..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-sm">Analizando ventana de 90 días...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Column 1: Disponibles */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Disponibles para {selectedTask?.name}
                    </h2>
                    <p className="text-xs text-slate-500">
                      No han realizado esta tarea en los últimos 3 meses
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  {availableCandidates.length} personas
                </span>
              </div>

              {availableCandidates.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No hay personas disponibles según los filtros.
                </div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {availableCandidates.map((c) => (
                    <div
                      key={c.person.id}
                      className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/40 hover:bg-white flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 text-sm">
                            {c.person.first_name} {c.person.last_name}
                          </span>
                          {c.person.notes && (
                            <span className="text-2xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-sm">
                              {c.person.notes}
                            </span>
                          )}
                        </div>
                        <span className="text-slate-500 mt-0.5 block">
                          {c.days_ago !== undefined
                            ? `Última vez: hace ${c.days_ago} días (${c.last_task_date})`
                            : "Sin registros anteriores en esta tarea"}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                          Listo para invitar
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Column 2: Alerta / Ya participaron en los últimos 3 meses */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Participaron Recientemente en {selectedTask?.name}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Realizaron esta misma tarea hace menos de 90 días
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800">
                  {recentCandidates.length} personas
                </span>
              </div>

              {recentCandidates.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Ningún miembro ha realizado esta tarea en los últimos 3 meses.
                </div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {recentCandidates.map((c) => (
                    <div
                      key={c.person.id}
                      className="p-3 rounded-xl border border-rose-200/80 bg-rose-50/30 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 text-sm">
                            {c.person.first_name} {c.person.last_name}
                          </span>
                          {c.person.notes && (
                            <span className="text-2xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-sm">
                              {c.person.notes}
                            </span>
                          )}
                        </div>
                        <span className="text-rose-700 font-medium mt-0.5 block flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 inline" />
                          {c.conflict_details}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-rose-800 font-semibold bg-rose-100 px-2 py-0.5 rounded-md">
                          En pausa
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
