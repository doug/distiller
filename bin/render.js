'use strict';

var path = require("path"),
  fs = require("fs"),
  mustache = require("mustache"),
  marked = require("marked"),
  rollup = require("rollup"),
  babel = require("rollup-plugin-babel"),
  nodeResolve = require("rollup-plugin-node-resolve");

console.log(__dirname);

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

module.exports = function (dir, distillData, callback) {
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
  let view = {};

  //Add vars to the view
  view = distillData;
  try{
    view.distill.firstPublished = new Date(view.distill.firstPublished);
    view.distill.firstPublishedYear = view.distill.firstPublished.getFullYear();
    view.distill.firstPublishedMonth = months[view.distill.firstPublished.getMonth()];
    view.distill.firstPublishedDate = view.distill.firstPublished.getDate();
    view.distill.lastPublished = new Date(view.distill.lastPublished);
    view.distill.citationDate = zeroPadding(view.distill.firstPublished.getDate());
    view.distill.citationMonth = zeroPadding(view.distill.firstPublished.getMonth() + 1);
    if (view.distill.authors.length  > 2) {
      view.distill.concatenatedAuthors = view.distill.authors[0].lastName + ", et al.";
    } else if (view.distill.authors.length === 2) {
      view.distill.concatenatedAuthors = view.distill.authors[0].lastName + " & " + view.distill.authors[1].lastName;
    } else if (view.distill.authors.length === 1) {
      view.distill.concatenatedAuthors = view.distill.authors[0].lastName
    }
    view.distill.bibtexAuthors = view.distill.authors.map(function(author){
      return author.lastName + ", " + author.firstName;
    }).join(" and ");

    view.distill.slug = view.distill.authors[0].lastName.toLowerCase() + view.distill.firstPublishedYear + view.distill.title.split(" ")[0].toLowerCase()
  } catch(e) {
    console.log("error sanitizing properties on package.json");
  }

  let textExtensions = ['.js', '.css', '.svg', '.csv', '.txt', '.html'];
  let assetTemplates = JSON.parse(JSON.stringify(templates));
  try {
  //Open text "_assets" and add those to available partials
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
      if (path.extname(file) === ".svg") {
        contents = contents.replace(/<\?xml(.+?)\?>/, '');
      }
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

  } catch (e) {
    console.log(e, "No assets folder");
  }

  // Use rollup to compile index.js is provided.
  function compileJs() {
    const indexjs = path.join(dir, 'index.js');
    if (!fs.existsSync(indexjs)) {
      return Promise.resolve('');
    }
    return rollup.rollup({
      entry: indexjs,
      plugins: [babel(), nodeResolve({esnext: true})],
    }).then((bundle) => {
      const result = bundle.generate({
        format: 'es',
      });
      return result.code;
    }).catch((err) => {
      console.log('compile error', err);
      return '';
    });
  }


  //if markdown
  fs.readFile(path.join(dir, 'index.md'), 'utf8', (error, data) => {
    if (error) return;
    let html = marked(data);
    //Marked will replace the greater than symbol with an html entity. Sucks.
    html = html.replace(/{{&gt;/g, '{{>');
    let renderedHtml = mustache.render(html, view, assetTemplates);
    templates['index.html'] = renderedHtml;
    compileJs().then((js) => {
      view.extra_js = `<script type="text/javascript">${js}</script>`;
      callback(mustache.render(templates['root.html'], view, templates));
    });
  });

  //if html
  fs.readFile(path.join(dir, 'index.html'), 'utf8', (error, data) => {
    if (error) return;
    templates['index.html'] = mustache.render(data, view, assetTemplates);
    compileJs().then((js) => {
      view.extra_js = `<script type="text/javascript">${js}</script>`;
      callback(mustache.render(templates['root.html'], view, templates));
    });
  });
}
