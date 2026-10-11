export interface Person {
  id: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
  email?: string | null;
  gender?: "M" | "F" | null;
  notes?: string | null;
  is_active: number;
  created_at: string;
}

export interface TaskType {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  color?: string | null;
  is_active: number;
  created_at: string;
}

export interface MeetingType {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  default_template?: string | null; // JSON array of AgendaTemplateItem
  is_active: number;
  created_at: string;
}

export interface AgendaTemplateItem {
  item_type: "WELCOME" | "HYMN" | "PRAYER" | "ANNOUNCEMENT" | "ORDINANCE" | "TALK" | "TESTIMONY" | "SPECIAL_MUSIC" | "CUSTOM";
  title: string;
  task_code?: string; // code of task required for this block (e.g. MUSIC_CONDUCT, PRAYER, TALK)
  speaker_topic?: string;
  notes?: string;
}

export type MeetingStatus = "DRAFT" | "SCHEDULED" | "IN_PROGRESS" | "COMPLETED";

export interface Meeting {
  id: string;
  meeting_type_id: string;
  meeting_date: string; // YYYY-MM-DD
  start_time: string; // HH:MM
  title: string;
  status: MeetingStatus;
  presiding_person_id?: string | null;
  conducting_person_id?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  meeting_type_name?: string;
  meeting_type_code?: string;
  presiding_name?: string;
  conducting_name?: string;
  presiding_phone?: string | null;
  conducting_phone?: string | null;
  total_attendance?: number;
  attending_families_count?: number;
}

export interface MeetingItem {
  id: string;
  meeting_id: string;
  order_index: number;
  item_type: "WELCOME" | "HYMN" | "PRAYER" | "ANNOUNCEMENT" | "ORDINANCE" | "TALK" | "TESTIMONY" | "SPECIAL_MUSIC" | "CUSTOM";
  title: string;
  hymn_number?: string | null;
  hymn_title?: string | null;
  speaker_topic?: string | null;
  notes?: string | null;
  is_completed: number;
  created_at: string;
  // Joined assignments
  assignments?: TaskAssignment[];
}

export interface TaskAssignment {
  id: string;
  meeting_id: string;
  meeting_item_id?: string | null;
  person_id: string;
  task_type_id: string;
  status: "PENDING" | "CONFIRMED" | "DECLINED";
  override_3month_alert: number;
  notes?: string | null;
  created_at: string;
  // Joined fields
  person_name?: string;
  person_first_name?: string;
  person_phone?: string | null;
  task_name?: string;
  task_code?: string;
  task_color?: string;
  meeting_date?: string;
}

export interface MeetingVisitorNote {
  id: string;
  meeting_id: string;
  visitor_name: string;
  visitor_title?: string | null;
  order_index: number;
  is_read: number;
  created_at: string;
}

export interface RotationAuditResult {
  has_conflict: boolean;
  last_assignment?: {
    meeting_id: string;
    meeting_title: string;
    meeting_type_name: string;
    meeting_date: string;
    task_name: string;
    days_ago: number;
  };
  other_recent_assignments?: {
    meeting_id: string;
    meeting_title: string;
    meeting_date: string;
    task_name: string;
    days_ago: number;
  }[];
}

export interface PersonCandidateStatus {
  person: Person;
  conflict: boolean;
  last_task_date?: string;
  days_ago?: number;
  conflict_details?: string;
  last_any_task_date?: string;
  last_any_task_name?: string;
}

export interface AttendanceFamily {
  id: string;
  name: string;
  default_count: number;
  notes?: string | null;
  is_active: number;
  created_at: string;
}

export interface MeetingAttendanceItem {
  family_id: string;
  family_name: string;
  default_count: number;
  family_notes?: string | null;
  attendees_count: number;
  attendance_id?: string | null;
  attendance_notes?: string | null;
  updated_at?: string | null;
}
