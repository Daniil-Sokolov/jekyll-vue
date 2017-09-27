---
layout: post
title: WordPress Plugin Settings API
categories:
  - WordPress
author: David Egan
description: WordPress Plugin Settings API
excerpt: WordPress Plugin Settings API
---

* Add top level menu page using `add_menu_page()` hooked to `'admin_menu'`.
* Output a form inside a callback function - using the functions `settings_fields()` for hidden fields and `do_settings_sections()` for the form field markup.
* Whitelist options using `register_setting()`, hooked to `'admin_init'`.
* Add a settings section using `add_settings_section()`, hooked to `'admin_init'`.
* Add fields using `add_setting_field()`, hooked to `'admin_init'` and link fields to callback functions to create the required markup.

## Create the Top-Level Page
Add a top-level menu item along with an associated page using `add_menu_page()`.

```
{% highlight php startinline %}
/**
  * Add top-level menu page to the WP admin area
  *
  * The slug returned by `add_menu_page()` is the name of an action. This may be
  * needed if targeting the menu page.
  *
  *  @since 1.0.0
  *
  */
  public function add_menu_page(){

    $this->menu_page = add_menu_page(
    __( 'Staff Area', $this->plugin_name ), // Page Title
    __( 'Staff Area', $this->plugin_name ), // Menu Title
    'manage_options',                       // Capability (admin)
    "carawebs-".$this->plugin_name,         // Menu slug
    array( $this, 'display_page_content' ), // Callback function to render the page
    'dashicons-groups'                      // Icon
    // Menu Position
  );

}
{% endhighlight %}
```

## The Form Callback Function
The callback function specified in `add_menu_page()` builds the form markup.

Building the form in this way allows the form input to be handled semi-automatically - a form processing function is not necessary, since we take advantage of the built in functionality to update options.

```
{% highlight php startinline %}
/**
* Menu page callback
*
* Content of the settings page.
*
* @since 1.0.0
*
**/
public function display_page_content() {

  if ( ! current_user_can( 'manage_options' ) ) {

    wp_die( __( 'You do not have sufficient permissions to access this page.', 'staff-area' ) );

  }

  ?>
  <div class="wrap">
    <h2>My Settings</h2>
    <?php settings_errors(); ?>

    <form method="post" action="options.php">
      <?php

      /**
       * This prints out all hidden setting fields
       * Must match Setting group name in register_setting()
       */
      settings_fields( $this->plugin_name . "_main" );

      /**
       * This function replaces the form-field markup in the form
       * with the fields defined. Accepts the slug name
       * of the page on which to output settings -
       * this must match the page name used in add_settings_section().
       */
      do_settings_sections( $this->plugin_name );

      submit_button();
      ?>
    </form>
  </div>
  <?php

}
{% endhighlight %}
```

## Register Setting
The `register_setting()` and `unregister_setting()` functions add and remove options.

The `register_setting()` function allows you to register settings that are shown on default WordPress settings pages (like "media" or "general"). Settings are added to a global whitelist of options.

Once registered, settings can be added to an existing section using `add_settings_field()`.

If the section does not exist, it can be created with `add_settings_section()`.

This function accepts three arguments.

{% highlight php startinline %}

register_setting(

  $option_group,
  $option_name,
  $sanitize_callback

  );

// Sample usage
register_settings( 'registered_options_group', 'the_option_name', 'intval' );

{% endhighlight %}

Where:

 * `$option_group` is a settings group name. This must exist prior to the register_setting call and must match the group name in `settings_fields()` in the form callback function.
 * `$option_name` is the name of an option to sanitize and save.
 * `$sanitize_callback` is a callback function that sanitizes the option's value (custom or PHP/WP)

The registered `$option_group` must match the group name defined in `settings_field()`, which is the function that outputs the necessary hidden fields on the form.

## Set Up the Group
Settings Sections allow settings to be grouped under shared headings - without the necessity for separate pages. This can help keep the settings simple, well-organised and easy to maintain.

The `add_settings_section()` function is used to set up sections:

{% highlight php startinline %}
add_settings_section(
  $id,      // Saved as key - must correspond with $section in `add_settings_fields()`
  $title,
  $callback,
  $page
  );
{% endhighlight %}

## Set Up Fields

{% highlight php startinline %}
add_settings_field(
  $id,        //
  $title,     // Title - for printing to page
  $callback,
  $page,
  $section,   // Must correspond to $id of `add_settings_section()`
  $args
  );
{% endhighlight %}

{% highlight php startinline %}
{% endhighlight %}


## Resources

* [WP Codex wp_editor()](https://codex.wordpress.org/Function_Reference/wp_editor)
* [Overview of WordPress Settings API](https://codex.wordpress.org/Settings_API)
* []()
