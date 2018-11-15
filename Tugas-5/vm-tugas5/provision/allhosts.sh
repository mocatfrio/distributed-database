# Declare host
sudo bash -c \\"echo '192.168.33.10 db-master' >> /etc/hosts\\"
sudo bash -c \\"echo '192.168.33.11 db-node1' >> /etc/hosts\\"
sudo bash -c \\"echo '192.168.33.12 db-node2' >> /etc/hosts\\"

# Copy sources.list
sudo cp '../sources.list' '/etc/apt/sources.list'

# Install MongoDB
# Step 1: Import the MongoDB public key
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
# Step 2: Generate a file with the MongoDB repository URL
sudo bash -c \\"echo 'deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.6 multiverse' | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list\\"
# Step 3: Refresh the local database with the packages
sudo apt-get update
# Step 4: Install the last stable MongoDB
sudo apt-get install -y mongodb-org
# Step 5: Enable MongoDB service
sudo systemctl enable mongod    
sudo systemctl start mongod