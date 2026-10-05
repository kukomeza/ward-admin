"use client";

import { useEffect, useState, use } from "react";
import { Meeting, MeetingItem, MeetingVisitorNote, TaskAssignment } from "@/lib/types";
import { parseAnnouncementList, isSacramentItem, parseSacramentAssignments } from "@/lib/translations";
import { 
  ArrowLeft, 
  CheckCircle, 
  Circle, 
  Plus, 
  Trash2, 
  Users, 
  Music, 
  FileText, 
  Radio, 
  Check, 
  Sparkles,
  Loader2
} from "lucide-react";
import Link from "next/link";

export default function MeetingLivePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [items, setItems] = useState<MeetingItem[]>([]);
  const [assignments, setAssignments] = useState<TaskAssignment[]>([]);
  const [visitorNotes, setVisitorNotes] = useState<MeetingVisitorNote[]>([]);
  const [loading, setLoading] = useState(true);

  // New visitor input
  const [visitorName, setVisitorName] = useState("");
  const [visitorTitle, setVisitorTitle] = useState("");
  const [addingVisitor, setAddingVisitor] = useState(false);

  const loadData = async () => {
    try {
      const res = await fetch(`/api/meetings/${id}`);
      const data = await res.json();
      if (data.success) {
        setMeeting(data.data.meeting);
        setItems(data.data.items);
        setAssignments(data.data.assignments);
        setVisitorNotes(data.data.visitorNotes);
      }
    } catch (err) {
      console.error("Error loading live meeting:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Poll every 10 seconds for real-time sync with other leaders
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [id]);

  // Toggle item completed
  const handleToggleItemCompleted = async (itemId: string, currentState: number) => {
    const newState = currentState === 1 ? 0 : 1;
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, is_completed: newState } : it))
    );
    try {
      await fetch(`/api/meetings/${id}/items/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_completed: newState }),
      });
    } catch (err) {
      console.error("Error updating item state:", err);
    }
  };

  // Add visitor note
  const handleAddVisitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim()) return;

    setAddingVisitor(true);
    try {
      const res = await fetch(`/api/meetings/${id}/visitors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitor_name: visitorName.trim(),
          visitor_title: visitorTitle.trim() || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setVisitorName("");
        setVisitorTitle("");
        loadData();
      }
    } catch (err) {
      console.error("Error adding visitor:", err);
    } finally {
      setAddingVisitor(false);
    }
  };

  // Toggle visitor note read
  const handleToggleVisitorRead = async (noteId: string, currentRead: number) => {
    const newRead = currentRead === 1 ? 0 : 1;
    setVisitorNotes((prev) =>
      prev.map((vn) => (vn.id === noteId ? { ...vn, is_read: newRead } : vn))
    );
    try {
      await fetch(`/api/meetings/${id}/visitors/${noteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_read: newRead === 1 }),
      });
    } catch (err) {
      console.error("Error toggling visitor read:", err);
    }
  };

  // Delete visitor note
  const handleDeleteVisitor = async (noteId: string) => {
    setVisitorNotes((prev) => prev.filter((vn) => vn.id !== noteId));
    try {
      await fetch(`/api/meetings/${id}/visitors?noteId=${noteId}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Error deleting visitor note:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
        <span>Cargando modo en vivo...</span>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6">
        <p>Reunión no encontrada.</p>
        <Link href="/" className="text-blue-400 mt-2 inline-block">
          Volver
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar for Conductor */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 sticky top-0 z-30 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/meetings/${id}`}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-2xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                  <Radio className="w-3 h-3 animate-pulse" /> En Vivo
                </span>
                <span className="text-xs text-slate-400">{meeting.meeting_type_name}</span>
              </div>
              <h1 className="text-base font-bold text-white tracking-tight truncate max-w-xs sm:max-w-md">
                {meeting.title}
              </h1>
            </div>
          </div>

          <div className="text-right text-xs text-slate-400">
            <div className="text-white font-medium">{meeting.meeting_date}</div>
            <div>{meeting.start_time} hrs</div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-4xl mx-auto px-4 py-6 w-full flex-1 space-y-6">
        {/* Banner: Preside & Dirige */}
        <div className="grid grid-cols-2 gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="border-r border-slate-800 pr-2">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 block">
              Preside la Reunión
            </span>
            <p className="text-base sm:text-lg font-bold text-white mt-0.5 truncate">
              {meeting.presiding_name || "No asignado"}
            </p>
          </div>
          <div className="pl-2">
            <span className="text-2xs font-bold uppercase tracking-wider text-blue-400 block">
              Dirige la Reunión
            </span>
            <p className="text-base sm:text-lg font-bold text-blue-300 mt-0.5 truncate">
              {meeting.conducting_name || "No asignado"}
            </p>
          </div>
        </div>

        {/* SECTION: Bienvenidas y Visitas Reconocidas en Vivo */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white">
                Bienvenidas y Visitas Reconocidas (Minutos antes / En vivo)
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              {visitorNotes.filter((v) => v.is_read === 1).length}/{visitorNotes.length} leídos
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-4">
            Escribe aquí a las personas o autoridades presentes para darles la bienvenida desde el púlpito.
          </p>

          {/* Input rápido de bienvenida */}
          <form onSubmit={handleAddVisitor} className="flex flex-col sm:flex-row gap-2 mb-4">
            <input
              type="text"
              placeholder="Nombre de la visita (ej. Familia Morales, Élder Pérez)..."
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
              className="flex-1 px-3.5 py-2 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark-input"
            />
            <input
              type="text"
              placeholder="Título / Cargo (ej. Presidente de Estaca, Misioneros)..."
              value={visitorTitle}
              onChange={(e) => setVisitorTitle(e.target.value)}
              className="w-full sm:w-60 px-3.5 py-2 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark-input"
            />
            <button
              type="submit"
              disabled={addingVisitor || !visitorName.trim()}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 flex items-center justify-center gap-1.5 transition-colors shrink-0 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Anotar</span>
            </button>
          </form>

          {/* List of visitors */}
          {visitorNotes.length === 0 ? (
            <div className="py-4 text-center text-xs text-slate-500 italic bg-slate-950/40 rounded-xl border border-slate-800/80">
              No hay visitas anotadas aún. Puedes escribirlas ahora mismo.
            </div>
          ) : (
            <div className="space-y-2">
              {visitorNotes.map((v) => (
                <div
                  key={v.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    v.is_read
                      ? "bg-slate-950/50 border-slate-800/60 text-slate-500 line-through"
                      : "bg-slate-800 border-amber-500/30 text-white"
                  }`}
                >
                  <button
                    onClick={() => handleToggleVisitorRead(v.id, v.is_read)}
                    className="flex items-center gap-3 text-left flex-1"
                  >
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                        v.is_read ? "bg-slate-800 text-slate-600" : "bg-amber-500/20 text-amber-400"
                      }`}
                    >
                      {v.is_read ? <Check className="w-4 h-4" /> : <Users className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <span className="font-semibold text-sm">{v.visitor_name}</span>
                      {v.visitor_title && (
                        <span className="ml-2 text-xs text-amber-300/80 bg-amber-950/50 px-2 py-0.5 rounded-md">
                          {v.visitor_title}
                        </span>
                      )}
                    </div>
                  </button>

                  <button
                    onClick={() => handleDeleteVisitor(v.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-700/50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SECTION: Programa en Vivo (Paso a Paso) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              Guión y Programa de la Reunión
            </h2>
            <span className="text-xs text-slate-400">
              {items.filter((i) => i.is_completed === 1).length} de {items.length} completados
            </span>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => {
              const itemAssignments = assignments.filter((a) => a.meeting_item_id === item.id);
              const isDone = item.is_completed === 1;
              const isSacrament = isSacramentItem(item, itemAssignments);
              const sacramentBreakdown = isSacrament
                ? parseSacramentAssignments(itemAssignments)
                : null;

              return (
                <div
                  key={item.id}
                  onClick={() => handleToggleItemCompleted(item.id, item.is_completed)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 select-none ${
                    isDone
                      ? "bg-slate-900/40 border-slate-800/80 opacity-60"
                      : "bg-slate-900 border-slate-700/80 hover:border-blue-500/50 shadow-md"
                  }`}
                >
                  {/* Checkbox button */}
                  <div className="pt-0.5 shrink-0">
                    {isDone ? (
                      <CheckCircle className="w-6 h-6 text-emerald-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-500 hover:text-blue-400 transition-colors" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">
                        Nº {index + 1}
                      </span>
                      <h3
                        className={`text-base font-bold ${
                          isDone ? "text-slate-400 line-through" : "text-white"
                        }`}
                      >
                        {item.title}
                      </h3>
                    </div>

                    {/* Bienvenida: A cargo de quien dirige y lista de personas/visitas a dar la bienvenida */}
                    {item.item_type === "WELCOME" && (
                      <div className="pt-1 space-y-1.5">
                        <div className="text-xs text-blue-300 font-semibold flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />
                          <span>A cargo de quien dirige {meeting.conducting_name ? `(${meeting.conducting_name})` : ""}</span>
                        </div>
                        {item.notes && item.notes.trim() && (
                          <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/30 text-xs">
                            <span className="font-bold text-amber-400 block mb-1">
                              Personas / Visitas para dar la bienvenida:
                            </span>
                            <p className="text-white text-sm whitespace-pre-line leading-relaxed font-medium">
                              {item.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Asuntos: Lista ordenada de asuntos a mencionar */}
                    {item.item_type === "ANNOUNCEMENT" && (
                      <div className="pt-1 space-y-1.5">
                        {parseAnnouncementList(item.notes).length > 0 ? (
                          <div className="space-y-1.5 pt-0.5">
                            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 block">
                              Lista de asuntos a mencionar:
                            </span>
                            {parseAnnouncementList(item.notes).map((asunto, aIdx) => (
                              <div
                                key={aIdx}
                                className="flex items-start gap-2 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 text-white"
                              >
                                <span className="w-5 h-5 rounded-full bg-blue-900/80 text-blue-300 font-bold text-2xs flex items-center justify-center shrink-0 mt-0.5">
                                  {aIdx + 1}
                                </span>
                                <span className="text-sm font-medium">{asunto}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-xs text-slate-400 italic">
                            (No se anotaron asuntos específicos en la lista)
                          </div>
                        )}
                      </div>
                    )}

                    {/* Himno */}
                    {item.item_type === "HYMN" && (
                      <div className="text-sm text-blue-300 font-medium flex items-center gap-1.5 pt-0.5">
                        <Music className="w-4 h-4 shrink-0" />
                        <span>
                          {item.hymn_number ? `Himno Nº ${item.hymn_number}` : "Himno"}
                          {item.hymn_title ? ` — "${item.hymn_title}"` : ""}
                        </span>
                      </div>
                    )}

                    {/* Tema discurso */}
                    {item.speaker_topic && (
                      <div className="text-xs text-amber-300/90 flex items-center gap-1.5 pt-0.5">
                        <FileText className="w-3.5 h-3.5 shrink-0" />
                        <span>Tema: {item.speaker_topic}</span>
                      </div>
                    )}

                    {/* Santa Cena: Visualización clara de 2 para bendecir (Pan y Agua) y los que reparten */}
                    {isSacrament && (
                      <div className="pt-2 space-y-2.5">
                        {/* Bendición */}
                        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-purple-500/30 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-2xs font-bold uppercase tracking-wider text-purple-400">
                              Bendición de la Santa Cena (2 personas)
                            </span>
                            <span className="text-2xs text-slate-400 font-medium">
                              Pan y Agua
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-purple-900/60 text-purple-300 border border-purple-700/50 shrink-0">
                                Pan:
                              </span>
                              <span className="font-semibold text-white truncate">
                                {sacramentBreakdown?.panAssignment?.person_name || (
                                  <span className="text-slate-500 italic text-xs">Sin asignar</span>
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-purple-900/60 text-purple-300 border border-purple-700/50 shrink-0">
                                Agua:
                              </span>
                              <span className="font-semibold text-white truncate">
                                {sacramentBreakdown?.aguaAssignment?.person_name || (
                                  <span className="text-slate-500 italic text-xs">Sin asignar</span>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Repartición */}
                        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-indigo-500/30 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-2xs font-bold uppercase tracking-wider text-indigo-400">
                              Repartición de la Santa Cena ({sacramentBreakdown?.passAssignments.length || 0})
                            </span>
                            <span className="text-2xs text-slate-400 font-medium">
                              Varios hermanos
                            </span>
                          </div>
                          {sacramentBreakdown && sacramentBreakdown.passAssignments.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {sacramentBreakdown.passAssignments.map((a) => (
                                <span
                                  key={a.id}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-950/60 text-indigo-200 border border-indigo-800/50"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                                  <span>{a.person_name}</span>
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-500 italic text-xs block">
                              Sin hermanos asignados para repartir
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Personas asignadas (para otros bloques) */}
                    {!isSacrament && itemAssignments.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1.5">
                        {itemAssignments.map((a) => (
                          <div
                            key={a.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-blue-950/80 text-blue-200 border border-blue-800/60"
                          >
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: a.task_color || "#38bdf8" }}
                            />
                            <span>{a.person_name}</span>
                            <span className="text-slate-400 text-2xs">({a.task_name})</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
