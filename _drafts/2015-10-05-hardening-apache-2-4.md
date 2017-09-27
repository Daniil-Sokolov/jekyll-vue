---
layout: post
title: Hardening Apache 2.4
categories:
  - Apache
  - Security
author: David Egan
description: Important security measures for Apache 2.4
excerpt: Important security measures for Apache 2.4
---
These rules can be added to:

* `.htaccess` if overrides are enabled (usually in the site's vhost config file)
* Apache config files

## Global Directives
To apply the directives globally edit `security.conf`:

~~~
sudo nano /etc/apache2/conf-enabled/security.conf
~~~

After editing, you need to restart Apache:

~~~    
sudo service apache2 restart
~~~

Globally applied directives might include access denial for certain key files/file types/directories.

## Site Specific Directives
This can be achieved either by means of a `.htaccess` file, or by adding rules to the virtual host configuration file (`/etc/apache2/sites-available/myproject.conf`).

Any web directory can have it's own `.htaccess` file - `AllowOverride All` shoudl be set in the host config file to allow the `.htaccess` rules to override the global Apache configuration.

Create a `.htaccess` file in the document root for the site, and add rules to this file:

~~~
# Move to the document root for the site.
cd /var/www/html/mysite.com/public_html

# Edit a .htaccess file - if one doesn't exist, it will be created on save.
sudo nano .htaccess

~~~

You do not need to restart Apache for the directives added to `.htaccess` to take effect.

Local security rules might typically include an IP restricted login page that reflects a particular client IP.

## TL;DR Apache 2.4 Security

{% highlight apacheconf startinline %}
# ==============================================================================
# Restrict access to WordPress login page by IP
# ==============================================================================
<Files "wp-login.php">
    Require ip 123.123.123.123
</files>

# ==============================================================================
# Deny access to wp-config.php
# ==============================================================================
<Files wp-config.php>
    Require all denied
</files>

# ==============================================================================
# Protect a specified range of files from direct access
# ==============================================================================
<FilesMatch "^(wp-config\.php|php\.ini|php5\.ini|install\.php|php\.info|readme\.html|bb-config\.php|\.htaccess|\.htpasswd|readme\.txt|timthumb\.php|error_log|error\.log|PHP_errors\.log|\.svn)">
  Require all denied
</FilesMatch>

{% endhighlight %}

## Resources

* [One of the rare useful guides on access control in Apache 2.2 vs 2.4](https://blog.bravi.org/?p=1191)
* [Apache 2.4. docs](http://httpd.apache.org/docs/2.4/howto/auth.html)
* [Apache 2.4 Require directive](http://httpd.apache.org/docs/2.4/mod/mod_authz_core.html#require) - maybe it's because it's Friday night after a long week, but this page made my brain hurt...
* [A better resource on the Require directive](http://httpd.apache.org/docs/2.4/mod/mod_authz_host.html)
* [\<Files\> Directive](http://httpd.apache.org/docs/2.4/mod/core.html#files)
* [\<FilesMatch\> Directive](http://httpd.apache.org/docs/2.4/mod/core.html#filesmatch)
* [Options directive](http://httpd.apache.org/docs/2.4/mod/core.html#options)
