---
layout: "post"
title: "Notes on .env Configuration Files"
date: "2016-09-24 17:41"
categories: [Laravel, Sage, WordPress]
---
Both Sage/Bedrock and Laravel utilise the [phpdotenv](https://github.com/vlucas/phpdotenv) library to load environment variables. This allows environment sensitive variables to be loaded from a `.env` file.

**The `.env` file should not be kept in version control - add it to your `.gitignore`.** You can include an example `.env.example` - when setting up a new environment, there is a once-off requirement to copy `.env.environment` to `.env`, and populating the file with your sensitive data.
