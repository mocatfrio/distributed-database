sudo apt update
sudo debconf-set-selections <<< 'mysql-server mysql-server/root_password password admin'
sudo debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password admin'
sudo apt install -y mysql-server mysql-client
sudo cp /vagrant/my12.cnf /etc/mysql/my.cnf
sudo service mysql start