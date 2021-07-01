const Metalsmith = require('metalsmith');

// Transpilation
const markdown = require('metalsmith-markdown');
const layouts = require('metalsmith-layouts');
const partials = require('metalsmith-discover-partials');
const helpers = require('metalsmith-discover-helpers');
const jstransform = require('metalsmith-in-place');

// Metadata
const wordcount = require('metalsmith-word-count');
const publish = require('metalsmith-publish');
const slug = require('metalsmith-slug');
const pageTitle = require('metalsmith-page-titles');
const preview = require('metalsmith-preview');
const dateFormatter = require('metalsmith-date-formatter');

// File structure
const permalinks = require('metalsmith-permalinks');
const collections = require('metalsmith-collections');
const pagination = require('metalsmith-pagination');
const sitemap = require('metalsmith-sitemap');
const feed = require('metalsmith-feed-js');

// Clean/minify
const htmlmin = require('metalsmith-html-minifier');
const typography = require('metalsmith-typography');
const sass = require('metalsmith-sass');

// Images
const imagemin = require('metalsmith-imagemin');
const responsiveImages = require('metalsmith-picset-generate');
const imageHelper = require('metalsmith-picset-handlebars-helper');

// Move npm packages to build directory
const tufte = require('metalsmith-static');

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
            title: 'Just Matt',
            url: 'https://justmatt.co'
        },
        year: new Date().getFullYear().toString(),
        domain: 'https://justmatt.co'
    })
    // Register handlebars partials so they can be used later
    .use(partials({
        directory: '_partials'
    }))
    // Register handlebars helpers
    .use(helpers({
        directory: '_helpers'
    }))
    // Convert hbs expressions within markdown
    .use(jstransform({
        pattern: '**/*'
    }))
    // Convert markdown files to html
    //.use(markdown())
    // Count words and insert value into metadata
    .use(wordcount())
    // Append site title to page title in metadata
    .use(pageTitle())
    // Allows you to set a slug for a page different than its title
    .use(slug())
    // Use formatted dates
    .use(dateFormatter({
        dates: [
            {
                key: 'publishDate',
                format: 'dddd MMMM Do, YYYY'
            }
        ]
    }))
    // Collections
    .use(collections({
        articles: {
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
        words: 100
    }))
    // Use fancier typography
    .use(typography({
        lang: 'en'
    }))
    // RSS feed
    .use(feed({
        collection: 'articles'
    }))
    // Parse handlbars templates
    .use(layouts({
        directory: '_layouts',
        pattern: '**/*.html'
    }))
    // Use fancier typography again to process templates
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