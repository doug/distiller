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
  sanitize: false,
  smartLists: true,
  smartypants: true
});

// Open and cache the templates
let templateDir = path.join(__dirname, '..', 'templates');
let templates = {};
fs.readdirSync(templateDir)
  .filter((file) => {
    return fs.statSync(path.join(templateDir, file)).isFile();
  })
  .forEach((file) => {
    templates[file] = fs.readFileSync(path.join(templateDir, file), 'utf8');
  });

module.exports = function (dir, callback) {
  let assetsDir = path.join(dir, 'assets')
  //Open .html and .svg files in "_assets" and add those to templates
  let assetTemplates = {};
  fs.readdirSync(assetsDir)
    .filter((file) => {
      return path.extname(file) === '.html' || path.extname(file) === '.svg';
    })
    .filter((file) => {
      return fs.statSync(path.join(assetsDir, file)).isFile();
    })
    .forEach((file) => {
      let contents = fs.readFileSync(path.join(assetsDir, file), 'utf8');
      //Remove the xml file header for svg files
      contents = contents.replace(/<\?xml(.+?)\?>/, '');
      assetTemplates['assets/' + file] = contents;
    });

  //TODO make this async
  let view = fs.readFileSync(path.join(dir, 'about.json'), 'utf8');

  //TODO I think this should happen outside this script. Render should be dumb.
  //if markdown
  fs.readFile(path.join(dir, 'index.md'), 'utf8', (error, data) => {
    if (error) return;
    let html = marked(mustache.render(data, view, assetTemplates));
    templates['index.html'] = html;
    callback(mustache.render(templates['root.html'], view, templates));
  });

  //if html
  fs.readFile(path.join(dir, 'index.html'), 'utf8', (error, data) => {
    if (error) return;
    templates['index.html'] = mustache.render(data, view, assetTemplates);
    callback(mustache.render(templates['root.html'], view, templates));
  });
}