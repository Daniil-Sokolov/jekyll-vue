---
layout: "post"
title: "Many to Many Relationships in Laravel"
date: "2016-10-12 20:47"
---
When one or more records in database table A can be related to 0, 1 or many records in a table B and vice versa (records in table B can be related to 0, 1 or many records in table A) the relationship is referred to as "Many to Many".

In simpler terms, a many-to-many relationship exists when many rows in one table are linked to many rows in another table. To create the relationship, a third table is used to associate records from the related tables.

The third table may be referred to as a mapping or pivot table. Using the mapping table avoids duplication of information and maintains principles of good database design.

If a database holds information about 'products' and 'customers' on similarly named tables, these models would probably have a many to many relationship. A product could be bought by many customers. A customer could purchase many products. A 'customer_product' pivot table would consist of (at least) two columns - this allows a unique identifier for customer and product to be associated.

In this way, the database records for customers who have purchased a particular product can be retrieved. Similarly, the product records for products purchased by a particular customer can be retrieved. Your app would look up the customer ID in the pivot table and query the product table for any product IDs associated with the customer.

Tags (as a commonly used method of grouping articles or blog posts) require "many to many" relationships - and these are best achieved with a pivot table.

## Setting Up Tags in Laravel
The process:
1. Set up a `tags` table
2. Set up an `article_tag` pivot table
3. Set up a `Tag` Model
4. Create an `articles()` method on the `Tags` model that returns `$this->belongsToMany('App\Article')`
5. Create a `tags()` method on the `Article` model that `returns $this->belongsToMany('App\Tag')->withTimestamps()`

## Create the Tag Eloquent Model

{% highlight php startinline %}
php artisan make:model Tag
{% endhighlight %}

## Create Database Tables
Create a migration:
{% highlight php startinline %}
php artisan make:migration create_tags_table --create=tags
{% endhighlight %}

Amend the migration - note that the pivot table could have been included in a separate migration:

{% highlight php startinline %}
<?php
  /**
  * Run the migrations.
  *
  * @return void
  */
  public function up()
  {
    Schema::create('tags', function (Blueprint $table) {
        $table->increments('id');
        $table->string('name');
        $table->timestamps();
    });

    // Create Pivot table
    Schema::create('article_tag', function (Blueprint $table) {
        $table->integer('article_id')->unsigned()->index();
        // ensure that if an article is deleted, associated rows in the pivot table will also be delted. Tags will not be linked to non-existent articles.
        $table->foreign('article_id')->references('id')->on('articles')->onDelete('cascade');
        $table->integer('tag_id')->unsigned()->index();
        // ensure that if a tag is deleted, associated rows in the pivot table will also be deleted - so articles won't be linked to non-existent tags.
        $table->foreign('tag_id')->references('id')->on('tags')->onDelete('cascade');
        $table->timestamps();

    });
  }

  /**
  * Reverse the migrations.
  *
  * @return void
  */
  public function down()
  {
    Schema::dropIfExists('tags');
    Schema::dropIfExists('article_tag');
  }

{% endhighlight %}

Note that the standard naming protocol for the pivot table uses the singular names of the rleated tables, in snake case and alphabetic order.

Indexes are added to improve search efficiency.

Run the migration:

{% highlight php startinline %}
php artisan migrate
{% endhighlight %}

Resulting table schema:

{% highlight bash startinline %}
~~~
MariaDB [test_laravel321]> describe article_tag;
+------------+------------------+------+-----+---------+-------+
| Field      | Type             | Null | Key | Default | Extra |
+------------+------------------+------+-----+---------+-------+
| article_id | int(10) unsigned | NO   | MUL | NULL    |       |
| tag_id     | int(10) unsigned | NO   | MUL | NULL    |       |
| created_at | timestamp        | YES  |     | NULL    |       |
| updated_at | timestamp        | YES  |     | NULL    |       |
+------------+------------------+------+-----+---------+-------+
4 rows in set (0.00 sec)
~~~
{% endhighlight %}

## References
[Laracasts on Many to Many Relationships](https://laracasts.com/series/laravel-5-fundamentals/episodes/21) - this article is largely based on the Laracast video
