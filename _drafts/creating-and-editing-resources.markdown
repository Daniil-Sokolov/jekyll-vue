---
layout: "post"
title: "Creating and Editing Resources"
date: "2016-09-22 16:35"
categories: [Laravel]
---
## Edit Resource Form
Sticking with the CRUD/REST paradigm, the form that is used to edit the resource should send a `POST` request to `/{resource}/{identifier}`.

In this case (for the "articles" resource), the endpoint for form submission is `articles/{article identifier}`.
