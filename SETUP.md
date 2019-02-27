# Setup Instructions

Before starting following procedures make sure you have **VirtualBox** and
**Vagrant** installed on your development workstation, if not you could find
there respective download links below.

- [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
- [Vagrant](https://www.vagrantup.com/downloads.html)

We are going to follow the following nomencleture for rest of the document,

**Guest**: Vagrant box
**Host**: Your development machine's OS

To set up this project please follow the procedures below.

1. Initiate the Guest environment

    ```bash
    vagrant up
    ```

2. After Vagrant is provisioned login to the guest

    ```bash
    vagrant ssh
    ```

3. Run post-provision script in guest

    ```bash
    scripts/post-provision.sh
    ```

4. If you have a local copy of the database in a SQL file then create a directory with name `sql` and move the SQL file to `sql` directory with name `stickyreviews.sql`, then import the file from guest.

    ```bash
    mysql -u root stickyreviews -p < sql/stickyreviews.sql
    ```

5. From host run `host-configurer.sh` to finalise the setup and link guest with host

    ```bash
    scripts/host-configurer.sh
    ```

6. Now everything is set up and you are ready to code. To acess the landing page, application, widget and API open the following links in your host machine's web browser and make sure everything is working properly.

- [api.local.usestickyreviews.com](api.local.usestickyreviews.com)
- [app.local.usestickyreviews.com](app.local.usestickyreviews.com)
- [lib.local.usestickyreviews.com](lib.local.usestickyreviews.com/widget.min.js)
- [www.local.usestickyreviews.com](www.local.usestickyreviews.com)

__P.S.__ You are going to get an SSL security exception in browser, just click on "trust and remember the certificate" or "confirm security exception" button and it will open.

Happy coding! :metal:
