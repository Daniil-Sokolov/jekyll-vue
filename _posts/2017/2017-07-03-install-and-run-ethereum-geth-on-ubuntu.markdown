---
layout: "post"
title: "Install and Run Geth (golang implemenation of Ethereum) on Ubuntu"
date: "2017-07-03 10:48"
categories: [Cryptocurrency, Ethereum]
showOnFront: true
---
Ethereum is a decentralized blockchain-based platform that runs smart contracts. Because of the decentralized nature of Ethereum, smart contracts run exactly as programmed - short of an internet apocalypse, there is no possibility of downtime, censorship, fraud or third-party interference. The network is cryptographically secure, decentralized and tamper-proof.

The ethereum network is "fuelled" by Ether. Clients of the platform pay Ether to the machines carrying out the requested computations. In this way, people are compensated for contributing resources and developers are incentivized to write efficient applications.

It's a bit tricky to get started with Ethereum - there are numerous confusing articles floating about the internet. This article is intended to be a very basic guide to getting started with the golang implementation of Ethereum - `geth`, a command line tool. The article covers installing the package, setting up accounts and syncing the Ethereum blockchain. For a curated list of useful resources, see the [References](#references) section.

## Go Ethereum: Geth
Go Ethereum (`geth`) is the official golang implementation of the Ethereum protocol. It is one of the three original implementations (the others being C++ and Python) of the Ethereum protocol. The package is fully open source and licensed under the GNU LGPL v3.

Geth is basically a command line interface (CLI) for running a full ethereum node. As well as being a CLI, `geth` can be associated with a JavaScript console

## Installation
Install go-ethereum on Ubuntu:
{% highlight bash startinline %}
sudo apt-get install software-properties-common
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install ethereum
{% endhighlight %}

Note that this installs a suite of Ethereum utilities as well as `geth`:

* `bootnode`
* `evm`
* `disasm`
* `rlpdump`
* `ethtest`

If you just want to install geth, run `sudo apt-get install geth` rather than `sudo apt-get install ethereum`.

## Initial Setup: Create Account
Show geth options:

{% highlight bash startinline %}
geth --help
{% endhighlight %}

Set up an account:
{% highlight bash startinline %}
# Set up account - enter a strong passphrase
geth account new

# Check that accoun
geth account list
{% endhighlight %}

## A Note on Passwords and Security
If you forget your account password/passphrase, you lose all access to that account - and any funds that it holds. There is no password reset! Notwithstanding this, you should set a strong passphrase for the sake of good security.

KeePassX is available for Ubuntu - it is a password storage tool that constitutes an encrypted database. I strongly recommend using such a tool - you just need to remember one strong passphrase to unlock your KeePassX database. This will allow you to save extremely strong passwords for your Ethereum accounts, since you'll never have to remember them.

## Initial Setup: Sync the Ethereum Blockchain
The best option is to run `geth` with the fast sync option - this spares bandwidth usage, though it requires extra processing power. Fast sync downloads transaction receipts rather than the entire blockchain for historical records, and pulls an entire recent state database. See this [PR comment](https://github.com/ethereum/go-ethereum/pull/1889) for more details.

To fast sync with a 2GB memory cache:
{% highlight bash startinline %}
geth --fast --cache=2048
{% endhighlight %}

This builds the ethereum blockchain in `~/.ethereum/geth/chaindata`.

If you have synced the blockchain on one trusted computer, you can export this and import to a second machine. I tried this - it was taking so long that I aborted and opted for the fast-sync method.

**As of 3 July 2017 the chaindata directory is 29 GB**. If you have a bandwidth cap, you could run the sync during unrestricted time-periods by means of a crontab script.

## Running Geth to Stay in Sync
Once you have fast-synced, you need to run `geth` periodically to keep up-to-date with the ethereum blockchain.

## JavaScript Console
You can launch `geth` with the `console` option to provide an interactive JavaScript console. Alternatively, launch `geth` and run `geth attach` in another terminal. The latter method is convenient as you'll be less distracted by logging output.

This example shows how you might monitor progress in an attached console:

{% highlight bash startinline %}
# Assuming geth is running in a separate terminal...this will open a Javcascript console
geth attach
{% endhighlight %}

The JavaScript console:
{% highlight JavaScript startinline %}
// Check if syncing
eth.syncing

// Get the current block number
eth.blockNumber

// Return the number of peers connected
net.peerCount

// Exit this console
exit
{% endhighlight %}

## Clean Exit of Geth
You can shut down `geth` with `CTRL-C`.

If you have attached a JavaScript console to a running `geth` instance, this won't work. You need to first exit the JavaScript console - you can do this cleanly by entering `exit` or `CTRL-C` in the JS console first, before closing the original `geth` instance by entering `CTRL-C` in the relevant terminal.

## References
* [Go ethereum home page](https://geth.ethereum.org/)
* [Install Go Ethereum on Ubuntu](https://geth.ethereum.org/install/#install-on-ubuntu-via-ppas)
* [Ethereum PPA on Launchpad](https://launchpad.net/~ethereum/+archive/ubuntu/ethereum)
* [Ethereum CLI guide for developers](https://ethereum.org/cli) - with info on `geth` usage
* [Go-ethereum Github repo](https://github.com/ethereum/go-ethereum)
* [Wiki for golang Ethereum implementation (geth)](https://github.com/ethereum/go-ethereum/wiki/geth)
* [Go-ethereum User Guide & Reference Manual(Frontier)](https://ethereum.gitbooks.io/frontier-guide/content/)
* [Alternative Installation: Go Ethereum Package Download](https://geth.ethereum.org/downloads/)
