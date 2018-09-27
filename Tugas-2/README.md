# Implementasi Partisi Basis Data

## Outline
- [Implementasi Partisi Basis Data](#implementasi-partisi-basis-data)
    - [Outline](#outline)
    - [Deskripsi Server yang Digunakan](#deskripsi-server-yang-digunakan)
    - [Implementasi Partisi 1 : Sakila Database](#implementasi-partisi-1--sakila-database)
        - [Deskripsi Dataset](#deskripsi-dataset)
        - [Proses Pembuatan Partisi](#proses-pembuatan-partisi)
            - [Langkah 1 - Menentukan Tabel yang akan Dipartisi](#langkah-1---menentukan-tabel-yang-akan-dipartisi)
                - [Tabel Payment](#tabel-payment)
                - [Tabel Rental](#tabel-rental)
            - [Langkah 2 - Implementasi Partisi](#langkah-2---implementasi-partisi)
        - [Benchmarking](#benchmarking)
    - [Implementasi Partisi 2 : Measures Dataset](#implementasi-partisi-2--measures-dataset)
        - [Deskripsi Dataset](#deskripsi-dataset)
        - [Cara Import Dataset](#cara-import-dataset)
        - [Benchmarking](#benchmarking)
            - [Select Queries Benchmark](#select-queries-benchmark)
            - [Big Delete Benchmark](#big-delete-benchmark)
        - [Kesimpulan](#kesimpulan)
    - [Referensi](#referensi)

<!-- /code_chunk_output -->

## Deskripsi Server yang Digunakan
* Server dibuat menggunakan teknologi **Vagrant Virtualbox**, dengan spesifikasi sebagai berikut :
    * Sistem Operasi : Ubuntu 16.04.5 LTS Xenial
    * Versi MySQL : MySQL Ver 14.14 Distrib 5.7.23
    * RAM : 1024 MB (992 MB)
    * CPU : 2 core
* Detail pembuatan server kurang lebih sama seperti pada [tugas 1](https://github.com/mocatfrio/bdt-2018/tree/master/Tugas-1)
    * Vagrantfile
  
        ```bash
        Vagrant.configure("2") do |config|
            config.vm.box = "ubuntu/xenial64"

            config.vm.network "public_network", ip: "10.151.36.69"
            
            config.vm.synced_folder "db/", "/home/vagrant"

            config.vm.provider "virtualbox" do |vb|
                vb.memory = "1024"
                vb.cpus = 2
            end

            config.vm.provision "shell", path: "provision.sh"
        end
        ``` 
        Keterangan:
        * Menambahkan `config.vm.synced_folder` untuk mensinkronkan folder pada host dan virtualbox. Di dalam folder `db/` terdapat Sakila Database dan Measures Dataset.
  
    * Provision.sh
  
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
  
## Implementasi Partisi 1 : Sakila Database
### Deskripsi Dataset
* Dataset yang digunakan adalah **Sakila Database**. Dapat diunduh di http://downloads.mysql.com/docs/sakila-db.zip 
* Cara import:
  
    ```bash
    mysql -u root -p
    ```
    ```mysql
    mysql> SOURCE /path/to/file;
    ```
    Contoh:
    ```mysql
    mysql> SOURCE /home/vagrant/sakila-db/sakila-scheme.sql;
    mysql> SOURCE /home/vagrant/sakila-db/sakila-data.sql;
    ```
* Dataset Sakila terdiri dari **23 tabel**, yaitu:
  
  ![Tabel Sakila Database](/Tugas-2/img/1.png "Tabel Sakila Database")

* Masing-masing tabel memiliki jumlah baris data sebagai berikut:

  ![Jumlah Baris Data Sakila Database](/Tugas-2/img/3.png "Jumlah Baris Data Sakila Database")
   
    Keterangan:
    * Jumlah baris data semua tabel pada Sakila Database dapat dicari dengan:
        ```mysql
        SELECT TABLE_NAME, TABLE_ROWS FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'sakila';
        ```
    * Jumlah baris data juga dapat dicari satu-satu dengan command `SELECT COUNT(*) FROM *nama tabel*;` contoh:
  
        ```mysql
        mysql> select count(*) from payment;
        +----------+
        | count(*) |
        +----------+
        |    16049 |
        +----------+
        1 row in set (0.00 sec)
        ```

### Proses Pembuatan Partisi
#### Langkah 1 - Menentukan Tabel yang akan Dipartisi
* Pemilihan tabel yang akan dipartisi ditentukan berdasarkan **jumlah data terbanyak** dari semua tabel pada database Sakila. Tabel Payment dan Rental memiliki jumlah data paling banyak diantara semua tabel yakni 16049 dan 16044, serta memiliki kemungkinan pertambahan data yang signifikan karena tabel bersifat transaksional dan datanya sering berubah-ubah.
* Daftar tabel yang akan dipartisi:
    * Tabel **Payment**
    * Tabel **Rental**

##### Tabel Payment
* Jenis partisi yang digunakan: **RANGE** 
* Predicate dalam membuat partisi:
    * _p<sub>1</sub>_ : Data dengan **payment_date** tanggal 1-5
    * _p<sub>2</sub>_ : Data dengan **payment_date** tanggal 6-10
    * _p<sub>3</sub>_ : Data dengan **payment_date** tanggal 11-15
    * _p<sub>4</sub>_ : Data dengan **payment_date** tanggal 16-20
    * _p<sub>5</sub>_ : Data dengan **payment_date** tanggal 21-25
    * _p<sub>6</sub>_ : Data dengan **payment_date** tanggal 26-31

* Berdasarkan predikat-predikat diatas, maka tabel akan dipartisi menjadi 6 bagian
* Nama dari partisi-partisinya adalah sebagai berikut:
  
##### Tabel Rental
* Jenis partisi yang digunakan:
* Penentuan predicate dalam dalam membuat partisi:
    * P1:
    * P2:
    * P3:
* Berdasarkan predikat-predikat diatas, maka tabel akan dipartisi menjadi ... bagian
* Nama dari partisi-partisinya adalah sebagai berikut:
  
#### Langkah 2 - Implementasi Partisi

### Benchmarking
1. Insert beberapa data baru (minimal 10) ke masing-masing tabel.
    * Partisi 1
  
        ```mysql
        INSERT INTO ... VALUES ...
        INSERT INTO ... VALUES ...
        ````
    * Partisi 2
  
        ```mysql
        INSERT INTO ... VALUES ...
        INSERT INTO ... VALUES ...
        ````
2. Melakukan **select data 1** dari partisi yang benar (partisi_1)
   * Pastikan data ada di partisi tersebut
3. Melakukan **select data 1** dari partisi yang salah (partisi_2)
   * Tunjukkan data tidak ada pada partisi tersebut
  
## Implementasi Partisi 2 : Measures Dataset
### Deskripsi Dataset
* Dataset yang digunakan adalah **Measures Dataset**. Dapat diunduh di https://drive.google.com/file/d/0B2Ksz9hP3LtXRUppZHdhT1pBaWM/view
* Dataset Measures terdiri dari **2 tabel**, yaitu:
  
  ![Tabel Measures Dataset](/Tugas-2/img/2.png)

* Masing-masing tabel memiliki jumlah baris data sebagai berikut:
  
    No | Nama Tabel | Jumlah Data
    --- | --- | ---
    1 | measures | 1846124
    2 | partitioned_measures | 1846124

    Keterangan:
    * Tabel  **partitioned_measures** adalah bentuk partisi dari tabel **measures**, sehingga keduanya memiliki jumlah data yang sama. 

### Cara Import Dataset
1. Unduh Measures Dataset dari link yang telah disebutkan di atas.
2. Masuk ke dalam MySQL.

    ```bash
    mysql -u root -p
    ```
3. Membuat database bernama **measures**. Dataset tidak dapat diimpor jika database belum dibuat.
   
    ```mysql
    CREATE DATABASE measures;
    ```
4. Keluar dari MySQL dengan mengetikkan `quit;`
5. Mengimpor Measures Dataset
    ```bash
    mysql -u root -p -D measures < *nama file dataset*
    ```
    Contoh:
    ```bash
    mysql -u root -p -D measures < sample_1_8_M_rows_data.sql
    ```

### Benchmarking
#### Select Queries Benchmark

#### Big Delete Benchmark
### Kesimpulan

## Referensi
* Claria, Francisco, (10 Februari 2017), Everything You Need to Know About MySQL Partitions, [online], (http://www.vertabelo.com/blog/technical-articles/everything-you-need-to-know-about-mysql-partitions, diakses tanggal 25 September 2018)
* MySQL, Sakila Installation Documentation, (https://dev.mysql.com/doc/sakila/en/sakila-installation.html, diakses tanggal 25 September 2018)

