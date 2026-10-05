"use client";

import { useState, useEffect } from "react";
import { X, Copy, Check, ExternalLink, Phone, MessageSquare, Sparkles } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm.01 18.06c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.03 8.03 0 01-1.23-4.29c0-4.43 3.6-8.04 8.02-8.04 2.14 0 4.16.84 5.68 2.36a7.994 7.994 0 012.35 5.68c0 4.43-3.61 8.05-8.03 8.05zm4.4-6.03c-.24-.12-1.43-.71-1.65-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.44-1.34-1.68-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.43-.58 1.63-1.15.2-.56.2-1.05.14-1.15-.06-.1-.22-.16-.46-.28z" />
    </svg>
  );
}

interface WhatsAppNotifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  initialPhone?: string | null;
  initialMessage: string;
  assignmentTitle?: string;
}

export default function WhatsAppNotifyModal({
  isOpen,
  onClose,
  recipientName,
  initialPhone,
  initialMessage,
  assignmentTitle,
}: WhatsAppNotifyModalProps) {
  const [phone, setPhone] = useState(initialPhone || "");
  const [message, setMessage] = useState(initialMessage);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPhone(initialPhone || "");
      setMessage(initialMessage);
      setCopied(false);
    }
  }, [isOpen, initialPhone, initialMessage]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Error al copiar al portapapeles:", err);
    }
  };

  const handleOpenWhatsApp = () => {
    const url = getWhatsAppUrl(phone, message);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/15 backdrop-blur-xs text-white">
              <WhatsAppIcon className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight leading-tight">
                Notificación por WhatsApp
              </h3>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                {assignmentTitle || "Invitación de la Presidencia de la Rama"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Recipient & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <div>
              <label className="text-2xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Destinatario
              </label>
              <div className="font-semibold text-sm text-slate-900 truncate">
                {recipientName}
              </div>
            </div>

            <div>
              <label className="text-2xs font-bold uppercase tracking-wider text-slate-500 block mb-1 flex items-center gap-1">
                <Phone className="w-3 h-3 text-emerald-600" />
                <span>Teléfono (WhatsApp)</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+502 1234 5678"
                className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
              <span className="text-3xs text-slate-400 block mt-0.5">
                {phone.trim() ? "Con código de país recomendado" : "Opcional (se elegirá en WhatsApp)"}
              </span>
            </div>
          </div>

          {/* Message Area */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>Mensaje a enviar:</span>
              </label>
              <span className="text-3xs text-slate-400">
                {message.length} caracteres • Puedes editarlo antes de enviar
              </span>
            </div>

            <textarea
              rows={8}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full text-xs font-normal leading-relaxed p-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 shadow-2xs resize-none"
            />
          </div>

          {/* Info pill */}
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-2xs leading-relaxed text-emerald-800">
              El mensaje ha sido generado formalmente indicando que <strong>la Presidencia de la Rama le está invitando a discursar</strong>, con la fecha de la reunión y los datos del tema.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all shadow-2xs ${
              copied
                ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>¡Mensaje copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copiar texto</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors"
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#25D366] hover:bg-[#1EBE5D] active:scale-98 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4 fill-white" />
              <span>Abrir WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5 text-white/80" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

