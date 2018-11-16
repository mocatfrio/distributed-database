# Install NodeJS
# Step 1: Install g++
sudo apt-get install gcc g++ make
# Step 2; Download NodeJS + install nodejs dan npm
curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -
sudo apt-get install -y nodejs npm
# Step 3; NPM install
cd /var/www/project
sudo npm install
# Step 3; Install project manager untuk NodeJS + start pm2
sudo npm install -g pm2
sudo bash -c \\"sudo ln -s /usr/bin/nodejs /usr/bin/node\\"
pm2 start /var/www/project/app.js