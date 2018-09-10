# Replikasi Pada MySQL

## Deskripsi Tugas
Tugas ini menerapkan konsep yang ada di Chapter 2 (RDBMS & Network Communication.

Yang harus dilakukan adalah:
1. Setup MySQL replication (1 master, n slave)
2. Eksekusi query pada master, contohnya import database Employee.
3. Cek proses replikasi pada slave
4. Proses recovery. Promote slave as master
5. Eksekusi query pada master yang baru.
6. Konfigurasi slave dari master yang lama.
7. Cek proses replikasi

## Dokumentasi Pengerjaan

### 1. Menyiapkan Server
* Jumlah server yang disiapkan sebanyak 5 buah server, terdiri atas:

  * 1 server **Master**
  * 4 server **Slave**

* Server Master dibuat dengan menggunakan **Ansible** dan server Slave dibuat dengan menggunakan **Vagrant Virtual Box**.
* Semua server menggunakan sistem operasi **Ubuntu 16.08**.
* Semua server diinstall mysql dengan menjalankan command:

  ```bash
  sudo apt-get install mysql-server mysql-client​
  ``` 
* Alamat IP server yang dibuat:
  
  * **Server Master**
    * Host: 10.151.36.210 (Server-id: 1)

  * **Server Slave**
    * Host: 10.151.36.196 (Server-id: 2)​
    * Host: 10.151.36.234 (Server-id: 3)​
    * Host: 10.151.36.235 (Server-id: 4)​
    * Host: 10.151.36.69 (Server-id: 5) 

* Gambar arsitektur server yang digunakan:
  
  ![Gambar Arsitektur Server](/img/arsitektur-server.jpg)
  
#### 1a. Menyiapkan Server Master
#### 1a. Menyiapkan Server Slave

### 4. Promote slave as master
#### 4a. Pada Server Master Lama
* Koneksi pada server master harus terputus terlebih dahulu, salah satu caranya adalah dengan mematikan layanan mysql pada server master.
* Pada server slave, jalankan perintah `SHOW SLAVE STATUS\G` untuk melihat status server slave:
* Jika pada kolom *Slave_SQL_Running_State* menampilkan *“Slave has read all relay log; waiting for more updates”*, maka server slave dapat di*promote* menjadi server master dengan cara me*reset* calon server master seperti berikut:
  ```mysql
  mysql> STOP SLAVE;
  Query OK, 0 rows affected (0.02 sec)

  mysql> RESET SLAVE;
  Query OK, 0 rows affected (0.02 sec)
  ```
#### 4b. Pada Server Master Baru
* Buka pengaturan mysql pada server master yang baru dengan cara:
  ```shell
  sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
  ```
* Lakukan perubahan pada kolom ```binlog_do_db``` menjadi `sakila`. Setelah itu lakukan simpan dan *refresh* pada MySQL dengan cara:
  ```shell
  sudo service mysql restart
  ```
* Buka MySQL shell pada server master yang baru. Jika *user* `slave1` tidak ada pada server master yang baru, maka lakukan:
  ```mysql
  GRANT REPLICATION SLAVE ON *.* TO 'slave1'@'%' IDENTIFIED BY 'kucinglucu';
  FLUSH PRIVILEGES;
  ```
* Kunci *database* untuk mencegah terjadinya perubahan dengan cara:
  ```mysql
  USE sakila;
  FLUSH TABLES WITH READ LOCK;
  ```
* Menampilkan status pada server master yang baru agar dapat mengetahui *file* dan *position*
  ```mysql
  SHOW MASTER STATUS;
  ```
  ![Gambar Status Master](/img/status-master-baru.jpg)
* Ekspor *database* dengan menggunakan perintah berikut
  ```shell
  mysqldump -u root -p --opt sakila > sakila.sql
  ```
* Buka kembali *database* yang tadi telah dikunci pada server master yang baru dengan cara:
  ```mysql
  UNLOCK TABLES;
  QUIT;
  ```
#### 4c. Pada Server Slave
* Buat *database* baru bernama sakila pada server slave:
  ```mysql
  CREATE DATABASE sakila;
  EXIT;
  ```
* Impor *database* yang telah diekspor dan dikirim dari server master
  ```shell
  mysql -u root -p sakila < sakila.sql
  ```
* Buka pengaturan mysql pada server slave dengan cara:
  ```shell
  sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
  ```
* Lakukan perubahan pada kolom `binlog_do_db` menjadi `sakila`. Setelah itu lakukan simpan dan *refresh* pada MySQL dengan cara:
  ```shell
  sudo service mysql restart
  ```
* Buka kembali MySQL shell kembali dan lakukan perubahan konfigurasi server master yang terdapat pada MySQL server slave dengan cara:
  ```mysql
  CHANGE MASTER TO MASTER_HOST='10.151.36.196',MASTER_USER='slave1', MASTER_PASSWORD='kucinglucu', MASTER_LOG_FILE='mysql-bin.000001', MASTER_LOG_POS=  107;
  ```
* Aktifkan server slave:
  ```mysql
  START SLAVE;
  ```
* Menampilkan detail dari replikasi server slave dengan cara:
  ```mysql
  SHOW SLAVE STATUS\G
  ```