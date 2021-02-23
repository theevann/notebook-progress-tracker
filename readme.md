Utility to track live progress of an audience using python notebook. See this [documentation](docs/Python_Tracker.pdf) for details.

# Use

Check it online: https://courdier.pythonanywhere.com/

## Jupyter Extension for renumbering the notebook questions'
#### Auto installer (unix)
`bash <(curl -s https://raw.githubusercontent.com/theevann/notebook-progress-tracker/master/npt-jpt/download.sh)`

#### Manually

Clone this repo and `cd` into it, then:

```bash
pip install jupyter_contrib_nbextensions
jupyter contrib nbextensions install
jupyter nbextension install npt-jpt --user
jupyter nbextension enable npt-jpt/main
```


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

### Additionnal steps for development

```sh
npm install
npm run start  # to start snowpack watch & build
```

# Running the server
```sh
source nptenv/bin/activate
python flask_app.py
```



# Reference

This tool was created by Evann Courdier (EPFL) and Aymeric Dieuleveut (Ecole Polytechnique).

The code was developed by Evann Courdier.

Copyright (c) 2020 E. Courdier A. Dieuleveut

