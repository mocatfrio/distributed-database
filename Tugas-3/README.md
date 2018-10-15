### Tugas 3 Basis Data Terdistribusi
# Implementasi Parallel DBMS
Oleh: **Hafara Firdausi (05111540000043)**
https://github.com/mocatfrio/bdt-2018/tree/master/Tugas-3

## Outline
- [Implementasi Parallel DBMS](#implementasi-parallel-dbms)
    - [Outline](#outline)
    - [Deskripsi Tugas](#deskripsi-tugas)
    - [Referensi](#referensi)

## Deskripsi Tugas
Mengimplementasikan Parallel DBMS dengan langkah-langkah sebagai berikut:
1. Membuat:
   * 1 Node ProxySQL Server + LAMPP stack
   * 3 Node MySQL Group Replication Database
   
  ![Diagram](/Tugas-3/img/diagram.png)

2. Menginstall CMS (Wordpress) di ProxySQL Server
3. Melakukan simulasi proses replikasi basis data dan high availability:
    * Tes dengan cara mematikan salah satu server database
    * Pastikan data yang ada selalu tereplikasi ke node yang lain

## Referensi
* https://www.digitalocean.com/community/tutorials/how-to-configure-mysql-group-replication-on-ubuntu-16-04
* https://www.digitalocean.com/community/tutorials/how-to-use-proxysql-as-a-load-balancer-for-mysql-on-ubuntu-16-04#step-8-%E2%80%94-verifying-the-proxysql-configuration