"use client";

import { useEffect, useState, useTransition } from "react";
import Navbar from "@/components/Navbar";
import { MeetingType, TaskType } from "@/lib/types";
import { Tag, Plus, Loader2, Calendar, Check, Layers } from "lucide-react";

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [meetingTypes, setMeetingTypes] = useState<MeetingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"tasks" | "meeting_types">("tasks");
  const [isPending, startTransition] = useTransition();

  // New task modal
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskColor, setTaskColor] = useState("#2563eb");

  // New meeting type modal
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [typeName, setTypeName] = useState("");
  const [typeDesc, setTypeDesc] = useState("");

  const loadData = async () => {
    try {
      const [tasksRes, typesRes] = await Promise.all([
        fetch("/api/tasks"),
        fetch("/api/meeting-types"),
      ]);
      const tasksData = await tasksRes.json();
      const typesData = await typesRes.json();
      if (tasksData.success) setTasks(tasksData.data);
      if (typesData.success) setMeetingTypes(typesData.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    startTransition(async () => {
      try {
        await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: taskName.trim(),
            description: taskDesc.trim() || null,
            color: taskColor,
          }),
        });
        setIsTaskModalOpen(false);
        setTaskName("");
        setTaskDesc("");
        loadData();
      } catch (err) {
        console.error(err);
      }
    });
  };

  const handleCreateType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typeName.trim()) return;

    startTransition(async () => {
      try {
        await fetch("/api/meeting-types", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: typeName.trim(),
            description: typeDesc.trim() || null,
          }),
        });
        setIsTypeModalOpen(false);
        setTypeName("");
        setTypeDesc("");
        loadData();
      } catch (err) {
        console.error(err);
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Catálogo de Tareas y Tipos de Reunión
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Personaliza las actividades asignables y los tipos de reuniones de acuerdo a las necesidades de tu barrio o rama.
            </p>
          </div>

          <div className="flex gap-2">
            {activeTab === "tasks" ? (
              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Tarea</span>
              </button>
            ) : (
              <button
                onClick={() => setIsTypeModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo Tipo de Reunión</span>
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 gap-6">
          <button
            onClick={() => setActiveTab("tasks")}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "tasks"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Tareas Disponibles ({tasks.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("meeting_types")}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "meeting_types"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Tipos de Reuniones ({meetingTypes.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-sm">Cargando catálogo...</span>
          </div>
        ) : activeTab === "tasks" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-md text-white uppercase tracking-wider"
                      style={{ backgroundColor: t.color || "#3b82f6" }}
                    >
                      {t.code}
                    </span>
                    <span className="text-2xs text-slate-400">Clave: {t.code}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mt-2">
                    {t.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {t.description || "Sin descripción"}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <Check className="w-3.5 h-3.5" /> Activa
                  </span>
                  <span>Regla 3 meses activa</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {meetingTypes.map((mt) => (
              <div
                key={mt.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
                    {mt.code}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base mt-2">
                    {mt.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {mt.description || "Sin descripción"}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Plantilla predeterminada configurada</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Nueva Tarea */}
        {isTaskModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-base font-bold text-slate-900 mb-4">
                Crear Nueva Tarea Asignable
              </h3>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Nombre de la Tarea *
                  </label>
                  <input
                    type="text"
                    required
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    placeholder="Ej. Tocar el Piano"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Descripción
                  </label>
                  <input
                    type="text"
                    value={taskDesc}
                    onChange={(e) => setTaskDesc(e.target.value)}
                    placeholder="Ej. Acompañar los himnos durante la reunión"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Color de Identificación
                  </label>
                  <input
                    type="color"
                    value={taskColor}
                    onChange={(e) => setTaskColor(e.target.value)}
                    className="w-20 h-9 p-1 rounded-lg border border-slate-200 cursor-pointer"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsTaskModalOpen(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                  >
                    Crear Tarea
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Nuevo Tipo de Reunión */}
        {isTypeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-base font-bold text-slate-900 mb-4">
                Crear Nuevo Tipo de Reunión
              </h3>
              <form onSubmit={handleCreateType} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Nombre del Tipo de Reunión *
                  </label>
                  <input
                    type="text"
                    required
                    value={typeName}
                    onChange={(e) => setTypeName(e.target.value)}
                    placeholder="Ej. Conferencia de Barrio"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Descripción
                  </label>
                  <input
                    type="text"
                    value={typeDesc}
                    onChange={(e) => setTypeDesc(e.target.value)}
                    placeholder="Ej. Sesión general semestral de conferencia"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium placeholder:text-slate-400"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsTypeModalOpen(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                  >
                    Crear Tipo
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
