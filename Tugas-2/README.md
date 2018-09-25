# Implementasi Partisi Basis Data

## Outline
- [Implementasi Partisi Basis Data](#implementasi-partisi-basis-data)
    - [Outline](#outline)
    - [Deskripsi Server yang Digunakan](#deskripsi-server-yang-digunakan)
    - [Implementasi Partisi 1 : Sakila Database](#implementasi-partisi-1--sakila-database)
        - [Deskripsi Dataset](#deskripsi-dataset)
        - [Proses Pembuatan Partisi](#proses-pembuatan-partisi)
            - [Langkah 1 - Menentukan Tabel yang akan Dipartisi](#langkah-1---menentukan-tabel-yang-akan-dipartisi)
                - [Tabel 1](#tabel-1)
                - [Tabel 2](#tabel-2)
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
    * Versi MySQL : Mysql  Ver 14.14 Distrib 5.7.23
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
        * Menambahkan `config.vm.synced_folder` untuk mensinkronkan folder pada host dan virtualbox. Di dalam folder `db/` terdapat Sakila database dan Sample 18M rows data.
  
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
    *masukkan password*
    ```
    ```mysql
    SOURCE /home/vagrant/sakila-db/sakila-scheme.sql
    SOURCE /home/vagrant/sakila-db/sakila-data.sql
    ```
* Dataset Sakila terdiri dari **23 tabel**, yaitu:
  
  ![Tabel Sakila Database](/Tugas-2/img/1.png)

* Masing-masing tabel memiliki jumlah baris data sebagai berikut:

    No | Nama Tabel | Jumlah Data
    --- | --- | ---
    1 | actor | 200
    2 | actor_info | 200
    3 | address | 603
    4 | category | 16
    5 | city | 600
    6 | country | 109
    7 | customer | 599
    8 | customer_list | 599
    9 | film | 1000
    10 | film_actor | 5462
    11 | film_category | 1000
    12 | film_list | 997
    13 | film_text | 1000
    14 | inventory | 4581
    15 | language | 6
    16 | nicer_but_slower_film_list | 997
    17 | payment | 16049
    18 | rental | 16044
    19 | sales_by_film_category | 16
    20 | sales_by_store | 2
    21 | staff | 2
    22 | staff_list | 2
    23 | store | 2

    Keterangan:
    * Jumlah data dapat dicari dengan command `SELECT COUNT(*) FROM *nama tabel*;` contoh:
  
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
* Pemilihan tabel yang akan dipartisi ditentukan berdasarkan jumlah data terbanyak dari semua tabel pada Database Sakila
* Daftar tabel yang akan dipartisi

##### Tabel 1
* Predicate dalam membuat partisi:
    * P1:
    * P2:
    * P3:
* Jenis partisi yang digunakan:
* Berdasarkan predikat-predikat diatas, maka tabel akan dipartisi menjadi ... bagian
* Nama dari partisi-partisinya adalah sebagai berikut:
  
##### Tabel 2
* Penentuan predicate dalam dalam membuat partisi:
    * P1:
    * P2:
    * P3:
* Jenis partisi yang digunakan:
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
* Dataset yang digunakan adalah **Measures Dataset**. Dapat diunduh di https://drive.google.com/uc?authuser=0&id=0B2Ksz9hP3LtXRUppZHdhT1pBaWM&export=download 
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
    **insert password**
    ```
3. Membuat database bernama **measures**. Dataset tidak dapat terimpor jika database belum dibuat.
   
    ```mysql
    CREATE DATABASE measures;
    ```
4. Keluar dari MySQL dengan mengetikkan `quit;`
5. Mengimpor Measures Dataset
    ```bash
    mysql -u root -p -D measures < *nama file dataset*
    **insert password**
    ```
    Contoh:
    ```bash
    mysql -u root -p -D measures < sample_1_8_M_rows_data.sql
    **insert password**
    ```



### Benchmarking
#### Select Queries Benchmark

#### Big Delete Benchmark
### Kesimpulan

## Referensi
* Claria, Francisco, (10 Februari 2017), Everything You Need to Know About MySQL Partitions, [online], (http://www.vertabelo.com/blog/technical-articles/everything-you-need-to-know-about-mysql-partitions, diakses tanggal 25 September 2018)
* MySQL, Sakila Installation Documentation, (https://dev.mysql.com/doc/sakila/en/sakila-installation.html, diakses tanggal 25 September 2018)

