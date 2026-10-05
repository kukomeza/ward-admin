"use client";

import { useEffect, useState, useTransition } from "react";
import Navbar from "@/components/Navbar";
import ImportPersonsModal from "@/components/ImportPersonsModal";
import { Person, TaskAssignment } from "@/lib/types";
import { 
  Users, 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  History, 
  Calendar, 
  X, 
  Edit2, 
  Trash2, 
  Loader2,
  CheckCircle2,
  Clock,
  FileSpreadsheet
} from "lucide-react";

export default function PersonsPage() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Selected person for history modal
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [history, setHistory] = useState<(TaskAssignment & { meeting_title: string; meeting_type_name: string })[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // New/Edit person modal
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<"M" | "F" | "">("");
  const [notes, setNotes] = useState("");

  const loadPersons = async () => {
    try {
      const res = await fetch("/api/persons");
      const data = await res.json();
      if (data.success) {
        setPersons(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPersons();
  }, []);

  const openHistoryModal = async (person: Person) => {
    setSelectedPerson(person);
    setHistoryLoading(true);
    try {
      const res = await fetch(`/api/persons/${person.id}`);
      const data = await res.json();
      if (data.success) {
        setHistory(data.data.history);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingPerson(null);
    setFirstName("");
    setLastName("");
    setPhone("");
    setEmail("");
    setGender("");
    setNotes("");
    setIsFormModalOpen(true);
  };

  const openEditModal = (p: Person) => {
    setEditingPerson(p);
    setFirstName(p.first_name);
    setLastName(p.last_name);
    setPhone(p.phone || "");
    setEmail(p.email || "");
    setGender(p.gender || "");
    setNotes(p.notes || "");
    setIsFormModalOpen(true);
  };

  const handleSavePerson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;

    startTransition(async () => {
      try {
        if (editingPerson) {
          await fetch(`/api/persons/${editingPerson.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              first_name: firstName,
              last_name: lastName,
              phone: phone || null,
              email: email || null,
              gender: gender || null,
              notes: notes || null,
            }),
          });
        } else {
          await fetch("/api/persons", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              first_name: firstName,
              last_name: lastName,
              phone: phone || null,
              email: email || null,
              gender: gender || null,
              notes: notes || null,
            }),
          });
        }
        setIsFormModalOpen(false);
        loadPersons();
      } catch (err) {
        console.error(err);
      }
    });
  };

  const handleDeletePerson = async (id: string) => {
    if (!confirm("¿Deseas dar de baja a esta persona del directorio?")) return;
    try {
      await fetch(`/api/persons/${id}`, { method: "DELETE" });
      loadPersons();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPersons = persons.filter((p) => {
    const full = `${p.first_name} ${p.last_name}`.toLowerCase();
    const notesStr = (p.notes || "").toLowerCase();
    const q = search.toLowerCase();
    return full.includes(q) || notesStr.includes(q);
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Directorio de Personas
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Gestiona a los miembros, asignaciones históricas y disponibilidad para las reuniones.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm flex items-center justify-center gap-2 shadow-2xs transition-colors shrink-0"
              title="Importar varios miembros desde archivo CSV o pegando texto de Excel"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Importar CSV</span>
            </button>

            <button
              onClick={openCreateModal}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Persona</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o llamamiento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium placeholder:text-slate-400"
          />
        </div>

        {/* Persons Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-sm">Cargando directorio...</span>
          </div>
        ) : filteredPersons.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-sm">
            No se encontraron personas con ese criterio.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPersons.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm shrink-0">
                        {p.first_name[0]}
                        {p.last_name[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">
                          {p.first_name} {p.last_name}
                        </h3>
                        {p.notes && (
                          <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium inline-block mt-0.5">
                            {p.notes}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePerson(p.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Dar de baja"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Contact info */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                    {p.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{p.phone}</span>
                      </div>
                    )}
                    {p.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{p.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Historial button */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => openHistoryModal(p)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 flex items-center gap-1.5 transition-colors"
                  >
                    <History className="w-3.5 h-3.5" />
                    <span>Ver Historial de Tareas</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Historial */}
        {selectedPerson && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[85vh]">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                    {selectedPerson.first_name[0]}
                    {selectedPerson.last_name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      {selectedPerson.first_name} {selectedPerson.last_name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Historial cronológico de participaciones
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPerson(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                {historyLoading ? (
                  <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    <span className="text-xs">Cargando participaciones...</span>
                  </div>
                ) : history.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    Esta persona aún no tiene participaciones registradas en reuniones pasadas.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {history.map((h) => (
                      <div
                        key={h.id}
                        className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className="font-bold px-2 py-0.5 rounded-md text-white text-2xs uppercase tracking-wider"
                              style={{ backgroundColor: h.task_color || "#3b82f6" }}
                            >
                              {h.task_name}
                            </span>
                            <span className="font-semibold text-slate-900">
                              {h.meeting_title}
                            </span>
                          </div>
                          <span className="text-slate-500 mt-1 block">
                            Tipo: {h.meeting_type_name}
                          </span>
                        </div>

                        <div className="text-right text-slate-500 shrink-0 font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {h.meeting_date}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 text-right">
                <button
                  onClick={() => setSelectedPerson(null)}
                  className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Create/Edit Person */}
        {isFormModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-base font-bold text-slate-900 mb-4">
                {editingPerson ? "Editar Persona" : "Registrar Nueva Persona"}
              </h3>
              <form onSubmit={handleSavePerson} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Ej. Juan"
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Apellido *
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Ej. Pérez"
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Teléfono
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="555-0123"
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Género
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as "M" | "F" | "")}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                    >
                      <option value="">(No especificado)</option>
                      <option value="M">Masculino</option>
                      <option value="F">Femenino</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Notas / Llamamiento
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ej. Diácono, Directora de Música, etc."
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium placeholder:text-slate-400"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsFormModalOpen(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Import CSV */}
        {isImportModalOpen && (
          <ImportPersonsModal
            isOpen={isImportModalOpen}
            onClose={() => setIsImportModalOpen(false)}
            onSuccess={loadPersons}
          />
        )}
      </main>
    </div>
  );
}
