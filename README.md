


# zadarma-js-api
Class which help you work with API Zadarma (v1)

## Requirements:
- Node.js, JavaScript

## How to use?
An official documentation on Zadarma API is [here](https://zadarma.com/support/api/).

Keys for authorization are in [personal account](https://my.zadarma.com/api/).


<div class="highlight highlight-js">
let response;
    response = await z_api({api_method: '/v1/info/balance/'});
    console.log(response);

    api_user_key = process.env.ZADARMA_USER_KEY,
    api_secret_key = process.env.ZADARMA_SECRET_KEY

    response = await z_api.request({
        api_method: '/v1/request/callback/',
        params: {
            from: '380947102794',
            to: '380989897908',
            sip: '100',
            predicted: 'predicted'
        }
    });
    console.log(response);
</div>






# Highlight.js

[![Build Status](https://travis-ci.org/highlightjs/highlight.js.svg?branch=master)](https://travis-ci.org/highlightjs/highlight.js) [![Greenkeeper badge](https://badges.greenkeeper.io/highlightjs/highlight.js.svg)](https://greenkeeper.io/) [![install size](https://packagephobia.now.sh/badge?p=highlight.js)](https://packagephobia.now.sh/result?p=highlight.js)

<link rel="stylesheet"
      href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.2/styles/default.min.css">
<script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.2/highlight.min.js"></script>

Highlight.js is a syntax highlighter written in JavaScript. It works in
the browser as well as on the server. It works with pretty much any
markup, doesn’t depend on any framework, and has automatic language
detection.

#### Upgrading to Version 10

Version 10 is one of the biggest releases in quite some time.  If you're
upgrading from version 9, there are some breaking changes and things you may
want to double check first.

Please read [VERSION_10_UPGRADE.md](https://github.com/highlightjs/highlight.js/blob/master/VERSION_10_UPGRADE.md) for  high-level summary of breaking changes and any actions you may need to take. See [VERSION_10_BREAKING_CHANGES.md](https://github.com/highlightjs/highlight.js/blob/master/VERSION_10_BREAKING_CHANGES.md) for a more detailed list and [CHANGES.md](https://github.com/highlightjs/highlight.js/blob/master/CHANGES.md) to learn what else is new.

##### Support for older versions

Please see [OLD_VERSIONS.md](https://github.com/highlightjs/highlight.js/blob/master/OLD_VERSIONS.md) for support information.

## Getting Started

The bare minimum for using highlight.js on a web page is linking to the
library along with one of the styles and calling [`initHighlightingOnLoad`][1]:

```html
<link rel="stylesheet" href="/path/to/styles/default.css">
<script src="/path/to/highlight.min.js"></script>
<script>hljs.initHighlightingOnLoad();</script>
```

This will find and highlight code inside of `<pre><code>` tags; it tries
to detect the language automatically. If automatic detection doesn’t
work for you, you can specify the language in the `class` attribute:

```html
<pre><code class="html">...</code></pre>
```

Classes may also be prefixed with either `language-` or `lang-`.

```html
<pre><code class="language-html">...</code></pre>
```

### Plaintext and Disabling Highlighting

To style arbitrary text like code, but without any highlighting, use the
`plaintext` class:

```html
<pre><code class="plaintext">...</code></pre>
```

To disable highlighting of a tag completely, use the `nohighlight` class:

```html
<pre><code class="nohighlight">...</code></pre>
```

### Supported Languages

Highlight.js supports over 180 different languages in the core library.  There are also 3rd party
language plugins available for additional languages. You can find the full list of supported languages
in [SUPPORTED_LANGUAGES.md][9].

## Custom Initialization

When you need a bit more control over the initialization of
highlight.js, you can use the [`highlightBlock`][3] and [`configure`][4]
functions. This allows you to control *what* to highlight and *when*.

Here’s an equivalent way to calling [`initHighlightingOnLoad`][1] using
vanilla JS:

```js
document.addEventListener('DOMContentLoaded', (event) => {
  document.querySelectorAll('pre code').forEach((block) => {
    hljs.highlightBlock(block);
  });
});
```

You can use any tags instead of `<pre><code>` to mark up your code. If
you don't use a container that preserves line breaks you will need to
configure highlight.js to use the `<br>` tag:

```js
hljs.configure({useBR: true});

document.querySelectorAll('div.code').forEach((block) => {
  hljs.highlightBlock(block);
});
```