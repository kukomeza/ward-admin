"use client";

import { useState, useRef, useEffect } from "react";
import {
  HYMNS_CATALOG,
  HymnInfo,
  findHymnByNumber,
  getHymnGospelLibraryUrl,
  searchHymns,
} from "@/lib/hymns";
import {
  Music,
  Search,
  ExternalLink,
  BookOpen,
  PlayCircle,
  ChevronDown,
  X,
  Check,
} from "lucide-react";

interface HymnSelectorProps {
  itemId: string;
  blockTitle: string;
  hymnNumber?: string | null;
  hymnTitle?: string | null;
  onUpdateHymn: (itemId: string, hymnNumber: string, hymnTitle: string) => void;
}

export default function HymnSelector({
  itemId,
  blockTitle,
  hymnNumber,
  hymnTitle,
  onUpdateHymn,
}: HymnSelectorProps) {
  const isSacramentBlock = blockTitle.toLowerCase().includes("sacramental");
  const isChildrenBlock =
    blockTitle.toLowerCase().includes("primaria") ||
    blockTitle.toLowerCase().includes("niños");

  const [localNumber, setLocalNumber] = useState(hymnNumber || "");
  const [localTitle, setLocalTitle] = useState(hymnTitle || "");
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<
    "ALL" | "SACRAMENT" | "NEW" | "CHILDREN"
  >(
    isSacramentBlock
      ? "SACRAMENT"
      : isChildrenBlock
      ? "CHILDREN"
      : "ALL"
  );

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalNumber(hymnNumber || "");
    setLocalTitle(hymnTitle || "");
  }, [hymnNumber, hymnTitle]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Handle typing a number: auto-fill title if exact match exists in catalog
  const handleNumberChange = (val: string) => {
    setLocalNumber(val);
    const matched = findHymnByNumber(val, {
      preferChildren: filterTab === "CHILDREN",
    });
    if (matched) {
      setLocalTitle(matched.title);
    }
  };

  const handleNumberBlur = () => {
    const matched = findHymnByNumber(localNumber, {
      preferChildren: filterTab === "CHILDREN",
    });
    const finalNumber = matched ? matched.number : localNumber;
    const finalTitle = matched ? matched.title : localTitle;
    if (matched) {
      setLocalNumber(matched.number);
      setLocalTitle(matched.title);
    }
    onUpdateHymn(itemId, finalNumber.trim(), finalTitle.trim());
  };

  const handleTitleBlur = () => {
    onUpdateHymn(itemId, localNumber.trim(), localTitle.trim());
  };

  const handleSelectHymn = (hymn: HymnInfo) => {
    setLocalNumber(hymn.number);
    setLocalTitle(hymn.title);
    setIsOpen(false);
    setSearchQuery("");
    onUpdateHymn(itemId, hymn.number, hymn.title);
  };

  const handleClearHymn = () => {
    setLocalNumber("");
    setLocalTitle("");
    onUpdateHymn(itemId, "", "");
  };

  const filteredHymns = searchHymns(searchQuery, {
    filter: filterTab,
    prioritizeSacrament: isSacramentBlock,
  });

  const gospelLibraryUrl = getHymnGospelLibraryUrl(localNumber, localTitle);
  const hasSelectedHymn = Boolean(localNumber.trim() || localTitle.trim());

  return (
    <div ref={containerRef} className="relative pt-1 text-xs">
      <div className="flex flex-wrap items-center gap-2">
        <Music className="w-3.5 h-3.5 text-blue-600 shrink-0" />

        {/* Input Nº de Himno */}
        <div className="relative">
          <input
            type="text"
            placeholder="Nº (ej. 114, CN 2)"
            value={localNumber}
            onChange={(e) => handleNumberChange(e.target.value)}
            onBlur={handleNumberBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur();
              }
            }}
            className="w-28 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold placeholder:text-slate-400 placeholder:font-normal"
            title="Escribe el número del himno (ej. 114, 1001) o de Primaria (ej. CN 2, P 58)"
          />
        </div>

        {/* Input Nombre del Himno */}
        <div className="relative flex-1 min-w-[200px] max-w-md flex items-center">
          <input
            type="text"
            placeholder="Nombre del himno o buscar en el himnario..."
            value={localTitle}
            onChange={(e) => {
              setLocalTitle(e.target.value);
              setSearchQuery(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            onBlur={handleTitleBlur}
            className="w-full pr-7 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium placeholder:text-slate-400"
          />
          {hasSelectedHymn && (
            <button
              type="button"
              onClick={handleClearHymn}
              className="absolute right-2 text-slate-400 hover:text-slate-600"
              title="Limpiar himno"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Botón para abrir el buscador del Himnario Oficial */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`px-2.5 py-1.5 rounded-lg font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs ${
            isOpen
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
          }`}
          title="Explorar catálogo oficial de himnos (1-209 y Nuevos 1001+)"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Himnario</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Botón directo a la Biblioteca del Evangelio para reproducir el himno */}
        <a
          href={gospelLibraryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`px-2.5 py-1.5 rounded-lg font-semibold border flex items-center gap-1.5 transition-colors shadow-2xs ${
            hasSelectedHymn
              ? "bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600"
              : "bg-white hover:bg-slate-50 text-indigo-700 border-indigo-200"
          }`}
          title={
            localNumber
              ? `Abrir y reproducir Himno Nº ${localNumber} en la Biblioteca del Evangelio`
              : "Abrir Himnario en la Biblioteca del Evangelio"
          }
        >
          <PlayCircle className="w-3.5 h-3.5 shrink-0" />
          <span>
            {localNumber
              ? `Reproducir #${localNumber} (Biblioteca)`
              : "Biblioteca del Evangelio"}
          </span>
          <ExternalLink className="w-3 h-3 opacity-80 shrink-0" />
        </a>
      </div>

      {/* Popover del Catálogo del Himnario */}
      {isOpen && (
        <div className="mt-2 w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-xl z-30 overflow-hidden">
          {/* Barra superior de búsqueda y filtros */}
          <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                <span>
                  Catálogo Oficial: Himnario y Primaria ({HYMNS_CATALOG.length})
                </span>
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por número (ej. 114, 1001, CN 2) o título (ej. Soy un hijo de Dios, Getsemaní)..."
                autoFocus
                className="w-full pl-8 pr-8 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Pestañas de filtro */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setFilterTab("ALL")}
                className={`px-2.5 py-1 rounded-lg text-2xs font-bold transition-colors cursor-pointer ${
                  filterTab === "ALL"
                    ? "bg-slate-900 text-white"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                Todos ({HYMNS_CATALOG.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab("SACRAMENT")}
                className={`px-2.5 py-1 rounded-lg text-2xs font-bold transition-colors cursor-pointer ${
                  filterTab === "SACRAMENT"
                    ? "bg-purple-600 text-white"
                    : "bg-purple-50 border border-purple-200 text-purple-800 hover:bg-purple-100"
                }`}
              >
                Sacramentales (#101–120)
              </button>
              <button
                type="button"
                onClick={() => setFilterTab("NEW")}
                className={`px-2.5 py-1 rounded-lg text-2xs font-bold transition-colors cursor-pointer ${
                  filterTab === "NEW"
                    ? "bg-emerald-600 text-white"
                    : "bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100"
                }`}
              >
                Himnos Nuevos (#1001+)
              </button>
              <button
                type="button"
                onClick={() => setFilterTab("CHILDREN")}
                className={`px-2.5 py-1 rounded-lg text-2xs font-bold transition-colors cursor-pointer ${
                  filterTab === "CHILDREN"
                    ? "bg-amber-600 text-white"
                    : "bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100"
                }`}
              >
                Primaria / Niños (118)
              </button>
            </div>
          </div>

          {/* Lista de resultados */}
          <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
            {filteredHymns.length === 0 ? (
              <div className="p-6 text-center text-slate-400 italic">
                No se encontraron himnos ni canciones con &quot;{searchQuery}&quot;.
              </div>
            ) : (
              filteredHymns.map((h) => {
                const isSelected = localNumber === h.number;
                return (
                  <div
                    key={h.number}
                    onClick={() => handleSelectHymn(h)}
                    className={`px-3.5 py-2.5 flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-blue-50/90 text-blue-900"
                        : "hover:bg-slate-50 text-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`px-2 py-0.5 rounded-md font-extrabold text-xs shrink-0 ${
                          h.isChildren
                            ? "bg-amber-100 text-amber-800"
                            : h.isSacrament
                            ? "bg-purple-100 text-purple-800"
                            : Number(h.number) >= 1000
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        #{h.number}
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-xs truncate">
                          {h.title}
                        </p>
                        <p className="text-2xs text-slate-400 truncate">
                          {h.category}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isSelected && (
                        <span className="text-blue-600 font-bold flex items-center gap-1 text-2xs">
                          <Check className="w-3.5 h-3.5" />
                          Seleccionado
                        </span>
                      )}
                      <a
                        href={h.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-2 py-1 rounded-md text-2xs font-semibold text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-200 flex items-center gap-1"
                        title={`Escuchar #${h.number} en la Biblioteca del Evangelio`}
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>Escuchar</span>
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

