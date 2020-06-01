window.onload = function () {
    this.document.querySelectorAll('.article-image-src').forEach(function(image) {
        image.setAttribute('srcset', image.getAttribute('data-srcset'));

        image.parentElement.addEventListener('load', function (e) {
            e.target.classList.remove('lazyload-blur');
        });
    });

    this.document.querySelectorAll('img.article-image').forEach(function(image) {
        image.setAttribute('srcset', image.getAttribute('data-srcset'));

        image.addEventListener('load', function (e) {
            e.target.classList.remove('lazyload-blur');
        });
    });
}