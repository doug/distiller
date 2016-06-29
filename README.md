# About Typewriter

`typewriter serve`

`typewriter create`

A typewriter project folder looks like this:

```
index.md | index.html
preview.png | preview.jpg
about.json
assets/
```

Assets can referenced from `index.html` with relative paths, such as `"assets/foo.js"`.

The `about.json` file contains metadata about the post. It looks like this:

```json
{
  "headline": "",
  "description": "",
  "name": "",
  "authors": [
    {
      "name" : "Barney Rubble",
      "email" : "b@rubble.com",
      "url" : "http://barnyrubble.tumblr.com/",
      "affiliation": "Google Brain",
      "affiliation-url": "http://barnyrubble.tumblr.com/"
    }
  ]
}
```