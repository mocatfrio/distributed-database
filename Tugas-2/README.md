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
        - [Import Dataset](#import-dataset)
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
    * Vagrant box
        ```bash
        vagrant box add geerlingguy/ubuntu1604
        ```
    * Vagrantfile
        ```bash
        Vagrant.configure(2) do |config|
            config.vm.box = "geerlingguy/ubuntu1604"
            
            config.vm.network "forwarded_port", guest: 80, host: 8081
            config.vm.network "forwarded_port", guest: 443, host: 8443

            config.vm.synced_folder "db/", "/home/vagrant"

            config.vm.provider "virtualbox" do |vb|
                vb.memory = "1024"
                vb.cpus = 2
            end

            config.vm.provision "shell", path: "provision.sh"
        end
        ``` 
        Keterangan:
        * `config.vm.synced_folder` untuk mensinkronkan folder pada host dan virtualbox. Di dalam folder `db/` terdapat Sakila database dan Sample 18M rows data.
  
    * Provision.sh
        ```bash
        #!/usr/bin/env bash
        apt-get update

        # install mysql
        # export DEBIAN_FRONTEND=noninteractive
        debconf-set-selections <<< 'mysql-server mysql-server/root_password password anakterminal'
        debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password anakterminal'
        apt-get install -y mysql-server
        apt-get install -y mysql-client mysql-common

        sudo service mysql restart
        ```
  
## Implementasi Partisi 1 : Sakila Database
> Syarat: Sudah mengimport Sakila DB terlebih dahulu. Dokumentasi instalasi Sakila DB dapat dilihat pada bagian referensi

### Deskripsi Dataset
* Dataset yang digunakan adalah **Sakila Database**. Dapat diunduh di http://downloads.mysql.com/docs/sakila-db.zip 
* Dataset Sakila terdiri dari **22 tabel**.
* Masing-masing tabel memiliki jumlah baris data sebagai berikut:


### Proses Pembuatan Partisi
#### Langkah 1 - Menentukan Tabel yang akan Dipartisi
* Pemilihan tabel yang akan dipartisi
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
* Dataset yang digunakan adalah **Sakila Database**. Dapat diunduh di https://drive.google.com/file/d/0B2Ksz9hP3LtXRUppZHdhT1pBaWM/view. 
* Dataset Sakila terdiri dari **22 tabel**.
* Masing-masing tabel memiliki jumlah baris data sebagai berikut:

### Import Dataset


### Benchmarking
#### Select Queries Benchmark

#### Big Delete Benchmark
#### Kesimpulan

## Referensi
* Claria, Francisco, (10 Februari 2017), Everything You Need to Know About MySQL Partitions, [online], (http://www.vertabelo.com/blog/technical-articles/everything-you-need-to-know-about-mysql-partitions, diakses tanggal 25 September 2018)
* MySQL, Sakila Installation Documentation, (https://dev.mysql.com/doc/sakila/en/sakila-installation.html, diakses tanggal 25 September 2018)

