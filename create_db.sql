CREATE DATABASE npt;
SHOW DATABASES;
INSERT INTO mysql.user (User,Host,authentication_string,ssl_cipher,x509_issuer,x509_subject)
VALUES('npt-user','localhost',PASSWORD('npt-password'),'','','');
FLUSH PRIVILEGES;
SELECT User, Host, authentication_string FROM mysql.user;
GRANT ALL PRIVILEGES ON npt.* to 'npt-user'@localhost;
FLUSH PRIVILEGES;
SHOW GRANTS FOR 'npt-user'@'localhost';

