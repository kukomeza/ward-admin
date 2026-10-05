"use client";

import { useEffect, useState, useTransition } from "react";
import { PersonCandidateStatus, TaskType } from "@/lib/types";
import { 
  X, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  ShieldAlert,
  Loader2
} from "lucide-react";

interface AssignPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetingId: string;
  meetingDate: string;
  meetingItemId?: string | null;
  taskType: TaskType;
  assignmentNotes?: string | null;
  modalTitle?: string;
  onAssigned: () => void;
}

export default function AssignPersonModal({
  isOpen,
  onClose,
  meetingId,
  meetingDate,
  meetingItemId,
  taskType,
  assignmentNotes,
  modalTitle,
  onAssigned,
}: AssignPersonModalProps) {
  const [candidates, setCandidates] = useState<PersonCandidateStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<PersonCandidateStatus | null>(null);
  const [showOverrideConfirm, setShowOverrideConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSelectedCandidate(null);
      setShowOverrideConfirm(false);
      setError(null);
      return;
    }

    async function loadCandidates() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/rotations/candidates?taskTypeId=${taskType.id}&meetingDate=${meetingDate}&excludeMeetingId=${meetingId}`
        );
        const data = await res.json();
        if (data.success) {
          setCandidates(data.data);
        } else {
          setError(data.error || "Error al cargar candidatos");
        }
      } catch {
        setError("Error de conexión al cargar candidatos");
      } finally {
        setLoading(false);
      }
    }

    loadCandidates();
  }, [isOpen, taskType.id, meetingDate, meetingId]);

  if (!isOpen) return null;

  const filteredCandidates = candidates.filter((c) => {
    const fullName = `${c.person.first_name} ${c.person.last_name}`.toLowerCase();
    const notes = (c.person.notes || "").toLowerCase();
    const q = search.toLowerCase();
    return fullName.includes(q) || notes.includes(q);
  });

  const handleSelectCandidate = (candidate: PersonCandidateStatus) => {
    if (candidate.conflict) {
      setSelectedCandidate(candidate);
      setShowOverrideConfirm(true);
    } else {
      executeAssign(candidate.person.id, false);
    }
  };

  const executeAssign = async (personId: string, override: boolean) => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/meetings/${meetingId}/assignments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            meeting_item_id: meetingItemId,
            person_id: personId,
            task_type_id: taskType.id,
            override_3month_alert: override,
            notes: assignmentNotes || null,
          }),
        });
        const result = await res.json();
        if (result.success) {
          onAssigned();
          onClose();
        } else {
          setError(result.error || "No se pudo realizar la asignación");
        }
      } catch {
        setError("Error de red al asignar persona");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: taskType.color || "#2563eb" }}
              />
              <h3 className="font-semibold text-slate-900 text-lg">
                {modalTitle || `Asignar ${taskType.name}`}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Fecha de reunión: {meetingDate} • Evaluando regla de 3 meses (90 días)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {showOverrideConfirm && selectedCandidate ? (
            /* Warning Override Modal View */
            <div className="p-4 rounded-xl border border-amber-300 bg-amber-50 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 rounded-lg text-amber-700 shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-amber-900 text-base">
                    Alerta de Participación Reciente (3 Meses)
                  </h4>
                  <p className="text-sm text-amber-800 mt-1">
                    <strong>
                      {selectedCandidate.person.first_name}{" "}
                      {selectedCandidate.person.last_name}
                    </strong>{" "}
                    ya realizó esta misma tarea (<strong>{modalTitle || taskType.name}</strong>) hace menos de 90 días:
                  </p>
                  <div className="mt-2 text-xs font-medium text-amber-950 bg-white/70 p-2.5 rounded-md border border-amber-200">
                    📅 {selectedCandidate.conflict_details}
                  </div>
                </div>
              </div>

              <p className="text-xs text-amber-700">
                Se recomienda rotar a los participantes para dar oportunidad a otros miembros.
                ¿Deseas confirmar esta asignación de todos modos como excepción justificada?
              </p>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowOverrideConfirm(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100"
                >
                  Volver a la lista
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => executeAssign(selectedCandidate.person.id, true)}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 flex items-center gap-1.5 shadow-xs"
                >
                  {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Confirmar excepción y asignar
                </button>
              </div>
            </div>
          ) : (
            /* Candidate Selection List */
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar persona por nombre o notas..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-medium placeholder:text-slate-400"
                />
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 text-xs text-slate-500 pb-1 border-b border-slate-100">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Disponible (&gt;90 días)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Alerta (participó en los últimos 3 meses)
                </span>
              </div>

              {/* List */}
              {loading ? (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="text-xs">Consultando historial de 3 meses...</span>
                </div>
              ) : filteredCandidates.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-sm">
                  No se encontraron personas con ese nombre.
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {filteredCandidates.map((c) => (
                    <button
                      key={c.person.id}
                      onClick={() => handleSelectCandidate(c)}
                      disabled={isPending}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${
                        c.conflict
                          ? "border-rose-200/80 bg-rose-50/40 hover:bg-rose-50 hover:border-rose-300"
                          : "border-slate-200 bg-white hover:bg-blue-50/50 hover:border-blue-300 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                            c.conflict
                              ? "bg-rose-100 text-rose-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {c.person.first_name[0]}
                          {c.person.last_name[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-900 text-sm">
                              {c.person.first_name} {c.person.last_name}
                            </span>
                            {c.person.notes && (
                              <span className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-sm">
                                {c.person.notes}
                              </span>
                            )}
                          </div>

                          {/* 3-month conflict badge */}
                          {c.conflict ? (
                            <div className="flex items-center gap-1 text-xs text-rose-700 font-medium mt-1">
                              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                              <span>{c.conflict_details}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-xs text-emerald-700 mt-1">
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                              <span>
                                {c.days_ago !== undefined
                                  ? `Última vez: hace ${c.days_ago} días`
                                  : "Disponible (sin registros recientes)"}
                              </span>
                              {c.last_any_task_name && (
                                <span className="text-slate-400 text-2xs ml-1 flex items-center gap-0.5">
                                  <Clock className="w-3 h-3 inline" />
                                  (otra tarea: {c.last_any_task_name})
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 ml-2">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                            c.conflict
                              ? "bg-rose-100 text-rose-800 group-hover:bg-rose-200"
                              : "bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white"
                          }`}
                        >
                          {c.conflict ? "Excepción" : "Asignar"}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-between items-center text-xs text-slate-500">
          <span>Sistema de equidad de asignaciones</span>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
