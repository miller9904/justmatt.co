const Handlebars = require('handlebars');

module.exports = function(content) {
    var id = "mn-" + (Math.floor(Math.random() * 9999999) + 1).toString();

    return new Handlebars.SafeString(`<label for="${id}" class="margin-toggle"></label>
    <input type="checkbox" id="${id}" class="margin-toggle"/>
    <span class="marginnote">${content}</span>`);
}