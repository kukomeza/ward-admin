"use client";

import { useEffect, useState, use } from "react";
import { Meeting, MeetingItem, TaskAssignment } from "@/lib/types";
import { parseAnnouncementList, isSacramentItem, parseSacramentAssignments } from "@/lib/translations";
import { ArrowLeft, Printer, Loader2 } from "lucide-react";
import Link from "next/link";

export default function MeetingPrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [items, setItems] = useState<MeetingItem[]>([]);
  const [assignments, setAssignments] = useState<TaskAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/meetings/${id}`);
        const data = await res.json();
        if (data.success) {
          setMeeting(data.data.meeting);
          setItems(data.data.items);
          setAssignments(data.data.assignments);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span>Cargando versión imprimible...</span>
      </div>
    );
  }

  if (!meeting) {
    return <div className="p-8">Reunión no encontrada.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8 print:p-0 print:bg-white text-slate-900 font-serif">
      {/* Non-printable action header */}
      <div className="max-w-2xl mx-auto mb-6 flex justify-between items-center print:hidden font-sans">
        <Link
          href={`/meetings/${id}`}
          className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm flex items-center gap-1.5 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Editor</span>
        </Link>
        <button
          onClick={() => window.print()}
          className="px-4 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm font-semibold flex items-center gap-1.5 shadow-xs"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir / Guardar PDF</span>
        </button>
      </div>

      {/* Printable Sheet */}
      <div className="max-w-2xl mx-auto bg-white p-8 sm:p-12 border border-slate-200 print:border-none shadow-md print:shadow-none rounded-lg print:rounded-none">
        {/* Header */}
        <div className="text-center border-b-2 border-slate-900 pb-5 mb-6">
          <h2 className="text-xs tracking-widest uppercase font-sans text-slate-600 mb-1">
            {meeting.meeting_type_name}
          </h2>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {meeting.title}
          </h1>
          <p className="text-sm text-slate-700 mt-2 font-sans">
            Fecha: <strong>{meeting.meeting_date}</strong> &nbsp;|&nbsp; Hora:{" "}
            <strong>{meeting.start_time} hrs</strong>
          </p>

          <div className="flex justify-center gap-8 mt-4 pt-3 border-t border-slate-200 text-sm font-sans">
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider block">
                Preside:
              </span>
              <strong className="text-slate-900">
                {meeting.presiding_name || "—"}
              </strong>
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider block">
                Dirige:
              </span>
              <strong className="text-slate-900">
                {meeting.conducting_name || "—"}
              </strong>
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider block">
                Asistencia Total:
              </span>
              <strong className="text-slate-900">
                {Number(meeting.total_attendance) > 0
                  ? `${meeting.total_attendance} personas (${meeting.attending_families_count || 0} fam.)`
                  : "______"}
              </strong>
            </div>
          </div>
        </div>

        {/* Program Items */}
        <div className="space-y-4">
          {items.map((item, idx) => {
            const itemAssignments = assignments.filter(
              (a) => a.meeting_item_id === item.id
            );
            const isSacrament = isSacramentItem(item, itemAssignments);
            const sacramentBreakdown = isSacrament
              ? parseSacramentAssignments(itemAssignments)
              : null;

            return (
              <div
                key={item.id}
                className="flex items-baseline justify-between border-b border-dotted border-slate-300 pb-2 text-sm"
              >
                <div className="pr-4 flex-1">
                  <span className="font-sans font-bold text-xs text-slate-500 mr-2">
                    {idx + 1}.
                  </span>
                  <span className="font-semibold text-slate-900">{item.title}</span>

                  {item.item_type === "WELCOME" && item.notes && (
                    <div className="text-xs text-slate-700 font-sans italic ml-5 mt-1 whitespace-pre-line">
                      Bienvenidas / Visitas: {item.notes}
                    </div>
                  )}

                  {item.item_type === "ANNOUNCEMENT" && (
                    <div className="ml-5 mt-1 space-y-0.5">
                      {parseAnnouncementList(item.notes).map((asunto, aIdx) => (
                        <div key={aIdx} className="text-xs text-slate-800 font-sans">
                          {aIdx + 1}. {asunto}
                        </div>
                      ))}
                    </div>
                  )}

                  {item.item_type === "HYMN" && (
                    <div className="text-xs text-slate-600 font-sans italic ml-5 mt-0.5">
                      {item.hymn_number ? `Nº ${item.hymn_number}` : ""}
                      {item.hymn_title ? ` "${item.hymn_title}"` : ""}
                    </div>
                  )}

                  {item.speaker_topic && (
                    <div className="text-xs text-slate-600 font-sans italic ml-5 mt-0.5">
                      Tema: {item.speaker_topic}
                    </div>
                  )}
                </div>

                <div className="text-right font-sans text-xs text-slate-800 font-medium shrink-0 max-w-xs">
                  {item.item_type === "WELCOME" ? (
                    <div>{meeting.conducting_name || "Quien dirige"}</div>
                  ) : isSacrament ? (
                    <div className="space-y-1">
                      {(sacramentBreakdown?.panAssignment || sacramentBreakdown?.aguaAssignment) && (
                        <div>
                          <span className="font-semibold text-slate-700">Bendecir: </span>
                          {sacramentBreakdown.panAssignment && (
                            <span>{sacramentBreakdown.panAssignment.person_name} (Pan)</span>
                          )}
                          {sacramentBreakdown.panAssignment && sacramentBreakdown.aguaAssignment && (
                            <span>, </span>
                          )}
                          {sacramentBreakdown.aguaAssignment && (
                            <span>{sacramentBreakdown.aguaAssignment.person_name} (Agua)</span>
                          )}
                        </div>
                      )}
                      {sacramentBreakdown && sacramentBreakdown.passAssignments.length > 0 && (
                        <div>
                          <span className="font-semibold text-slate-700">Repartir: </span>
                          <span>
                            {sacramentBreakdown.passAssignments.map((a) => a.person_name).join(", ")}
                          </span>
                        </div>
                      )}
                      {!sacramentBreakdown?.panAssignment &&
                        !sacramentBreakdown?.aguaAssignment &&
                        (!sacramentBreakdown || sacramentBreakdown.passAssignments.length === 0) && (
                          <div className="text-slate-400 italic">Por asignar</div>
                        )}
                    </div>
                  ) : itemAssignments.length > 0 ? (
                    itemAssignments.map((a) => (
                      <div key={a.id}>
                        {a.person_name}
                        <span className="text-slate-500 text-2xs ml-1">
                          ({a.task_name})
                        </span>
                      </div>
                    ))
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-slate-200 text-center text-xs text-slate-400 font-sans">
          Generado con Ward Admin • Organización y Adoración
        </div>
      </div>
    </div>
  );
}
