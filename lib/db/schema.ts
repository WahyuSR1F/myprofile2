import { sql } from 'drizzle-orm';
import {
  sqliteTable,
  text,
  integer,
  real,
} from 'drizzle-orm/sqlite-core';

// ─── Helper: timestamps ───────────────────────────────────────────────────────
const timestamps = {
  created_at: text('created_at').notNull().default(sql`(datetime('now'))`),
  updated_at: text('updated_at').notNull().default(sql`(datetime('now'))`),
};

// ═══════════════════════════════════════════════════════════════════════════════
// PORTFOLIO TABLES (protofolio_*)
// ═══════════════════════════════════════════════════════════════════════════════

export const protofolioProfiles = sqliteTable('protofolio_profiles', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().default(''),
  title: text('title').notNull().default(''),
  tagline: text('tagline'),
  bio: text('bio'),
  photo_url: text('photo_url'),
  email: text('email'),
  phone: text('phone'),
  location: text('location'),
  website: text('website'),
  linkedin_url: text('linkedin_url'),
  github_url: text('github_url'),
  twitter_url: text('twitter_url'),
  instagram_url: text('instagram_url'),
  cv_url: text('cv_url'),
  available_for_work: integer('available_for_work', { mode: 'boolean' }).default(false),
  motivasi: text('motivasi'),
  keterangan_pengalaman: text('keterangan_pengalaman'),
  about_highlights: text('about_highlights').default('[]'),
  about_stats: text('about_stats').default('[]'),
  ...timestamps,
});

export const protofolioExperiences = sqliteTable('protofolio_experiences', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  company: text('company').notNull(),
  position: text('position').notNull(),
  start_date: text('start_date').notNull(),
  end_date: text('end_date'),
  current: integer('current', { mode: 'boolean' }).default(false),
  description: text('description'),
  // Stored as JSON array string e.g. '["achievement1","achievement2"]'
  achievements: text('achievements').default('[]'),
  location: text('location'),
  image_url: text('image_url'),
  sort_order: integer('sort_order').default(0),
  ...timestamps,
});

export const protofolioSkills = sqliteTable('protofolio_skills', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  category: text('category').notNull().default('Lainnya'),
  proficiency: integer('proficiency').default(50),
  icon: text('icon'),
  sort_order: integer('sort_order').default(0),
  ...timestamps,
});

export const protofolioProjects = sqliteTable('protofolio_projects', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  description: text('description'),
  long_description: text('long_description'),
  image_url: text('image_url'),
  // Stored as JSON array string e.g. '["React","TypeScript"]'
  tech_stack: text('tech_stack').default('[]'),
  project_url: text('project_url'),
  github_url: text('github_url'),
  featured: integer('featured', { mode: 'boolean' }).default(false),
  sort_order: integer('sort_order').default(0),
  ...timestamps,
});

export const protofolioEducation = sqliteTable('protofolio_education', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  institution: text('institution').notNull(),
  degree: text('degree').notNull(),
  field: text('field'),
  start_date: text('start_date'),
  end_date: text('end_date'),
  description: text('description'),
  sort_order: integer('sort_order').default(0),
  ...timestamps,
});

export const protofolioMessages = sqliteTable('protofolio_messages', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject'),
  message: text('message').notNull(),
  is_read: integer('is_read', { mode: 'boolean' }).default(false),
  created_at: text('created_at').notNull().default(sql`(datetime('now'))`),
});

export const protofolioSettings = sqliteTable('protofolio_settings', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  key: text('key').notNull().unique(),
  value: text('value'),
  ...timestamps,
});

export const protofolioCertificates = sqliteTable('protofolio_certificates', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  issuer: text('issuer').notNull(),
  date: text('date'),
  url: text('url'),
  image_url: text('image_url'),
  sort_order: integer('sort_order').default(0),
  ...timestamps,
});

export const protofolioAchievements = sqliteTable('protofolio_achievements', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  description: text('description'),
  date: text('date'),
  icon: text('icon'),
  image_url: text('image_url'),
  sort_order: integer('sort_order').default(0),
  ...timestamps,
});

export const protofolioCourses = sqliteTable('protofolio_courses', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  provider: text('provider'),
  date: text('date'),
  url: text('url'),
  image_url: text('image_url'),
  sort_order: integer('sort_order').default(0),
  ...timestamps,
});

// ═══════════════════════════════════════════════════════════════════════════════
// SIPD TABLES (Sistem Informasi Persetujuan Dokumen)
// ═══════════════════════════════════════════════════════════════════════════════

export const sipdProfiles = sqliteTable('sipd_profiles', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().default(''),
  email: text('email').notNull().default(''),
  // 'pemohon' | 'penilai' | 'admin'
  role: text('role').notNull().default('pemohon'),
  company: text('company'),
  phone: text('phone'),
  avatar_url: text('avatar_url'),
  password_hash: text('password_hash'), // for local auth (bcrypt hash)
  ...timestamps,
});

export const sipdProjects = sqliteTable('sipd_projects', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  code: text('code').unique().notNull(),
  title: text('title').notNull(),
  description: text('description'),
  // 'draft'|'submitted'|'admin_verification'|'under_review'|'approved'|'revision'|'rejected'
  status: text('status').notNull().default('draft'),
  user_id: text('user_id').notNull().references(() => sipdProfiles.id, { onDelete: 'cascade' }),
  assigned_to: text('assigned_to').references(() => sipdProfiles.id, { onDelete: 'set null' }),
  review_notes: text('review_notes'),
  submitted_at: text('submitted_at'),
  reviewed_at: text('reviewed_at'),
  ...timestamps,
});

export const sipdProjectDocuments = sqliteTable('sipd_project_documents', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  project_id: text('project_id').notNull().references(() => sipdProjects.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  file_url: text('file_url').notNull(),
  file_size: integer('file_size'),
  mime_type: text('mime_type'),
  uploaded_by: text('uploaded_by').notNull().references(() => sipdProfiles.id),
  created_at: text('created_at').notNull().default(sql`(datetime('now'))`),
});

export const sipdProjectHistory = sqliteTable('sipd_project_history', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  project_id: text('project_id').notNull().references(() => sipdProjects.id, { onDelete: 'cascade' }),
  from_status: text('from_status'),
  to_status: text('to_status').notNull(),
  notes: text('notes'),
  actor_id: text('actor_id').notNull().references(() => sipdProfiles.id),
  created_at: text('created_at').notNull().default(sql`(datetime('now'))`),
});

export const sipdNotifications = sqliteTable('sipd_notifications', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  user_id: text('user_id').notNull().references(() => sipdProfiles.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  message: text('message').notNull(),
  // 'info' | 'success' | 'warning' | 'error'
  type: text('type').notNull().default('info'),
  is_read: integer('is_read', { mode: 'boolean' }).notNull().default(false),
  project_id: text('project_id').references(() => sipdProjects.id, { onDelete: 'set null' }),
  created_at: text('created_at').notNull().default(sql`(datetime('now'))`),
});

// ─── Type exports ──────────────────────────────────────────────────────────────
export type PortfolioProfile = typeof protofolioProfiles.$inferSelect;
export type NewPortfolioProfile = typeof protofolioProfiles.$inferInsert;

export type PortfolioExperience = typeof protofolioExperiences.$inferSelect;
export type NewPortfolioExperience = typeof protofolioExperiences.$inferInsert;

export type PortfolioSkill = typeof protofolioSkills.$inferSelect;
export type NewPortfolioSkill = typeof protofolioSkills.$inferInsert;

export type PortfolioProject = typeof protofolioProjects.$inferSelect;
export type NewPortfolioProject = typeof protofolioProjects.$inferInsert;

export type PortfolioEducation = typeof protofolioEducation.$inferSelect;
export type NewPortfolioEducation = typeof protofolioEducation.$inferInsert;

export type PortfolioMessage = typeof protofolioMessages.$inferSelect;
export type NewPortfolioMessage = typeof protofolioMessages.$inferInsert;

export type PortfolioSettings = typeof protofolioSettings.$inferSelect;

export type PortfolioCertificate = typeof protofolioCertificates.$inferSelect;
export type NewPortfolioCertificate = typeof protofolioCertificates.$inferInsert;

export type PortfolioAchievement = typeof protofolioAchievements.$inferSelect;
export type NewPortfolioAchievement = typeof protofolioAchievements.$inferInsert;

export type PortfolioCourse = typeof protofolioCourses.$inferSelect;
export type NewPortfolioCourse = typeof protofolioCourses.$inferInsert;

export type SipdProfile = typeof sipdProfiles.$inferSelect;
export type NewSipdProfile = typeof sipdProfiles.$inferInsert;

export type SipdProject = typeof sipdProjects.$inferSelect;
export type NewSipdProject = typeof sipdProjects.$inferInsert;

export type SipdProjectDocument = typeof sipdProjectDocuments.$inferSelect;
export type NewSipdProjectDocument = typeof sipdProjectDocuments.$inferInsert;

export type SipdProjectHistory = typeof sipdProjectHistory.$inferSelect;
export type NewSipdProjectHistory = typeof sipdProjectHistory.$inferInsert;

export type SipdNotification = typeof sipdNotifications.$inferSelect;
export type NewSipdNotification = typeof sipdNotifications.$inferInsert;
