---
layout: post
title: Protecting Apache Server Against xmlrpc Login Attempts
categories:
  - Apache
  - Security
  - WordPress
author: David Egan
excerpt: Determine that an attack is in progress against xmlrpc, and lock down the server to protect against this.
---

## Get Authentication Failures

~~~
grep "Authentication failure" /var/log/auth.log
~~~

Choose one, look up the access in the relevant apache2 access log:

~~~
grep '16:44:46' /var/log/apache2/example.com.access.log
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
Written to the error log, no fail2ban triggered, cos it's distributed:
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

46.119.123.199 - - [10/Apr/2016:07:47:40 +0100] "GET /page-title/ HTTP/1.1" 301 358 "http://carsnumber.com/" "Opera/7.54 (Windows NT 5.1; U)  [pl]"
~~~

~~~
# Send a Command from 1.2.3.4:
curl -I http://example.com/page-title/

# result in apache2/access.log:
1.2.3.4 - - [10/Apr/2016:13:28:38 +0100] "HEAD /page-title/ HTTP/1.1" 200 348 "-" "curl/7.35.0"

# Result after a browser request:
1.2.3.4 - - [10/Apr/2016:13:27:37 +0100] "GET /page-title/ HTTP/1.1" 200 7599 "-" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36"

# Anonymised IP

~~~

## The Error Log Entry

This shows an authentication failure. Triggered by the `wp_login_failed()` hook.

~~~
# Timestamp | Module producing msg:severity | Process ID | Client Address | Detailed message
[Sun Apr 10 07:50:31.838787 2016] [authz_core:error] [pid 6168] [client 158.255.143.122:51673] AH01630: client denied by server configuration: /var/www/example.com/public_html/xmlrpc.php
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
