# Replikasi Pada MySQL

- [Replikasi Pada MySQL](#replikasi-pada-mysql)
  - [Deskripsi Tugas](#deskripsi-tugas)
  - [Dokumentasi Pengerjaan](#dokumentasi-pengerjaan)
    - [1. Menyiapkan Server](#1-menyiapkan-server)
      - [1a. Membuat Server Master](#1a-membuat-server-master)
      - [1b. Membuat Server Slave](#1b-membuat-server-slave)
  - [2. Konfigurasi Replikasi MySQL](#2-konfigurasi-replikasi-mysql)
    - [2a. Konfigurasi Master Node](#2a-konfigurasi-master-node)
    - [2b. Konfigurasi Slave Node](#2b-konfigurasi-slave-node)

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
  
  ![Gambar Arsitektur Server](/Tugas-1/img/arsitektur-server.jpg)
  
#### 1a. Membuat Server Master
#### 1b. Membuat Server Slave
> Prasyarat: Sudah menginstall **VirtualBox** dan **Vagrant**

1. Membuat folder baru, kemudian pindah ke dalam folder tersebut.
    ```bash
    mkdir bdt-2018
    cd bdt-2018
    ```
2. Inisialisasi vagrant.
    ```bash
    Vagrant init
    ```
    Setelah menjalankan perintah tersebut akan otomatis membuat file baru bernama **Vagrantfile**.
3. Mengedit isi **Vagrantfile** menjadi:
    ```bash
    Vagrant.configure("2") do |config|
      config.vm.box = "ubuntu/xenial64"

      config.vm.network "public_network", ip: "10.151.36.69"

      config.vm.provider "virtualbox" do |vb|
          vb.memory = "1024"
          vb.cpus = 2
      end

      config.vm.provision "shell", path: "provision.sh"
    end
    ```

    Keterangan:
    
    * Mengubah **config.vm.box** sesuai dengan box ubuntu yang akan digunakan. Sebelumnya unduh terlebih dahulu box tersebut dengan menjalankan `vagrant box add ubuntu/xenial64`.
    * **config.vm.network "public_network"** diuncomment dan diberikan alamat IP tertentu.
    * Menambahkan **vb.cpus** sebanyak 2
    * Menambahkan `config.vm.provision "shell", path: "provision.sh"` di paling akhir untuk menambahkan file provision yang akan dibahas pada langkah ke-4.
4. Membuat file **provision.sh** dengan menjalankan command `nano provision.sh` dan isi dengan:
    ```bash
    #!/usr/bin/env bash
    apt-get update

    # install mysql
    # export DEBIAN_FRONTEND=noninteractive
    debconf-set-selections <<< 'mysql-server mysql-server/root_password password kucinglucu'
    debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password kucinglucu'
    apt-get install -y mysql-server
    apt-get install -y mysql-client mysql-common

    sudo service mysql restart
    ``` 
5. Menyalakan vagrant virtualbox dengan command `vagrant up`.
6. Melakukan provisioning aplikasi dengan menjalankan command `vagrant provision` atau `vagrant reload --provision`.
7. Masuk ke dalam vagrant dengan menjalankan command `vagrant ssh`.
8. Membuat user baru bebas dengan command `sudo adduser daus` dan membuat password supaya vagrant virtualbox bisa diakses dari luar menggunakan ssh.
    > Keterangan: "daus" adalah nama user yang dibuat.
9. Menambahkan user baru tersebut ke dalam **sudoer** dengan menjalankan command `sudo usermod -a -G sudo daus`.

## 2. Konfigurasi Replikasi MySQL
### 2a. Konfigurasi Master Node
1. Membuka file konfigurasi MySQL.
    ```bash
    sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
    ```
2. Mengubah dan menambahkan konfigurasi berikut pada Master node.
    ```bash
    bind-address            = 0.0.0.0
    
    server-id               = 1
    log_bin                 = /var/log/mysql/mysql-bin.log
    binlog_do_db            = employees
    ```

    ![Screenshot 1](/Tugas-1/img/ss1.png)

    Keterangan:
    * **bind-address** diubah menjadi 0.0.0.0 pada semua host.
    * **server-id** diuncomment dan diberikan angka yang berbeda pada semua node server.
    * Menambahkan **log_bin** untuk mendefinisikan letak nyata dimana replikasi disimpan. Slave server akan menyalin semua perubahan yang terdaftar di log.
    * Menambahkan **binlog_do_db** untuk mendefinisikan nama database yang akan direplikasi.

3. Me-restart MySQL.
    ```bash
    sudo service mysql restart
    ```
4. Masuk ke dalam MySQL dengan username "root" dan password "kucinglucu".
    ```bash
    mysql -u root -p
    ```
5. Memberikan privilege (hak istimewa) kepada Slave untuk malakukan replikasi dan mengatur password-nya.
    ```bash
    GRANT REPLICATION SLAVE ON *.* TO 'slave_user'@'%' IDENTIFIED BY 'kucinglucu';
    ```
    > Keterangan: "kucinglucu" adalah password yang diatur.
    
    Kemudian dilanjutkan dengan 
    ```bash 
    FLUSH PRIVILEGES;
    ```
6. Membuat database baru bernama **employees**.
    ```bash
    CREATE DATABASE employees;
    ```
    Kemudian, masuk ke dalam database tersebut.
    ```bash
    USE employees;
    ```
8. Mengunci database untuk mencegah perubahan yang masuk.
    ```bash
    FLUSH TABLES WITH READ LOCK;
    ```
9. Melihat status master.
    ```bash
    SHOW MASTER STATUS;
    ```
    Maka akan muncul tabel seperti di bawah ini:
    


### 2b. Konfigurasi Slave Node

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