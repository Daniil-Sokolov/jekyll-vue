---
layout: post
title: Incremental Backup using rsync with Hardlinks
categories: Linux Backup rsync
author: David Egan

excerpt: Resource efficient incremental backups for Production server.
---
This method involves an incremental backup bash script that runs on a production server. The aim is to automatically build a local backup which can then be synchronised with a remote backup server.

## Production Server: Backup User
Create a backup user - without sudo privileges.

## Production Server: Source Directory
Create a directory called ```/home/backupuser/source```. This will be used as the source for the local rsync, so it forms a target for:

* a MySQL backup - mysqldump dumps database copies to ```/home/backupuser/source/sql```
* Symlinks to config files (in ```/home/backupuser/source/config```)
* Symlinks to site files (from the Apache root directory - ```/var/www/html```)

Set up directories and add symlinks to ```/source```:

{% highlight bash  startinline %}
sudo mkdir -p /home/backupuser/source/config # make the config directories
sudo mkdir /home/backupuser/source/sql # target for mysqldump
sudo ln -s /var/www/html /home/backupuser/source # Symlink site files
sudo ln -s /etc/apache2 /home/backupuser/source/config # Symlink Apache config files (including vhosts setup)
sudo ln -s /etc/mysql /home/backupuser/source/config # Symlink MySQL config files
{% endhighlight %}

## Production Server: Incremental Backup

Incremental backup script:
{% highlight bash  startinline %}
#!/bin/bash
#
# Website Backup Script for SERVER
#
# Add this script as a cronjob to run daily. It creates an archive of incremental
# backups, with the current date set as the name of the backup directory.
# Assumes the script is run from /usr/local/sbin.
# ------------------------------------------------------------------------------

# Todays date in ISO-8601 format:
# ------------------------------------------------------------------------------
DAY0=$(date -I)
TIMESTAMP=$(date '+%Y-%m-%d at %H:%M:%S')

# Yesterdays date in ISO-8601 format:
# ------------------------------------------------------------------------------
DAY1=$(date -I -d "1 day ago")

# The source directory: this should contain a symlink to Apache doc root.
# ------------------------------------------------------------------------------
SRC="/home/servernamebackup/source/"

# The target directory
# ------------------------------------------------------------------------------
TRG="/home/servernamebackup/backup/$DAY0"

# The link destination directory
# ------------------------------------------------------------------------------
LNK="/home/servernamebackup/backup/$DAY1"

# Backup databases
# ------------------------------------------------------------------------------
USER="root"
PASSWORD="XXXXXXXXXXXXXXXXXXXXXXXXXX"
HOST="localhost"
DB_BACKUP_PATH="${SRC}sql"

# Get list of databases, but not 'Database' or 'information_schema'
# ------------------------------------------------------------------------------
DATABASES=$(mysql --user=$USER --password=$PASSWORD -e "SHOW DATABASES;" | grep -Ev "(Database|information_schema)")

DUMPFAIL=false

# Remove previous dumped databases
# ------------------------------------------------------------------------------
rm $DB_BACKUP_PATH/*

# Set up log
# ------------------------------------------------------------------------------
echo "Database backup report. ${TIMESTAMP}" > $DB_BACKUP_PATH/DB_LOG
echo "=======================================" >> $DB_BACKUP_PATH/DB_LOG

# Create dumps for each database
# ------------------------------------------------------------------------------
for DB in $DATABASES
do

  mysqldump -v --user=$USER --password=$PASSWORD --single-transaction --log-error=$DB_BACKUP_PATH/$DB.log --host=$HOST $DB > $DB_BACKUP_PATH/$DB.sql

  # Reportage - log result of mysqldump
  # ----------------------------------------------------------------------------
  if [[ $? -eq 0 ]]

  then

    echo -e "Mysqldump created ${DB}.sql\n" >> $DB_BACKUP_PATH/DB_LOG

  else

    echo "Mysqldump encountered a problem backing up ${DB}. Look in ${DB_BACKUP_PATH}/${DB}.log for information.\n" >> $DB_BACKUP_PATH/DB_LOG
    $DUMPFAIL=true

  fi

done

# The rsync options: follow the symlinks to make a hard backup
# ------------------------------------------------------------------------------
OPT=(-avL --progress --delete --link-dest=$LNK)

# Execute the backup
# ------------------------------------------------------------------------------
rsync "${OPT[@]}" $SRC $TRG

# Log Results
# ------------------------------------------------------------------------------
if [[ $? -gt 0 ]]
then

  # rsync Failure
  # ----------------------------------------------------------------------------
  echo "ERROR. rsync didn't complete the nightly backup: ${TIMESTAMP}" >> /var/log/server-backup.log
  echo "There was an error in the nightly backup for <servername>: ${TIMESTAMP}"| mail -s "Backup Error, <servername>" info@yourdomain.com

else

  # rsync Success
  # ----------------------------------------------------------------------------
  if [[ false == $DUMPFAIL ]]

    # rsync & mysqldump worked OK
    # --------------------------------------------------------------------------
    then

      echo "SUCCESS. Backup made on: ${TIMESTAMP}" >> /var/log/server-backup.log

      # email the report
      # ------------------------------------------------------------------------
      echo -e "${TIMESTAMP}: Server <servername> successfully ran a local backup.\nBoth rsync & mysqldump report success."| mail -s "Backup Success, <servername>" info@yourdomain.com

    # rsync worked but there was at least one mysqldump error
    # --------------------------------------------------------------------------
    else

      echo "PARTIAL SUCCESS. File backup (rsync) was successful, but mysqldump reports errors: ${TIMESTAMP}" >> /var/log/server-backup.log

      # email the report
      # ------------------------------------------------------------------------
      echo -e "${TIMESTAMP}: Server <servername> ran a local backup.\nFile backup reports success, however mysqldump reports at least one problem.\nCheck "| mail -s "Backup: Partial Success, <servername>" info@yourdomain.com

  fi

fi

{% endhighlight %}

* Add the incremental backup script to ```/usr/local/sbin```
* Make executable
* Set up cronjob

{% highlight bash  startinline %}
# Upload script
rsync --progress -a -v -rz -e "ssh -p 1234" ~/bash-projects/remote-backup-scripts/servername/backup-servername daviduser@123.456.789.0:~/

# Move into position
sudo mv ~/backup-servername /usr/local/sbin

# Make executable
sudo chmod u+x /usr/local/sbin/backup-servername

# Open crontable
sudo crontab -e

# Add the following to the crontab, save and exit
# Run backup script every day at 3 am
00 03 * * * /usr/local/sbin/backup-servername
# Send an email report from this cronjob
MAILTO=info@yourdomain.com

{% endhighlight %}


## Result
This will result in a backup directory on the production server, ```/home/backupuser/backup```, that contains dated incremental backups.

The Production backup directory can then be targeted by a Backup server, again via rsync. Typically, this might involve:

* Access to the backup directory by means of SSH public/private key pair
* rrsync access for the backupuser - only rsync can run on the given SSH key, restricted to read-only

## Resources
* [Incrementally numbered backups, using rsync](https://jimmyg.org/blog/2007/incremental-backups-using-rsync.html)
* [Example bash script using rsync for local and remote backups](http://stromberg.dnsalias.org/~strombrg/Backup.remote.html)
* [rsync & cp for hardlinks](http://earlruby.org/2013/05/creating-differential-backups-with-hard-links-and-rsync/)
* [Snapshot backup  - rsync with hardlinks - with detailed examples](http://www.pointsoftware.ch/en/howto-local-and-remote-snapshot-backup-using-rsync-with-hard-links/)
* [Basic rsync examples](http://www.thegeekstuff.com/2010/09/rsync-command-examples/)
* [rsync man page - surprisingly helpful!](http://linux.die.net/man/1/rsync)
* [Time machine/rsync with good illustration of hard links](http://linux.die.net/man/1/rsync) - good sample "instant backup" script - backup every minute!
* [mysqldump status](http://serverfault.com/questions/249853/does-mysqldump-return-a-status)
