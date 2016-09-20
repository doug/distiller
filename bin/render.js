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

let months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
let zeroPadding = function(n) {
  return n < 10 ? "0" + n : n;
}

module.exports = function (dir, callback) {
  // Open and cache the templates in typewriter
  let templateDir = path.join(__dirname, '..', 'templates');
  let templates = {};
  fs.readdirSync(templateDir)
    .filter((file) => {
      return fs.statSync(path.join(templateDir, file)).isFile();
    })
    .forEach((file) => {
      templates[file] = fs.readFileSync(path.join(templateDir, file), 'utf8');
    });

  let assetsDir = path.join(dir, 'assets');
  let view = [];

  //Open package.json and add typewriter vars to partials
  var packageText = fs.readFileSync(path.join(dir, 'package.json'), 'utf8');
  let typewriterData = JSON.parse(packageText);
  view = typewriterData;
  view.typewriter.firstPublished = new Date(view.typewriter.firstPublished);
  view.typewriter.firstPublishedYear = view.typewriter.firstPublished.getFullYear();
  view.typewriter.firstPublishedMonth = months[view.typewriter.firstPublished.getMonth()];
  view.typewriter.firstPublishedDate = view.typewriter.firstPublished.getDate();
  view.typewriter.lastPublished = new Date(view.typewriter.lastPublished);
  view.typewriter.citationDate = zeroPadding(view.typewriter.firstPublished.getDate());
  view.typewriter.citationMonth = zeroPadding(view.typewriter.firstPublished.getMonth() + 1);
  if (view.typewriter.authors.length  > 2) {
    view.typewriter.concatenatedAuthors = view.typewriter.authors[0].lastName + ", et al.";
  } else if (view.typewriter.authors.length === 2) {
    view.typewriter.concatenatedAuthors = view.typewriter.authors[0].lastName + " & " + view.typewriter.authors[1].lastName;
  } else if (view.typewriter.authors.length === 1) {
    view.typewriter.concatenatedAuthors = view.typewriter.authors[0].lastName
  }
  view.typewriter.bibtexAuthors = view.typewriter.authors.map(function(author){
    return author.lastName + ", " + author.firstName;
  }).join(" and ");

  view.typewriter.slug = view.typewriter.authors[0].lastName.toLowerCase() + view.typewriter.firstPublishedYear + view.typewriter.title.split(" ")[0].toLowerCase()

  //Open text "_assets" and add those to available partials
  let textExtensions = ['.js', '.css', '.svg', '.csv', '.txt', '.html'];
  let assetTemplates = JSON.parse(JSON.stringify(templates));
  fs.readdirSync(assetsDir)
    .filter((file) => {
      return textExtensions.indexOf(path.extname(file)) > -1;
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

  //Render html in "_assets" with partials in "_assets" and add to partials
  fs.readdirSync(assetsDir)
    .filter((file) => { return path.extname(file) === '.html'; })
    .forEach((file) => {
      let contents = fs.readFileSync(path.join(assetsDir, file), 'utf8');
      let html = mustache.render(contents, view, assetTemplates);
      assetTemplates['assets/' + file] = html;
    });

  //if markdown
  fs.readFile(path.join(dir, 'index.md'), 'utf8', (error, data) => {
    if (error) return;
    let html = marked(data);
    //Marked will replace the greater than symbol with an html entity. Sucks.
    html = html.replace(/{{&gt;/g, '{{>');
    let renderedHtml = mustache.render(html, view, assetTemplates);
    templates['index.html'] = renderedHtml;
    callback(mustache.render(templates['root.html'], view, templates));
  });

  //if html
  fs.readFile(path.join(dir, 'index.html'), 'utf8', (error, data) => {
    if (error) return;
    templates['index.html'] = mustache.render(data, view, assetTemplates);
    callback(mustache.render(templates['root.html'], view, templates));
  });
}
