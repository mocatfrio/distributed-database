-- meminta SSL untuk user replikasi, memberikan user privilage untuk replikasi di server, kemudian mem-flush privilage untuk menerapkan perubahan
SET SQL_LOG_BIN=0;
CREATE USER 'repl'@'%' IDENTIFIED BY 'password' REQUIRE SSL;
GRANT REPLICATION SLAVE ON *.* TO 'repl'@'%';
FLUSH PRIVILEGES;
SET SQL_LOG_BIN=1;

-- mengatur channel group_replication_recovery untuk menggunakan user replikasi 
CHANGE MASTER TO MASTER_USER='repl', MASTER_PASSWORD='password' FOR CHANNEL 'group_replication_recovery';
INSTALL PLUGIN group_replication SONAME 'group_replication.so';