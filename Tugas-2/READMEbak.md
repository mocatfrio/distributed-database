# Fragmentasi pada MySQL Menggunakan Partisi Horizontal

## Deskripsi Tugas
Tahapan:
1. Menyiapkan database
    a. Import schema
    b. Import data
    c. Cek jumlah row
2. Menentukan kandidat tabel yang akan dipartisi
3. Menentukan syarat partisi
4. Implementasi
5. Checking

## Dokumentasi Pengerjaan

### 1. Menyiapkan Database
#### 1a. Import Schema
#### 1b. Import Data
#### 1c. Cek Jumlah Row
### 2. Menentukan Kandidat Tabel
Kandidat tabel yang dipartisi
1. Payment
2. Rental

### 3. Menentukan Syarat Partisi
* Table **Payment**
  - Jumlah partisi yang mungkin: 5
  - Syarat partisinya:

* Table **Rental**
  - Jumlah partisi yang mungkin: x
  - Syarat partisinya:
    - P1:
    - P2:
    - P3:

### 4. Implementasi


### 5. Checking MySQL
- ```select count(*) from payment;``` jumlahnya sama di setiap db
- ```explain select count(*) from payment;```
