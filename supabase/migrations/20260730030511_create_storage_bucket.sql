
/*
# Create storage bucket for project documents

1. Storage
- Create public bucket `project-docs` for uploaded documents
2. Security
- Public read for documents (URLs are public)
- Authenticated users can upload to their own folder
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('project-docs', 'project-docs', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "project_docs_read" ON storage.objects;
CREATE POLICY "project_docs_read" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'project-docs');

DROP POLICY IF EXISTS "project_docs_insert" ON storage.objects;
CREATE POLICY "project_docs_insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'project-docs' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "project_docs_delete" ON storage.objects;
CREATE POLICY "project_docs_delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'project-docs' AND (storage.foldername(name))[1] = auth.uid()::text);
