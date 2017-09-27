---
layout: post
title: Encrypted Backup to Amazon S3 Using Duplicity
categories:
  - Backup
  - Server
  - Linux
author: David Egan
description: Encrypted Backup to Amazon S3 Using Duplicity
excerpt: Encrypted Backup to Amazon S3 Using Duplicity
---

Extend incremental backup to a central server to include backup to Amazon S3.

## Requirements
* [Duplicity](http://duplicity.nongnu.org/): "Encrypted bandwidth-efficient backup using the rsync algorithm"
* [AWS](https://aws.amazon.com/): Low cost & stable storage solutions
* [GNU Privacy Guard (GPG)](https://www.gnupg.org/): FOSS implementation of OpenPGP, for data encryption

## Set Up AWS
If you don't have an AWS account, set one up [here](https://portal.aws.amazon.com/gp/aws/developer/registration/index.html). If you have a personal Amazon account, you should probably set up a separate AWS account for professional purposes.

### Set Up a Bucket
* Sign in to the AWS Console
* Click on S3 to access the S3 Dashboard
* Click "Create Bucket"
* Enter bucket name and select a region, click "Create"

### Get AWS Security Credentials
* Click "Security Credentials" in the name dropdown on the AWS dashboard
* Click "Follow AWS Best Practice" and set up IAM User
* Go back to the Security Credentials page, open "Access Keys" and click "Create New Access Key"
* Download key data when prompted and store securely

## Set Up GPG Keys

@TODO
Checkout paperkey

## Backup Public GPG Keys
List public keys and determine key_id:

{% highlight bash startinline %}
gpg --list-keys
{% endhighlight %}

This will return something like this:
{% highlight bash startinline %}
pub   2048R/XXXXXXXX 2015-11-14
uid                  Jane Smith (Desktop Backup) <jane@yourweb.com>
sub   2048R/XXXXXXXX 2015-11-14
{% endhighlight %}

**The key_id is the alphanumeric string after `pub   2048R/`**

To export the public key:
{% highlight bash startinline %}
gpg -ao _your_label_-public.key --export key_id
{% endhighlight %}

## Backup Private GPG Keys
List secret keys:

{% highlight bash startinline %}
gpg --list-secret-keys
{% endhighlight %}

The alphanumeric string that follows `sec 1024D/` is the key_id.

To export the secret key:
{% highlight bash startinline %}
gpg -ao _your_label_-private.key --export-secret-keys key_id
{% endhighlight %}

## Restore GPG Keys
Copy `_your_label_-public.key` and `_your_label_-private.key` onto your machine. Run:

{% highlight bash startinline %}
gpg --import _your_label_-public.key
gpg --import _your_label_-private.key
{% endhighlight %}

## Secure Backup Media
For additional security, back up GPG keys to an encrypted USB drive.

You will need `cryptsetup` to encrypt the disk. If you don't have it, the format action will generate an error.

Install `cryptsetup`:
{% highlight bash startinline %}
sudo apt-get install cryptsetup
{% endhighlight %}

Set up the USB drive:

* In Ubuntu desktop, open the "Disks" utility
* Select the right drive (be careful!)
* Unmount and format the USB drive
* Select "Encrypted, compatible with Linux systems (LUKS + Ext4)" as the type
* Add a meaningful label - to ease command line usage, no spaces
* Enter and confirm a passphrase

You will need `cryptsetup` to encrypt the disk. If you don't have it, the format action will generate an error.

Install `cryptsetup`:
{% highlight bash startinline %}
sudo apt-get install cryptsetup
{% endhighlight %}

You'll now be prompted for your passphrase when you attempt to mount the disk.

## Resources
* [Duplicity docs](http://duplicity.nongnu.org/docs.html)
* [Using Duplicity & Duply on Ubuntu](http://old.blog.phusion.nl/2013/11/11/duplicity-s3-easy-cheap-encrypted-automated-full-disk-backups-for-your-servers/)
* [Duplicity & Amazon S3](https://rtcamp.com/tutorials/backups/duplicity-amazon-s3/)
* [Walk-through with Gist backup script](https://gist.github.com/janikvonrotz/9410478)
* [Duplicity + GPG Guide](http://www.problogdesign.com/how-to/automatic-amazon-s3-backups-on-ubuntu-debian/) -- includes stuff on auto DB backup, backup of GPG keys - READ THIS!
* [Backup Amazon S3 to Amazon Glacier](https://aws.amazon.com/blogs/aws/archive-s3-to-glacier/) - could be perfect solution for archiving older data
* [AWS CLI](http://docs.aws.amazon.com/cli/latest/userguide/installing.html)
* [Cloud backup with Duplicity and GPG](http://www.linux-magazine.com/Online/Features/Cloud-Backup-with-Duplicity) **Read this**
* [AWS Glacier CLI](https://github.com/basak/glacier-cli)
* [Ubuntu GPG How-To](https://help.ubuntu.com/community/GnuPrivacyGuardHowto)
