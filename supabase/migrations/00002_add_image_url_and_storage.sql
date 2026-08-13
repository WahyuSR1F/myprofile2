-- Add image_url to achievements and courses
ALTER TABLE protofolio_achievements ADD COLUMN image_url TEXT;
ALTER TABLE protofolio_courses ADD COLUMN image_url TEXT;

-- Create storage bucket for portfolio images
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-images', 'portfolio-images', true);

-- Storage RLS: public read, admin write
CREATE POLICY "Public read portfolio-images" ON storage.objects FOR SELECT USING (true);
CREATE POLICY "Admin insert portfolio-images" ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update portfolio-images" ON storage.objects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete portfolio-images" ON storage.objects FOR DELETE USING (auth.role() = 'authenticated');
