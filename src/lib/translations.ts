export const MEETING_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Borrador",
  SCHEDULED: "Programada",
  IN_PROGRESS: "En curso",
  COMPLETED: "Finalizada",
};

export const ITEM_TYPE_LABELS: Record<string, string> = {
  WELCOME: "Bienvenida",
  HYMN: "Himno",
  PRAYER: "Oración",
  ANNOUNCEMENT: "Asuntos y Anuncios",
  ORDINANCE: "Ordenanza",
  TALK: "Discurso",
  TESTIMONY: "Testimonios",
  SPECIAL_MUSIC: "Música Especial",
  CUSTOM: "Personalizado",
};

export const ASSIGNMENT_STATUS_LABELS: Record<string, string> = {
  CONFIRMED: "Confirmado",
  PENDING: "Pendiente",
  DECLINED: "Declinado",
};

export function formatMeetingStatus(status: string): string {
  return MEETING_STATUS_LABELS[status] || status;
}

export function formatItemType(itemType: string): string {
  return ITEM_TYPE_LABELS[itemType] || itemType;
}

export function parseAnnouncementList(notes?: string | null): string[] {
  if (!notes || !notes.trim()) return [];
  try {
    const parsed = JSON.parse(notes);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item).trim()).filter(Boolean);
    }
  } catch {
    // Fallback: split by lines
    return notes
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  }
  return [notes.trim()];
}

export function serializeAnnouncementList(list: string[]): string {
  return JSON.stringify(list.filter((item) => item.trim().length > 0));
}

export interface SacramentBreakdown {
  panAssignment?: import("./types").TaskAssignment;
  aguaAssignment?: import("./types").TaskAssignment;
  passAssignments: import("./types").TaskAssignment[];
  otherAssignments: import("./types").TaskAssignment[];
}

export function isSacramentItem(
  item: { item_type: string; title: string },
  assignments?: import("./types").TaskAssignment[]
): boolean {
  if (item.item_type !== "ORDINANCE") return false;
  const titleLower = item.title.toLowerCase();
  if (
    titleLower.includes("santa cena") ||
    titleLower.includes("sacrament") ||
    titleLower.includes("cena")
  ) {
    return true;
  }
  if (
    assignments &&
    assignments.some(
      (a) => a.task_code === "BLESS_SACRAMENT" || a.task_code === "PASS_SACRAMENT"
    )
  ) {
    return true;
  }
  return false;
}

export function parseSacramentAssignments(
  assignments: import("./types").TaskAssignment[]
): SacramentBreakdown {
  const blessAssignments = assignments.filter((a) => a.task_code === "BLESS_SACRAMENT");
  const passAssignments = assignments.filter((a) => a.task_code === "PASS_SACRAMENT");
  const otherAssignments = assignments.filter(
    (a) => a.task_code !== "BLESS_SACRAMENT" && a.task_code !== "PASS_SACRAMENT"
  );

  let panAssignment = blessAssignments.find(
    (a) => a.notes?.trim().toLowerCase() === "pan"
  );
  let aguaAssignment = blessAssignments.find(
    (a) => a.notes?.trim().toLowerCase() === "agua"
  );

  const unassignedBless = blessAssignments.filter(
    (a) =>
      a.notes?.trim().toLowerCase() !== "pan" &&
      a.notes?.trim().toLowerCase() !== "agua"
  );

  if (!panAssignment && unassignedBless.length > 0) {
    panAssignment = unassignedBless[0];
  }
  if (!aguaAssignment && unassignedBless.length > 1) {
    aguaAssignment = unassignedBless[1];
  } else if (
    !aguaAssignment &&
    unassignedBless.length === 1 &&
    panAssignment !== unassignedBless[0]
  ) {
    aguaAssignment = unassignedBless[0];
  }

  return {
    panAssignment,
    aguaAssignment,
    passAssignments,
    otherAssignments,
  };
}

export type OfficialBusinessType =
  | "SUSTAINING"
  | "RELEASE"
  | "WELCOME_MEMBER"
  | "ORDINATION"
  | "ANNOUNCEMENT";

export interface ParsedOfficialBusiness {
  type: OfficialBusinessType;
  badgeLabel: string;
  personName?: string;
  detail?: string;
  summaryText: string;
  pulpitScript?: string;
  rawText: string;
}

export function formatOfficialBusinessEntry(
  type: Exclude<OfficialBusinessType, "ANNOUNCEMENT">,
  personName: string,
  detail: string
): string {
  const cleanName = personName.trim();
  const cleanDetail = detail.trim();
  switch (type) {
    case "SUSTAINING":
      return `[SOSTENIMIENTO] ${cleanName} — ${cleanDetail}`;
    case "RELEASE":
      return `[RELEVO] ${cleanName} — ${cleanDetail}`;
    case "WELCOME_MEMBER":
      return `[BIENVENIDA] ${cleanName} — ${cleanDetail}`;
    case "ORDINATION":
      return `[ORDENACIÓN] ${cleanName} — ${cleanDetail}`;
  }
}

export function parseOfficialBusinessItem(rawText: string): ParsedOfficialBusiness {
  const text = rawText.trim();

  const match = text.match(
    /^\[(SOSTENIMIENTO|RELEVO|BIENVENIDA|ORDENACI[ÓO]N)\]\s*(.+?)\s*(?:—|--|-)\s*(.+)$/i
  );

  if (match) {
    const tag = match[1].toUpperCase();
    const personName = match[2].trim();
    const detail = match[3].trim();

    if (tag === "SOSTENIMIENTO") {
      return {
        type: "SUSTAINING",
        badgeLabel: "Sostenimiento",
        personName,
        detail,
        summaryText: `Sostener a ${personName} como ${detail}`,
        pulpitScript: `«Se propone que sostengamos a ${personName} como ${detail}. Los que estén a favor, sírvanse manifestarlo levantando la mano. [Pausa]. Los que estén en contra, si los hay, pueden manifestarlo también.»`,
        rawText: text,
      };
    }

    if (tag === "RELEVO") {
      return {
        type: "RELEASE",
        badgeLabel: "Relevo",
        personName,
        detail,
        summaryText: `Relevo de ${personName} como ${detail}`,
        pulpitScript: `«Se ha relevado a ${personName} como ${detail}. Quienes deseen expresar su agradecimiento por su servicio dedicado, sírvanse manifestarlo levantando la mano.»`,
        rawText: text,
      };
    }

    if (tag === "BIENVENIDA") {
      return {
        type: "WELCOME_MEMBER",
        badgeLabel: "Nuevo Miembro",
        personName,
        detail,
        summaryText: `Bienvenida de ${personName} (${detail})`,
        pulpitScript: `«Proponemos que se reciba a ${personName} en plena comunión en nuestra Rama/Barrio (${detail}). Los que estén a favor de darle la bienvenida, sírvanse manifestarlo levantando la mano.»`,
        rawText: text,
      };
    }

    if (tag === "ORDENACIÓN" || tag === "ORDENACION") {
      return {
        type: "ORDINATION",
        badgeLabel: "Ordenación",
        personName,
        detail,
        summaryText: `Ordenar a ${personName} al oficio de ${detail}`,
        pulpitScript: `«Se propone que ${personName} reciba el Sacerdocio Aarónico y sea ordenado al oficio de ${detail}. Los que estén a favor, sírvanse manifestarlo levantando la mano. [Pausa]. Los que estén en contra, si los hay, pueden manifestarlo.»`,
        rawText: text,
      };
    }
  }

  return {
    type: "ANNOUNCEMENT",
    badgeLabel: "Anuncio",
    summaryText: text,
    rawText: text,
  };
}


