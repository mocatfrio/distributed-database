### Evaluasi Akhir Semester - Basis Data Terdistribusi
# Aplikasi Web CRUD menggunakan Flask, Redis Sentinel, dan MySQL Group Replication
Oleh: **Hafara Firdausi (05111540000043)** - https://github.com/mocatfrio/bdt-2018/tree/master/Tugas-EAS

## Outline
- [Aplikasi Web CRUD menggunakan Flask, Redis Sentinel, dan MySQL Group Replication](#aplikasi-web-crud-menggunakan-flask-redis-sentinel-dan-mysql-group-replication)
  - [Outline](#outline)
  - [1. Deskripsi Tugas](#1-deskripsi-tugas)
  - [2. Deskripsi Sistem](#2-deskripsi-sistem)
    - [2.1 Arsitektur Sistem](#21-arsitektur-sistem)
    - [2.2 Deskripsi Host Utama](#22-deskripsi-host-utama)
    - [2.3 Deskripsi Node](#23-deskripsi-node)
      - [2.3.1 ProxySQL Server sebagai Load Balancer MySQL](#231-proxysql-server-sebagai-load-balancer-mysql)
      - [2.3.2 MySQL Group Replication Server sebagai Database](#232-mysql-group-replication-server-sebagai-database)
      - [2.3.3 Redis Sentinel Cluster sebagai Cache Data](#233-redis-sentinel-cluster-sebagai-cache-data)
    - [2.3 Deskripsi Dataset](#23-deskripsi-dataset)
    - [2.4 Deskripsi Web](#24-deskripsi-web)
  - [3. Implementasi Sistem](#3-implementasi-sistem)
    - [3.1 Menyiapkan Vagrant](#31-menyiapkan-vagrant)
      - [3.1.1 Script Vagrant MySQL Cluster](#311-script-vagrant-mysql-cluster)
      - [3.1.2 Script Vagrant Redis Sentinel Cluster](#312-script-vagrant-redis-sentinel-cluster)
    - [3.2 Menjalankan Vagrant](#32-menjalankan-vagrant)
      - [3.2.1 Provisioning Tambahan MySQL Cluster](#321-provisioning-tambahan-mysql-cluster)
      - [3.2.1 Provisioning Tambahan Redis Sentinel Cluster](#321-provisioning-tambahan-redis-sentinel-cluster)
    - [3.3 Import MySQL](#33-import-mysql)
    - [3.4 Aplikasi Web Flask](#34-aplikasi-web-flask)
      - [3.4.1 Inisialisasi](#341-inisialisasi)
      - [3.4.2 Deploy Web](#342-deploy-web)
      - [3.4.3 Fitur Web](#343-fitur-web)
      - [3.4.4 Struktur Direktori Web](#344-struktur-direktori-web)
      - [3.4.5 Snippet Kode](#345-snippet-kode)
  - [4. Pengujian](#4-pengujian)
    - [4.1 Pengujian MySQL Cluster](#41-pengujian-mysql-cluster)
      - [4.1.1 Pengujian Koneksi](#411-pengujian-koneksi)
      - [4.1.2 Pengujian Replikasi dan High Availibility](#412-pengujian-replikasi-dan-high-availibility)
    - [4.2 Pengujian Redis Sentinel Cluster](#42-pengujian-redis-sentinel-cluster)
      - [4.2.1 Pengujian Koneksi](#421-pengujian-koneksi)
      - [4.2.2 Pengujian Replikasi dan High Availibility](#422-pengujian-replikasi-dan-high-availibility)
    - [4.3 Pengujian Fitur Web](#43-pengujian-fitur-web)
    - [4.4 Pengujian Load Testing](#44-pengujian-load-testing)
  - [5. Referensi](#5-referensi)

## 1. Deskripsi Tugas
1. Implementasikan sebuah aplikasi yang memiliki **back-end sistem basis data terdistribusi** (RDBMS dan NoSQL)
  * RDBMS : **MySQL cluster**
  * NoSQL cluster (pilih salah satu)
    * MongoDB
    * Cassandra
    * **Redis**
2. Aplikasi yang dibuat minimal memiliki **fitur CRUD**
3. Untuk menguji performa sistem, gunakan **JMeter**. Variasikan jumlah koneksi yang mengakses server yang sudah dibuat.

## 2. Deskripsi Sistem 
### 2.1 Arsitektur Sistem
![Arsitektur](img/arsitektur.png)

Arsitektur sistem diatas diimplementasikan dengan teknologi virtualisasi menggunakan **Vagrant** dan **Virtual Box**, terdiri dari 7 node virtual, 3 node Redis Sentinel Cluster, 1 node LoadBalancer MySQL, dan 3 node MySQL Group Replication.

### 2.2 Deskripsi Host Utama
Host utama juga berperan sebagai Web Application (Client)
* Sistem Operasi : Linux Mint 18.3 Sylvia / Ubuntu 18.04
* Versi aplikasi :
  * Vagrant 2.2.2
  * Virtual Box 5.2.20r125813
  * Python 2.7.12
  * Pip 18.1
  
### 2.3 Deskripsi Node
#### 2.3.1 ProxySQL Server sebagai Load Balancer MySQL
* Sistem operasi : Ubuntu 16.04
* Teknologi : MySQL Client
  * mysql-common_5.7.23
  * mysql-community-client_5.7.23
  * mysql-client_5.7.23
* Nama node dan alamat IPnya
  * **proxy** : 192.168.33.10

#### 2.3.2 MySQL Group Replication Server sebagai Database
* Sistem operasi : Ubuntu 16.04
* Teknologi : MySQL Server - menggunakan community edition yang support group replication
  * mysql-common_5.7.23
  * mysql-community-client_5.7.23
  * mysql-client_5.7.23
  * mysql-community-server_5.7.23
* Nama node dan alamat IPnya
  * **db1** : 192.168.33.11 
  * **db2** : 192.168.33.12
  * **db3** : 192.168.33.13

#### 2.3.3 Redis Sentinel Cluster sebagai Cache Data
* Sistem operasi : Ubuntu 16.04
* Teknologi : Redis Server
  * redis-stable.tar.gz (download.redis.io)
* Nama node dan alamat IPnya
  * **redis1** : 192.168.33.14 
  * **redis2** : 192.168.33.15
  * **redis3** : 192.168.33.16

### 2.3 Deskripsi Dataset
* Dataset yang digunakan adalah Dataset GoodBooks 10K (dapat diunduh di https://www.kaggle.com/zygmunt/goodbooks-10k#books.csv) 
* Dataset berisi 10000 baris data
* Dataset memiliki 23 kolom atribut
* Modifikasi dataset:
  * Jumlah kolom atribut terlalu banyak dan ada beberapa atribut yang tidak diperlukan, sehingga dikurangi menjadi 10 atribut saja, yaitu:
    * **id** : ID unik
    * **original_title** : Judul asli buku
    * **title** : Judul buku di website
    * **isbn** : *International Standard Book Number* adalah kode pengidentifikasian buku yang bersifat unik
    * **authors** : Penulis buku
    * **publication_year** : Tahun terbit buku
    * **rating** : Rating rata-rata
    * **ratingsCount** : Jumlah rating yang masuk
    * **ratingsTotal** : Total rating
    * **image_url** : Thumbnail buku

### 2.4 Deskripsi Web
* Web dibuat menggunakan **Flask**, yakni kerangka kerja (framework) aplikasi web mikro yang ditulis dalam bahasa pemrograman Python
* Web dikembangkan menggunakan **Virtualenv** Python 2.7
* Web menggunakan beberapa library Python yang dibutuhkan, antara lain:
  * **SQLAchemy**, **Flask-SQLAlchemy** dan **MySQL-Python** (Python interface to MySQL) untuk menghubungkan Web dengan MySQL
  * **Flask-Caching**, **Flask-Redis-Sentinel**, dan **redis** untuk caching menggunakan Redis
  * Serta beberapa varian library Flask yang memudahkan pembuatan web, seperti **Flask-Login** untuk otentikasi, **Flask-Migrate** untuk membuat database dari model yang telah dibuat, **Flask-WTF** untuk membuat form, dsb.

## 3. Implementasi Sistem
### 3.1 Menyiapkan Vagrant
#### 3.1.1 Script Vagrant MySQL Cluster
Struktur folder Vagrant:
```bash
.
├── mysql
│   ├── addition_to_sys.sql
│   ├── cluster_bootstrap.sql
│   ├── cluster_member.sql
│   ├── create_proxysql_user.sql
│   ├── deployMySQL11.sh
│   ├── deployMySQL12.sh
│   ├── deployMySQL13.sh
│   ├── deployProxySQL.sh
│   ├── kb-data.sql
│   ├── kb-schema.sql
│   ├── my11.cnf
│   ├── my12.cnf
│   ├── my13.cnf
│   ├── proxysql.sql
│   └── Vagrantfile
```
Script vagrant yang digunakan merupakan modifikasi dari VM [Tugas-ETS](/Tugas-ETS) dengan beberapa penyesuaian. Script asli dapat diunduh di [mysql-cluster-proxysql.zip](https://drive.google.com/open?id=12ojGu1Sss8ka9N9-K8zOigwb7gBAmtCE&authuser=0). 

1. **Vagrantfile**

    ```ruby
    Vagrant.configure("2") do |config|

    # MySQL Cluster dengan 3 node
    (1..3).each do |i|
      config.vm.define "db#{i}" do |node|
      node.vm.hostname = "db#{i}"
      node.vm.box = "bento/ubuntu-16.04"
      node.vm.network "private_network", ip: "192.168.33.1#{i}"
      # node.vm.network "public_network", bridge: "enp5s0"
      node.vm.network "public_network", bridge: "wlp3s0"
      
      node.vm.provider "virtualbox" do |vb|
        vb.name = "db#{i}"
        vb.gui = false
        vb.memory = "256"
      end

      node.vm.provision "shell", path: "deployMySQL1#{i}.sh", privileged: false
      end
    end

    config.vm.define "proxy" do |proxy|
      proxy.vm.hostname = "proxy"
      proxy.vm.box = "bento/ubuntu-16.04"
      proxy.vm.network "private_network", ip: "192.168.33.10"
      # proxy.vm.network "public_network",  bridge: "enp5s0"
      proxy.vm.network "public_network", bridge: "wlp3s0"
      
      proxy.vm.provider "virtualbox" do |vb|
      vb.name = "proxy"
      vb.gui = false
      vb.memory = "256"
      end

      proxy.vm.provision "shell", path: "deployProxySQL.sh", privileged: false
    end

    end
    ```

    Modifikasi:
      * Mengubah **bridge** pada `config.vm.network "public_network"` menjadi **wlp3s0** untuk menyesuaikan dengan interface yang digunakan oleh host
      * Mengurangi **vb.memory** atau memori yang dialokasikan untuk setiap VM, dari 1024 MB menjadi 256 MB untuk menyesuaikan dengan kondisi host

2. File provision
   * **deployMySQL11.sh** : Provision untuk node db1
   * **deployMySQL12.sh** : Provision untuk node db2
   * **deployMySQL13.sh** : Provision untuk node db3
   * **deployProxySQL.sh** : Provision untuk node proxy
3. File konfigurasi SQL
   * **cluster_bootstrap.sql** (untuk node db1) : Melakukan bootstrapping MySQL group replication 
     * Modifikasi: 
        ```sql
        ...
        -- membuat database kutubuku
        CREATE DATABASE db_kutubuku;
        ...
        ```
   * **cluster_member.sql** (untuk node db2 dan db3) : Melakukan konfigurasi MySQL group replication pada node member 
   * **addition_to_sys.sql** (untuk node db1) : Patch script untuk ProxySQL
   * **create_proxysql_user.sql** (untuk node db1) : Create user untuk ProxySQL
     * Modifikasi: 
        ```sql
        ...
        -- membuat user admin_kutubuku
        CREATE USER 'admin_kutubuku'@'%' IDENTIFIED BY 'admin123';
        GRANT ALL PRIVILEGES on db_kutubuku.* to 'admin_kutubuku'@'%';
        FLUSH PRIVILEGES;
        ```
   * **proxysql.sql** (untuk node proxy) : Mengubah user admin ProxySQL, menambahkan user ‘monitoring’, menambahkan node MySQL, menambahkan user ‘playground’
     * Modifikasi: 
        ```sql
        ...
        -- Menambahkan user 'admin_kutubuku'
        INSERT INTO mysql_users(username, password, default_hostgroup) VALUES ('admin_kutubuku', 'admin123', 2);
        ... 
        ```

4. File konfigurasi The MySQL database server
   * **my11.cnf** : Konfigurasi untuk node db1
   * **my12.cnf** : Konfigurasi untuk node db2
   * **my13.cnf** : Konfigurasi untuk node db3

#### 3.1.2 Script Vagrant Redis Sentinel Cluster
Struktur folder Vagrant:
```bash
.
└── redis
    ├── deployRedis1.sh
    ├── deployRedis2.sh
    ├── deployRedis3.sh
    ├── redis1
    │   ├── redis.conf
    │   └── sentinel.conf
    ├── redis2
    │   ├── redis.conf
    │   └── sentinel.conf
    ├── redis3
    │   ├── redis.conf
    │   └── sentinel.conf
    └── Vagrantfile

```
1. **Vagrantfile**
   Hampir mirip dengan Vagrantfile MySQL
   ```ruby
   Vagrant.configure("2") do |config|    
      # Redis Cluster dengan 3 node
      (1..3).each do |i|
        config.vm.define "redis#{i}" do |node|
          node.vm.hostname = "redis#{i}"
          node.vm.box = "bento/ubuntu-16.04"
          node.vm.network "private_network", ip: "192.168.33.1#{i+3}"
          # node.vm.network "public_network", bridge: "enp5s0"
          node.vm.network "public_network", bridge: "wlp3s0"
          
          node.vm.provider "virtualbox" do |vb|
            vb.name = "redis#{i}"
            vb.gui = false
            vb.memory = "256"
          end
      
          node.vm.provision "shell", path: "deployRedis#{i}.sh", privileged: false
        end
      end
    end
    ```
2. File provision
   * **deployRedis1.sh** : Provision untuk node redis1
   * **deployRedis2.sh** : Provision untuk node redis2
   * **deployRedis3.sh** : Provision untuk node redis3
3. File konfigurasi redis dan sentinel untuk masing-masing node
   * **redis.conf**
   * **sentinel.conf**

n.b. Tutorial selengkapnya dapat dilihat di bagian referensi

### 3.2 Menjalankan Vagrant
1. Setelah memodifikasi script, maka jalankan vagrant virtual box
    ```bash
    vagrant up
    ```
    atau
    ```bash
    vagrant reload --provision
    ```
    Ketika menjalankan vagrant, sebenarnya vagrant sedang melakukan provisioning (persiapan dan konfigurasi) menggunakan semua file di atas. Tunggu selama beberapa saat dan pastikan tidak ada error.

2. Cek apakah vagrant sudah berjalan dengan baik
    ```bash
    vagrant status
    ```

#### 3.2.1 Provisioning Tambahan MySQL Cluster

1. Masuk ke VM Proxy
   ```bash
   vagrant ssh proxy
   ```

2. Import file `proxysql.sql` sebagai provisioning tambahan
   ```bash
   mysql -u admin -p -h 127.0.0.1 -P 6032 < /vagrant/proxysql.sql
   ```
   > Password : password

#### 3.2.1 Provisioning Tambahan Redis Sentinel Cluster
1. Masuk ke semua VM redis
    ```bash
    vagrant ssh redis1
    vagrant ssh redis2
    vagrant ssh redis3
    ```
2. Jalankan service redis dan sentinel
    ```bash
    cd /home/vagrant/redis-stable/src/ && redis-server ../redis.conf & 
    cd /home/vagrant/redis-stable/src/ && redis-server ../sentinel.conf --sentinel &
    ```
3. Cek apakah proses redis dan sentinel sudah berjalan dengan baik
    ```bash
    ps -ef | grep redis
    ```

    ![Vagrant Status](img/ss7.png)


### 3.3 Import MySQL
1. Masuk ke salah satu VM DB, misalnya node db1
    ```bash
    vagrant ssh db1
    ```
2. Import skema DB yang telah dibuat sesuai dengan kebutuhan web
    ```sql
    mysql -u root -p < /vagrant/kb-schema.sql
    ```
3. Import data 
    ```sql
    mysql -u root -p -D db_kutubuku < /vagrant/kb-data.sql
    ```
    Sebelumnya, data didapatkan dari dataset Kaggle dengan ekstensi file .csv, kemudian diimport ke MySQL terlebih dahulu dengan cara:
    ```sql
    LOAD DATA LOCAL INFILE '/home/mocatfrio/Downloads/dataset/books-10k.csv' INTO TABLE db_kutubuku.books
    FIELDS TERMINATED BY ','
    ENCLOSED BY '"'
    LINES TERMINATED BY '\n'
    (id, original_title, title, isbn, authors, publication_year, rating, ratingsCount, ratingsTotal, image_url)
    ```
    Setelah itu, data di export kembali dalam bentuk file .sql
4. Cek apakah data tereplikasi dengan baik di kedua node lainnya. Masuk ke dalam VM db2 dan db3
    ```bash
    vagrant ssh db2
    vagrant ssh db3
    ```
5. Masuk ke dalam shell mysql
    ```sql
    mysql -uroot -padmin
    ```  
6. Cek sesuai dengan keinginan, misalnya `show tables;`, `select count(*) from books;`, atau `select * from books limit 5;`
   
    ![Cek](img/ss4.png)
      
    ![Cek](img/ss5.png)
   
### 3.4 Aplikasi Web Flask
Ketika kita sedang mengembangkan sebuah aplikasi Python, lebih baik menggunakan **Virtualenv** supaya tidak mempengaruhi environment global.

> Keterangan : Pastikan sudah menginstall Python, Pip, dan Virtualenv

#### 3.4.1 Inisialisasi

1. Membuat dan berpindah ke direktori project **app-kutubuku**
    ```bash
    mkdir app-kutubuku
    cd app-kutubuku
    ```
   
2. Membuat **Virtualenv**
    ```bash
    virtualenv -p python2 venv
    ```
    Mengaktifkan Virtualenv
    ```bash
    source venv/bin/activate
    ```
    Menonaktifkan Virtualenv
    ```bash
    deactivate
    ```

3. Inisialisasi project dengan menginstall Flask (pastikan sudah masuk ke Virtualenv)
    ```bash
    pip install Flask
    ```

4. Menginstall library-library Python yang dibutuhkan. Kemudian catat ke sebuah file **requirements.txt**
    ```bash
    pip freeze > requirements.txt
    ```
#### 3.4.2 Deploy Web
1. Mengaktifkan Virtualenv
    ```bash
    source venv/bin/activate
    ```
2. Menginstall package yang dibutuhkan
    ```bash
    pip install -r requirements.txt
    ```
3. Export 
    ```bash
    export FLASK_CONFIG=development
    ```
4. Jalankan Aplikasi
    ```bash
    python manage.py run
    ```
    Output:
    ```bash
    * Serving Flask app "app" (lazy loading)
    * Environment: production
    WARNING: Do not use the development server in a production environment.
    Use a production WSGI server instead.
    * Debug mode: on
    * Running on http://0.0.0.0:8991/ (Press CTRL+C to quit)
    * Restarting with stat
    * Debugger is active!
    * Debugger PIN: 962-976-676
    ```
#### 3.4.3 Fitur Web
* Ada 2 role autentikasi, yakni Admin dan User
* Fitur Admin:
  1. Menambahkan data buku dan kategori buku (Create)
  2. Melihat data buku dan kategori buku (Read)
  3. Mengedit data buku dan kategori buku (Update)
  4. Menghapus data buku dan kategori buku (Delete)
* Fitur User:
  1. Melihat data buku (diurutkan berdasarkan rating tertinggi)
  2. Melihat detail buku
  3. Filter
  4. Search

#### 3.4.4 Struktur Direktori Web
```bash
├── app-kutubuku/
  ├── app/
  │   ├── admin/
  │   │   ├── __init__.py
  │   │   ├── forms.py
  │   │   └── views.py
  │   ├── auth/
  │   │   ├── __init__.py
  │   │   ├── forms.py
  │   │   └── views.py
  │   ├── home/
  │   │   ├── __init__.py
  │   │   ├── forms.py
  │   │   └── views.py
  │   ├── static/
  │   │   ├── css/
  │   │   ├── img/
  │   │   └── js/
  │   ├── templates/
  │   │   ├── admin/
  │   │   ├── auth/
  │   │   ├── home/
  │   │   └── main.html
  │   ├── __init__.py
  │   └── models.py
  ├── instance/
  │   └── config.py
  ├── config.py
  ├── manage.py
  ├── requirements.txt
  └── venv/
```
Keterangan:
* **manage.py** : File manajer yang berguna untuk menjalankan keseluruhan aplikasi
* **requirements.txt** : File yang menyimpan semua library Python yang dibutuhkan untuk diinstall
* **config.py** : Untuk menentukan environment (Development atau Production)
* **instance/config.py** : Menyimpan konfigurasi MySQL
* **app/** : Aplikasi utama
* **app/__init\__.py** : File yang menginisialisasi modul Python. Tanpa file ini, Python tidak akan mengenali direktori ini sebagai modul
* **app/admin/**, **app/auth/**, dan **app/home/** adalah Blueprint yang dibuat untuk memudahkan development
* **app/models.py** : File yang mendefinisikan Model. Model adalah yang merepresentasikan tabel database di dalam kode
* **app/*/views.py** : File yang mengatur routes
* **app/*/forms.py** : File yang mengatur forms yang difasilitasi oleh library python WTForms dan Flask-WTF 
* **app/templates** : Direktori yang menyimpan file HTML (front-end)
* **app/static** : Direktori yang menyimpan file static, seperti JS, CSS dan IMAGE

#### 3.4.5 Snippet Kode
1. Koneksi dengan MySQL Cluster
   * **instance/config.py**
      ```python
      import os

      SECRET_KEY = os.urandom(32)
      SQLALCHEMY_DATABASE_URI = 'mysql+mysqldb://admin_kutubuku:admin123@192.168.33.10:6033/db_kutubuku'
      ```
2. Koneksi dengan Redis
    * **app/__init\__.py**
      ```python
      # Redis cache
      cache = Cache(config={
              'CACHE_TYPE': 'redis',
              'CACHE_KEY_PREFIX': 'cache_',
              # 'CACHE_REDIS_URL': 'redis://192.168.33.14:6379'
              'CACHE_REDIS_URL': 'redis://192.168.33.15:6379'
              # 'CACHE_REDIS_URL': 'redis://192.168.33.16:6379'
              # 'CACHE_REDIS_URL': 'redis+sentinel://192.168.33.15:26379[,192.168.33.14:26379,192.168.33.16:26379]/redis-cluster/0'
              })
      ```
  
3. Model
   * **app/models.py**
      ```python
      # User model
      class User(UserMixin, db.Model):
        __tablename__ = 'user'

        id = db.Column(db.Integer, primary_key=True)
        email = db.Column(db.String(60), index=True, unique=True)
        username = db.Column(db.String(60), index=True, unique=True)
        name = db.Column(db.String(150), index=True)
        password_hash = db.Column(db.String(200))
        is_admin = db.Column(db.Boolean, default=False)

      # Book model
      class Book(db.Model):
        __tablename__ = 'books'

        book_id = db.Column(db.Integer, primary_key=True)
        original_title = db.Column(db.String(100))
        title = db.Column(db.String(100))
        isbn = db.Column(db.String(15))
        authors = db.Column(db.String(100))
        publication_year = db.Column(db.Integer)
        rating = db.Column(db.Float)
        ratingsCount = db.Column(db.Integer)
        ratingsTotal = db.Column(db.Float)
        image_url = db.Column(db.String(100))
        category_id = db.Column(db.Integer, db.ForeignKey('categories.category_id'))

      # Book Category model
      class Category(db.Model):
        __tablename__ = 'categories'

        category_id = db.Column(db.Integer, primary_key=True)
        category = db.Column(db.String(60))
        book = db.relationship('Book', backref='category', lazy='dynamic')
      ```
   
2. Manage server
   * **manage.py**
      ```python
      manager = Manager(app)

      manager.add_command("run", Server(
        use_debugger = True,
        use_reloader = True,
        host = '0.0.0.0',
        port = '8991')
      )

      if __name__ == '__main__':
        manager.run()   
      ```
n.b. Tutorial selengkapnya dapat dilihat di bagian referensi

## 4. Pengujian 
### 4.1 Pengujian MySQL Cluster
#### 4.1.1 Pengujian Koneksi

1. SSH ke semua VM mysql
    ```bash
    vagrant ssh db1
    vagrant ssh db2
    vagrant ssh db3
    vagrant ssh proxy
    ```

    ![SSH](img/ss2.png)

2. Pastikan bahwa user dapat melakukan koneksi ke MySQL Group Replication dari ProxySQL, dengan cara:
   ```sql
   mysql -u playgrounduser -p -h 192.168.33.10 -P 6033 --prompt='ProxySQLClient> '
   ```
   > IP Proxy: 192.168.33.10
   > MySQL port: 6033
   > Username: playgrounduser
   > Password: playgroundpassword
  
    ![Tes Koneksi 2](img/ss3.png)  

#### 4.1.2 Pengujian Replikasi dan High Availibility

### 4.2 Pengujian Redis Sentinel Cluster
#### 4.2.1 Pengujian Koneksi

1. SSH ke semua VM redis
    ```bash
    vagrant ssh redis1
    vagrant ssh redis2
    vagrant ssh redis3
    ```
2. Pastikan bahwa Redis Sentinel dapat diakses dari luar
   ```bash
   redis-cli -h <IP_Address> ping
   ```
   Misalnya
   ```bash
   redis-cli -h 192.168.33.14 ping
   ```
   Jika redis dapat diakses, maka output yang didapat adalah `PONG`

#### 4.2.2 Pengujian Replikasi dan High Availibility
1. Cek status replikasi pada masing-masing node redis
    ```bash
    cd redis-stable/
    
    redis-cli
    
    127.0.0.1:6379> info replication
    ```

    ![Tes Replikasi](img/ss8.png)

    Dapat dilihat bahwa node redis1 berperan sebagai master, sedangan redis2 dan redis3 adalah slave.
2. Tes replikasi
    * Pada salah satu node, misalnya redis1, buat key baru
      ```bash
      set demokey Amila
      ```
    * Kemudian cek pada semua node apakah demokey tereplikasi dengan baik
      ```bash
      get demokey
      ```
      ![Tes Replikasi](img/ss9.png)
3. Tes High Availibility (Redis Sentinel Automatic Failover)
    * Matikan service redis pada node redis1
      ```bash
      kill -9 <process id>
      ```
    * Cek status replikasi pada masing-masing node redis, maka akan ada perubahan master dari redis1 menjadi redis2
  
      ![Tes High Availibility](img/ss10.png)
  
    * Nyalakan kembali service redis1, maka redis1 akan menjadi node slave

      ![Tes High Availibility](img/ss11.png)

### 4.3 Pengujian Fitur Web
1. Nyalakan server web Flask
    ```bash
    python manage.py run
    ```
2. Ketik di browser `localhost:8991` 

3. Autentikasi (Ada 2 role, yaknis sebagai Admin dan User
4. Fitur Admin - Menambahkan data buku dan kategori buku (Create)
5. Fitur Admin - Melihat data buku dan kategori buku (Read)
6. Fitur Admin - Mengedit data buku dan kategori buku (Update)
7. Fitur Admin - Menghapus data buku dan kategori buku (Delete)
8. Fitur User - Melihat data buku (diurutkan berdasarkan rating tertinggi)
9. Fitur User - Melihat detail buku
10. Fitur User - Filter
11. Fitur User - Search

### 4.4 Pengujian Load Testing
Pengujian load testing dilakukan menggunakan **JMeter**. Tujuan dari pengujian ini adalah untuk membandingkan waktu akses halaman yang di-cache menggunakan Redis dengan yang tidak di-cache.

Hasilnya ada di dalam File Excel.

## 5. Referensi
* [Build a CRUD Web App With Python and Flask](https://scotch.io/tutorials/build-a-crud-web-app-with-python-and-flask-part-one)
* [Setting Redis Sentinel](https://medium.com/@amila922/redis-sentinel-high-availability-everything-you-need-to-know-from-dev-to-prod-complete-guide-deb198e70ea6)
* [Flask-SQLAlchemy Configuration](http://flask-sqlalchemy.pocoo.org/2.1/config/)