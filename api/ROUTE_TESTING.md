# Testing Script untuk Route API Kartu dan Koleksi

## Persiapan Testing

1. **Pastikan API server berjalan:**
```bash
cd api
npm run dev
```

2. **Generate test token:**
```bash
node generate-test-token.js
```

## Test Collection Routes

### 1. Test GET /api/koleksi
```bash
curl -X GET http://localhost:3000/api/koleksi \
  -H "Authorization: Bearer YOUR_TEST_TOKEN"
```

**Expected Response:**
```json
[
  {
    "id": "collection-id",
    "name": "Collection Name", 
    "cardCount": 5,
    "dueToday": 2
  }
]
```

### 2. Test POST /api/koleksi
```bash
curl -X POST http://localhost:3000/api/koleksi \
  -H "Authorization: Bearer YOUR_TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nama": "Test Koleksi", "deskripsi": "Koleksi untuk testing"}'
```

### 3. Test GET /api/koleksi/[id]
```bash
curl -X GET http://localhost:3000/api/koleksi/COLLECTION_ID \
  -H "Authorization: Bearer YOUR_TEST_TOKEN"
```

### 4. Test PUT /api/koleksi/[id]
```bash
curl -X PUT http://localhost:3000/api/koleksi/COLLECTION_ID \
  -H "Authorization: Bearer YOUR_TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nama": "Updated Name", "deskripsi": "Updated Description"}'
```

## Test Card Routes

### 5. Test POST /api/kartu
```bash
curl -X POST http://localhost:3000/api/kartu \
  -H "Authorization: Bearer YOUR_TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"koleksiId": "COLLECTION_ID", "front": "Question", "back": "Answer"}'
```

### 6. Test GET /api/kartu
```bash
curl -X GET http://localhost:3000/api/kartu \
  -H "Authorization: Bearer YOUR_TEST_TOKEN"
```

### 7. Test GET /api/kartu?koleksiId=COLLECTION_ID
```bash
curl -X GET "http://localhost:3000/api/kartu?koleksiId=COLLECTION_ID" \
  -H "Authorization: Bearer YOUR_TEST_TOKEN"
```

### 8. Test PATCH /api/kartu/[id]
```bash
curl -X PATCH http://localhost:3000/api/kartu/CARD_ID \
  -H "Authorization: Bearer YOUR_TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"newDifficulty": 1, "newReviewDueAt": "2024-01-01T00:00:00Z"}'
```

### 9. Test DELETE /api/kartu/[id]
```bash
curl -X DELETE http://localhost:3000/api/kartu/CARD_ID \
  -H "Authorization: Bearer YOUR_TEST_TOKEN"
```

## Test Collection-Card Routes

### 10. Test GET /api/koleksi/[id]/kartu
```bash
curl -X GET http://localhost:3000/api/koleksi/COLLECTION_ID/kartu \
  -H "Authorization: Bearer YOUR_TEST_TOKEN"
```

## Expected Success Indicators

✅ **Collection Routes Working:**
- GET /api/koleksi returns array with cardCount & dueToday
- POST /api/koleksi creates new collection
- GET /api/koleksi/[id] returns collection details
- PUT /api/koleksi/[id] updates collection
- DELETE /api/koleksi/[id] deletes collection

✅ **Card Routes Working:**
- POST /api/kartu creates new card in collection
- GET /api/kartu returns all cards (filtered by user)
- GET /api/kartu?koleksiId=ID filters cards by collection
- PATCH /api/kartu/[id] updates SRS data
- DELETE /api/kartu/[id] soft deletes card

✅ **Collection-Card Routes Working:**
- GET /api/koleksi/[id]/kartu returns cards in specific collection

✅ **Security Working:**
- All endpoints require valid Authorization header
- Users can only access their own collections and cards
- Proper error responses for unauthorized access

✅ **Performance Working:**
- dueToday calculation works efficiently
- Card counting uses optimized queries
- Response times are acceptable
