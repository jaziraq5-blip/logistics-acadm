-- Migration script to update services table
-- This script renames columns and adds image_url column

-- First, add the image_url column
ALTER TABLE services ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);

-- Rename columns from title_* to name_*
ALTER TABLE services RENAME COLUMN title_en TO name_en;
ALTER TABLE services RENAME COLUMN title_ar TO name_ar;
ALTER TABLE services RENAME COLUMN title_ro TO name_ro;

-- Update existing services with default image URLs
-- Use uploads path so admin-uploaded images (public/uploads) can be referenced
UPDATE services SET image_url = '/uploads/sea-freight.jpg' WHERE name_en = 'Sea Freight';
UPDATE services SET image_url = '/uploads/air-freight.jpg' WHERE name_en = 'Air Freight';
UPDATE services SET image_url = '/uploads/land-transport.jpg' WHERE name_en = 'Land Transport';
UPDATE services SET image_url = '/uploads/customs-clearance.jpg' WHERE name_en = 'Customs Clearance';
UPDATE services SET image_url = '/uploads/import-export.jpg' WHERE name_en = 'Import & Export';
UPDATE services SET image_url = '/uploads/warehousing.jpg' WHERE name_en = 'Warehousing & Distribution';

-- Show the updated table structure
\d services;
