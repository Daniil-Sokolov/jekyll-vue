---
layout: "post"
title: "Verify and Setup Litecoin Core"
date: "2017-09-01 19:33"
categories: [Cryptocurrency, Security, Litecoin]
---
This guide refers to downloading and verifying Litecoin Core in Ubuntu 16.04. The guidelines should be pretty much the same for any Debian-based Linux distro.

## Download the Litecoin Core Client & Signatures Document
Download the relevant Litecoin Core `.tar` file and the GPG signatures document.

To keep things organised, create a dedicated subdirectory and move into it:

{% highlight bash startinline %}
mkdir ~/Downloads/litecoin && cd $_

# Download the provided tar - at the time of writing this is:
# litecoin-0.14.2-x86_64-linux-gnu.tar.gz
curl https://download.litecoin.org/litecoin-0.14.2/linux/litecoin-0.14.2-x86_64-linux-gnu.tar.gz

# Download the Litecoin hash signatures document to the same directory
curl https://download.litecoin.org/litecoin-0.14.2/linux/litecoin-0.14.2-linux-signatures.asc
{% endhighlight %}

## Verify the Signatures Document
Download a copy of the Litecoin Core PGP key, as shown on the main website:

{% highlight bash startinline %}
curl "https://pgp.mit.edu/pks/lookup?op=get&search=0xFE3348877809386C" | sed -n '1,/<pre>/d;/<\/pre>/q;p' > litecoin.pub.key
# Parsing HTML like this is bad...you should just curl the document and manually
# copy the key from between the <pre> tags, or hit the URL in your browser and copy the key.
# I used sed out of interest.
{% endhighlight %}

Now you can import the Litecoin public key:

{% highlight bash startinline %}
gpg --import litecoin.pub.key

# Check that it installed correctly:
gpg --list-keys
{% endhighlight %}
Once the key is installed, you can verify the document that contains the hash signatures:

{% highlight bash startinline %}
gpg --verify litecoin-0.14.2-linux-signatures.asc
{% endhighlight %}

## Checksum
You can then safely use the signatures document to verify that the checksum of the download matches the expected checksum provided by the project:

{% highlight bash startinline %}
sha256sum -c litecoin-0.14.2-linux-signatures.asc 2>&1 | grep OK

# Or:
grep litecoin-0.14.2-x86_64-linux-gnu.tar.gz litecoin-0.14.2-linux-signatures.asc | sha256sum --check

# In either case, a successful return will be:
litecoin-0.14.2-x86_64-linux-gnu.tar.gz: OK

# ... this means that the SHA256 hashes match.
{% endhighlight %}

## Glitch in Signatures Document
The Signatures document contains Windows line endings, which causes the `sha256sum` check to fail (on Ubuntu, likely also on Mac):

{% highlight bash startinline %}
sha256sum -c litecoin-0.14.2-linux-signatures.asc 2>&1 | grep OK
# returns blank

grep litecoin-0.14.2-x86_64-linux-gnu.tar.gz litecoin-0.14.2-linux-signatures.asc | sha256sum --check
# returns:
sha256sum: 'litecoin-0.14.2-x86_64-linux-gnu.tar.gz'$'\r': No such file or directory
: FAILED open or read4-linux-gnu.tar.gz
sha256sum: WARNING: 1 listed file could not be read
{% endhighlight %}
Fortunately this is easily remedied. Open the signatures file in Gedit, and 'Save As' with the same filename. You'll be given an option for 'Line Ending', for which you should choose Unix/Linux.

## Resources
* [sed](https://stackoverflow.com/a/5218716/3590673)
{% highlight bash startinline %}

{% endhighlight %}
