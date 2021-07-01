const Handlebars = require('handlebars');

module.exports = function(content) {
    var id = "sn-" + (Math.floor(Math.random() * 9999999) + 1).toString();

    return new Handlebars.SafeString(`<label for="${id}" class="margin-toggle sidenote-number"></label>
    <input type="checkbox" id="${id}" class="margin-toggle"/>
    <span class="sidenote"><a href="https://www.biblegateway.com/passage/?search=${content}&version=ESV">${content} ESV</a></span>`);
}