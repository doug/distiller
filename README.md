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
package.json
assets/
```

`index.html` is an html fragment that defines your post, or a `index.md` markdown file. Typewriter will wrap it in the necessary blog html.

Assets can referenced with relative paths, such as `"assets/foo.js"`.

The `package.json` file is a npm package file with a typewriter object with metadata about the post. It looks like this:

```json
{
  "main": "index.md",
  "name": "augmented-rnns",
  "typewriter": {
    "title": "Attention and Augmented Recurrent Neural Networks",
    "description": "A visual overview of neural attention, and the powerful extensions being built on top of it.",
    "url": "http://distill.pub/2016/augmented-rnns/",
    "github": "https://github.com/distillpub/post--augmented-rnns",
    "firstPublished": "Thu Sep 08 2016 10:27:05 GMT-0700 (PDT)",
    "lastPublished": "Thu Sep 08 2016 10:27:05 GMT-0700 (PDT)",
    "authors": [
      {
        "firstName": "Chris",
        "lastName": "Olah",
        "personalURL": "http://colah.github.io",
        "affiliation": "Google Brain",
        "affiliationURL": "http://g.co/brain"
      },
      {
        "firstName": "Shan",
        "lastName": "Carter",
        "personalURL": "http://shancarter.com",
        "affiliation": "Google Brain",
        "affiliationURL": "http://g.co/brain"
      }
    ]
  },
  "dependencies": {
    "d3": "^4.2.2"
  }
}
```

## Working with a project

`typewriter serve`

Starts a http server. Must be executed in the root of the a typewriter project. Files are rendered into a `build` folder.
