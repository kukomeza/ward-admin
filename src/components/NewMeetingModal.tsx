"use client";

import { useEffect, useState, useTransition } from "react";
import { MeetingType, Person } from "@/lib/types";
import { X, Calendar, Clock, Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface NewMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newMeetingId: string) => void;
}

export default function NewMeetingModal({
  isOpen,
  onClose,
  onCreated,
}: NewMeetingModalProps) {
  const router = useRouter();
  const [meetingTypes, setMeetingTypes] = useState<MeetingType[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [meetingTypeId, setMeetingTypeId] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [title, setTitle] = useState("");
  const [presidingPersonId, setPresidingPersonId] = useState("");
  const [conductingPersonId, setConductingPersonId] = useState("");
  const [applyTemplate, setApplyTemplate] = useState(true);
  const [isFastSunday, setIsFastSunday] = useState(false);

  const checkIsFirstSunday = (dateStr: string): boolean => {
    if (!dateStr) return false;
    const [y, m, d] = dateStr.split("-").map(Number);
    if (!y || !m || !d) return false;
    const dt = new Date(y, m - 1, d);
    return dt.getDay() === 0 && d <= 7;
  };

  // Auto-set next Sunday as default date
  useEffect(() => {
    if (!isOpen) return;

    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 is Sunday
    const daysUntilSunday = (7 - dayOfWeek) % 7 || 7;
    const nextSunday = new Date(today);
    nextSunday.setDate(today.getDate() + daysUntilSunday);
    const dateStr = nextSunday.toISOString().split("T")[0];
    const firstSun = checkIsFirstSunday(dateStr);

    setMeetingDate(dateStr);
    setIsFastSunday(firstSun);

    async function loadMeta() {
      try {
        const [typesRes, personsRes] = await Promise.all([
          fetch("/api/meeting-types"),
          fetch("/api/persons"),
        ]);
        const typesData = await typesRes.json();
        const personsData = await personsRes.json();

        if (typesData.success && typesData.data.length > 0) {
          setMeetingTypes(typesData.data);
          const defaultType = typesData.data[0];
          setMeetingTypeId(defaultType.id);
          const isSacramental = defaultType.code === "SACRAMENTAL";
          setTitle(
            isSacramental && firstSun
              ? `Reunión de Ayuno y Testimonios - ${dateStr}`
              : `${defaultType.name} - ${dateStr}`
          );
        }

        if (personsData.success) {
          setPersons(personsData.data);
        }
      } catch (err) {
        console.error("Failed to load modal metadata:", err);
      }
    }

    loadMeta();
  }, [isOpen]);

  // Update title when type or date changes
  const handleTypeChange = (typeId: string) => {
    setMeetingTypeId(typeId);
    const selected = meetingTypes.find((t) => t.id === typeId);
    if (selected) {
      const isSac = selected.code === "SACRAMENTAL";
      if (!isSac) setIsFastSunday(false);
      setTitle(
        isSac && isFastSunday
          ? `Reunión de Ayuno y Testimonios - ${meetingDate}`
          : `${selected.name} - ${meetingDate}`
      );
    }
  };

  const handleDateChange = (date: string) => {
    setMeetingDate(date);
    const selected = meetingTypes.find((t) => t.id === meetingTypeId);
    const firstSun = checkIsFirstSunday(date);
    const isSac = selected?.code === "SACRAMENTAL";
    if (isSac) {
      setIsFastSunday(firstSun);
    }
    if (selected) {
      setTitle(
        isSac && firstSun
          ? `Reunión de Ayuno y Testimonios - ${date}`
          : `${selected.name} - ${date}`
      );
    }
  };

  const handleFastSundayToggle = (checked: boolean) => {
    setIsFastSunday(checked);
    const selected = meetingTypes.find((t) => t.id === meetingTypeId);
    if (selected && selected.code === "SACRAMENTAL") {
      setTitle(
        checked
          ? `Reunión de Ayuno y Testimonios - ${meetingDate}`
          : `${selected.name} - ${meetingDate}`
      );
    }
  };

  if (!isOpen) return null;

  const selectedMeetingType = meetingTypes.find((t) => t.id === meetingTypeId);
  const isSacramentalSelected = selectedMeetingType?.code === "SACRAMENTAL";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!meetingTypeId || !meetingDate || !title.trim()) {
      setError("Por favor completa el tipo de reunión, fecha y título.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/meetings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            meeting_type_id: meetingTypeId,
            meeting_date: meetingDate,
            start_time: startTime,
            title: title.trim(),
            presiding_person_id: presidingPersonId || null,
            conducting_person_id: conductingPersonId || null,
            apply_template: applyTemplate,
            is_fast_sunday: isSacramentalSelected && isFastSunday,
          }),
        });

        const data = await res.json();
        if (data.success) {
          onCreated(data.data.id);
          onClose();
          router.push(`/meetings/${data.data.id}`);
        } else {
          setError(data.error || "Error al crear la reunión");
        }
      } catch {
        setError("Error de conexión al guardar reunión");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-base">
                Crear Nueva Reunión
              </h3>
              <p className="text-xs text-slate-500">
                Configura los detalles básicos y carga la agenda sugerida
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          {/* Tipo de Reunión */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Tipo de Reunión *
            </label>
            <select
              value={meetingTypeId}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-medium"
            >
              {meetingTypes.map((mt) => (
                <option key={mt.id} value={mt.id}>
                  {mt.name}
                </option>
              ))}
            </select>
          </div>

          {/* Título */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Título de la Reunión *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Reunión Sacramental de Pascua"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-medium placeholder:text-slate-400"
            />
          </div>

          {/* Fecha y Hora */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Fecha *
              </label>
              <input
                type="date"
                value={meetingDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Hora de Inicio
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-medium"
              />
            </div>
          </div>

          {/* Preside y Dirige */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Preside
              </label>
              <select
                value={presidingPersonId}
                onChange={(e) => setPresidingPersonId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-medium"
              >
                <option value="">(Seleccionar persona)</option>
                {persons.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.first_name} {p.last_name} {p.notes ? `(${p.notes})` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Dirige
              </label>
              <select
                value={conductingPersonId}
                onChange={(e) => setConductingPersonId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-medium"
              >
                <option value="">(Seleccionar persona)</option>
                {persons.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.first_name} {p.last_name} {p.notes ? `(${p.notes})` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Checkbox Domingo de Ayuno y Plantilla */}
          <div className="pt-2 space-y-2.5">
            {isSacramentalSelected && (
              <label className="flex items-center gap-2 p-3 bg-amber-50/70 border border-amber-200 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFastSunday}
                  onChange={(e) => handleFastSundayToggle(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded-sm focus:ring-amber-500"
                />
                <div className="text-xs">
                  <span className="font-semibold text-amber-950 flex items-center gap-1">
                    Es Domingo de Ayuno y Testimonios
                  </span>
                  <p className="text-amber-800">
                    Reemplaza los bloques de discursos por el bloque de{" "}
                    <strong>Testimonios de los Miembros</strong> (se detecta automáticamente en el 1er domingo del mes).
                  </p>
                </div>
              </label>
            )}

            <label className="flex items-center gap-2 p-3 bg-blue-50/60 border border-blue-200/70 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={applyTemplate}
                onChange={(e) => setApplyTemplate(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded-sm focus:ring-blue-500"
              />
              <div className="text-xs">
                <span className="font-semibold text-blue-900 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 inline" />
                  Cargar plantilla predeterminada de agenda
                </span>
                <p className="text-blue-700">
                  Crea automáticamente los bloques sugeridos (bienvenida, himnos, Santa Cena, {isFastSunday ? "testimonios" : "discursos"}, etc.)
                </p>
              </div>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-2 shadow-xs"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Crear Reunión y Abrir Agenda
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
