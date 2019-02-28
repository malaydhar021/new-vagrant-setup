#!/usr/bin/env bash

echo -e "\nInstalling MySQL Server..."
sudo apt-get install -y mysql-server mysql-client
sudo mysql_secure_installation
sudo sed -i 's/.*bind-address.*/bind-address = 0.0.0.0/' /etc/mysql/mysql.conf.d/mysqld.cnf
sudo service mysql restart
echo -e -n "\nCreating database, please re-enter your MySQL root password: "
read db_pwd
echo "CREATE DATABASE stickyreviews DEFAULT COLLATE utf8_unicode_ci DEFAULT CHARACTER SET utf8" | mysql -u root -p$db_pwd
echo "GRANT ALL PRIVILEGES ON stickyreviews.* TO 'root'@'%' WITH GRANT OPTION;" | mysql -u root -p$db_pwd
echo "CREATE USER 'root'@'%' IDENTIFIED BY '${db_pwd}'" | mysql -u root -p$db_pwd
echo "FLUSH PRIVILEGES;" | mysql -u root -p$db_pwd

echo -e "\nRe-wiring PHP 7.3 Fast CGI Processor for ${USER}\n"
sudo cp /etc/php/7.3/fpm/pool.d/www.conf /etc/php/7.3/fpm/pool.d/www.conf.bak
sudo sed -i 's/\[www\]/\[vagrant\]/' /etc/php/7.3/fpm/pool.d/www.conf
sudo sed -i '0,/user = www-data/s/user = www-data/user = vagrant/' /etc/php/7.3/fpm/pool.d/www.conf
sudo sed -i '0,/group = www-data/s/group = www-data/group = vagrant/' /etc/php/7.3/fpm/pool.d/www.conf

echo -e "\nCreating symlinks and re-configuring permissions...\n"
sudo mkdir -p /var/log/nginx/api /var/log/nginx/app /var/log/nginx/lib /var/log/nginx/www
sudo chown www-data:adm -R /var/log/nginx/
sudo rm /etc/nginx/sites-enabled/*
sudo ln -sf /vagrant/config/nginx/api.conf /etc/nginx/sites-enabled/
sudo ln -sf /vagrant/config/nginx/app.conf /etc/nginx/sites-enabled/
sudo ln -sf /vagrant/config/nginx/lib.conf /etc/nginx/sites-enabled/
sudo ln -sf /vagrant/config/nginx/www.conf /etc/nginx/sites-enabled/
sudo ln -sf /vagrant/ /var/www/
sudo usermod -a -G www-data $USER
sudo chown -R $USER:www-data /var/www/vagrant/
sudo service nginx restart

echo -e "\nConfiguring project...\n"
cd api
sudo chmod a+w -R bootstrap/cache storage
composer install
sudo cp -f .env.example .env
sed -i -e 's/APP_NAME=Laravel/APP_NAME="Sticky Reveiws"/g' .env
sed -i -e 's/APP_URL=http:\/\/localhost\/api/APP_URL=https:\/\/api.local.usestickyreviews.com/g' .env
sed -i -e 's/REDIRECT_URL=http://localhost/REDIRECT_URL=https:\/\/app.local.usestickyreviews.com/g' .env
sed -i -e 's/DB_DATABASE=homestead/DB_DATABASE=stickyreviews/g' .env
sed -i -e 's/DB_USERNAME=homestead/DB_USERNAME=root/g' .env
sed -i -e 's/DB_PASSWORD=secret/DB_PASSWORD='$db_pwd'/g' .env
php artisan key:generate
cd ../widget
cp -f .env .env.local
sed -i -e 's/API_HOST=http:\/\/localhost:8080/API_HOST=https:\/\/api.local.usestickyreviews.com/g' .env.local
