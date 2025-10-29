-- Fix services table structure
-- This script will add missing columns and rename existing ones

-- First, let's see what columns currently exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'services' 
ORDER BY ordinal_position;

-- Add image_url column if it doesn't exist
ALTER TABLE services ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);

-- Check if we have title_* columns that need to be renamed
DO $$
BEGIN
    -- Rename title_en to name_en if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'title_en') THEN
        ALTER TABLE services RENAME COLUMN title_en TO name_en;
        RAISE NOTICE 'Renamed title_en to name_en';
    END IF;
    
    -- Rename title_ar to name_ar if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'title_ar') THEN
        ALTER TABLE services RENAME COLUMN title_ar TO name_ar;
        RAISE NOTICE 'Renamed title_ar to name_ar';
    END IF;
    
    -- Rename title_ro to name_ro if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'title_ro') THEN
        ALTER TABLE services RENAME COLUMN title_ro TO name_ro;
        RAISE NOTICE 'Renamed title_ro to name_ro';
    END IF;
END $$;

-- Show final table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'services' 
ORDER BY ordinal_position;
