# About Typewriter

## Installing

To install, first clone this repo somewhere.

Then, `npm install`.

Finally, symlink the `bin/typewriter` binary into your working path, something like:

`ln -s bin/typewriter /usr/local/bin/typewriter`

## Creating a new project

`typewriter create <name>`

Creates a new typewriter project. It will create a folder in your current directory with `<name>` and create some stub files inside.

A typewriter project folder looks like this:

```
index.html | index.md
about.json
assets/
```

`index.html` is an html fragment that defines your post, or a `index.md` markdown file. Typewriter will wrap it in the necessary blog html.

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
      "affiliation": "Google Brain",
      "url": "http://barnyrubble.tumblr.com/"
    }
  ]
}
```

## Working with a project

`typewriter serve`

Starts a watching server. Must be executed in the root of the a typewriter project. It will auto-reload when it detects changes. Files are rendered into a `build` folder.
