"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import NewMeetingModal from "@/components/NewMeetingModal";
import { Meeting } from "@/lib/types";
import { formatMeetingStatus } from "@/lib/translations";
import { 
  Calendar, 
  Plus, 
  Clock, 
  Users, 
  Radio, 
  Printer, 
  ArrowRight, 
  Search,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Trash2
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const loadMeetings = async () => {
    try {
      const res = await fetch("/api/meetings");
      const data = await res.json();
      if (data.success) {
        setMeetings(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeetings();
  }, []);

  const handleDeleteMeeting = async (meetingId: string, title: string) => {
    if (
      !confirm(
        `¿Estás seguro de que deseas eliminar la reunión "${title}"? Se borrarán su programa y asignaciones.`
      )
    ) {
      return;
    }
    try {
      const res = await fetch(`/api/meetings/${meetingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setMeetings((prev) => prev.filter((m) => m.id !== meetingId));
      }
    } catch (err) {
      console.error("Error eliminando reunión:", err);
    }
  };

  const filteredMeetings = meetings.filter((m) => {
    const matchesStatus =
      statusFilter === "ALL" ? true : m.status === statusFilter;
    const matchesSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      (m.meeting_type_name || "").toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
        {/* Hero Banner / Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Reuniones y Agendas
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Planifica cada programa, asigna tareas evitando repeticiones de 3 meses y conduce en vivo.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Reunión</span>
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por título o tipo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: "ALL", label: "Todas" },
              { id: "SCHEDULED", label: "Programadas" },
              { id: "COMPLETED", label: "Finalizadas" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  statusFilter === tab.id
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Meetings Grid / List */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-sm">Cargando reuniones...</span>
          </div>
        ) : filteredMeetings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              No hay reuniones registradas
            </h3>
            <p className="text-xs text-slate-500">
              Comienza creando una nueva reunión sacramental, bautismal o devocional.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Crear mi primera reunión</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMeetings.map((m) => {
              const isPast = m.status === "COMPLETED";

              return (
                <div
                  key={m.id}
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-md transition-all flex flex-col overflow-hidden group"
                >
                  {/* Card Header */}
                  <div className="p-5 flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                        {m.meeting_type_name}
                      </span>
                      <span
                        className={`text-2xs font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          isPast
                            ? "bg-slate-100 text-slate-600"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {formatMeetingStatus(m.status)}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                        {m.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {m.meeting_date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {m.start_time} hrs
                        </span>
                      </div>
                    </div>

                    {/* Preside & Dirige info */}
                    <div className="pt-2 border-t border-slate-100 space-y-1 text-xs">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-400">Preside:</span>
                        <span className="font-medium text-slate-900 truncate max-w-[180px]">
                          {m.presiding_name || "—"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-400">Dirige:</span>
                        <span className="font-medium text-slate-900 truncate max-w-[180px]">
                          {m.conducting_name || "—"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600 pt-0.5">
                        <span className="text-slate-400">Asistencia:</span>
                        <span className="font-semibold text-emerald-700">
                          {Number(m.total_attendance) > 0
                            ? `${m.total_attendance} personas (${m.attending_families_count || 0} fam.)`
                            : "Sin registrar"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                    <Link
                      href={`/meetings/${m.id}`}
                      className="font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <span>Editar Agenda</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleDeleteMeeting(m.id, m.title)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Eliminar reunión"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/meetings/${m.id}/print`}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
                        title="Imprimir programa"
                      >
                        <Printer className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/meetings/${m.id}/live`}
                        className="px-2.5 py-1 rounded-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 shadow-2xs transition-colors"
                        title="Abrir modo en vivo para el púlpito"
                      >
                        <Radio className="w-3.5 h-3.5" />
                        <span>En Vivo</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal */}
        <NewMeetingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreated={loadMeetings}
        />
      </main>
    </div>
  );
}
