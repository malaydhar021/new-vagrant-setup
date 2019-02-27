#!/usr/bin/env bash

sudo service nginx restart

echo "Vagrant boot time: $(date)" >> /vagrant/bootstrap.log
