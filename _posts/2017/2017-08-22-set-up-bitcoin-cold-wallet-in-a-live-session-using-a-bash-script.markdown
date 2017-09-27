---
layout: "post"
title: "Bitcoin Cold Wallet Setup Bash Script"
date: "2017-08-22 20:07"
categories: [BASH, Cryptocurrency, Bitcoin]
showOnFront: true
---
If you want to examine a cold wallet in an offline Tails session, you'll need to reference the Bitcoin binaries in your persistent volume. You'll also need to move the required wallet into the Bitcoin data directory - which won't exist until you run `bitcoin-qt` for the first time in the session.

This gets tedious, so I wrote this script to connect everything up.

{% highlight Bash startinline %}
#!/bin/bash
# Open a Bitcoin Core cold wallet in an offline Tails session.
# This script runs a simple zenity GUI which prompts the user to select:
# - The cold wallet file
# - The `bitcoin-qt` binary
# Both of these files will probably be on your persistent volume.
# ------------------------------------------------------------------------------
function set_cold_wallet() {
  WALLET_FILE=$(zenity --file-selection --title="Select a Cold Wallet to run." --filename=${PWD}/)
  case $? in
    0)
    echo "\"$WALLET_FILE\" selected.";;
    1)
    echo "No file selected.";;
    -1)
    echo "An unexpected error has occurred.";;
  esac
}

function set_bitcoin_binary() {
  BITCOIN_CORE=$(zenity --file-selection --title="Select the bitcoin-qt binary." --filename=${PWD}/)
  case $? in
    0)
    echo "\"$BITCOIN_CORE\" selected.";;
    1)
    echo "No file selected.";;
    -1)
    echo "An unexpected error has occurred.";;
  esac
}

function create_symlink() {
  BITCOIN_DIR=~/.bitcoin
  if [[ ! -d "${BITCOIN_DIR}" ]]; then
    echo "Creating ${BITCOIN_DIR}"
    echo ""
    mkdir ${BITCOIN_DIR}
  fi

  if [[ -L "${BITCOIN_DIR}"/cold-wallet.dat ]]; then
    echo "Remove exisiting symlink, ${BITCOIN_DIR}/cold-wallet.dat"
    rm ${BITCOIN_DIR}/cold-wallet.dat
  fi

  echo "Make a symlink ${BITCOIN_DIR}/cold-wallet.dat pointing to ${WALLET_FILE}"
  ln -s ${WALLET_FILE} ${BITCOIN_DIR}/cold-wallet.dat
}

function run_wallet() {
  echo "Starting Bitcoin Core with wallet ${WALLET_FILE}"
  ${BITCOIN_CORE} -wallet=cold-wallet.dat
}

# Run this script
# ------------------------------------------------------------------------------
echo "ONLY RUN IN A COLD ENVIRONMENT."
read -p "Do you wish to proceed? [y/N]" PROCEED
case $PROCEED in
  [Yy]* )
  set_cold_wallet
  set_bitcoin_binary
  create_symlink
  run_wallet
  ;;
  [Nn]* )
  echo "END"
  ;;
  * ) echo "Please answer yes or no.";;
esac
{% endhighlight %}
