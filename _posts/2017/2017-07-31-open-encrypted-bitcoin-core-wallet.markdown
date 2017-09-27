---
layout: "post"
title: "Open Encrypted Bitcoin Core Wallet"
date: "2017-07-31 21:41"
categories: [Cryptocurrency, Bitcoin]
showOnFront: true
---
To decrypt a Bitcoin wallet in the `bitcoin-cli`, you need the `walletpassphrase` command. This article shows how to avoid leaving the password in your shell history.

These notes refer to Bitcoin core running on Ubuntu 16.04.

{% highlight BASH startinline %}
# Silently read password
read -s PASSWORD
# Enter password

# Open the wallet for 60 seconds
./bitcoin-cli walletpassphrase "${PASSWORD}" 60

# Do stuff - in this case, dump out a private key for a specified address
./bitcoin-cli dumpprivkey 12JZ2gDDRRLV9H5spbzygFok5VDd4jsWCV

# Lock Wallet when finished
./bitcoin-cli walletlock

# Empty the $PASSWORD variable
PASSWORD=
{% endhighlight %}
