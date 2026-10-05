/**
 * Utilidades para generación y envío de notificaciones por WhatsApp
 * para asignaciones en reuniones de la Rama.
 */

export function formatSpanishDate(dateStr: string): string {
  try {
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const date = new Date(year, month, day);

    const weekdays = [
      "domingo",
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábado",
    ];
    const months = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];

    const weekdayName = weekdays[date.getDay()];
    const monthName = months[date.getMonth()];

    return `${weekdayName}, ${day} de ${monthName} de ${year}`;
  } catch {
    return dateStr;
  }
}

export interface BuildWhatsAppParams {
  recipientName: string;
  meetingDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  meetingTypeName?: string; // ej. "Reunión Sacramental"
  taskCode?: string; // "TALK", "PRAYER", "MUSIC_CONDUCT", "BLESS_SACRAMENT", "PASS_SACRAMENT", "PRESIDE", "CONDUCT", etc.
  taskName?: string; // "Discursar", "Primera Oración", etc.
  topic?: string | null; // speaker_topic
  hymnTitle?: string | null;
  notes?: string | null; // ej. "Pan" o "Agua"
}

/**
 * Genera el texto del mensaje formal y fraternal para enviar por WhatsApp.
 * Especifica la fecha, el tema del discurso y que la Presidencia de la Rama le está invitando a discursar.
 */
export function buildWhatsAppMessage(params: BuildWhatsAppParams): string {
  const {
    recipientName,
    meetingDate,
    startTime,
    meetingTypeName,
    taskCode,
    taskName,
    topic,
    notes,
  } = params;

  const dateFormatted = formatSpanishDate(meetingDate);
  const timeFormatted = startTime ? `${startTime} hrs` : "";
  const meetingTypeStr = meetingTypeName ? ` (${meetingTypeName})` : "";

  // 1. DISCURSO (TALK)
  if (taskCode === "TALK" || (taskName && taskName.toLowerCase().includes("discurs"))) {
    const topicFormatted = topic && topic.trim()
      ? `\n\n📖 *Tema asignado:* ${topic.trim()}`
      : "\n\n📖 *Tema:* (Por coordinar con la presidencia)";

    return `Estimado(a) hermano(a) ${recipientName}:

Reciba un cordial saludo. La Presidencia de la Rama le está invitando a discursar en la reunión${meetingTypeStr} del día ${dateFormatted}${timeFormatted ? ` a las ${timeFormatted}` : ""}.${topicFormatted}

Agradecemos confirmar si podrá acompañarnos y participar con este mensaje. ¡Muchas gracias por su fiel disposición y servicio!`;
  }

  // 2. ORACIÓN (PRAYER)
  if (taskCode === "PRAYER" || (taskName && taskName.toLowerCase().includes("oraci"))) {
    return `Estimado(a) hermano(a) ${recipientName}:

Reciba un cordial saludo. La Presidencia de la Rama le invita a participar con una oración en la reunión${meetingTypeStr} del día ${dateFormatted}${timeFormatted ? ` a las ${timeFormatted}` : ""}.

Agradecemos confirmar si podrá acompañarnos. ¡Muchas gracias por su fiel servicio!`;
  }

  // 3. DIRIGIR HIMNOS / MÚSICA
  if (taskCode === "MUSIC_CONDUCT" || (taskName && taskName.toLowerCase().includes("himno"))) {
    return `Estimado(a) hermano(a) ${recipientName}:

Reciba un cordial saludo. La Presidencia de la Rama le invita a dirigir los himnos en la reunión${meetingTypeStr} del día ${dateFormatted}${timeFormatted ? ` a las ${timeFormatted}` : ""}.

Agradecemos confirmar si podrá acompañarnos. ¡Muchas gracias por su disposición y servicio!`;
  }

  // 4. SANTA CENA: BENDECIR
  if (taskCode === "BLESS_SACRAMENT") {
    const detail =
      notes === "Pan"
        ? "para *bendecir el pan*"
        : notes === "Agua"
        ? "para *bendecir el agua*"
        : "para *bendecir la Santa Cena*";

    return `Estimado(a) hermano(a) ${recipientName}:

Reciba un cordial saludo. La Presidencia de la Rama le invita a participar en la ordenanza de la Santa Cena ${detail} en la reunión del día ${dateFormatted}${timeFormatted ? ` a las ${timeFormatted}` : ""}.

Agradecemos confirmar su participación. ¡Muchas gracias por su reverencia y servicio!`;
  }

  // 5. SANTA CENA: REPARTIR
  if (taskCode === "PASS_SACRAMENT") {
    return `Estimado(a) hermano(a) ${recipientName}:

Reciba un cordial saludo. La Presidencia de la Rama le invita a participar para *repartir la Santa Cena* en la reunión del día ${dateFormatted}${timeFormatted ? ` a las ${timeFormatted}` : ""}.

Agradecemos confirmar su participación. ¡Muchas gracias por su reverencia y servicio!`;
  }

  // 6. PRESIDIR
  if (taskCode === "PRESIDE") {
    return `Estimado(a) hermano(a) ${recipientName}:

Reciba un cordial saludo. Le recordamos su asignación para *presidir* la reunión${meetingTypeStr} del día ${dateFormatted}${timeFormatted ? ` a las ${timeFormatted}` : ""}.

¡Muchas gracias por su continuo liderazgo y servicio!`;
  }

  // 7. DIRIGIR
  if (taskCode === "CONDUCT") {
    return `Estimado(a) hermano(a) ${recipientName}:

Reciba un cordial saludo. Le recordamos su asignación para *dirigir* la reunión${meetingTypeStr} del día ${dateFormatted}${timeFormatted ? ` a las ${timeFormatted}` : ""}.

¡Muchas gracias por su continuo apoyo y servicio!`;
  }

  // 8. ASIGNACIÓN GENERAL
  const taskLabel = taskName || "una asignación especial";
  return `Estimado(a) hermano(a) ${recipientName}:

Reciba un cordial saludo. La Presidencia de la Rama le invita a participar con la asignación de *${taskLabel}* en la reunión${meetingTypeStr} del día ${dateFormatted}${timeFormatted ? ` a las ${timeFormatted}` : ""}.

Agradecemos confirmar si podrá acompañarnos. ¡Muchas gracias por su fiel servicio!`;
}

/**
 * Limpia el formato del teléfono para dejar únicamente dígitos.
 */
export function cleanPhoneNumber(phone?: string | null): string {
  if (!phone) return "";
  return phone.replace(/\D/g, "");
}

/**
 * Construye la URL de WhatsApp (wa.me) con el número (si existe) y el texto codificado.
 */
export function getWhatsAppUrl(phone: string | null | undefined, text: string): string {
  const clean = cleanPhoneNumber(phone);
  const encoded = encodeURIComponent(text);
  if (clean) {
    return `https://wa.me/${clean}?text=${encoded}`;
  }
  return `https://wa.me/?text=${encoded}`;
}

