'use strict';

var path = require('path'),
  fs = require('fs'),
  mustache = require('mustache');

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

  //TODO if markdown, first render it to html.

  fs.readFile(path.join(dir, 'index.html'), 'utf8', (error, data) => {
    templates['index.html'] = data;
    callback(mustache.render(templates['root.html'], view, templates));
  });
}