#!/usr/bin/env bash

echo -e "\nUpdating full system...\n"
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get dist-upgrade -y
sudo apt-get auto-remove -y

echo -e "\nInstalling NGINX server...\n"
sudo apt-get install -y nginx
sudo ufw allow 'Nginx HTTP'

echo -e "\nInstalling PHP7.3...\n"
sudo apt-get install -y python-software-properties
sudo add-apt-repository -y ppa:ondrej/php
sudo apt-get update -y
sudo apt-get install -y \
    php7.3 \
    php7.3-fpm \
    php7.3-mbstring \
    php7.3-cgi \
    php7.3-cli \
    php7.3-common \
    php7.3-curl \
    php7.3-zip \
    php7.3-bcmath \
    php7.3-xml \
    php7.3-json \
    php7.3-mysql \
    php7.3-gd \
    php7.3-imagick
sudo phpenmod mbstring
sudo sed -i -e 's/;cgi.fix_pathinfo=1/cgi.fix_pathinfo=0/g' /etc/php/7.3/fpm/php.ini
sudo systemctl restart php7.3-fpm

echo -e "\nInstalling Composer...\n"
sudo apt-get install -y curl
curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer

echo -e "\nInstalling Node.JS & NPM...\n"
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install npm
sudo npm install --global npm
sudo npm install --global n
sudo n lts
sudo ln -sf /usr/local/bin/node /usr/bin/nodejs
