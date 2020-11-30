mkdir npt-jpt
cd npt-jpt
wget https://raw.githubusercontent.com/theevann/notebook-progress-tracker/master/npt-jpt/README.md
wget https://raw.githubusercontent.com/theevann/notebook-progress-tracker/master/npt-jpt/main.js
wget https://raw.githubusercontent.com/theevann/notebook-progress-tracker/master/npt-jpt/description.yaml
cd ..

echo "Try to install ?"
read install
if [[ $install == [Yy]* ]]; then
    pip3 install jupyter_contrib_nbextensions
    jupyter contrib nbextensions install --user
    jupyter nbextension install npt-jpt --user
    jupyter nbextension enable npt-jpt/main
fi

# bash <(curl -s https://raw.githubusercontent.com/theevann/notebook-progress-tracker/master/npt-jpt/download.sh)