"use client";

import { useEffect, useState, useTransition } from "react";
import { Meeting, MeetingType, Person } from "@/lib/types";
import {
  X,
  Calendar,
  Clock,
  Sparkles,
  Loader2,
  CheckCircle2,
  Flame,
} from "lucide-react";

interface GenerateMonthModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingMeetings: Meeting[];
  onGenerated: () => void;
}

interface SundayDraft {
  date: string;
  dayNumber: number;
  sundayIndex: number; // 1st, 2nd, 3rd, 4th, 5th Sunday
  enabled: boolean;
  alreadyExists: boolean;
  isFastSunday: boolean;
  title: string;
}

const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function computeSundaysOfMonth(
  year: number,
  monthZeroIndexed: number,
  existingDates: Set<string>,
  sacramentalName: string
): SundayDraft[] {
  const sundays: SundayDraft[] = [];
  const date = new Date(year, monthZeroIndexed, 1);
  let idx = 0;

  while (date.getMonth() === monthZeroIndexed) {
    if (date.getDay() === 0) {
      idx++;
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      const dateStr = `${yyyy}-${mm}-${dd}`;
      const alreadyExists = existingDates.has(dateStr);
      const isFast = idx === 1;

      sundays.push({
        date: dateStr,
        dayNumber: date.getDate(),
        sundayIndex: idx,
        enabled: !alreadyExists,
        alreadyExists,
        isFastSunday: isFast,
        title: isFast
          ? `Reunión de Ayuno y Testimonios - ${dateStr}`
          : `${sacramentalName} - ${dateStr}`,
      });
    }
    date.setDate(date.getDate() + 1);
  }

  return sundays;
}

export default function GenerateMonthModal({
  isOpen,
  onClose,
  existingMeetings,
  onGenerated,
}: GenerateMonthModalProps) {
  const [meetingTypes, setMeetingTypes] = useState<MeetingType[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [meetingTypeId, setMeetingTypeId] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [presidingPersonId, setPresidingPersonId] = useState("");
  const [conductingPersonId, setConductingPersonId] = useState("");

  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [sundays, setSundays] = useState<SundayDraft[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const existingDatesSet = new Set(
    existingMeetings.map((m) => m.meeting_date)
  );

  useEffect(() => {
    if (!isOpen) return;

    async function loadMeta() {
      try {
        const [typesRes, personsRes] = await Promise.all([
          fetch("/api/meeting-types"),
          fetch("/api/persons"),
        ]);
        const typesData = await typesRes.json();
        const personsData = await personsRes.json();

        let defaultTypeName = "Reunión Sacramental";
        if (typesData.success && typesData.data.length > 0) {
          setMeetingTypes(typesData.data);
          const sacType =
            typesData.data.find(
              (t: MeetingType) => t.code === "SACRAMENTAL"
            ) || typesData.data[0];
          setMeetingTypeId(sacType.id);
          defaultTypeName = sacType.name;
        }

        if (personsData.success) {
          setPersons(personsData.data);
        }

        setSundays(
          computeSundaysOfMonth(
            selectedYear,
            selectedMonth,
            new Set(existingMeetings.map((m) => m.meeting_date)),
            defaultTypeName
          )
        );
      } catch (err) {
        console.error("Error loading generator metadata:", err);
      }
    }

    loadMeta();
  }, [isOpen]);

  const rebuildSundays = (year: number, month: number, typeId?: string) => {
    const activeTypeId = typeId || meetingTypeId;
    const foundType = meetingTypes.find((t) => t.id === activeTypeId);
    const typeName = foundType?.name || "Reunión Sacramental";
    setSundays(
      computeSundaysOfMonth(year, month, existingDatesSet, typeName)
    );
  };

  const handleMonthChange = (newMonth: number) => {
    setSelectedMonth(newMonth);
    rebuildSundays(selectedYear, newMonth);
  };

  const handleYearChange = (newYear: number) => {
    setSelectedYear(newYear);
    rebuildSundays(newYear, selectedMonth);
  };

  const handleToggleEnabled = (date: string) => {
    setSundays((prev) =>
      prev.map((s) => (s.date === date ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleToggleFastSunday = (date: string) => {
    const foundType = meetingTypes.find((t) => t.id === meetingTypeId);
    const typeName = foundType?.name || "Reunión Sacramental";

    setSundays((prev) =>
      prev.map((s) => {
        if (s.date !== date) return s;
        const nextFast = !s.isFastSunday;
        return {
          ...s,
          isFastSunday: nextFast,
          title: nextFast
            ? `Reunión de Ayuno y Testimonios - ${s.date}`
            : `${typeName} - ${s.date}`,
        };
      })
    );
  };

  const handleTitleChange = (date: string, newTitle: string) => {
    setSundays((prev) =>
      prev.map((s) => (s.date === date ? { ...s, title: newTitle } : s))
    );
  };

  if (!isOpen) return null;

  const selectedCount = sundays.filter((s) => s.enabled).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const toCreate = sundays.filter((s) => s.enabled && s.title.trim());
    if (toCreate.length === 0) {
      setError("Selecciona al menos un domingo para generar.");
      return;
    }

    startTransition(async () => {
      try {
        const payload = {
          meetings: toCreate.map((s) => ({
            meeting_type_id: meetingTypeId,
            meeting_date: s.date,
            start_time: startTime,
            title: s.title.trim(),
            presiding_person_id: presidingPersonId || null,
            conducting_person_id: conductingPersonId || null,
            apply_template: true,
            is_fast_sunday: s.isFastSunday,
          })),
        };

        const res = await fetch("/api/meetings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (data.success) {
          onGenerated();
          onClose();
        } else {
          setError(data.error || "Error al generar los domingos del mes");
        }
      } catch {
        setError("Error de conexión al generar reuniones");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Generar Domingos del Mes
              </h3>
              <p className="text-xs text-slate-500">
                Crea todas las reuniones sacramentales del mes con detección automática del Domingo de Ayuno
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          {/* Selección de Mes, Año y Hora */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Mes
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => handleMonthChange(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
              >
                {MONTH_NAMES.map((name, idx) => (
                  <option key={name} value={idx}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Año
              </label>
              <select
                value={selectedYear}
                onChange={(e) => handleYearChange(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
              >
                {[now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1].map(
                  (yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Hora Habitual
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
              />
            </div>
          </div>

          {/* Preside y Dirige opcional para todo el mes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Preside por defecto (Opcional)
              </label>
              <select
                value={presidingPersonId}
                onChange={(e) => setPresidingPersonId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
              >
                <option value="">(Asignar después en cada domingo)</option>
                {persons.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.first_name} {p.last_name} {p.notes ? `(${p.notes})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Dirige por defecto (Opcional)
              </label>
              <select
                value={conductingPersonId}
                onChange={(e) => setConductingPersonId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
              >
                <option value="">(Asignar después en cada domingo)</option>
                {persons.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.first_name} {p.last_name} {p.notes ? `(${p.notes})` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Lista de Domingos del Mes */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Domingos de {MONTH_NAMES[selectedMonth]} {selectedYear} ({sundays.length})
              </span>
              <span className="text-2xs text-slate-500">
                Puedes cambiar qué domingo será de Ayuno y Testimonios con el botón naranja
              </span>
            </div>

            <div className="space-y-2">
              {sundays.map((s) => (
                <div
                  key={s.date}
                  className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                    !s.enabled
                      ? "bg-slate-50 border-slate-200 opacity-60"
                      : s.isFastSunday
                      ? "bg-amber-50/50 border-amber-300 shadow-2xs"
                      : "bg-white border-slate-200 shadow-2xs"
                  }`}
                >
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={s.enabled}
                      onChange={() => handleToggleEnabled(s.date)}
                      className="w-4 h-4 text-blue-600 rounded-sm focus:ring-blue-500 shrink-0 cursor-pointer"
                    />
                    <div className="shrink-0">
                      <span className="text-xs font-extrabold px-2 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 block text-center">
                        Dom {s.dayNumber}
                      </span>
                    </div>

                    <input
                      type="text"
                      value={s.title}
                      disabled={!s.enabled}
                      onChange={(e) => handleTitleChange(s.date, e.target.value)}
                      className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-blue-500 min-w-0"
                    />
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {s.alreadyExists && (
                      <span className="inline-flex items-center gap-1 text-2xs font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Ya existe
                      </span>
                    )}

                    <button
                      type="button"
                      disabled={!s.enabled}
                      onClick={() => handleToggleFastSunday(s.date)}
                      className={`px-2.5 py-1 rounded-lg text-2xs font-bold border flex items-center gap-1 transition-colors cursor-pointer ${
                        s.isFastSunday
                          ? "bg-amber-600 text-white border-amber-600"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-200"
                      }`}
                      title="Alternar entre Domingo de Ayuno y Testimonios o Reunión Sacramental con discursos"
                    >
                      <Flame className="w-3 h-3" />
                      <span>
                        {s.isFastSunday ? "Ayuno y Testimonios" : "Discursos"}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              Se crearán <strong>{selectedCount}</strong> reuniones con su agenda lista.
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isPending || selectedCount === 0}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 shadow-xs cursor-pointer"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Calendar className="w-4 h-4" />
                )}
                <span>Crear {selectedCount} Domingos</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

