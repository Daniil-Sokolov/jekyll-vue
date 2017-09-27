---
layout: "post"
title: "Verification of Bitcoin Core Download in Ubuntu"
date: "2017-07-01 10:09"
categories: [Bitcoin, Verification, Security, Cryptocurrency]
excerpt: Install Bitcoin Core in Ubuntu 16.04 - how to download and verify from bitcoin.org.
showOnFront: true
---
There are numerous ways to install Bitcoin Core in Ubuntu:

* via [PPA](https://launchpad.net/~bitcoin/+archive/ubuntu/bitcoin)
* Cloning from Github
* Downloading the binaries from [https://bitcoin.org/en/download](https://bitcoin.org/en/download)

## Install Via Downloaded Package from bitcoin.org
Download Bitcoin Core:
[https://bitcoin.org/en/download](https://bitcoin.org/en/download)

Select Linux (tgz), which will trigger a download - at the time of writing: `bitcoin-0.14.2-x86_64-linux-gnu.tar.gz`.

### Verification
Download the release signature document. At the time of writing, this is here: [https://bitcoin.org/bin/bitcoin-core-0.14.2/SHA256SUMS.asc](https://bitcoin.org/bin/bitcoin-core-0.14.2/SHA256SUMS.asc). This downloads `SHA256SUMS.asc`.

This file is a signed PGP message that contains the SHA256 sums for the various Bitcoin core downloads. By comparing the relevant value with the SHA256 sum of the `bitcoin-0.14.2-x86_64-linux-gnu.tar.gz` that you have downloaded, you can verify the authenticity of what you have downloaded.

You should first verify that the signature document itself is authentic. This is done using [Gnu Privacy Guard (GPG)](https://www.gnupg.org)

### Verification of the Signatures Document
Download the relevant GPG signing key - these are presented on the [download page]((https://bitcoin.org/en/download)) under the title "Bitcoin Core Release Signing Keys". Click the correct version to download the relevant key. At the time of writing, this is `laanwj-releases.asc`.

Your `~/Downloads` directory should now contain:

{% highlight bash startinline %}
david@desktop:~/Downloads$ ls -la
total 24164
drwxr-xr-x  2 david david     4096 Jun 29 19:27 .
drwx------ 47 david david    12288 Jun 29 19:14 ..
-rw-rw-r--  1 david david 24607581 Jun 29 18:21 bitcoin-0.14.2-x86_64-linux-gnu.tar.gz
-rw-rw-r--  1 david david    17940 Jun 29 18:57 laanwj-releases.asc
-rw-rw-r--  1 david david     1957 Jun 29 18:55 SHA256SUMS.asc
{% endhighlight %}

### Import the Public Key
Move into your `~/Downloads` directory and run:

{% highlight bash startinline %}
gpg --import laanwj-releases.asc
gpg: /home/david/.gnupg/trustdb.gpg: trustdb created
gpg: key 36C2E964: public key "Sender Name (Bitcoin Core binary release signing key) <sender@example.com>" imported
gpg: Total number processed: 1
gpg:               imported: 1  (RSA: 1)
gpg: no ultimately trusted keys found

# Verify that key was imported:
gpg --list-keys
/home/david/.gnupg/pubring.gpg
------------------------------
pub   4096R/36C2E964 2015-06-24 [expires: 2019-02-14]
uid                  Sender Name (Bitcoin Core binary release signing key) <sender@example.com>
{% endhighlight %}

### Check Signatures Document
You can now establish the authenticity of the signatures document by running:

{% highlight bash startinline %}
gpg --verify SHA256SUMS.asc
gpg: Signature made Sat 17 Jun 2017 11:33:26 IST using RSA key ID 36C2E964
gpg: Good signature from "Sender Name (Bitcoin Core binary release signing key) <sender@example.com>"
gpg: WARNING: This key is not certified with a trusted signature!
gpg:          There is no indication that the signature belongs to the owner.
Primary key fingerprint: ...
{% endhighlight %}

### Check the Authenticity of the Download: SHA256 Checksum
You can now use the signatures document to establish the authenticity of the Bitcoin download.

{% highlight bash startinline %}
cd ~/Downloads

sha256sum -c SHA256SUMS.asc 2>&1 | grep OK

# If all is OK, this will be the result:
bitcoin-0.14.2-x86_64-linux-gnu.tar.gz: OK
{% endhighlight %}

**Note:** the tar.gz file provided for download doesn't appear to contain source files (as suggested [here](https://en.bitcoin.it/wiki/Using_Bitcoin#Download_and_install_the_client)), so you can't use this to compile. It does include binaries.

## Install Via Github
You can clone Bitcoin source code from Github, and compile from this.

{% highlight bash startinline %}
cd ~
git clone https://github.com/bitcoin/bitcoin.git
{% endhighlight %}

There are quite a few dependencies - these are outlined in the `doc/build-unix.md` document: [https://github.com/bitcoin/bitcoin/blob/master/doc/build-unix.md](https://github.com/bitcoin/bitcoin/blob/master/doc/build-unix.md).

I haven't installed Bitcoin in this way. This is probably a good method as you'll be pulling the files over an encrypted connection - so long as you trust that the Github repo has not been tampered with (which makes Github probably as trusted an installation route as the downloadable binaries).

## Install Via PPA
To install via PPA, add `ppa:bitcoin/bitcoin` to your system's Software Sources:

{% highlight bash startinline %}
sudo add-apt-repository ppa:bitcoin/bitcoin
sudo apt-get update
{% endhighlight %}

This is the stable Channel of bitcoin-qt (GUI) and bitcoind (CLI) for Ubuntu. The Launchpad description actually recommends use of the official binaries, where possible, to limit trust in Launchpad/the PPA owner.

## Resources
* [Verify Bitcoin Core](https://www.reddit.com/r/Bitcoin/wiki/verifying_bitcoin_core)
* [SHA256SUM on Linux](https://help.ubuntu.com/community/HowToSHA256SUM)
* [Inporting GPG Public Keys](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/4/html/Step_by_Step_Guide/s1-gnupg-import.html)
* [Downloading Bitcoin](https://en.bitcoin.it/wiki/Using_Bitcoin#Download_and_install_the_client)
