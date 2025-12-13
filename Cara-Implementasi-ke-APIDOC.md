# Testing API dengan Postman - TODO List

## 🚀 Setup Awal

### 1. Persiapan Environment
- [ ] Install dan jalankan API server
  ```bash
  cd api
  npm install
  npm run dev
  ```
- [ ] Generate test token
  ```bash
  node generate-test-token.js
  ```
- [ ] Copy token yang dihasilkan untuk digunakan di Postman

### 2. Setup Postman Environment
- [ ] Buat Environment baru "ManabuCard API"
- [ ] Tambahkan Variable:
  - `baseUrl`: `http://localhost:3000/api`
  - `authToken`: (paste token dari generate-test-token.js)
  - `collectionId`: (kosongkan dulu, akan diisi setelah create collection)
  - `cardId`: (kosongkan dulu, akan diisi setelah create card)

---

## 🔐 Authentication Testing

### 3. Test Login Endpoint
- [ ] **POST** `{{baseUrl}}/login`
- [ ] Headers: `Content-Type: application/json`
- [ ] Body (raw JSON):
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- [ ] **Expected**: 200 OK dengan token
- [ ] **Update Environment**: Set `authToken` dengan token yang diterima

### 4. Test Register Endpoint  
- [ ] **POST** `{{baseUrl}}/register`
- [ ] Headers: `Content-Type: application/json`
- [ ] Body (raw JSON):
  ```json
  {
    "email": "newuser@example.com",
    "password": "password123",
    "name": "Test User"
  }
  ```
- [ ] **Expected**: 201 Created atau 200 OK

---

## 📚 Collection Testing

### 5. Test Get All Collections
- [ ] **GET** `{{baseUrl}}/koleksi`
- [ ] Headers: `Authorization: Bearer {{authToken}}`
- [ ] **Expected**: 200 OK dengan array collections
- [ ] **Verify**: Response contains id, name, cardCount, dueToday

### 6. Test Create Collection
- [ ] **POST** `{{baseUrl}}/koleksi`
- [ ] Headers: 
  - `Authorization: Bearer {{authToken}}`
  - `Content-Type: application/json`
- [ ] Body (raw JSON):
  ```json
  {
    "nama": "Test Koleksi Postman",
    "deskripsi": "Koleksi untuk testing via Postman"
  }
  ```
- [ ] **Expected**: 201 Created
- [ ] **Update Environment**: Set `collectionId` dengan id dari response

### 7. Test Get Collection by ID
- [ ] **GET** `{{baseUrl}}/koleksi/{{collectionId}}`
- [ ] Headers: `Authorization: Bearer {{authToken}}`
- [ ] **Expected**: 200 OK dengan detail collection

### 8. Test Update Collection
- [ ] **PUT** `{{baseUrl}}/koleksi/{{collectionId}}`
- [ ] Headers:
  - `Authorization: Bearer {{authToken}}`
  - `Content-Type: application/json`
- [ ] Body (raw JSON):
  ```json
  {
    "nama": "Updated Test Koleksi",
    "deskripsi": "Deskripsi sudah diupdate"
  }
  ```
- [ ] **Expected**: 200 OK

---

## 🃏 Card Testing

### 9. Test Create Card
- [ ] **POST** `{{baseUrl}}/kartu`
- [ ] Headers:
  - `Authorization: Bearer {{authToken}}`
  - `Content-Type: application/json`
- [ ] Body (raw JSON):
  ```json
  {
    "koleksiId": "{{collectionId}}",
    "front": "Apa ibukota Indonesia?",
    "back": "Jakarta"
  }
  ```
- [ ] **Expected**: 201 Created
- [ ] **Update Environment**: Set `cardId` dengan id dari response

### 10. Test Get All Cards
- [ ] **GET** `{{baseUrl}}/kartu`
- [ ] Headers: `Authorization: Bearer {{authToken}}`
- [ ] **Expected**: 200 OK dengan array cards

### 11. Test Get Cards by Collection
- [ ] **GET** `{{baseUrl}}/kartu?koleksiId={{collectionId}}`
- [ ] Headers: `Authorization: Bearer {{authToken}}`
- [ ] **Expected**: 200 OK dengan array cards filtered by collection

### 12. Test Get Cards in Collection
- [ ] **GET** `{{baseUrl}}/koleksi/{{collectionId}}/kartu`
- [ ] Headers: `Authorization: Bearer {{authToken}}`
- [ ] **Expected**: 200 OK dengan cards dalam collection tersebut

### 13. Test Update Card (SRS)
- [ ] **PATCH** `{{baseUrl}}/kartu/{{cardId}}`
- [ ] Headers:
  - `Authorization: Bearer {{authToken}}`
  - `Content-Type: application/json`
- [ ] Body (raw JSON):
  ```json
  {
    "newDifficulty": 2,
    "newReviewDueAt": "2024-12-31T23:59:59.000Z"
  }
  ```
- [ ] **Expected**: 200 OK

---

## 🧪 Error Handling Testing

### 14. Test Unauthorized Access
- [ ] **GET** `{{baseUrl}}/koleksi` (tanpa Authorization header)
- [ ] **Expected**: 401 Unauthorized

### 15. Test Invalid Token
- [ ] **GET** `{{baseUrl}}/koleksi`
- [ ] Headers: `Authorization: Bearer invalid_token`
- [ ] **Expected**: 401 Unauthorized

### 16. Test Invalid Collection ID
- [ ] **GET** `{{baseUrl}}/koleksi/invalid-id`
- [ ] Headers: `Authorization: Bearer {{authToken}}`
- [ ] **Expected**: 404 Not Found

### 17. Test Create Card with Invalid Collection
- [ ] **POST** `{{baseUrl}}/kartu`
- [ ] Headers:
  - `Authorization: Bearer {{authToken}}`
  - `Content-Type: application/json`
- [ ] Body (raw JSON):
  ```json
  {
    "koleksiId": "invalid-collection-id",
    "front": "Question?",
    "back": "Answer"
  }
  ```
- [ ] **Expected**: 400 Bad Request atau 404 Not Found

---

## 🧹 Cleanup Testing

### 18. Test Delete Card
- [ ] **DELETE** `{{baseUrl}}/kartu/{{cardId}}`
- [ ] Headers: `Authorization: Bearer {{authToken}}`
- [ ] **Expected**: 200 OK atau 204 No Content

### 19. Test Delete Collection
- [ ] **DELETE** `{{baseUrl}}/koleksi/{{collectionId}}`
- [ ] Headers: `Authorization: Bearer {{authToken}}`
- [ ] **Expected**: 200 OK atau 204 No Content

---

## ✅ Success Criteria

Setelah menyelesaikan semua test di atas, API harus memenuhi:

- [ ] **Authentication**: Login/Register berfungsi dengan proper token generation
- [ ] **Collections**: CRUD operations untuk koleksi berfungsi
- [ ] **Cards**: CRUD operations untuk kartu berfungsi  
- [ ] **SRS Integration**: Update difficulty dan review date bekerja
- [ ] **Authorization**: Semua endpoint terproteksi dengan proper token validation
- [ ] **Error Handling**: Proper HTTP status codes dan error messages
- [ ] **Data Integrity**: Users hanya bisa akses data mereka sendiri

---

## 📝 Notes

- Simpan semua request yang berhasil sebagai "Saved Requests" di Postman
- Buat test collection untuk automation testing
- Dokumentasikan response examples untuk future reference
- Test dengan berbagai data input (edge cases, validasi)
- Monitor API logs untuk troubleshooting jika ada error
