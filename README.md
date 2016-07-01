# About Typewriter

`typewriter create <name>`

Creates a new typewriter project. It will create a folder in your current directory with <name> and create some stub files inside.

`typewriter serve`

Starts a watching server. Must be executed in the root of the a typewriter project. It will auto-reload when it detects changes. Files are rendered into a `build` folder.

A typewriter project folder looks like this:

```
index.md | index.html
preview.png | preview.jpg
about.json
assets/
```

`index.html` is an html fragment that defines your post. Typewriter will wrap it in the necessary blog html.

 Assets can referenced with relative paths, such as `"assets/foo.js"`.

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