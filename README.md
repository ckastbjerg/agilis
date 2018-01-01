# Agilis

**Agilis** is a straightforward frontend framework that only requires a basic knowledge of HTML to get started. The framework enables you to organise your HTML, CSS and JavaScript and provides an intuitive way of creating templates and components.


## Installation

Install with yarn:

```shell
yarn global add agilis
```

or with npm:

```shell
npm install -g agilis
```


## Basic usage

Once installed, `agilis` can be used like so:

```bash
agilis input-folder output-folder
```

This will parse the contents of `input-folder` and save the compiled html to the folder `output-folder`.


## How it works

The idea of `agilis` is very simple. All it does is to parse the contents of a folder and compile it into a single HTML file. It does so, by introducing just _a single_ addition to the HTML languge called the `<template>` tag.

The `<template>` tag allows you to import other html files, like so:

```html
<template href="header.html" />
```

`agilis` will replace the `<template>` tag with the contents of `header.html`. The contents of `header.html` might look something like this:

```html
<link href="header.css">
<div>I'm a fancy header</div>
<script src="header.js">
```

As with the `<template>` tag, `agilis` will replace `<link>` and `<script>` tags with the contents of `header.css` and `header.js`.

#### Assets

...


## Why do we need this?

One of the intended usecases for `agilis` is for rapid prototyping and building simple static web pages. Personally, I like to use plain HTML. CSS & JavaScript when creating prototypes. But when a prototype starts getting complex, a need arises to organise code in smaller chunks.

Another intended usecase is to help newcomers to the frontend development field organise their code and. Frontend frameworks often require expert JavaScript skills. And if having those, they often require adopting a bunch of new conventions and ideas as well. `agilis` is extremely basic in its .


#### This all sounds a bit like Web Components...

In HTML, we lack the basic ability of importing and combining the contents of multiple `.html` files. There is already [a `<link rel="import" href="some-file.html">` tag in the Web Components specification](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template). But this doesn't simply import the contents of that file into yours in place. We have to [do scripting to use the content](https://www.html5rocks.com/en/tutorials/webcomponents/imports/#usingcontent). Working with Web Components require expert JavaScript skills and there is still a lack of cross-browser support making it cumbersome to use.


## Command line interface

```
Usage: agilis [options]

Options:

  -h, --help                     Output usage information.
  -w, --watch                    Save file on change
  -s, --serve                    Serve file on localhost:3000
  -d, --dev                      Serve application and automaically save file on changes
```


#### Serving an application & watching for changes

`agilis` comes with a build-in server and file-watcher proving a simple development workflow. Simply use the `--dev` option, like so:

```bash
agilis input-folder output-folder --dev
```

This will fire up a webserver hosting `output-folder` on `localhost:3000`. The contents of `output-folder` will be updated whenever a change occurs in `input-folder`. And any browser tab that has navigated to `localhost:3000` will be reloaded.


## Usage in Node.js

You can also use `agilis` in a `node` application. For instance, to use it with [`express`](https://github.com/expressjs/express), a simple application might look something like this:

```javascript
const path = require('path');
const app = require('express')();
const cakewalk = require('agilis');
const clientFolder = path.join(__dirname, './input-folder');

app.get('/', (req, res) => res.send(cakewalk(clientFolder)));
app.listen(3000, () => console.log('Go to http://localhost:3000'));
```

Here, the client code will be compiled and sent to the client when navigating to `localhost:3000`.
