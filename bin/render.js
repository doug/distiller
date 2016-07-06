'use strict';

var path = require('path'),
  fs = require('fs'),
  mustache = require('mustache'),
  marked = require('marked');

// Marked rendering options
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: true
});

// Open and cache the templates
let templateDir = path.join(__dirname, '..', 'templates');
let templates = {};
let templateFiles = fs.readdirSync(templateDir)
  .filter((file) => {
    return fs.statSync(path.join(templateDir, file)).isFile();
  })
  .forEach((file) => {
    templates[file] = fs.readFileSync(path.join(templateDir, file), 'utf8');
  });

module.exports = function (dir, callback) {
  console.log('render');

  //TODO make this async
  let view = fs.readFileSync(path.join(dir, 'about.json'), 'utf8');

  //if markdown
  fs.readFile(path.join(dir, 'index.md'), 'utf8', (error, data) => {
    if (error) return;
    templates['index.html'] = marked(data);
    callback(mustache.render(templates['root.html'], view, templates));
  });

  //if html
  fs.readFile(path.join(dir, 'index.html'), 'utf8', (error, data) => {
    if (error) return;
    templates['index.html'] = data;
    callback(mustache.render(templates['root.html'], view, templates));
  });
}