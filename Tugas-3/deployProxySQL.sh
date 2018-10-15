cd /tmp
curl -OL https://github.com/sysown/proxysql/releases/download/v1.4.12/proxysql_1.4.12-ubuntu16_amd64.deb
sudo dpkg -i proxysql_1.4.12-ubuntu16_amd64.deb
sudo apt-get update
sudo apt-get install -y mysql-client
sudo systemctl start proxysql