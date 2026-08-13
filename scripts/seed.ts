/**
 * Seed script dengan data contoh lengkap untuk semua tabel
 * Jalankan: npm run db:seed
 */

import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../lib/db/schema';
import path from 'path';

const dbPath = path.join(process.cwd(), 'local.db').replace(/\\/g, '/');
const client = createClient({ url: `file:${dbPath}` });
const db = drizzle(client, { schema });

async function seed() {
  console.log('🌱 Seeding database dengan data contoh...\n');

  // ════════════════════════════════════════════════════════
  // PORTFOLIO TABLES
  // ════════════════════════════════════════════════════════

  // ── 1. Settings ────────────────────────────────────────
  await db.delete(schema.protofolioSettings);
  await db.insert(schema.protofolioSettings).values([
    { key: 'show_about',        value: 'true' },
    { key: 'show_experiences',  value: 'true' },
    { key: 'show_skills',       value: 'true' },
    { key: 'show_projects',     value: 'true' },
    { key: 'show_education',    value: 'true' },
    { key: 'show_contact',      value: 'true' },
    { key: 'show_certificates', value: 'true' },
    { key: 'show_achievements', value: 'true' },
    { key: 'show_courses',      value: 'true' },
  ]);
  console.log('✅ protofolio_settings   — 9 rows');

  // ── 2. Profiles ────────────────────────────────────────
  await db.delete(schema.protofolioProfiles);
  await db.insert(schema.protofolioProfiles).values({
    name:               'Budi Santoso',
    title:              'Full Stack Developer',
    tagline:            'Membangun solusi digital yang berdampak',
    bio:                'Saya adalah seorang Full Stack Developer dengan 5 tahun pengalaman membangun aplikasi web modern. Passionate tentang clean code, UX, dan teknologi terbaru.',
    photo_url:          '/images/profile/photo.jpg',
    email:              'budi.santoso@email.com',
    phone:              '+62 812-3456-7890',
    location:           'Jakarta, Indonesia',
    website:            'https://budisantoso.dev',
    linkedin_url:       'https://linkedin.com/in/budisantoso',
    github_url:         'https://github.com/budisantoso',
    twitter_url:        'https://twitter.com/budisantoso',
    instagram_url:      'https://instagram.com/budisantoso',
    cv_url:             '/files/cv-budi-santoso.pdf',
    available_for_work: true,
  });
  console.log('✅ protofolio_profiles   — 1 row');

  // ── 3. Experiences ─────────────────────────────────────
  await db.delete(schema.protofolioExperiences);
  await db.insert(schema.protofolioExperiences).values([
    {
      company:      'PT Teknologi Nusantara',
      position:     'Senior Full Stack Developer',
      start_date:   '2022-01',
      end_date:     null,
      current:      true,
      description:  'Memimpin tim pengembangan aplikasi enterprise menggunakan Next.js, Node.js, dan PostgreSQL. Bertanggung jawab atas arsitektur sistem dan code review.',
      achievements: JSON.stringify([
        'Meningkatkan performa aplikasi sebesar 40% dengan optimasi query dan caching',
        'Memimpin migrasi dari monolith ke microservices',
        'Merekrut dan melatih 3 junior developer',
      ]),
      location:    'Jakarta, Indonesia',
      sort_order:  1,
    },
    {
      company:      'Startup Digital Indonesia',
      position:     'Full Stack Developer',
      start_date:   '2020-03',
      end_date:     '2021-12',
      current:      false,
      description:  'Membangun fitur-fitur baru untuk platform e-commerce dengan lebih dari 50.000 pengguna aktif. Stack: React, Express.js, MySQL.',
      achievements: JSON.stringify([
        'Mengembangkan fitur payment gateway yang digunakan 10.000+ transaksi/bulan',
        'Mengurangi bug production sebesar 60% dengan penerapan unit testing',
      ]),
      location:    'Bandung, Indonesia',
      sort_order:  2,
    },
    {
      company:      'CV Solusi Web',
      position:     'Junior Web Developer',
      start_date:   '2018-06',
      end_date:     '2020-02',
      current:      false,
      description:  'Mengembangkan website dan landing page untuk klien dari berbagai industri menggunakan WordPress, HTML/CSS, dan JavaScript.',
      achievements: JSON.stringify([
        'Menyelesaikan 30+ proyek website klien',
        'Mempelajari React dan Node.js secara mandiri',
      ]),
      location:    'Yogyakarta, Indonesia',
      sort_order:  3,
    },
  ]);
  console.log('✅ protofolio_experiences — 3 rows');

  // ── 4. Skills ──────────────────────────────────────────
  await db.delete(schema.protofolioSkills);
  await db.insert(schema.protofolioSkills).values([
    { name: 'TypeScript',    category: 'Programming Language', proficiency: 90, sort_order: 1 },
    { name: 'JavaScript',   category: 'Programming Language', proficiency: 95, sort_order: 2 },
    { name: 'Python',       category: 'Programming Language', proficiency: 70, sort_order: 3 },
    { name: 'React',        category: 'Frontend',             proficiency: 90, sort_order: 4 },
    { name: 'Next.js',      category: 'Frontend',             proficiency: 88, sort_order: 5 },
    { name: 'Tailwind CSS', category: 'Frontend',             proficiency: 85, sort_order: 6 },
    { name: 'Node.js',      category: 'Backend',              proficiency: 85, sort_order: 7 },
    { name: 'Express.js',   category: 'Backend',              proficiency: 80, sort_order: 8 },
    { name: 'PostgreSQL',   category: 'Database',             proficiency: 80, sort_order: 9 },
    { name: 'SQLite',       category: 'Database',             proficiency: 75, sort_order: 10 },
    { name: 'Docker',       category: 'DevOps',               proficiency: 70, sort_order: 11 },
    { name: 'Git',          category: 'DevOps',               proficiency: 90, sort_order: 12 },
  ]);
  console.log('✅ protofolio_skills     — 12 rows');

  // ── 5. Projects ────────────────────────────────────────
  await db.delete(schema.protofolioProjects);
  await db.insert(schema.protofolioProjects).values([
    {
      title:            'SiKerja — HR Management System',
      description:      'Sistem manajemen SDM terintegrasi untuk perusahaan menengah ke atas.',
      long_description: 'Platform HR lengkap dengan fitur absensi, penggajian, cuti, evaluasi kinerja, dan rekrutmen. Digunakan oleh 15 perusahaan dengan total 2.000+ karyawan.',
      image_url:        '/images/proyek/sikerja.jpg',
      tech_stack:       JSON.stringify(['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Tailwind CSS']),
      project_url:      'https://sikerja.example.com',
      github_url:       'https://github.com/budisantoso/sikerja',
      featured:         true,
      sort_order:       1,
    },
    {
      title:            'TokoKu — Platform E-Commerce',
      description:      'Platform belanja online dengan fitur lengkap untuk UMKM.',
      long_description: 'Marketplace yang memungkinkan UMKM berjualan online dengan mudah. Fitur: manajemen produk, keranjang belanja, payment gateway, dan laporan penjualan.',
      image_url:        '/images/proyek/tokoku.jpg',
      tech_stack:       JSON.stringify(['React', 'Node.js', 'Express', 'MySQL', 'Redux']),
      project_url:      'https://tokoku.example.com',
      github_url:       'https://github.com/budisantoso/tokoku',
      featured:         true,
      sort_order:       2,
    },
    {
      title:            'CatatanKu — Note Taking App',
      description:      'Aplikasi catatan pintar dengan AI summarization.',
      long_description: 'Aplikasi pencatat berbasis web dengan fitur markdown, tagging, pencarian fulltext, dan ringkasan otomatis menggunakan OpenAI API.',
      image_url:        '/images/proyek/catatanku.jpg',
      tech_stack:       JSON.stringify(['Next.js', 'SQLite', 'OpenAI API', 'Tailwind CSS']),
      project_url:      'https://catatanku.example.com',
      github_url:       'https://github.com/budisantoso/catatanku',
      featured:         false,
      sort_order:       3,
    },
  ]);
  console.log('✅ protofolio_projects   — 3 rows');

  // ── 6. Education ───────────────────────────────────────
  await db.delete(schema.protofolioEducation);
  await db.insert(schema.protofolioEducation).values([
    {
      institution: 'Universitas Indonesia',
      degree:      'Sarjana (S1)',
      field:       'Teknik Informatika',
      start_date:  '2014',
      end_date:    '2018',
      description: 'IPK 3.72 / 4.00. Aktif di UKM Programming dan menjabat sebagai Ketua Himpunan Mahasiswa Informatika periode 2016-2017.',
      sort_order:  1,
    },
    {
      institution: 'SMAN 1 Jakarta',
      degree:      'SMA',
      field:       'IPA',
      start_date:  '2011',
      end_date:    '2014',
      description: 'Juara 1 Olimpiade Komputer tingkat Provinsi DKI Jakarta tahun 2013.',
      sort_order:  2,
    },
  ]);
  console.log('✅ protofolio_education  — 2 rows');

  // ── 7. Certificates ────────────────────────────────────
  await db.delete(schema.protofolioCertificates);
  await db.insert(schema.protofolioCertificates).values([
    {
      title:     'AWS Certified Developer – Associate',
      issuer:    'Amazon Web Services',
      date:      '2023-08',
      url:       'https://aws.amazon.com/certification',
      image_url: '/images/certicate/aws-dev.jpg',
      sort_order: 1,
    },
    {
      title:     'Professional Scrum Master I (PSM I)',
      issuer:    'Scrum.org',
      date:      '2022-11',
      url:       'https://scrum.org/certificates',
      image_url: '/images/certicate/psm1.jpg',
      sort_order: 2,
    },
    {
      title:     'Meta Front-End Developer Certificate',
      issuer:    'Meta (Coursera)',
      date:      '2022-03',
      url:       'https://coursera.org/verify/abc123',
      image_url: '/images/certicate/meta-frontend.jpg',
      sort_order: 3,
    },
  ]);
  console.log('✅ protofolio_certificates — 3 rows');

  // ── 8. Achievements ────────────────────────────────────
  await db.delete(schema.protofolioAchievements);
  await db.insert(schema.protofolioAchievements).values([
    {
      title:       'Juara 1 Hackathon GovTech 2023',
      description: 'Memenangkan kompetisi hackathon nasional untuk solusi teknologi pemerintahan dengan aplikasi SIPD berbasis AI.',
      date:        '2023-11',
      icon:        '🏆',
      sort_order:  1,
    },
    {
      title:       'Speaker di JSConf Indonesia 2023',
      description: 'Menjadi pembicara di konferensi JavaScript Indonesia dengan topik "Optimasi Performa Next.js untuk Skala Enterprise".',
      date:        '2023-09',
      icon:        '🎤',
      sort_order:  2,
    },
    {
      title:       'Open Source Contributor — 500+ Stars',
      description: 'Library open source react-form-wizard yang saya buat mendapatkan 500+ bintang di GitHub.',
      date:        '2022-07',
      icon:        '⭐',
      sort_order:  3,
    },
  ]);
  console.log('✅ protofolio_achievements — 3 rows');

  // ── 9. Courses ─────────────────────────────────────────
  await db.delete(schema.protofolioCourses);
  await db.insert(schema.protofolioCourses).values([
    {
      name:      'The Complete Node.js Developer Course',
      provider:  'Udemy (Andrew Mead)',
      date:      '2021-05',
      url:       'https://udemy.com/course/the-complete-nodejs-developer-course',
      sort_order: 1,
    },
    {
      name:      'CS50x: Introduction to Computer Science',
      provider:  'Harvard (edX)',
      date:      '2020-12',
      url:       'https://cs50.harvard.edu/x',
      sort_order: 2,
    },
    {
      name:      'Full Stack Open',
      provider:  'University of Helsinki',
      date:      '2021-08',
      url:       'https://fullstackopen.com',
      sort_order: 3,
    },
  ]);
  console.log('✅ protofolio_courses    — 3 rows');

  // ── 10. Messages ───────────────────────────────────────
  await db.delete(schema.protofolioMessages);
  await db.insert(schema.protofolioMessages).values([
    {
      name:    'Andi Wijaya',
      email:   'andi.wijaya@company.co.id',
      subject: 'Tawaran Kerjasama Project',
      message: 'Halo Budi, saya tertarik untuk mengajak kerjasama dalam pengembangan aplikasi internal perusahaan kami. Apakah Anda available untuk project jangka panjang?',
      is_read: false,
    },
    {
      name:    'Siti Rahayu',
      email:   'siti.rahayu@startup.id',
      subject: 'Konsultasi Teknologi',
      message: 'Selamat siang, saya ingin berkonsultasi mengenai pilihan tech stack untuk startup kami yang akan launch tahun ini. Bisa dijadwalkan meeting?',
      is_read: true,
    },
    {
      name:    'Reza Firmansyah',
      email:   'reza@freelance.com',
      subject: 'Kolaborasi Proyek Open Source',
      message: 'Hi! Saya lihat project react-form-wizard kamu di GitHub dan sangat tertarik untuk berkontribusi. Ada yang bisa saya bantu?',
      is_read: false,
    },
  ]);
  console.log('✅ protofolio_messages   — 3 rows');

  // ════════════════════════════════════════════════════════
  // SIPD TABLES
  // ════════════════════════════════════════════════════════

  // ── 11. SIPD Profiles ──────────────────────────────────
  await db.delete(schema.sipdNotifications);
  await db.delete(schema.sipdProjectHistory);
  await db.delete(schema.sipdProjectDocuments);
  await db.delete(schema.sipdProjects);
  await db.delete(schema.sipdProfiles);

  const [admin, pemohon1, pemohon2, penilai] = await db
    .insert(schema.sipdProfiles)
    .values([
      {
        name:          'Administrator',
        email:         'admin@sipd.local',
        role:          'admin',
        company:       'Dinas Komunikasi dan Informatika',
        phone:         '021-1234567',
        password_hash: 'CHANGE_ME_USE_BCRYPT',
      },
      {
        name:          'PT Maju Bersama',
        email:         'pt.majubersama@email.com',
        role:          'pemohon',
        company:       'PT Maju Bersama',
        phone:         '+62 811-222-3333',
        password_hash: 'CHANGE_ME_USE_BCRYPT',
      },
      {
        name:          'CV Karya Mandiri',
        email:         'cv.karyamandiri@email.com',
        role:          'pemohon',
        company:       'CV Karya Mandiri',
        phone:         '+62 822-444-5555',
        password_hash: 'CHANGE_ME_USE_BCRYPT',
      },
      {
        name:          'Ir. Budi Setiawan, M.T.',
        email:         'budi.setiawan@dinas.go.id',
        role:          'penilai',
        company:       'Dinas Pekerjaan Umum',
        phone:         '021-9876543',
        password_hash: 'CHANGE_ME_USE_BCRYPT',
      },
    ])
    .returning();
  console.log('✅ sipd_profiles         — 4 rows');

  // ── 12. SIPD Projects ──────────────────────────────────
  const [proj1, proj2, proj3] = await db
    .insert(schema.sipdProjects)
    .values([
      {
        code:         'PRJ-2026-00001',
        title:        'Permohonan Izin Pembangunan Gedung Kantor',
        description:  'Permohonan izin mendirikan bangunan untuk gedung kantor 5 lantai di Jl. Sudirman No. 45, Jakarta Pusat.',
        status:       'under_review',
        user_id:      pemohon1.id,
        assigned_to:  penilai.id,
        review_notes: 'Dokumen lengkap, sedang dalam proses review teknis.',
        submitted_at: new Date('2026-07-15').toISOString(),
      },
      {
        code:         'PRJ-2026-00002',
        title:        'Permohonan Sertifikasi Produk Elektronik',
        description:  'Pengajuan sertifikasi untuk produk power bank model XB-2000 sesuai standar SNI.',
        status:       'submitted',
        user_id:      pemohon2.id,
        assigned_to:  null,
        submitted_at: new Date('2026-08-01').toISOString(),
      },
      {
        code:         'PRJ-2026-00003',
        title:        'Permohonan Izin Usaha Perdagangan',
        description:  'Pengajuan Surat Izin Usaha Perdagangan (SIUP) untuk kegiatan distribusi bahan bangunan.',
        status:       'approved',
        user_id:      pemohon1.id,
        assigned_to:  penilai.id,
        review_notes: 'Semua persyaratan terpenuhi. Disetujui.',
        submitted_at: new Date('2026-06-10').toISOString(),
        reviewed_at:  new Date('2026-06-25').toISOString(),
      },
    ])
    .returning();
  console.log('✅ sipd_projects         — 3 rows');

  // ── 13. SIPD Project Documents ─────────────────────────
  await db.insert(schema.sipdProjectDocuments).values([
    {
      project_id:  proj1.id,
      name:        'KTP Penanggung Jawab',
      file_url:    '/uploads/sipd/proj1/ktp-penanggung-jawab.pdf',
      file_size:   512000,
      mime_type:   'application/pdf',
      uploaded_by: pemohon1.id,
    },
    {
      project_id:  proj1.id,
      name:        'Gambar Rencana Bangunan',
      file_url:    '/uploads/sipd/proj1/gambar-rencana.pdf',
      file_size:   2048000,
      mime_type:   'application/pdf',
      uploaded_by: pemohon1.id,
    },
    {
      project_id:  proj2.id,
      name:        'Spesifikasi Teknis Produk',
      file_url:    '/uploads/sipd/proj2/spesifikasi-teknis.pdf',
      file_size:   768000,
      mime_type:   'application/pdf',
      uploaded_by: pemohon2.id,
    },
    {
      project_id:  proj3.id,
      name:        'Akta Pendirian Perusahaan',
      file_url:    '/uploads/sipd/proj3/akta-pendirian.pdf',
      file_size:   1024000,
      mime_type:   'application/pdf',
      uploaded_by: pemohon1.id,
    },
  ]);
  console.log('✅ sipd_project_documents — 4 rows');

  // ── 14. SIPD Project History ───────────────────────────
  await db.insert(schema.sipdProjectHistory).values([
    {
      project_id:  proj1.id,
      from_status: null,
      to_status:   'draft',
      notes:       'Permohonan dibuat',
      actor_id:    pemohon1.id,
    },
    {
      project_id:  proj1.id,
      from_status: 'draft',
      to_status:   'submitted',
      notes:       'Dokumen lengkap, permohonan diajukan',
      actor_id:    pemohon1.id,
    },
    {
      project_id:  proj1.id,
      from_status: 'submitted',
      to_status:   'admin_verification',
      notes:       'Diterima admin, verifikasi kelengkapan berkas',
      actor_id:    admin.id,
    },
    {
      project_id:  proj1.id,
      from_status: 'admin_verification',
      to_status:   'under_review',
      notes:       'Berkas lengkap, diteruskan ke penilai teknis',
      actor_id:    admin.id,
    },
    {
      project_id:  proj3.id,
      from_status: 'submitted',
      to_status:   'approved',
      notes:       'Semua persyaratan terpenuhi. SIUP disetujui.',
      actor_id:    penilai.id,
    },
  ]);
  console.log('✅ sipd_project_history  — 5 rows');

  // ── 15. SIPD Notifications ─────────────────────────────
  await db.insert(schema.sipdNotifications).values([
    {
      user_id:    pemohon1.id,
      title:      'Permohonan Sedang Direview',
      message:    'Permohonan PRJ-2026-00001 Anda sedang dalam proses review teknis oleh penilai.',
      type:       'info',
      is_read:    false,
      project_id: proj1.id,
    },
    {
      user_id:    penilai.id,
      title:      'Permohonan Baru Ditugaskan',
      message:    'Anda ditugaskan untuk mereview permohonan PRJ-2026-00001 dari PT Maju Bersama.',
      type:       'info',
      is_read:    false,
      project_id: proj1.id,
    },
    {
      user_id:    pemohon1.id,
      title:      'Permohonan Disetujui! 🎉',
      message:    'Selamat! Permohonan SIUP PRJ-2026-00003 Anda telah disetujui. Silakan unduh dokumen izin.',
      type:       'success',
      is_read:    true,
      project_id: proj3.id,
    },
    {
      user_id:    pemohon2.id,
      title:      'Permohonan Diterima',
      message:    'Permohonan PRJ-2026-00002 Anda telah diterima dan menunggu penugasan penilai.',
      type:       'info',
      is_read:    false,
      project_id: proj2.id,
    },
  ]);
  console.log('✅ sipd_notifications    — 4 rows');

  console.log('\n🎉 Seed selesai! Semua tabel berhasil diisi dengan data contoh.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
