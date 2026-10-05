"use client";

import { useState, useTransition, useRef } from "react";
import { 
  X, 
  Upload, 
  FileSpreadsheet, 
  Download, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  Trash2,
  Users
} from "lucide-react";

interface ParsedPerson {
  first_name: string;
  last_name: string;
  phone?: string;
  email?: string;
  gender?: "M" | "F";
  notes?: string;
  raw_line?: string;
  error?: string;
}

interface ImportPersonsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ImportPersonsModal({
  isOpen,
  onClose,
  onSuccess,
}: ImportPersonsModalProps) {
  const [activeTab, setActiveTab] = useState<"file" | "paste">("file");
  const [rawText, setRawText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedPerson[]>([]);
  const [updateExisting, setUpdateExisting] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [importResult, setImportResult] = useState<{
    created: number;
    updated: number;
    skipped: number;
    total: number;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Auto-detect delimiter: comma, semicolon, or tab
  const detectDelimiter = (line: string): string => {
    const commaCount = (line.match(/,/g) || []).length;
    const semiCount = (line.match(/;/g) || []).length;
    const tabCount = (line.match(/\t/g) || []).length;

    if (tabCount > commaCount && tabCount > semiCount) return "\t";
    if (semiCount > commaCount) return ";";
    return ",";
  };

  // Parse CSV line accounting for quoted values
  const parseCSVLine = (text: string, delimiter: string): string[] => {
    const result: string[] = [];
    let cur = "";
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        result.push(cur.trim());
        cur = "";
      } else {
        cur += char;
      }
    }
    result.push(cur.trim());
    return result.map((col) => col.replace(/^["']|["']$/g, "").trim());
  };

  const handleParseContent = (content: string) => {
    setRawText(content);
    setImportResult(null);
    setErrorMessage(null);

    const lines = content
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) {
      setParsedRows([]);
      return;
    }

    const firstLine = lines[0];
    const delimiter = detectDelimiter(firstLine);
    const headers = parseCSVLine(firstLine, delimiter).map((h) =>
      h.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim()
    );

    // Identify header positions
    let firstNameIdx = headers.findIndex((h) =>
      ["nombre", "nombres", "first_name", "firstname", "first name"].includes(h)
    );
    let lastNameIdx = headers.findIndex((h) =>
      ["apellido", "apellidos", "last_name", "lastname", "last name"].includes(h)
    );
    let fullNameIdx = headers.findIndex((h) =>
      ["nombre completo", "nombre y apellido", "miembro", "persona"].includes(h)
    );
    let phoneIdx = headers.findIndex((h) =>
      ["telefono", "celular", "phone", "movil", "whatsapp"].includes(h)
    );
    let emailIdx = headers.findIndex((h) =>
      ["correo", "email", "correo electronico"].includes(h)
    );
    let genderIdx = headers.findIndex((h) =>
      ["genero", "gender", "sexo"].includes(h)
    );
    let notesIdx = headers.findIndex((h) =>
      ["notas", "notes", "observaciones", "llamamiento", "cargo"].includes(h)
    );

    let dataLines = lines;
    // If first line has header clues, skip it
    if (
      firstNameIdx !== -1 ||
      lastNameIdx !== -1 ||
      fullNameIdx !== -1 ||
      phoneIdx !== -1 ||
      emailIdx !== -1
    ) {
      dataLines = lines.slice(1);
    } else {
      // Default standard order fallback if no header row: Nombre, Apellido, Telefono, Correo, Genero, Notas
      firstNameIdx = 0;
      lastNameIdx = 1;
      phoneIdx = 2;
      emailIdx = 3;
      genderIdx = 4;
      notesIdx = 5;
    }

    const rows: ParsedPerson[] = [];

    dataLines.forEach((line) => {
      const cols = parseCSVLine(line, delimiter);
      if (cols.length === 0 || cols.every((c) => !c)) return;

      let first = firstNameIdx !== -1 ? cols[firstNameIdx] || "" : "";
      let last = lastNameIdx !== -1 ? cols[lastNameIdx] || "" : "";

      // If full name column or no separate last name but first name has two words
      if (!last && fullNameIdx !== -1 && cols[fullNameIdx]) {
        const parts = cols[fullNameIdx].split(/\s+/);
        if (parts.length > 1) {
          first = parts.slice(0, parts.length - 1).join(" ");
          last = parts[parts.length - 1];
        } else {
          first = parts[0];
          last = "";
        }
      } else if (!last && first) {
        const parts = first.split(/\s+/);
        if (parts.length > 1) {
          first = parts.slice(0, parts.length - 1).join(" ");
          last = parts[parts.length - 1];
        }
      }

      const phone = phoneIdx !== -1 ? cols[phoneIdx] || undefined : undefined;
      const email = emailIdx !== -1 ? cols[emailIdx] || undefined : undefined;
      const genderRaw = genderIdx !== -1 ? (cols[genderIdx] || "").toUpperCase() : "";
      let gender: "M" | "F" | undefined = undefined;
      if (["M", "H", "MASCULINO", "HOMBRE", "VARON"].includes(genderRaw)) gender = "M";
      else if (["F", "FEMENINO", "MUJER"].includes(genderRaw)) gender = "F";

      const notes = notesIdx !== -1 ? cols[notesIdx] || undefined : undefined;

      if (!first.trim() || !last.trim()) {
        rows.push({
          first_name: first,
          last_name: last,
          phone,
          email,
          gender,
          notes,
          raw_line: line,
          error: "Falta nombre o apellido",
        });
      } else {
        rows.push({
          first_name: first.trim(),
          last_name: last.trim(),
          phone: phone?.trim(),
          email: email?.trim(),
          gender,
          notes: notes?.trim(),
        });
      }
    });

    setParsedRows(rows);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        handleParseContent(text);
      }
    };
    reader.readAsText(file);
  };

  const downloadSampleTemplate = () => {
    const sample = `Nombre,Apellido,Teléfono,Correo,Género,Notas
Carlos,Mendoza,+502 5551 2345,carlos@ejemplo.com,M,Obispo
Andrés,Villalobos,+502 5552 3456,andres@ejemplo.com,M,Primer Consejero
Elena,Hernández,+502 5553 4567,elena@ejemplo.com,F,Presidenta Sociedad de Socorro
Felipe,Navarro,+502 5554 5678,felipe@ejemplo.com,M,Presbítero
Valeria,Fuentes,+502 5555 6789,valeria@ejemplo.com,F,Maestra de Primaria`;

    const blob = new Blob([sample], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "plantilla_miembros_barrio.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const validRows = parsedRows.filter((r) => !r.error);
  const invalidRows = parsedRows.filter((r) => !!r.error);

  const handleExecuteImport = () => {
    if (validRows.length === 0) return;

    startTransition(async () => {
      try {
        const res = await fetch("/api/persons/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            persons: validRows.map((r) => ({
              first_name: r.first_name,
              last_name: r.last_name,
              phone: r.phone || null,
              email: r.email || null,
              gender: r.gender || null,
              notes: r.notes || null,
            })),
            updateExisting,
          }),
        });

        const data = await res.json();
        if (data.success) {
          setImportResult(data.data);
          onSuccess();
        } else {
          setErrorMessage(data.error || "Ocurrió un error al importar.");
        }
      } catch {
        setErrorMessage("Error de conexión al procesar la importación.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                Importación Masiva de Miembros
              </h3>
              <p className="text-xs text-slate-500">
                Carga a los miembros de tu barrio mediante un archivo CSV o pegando filas de Excel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={downloadSampleTemplate}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 flex items-center gap-1.5 shadow-2xs transition-colors"
              title="Descargar archivo CSV de ejemplo"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Plantilla CSV</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Success Banner */}
          {importResult && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>¡Importación completada con éxito!</span>
              </div>
              <p className="text-xs text-emerald-800">
                Se registraron <strong>{importResult.created}</strong> nuevos miembros y se actualizaron{" "}
                <strong>{importResult.updated}</strong> miembros existentes (Total procesados:{" "}
                {importResult.total}).
              </p>
              <div className="pt-1 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-2xs"
                >
                  Ver Directorio Actualizado
                </button>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {!importResult && (
            <>
              {/* Tabs */}
              <div className="flex border-b border-slate-200 gap-4">
                <button
                  type="button"
                  onClick={() => setActiveTab("file")}
                  className={`pb-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                    activeTab === "file"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>Subir Archivo (.csv)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("paste")}
                  className={`pb-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                    activeTab === "paste"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Copiar y Pegar Texto</span>
                </button>
              </div>

              {/* Tab 1: File Upload */}
              {activeTab === "file" && (
                <div className="space-y-3">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/60 hover:bg-blue-50/20 rounded-2xl p-6 text-center cursor-pointer transition-colors"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,text/csv,text/plain"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-slate-800">
                        {fileName ? (
                          <span className="text-blue-600">{fileName}</span>
                        ) : (
                          "Haz clic para seleccionar tu archivo CSV"
                        )}
                      </p>
                      <p className="text-xs text-slate-500">
                        Formatos soportados: .csv delimitado por comas, punto y coma o tabulaciones
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Paste Area */}
              {activeTab === "paste" && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Pega los datos de las filas copiadas desde Excel o Google Sheets:
                  </label>
                  <textarea
                    rows={5}
                    value={rawText}
                    onChange={(e) => handleParseContent(e.target.value)}
                    placeholder={`Nombre,Apellido,Teléfono,Correo,Género,Notas\nCarlos,Mendoza,+502 1234 5678,carlos@correo.com,M,Obispo\nValeria,Fuentes,,valeria@correo.com,F,Primaria`}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              )}

              {/* Preview Section */}
              {parsedRows.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">Vista previa:</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                        {validRows.length} válidos
                      </span>
                      {invalidRows.length > 0 && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
                          {invalidRows.length} omitidos (incompletos)
                        </span>
                      )}
                    </div>

                    <label className="flex items-center gap-2 text-xs text-slate-600 select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={updateExisting}
                        onChange={(e) => setUpdateExisting(e.target.checked)}
                        className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Actualizar si el miembro ya existe (mismo nombre y apellido)</span>
                    </label>
                  </div>

                  {/* Table */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-100/80 text-slate-700 font-semibold sticky top-0 border-b border-slate-200">
                        <tr>
                          <th className="py-2 px-3">#</th>
                          <th className="py-2 px-3">Nombre</th>
                          <th className="py-2 px-3">Apellido</th>
                          <th className="py-2 px-3">Teléfono</th>
                          <th className="py-2 px-3">Correo</th>
                          <th className="py-2 px-3">Género</th>
                          <th className="py-2 px-3">Notas</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {parsedRows.map((r, idx) => (
                          <tr
                            key={idx}
                            className={
                              r.error
                                ? "bg-rose-50/50 text-rose-700"
                                : "hover:bg-slate-50 text-slate-800 font-medium"
                            }
                          >
                            <td className="py-1.5 px-3 text-slate-400 text-2xs">{idx + 1}</td>
                            <td className="py-1.5 px-3 font-semibold">{r.first_name || "—"}</td>
                            <td className="py-1.5 px-3 font-semibold">{r.last_name || "—"}</td>
                            <td className="py-1.5 px-3 text-slate-600">{r.phone || "—"}</td>
                            <td className="py-1.5 px-3 text-slate-600">{r.email || "—"}</td>
                            <td className="py-1.5 px-3">
                              {r.gender ? (
                                <span className="px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-700 text-2xs font-bold">
                                  {r.gender}
                                </span>
                              ) : (
                                "—"
                              )}
                            </td>
                            <td className="py-1.5 px-3 text-slate-500 text-2xs truncate max-w-[150px]">
                              {r.error ? (
                                <span className="text-rose-600 font-bold">{r.error}</span>
                              ) : (
                                r.notes || "—"
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-between items-center text-xs">
          <span className="text-slate-500">
            {validRows.length > 0 && !importResult
              ? `${validRows.length} personas listas para registrar`
              : "Formato recomendado: Nombre, Apellido, Teléfono, Correo, Género, Notas"}
          </span>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-200/60 transition-colors font-medium"
            >
              {importResult ? "Cerrar" : "Cancelar"}
            </button>
            {!importResult && (
              <button
                type="button"
                disabled={isPending || validRows.length === 0}
                onClick={handleExecuteImport}
                className="px-4 py-1.5 rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
              >
                {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Importar {validRows.length > 0 ? `${validRows.length} Miembros` : ""}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
