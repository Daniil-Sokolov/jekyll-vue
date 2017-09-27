---
layout: "post"
title: "Saving Laravel Eloquent Relationships"
date: "2016-10-13 14:59"
categories: [Laravel, Eloquent]
---
When saving user supplied information to the database, relationships between different models usually need to be set up. For example, Articles might have a single Author and many Comments.

I'm in the process of getting my head around how this works in Laravel. It seems really straightforward and intuitive.

If you're serious about learning Laravel, get over to [Laracasts] and purchase a subscription.

## Eloquent Relationships
Your models can be linked by creating complementary methods on the `Model` class for the related models. Wow, there were a lot of 'models' in that sentence! An example would be easier:

Say you had an `Article` model that represents the database 'articles' table, and a `User` model that represents the database 'users' table. You'd probably want to set it up so that an article (a record from the 'articles' table) "belongs" to a single `User` (a record from the 'users' table), and that a `User`(or in other words an author) could "own" many articles.

In Laravel terms, the `User` would need a "hasMany" relationship to articles (because they can be associated with many articles). Similarly, an `Article` would need a "belongsTo" relationship with a `User` to denote the article's author. To set the relationship up:

Create a `user()` method on the `Article` model class:

{% highlight php startinline %}
<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $fillable = ['title', 'body', published_at];

    /**
     * A Article belongs to a single User.
     *
     */
    public function user()
    {
        return $this->belongsTo('App\User');
    }
}
{% endhighlight %}

Create an `articles()` method on the `User` model class:

{% highlight php startinline %}
<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    ...

    /**
     * This method allows the user to be associated with articles.
     *
     * A user can have many articles.
     *
     */
    public function articles()
    {
      return $this->hasMany('App\Article');
    }
}

{% endhighlight %}

You can use different method names - just bear in mind that you'll be using these to create the relationships, so the names should be meaningful.

## Database Setup
The two related tables need to refer to one another by means of a foreign key. Eloquent works this out for you if you stick to a built-in convention - but this can be overridden if necessary.

**The convention is to name the foreign key with the name of the related model appended with `_id`.**

This means there should be a column called `user_id` in the table of a model that "belongsTo" a User.

In the case of this example, the 'articles' table would include a 'user_id' column. Data type should be an unsigned integer - so the `up()` function in your `xxx_create_articles_table` migration might look like this:

{% highlight php startinline %}
<?php
...
public function up()
{
  Schema::create('articles', function (Blueprint $table) {
    $table->increments('id');
    $table->integer('user_id')->unsigned();
    $table->string('title');
    $table->text('body');
    $table->timestamp('published_at');
    $table->timestamps();

    // Delete articles if the user is deleted
    $table->foreign('user_id')
      ->references('id')
      ->on('users')
      ->onDelete('cascade');
  });
}
{% endhighlight %}

## Saving Data
In this example, an `article` is created by form submission. When creating a new article, the form request instance is passed into a `store()` method on the `ArticlesController` class.

The request instance comes from a new class `ArticleRequest`, which extends `FormRequest`. Laravel will build this class for you if you run `php artisan make:request ArticleRequest`. You can put all your validation logic here, which keeps the Controller tidy.

Back in the controller, the `store()` method won't complete until validation rules are passed. In the case of this example, we will also need to add the creating user's `id` as the `user_id` on the new record to be created. Note that you shouldn't pass the user `id` as a hidden value on your form - this is open to abuse by sneaky users.

Laravel gives quite a few options for adding the value within the controller method.

## Three Options for Storing Post Data with User ID

{% highlight php startinline %}
<?php
/**
 * The long-winded way
 * @param  ArticleRequest $request
 */
public function store(Requests\ArticleRequest $request)
{
    // This works, but is a bit long-winded
    $article = new Article;
    $article->user_id = Auth::user()->id;
    $article->title = $request->title;
    $article->body = $request->body;
    $article->published_at = $request->published_at;
    $article->save();

    return redirect('articles');
}

/**
 * More concise.
 *
 * $request->all() represents the user supplied form data (from the $_POST array)
 * that has been passed through validation rules. It's important to add the
 * additonal data ('user_id') after instantiating the Article.
 *
 * @param  ArticleRequest $request
 */
public function store(Requests\ArticleRequest $request)
{

    $article = new Article($request->all());
    $article['user_id'] = Auth::user()->id;
    $article->save();

    return redirect('articles');

}

/**
 * The Eloquent way?
 *
 * This is concise way of linking the user and article that uses the `articles()`
 * method we defined on the User model.
 *
 * @param  ArticleRequest $request
 */
public function store(Requests\ArticleRequest $request)
{

    Auth::user()->articles()->save(
      new Article($request->all())
    );

    return redirect('articles');
}
{% endhighlight %}

## Querying/Accessing Related Data
TODO

## References
- [Eloquent Relationships, Laravel Docs](https://laravel.com/docs/5.3/eloquent-relationships) - an essential read
