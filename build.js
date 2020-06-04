const Metalsmith = require('metalsmith');

// Transpilation
const markdown = require('metalsmith-markdown');
const layouts = require('metalsmith-layouts');
const partials = require('metalsmith-discover-partials');

// Metadata
const wordcount = require('metalsmith-word-count');
const publish = require('metalsmith-publish');
const slug = require('metalsmith-slug');
const pageTitle = require('metalsmith-page-titles');
const preview = require('metalsmith-preview');

// File structure
const permalinks = require('metalsmith-permalinks');
const collections = require('metalsmith-collections');
const pagination = require('metalsmith-pagination');
const sitemap = require('metalsmith-sitemap');

// Clean/minify
const htmlmin = require('metalsmith-html-minifier');
const typography = require('metalsmith-typography');
const sass = require('metalsmith-sass');

// Images
const imagemin = require('metalsmith-imagemin');
const responsiveImages = require('metalsmith-picset-generate');
const imageHelper = require('metalsmith-picset-handlebars-helper');

// Development
const watch = require('metalsmith-watch');
const metalsmithExpress = require('metalsmith-express');

function debug(logToConsole) {
    return function (files, metalsmith, done) {
        if (logToConsole) {
            console.log('\nMETADATA:');
            console.log(metalsmith.metadata());

            for (var f in files) {
                console.log('\nFILE:');
                console.log(files[f]);
            }
        }

        done();
    };
}

Metalsmith(__dirname)
    // Content source directory
    .source('_content')
    // Build directory
    .destination('build')
    // remove build directory before build
    .clean(true)
    // Insert metadata into stream
    .metadata({
        site: {
            title: 'Just Matt'
        },
        year: new Date().getFullYear().toString(),
        domain: 'https://justmatt.co'
    })
    // Register handlebars partials so they can be used later
    .use(partials({
        directory: '_partials'
    }))
    // Convert markdown files to html
    .use(markdown())
    // Count words and insert value into metadata
    .use(wordcount())
    // Append site title to page title in metadata
    .use(pageTitle())
    // Allows you to set a slug for a page different than its title
    .use(slug())
    // Collections
    .use(collections({
        articles: {
            pattern: 'writing/*.md',
            sortBy: 'date',
            reverse: true
        }
    }))
    // Specify the status of content files
    .use(publish({
        draft: true,
        private: true,
        unlisted: true,
        future: true
    }))
    .use(pagination({
        'collections.articles': {
            perPage: 10,
            layout: 'posts.hbs',
            first: 'writing/index.html',
            path: 'writing/:num/index.html',
            pageMetadata: {
                title: 'Writing'
            }
        }
    }))
    // Generates responsive images
    .use(responsiveImages({
        path: 'images'
    }))
    // Parses handlebars dynamic partial for responsive images
    .use(imageHelper({
        path: 'images'
    }))
    // Generate article exerpts
    .use(preview({
        pattern: '**/*.html',
        words: 30
    }))
    // Parse handlbars templates
    .use(layouts({
        directory: '_layouts',
        pattern: '**/*.html'
    }))
    // Use fancier typography
    .use(typography({
        lang: 'en'
    }))
    // Minify html
    .use(htmlmin())
    // transpile sass
    .use(sass({
        outputDir: 'css/'
    }))
    // Generate sitemap
    .use(sitemap({
        hostname: 'https://justmatt.co'
    }))
    // Serve files after build
    .use(metalsmithExpress())
    .use(
        watch({
            paths: {
                '${source}/**/*': true,
                '_partials/**/*': true,
                '_layouts/**/*': true
            },
            livereload: true
        })
    )
    .use(debug(false))
    .build(function (err, files) {
        if (err) { throw err; }
    });