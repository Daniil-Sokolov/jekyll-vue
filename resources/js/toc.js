(function( $ ) {
  'use strict';
  $(function() {
    if (window.noToc) {
      return;
    }
    // Create a sidebar TOC
    var sideToc =
    "<nav role='navigation' class='table-of-contents'>" +
    "<h3>On this Page</h3>" +
    "<ul>" +
    "<li><a href='#top'>Back to Top</a>";

    var newLine, el, title, link;

    // Go through each h2 in #main-content and add relevant content to new <li>s
    $("#main-content h2").each(function() {
      el = $(this);
      title = el.text();
      link = "#" + el.attr("id");
      newLine =
      "<li>" +
      "<a href='" + link + "'>" +
      title +
      "</a>" +
      "</li>";
      sideToc += newLine;
    });

    sideToc +=
    "</ul>" +
    "</nav>";

    /*--------------------------
    Create a Floating Table of Contents
    --------------------------*/
    var floatToc =
    "<nav role='navigation' class='table-of-contents'>" +
    "<h3>On this Page</h3>" +
    "<ul>" +
    "<li><a href='#top'>Back to Top</a>";
    var newLine, el, title, link;
    // Go through each h2 in #main-content and add relevant content to new <li>s
    $("#main-content h2").each(function() {
      el = $(this);
      title = el.text();
      link = "#" + el.attr("id");

      newLine =
      "<li>" +
      "<a href='" + link + "'>" +
      title +
      "</a>" +
      "</li>";
      floatToc += newLine;
    });

    floatToc +=
    "</ul>" +
    "<button class='btn' id='hide-toc'>Hide this Nav</button>" +
    "</nav>";

    // Put the TOC in the page, at the top of the sidebar
    $("#sidebar").prepend(sideToc);

    // Build a floating TOC
    $("#float-toc").prepend(floatToc);

    // Floating floatToc - make a html element #float-floatToc and position in css
    // Show or hide the sticky footer button
    var hideNav = "false";
    $('.hideNav').html(hideNav);
    $('#hide-toc').click(function(){
      hideNav = "true";
      $("#float-toc").fadeOut(200);
    }); // end click function

    $(window).scroll(function() {
      if ($(this).scrollTop() > 500 && (hideNav == "false")) {
        $("#float-toc").fadeIn(200);
      } else {
        $("#float-toc").fadeOut(200);
      }
    });

    // Animate the scroll to top
    // -----------------------------------------------------------------------

    $('a[href^="#"]').on('click',function (e) {
      e.preventDefault();
      var target = this.hash;
      var $target = $(target);

      $('html, body').stop().animate({
        'scrollTop': $target.offset().top -20
      }, 300, 'swing');

    });
  });
})( jQuery );
