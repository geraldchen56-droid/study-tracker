import sql from "./sql.js";

// Creates the tables on first use. Safe to run repeatedly.
const statements = [
  `create table if not exists tasks (
    id serial primary key, subject text not null, title text not null,
    description text default '', status text not null default 'todo',
    completed boolean not null default false, created_at timestamptz not null default now())`,
  `create table if not exists study_sessions (
    id serial primary key, study_date date not null, time_done integer not null default 0,
    purpose text, subject text not null, created_at timestamptz not null default now())`,
  `create table if not exists deadlines (
    id serial primary key, title text not null, due_date date not null, deadline_type text,
    subject text, what_to_do text default '', what_to_study text default '',
    created_at timestamptz not null default now())`,
  `create table if not exists flashcard_sets (
    id serial primary key, title text not null, subject text, description text,
    created_at timestamptz not null default now())`,
  `create table if not exists flashcards (
    id serial primary key, set_id integer not null references flashcard_sets(id) on delete cascade,
    question text not null, answer text not null, mastered boolean not null default false,
    last_reviewed timestamptz, created_at timestamptz not null default now())`,
  `create table if not exists scheduled_tasks (
    id serial primary key, task_id integer not null references tasks(id) on delete cascade,
    scheduled_date date not null, start_time time, duration integer,
    status text not null default 'scheduled', created_at timestamptz not null default now())`,
  `create table if not exists user_settings (
    id serial primary key, settings_key text not null unique, theme text default 'system',
    page_settings jsonb default '{}'::jsonb, updated_at timestamptz not null default now())`,
  `create table if not exists documents (
    id serial primary key, title text not null, document_type text not null default 'link',
    url text, subject text, linked_task_id integer references tasks(id) on delete set null,
    created_at timestamptz not null default now())`,
];

let ready;
export function ensureSchema() {
  if (!ready) {
    ready = (async () => {
      for (const s of statements) await sql(s, []);
    })().catch((e) => {
      ready = undefined;
      throw e;
    });
  }
  return ready;
}
