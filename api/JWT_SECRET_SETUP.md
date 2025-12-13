# 🔐 JWT_SECRET Setup Guide

## Apa itu JWT_SECRET?
JWT_SECRET adalah secret key yang digunakan untuk menandatangani JWT token. Ini adalah kunci keamanan penting untuk aplikasi Anda.

## 📋 Cara Mendapatkan JWT_SECRET:

### Opsi 1: Generate Random String (Recommended)
Buat string random yang kuat dengan perintah:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Opsi 2: Manual Secret Key
Gunakan string yang kuat seperti:
```
manabucard_super_secret_key_2024_development_only
```

### Opsi 3: Online JWT Secret Generator
Gunakan tool online untuk generate secret key yang aman.

## ⚙️ Cara Mengatur JWT_SECRET:

### 1. Edit File .env
Tambahkan atau edit file `api/.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/manabucard_db"
JWT_SECRET="your_generated_secret_here"
NODE_ENV="development"
```

### 2. Menggunakan Environment Variable
Set di terminal:
```bash
# Windows
set JWT_SECRET=your_generated_secret_here

# Linux/Mac
export JWT_SECRET=your_generated_secret_here
```

## 🔧 Testing dengan Token:
Setelah mengatur JWT_SECRET, gunakan test token generator:
```bash
node api/generate-test-token.js
```

## ⚠️ Penting:
- **JANGAN** commit JWT_SECRET ke Git
- Gunakan secret yang berbeda untuk production
- Secret harus minimal 32 karakter untuk keamanan
- Fallback secret development sudah diatur: `manabucard_dev_secret_key_2024`
