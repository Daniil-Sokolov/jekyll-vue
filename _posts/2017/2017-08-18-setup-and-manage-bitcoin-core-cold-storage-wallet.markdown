---
layout: "post"
title: "Bitcoin Cold Storage Using a Bitcoin Core Wallet"
date: "2017-08-18 10:19"
excerpt: Create and manage a secure Bitcoin cold storage wallet.
categories: [Cryptocurrency, Bitcoin]
---
This article describes how to:
* Create a cold-storage wallet using Bitcoin Core in a live offline Tails session
* Generate and collect public Bitcoin addresses for the cold wallet
* Manage the wallet and wallet passphrase

The cold wallet is created by running Bitcoin Core in an offline [Tails](https://tails.boum.org/) session. Once created, keep the wallet cold - never enter the passphrase within anything other than an offline Tails (or similar) session.

I've written these guidelines for myself as an aid to memory - please use them with caution. If you're not comfortable using the command line, get a [Trezor](https://trezor.io/), [Ledger](https://www.ledgerwallet.com/) or other hardware wallet.

**Don't keep your funds on an exchange:** Loads of exchanges have been hacked, so you're better off holding funds in a cold wallet of some description.

## Prerequisites
You'll need a USB drive with a working copy of Tails: download the Tails ISO, verify it, then install Tails on a USB drive using the Tails installer. You'll then be able to boot into a very secure live environment. Detailed instructions on Tails installation for Linux Debian, Ubuntu and Mint can be found [here](https://tails.boum.org/install/debian/usb/index.en.html).

You will also need the Bitcoin Core binaries, which you can get [here](https://bitcoin.org/en/download). Once you've downloaded Bitcoin Core, you should verify that the file hasn't been tampered with.

To run Tails, power down your PC, insert the Tails USB drive and boot from the USB. Tails is surprisingly usable - it's based on Debian and comes bundled with a load of utility and privacy focused software. On a modern computer (and decent USB drive) I find it stable, quick-booting and responsive.

## Encrypted Persistence Volume
Note that Tails is _amnesiac_ by design (The "a" in Tails stands for amnesiac) - nothing will be stored from your session unless you set up an encrypted persistent volume.

The first time you boot into Tails, create an encrypted persistent storage partition on the USB drive - this is straightforward, just follow the instructions [here](https://tails.boum.org/doc/first_steps/persistence/index.en.html). Carefully store the passphrase for your encrypted persistence volume - I recommend [KeePassX](https://www.keepassx.org/) for generating and storing strong passwords/passphrases. KeePassX is actually bundled with Tails.

The encrypted partition (`/Persistent`) provides a persistent location for:

* Bitcoin Core binaries
* Storing the cold wallet
* Storing a CSV formatted file listing public Bitcoin addresses to receive funds

Once you've added a persistent storage partition, power down the PC. Mount the USB drive in your regular distro - for which you'll need the encryption passphrase - and add the Bitcoin Core binaries to the Tails USB drive's `/Persistent` volume.

## Run Bitcoin Core in an Offline Tails Session
Temporarily disconnect the computer's ethernet connection and/or disable the Wifi connection. Boot into your Tails USB disk.

* Open a terminal and `cd` to the Bitcoin Core binaries directory: `cd ~/Persistent/bitcoin-x.x.x/bin`
* Run `./bitcoin-qt`
* Hide the pop-up warning about recent transactions - the instance does not need to sync to the network for our purposes
* At this point, a new `wallet.dat` file will have been created in the root of the data directory(e.g. `~/.bitcoin/wallet.dat`)
* Encrypt the wallet: in the Bitcoin Core client, click "Settings > Encrypt Wallet"
* Enter a strong passphrase at the prompt (use [diceware](http://world.std.com/~reinhold/diceware.html), or generate a strong passphrase using KeePassX)
* Store the passphrase in a secure location - KeePassX is ideal for this

## View Receiving Addresses
At this point, Bitcoin Core will have created two receiving addresses that are managed by the wallet. Access these addresses via the Bitcoin Core File menu:

* Click "File" > "Receiving Addresses"
* Click export to export in CSV format
* Save this file on the persistent drive

"Label" Refers to the "Account" Name. Two unnamed accounts are created by default during wallet setup. Rename these if necessary - right click the label field in the Receiving Addresses view and click "Edit".

Note that "accounts" are deprecated in Bitcoin Core, but you'll find numerous references to accounts in online tutorials and documentation. The API still has lots of references to accounts - for example, to list out addresses, the `getaddressesbyaccount` method is required.

## Save the Wallet!
**IMPORTANT:** Save the generated wallet to your persistent volume.

I recommend a logical file naming protocol that involves the date and the words "cold-wallet":

{% highlight BASH startinline %}
# Open terminal and copy the wallet to the persistent volume
cp ~/.bitcoin/wallet.dat ~/Persistent/cold-wallets/20-06-2017-cold-wallet.dat
{% endhighlight %}

If you don't explicitly save the wallet file, when you close your Tails session, the wallet will be lost. If you were to send funds to a public address controlled by this wallet, they would be irretrievable.

## Double Check
Before sending Bitcoin to addresses managed by the new wallet, Open the saved `*.dat` file in an offline Tails session and double check:

* It is managing the correct public addresses
* The encryption passphrase is correct (enter `walletpassphrase "yourpassphrase" 5` in console - the correct passphrase should return "null")

You can open a wallet by passing in the `-wallet` option when opening Bitcoin Core - BUT the wallet must be located in the Bitcoin core data directory. You can add a symlink to set this up:

{% highlight bash startinline %}
ln -s ~/Persistent/cold-wallets/20-06-2017-cold-wallet.dat ~/.bitcoin/cold-wallet.dat
{% endhighlight %}

You can now launch Bitcoin core and reference the cold wallet:
{% highlight bash startinline %}
# Move into the Bitcoin Core directory
cd ~/Persistent/bitcoin-x.x.x/bin

# Launch Bitcoin Core with a specified wallet:
./bitcoin-qt -wallet=cold-wallet.dat
{% endhighlight %}

I've written a utility script that connects up the cold wallet: [https://github.com/DavidCWebs/bitcoin-cold-wallet-setup](https://github.com/DavidCWebs/bitcoin-cold-wallet-setup).

## Transfer Funds
Transfer Bitcoin to one of the public Bitcoin addresses managed by the cold wallet.

Don't unlock the cold wallet on any internet-connected machine, or on any machine that might be infected with malware.

## Backup Private Keys
If required, you could dump the private keys of the cold wallet. If you do this, you'll need to keep these extremely safe. Access to the private keys equates to full control over the Bitcoin. On the plus side, you could store these keys on paper which would ensure that you will always be able to import keys.

Personally, I have decided not to backup private keys - instead relying on multiple copies of a cold wallet encrypted with a strong passphrase. The wallet can then be safely stored online, since it is effectively useless without the encryption passphrase. Note that if someone gained control of your encrypted wallet without the passphrase, although they would not be able to transfer funds they would be able to access your transaction history. The passphrase should be stored securely (for example, in multiple copies of an encrypted KeePassX database in more than one location).

## Accessing the Wallet
To access funds managed by the wallet, you just need to open it in a "hot" Bitcoin Core client. To do this in Ubuntu:

* Move the cold wallet into the Bitcoin Core data directory
* Run `bitcoin-qt`, passing the wallet filename to the "wallet" option

For example:
{% highlight bash startinline %}
cd /path/to/bitcoin-core
./bitcoin-qt -wallet=cold.dat
{% endhighlight %}

This will load your cold wallet into your Bitcoin Core client. Once you've entered the passphrase, it's good practice to consider the wallet "warmed-up" - so you could transfer any remaining funds to a new cold wallet.

If you're managing cold wallets like this, be very careful to:

* Encrypt wallets with a strong passphrase
* Secure your passphrase and your wallet - there is **NO** password reset option if you forget!

## Resources
* [Bitcoin Wiki: Setup secure offline savings wallet](https://en.bitcoin.it/wiki/How_to_set_up_a_secure_offline_savings_wallet)
* [Detailed instructions on Tails installation](https://tails.boum.org/install/debian/usb/index.en.html) in Linux Debian, Ubuntu and Mint
* [Download Bitcoin Core](https://bitcoin.org/en/download)
* [Bitcoin Wiki on Cold Storage](https://en.bitcoin.it/wiki/Cold_storage)
* [Bitcoin Core APIs](https://bitcoin.org/en/developer-reference#bitcoin-core-apis)
* [Bitcoin Core GitHUb issue on Accounts](https://github.com/bitcoin/bitcoin/issues/9078#issuecomment-259259471) discusses replacing account concept with simple labels
* [Utility script to set up cold wallet for offline viewing](https://github.com/DavidCWebs/bitcoin-cold-wallet-setup)
* [Diceware](http://world.std.com/~reinhold/diceware.html) - easier if you use gedit displaying line numbers for ease of lookup - do this offline if you're paranoid!
