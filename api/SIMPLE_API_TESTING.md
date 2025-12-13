# 🎯 API Testing Guide - ManabuCard

## 🚀 Authentication Yang Super Mudah!

**TIDAK ADA TOKEN KOMPLEKS!** Sistem ini menggunakan authentication yang sangat sederhana.

## 🔧 Setup untuk Testing

### 1. **Gunakan Default User**
Untuk testing, gunakan header ini di semua request:

```http
Authorization: Bearer 550e8400-e29b-41d4-a716-446655440000:test@manabucard.com
```

**Format**: `Bearer [USER_ID]:[EMAIL]`

### 2. **Test di APIDoc/Postman**
- Copy-paste header di atas ke Authorization header
- Semua endpoint akan bekerja otomatis!

## 📋 Endpoint yang Tersedia

### **Koleksi (Collections)**

#### 1. **GET /api/koleksi**
Ambil semua koleksi user
```http
GET /api/koleksi
Authorization: Bearer 550e8400-e29b-41d4-a716-446655440000:test@manabucard.com
```

#### 2. **POST /api/koleksi** 
Buat koleksi baru
```http
POST /api/koleksi
Authorization: Bearer 550e8400-e29b-41d4-a716-446655440000:test@manabucard.com
Content-Type: application/json

{
  "nama": "Koleksi Bahasa Inggris",
  "deskripsi": "Kartu untuk belajar vocabulary"
}
```

#### 3. **GET /api/koleksi/[id]**
Detail koleksi spesifik
```http
GET /api/koleksi/123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer 550e8400-e29b-41d4-a716-446655440000:test@manabucard.com
```

#### 4. **PUT /api/koleksi/[id]**
Update koleksi
```http
PUT /api/koleksi/123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer 550e8400-e29b-41d4-a716-446655440000:test@manabucard.com
Content-Type: application/json

{
  "nama": "Koleksi Bahasa Inggris - Updated",
  "deskripsi": "Deskripsi baru"
}
```

#### 5. **DELETE /api/koleksi/[id]**
Hapus koleksi
```http
DELETE /api/koleksi/123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer 550e8400-e29b-41d4-a716-446655440000:test@manabucard.com
```

### **Kartu (Cards)**

#### 6. **GET /api/kartu**
Ambil semua kartu (optional filter by koleksi)
```http
GET /api/kartu
Authorization: Bearer 550e8400-e29b-41d4-a716-446655440000:test@manabucard.com

# Atau dengan filter koleksi
GET /api/kartu?koleksiId=123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer 550e8400-e29b-41d4-a716-446655440000:test@manabucard.com
```

#### 7. **POST /api/kartu**
Buat kartu baru
```http
POST /api/kartu
Authorization: Bearer 550e8400-e29b-41d4-a716-446655440000:test@manabucard.com
Content-Type: application/json

{
  "koleksiId": "123e4567-e89b-12d3-a456-426614174000",
  "front": "Hello",
  "back": "Halo"
}
```

#### 8. **GET /api/koleksi/[id]/kartu**
Ambil kartu dalam koleksi tertentu
```http
GET /api/koleksi/123e4567-e89b-12d3-a456-426614174000/kartu
Authorization: Bearer 550e8400-e29b-41d4-a716-446655440000:test@manabucard.com
```

#### 9. **PATCH /api/kartu/[id]**
Update SRS (Spaced Repetition System)
```http
PATCH /api/kartu/123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer 550e8400-e29b-41d4-a716-446655440000:test@manabucard.com
Content-Type: application/json

{
  "newDifficulty": 2,
  "newReviewDueAt": "2024-12-10T10:00:00Z"
}
```

#### 10. **DELETE /api/kartu/[id]**
Hapus kartu (soft delete)
```http
DELETE /api/kartu/123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer 550e8400-e29b-41d4-a716-446655440000:test@manabucard.com
```

## 🎯 Flow Testing Lengkap

### **Step 1: Buat Koleksi**
```bash
# Buat koleksi pertama
curl -X POST http://localhost:3000/api/koleksi \
  -H "Authorization: Bearer 550e8400-e29b-41d4-a716-446655440000:test@manabucard.com" \
  -H "Content-Type: application/json" \
  -d '{"nama":"Vocab Bahasa Inggris","deskripsi":"Kartu untuk vocabulary"}'
```

### **Step 2: Lihat Semua Koleksi**
```bash
curl -X GET http://localhost:3000/api/koleksi \
  -H "Authorization: Bearer 550e8400-e29b-41d4-a716-446655440000:test@manabucard.com"
```

### **Step 3: Buat Kartu**
```bash
# Buat beberapa kartu
curl -X POST http://localhost:3000/api/kartu \
  -H "Authorization: Bearer 550e8400-e29b-41d4-a716-446655440000:test@manabucard.com" \
  -H "Content-Type: application/json" \
  -d '{"koleksiId":"[ID_KOLEKSI_DARI_STEP_1]","front":"Hello","back":"Halo"}'

curl -X POST http://localhost:3000/api/kartu \
  -H "Authorization: Bearer 550e8400-e29b-41d4-a716-446655440000:test@manabucard.com" \
  -H "Content-Type: application/json" \
  -d '{"koleksiId":"[ID_KOLEKSI_DARI_STEP_1]","front":"Thank you","back":"Terima kasih"}'
```

### **Step 4: Lihat Kartu dalam Koleksi**
```bash
curl -X GET http://localhost:3000/api/koleksi/[ID_KOLEKSI]/kartu \
  -H "Authorization: Bearer 550e8400-e29b-41d4-a716-446655440000:test@manabucard.com"
```

### **Step 5: Update SRS Kartu**
```bash
curl -X PATCH http://localhost:3000/api/kartu/[ID_KARTU] \
  -H "Authorization: Bearer 550e8400-e29b-41d4-a716-446655440000:test@manabucard.com" \
  -H "Content-Type: application/json" \
  -d '{"newDifficulty":3,"newReviewDueAt":"2024-12-15T10:00:00Z"}'
```

## 🔍 Response Format

### **Success Response**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Vocab Bahasa Inggris",
  "cardCount": 5,
  "dueToday": 2,
  "createdAt": "2024-12-08T10:00:00.000Z"
}
```

### **Error Response**
```json
{
  "error": "FORBIDDEN: Koleksi tidak ditemukan atau bukan milik user ini."
}
```

## ⚡ Tips Testing

1. **Copy-Paste Header**: Gunakan header yang sama untuk semua request
2. **Check ID**: Pastikan ID koleksi/kartu valid
3. **Due Today**: Fungsi `dueToday` menghitung kartu yang harus diulang hari ini
4. **Soft Delete**: Kartu yang dihapus tidak benar-benar hilang, hanya di-mark

## 🎉 Enjoy Testing!
Dengan authentication sederhana ini, testing di APIDoc menjadi sangat mudah!
