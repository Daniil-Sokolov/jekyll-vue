---
layout: "post"
title: "Upgrading Monero Command Line Interface"
date: "2017-09-19 19:29"
categories: [Cryptocurrency, Monero]
showOnFront: true
---
Notes on upgrading Monero command line interface on Ubuntu 16.04 From Wolfram-Warptangent to Helium-Hydra.

## Download New Binaries
Download the binaries, along with the list of hashes that will allow you to verify the download:

{% highlight bash startinline %}
# Make a suitable directory and move into it
mkdir ~/monero/helium-hydra && cd $_

# Download the Monero Linux 64 bit CLI client
wget https://downloads.getmonero.org/cli/monero-linux-x64-v0.11.0.0.tar.bz2

# Download the GPG-signed canonical list of hashes
wget https://getmonero.org/downloads/hashes.txt
{% endhighlight %}

## Verify the Download
To verify the download, you need to:

1. Verify that you have a true copy of hashes.txt
2. Check that the `sha256sum` checksum for your downloaded tar file matches the quoted value in `hashes.txt`

To verify `hashes.txt`, you must install the appropriate GPG key, which is found [here](https://github.com/monero-project/monero/tree/master/utils/gpg_keys) in the Monero source code repository (/utils/gpg_keys).

The `hashes.txt` file will state which signature has been used - in this case, we need to add the GPG signature for fluffypony to GPG.

{% highlight bash startinline %}
# Download the raw public key:
wget https://raw.githubusercontent.com/monero-project/monero/master/utils/gpg_keys/fluffypony.asc

# Import this public key to GnuPG:
gpg --import fluffypony.asc
{% endhighlight %}

You can now use GnuPG to verify `hashes.txt`. From within the same directory as the file, run:

{% highlight bash startinline %}
gpg --verify hashes.txt
{% endhighlight %}

If the `hashes.txt` file is genuine, you should see:

{% highlight bash startinline %}
# email has been obfuscated - you should see the correct email in your output
gpg: Signature made Tue 12 Sep 2017 21:37:04 IST using RSA key ID 1CCD4FCD
gpg: Good signature from "Riccardo Spagni <***@******.net>"
gpg: WARNING: This key is not certified with a trusted signature!
gpg:          There is no indication that the signature belongs to the owner.
Primary key fingerprint: BDA6 BD70 42B7 21C4 67A9  759D 7455 C5E3 C0CD CEB9
     Subkey fingerprint: 94B7 38DD 3501 32F5 ACBE  EA1D 5543 2DF3 1CCD 4FCD
{% endhighlight %}

You can now use `hashes.txt` to verify the Monero download:

{% highlight bash startinline %}
sha256sum -c hashes.txt 2>&1 | grep OK

# Successful verification will look like this:
monero-linux-x64-v0.11.0.0.tar.bz2: OK
{% endhighlight %}

## Extract
Extract the files from the downloaded tarball:

{% highlight bash startinline %}
cd ~/monero/helium-hydra
tar -xjvf monero-linux-x64-v0.11.0.0.tar.bz2
{% endhighlight %}

Move/copy Wallet files from old to new directory:

{% highlight bash startinline %}
# Replace 'MyWallet' with your wallet name - note lack of spaces after commas
cp ~/monero/wolfram-warptangent/monero-v0.10.3.1/{MyWallet,MyWallet.address.txt,MyWallet.keys} ~/monero/helium-hydra/monero-v0.11.0
{% endhighlight %}

## Run Monero
When you move into the new Monero directory and run `./monerod`, it should start syncing to the forked blockchain - it will not need to download the Monero blockchain from scratch.

In my case, I had already synced after the hard-fork with the previous CLI client, and this caused a problem. To get around this, remove some downloaded blocks by running `monero-blockchain-import`:

{% highlight bash startinline %}
# Get rid of the most recent 1000 blocks - it may be necessary to remove more
./monero-blockchain-import --pop-blocks 1000
{% endhighlight %}

## Connect Up and Run Monero
A convenient way to manage Monero version upgrades is to create symlinks to Monero executables within a directory that is in your `$PATH`.

For example, after you download and verify the 'helium-hydra' Monero binaries, you might symlink to relevant files from within your `/usr/local/bin` directory:

{% highlight bash startinline %}
sudo ln -s ~/monero/helium-hydra/monero-v0.11.0.0/monerod monerod
sudo ln -s ~/monero/helium-hydra/monero-v0.11.0.0/monero-wallet-cli monero-wallet-cli
{% endhighlight %}

The `/usr/local/bin` directory now contains the following:

{% highlight bash startinline %}
lrwxrwxrwx  1 root  root       56 Sep 19 10:35 monerod -> /home/david/monero/helium-hydra/monero-v0.11.0.0/monerod*
lrwxrwxrwx  1 root  root       66 Sep 19 10:36 monero-wallet-cli -> /home/david/monero/helium-hydra/monero-v0.11.0.0/monero-wallet-cli*
{% endhighlight %}

To run `monerod` from the helium-hydra package, just run `monerod` in your terminal.
Likewise, `monero-wallet-cli` will run the correct wallet CLI binary.
