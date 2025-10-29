-- Add image_url column to services table (sanitized)
ALTER TABLE services ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);

-- Update existing services with default image URLs
-- Use uploads path so admin-uploaded images (public/uploads) can be referenced
UPDATE services SET image_url = '/uploads/sea-freight.jpg' WHERE name_en = 'Sea Freight';
UPDATE services SET image_url = '/uploads/air-freight.jpg' WHERE name_en = 'Air Freight';
UPDATE services SET image_url = '/uploads/land-transport.jpg' WHERE name_en = 'Land Transport';
UPDATE services SET image_url = '/uploads/customs-clearance.jpg' WHERE name_en = 'Customs Clearance';
UPDATE services SET image_url = '/uploads/import-export.jpg' WHERE name_en = 'Import & Export';
UPDATE services SET image_url = '/uploads/warehousing.jpg' WHERE name_en = 'Warehousing & Distribution';
