"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import {
  AttendanceAnalytics,
  FamilyAttendanceStat,
} from "@/lib/services/attendance";
import {
  BarChart3,
  Users,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Search,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  HeartHandshake,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function AttendanceAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AttendanceAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState<
    "ALL" | "ALERT_3" | "ALERT_2" | "REGULAR"
  >("ALL");
  const [expandedFamilyId, setExpandedFamilyId] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/attendance/stats");
        const data = await res.json();
        if (data.success) {
          setAnalytics(data.data);
        }
      } catch (err) {
        console.error("Error loading attendance stats:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const summary = analytics?.summary;
  const trends = analytics?.meetingTrends || [];
  const families = analytics?.familyStats || [];

  const maxTrendValue = Math.max(
    1,
    ...trends.map((t) => t.total_attendees),
    summary?.averageAttendanceQuarter || 1
  );

  // Alertas de ministración: familias con >= 3 ausencias seguidas (o >= 2 si hay pocas reuniones)
  const highPriorityAlerts = families.filter(
    (f) => f.consecutive_absences >= 3
  );
  const preventiveAlerts = families.filter(
    (f) => f.consecutive_absences === 2
  );

  const filteredFamilies = families.filter((f) => {
    const matchesSearch = f.family_name
      .toLowerCase()
      .includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (filterMode === "ALERT_3") return f.consecutive_absences >= 3;
    if (filterMode === "ALERT_2") return f.consecutive_absences >= 2;
    if (filterMode === "REGULAR") return f.consecutive_absences === 0;
    return true;
  });

  const renderAbsenceBadge = (fam: FamilyAttendanceStat) => {
    if ((summary?.totalMeetingsRecorded || 0) === 0) {
      return (
        <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
          Sin reuniones evaluadas
        </span>
      );
    }
    if (fam.consecutive_absences >= 3) {
      return (
        <span className="inline-flex items-center gap-1 text-2xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
          <AlertTriangle className="w-3 h-3 text-rose-600" />
          {fam.consecutive_absences} domingos sin asistir
        </span>
      );
    }
    if (fam.consecutive_absences === 2) {
      return (
        <span className="inline-flex items-center gap-1 text-2xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
          <AlertTriangle className="w-3 h-3 text-amber-600" />2 domingos sin
          asistir
        </span>
      );
    }
    if (fam.consecutive_absences === 1) {
      return (
        <span className="text-2xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
          Ausente último domingo
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-2xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
        Asistió último domingo
      </span>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
        {/* Encabezado */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Informe Trimestral y Ministración
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Estadísticas e Historial de Asistencia
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Tendencia sacramental domingo a domingo, alertas de ministración por inasistencia e historial por familia.
            </p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 self-start sm:self-auto shrink-0"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Ir a Reuniones</span>
          </Link>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-sm">Calculando estadísticas de asistencia...</span>
          </div>
        ) : (
          <>
            {/* Tarjetas de Resumen Ejecutivo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Promedio Trimestral (90 días)
                  </span>
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900">
                  {summary?.averageAttendanceQuarter || 0}
                  <span className="text-sm font-medium text-slate-500 ml-1.5">
                    personas / dom.
                  </span>
                </div>
                <p className="text-2xs text-slate-500 mt-1">
                  Promedio histórico general:{" "}
                  <strong>{summary?.averageAttendanceAllTime || 0}</strong>{" "}
                  personas ({summary?.totalMeetingsRecorded || 0} reuniones)
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Última Reunión Registrada
                  </span>
                  <Users className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900">
                  {summary?.latestAttendance || 0}
                  <span className="text-sm font-medium text-slate-500 ml-1.5">
                    asistentes
                  </span>
                </div>
                <p className="text-2xs text-slate-500 mt-1">
                  Fecha:{" "}
                  <strong>
                    {summary?.latestAttendanceDate || "Sin registros aún"}
                  </strong>
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                    Asistencia Máxima
                  </span>
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900">
                  {summary?.maxAttendance || 0}
                  <span className="text-sm font-medium text-slate-500 ml-1.5">
                    personas
                  </span>
                </div>
                <p className="text-2xs text-slate-500 mt-1">
                  Alcanzada el:{" "}
                  <strong>{summary?.maxAttendanceDate || "—"}</strong>
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-rose-200/80 shadow-2xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                    Alertas de Ministración
                  </span>
                  <HeartHandshake className="w-4 h-4 text-rose-600" />
                </div>
                <div className="text-3xl font-extrabold text-rose-700">
                  {highPriorityAlerts.length + preventiveAlerts.length}
                  <span className="text-sm font-medium text-slate-500 ml-1.5">
                    familias
                  </span>
                </div>
                <p className="text-2xs text-slate-500 mt-1">
                  <strong>{highPriorityAlerts.length}</strong> con 3+ ausencias
                  • <strong>{preventiveAlerts.length}</strong> con 2 ausencias
                </p>
              </div>
            </div>

            {/* Gráfica de Tendencia Domingo a Domingo */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <span>Tendencia de Asistencia Domingo a Domingo</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Evolución de personas y familias presentes en cada reunión con asistencia registrada.
                  </p>
                </div>
                {summary && summary.averageAttendanceQuarter > 0 && (
                  <div className="text-xs bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1.5 rounded-xl font-semibold">
                    Promedio Trimestral:{" "}
                    <strong>{summary.averageAttendanceQuarter} personas</strong>
                  </div>
                )}
              </div>

              {trends.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
                  Aún no hay reuniones con asistencia registrada. Entra a cualquier reunión y anota los asistentes en la sección de <strong>Control de Asistencia por Familias</strong> para ver la gráfica de tendencia.
                </div>
              ) : (
                <div className="pt-4 overflow-x-auto">
                  <div className="min-w-[500px] flex items-end gap-3 h-56 pt-6 pb-2 px-2 border-b border-slate-200">
                    {trends.map((item) => {
                      const heightPercent = Math.max(
                        10,
                        Math.round((item.total_attendees / maxTrendValue) * 100)
                      );
                      return (
                        <Link
                          key={item.meeting_id}
                          href={`/meetings/${item.meeting_id}`}
                          className="flex-1 min-w-[68px] max-w-[110px] flex flex-col items-center group"
                          title={`${item.title} (${item.meeting_date}): ${item.total_attendees} personas (${item.present_families_count} familias)`}
                        >
                          <span className="text-xs font-extrabold text-slate-800 group-hover:text-blue-600 mb-1">
                            {item.total_attendees}
                          </span>
                          <span className="text-2xs text-slate-400 mb-1.5">
                            {item.present_families_count} fam.
                          </span>
                          <div className="w-full h-36 flex items-end justify-center bg-slate-100/70 rounded-t-xl overflow-hidden px-1.5">
                            <div
                              style={{ height: `${heightPercent}%` }}
                              className="w-full bg-linear-to-t from-blue-600 to-indigo-500 group-hover:from-blue-700 group-hover:to-indigo-600 rounded-t-lg transition-all shadow-xs"
                            />
                          </div>
                          <span className="text-2xs font-bold text-slate-700 mt-2 truncate max-w-full">
                            {item.meeting_date}
                          </span>
                          <span className="text-2xs text-slate-400 truncate max-w-full">
                            {item.title}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>

            {/* Panel de Alertas de Ministración (Familias con 2 o 3+ domingos seguidos sin asistir) */}
            {(highPriorityAlerts.length > 0 || preventiveAlerts.length > 0) && (
              <section className="bg-rose-50/60 border border-rose-200 rounded-2xl p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-base font-bold text-rose-950 flex items-center gap-2">
                      <HeartHandshake className="w-5 h-5 text-rose-600" />
                      <span>
                        Alertas de Ministración y Seguimiento Pastoral
                      </span>
                    </h2>
                    <p className="text-xs text-rose-800/80 mt-0.5">
                      Familias registradas en el padrón que acumulan 2 o más reuniones consecutivas sin asistir. Ideal para coordinar visitas con el Quórum de Élderes y la Sociedad de Socorro.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[...highPriorityAlerts, ...preventiveAlerts].map((fam) => {
                    const isHigh = fam.consecutive_absences >= 3;
                    return (
                      <div
                        key={fam.family_id}
                        className={`p-4 rounded-xl bg-white border shadow-2xs flex flex-col justify-between gap-3 ${
                          isHigh ? "border-rose-300" : "border-amber-300"
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-bold text-slate-900 text-sm">
                              {fam.family_name}
                            </h3>
                            {renderAbsenceBadge(fam)}
                          </div>
                          <p className="text-xs text-slate-500">
                            Última asistencia:{" "}
                            <strong className="text-slate-700">
                              {fam.last_attended_date
                                ? `${fam.last_attended_date} (${fam.last_attended_count} pers.)`
                                : "Sin asistencia registrada"}
                            </strong>
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-2xs">
                          <span className="text-slate-500">
                            Asistencia general:{" "}
                            <strong>
                              {fam.meetings_attended}/
                              {fam.total_meetings_evaluated} ({fam.attendance_rate}
                              %)
                            </strong>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setExpandedFamilyId(fam.family_id);
                              const el = document.getElementById(
                                `fam-row-${fam.family_id}`
                              );
                              el?.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer"
                          >
                            <span>Ver historial</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Directorio e Historial Detallado por Familia */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="p-6 border-b border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span>
                        Historial por Familia ({filteredFamilies.length})
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500">
                      Haz clic en cualquier familia o persona para desplegar las fechas exactas en que asistió y cuántos integrantes estuvieron presentes.
                    </p>
                  </div>

                  {/* Buscador */}
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Buscar familia o persona..."
                      className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
                    />
                  </div>
                </div>

                {/* Filtros rápidos */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { id: "ALL", label: `Todas (${families.length})` },
                    {
                      id: "ALERT_3",
                      label: `3+ Domingos sin asistir (${highPriorityAlerts.length})`,
                    },
                    {
                      id: "ALERT_2",
                      label: `2+ Domingos sin asistir (${
                        highPriorityAlerts.length + preventiveAlerts.length
                      })`,
                    },
                    {
                      id: "REGULAR",
                      label: `Asistieron el último domingo (${
                        families.filter((f) => f.consecutive_absences === 0)
                          .length
                      })`,
                    },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() =>
                        setFilterMode(
                          tab.id as "ALL" | "ALERT_3" | "ALERT_2" | "REGULAR"
                        )
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        filterMode === tab.id
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {filteredFamilies.length === 0 ? (
                <div className="p-12 text-center text-sm text-slate-400">
                  No se encontraron familias con los filtros seleccionados.
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {filteredFamilies.map((fam) => {
                    const isExpanded = expandedFamilyId === fam.family_id;
                    return (
                      <div
                        key={fam.family_id}
                        id={`fam-row-${fam.family_id}`}
                        className="transition-colors hover:bg-slate-50/70"
                      >
                        <div
                          onClick={() =>
                            setExpandedFamilyId(
                              isExpanded ? null : fam.family_id
                            )
                          }
                          className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className="font-bold text-sm text-slate-900">
                                {fam.family_name}
                              </span>
                              {renderAbsenceBadge(fam)}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                              <span>
                                Integrantes habituales:{" "}
                                <strong>{fam.default_count}</strong>
                              </span>
                              <span>
                                Promedio cuando asiste:{" "}
                                <strong>
                                  {fam.average_count_when_present} pers.
                                </strong>
                              </span>
                              <span>
                                Última vez:{" "}
                                <strong>
                                  {fam.last_attended_date || "Nunca"}
                                </strong>
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 self-end sm:self-center">
                            <div className="text-right">
                              <div className="text-sm font-extrabold text-slate-900">
                                {fam.attendance_rate}%
                              </div>
                              <div className="text-2xs text-slate-500">
                                {fam.meetings_attended} de{" "}
                                {fam.total_meetings_evaluated} dom.
                              </div>
                            </div>
                            <button
                              type="button"
                              className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
                              aria-label="Ver detalle"
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Historial desplegable domingo a domingo */}
                        {isExpanded && (
                          <div className="px-4 sm:px-6 pb-5 pt-2 bg-slate-50 border-t border-slate-100 space-y-2.5">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                              Registro domingo a domingo ({fam.family_name})
                            </h4>
                            {fam.history.length === 0 ? (
                              <p className="text-xs text-slate-400 italic">
                                No hay reuniones evaluadas todavía.
                              </p>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                {fam.history.map((h) => {
                                  const attended = h.attendees_count > 0;
                                  return (
                                    <Link
                                      key={h.meeting_id}
                                      href={`/meetings/${h.meeting_id}`}
                                      className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-colors ${
                                        attended
                                          ? "bg-emerald-50/70 border-emerald-200 text-emerald-950 hover:bg-emerald-100/70"
                                          : "bg-white border-slate-200 text-slate-500 hover:bg-slate-100"
                                      }`}
                                    >
                                      <div className="min-w-0 pr-2">
                                        <div className="font-bold flex items-center gap-1">
                                          {attended ? (
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                          ) : (
                                            <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                          )}
                                          <span>{h.meeting_date}</span>
                                        </div>
                                        <div className="text-2xs truncate opacity-75 mt-0.5">
                                          {h.meeting_title}
                                        </div>
                                      </div>
                                      <span
                                        className={`px-2 py-0.5 rounded-md font-extrabold text-xs shrink-0 ${
                                          attended
                                            ? "bg-emerald-600 text-white"
                                            : "bg-slate-100 text-slate-400"
                                        }`}
                                      >
                                        {attended
                                          ? `${h.attendees_count} pers.`
                                          : "Ausente"}
                                      </span>
                                    </Link>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

