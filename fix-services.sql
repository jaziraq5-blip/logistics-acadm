-- Fix services table to match the code expectations
-- This will resolve the "Failed to add service" error

-- First, let's see what we have
SELECT 'Current services table structure:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'services' 
ORDER BY ordinal_position;

-- Add image_url column if it doesn't exist
ALTER TABLE services ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);

-- Rename title_* columns to name_* if they exist
DO $$
BEGIN
    -- Check if title_en exists and rename to name_en
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'title_en') THEN
        ALTER TABLE services RENAME COLUMN title_en TO name_en;
        RAISE NOTICE 'Renamed title_en to name_en';
    END IF;
    
    -- Check if title_ar exists and rename to name_ar
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'title_ar') THEN
        ALTER TABLE services RENAME COLUMN title_ar TO name_ar;
        RAISE NOTICE 'Renamed title_ar to name_ar';
    END IF;
    
    -- Check if title_ro exists and rename to name_ro
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'title_ro') THEN
        ALTER TABLE services RENAME COLUMN title_ro TO name_ro;
        RAISE NOTICE 'Renamed title_ro to name_ro';
    END IF;
END $$;

-- Show final structure
SELECT 'Final services table structure:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'services' 
ORDER BY ordinal_position;

-- Test inserting a service to make sure it works
INSERT INTO services (name_en, name_ar, name_ro, description_en, description_ar, description_ro, icon, image_url, features, is_active, sort_order) 
VALUES (
    'Test Service',
    'خدمة تجريبية', 
    'Serviciu Test',
    'Test description',
    'وصف تجريبي',
    'Descriere test',
    'Ship',
    '/uploads/test.jpg',
    '[]',
    true,
    0
);

-- Delete the test service
DELETE FROM services WHERE name_en = 'Test Service';

SELECT 'Services table fixed successfully!' as result;
