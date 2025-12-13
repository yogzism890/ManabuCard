-- DEBUG SCRIPT: Comprehensive constraint analysis untuk foreign key problem
-- Jalankan ini di database PostgreSQL untuk memahami constraint yang menyebabkan masalah

-- 1. Lihat semua foreign key constraints yang melibatkan tabel Koleksi
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    tc.constraint_type
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND (tc.table_name = 'Koleksi' OR ccu.table_name = 'Koleksi');

-- 2. Lihat semua triggers pada tabel Koleksi
SELECT 
    trigger_name,
    event_manipulation,
    action_statement,
    action_timing
FROM information_schema.triggers
WHERE event_object_table = 'Koleksi';

-- 3. Cek semua constraint yang ada pada tabel Koleksi
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    tc.table_name
FROM information_schema.table_constraints tc
WHERE tc.table_name = 'Koleksi';

-- 4. Cek apakah ada foreign key constraint pada tabel Kartu yang mengarah ke Koleksi
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'Kartu'
    AND ccu.table_name = 'Koleksi';

-- 5. Cek data yang bermasalah (jika ada)
SELECT 'Kartu' as table_name, COUNT(*) as count FROM "Kartu"
UNION ALL
SELECT 'Koleksi' as table_name, COUNT(*) as count FROM "Koleksi"
UNION ALL
SELECT 'User' as table_name, COUNT(*) as count FROM "User";

-- 6. Cek kartu yang tidak memiliki koleksi valid
SELECT id, front, "koleksiId", isDeleted
FROM "Kartu" 
WHERE "koleksiId" IS NOT NULL 
    AND "koleksiId" NOT IN (SELECT id FROM "Koleksi");

-- 7. Manual cleanup command (jika diperlukan)
-- WARNING: Backup database terlebih dahulu!
-- DELETE FROM "Kartu" WHERE "koleksiId" = 'COLLECTION_ID_TO_DELETE';
-- DELETE FROM "Koleksi" WHERE id = 'COLLECTION_ID_TO_DELETE';

