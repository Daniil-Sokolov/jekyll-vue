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

## Backup GPG Keys
>Just run these two commands, replacing THE_KEY_ID with your GPG key's ID, and changing the filenames if you wish.
>
>gpg -ao MyPublicKey.key --export THE_KEY_ID
>
>gpg -ao MyPrivateKey.key--export-secret-keys THE_KEY_ID
>
>You can then use scp to copy the files to your local computer. Now you can burn them to CDs to bury in the yard, put them on a USB drive to keep on your keyring, and print the contents out and mail them somewhere. (I'm not going to go to that extreme, but I'm keeping a copy on my laptop and in my Dropbox.)

## Resources
* [Using Duplicity & Duply on Ubuntu](http://old.blog.phusion.nl/2013/11/11/duplicity-s3-easy-cheap-encrypted-automated-full-disk-backups-for-your-servers/)
* [Duplicity & Amazon S3](https://rtcamp.com/tutorials/backups/duplicity-amazon-s3/)
* [Walk-through with Gist backup script](https://gist.github.com/janikvonrotz/9410478)
* [Duplicity + GPG Guide](http://www.problogdesign.com/how-to/automatic-amazon-s3-backups-on-ubuntu-debian/) -- includes stuff on auto DB backup, backup of GPG keys - READ THIS!
* [Backup Amazon S3 to Amazon Glacier](https://aws.amazon.com/blogs/aws/archive-s3-to-glacier/) - could be perfect solution for archiving older data
* [AWS CLI](http://docs.aws.amazon.com/cli/latest/userguide/installing.html)
* [Cloud backup with Duplicity and GPG](http://www.linux-magazine.com/Online/Features/Cloud-Backup-with-Duplicity) **Read this**
* [AWS Glacier CLI](https://github.com/basak/glacier-cli)
