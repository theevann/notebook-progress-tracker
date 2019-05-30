#!/bin/bash

# Install MySQL
sudo apt-get update
sudo apt-get -y install mysql-server libmysqlclient-dev
sudo systemctl start mysql
sudo systemctl enable mysql

# Create virtualenv and install dependencies
virtualenv -p python3 nptenv
source nptenv/bin/activate
pip install -r requirements.txt
cp app-env-example app-env

# Create the database, the user and the tables
sudo mysql -u root < create_db.sql
python make_db.py




## If needed to set root pwd for my SQL

# sudo mysqld_safe --skip-grant-tables&
# sudo mysql --user=root mysql
# mysql> update user set authentication_string=PASSWORD('rootpwd') where user='root';
# flush privileges;
# quit
# sudo service mysql restart

# sudo mysql -u root -p
# exit
