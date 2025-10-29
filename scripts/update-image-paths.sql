-- Update image paths from /images/ to /uploads/
UPDATE services 
SET image_url = REPLACE(image_url, '/images/', '/uploads/') 
WHERE image_url LIKE '/images/%';

-- Update image paths without leading slash
UPDATE services 
SET image_url = REPLACE(image_url, 'images/', 'uploads/') 
WHERE image_url LIKE 'images/%';

-- Show updated records
SELECT id, name_en, image_url FROM services WHERE image_url LIKE '%/uploads/%';