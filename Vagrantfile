# -*- mode: ruby -*-
# vi: set ft=ruby :
Vagrant.configure("2") do |config|
  # https://docs.vagrantup.com.
	config.vm.box = "ubuntu/xenial64"
  config.vm.box_check_update = true
	config.vm.hostname = "stickyreviews"
	config.vm.define "stickyreviews"
  config.vm.network "private_network", ip: "192.168.15.68"
  config.vm.provider "virtualbox" do |vb|
    vb.name = "stickyreviews"
    vb.memory = "2048"
    vb.customize [ "modifyvm", :id, "--uartmode1", "disconnected" ]
  end
  config.vm.synced_folder ".", "/vagrant", owner: "vagrant", group: "www-data", :mount_options => ['dmode=774','fmode=775']
  config.vm.provision :shell, path: 'scripts/provisioner.sh', run: 'initial'
	config.vm.provision :shell, path: 'scripts/bootstrap.sh', run: 'always'
end
