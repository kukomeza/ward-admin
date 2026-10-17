"use client";

import { useEffect, useState, useTransition, use } from "react";
import Navbar from "@/components/Navbar";
import AssignPersonModal from "@/components/AssignPersonModal";
import { Meeting, MeetingItem, TaskAssignment, TaskType } from "@/lib/types";
import { formatMeetingStatus, formatItemType, isSacramentItem, parseSacramentAssignments } from "@/lib/translations";
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Music, 
  Mic, 
  Heart, 
  Users, 
  Sparkles, 
  Printer, 
  Radio, 
  AlertTriangle,
  Loader2,
  CheckCircle,
  FileText,
  ListOrdered,
  UserCheck
} from "lucide-react";
import AnnouncementListManager from "@/components/AnnouncementListManager";
import MeetingAttendanceManager from "@/components/MeetingAttendanceManager";
import HymnSelector from "@/components/HymnSelector";
import WhatsAppNotifyModal, { WhatsAppIcon } from "@/components/WhatsAppNotifyModal";
import { buildWhatsAppMessage } from "@/lib/whatsapp";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MeetingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [items, setItems] = useState<MeetingItem[]>([]);
  const [assignments, setAssignments] = useState<TaskAssignment[]>([]);
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Attendance summary state
  const [totalAttendance, setTotalAttendance] = useState(0);
  const [attendingFamiliesCount, setAttendingFamiliesCount] = useState(0);
  const [activeViewTab, setActiveViewTab] = useState<"ALL" | "AGENDA" | "ATTENDANCE">("ALL");

  // Modal assign state
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [activeTaskType, setActiveTaskType] = useState<TaskType | null>(null);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [assignNotes, setAssignNotes] = useState<string | null>(null);
  const [assignModalTitle, setAssignModalTitle] = useState<string | undefined>(undefined);

  // WhatsApp Notification Modal state
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
  const [whatsAppRecipientName, setWhatsAppRecipientName] = useState("");
  const [whatsAppPhone, setWhatsAppPhone] = useState<string | null>(null);
  const [whatsAppMessage, setWhatsAppMessage] = useState("");
  const [whatsAppTitle, setWhatsAppTitle] = useState("");

  // New Block Modal state
  const [showAddBlockModal, setShowAddBlockModal] = useState(false);
  const [newBlockType, setNewBlockType] = useState<MeetingItem["item_type"]>("TALK");
  const [newBlockTitle, setNewBlockTitle] = useState("");

  const loadMeeting = async () => {
    try {
      const [meetingRes, tasksRes] = await Promise.all([
        fetch(`/api/meetings/${id}`),
        fetch("/api/tasks"),
      ]);

      const meetingData = await meetingRes.json();
      const tasksData = await tasksRes.json();

      if (meetingData.success) {
        setMeeting(meetingData.data.meeting);
        setItems(meetingData.data.items);
        setAssignments(meetingData.data.assignments);
        setTotalAttendance(Number(meetingData.data.meeting.total_attendance) || 0);
        setAttendingFamiliesCount(
          Number(meetingData.data.meeting.attending_families_count) || 0
        );
      }
      if (tasksData.success) {
        setTaskTypes(tasksData.data);
      }
    } catch (err) {
      console.error("Error loading meeting:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeeting();
  }, [id]);

  // Open modal to assign a person to an item
  const openAssignModal = (
    taskCodeOrId: string,
    itemId: string | null = null,
    notes: string | null = null,
    customTitle?: string
  ) => {
    const foundTask =
      taskTypes.find((t) => t.id === taskCodeOrId || t.code === taskCodeOrId) ||
      taskTypes.find((t) => t.code === "TALK") ||
      taskTypes[0];

    if (foundTask) {
      setActiveTaskType(foundTask);
      setActiveItemId(itemId);
      setAssignNotes(notes);
      setAssignModalTitle(customTitle);
      setAssignModalOpen(true);
    }
  };

  // Remove assignment
  const handleRemoveAssignment = async (assignmentId: string) => {
    if (!confirm("¿Deseas remover esta asignación?")) return;
    try {
      await fetch(`/api/meetings/${id}/assignments?assignmentId=${assignmentId}`, {
        method: "DELETE",
      });
      loadMeeting();
    } catch (err) {
      console.error("Error removing assignment:", err);
    }
  };

  // Move item up or down
  const moveItem = async (index: number, direction: "up" | "down") => {
    const newItems = [...items];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    setItems(newItems);

    startTransition(async () => {
      await fetch(`/api/meetings/${id}/items`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: newItems.map((item) => item.id) }),
      });
      loadMeeting();
    });
  };

  // Delete item
  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("¿Deseas eliminar este bloque del programa?")) return;
    startTransition(async () => {
      await fetch(`/api/meetings/${id}/items/${itemId}`, { method: "DELETE" });
      loadMeeting();
    });
  };

  // Local field change for instant responsive typing (speaker_topic, hymns, etc.)
  const handleItemFieldChangeLocal = (
    itemId: string,
    field: "hymn_number" | "hymn_title" | "speaker_topic" | "notes",
    value: string
  ) => {
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, [field]: value } : it))
    );
  };

  // Update item field (e.g. hymn number, title, speaker topic)
  const handleUpdateItemField = async (
    itemId: string,
    field: "hymn_number" | "hymn_title" | "speaker_topic" | "notes",
    value: string
  ) => {
    handleItemFieldChangeLocal(itemId, field, value);
    try {
      await fetch(`/api/meetings/${id}/items/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
    } catch (err) {
      console.error("Error updating item field:", err);
    }
  };

  // Update both hymn_number and hymn_title together (from HymnSelector catalog or inputs)
  const handleUpdateHymn = async (
    itemId: string,
    hymnNumber: string,
    hymnTitle: string
  ) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === itemId
          ? { ...it, hymn_number: hymnNumber, hymn_title: hymnTitle }
          : it
      )
    );
    try {
      await fetch(`/api/meetings/${id}/items/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hymn_number: hymnNumber,
          hymn_title: hymnTitle,
        }),
      });
    } catch (err) {
      console.error("Error updating hymn:", err);
    }
  };

  // WhatsApp notification launcher for assignments (Speakers, Prayers, Music, Sacrament, etc.)
  const handleOpenWhatsAppForAssignment = (
    assignment: TaskAssignment,
    item?: MeetingItem | null,
    customNotes?: string | null
  ) => {
    if (!meeting) return;

    const message = buildWhatsAppMessage({
      recipientName: assignment.person_name || "Hermano(a)",
      meetingDate: meeting.meeting_date,
      startTime: meeting.start_time,
      meetingTypeName: meeting.meeting_type_name,
      taskCode: assignment.task_code,
      taskName: assignment.task_name,
      topic: item?.speaker_topic || null,
      hymnNumber: item?.hymn_number || null,
      hymnTitle: item?.hymn_title || null,
      notes: customNotes || assignment.notes || null,
    });

    setWhatsAppRecipientName(assignment.person_name || "Hermano(a)");
    setWhatsAppPhone(assignment.person_phone || null);
    setWhatsAppMessage(message);
    setWhatsAppTitle(
      assignment.task_code === "TALK"
        ? "Invitación para Discursar"
        : `Asignación: ${assignment.task_name || "Reunión"}`
    );
    setWhatsAppModalOpen(true);
  };

  // WhatsApp notification launcher for presiding / conducting
  const handleOpenWhatsAppForLeadership = (role: "PRESIDE" | "CONDUCT") => {
    if (!meeting) return;
    const isPreside = role === "PRESIDE";
    const name = isPreside ? meeting.presiding_name : meeting.conducting_name;
    const phone = isPreside ? meeting.presiding_phone : meeting.conducting_phone;
    if (!name) return;

    const message = buildWhatsAppMessage({
      recipientName: name,
      meetingDate: meeting.meeting_date,
      startTime: meeting.start_time,
      meetingTypeName: meeting.meeting_type_name,
      taskCode: role,
      taskName: isPreside ? "Presidir" : "Dirigir",
    });

    setWhatsAppRecipientName(name);
    setWhatsAppPhone(phone || null);
    setWhatsAppMessage(message);
    setWhatsAppTitle(
      isPreside ? "Recordatorio: Presidir Reunión" : "Recordatorio: Dirigir Reunión"
    );
    setWhatsAppModalOpen(true);
  };

  // Update meeting status
  const handleStatusChange = async (newStatus: string) => {
    try {
      await fetch(`/api/meetings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      loadMeeting();
    } catch (err) {
      console.error("Error updating meeting status:", err);
    }
  };

  const handleDeleteMeeting = async () => {
    if (!meeting) return;
    if (
      !confirm(
        `¿Estás seguro de eliminar la reunión "${meeting.title}"?\n\nSe borrarán su agenda, asignaciones y el registro de asistencia de esta reunión.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/meetings/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        router.push("/");
      } else {
        alert(data.error || "No se pudo eliminar la reunión");
      }
    } catch (err) {
      console.error("Error deleting meeting:", err);
    }
  };

  // Add block
  const handleAddBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockTitle.trim()) return;

    startTransition(async () => {
      await fetch(`/api/meetings/${id}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item_type: newBlockType,
          title: newBlockTitle.trim(),
        }),
      });
      setShowAddBlockModal(false);
      setNewBlockTitle("");
      loadMeeting();
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-slate-400 gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span>Cargando reunión...</span>
        </div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="max-w-4xl mx-auto py-16 px-4 text-center">
          <p className="text-slate-600">Reunión no encontrada.</p>
          <Link href="/" className="mt-4 inline-block text-blue-600 font-medium">
            Volver a la lista
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Top Breadcrumb & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {meeting.meeting_type_name}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-slate-500">Estado:</span>
                  <select
                    value={meeting.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="text-xs font-semibold px-2 py-0.5 rounded-md border border-slate-200 bg-white text-slate-900 cursor-pointer hover:border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-blue-500 shadow-2xs"
                  >
                    <option value="DRAFT">Borrador</option>
                    <option value="SCHEDULED">Programada</option>
                    <option value="IN_PROGRESS">En curso</option>
                    <option value="COMPLETED">Finalizada</option>
                  </select>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
                {meeting.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleDeleteMeeting}
              className="px-3 py-2 rounded-lg text-sm font-medium text-red-600 bg-white border border-red-200 hover:bg-red-50 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              title="Eliminar esta reunión"
            >
              <Trash2 className="w-4 h-4" />
              <span>Eliminar</span>
            </button>
            <Link
              href={`/meetings/${id}/print`}
              className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Imprimir</span>
            </Link>
            <Link
              href={`/meetings/${id}/live`}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Radio className="w-4 h-4" />
              <span>Modo En Vivo (Púlpito)</span>
            </Link>
          </div>
        </div>

        {/* Meeting Header Info Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {/* Fecha y Hora */}
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Fecha y Hora
                </span>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">
                  {meeting.meeting_date}
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 inline" /> {meeting.start_time} hrs
                </p>
              </div>
            </div>

            {/* Preside */}
            <div className="pt-3 md:pt-0 md:pl-4 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Preside
                  </span>
                  <div className="flex items-center gap-2">
                    {meeting.presiding_name && (
                      <button
                        type="button"
                        onClick={() => handleOpenWhatsAppForLeadership("PRESIDE")}
                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-1.5 py-0.5 rounded-md transition-colors flex items-center gap-1 text-2xs font-semibold"
                        title="Notificar por WhatsApp"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </button>
                    )}
                    <button
                      onClick={() => openAssignModal("PRESIDE", null)}
                      className="text-xs text-blue-600 hover:underline font-medium"
                    >
                      Cambiar
                    </button>
                  </div>
                </div>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">
                  {meeting.presiding_name || (
                    <span className="text-slate-400 italic">No asignado</span>
                  )}
                </p>
              </div>
            </div>

            {/* Dirige */}
            <div className="pt-3 md:pt-0 md:pl-4 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                <Mic className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Dirige
                  </span>
                  <div className="flex items-center gap-2">
                    {meeting.conducting_name && (
                      <button
                        type="button"
                        onClick={() => handleOpenWhatsAppForLeadership("CONDUCT")}
                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-1.5 py-0.5 rounded-md transition-colors flex items-center gap-1 text-2xs font-semibold"
                        title="Notificar por WhatsApp"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </button>
                    )}
                    <button
                      onClick={() => openAssignModal("CONDUCT", null)}
                      className="text-xs text-blue-600 hover:underline font-medium"
                    >
                      Cambiar
                    </button>
                  </div>
                </div>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">
                  {meeting.conducting_name || (
                    <span className="text-slate-400 italic">No asignado</span>
                  )}
                </p>
              </div>
            </div>

            {/* Resumen y Asistencia */}
            <div className="pt-3 md:pt-0 md:pl-4 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Asistencia y Programa
                </span>
                <p className="text-sm font-bold text-emerald-700 mt-0.5">
                  {totalAttendance} asistentes ({attendingFamiliesCount} fam.)
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {assignments.length} asignaciones • {items.length} bloques
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Selector de Vista: Programa / Lista de Asistencia */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white p-2 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveViewTab("ALL")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeViewTab === "ALL"
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Ver Todo (Programa + Asistencia)
            </button>
            <button
              type="button"
              onClick={() => setActiveViewTab("AGENDA")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeViewTab === "AGENDA"
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Programa ({items.length} bloques)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveViewTab("ATTENDANCE")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeViewTab === "ATTENDANCE"
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>
                Lista de Asistencia ({totalAttendance}{" "}
                {totalAttendance === 1 ? "persona" : "personas"})
              </span>
            </button>
          </div>
        </div>

        {/* Agenda Section */}
        {(activeViewTab === "ALL" || activeViewTab === "AGENDA") && (
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Programa de la Reunión (Agenda)
              </h2>
              <p className="text-xs text-slate-500">
                Organiza las actividades y asigna a las personas con verificación de 3 meses
              </p>
            </div>
            <button
              onClick={() => setShowAddBlockModal(true)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Agregar Bloque</span>
            </button>
          </div>

          {/* Agenda Items List */}
          <div className="space-y-3">
            {items.map((item, index) => {
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
                  className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
                >
                  {/* Left: Reorder controls & Title */}
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex flex-col gap-0.5 items-center pt-0.5 shrink-0 text-slate-400">
                      <button
                        onClick={() => moveItem(index, "up")}
                        disabled={index === 0}
                        className="p-1 rounded-sm hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-2xs font-bold text-slate-400">
                        {index + 1}
                      </span>
                      <button
                        onClick={() => moveItem(index, "down")}
                        disabled={index === items.length - 1}
                        className="p-1 rounded-sm hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 uppercase tracking-wider">
                          {formatItemType(item.item_type)}
                        </span>
                        <h3 className="font-semibold text-slate-900 text-sm">
                          {item.title}
                        </h3>
                      </div>

                      {/* Item-specific inputs */}
                      {item.item_type === "HYMN" && (
                        <HymnSelector
                          itemId={item.id}
                          blockTitle={item.title}
                          hymnNumber={item.hymn_number}
                          hymnTitle={item.hymn_title}
                          onUpdateHymn={handleUpdateHymn}
                        />
                      )}

                      {item.item_type === "TALK" && (
                        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                            <FileText className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <input
                              type="text"
                              placeholder="Tema del discurso (ej. El poder del Libro de Mormón)"
                              value={item.speaker_topic || ""}
                              onChange={(e) =>
                                handleItemFieldChangeLocal(item.id, "speaker_topic", e.target.value)
                              }
                              onBlur={(e) =>
                                handleUpdateItemField(item.id, "speaker_topic", e.target.value)
                              }
                              className="w-full max-w-md px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-blue-500 text-slate-900 font-medium placeholder:text-slate-400"
                            />
                          </div>
                          {itemAssignments.length > 0 && (
                            <button
                              type="button"
                              onClick={() => handleOpenWhatsAppForAssignment(itemAssignments[0], item)}
                              className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-600 hover:text-white transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                              title="Enviar invitación con tema y fecha por WhatsApp"
                            >
                              <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                              <span>Notificar por WhatsApp</span>
                            </button>
                          )}
                        </div>
                      )}

                      {/* Bienvenida: Anotar personas / visitas (pueden no estar en la base de datos) */}
                      {item.item_type === "WELCOME" && (
                        <div className="pt-2 text-xs space-y-1.5">
                          <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-blue-600" />
                            <span>Personas o visitas a dar la bienvenida (no requieren estar registradas):</span>
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Escribe nombres a dar la bienvenida (ej. Familia Ramos, Élder Pérez y Élder Clark, Presidente de Estaca, Hermana Soto)..."
                            defaultValue={item.notes || ""}
                            onBlur={(e) =>
                              handleUpdateItemField(item.id, "notes", e.target.value)
                            }
                            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-1 focus:ring-blue-500 placeholder-slate-400 text-slate-900 font-medium"
                          />
                        </div>
                      )}

                      {/* Asuntos: Lista ordenada de asuntos a mencionar */}
                      {item.item_type === "ANNOUNCEMENT" && (
                        <div className="pt-2 text-xs space-y-1.5">
                          <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                            <ListOrdered className="w-3.5 h-3.5 text-blue-600" />
                            <span>Asuntos a mencionar (ordenados en lista):</span>
                          </label>
                          <AnnouncementListManager
                            initialNotes={item.notes}
                            onSave={(serialized) =>
                              handleUpdateItemField(item.id, "notes", serialized)
                            }
                          />
                        </div>
                      )}

                      {/* Ordenanza de Santa Cena: 2 para bendecir (Pan y Agua) y múltiples para repartir */}
                      {isSacrament && (
                        <div className="pt-3 mt-1 border-t border-slate-200/80 space-y-3">
                          {/* 1. Bendecir la Santa Cena */}
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center justify-between gap-1">
                              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-purple-600 shrink-0" />
                                <span>Bendecir la Santa Cena (2 personas)</span>
                              </label>
                              <span className="text-2xs text-purple-700 font-medium bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200/60">
                                1 para el pan • 1 para el agua
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {/* Slot: Pan */}
                              <div className="p-3 rounded-xl border border-purple-200/90 bg-purple-50/50 flex items-center justify-between gap-3 shadow-2xs">
                                <div className="min-w-0">
                                  <span className="text-2xs font-bold uppercase tracking-wider text-purple-800 flex items-center gap-1">
                                    <span>Bendición del Pan</span>
                                    <span className="text-purple-400 font-normal">• 1 persona</span>
                                  </span>
                                  {sacramentBreakdown?.panAssignment ? (
                                    <div className="flex items-center gap-1.5 mt-1">
                                      <span className="text-sm font-semibold text-slate-900 truncate">
                                        {sacramentBreakdown.panAssignment.person_name}
                                      </span>
                                      {sacramentBreakdown.panAssignment.override_3month_alert === 1 && (
                                        <span
                                          title="Asignado con excepción (participó en los últimos 3 meses)"
                                          className="text-amber-600 shrink-0"
                                        >
                                          <AlertTriangle className="w-3.5 h-3.5 inline" />
                                        </span>
                                      )}
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleOpenWhatsAppForAssignment(
                                            sacramentBreakdown.panAssignment!,
                                            item,
                                            "Pan"
                                          )
                                        }
                                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100/70 p-1 rounded-md transition-colors"
                                        title="Notificar por WhatsApp (Bendecir Pan)"
                                      >
                                        <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="text-xs text-slate-400 italic mt-0.5">
                                      Sin asignar (requiere 1 hermano)
                                    </div>
                                  )}
                                </div>

                                <div className="shrink-0">
                                  {sacramentBreakdown?.panAssignment ? (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleRemoveAssignment(sacramentBreakdown.panAssignment!.id)
                                      }
                                      className="px-2.5 py-1 text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-100/70 rounded-lg transition-colors font-medium border border-rose-200"
                                      title="Quitar asignación del pan"
                                    >
                                      ✕ Quitar
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        openAssignModal(
                                          "BLESS_SACRAMENT",
                                          item.id,
                                          "Pan",
                                          "Bendecir el Pan (Santa Cena)"
                                        )
                                      }
                                      className="px-3 py-1.5 text-xs font-semibold text-purple-700 bg-white border border-purple-300 rounded-lg hover:bg-purple-600 hover:text-white transition-colors shadow-2xs flex items-center gap-1"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                      <span>Asignar Pan</span>
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Slot: Agua */}
                              <div className="p-3 rounded-xl border border-purple-200/90 bg-purple-50/50 flex items-center justify-between gap-3 shadow-2xs">
                                <div className="min-w-0">
                                  <span className="text-2xs font-bold uppercase tracking-wider text-purple-800 flex items-center gap-1">
                                    <span>Bendición del Agua</span>
                                    <span className="text-purple-400 font-normal">• 1 persona</span>
                                  </span>
                                  {sacramentBreakdown?.aguaAssignment ? (
                                    <div className="flex items-center gap-1.5 mt-1">
                                      <span className="text-sm font-semibold text-slate-900 truncate">
                                        {sacramentBreakdown.aguaAssignment.person_name}
                                      </span>
                                      {sacramentBreakdown.aguaAssignment.override_3month_alert === 1 && (
                                        <span
                                          title="Asignado con excepción (participó en los últimos 3 meses)"
                                          className="text-amber-600 shrink-0"
                                        >
                                          <AlertTriangle className="w-3.5 h-3.5 inline" />
                                        </span>
                                      )}
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleOpenWhatsAppForAssignment(
                                            sacramentBreakdown.aguaAssignment!,
                                            item,
                                            "Agua"
                                          )
                                        }
                                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100/70 p-1 rounded-md transition-colors"
                                        title="Notificar por WhatsApp (Bendecir Agua)"
                                      >
                                        <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="text-xs text-slate-400 italic mt-0.5">
                                      Sin asignar (requiere 1 hermano)
                                    </div>
                                  )}
                                </div>

                                <div className="shrink-0">
                                  {sacramentBreakdown?.aguaAssignment ? (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleRemoveAssignment(sacramentBreakdown.aguaAssignment!.id)
                                      }
                                      className="px-2.5 py-1 text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-100/70 rounded-lg transition-colors font-medium border border-rose-200"
                                      title="Quitar asignación del agua"
                                    >
                                      ✕ Quitar
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        openAssignModal(
                                          "BLESS_SACRAMENT",
                                          item.id,
                                          "Agua",
                                          "Bendecir el Agua (Santa Cena)"
                                        )
                                      }
                                      className="px-3 py-1.5 text-xs font-semibold text-purple-700 bg-white border border-purple-300 rounded-lg hover:bg-purple-600 hover:text-white transition-colors shadow-2xs flex items-center gap-1"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                      <span>Asignar Agua</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 2. Repartir la Santa Cena */}
                          <div className="p-3 rounded-xl border border-indigo-200/90 bg-indigo-50/40 space-y-2">
                            <div className="flex flex-wrap items-center justify-between gap-1">
                              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0" />
                                <span>
                                  Repartir la Santa Cena ({sacramentBreakdown?.passAssignments.length || 0})
                                </span>
                              </label>
                              <button
                                type="button"
                                onClick={() =>
                                  openAssignModal(
                                    "PASS_SACRAMENT",
                                    item.id,
                                    "Repartir",
                                    "Repartir la Santa Cena"
                                  )
                                }
                                className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-white border border-indigo-300 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors shadow-2xs flex items-center gap-1"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Agregar quien reparte</span>
                              </button>
                            </div>

                            {!sacramentBreakdown || sacramentBreakdown.passAssignments.length === 0 ? (
                              <p className="text-xs text-slate-400 italic">
                                No hay personas asignadas para repartir la Santa Cena todavía. Haz clic en &quot;Agregar quien reparte&quot; para asignar diáconos, maestros o presbíteros.
                              </p>
                            ) : (
                              <div className="flex flex-wrap gap-2 pt-1">
                                {sacramentBreakdown.passAssignments.map((a) => (
                                  <div
                                    key={a.id}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-indigo-200 text-xs shadow-2xs group"
                                  >
                                    <span className="w-2 h-2 rounded-full shrink-0 bg-indigo-600" />
                                    <span className="font-semibold text-slate-900">
                                      {a.person_name}
                                    </span>
                                    {a.override_3month_alert === 1 && (
                                      <span
                                        title="Asignado con excepción (participó en los últimos 3 meses)"
                                        className="text-amber-600 ml-0.5"
                                      >
                                        <AlertTriangle className="w-3.5 h-3.5 inline" />
                                      </span>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => handleOpenWhatsAppForAssignment(a, item, "Repartir")}
                                      className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 p-1 rounded-md transition-colors ml-0.5"
                                      title={`Notificar a ${a.person_name} por WhatsApp`}
                                    >
                                      <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveAssignment(a.id)}
                                      className="text-slate-400 hover:text-rose-600 ml-1 p-0.5 opacity-60 group-hover:opacity-100 transition-opacity"
                                      title="Quitar"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Asignaciones no categorizadas si las hubiera */}
                          {sacramentBreakdown && sacramentBreakdown.otherAssignments.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                              {sacramentBreakdown.otherAssignments.map((a) => (
                                <div
                                  key={a.id}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                                >
                                  <span className="font-medium text-slate-800">{a.person_name}</span>
                                  <span className="text-slate-400 text-2xs">({a.task_name})</span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveAssignment(a.id)}
                                    className="text-slate-400 hover:text-rose-600 ml-1 p-0.5"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Assigned Persons & Action Buttons */}
                  <div className="flex flex-wrap md:flex-nowrap items-center gap-2 self-end md:self-center">
                    {/* Para Bienvenida: No se asigna persona, lo realiza quien dirige */}
                    {item.item_type === "WELCOME" ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-800 font-semibold shadow-2xs">
                        <Mic className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>A cargo de quien dirige {meeting.conducting_name ? `(${meeting.conducting_name})` : ""}</span>
                      </div>
                    ) : isSacrament ? (
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-xs text-purple-800 font-semibold shadow-2xs">
                        <span>
                          Bendecir: {(sacramentBreakdown?.panAssignment ? 1 : 0) + (sacramentBreakdown?.aguaAssignment ? 1 : 0)}/2
                        </span>
                        <span className="text-purple-300">•</span>
                        <span>Repartir: {sacramentBreakdown?.passAssignments.length || 0}</span>
                      </div>
                    ) : (
                      <>
                        {/* List of assigned persons in this item */}
                        {itemAssignments.map((a) => (
                          <div
                            key={a.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs shadow-2xs group"
                          >
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: a.task_color || "#3b82f6" }}
                            />
                            <span className="font-medium text-slate-800">
                              {a.person_name}
                            </span>
                            <span className="text-slate-400 text-2xs">
                              ({a.task_name})
                            </span>

                            {a.override_3month_alert === 1 && (
                              <span
                                title="Asignado con excepción (participó en los últimos 3 meses)"
                                className="text-amber-600 ml-0.5"
                              >
                                <AlertTriangle className="w-3 h-3 inline" />
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => handleOpenWhatsAppForAssignment(a, item)}
                              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100/70 p-1 rounded-md transition-colors ml-0.5"
                              title={`Notificar a ${a.person_name} por WhatsApp`}
                            >
                              <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                            </button>

                            <button
                              onClick={() => handleRemoveAssignment(a.id)}
                              className="text-slate-400 hover:text-rose-600 ml-1 p-0.5 opacity-60 group-hover:opacity-100"
                              title="Quitar asignación"
                            >
                              ✕
                            </button>
                          </div>
                        ))}

                        {/* Quick Button to assign a person based on block type */}
                        <button
                          onClick={() => {
                            let targetTask = "TALK";
                            if (item.item_type === "HYMN") targetTask = "MUSIC_CONDUCT";
                            else if (item.item_type === "PRAYER") targetTask = "PRAYER";
                            else if (item.item_type === "ORDINANCE") targetTask = "BLESS_SACRAMENT";
                            else if (item.item_type === "TESTIMONY") targetTask = "TESTIFY";
                            else if (item.item_type === "SPECIAL_MUSIC") targetTask = "SPECIAL_MUSIC";
                            else if (item.item_type === "ANNOUNCEMENT") targetTask = "ANNOUNCEMENT";
                            openAssignModal(targetTask, item.id);
                          }}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Asignar</span>
                        </button>
                      </>
                    )}

                    {/* Delete Item button */}
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Eliminar bloque"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        )}

        {/* Lista de Asistencia Section */}
        {(activeViewTab === "ALL" || activeViewTab === "ATTENDANCE") && (
          <div id="attendance-section" className="mb-8">
            <MeetingAttendanceManager
              meetingId={id}
              onTotalsChange={(total, families) => {
                setTotalAttendance(total);
                setAttendingFamiliesCount(families);
              }}
            />
          </div>
        )}

        {/* Modal Add Block */}
        {showAddBlockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-base font-bold text-slate-900 mb-4">
                Agregar Nuevo Bloque al Programa
              </h3>
              <form onSubmit={handleAddBlock} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Tipo de Actividad
                  </label>
                  <select
                    value={newBlockType}
                    onChange={(e) =>
                      setNewBlockType(e.target.value as MeetingItem["item_type"])
                    }
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                  >
                    <option value="TALK">Discurso / Mensaje</option>
                    <option value="HYMN">Himno</option>
                    <option value="PRAYER">Oración</option>
                    <option value="SPECIAL_MUSIC">Número Musical Especial</option>
                    <option value="ORDINANCE">Ordenanza (Santa Cena / Bautismo / Confirmación)</option>
                    <option value="TESTIMONY">Testimonios</option>
                    <option value="ANNOUNCEMENT">Asuntos y Anuncios</option>
                    <option value="CUSTOM">Personalizado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Título del Bloque *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBlockTitle}
                    onChange={(e) => setNewBlockTitle(e.target.value)}
                    placeholder="Ej. Discurso de la Juventud"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium placeholder:text-slate-400"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddBlockModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                  >
                    Agregar Bloque
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Assign Person */}
        {assignModalOpen && activeTaskType && (
          <AssignPersonModal
            isOpen={assignModalOpen}
            onClose={() => setAssignModalOpen(false)}
            meetingId={id}
            meetingDate={meeting.meeting_date}
            meetingItemId={activeItemId}
            taskType={activeTaskType}
            assignmentNotes={assignNotes}
            modalTitle={assignModalTitle}
            onAssigned={loadMeeting}
          />
        )}

        {/* Modal WhatsApp Notification */}
        <WhatsAppNotifyModal
          isOpen={whatsAppModalOpen}
          onClose={() => setWhatsAppModalOpen(false)}
          recipientName={whatsAppRecipientName}
          initialPhone={whatsAppPhone}
          initialMessage={whatsAppMessage}
          assignmentTitle={whatsAppTitle}
        />
      </main>
    </div>
  );
}
