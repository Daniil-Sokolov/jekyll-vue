---
layout: post
title: Protecting Apache Server Against xmlrpc Login Attempts
categories:
  - Apache
  - Security
  - WordPress
  - Syasadmin
author: David Egan
excerpt: Determine that an attack is in progress against xmlrpc, and lock down the server to protect against this.
---
## The Auth log entry:

Apr  9 18:57:18 plato wordpress(www.yoursite.com)[4680]: Authentication failure for idfmarketing from 197.53.250.160


## Check access log:

~~~
grep '18:57:18' yoursite.com.access.log.1

# Returns:
188.132.237.141 - - [09/Apr/2016:18:57:18 +0100] "POST /wp-login.php HTTP/1.0" 403 378 "-" "-"
197.53.250.160 - - [09/Apr/2016:18:57:18 +0100] "POST /xmlrpc.php HTTP/1.1" 200 614 "-" "-"
188.132.237.141 - - [09/Apr/2016:18:57:18 +0100] "POST /wp-login.php HTTP/1.0" 403 378 "-" "-"
188.132.237.141 - - [09/Apr/2016:18:57:18 +0100] "POST /wp-login.php HTTP/1.0" 403 378 "-" "-"
188.132.237.141 - - [09/Apr/2016:18:57:18 +0100] "POST /wp-login.php HTTP/1.0" 403 378 "-" "-"
188.132.237.141 - - [09/Apr/2016:18:57:18 +0100] "POST /wp-login.php HTTP/1.0" 403 378 "-" "-"
188.132.237.141 - - [09/Apr/2016:18:57:18 +0100] "POST /wp-login.php HTTP/1.0" 403 378 "-" "-"
188.132.237.141 - - [09/Apr/2016:18:57:18 +0100] "POST /wp-login.php HTTP/1.0" 403 378 "-" "-"

~~~

## Check Error Log

~~~
grep '18:57:18' yoursite.com.error.log.1
[Sat Apr 09 18:57:18.093525 2016] [access_compat:error] [pid 4560] [client 188.132.237.141:44442] AH01797: client denied by server configuration: /var/www/yoursite.com/public_html/wp-login.php
[Sat Apr 09 18:57:18.239160 2016] [access_compat:error] [pid 4535] [client 188.132.237.141:44462] AH01797: client denied by server configuration: /var/www/yoursite.com/public_html/wp-login.php
[Sat Apr 09 18:57:18.386376 2016] [access_compat:error] [pid 4679] [client 188.132.237.141:44475] AH01797: client denied by server configuration: /var/www/yoursite.com/public_html/wp-login.php
[Sat Apr 09 18:57:18.529010 2016] [access_compat:error] [pid 4681] [client 188.132.237.141:44499] AH01797: client denied by server configuration: /var/www/yoursite.com/public_html/wp-login.php
[Sat Apr 09 18:57:18.672455 2016] [access_compat:error] [pid 3547] [client 188.132.237.141:44520] AH01797: client denied by server configuration: /var/www/yoursite.com/public_html/wp-login.php
[Sat Apr 09 18:57:18.814609 2016] [access_compat:error] [pid 4671] [client 188.132.237.141:44535] AH01797: client denied by server configuration: /var/www/yoursite.com/public_html/wp-login.php
[Sat Apr 09 18:57:18.957315 2016] [access_compat:error] [pid 4068] [client 188.132.237.141:44561] AH01797: client denied by server configuration: /var/www/yoursite.com/public_html/wp-login.php

~~~

## Check Firewall Records

## Before ANY Action
Spacing means that they are not getting added to the Fail2Ban jail!
~~~
grep 'Authentication failure' auth.log.1

# Output:
Apr  9 04:55:49 plato wordpress(www.yoursite.com)[2131]: Authentication failure for idfmarketing from 61.79.162.92
Apr  9 05:01:17 plato wordpress(www.yoursite.com)[2217]: Authentication failure for idfmarketing from 108.49.89.76
Apr  9 05:17:59 plato wordpress(www.yoursite.com)[2289]: Authentication failure for idfmarketing from 188.92.110.26
Apr  9 05:23:23 plato wordpress(www.yoursite.com)[2084]: Authentication failure for idfmarketing from 213.8.204.20
Apr  9 05:32:03 plato wordpress(www.yoursite.com)[2217]: Authentication failure for idfmarketing from 82.27.158.172
Apr  9 05:36:03 plato wordpress(www.yoursite.com)[2464]: Authentication failure for idfmarketing from 182.185.173.42
Apr  9 05:40:37 plato wordpress(www.yoursite.com)[2331]: Authentication failure for idfmarketing from 73.53.48.99
Apr  9 05:43:23 plato wordpress(www.yoursite.com)[2289]: Authentication failure for idfmarketing from 173.206.151.215
Apr  9 05:48:05 plato wordpress(www.yoursite.com)[2376]: Authentication failure for idfmarketing from 220.244.147.118
Apr  9 05:55:07 plato wordpress(www.yoursite.com)[2131]: Authentication failure for idfmarketing from 190.45.143.221
Apr  9 05:59:59 plato wordpress(www.yoursite.com)[2464]: Authentication failure for idfmarketing from 173.206.151.215
Apr  9 06:05:07 plato wordpress(www.yoursite.com)[2217]: Authentication failure for idfmarketing from 178.150.235.36
Apr  9 06:06:11 plato wordpress(www.yoursite.com)[2464]: Authentication failure for idfmarketing from 189.63.53.14
Apr  9 06:15:22 plato wordpress(www.yoursite.com)[2419]: Authentication failure for idfmarketing from 73.190.39.166
Apr  9 06:16:37 plato wordpress(www.yoursite.com)[2217]: Authentication failure for idfmarketing from 193.109.140.111
Apr  9 06:27:48 plato wordpress(www.yoursite.com)[2922]: Authentication failure for idfmarketing from 122.59.254.191
Apr  9 06:30:10 plato wordpress(www.yoursite.com)[2923]: Authentication failure for idfmarketing from 94.180.91.82
Apr  9 06:33:51 plato wordpress(www.yoursite.com)[2464]: Authentication failure for idfmarketing from 83.15.32.235
...

# Corresponding access.log:
61.79.162.92 - - [09/Apr/2016:04:55:48 +0100] "POST /xmlrpc.php HTTP/1.1" 200 614 "-" "-"
108.49.89.76 - - [09/Apr/2016:05:01:17 +0100] "POST /xmlrpc.php HTTP/1.1" 200 614 "-" "-"
188.92.110.26 - - [09/Apr/2016:05:17:59 +0100] "POST /xmlrpc.php HTTP/1.1" 200 614 "-" "-"
213.8.204.20 - - [09/Apr/2016:05:23:23 +0100] "POST /xmlrpc.php HTTP/1.1" 200 614 "-" "-"
82.27.158.172 - - [09/Apr/2016:05:32:03 +0100] "POST /xmlrpc.php HTTP/1.1" 200 614 "-" "-"
182.185.173.42 - - [09/Apr/2016:05:36:03 +0100] "POST /xmlrpc.php HTTP/1.1" 200 614 "-" "-"
73.53.48.99 - - [09/Apr/2016:05:40:36 +0100] "POST /xmlrpc.php HTTP/1.1" 200 614 "-" "-"
173.206.151.215 - - [09/Apr/2016:05:43:23 +0100] "POST /xmlrpc.php HTTP/1.1" 200 614 "-" "-"
220.244.147.118 - - [09/Apr/2016:05:48:05 +0100] "POST /xmlrpc.php HTTP/1.1" 200 614 "-" "-"
190.45.143.221 - - [09/Apr/2016:05:55:07 +0100] "POST /xmlrpc.php HTTP/1.1" 200 614 "-" "-"
173.206.151.215 - - [09/Apr/2016:05:59:59 +0100] "POST /xmlrpc.php HTTP/1.1" 200 614 "-" "-"
178.150.235.36 - - [09/Apr/2016:06:05:07 +0100] "POST /xmlrpc.php HTTP/1.1" 200 614 "-" "-"
189.63.53.14 - - [09/Apr/2016:06:06:11 +0100] "POST /xmlrpc.php HTTP/1.1" 200 614 "-" "-"
73.190.39.166 - - [09/Apr/2016:06:15:22 +0100] "POST /xmlrpc.php HTTP/1.1" 200 614 "-" "-"
193.109.140.111 - - [09/Apr/2016:06:16:37 +0100] "POST /xmlrpc.php HTTP/1.1" 200 614 "-" "-"
122.59.254.191 - - [09/Apr/2016:06:27:48 +0100] "POST /xmlrpc.php HTTP/1.1" 200 614 "-" "-"
94.180.91.82 - - [09/Apr/2016:06:30:10 +0100] "POST /xmlrpc.php HTTP/1.1" 200 614 "-" "-"
83.15.32.235 - - [09/Apr/2016:06:33:51 +0100] "POST /xmlrpc.php HTTP/1.1" 200 614 "-" "-"
~~~


## Get auth failures:

~~~
grep "Authentication failure" /var/log/auth.log
~~~

Choose one, look up the access in the relevant apache2 access log:

~~~
grep '16:44:46' /var/log/apache2/yoursite.com.access.log
~~~

The culprit:

~~~
188.132.237.141 - - [09/Apr/2016:18:57:18 +0100] "POST /wp-login.php HTTP/1.0" 403 378 "-" "-"
197.53.250.160 - - [09/Apr/2016:18:57:18 +0100] "POST /xmlrpc.php HTTP/1.1" 200 614 "-" "-"
188.132.237.141 - - [09/Apr/2016:18:57:18 +0100] "POST /wp-login.php HTTP/1.0" 403 378 "-" "-"
188.132.237.141 - - [09/Apr/2016:18:57:18 +0100] "POST /wp-login.php HTTP/1.0" 403 378 "-" "-"
188.132.237.141 - - [09/Apr/2016:18:57:18 +0100] "POST /wp-login.php HTTP/1.0" 403 378 "-" "-"
188.132.237.141 - - [09/Apr/2016:18:57:18 +0100] "POST /wp-login.php HTTP/1.0" 403 378 "-" "-"
188.132.237.141 - - [09/Apr/2016:18:57:18 +0100] "POST /wp-login.php HTTP/1.0" 403 378 "-" "-"
188.132.237.141 - - [09/Apr/2016:18:57:18 +0100] "POST /wp-login.php HTTP/1.0" 403 378 "-" "-"
~~~

all forbidden (403), except xmlrpc.php.

## Block xmlrpc.php
Written to the error log, no fail2ban triggered, cos it';s distributed:
~~~
Apr  7 16:44:46 plato wordpress(www.mysite.com)[31786]: Authentication failure for webdev from 109.201.137.55
Apr  7 16:45:25 plato wordpress(www.mysite.com)[30102]: Authentication failure for webdev from 82.20.212.54
Apr  7 16:45:27 plato wordpress(www.mysite.com)[29949]: Authentication failure for webdev from 189.6.25.238
Apr  7 16:48:15 plato wordpress(www.mysite.com)[31786]: Authentication failure for webdev from 83.94.208.23
Apr  7 16:49:20 plato wordpress(www.mysite.com)[29949]: Authentication failure for webdev from 103.59.179.20
Apr  7 16:51:28 plato wordpress(www.mysite.com)[31787]: Authentication failure for webdev from 108.63.119.52

...
~~~

## Cross-Referenced Access/Error Log Entries

An agent at 158.255.143.122 makes a POST request to `/xmlrpc.php` and receives a 403 (Forbidden) response:

~~~
# Access log: Combined Log Format - see https://httpd.apache.org/docs/2.4/logs.html
# IP | user-identifier | user ID | Timestamp | Client request | HTTP status code returned to client | Size in bytes returned to client | Referrer | User Agent

158.255.143.122 - - [10/Apr/2016:07:50:31 +0100] "POST /xmlrpc.php HTTP/1.1" 403 376 "-" "-"

46.119.123.199 - - [10/Apr/2016:07:47:40 +0100] "GET /wedding-fairs-and-planning-your-wedding-in-ireland-with-feathery-friends/ HTTP/1.1" 301 358 "http://carsnumber.com/" "Opera/7.54 (Windows NT 5.1; U)  [pl]"
~~~

~~~
#Command from 1.1.1.1:
curl -I http://yoursite.com/wedding-fairs-and-planning-your-wedding-in-ireland-with-feathery-friends/

# result in apache2/access.log:
1.1.1.1 - - [10/Apr/2016:13:28:38 +0100] "HEAD /wedding-fairs-and-planning-your-wedding-in-ireland-with-feathery-friends/ HTTP/1.1" 200 348 "-" "curl/7.35.0"

# Result after a browser request:
1.1.1.1 - - [10/Apr/2016:13:27:37 +0100] "GET /wedding-fairs-and-planning-your-wedding-in-ireland-with-feathery-friends/ HTTP/1.1" 200 7599 "-" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36"


# Anonymised IP


~~~

## The Error log entry

This shows an authentication failure. Triggered by the `wp_login_failed()` hook - see the mu-plugin wp-fail2ban, that writes to the log file.

~~~
# Timestamp | Module producing msg:severity | Process ID | Client Address | Detailed message
[Sun Apr 10 07:50:31.838787 2016] [authz_core:error] [pid 6168] [client 158.255.143.122:51673] AH01630: client denied by server configuration: /var/www/yoursite.com/public_html/xmlrpc.php
~~~




## Protect Entire wp-admin Directory

~~~bash
# ====================================================================
# Password Protect
# ====================================================================
AuthType Basic
AuthName "Restricted Files"
AuthUserFile /etc/apache2/.yoursite.htpasswd
Require valid-user

# ====================================================================
# Restrict Access to Files under this directory by IP Address
# ====================================================================
<Files ~ "\.*">
  <RequireAny>
    <RequireAll>
      Require ip 11.11.11.11
    </RequireAll>
  </RequireAny>
</Files>
~~~

## References
[Description of XML-RPC attack, with solutions](https://www.saotn.org/huge-increase-wordpress-xmlrpc-php-post-requests/)
[Block problem IP address using iptables firewall](http://www.cyberciti.biz/faq/how-do-i-block-an-ip-on-my-linux-server/)
[Interpreting log files, Apache 2.4](https://httpd.apache.org/docs/2.4/logs.html)
[Apache access authorization](http://www.the-art-of-web.com/system/apache-authorization/)
[Apache 2.4 configuration](https://www.digitalocean.com/community/tutorials/migrating-your-apache-configuration-from-2-2-to-2-4-syntax)
[Apache 2.4 access restriction](http://serverfault.com/a/737764)
[Apache 2.4 docs: authorization for access control](http://httpd.apache.org/docs/current/howto/auth.html)
[Securi article on brute force attacks exploiting XMLRPC in WordPress](https://blog.sucuri.net/2014/07/new-brute-force-attacks-exploiting-xmlrpc-in-wordpress.html)
[Using ossec to monitor server security](https://blog.sucuri.net/2016/03/server-security-anomaly-behaviour-with-ossec.html)
