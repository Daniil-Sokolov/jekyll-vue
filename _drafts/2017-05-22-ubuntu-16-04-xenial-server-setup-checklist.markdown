---
layout: "post"
title: "Ubuntu 16.04 Xenial Server Setup Checklist"
date: "2017-05-22 11:50"
categories: [Server, Sysadmin, Linux, Ubuntu]
---
Instructions for setting up a Ubuntu server with LAMP stack on a virtual private server.

1. Install Ubuntu
2. Set hostname
3. Create a new user with sudo privilege
4. Set up SSH keys for the new user
5. Restrict SSH access: change port, no root login, no passwords (SSH keys only)
6. Install & configure git
7. Link to remote git repos (share public key: Bitbucket, GitHub)
8. Install sysadmin tools
9. Install firewall
10. Setup LAMP stack
11. Create mySQL backup user
12. Build backup procedure

## Install Ubuntu
This is usually done at the VPS provider level (Linode, Digital Ocean, AWS) when setting up a new VPS.

**Set a strong root password at this point - before starting the VPS.**

## Set Hostname & FQDN
Set the hostname:
{% highlight bash startinline %}
# Replace 'plato' with the chosen hostname
hostnamectl set-hostname plato
{% endhighlight %}

The Fully Qualified Domain Name(FQDN) generally refers to the hostname followed by the DNS domain name (the part after the first dot). The most straightforward way to set the FQDN is by amending `/etc/hosts` as shown below.

The `/etc/hosts` file creates static associations between IP addresses and hostnames. It has a higher priority than DNS.

The first line of the hosts file should be:
{% highlight bash startinline %}
127.0.0.1 localhost.localdomain localhost
{% endhighlight %}

Add a line for the VPS public IP address (you should be able to find this in the Linode/Digital Ocean control panel):

{% highlight bash startinline %}
127.0.0.1 localhost.localdomain localhost
# Associate the public IP with the FQDN and hostname
# Replace 'X.X.X.X' with the server's public IP address and 'plato' with your hostname
X.X.X.X plato.example.com plato
# If IPv6 is enabled
X:X::X:X:X:X plato.example.com plato
{% endhighlight %}

In this case, the FQDN is set to `plato.example.com`.

**Note** that the domain part of the FQDN does not need to relate to sites hosted on the server. It is recommended that the FQDN should have a DNS "A" record to your VPS's IPv4 address. If IPv6 is enabled, you should also set up a DNS "AAAA" record pointing to the public IPv6 address.

Restart hostname service without a reboot:
{% highlight bash startinline %}
systemctl restart systemd-logind.service
{% endhighlight %}

References:
* [Hostname, Ubuntu manpages](http://manpages.ubuntu.com/manpages/xenial/man1/hostname.1.html)
* [Linode guide to setting the hostname](https://www.linode.com/docs/getting-started#setting-the-hostname)

## New User
Create user & add sudo privileges:
{% highlight bash startinline %}
# replace 'yourname' with the new username
adduser yourname
gpasswd -a yourname sudo
{% endhighlight %}

Add local SSH public key to the server for this user:

{% highlight bash startinline %}
# On local machine
# Substitute actual values for username and server IP address
ssh-copy-id username@123.45.56.78
{% endhighlight %}

## Harden SSH Access
Backup the SSH Config file:
{% highlight bash startinline %}
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak
{% endhighlight %}

Open SSH config for editing:
{% highlight bash startinline %}
sudo nano /etc/ssh/sshd_config
{% endhighlight %}

Change the default port for SSH by amending the first line of this file. Many brute force hacking attempts target the default SSH port - 22.

Changing the port can reduce the number of malicious login attempts drastically. Change the SSH port number to something between 1025 and 65536.

Restrict root login so it is either disabled entirely (preferred) or only possible via SSH key (NOT Password). Disable password logins (require SSH keys).

{% highlight bash startinline %}
# Amend the PermitRootLogin entry to:
PermitRootLogin without-password
# ...or prevent root login access altogether (preferred)
PermitRootLogin no

# Disable password-based connections
# Change to no to disable tunnelled clear text passwords
PasswordAuthentication no

{% endhighlight %}

Ctrl+o to save, Ctrl+x to exit. Then reload ssh:
{% highlight bash startinline %}
sudo reload ssh
{% endhighlight %}

Try and connect in a new terminal **before closing the open terminal!**

## SSH Login - Non Standard Port

Assuming the SSH port has been set to '1234':

SSH login:
{% highlight bash startinline %}
ssh -p 1234 user@12.34.567.89
{% endhighlight %}

Using scp:
{% highlight bash startinline %}
# Note: uppercase P is necessary - lowercase p is an scp switch.
scp -P 1234 username@12.34.567.89:/path/file.txt
{% endhighlight %}

Using rsync:
{% highlight bash startinline %}
rsync -e "ssh -p 1234" local/path/ user@12.34.567.89:/remote/path
{% endhighlight %}

## Install and Set Up Git
Set up git and connect via SSH keys to remote repos.

{% highlight bash startinline %}
sudo apt-get update
sudo apt-get install git

# Configure git
git config --global color.ui true
git config --global user.name "Firstname Lastname"
git config --global user.email "you@example.com"
{% endhighlight %}

Connect to GitHub or Bitbucket: generate an SSH key for your user, and add the public key to the required service.

**Set a secure passphrase during the key generation process.**

{% highlight bash startinline %}
# Generate a key with a unique comment/label
ssh-keygen -t rsa -b 4096 -C "you@example.com on xenial-name"
{% endhighlight %}

Copy the public key and add it to GitHub/Bitbucket:
{% highlight bash startinline %}
cat ~/.ssh/id_rsa.pub
# Highlight and copy to clipboard using ctrl shift c.
{% endhighlight %}

## Firewall
Install the firewall builder into a suitable directory. Set variables and run to build the firewall.
{% highlight bash startinline %}
cd
mkdir sysadmin
cd sysadmin
git clone git@bitbucket.org:carawebs/firewall.git

cd firewall

# Make scripts executable
sudo chmod +x simple-firewall
sudo chmod +x build-firewall

# Create a symlink for convenience
sudo ln -s ~/sysadmin/firewall/build-firewall /usr/local/sbin/build-firewall
sudo ln -s ~/sysadmin/firewall/simple-firewall /usr/local/sbin/simple-firewall

# Set relevant variables
cp variables.sample variables
sudo nano variables

# Run:
sudo build firewall

# Check rules:
sudo iptables -S
{% endhighlight %}

Note that firewall rules are held in memory - they won't persist across reboots.

Use `iptables-persistent` to load rules on boot.

**Important**: if you change rules, run `sudo dpkg-reconfigure iptables-persistent` to re-save the firewall rules.
