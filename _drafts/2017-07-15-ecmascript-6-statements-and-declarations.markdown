---
layout: "post"
title: "Declaring Variables in Ecmascript 6"
date: "2017-07-15 20:30"
categories: [JavaScript, ES6]
excerpt: Variables in JavaScript ES6 can be declared using the `let`, `var` and `const` keywords.
---
Variables are used as symbolic names for values. Variable names are known as 'identifiers'. In JavaScript, identifiers are case-sensitive and must begin with a letter, underscore or dollar sign.

## TLDR;
Don't use `var` to declare variables - use `const` where possible and `let` otherwise. Use a transpiler like [babel](https://babeljs.io/) to sort things out for pre-ES6 browsers.

## Variable Declaration
Ecmascript 6 introduced the `let` and `const` statements for declaring variables. This means that variables can be declared as follows:

* `var`: Declare a variable, optionally assigning a value
* `let`: Declare a block-scoped local variable, optionally assigning a value
* `const`: Declare a block-scoped read-only constant

[Source: MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#Declarations)

## Scoping
Variables defined with `var` and `const` are function scoped, whereas variables defined with `let` are block-scoped.

Block scoping basically means that the variable scope is limited by the enclosing `{}` - so a variable is declared by means of `let` is limited in it's scope to the block, statement or expression in which it is used.

This can be useful when dealing with loop iterations - when the counter variable is defined by `var`, all loop iterations (confusingly) share the same _function-scoped_ counter variable, leading to unexpected results. Declaring the index with `let` produces a much more intuitive result:

{% highlight js startinline %}
// Declare iterator with let
// -----------------------------------------------------------------------------
'use strict'
var list = []
for (let i = 0; i < 5; ++i) {
  list.push(() => {
    return i;
  })
}
console.log(list.map((f) => { return f() }))
// returns Array [ 0, 1, 2, 3, 4 ]

// Declare iterator with var
// -----------------------------------------------------------------------------
'use strict'
var list = []
for (var i = 0; i < 5; ++i) {
  list.push(() => {
    return i;
  })
}
console.log(list.map((f) => { return f() }))
// returns Array [ 5, 5, 5, 5, 5 ]
{% endhighlight %}
Source: [SE answer](https://softwareengineering.stackexchange.com/a/274352/278079)

## const
This is another way to declare variables - like `let`, variables `const` has block scope. Variables declared in this way are read-only **constants**.

You can't change the value of a constant by re-assignment, and it can't be re-declared. However, the value held by a constant is not immutable. If you define an object using `const`, the object contents can be amended.

A constant can't have the same name as a function or variable in the same scope. Constants can be declared with uppercase or lowercase letters - a common convention is to use all-uppercase letters.

A constant can have global scope (i.e. on the window object) if defined outside a block.

If you don't need to change a variable, it's probably a good idea to use `const`. This helps to **Minimize Mutable State** - Mutable state makes mistakes more likely.

## References
* [SE answer](https://softwareengineering.stackexchange.com/a/274352/278079) with a good description of why `let` is better than `var`
* [Douglas Crockford discussing the issue](https://youtu.be/Ji6NHEnNHcA?t=26m9s)
* [Useful YouTube video from funfunfunction](https://www.youtube.com/watch?v=sjyJBL5fkp8)
* [MDN on `const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const)
* [MDN on `let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#Block_scope_with_let)
