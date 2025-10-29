-- Quick fix for services table to match the code expectations
-- This will make services work exactly like certificates

-- First, let's see what we have
SELECT 'Current table structure:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'services' 
ORDER BY ordinal_position;

-- Add image_url column if it doesn't exist
ALTER TABLE services ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);

-- If we have title_* columns, rename them to name_*
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'title_en') THEN
        ALTER TABLE services RENAME COLUMN title_en TO name_en;
        RAISE NOTICE 'Renamed title_en to name_en';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'title_ar') THEN
        ALTER TABLE services RENAME COLUMN title_ar TO name_ar;
        RAISE NOTICE 'Renamed title_ar to name_ar';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'title_ro') THEN
        ALTER TABLE services RENAME COLUMN title_ro TO name_ro;
        RAISE NOTICE 'Renamed title_ro to name_ro';
    END IF;
END $$;

-- Show final structure
SELECT 'Final table structure:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'services' 
ORDER BY ordinal_position;
