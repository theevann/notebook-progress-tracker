# Install MySQL
sudo apt-get update
sudo apt-get install mysql-server libmysqlclient-dev
sudo systemctl start mysql
sudo systemctl enable mysql


# If needed to set root pwd for my SQL
# sudo mysqld_safe --skip-grant-tables&
# sudo mysql --user=root mysql
# mysql> update user set authentication_string=PASSWORD('rootpwd') where user='root';
# flush privileges;
# quit
# sudo service mysql restart

# Check it worked
# sudo mysql -u root -p
# exit


# Clone project, create virtualenv, create DB
git clone https://github.com/theevann/notebook-progress-tracker.git
cd notebook-progress-tracker
virtualenv nptenv
source nptenv/bin/activate
pip install -r requirements.txt

# Create the database and the user
sudo mysql -u root < create_db.sql
python make_db.py