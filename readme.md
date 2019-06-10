# Installation

## Automatic
On ubuntu, clone the project and launch the install script:
```sh
git clone https://github.com/theevann/notebook-progress-tracker.git
cd notebook-progress-tracker && sudo ./install.sh
```

## Manual

### Install MySQL
```sh
sudo apt-get update
sudo apt-get install mysql-server libmysqlclient-dev
sudo systemctl start mysql
sudo systemctl enable mysql
```

### Clone the project, make a virtualenv and install dependencies
```sh
git clone https://github.com/theevann/notebook-progress-tracker.git
cd notebook-progress-tracker
virtualenv -p python3 nptenv
source nptenv/bin/activate
pip install -r requirements.txt
```

### Create the database, user and tables
```sh
cp app-env-example app-env
sudo mysql -u root < create_db.sql
export FLASK_APP=flask_app.py
flask db upgrade
```

# Running the server
```sh
source nptenv/bin/activate
python flask_app.py
```
