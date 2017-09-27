---
layout: "post"
title: "vhost-generator"
date: "2016-08-07 16:23"
---
Use this as a template:
<form class="form-control" id="vHost-generator">
  <div class="form-group">
    <label for="yourDomain">Your domain, without 'www'</label>
    <input type="text" class="form-control" id="yourDomain" placeholder="example.com">
  </div>
  <div class="form-group">
    <label for="contactEmail">Contact Email Address</label>
    <input type="text" class="form-control" id="contactEmail" placeholder="you@example.com">
  </div>
  <button type="submit" class="btn btn-primary">Generate Config</button>
</form>

<div id="serialize"></div>

<script>
$(document).ready(function () {
  // your code here //
  $('#vHost-generator').on( 'submit', function(e) {

    e.preventDefault();

    var domain = $("#yourDomain").val();
    var email = $("#contactEmail").val();
    alert("domain: " + domain + " Email: " + email);

    var values = $('#vHost-generator :input').serializeArray();

    console.log("Hello: "+values);

  });


  });

</script>
