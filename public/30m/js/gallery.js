$(document).ready(function () {
    $(".gallery-item").hover(
        function () {
            // Add the 'hover-effect' class on hover
            $(this).removeClass("sepia");
        },
        function () {
            // Remove the 'hover-effect' class when not hovering
            $(this).addClass("sepia");
        }
    );

    Fancybox.bind("[data-fancybox]", {
        Carousel: {
            infinite: true,
        },
        Slideshow: {
            playOnStart: true,
            timeout: 3000,
        },
        Toolbar: {
            display: {
                left: ["slideshow"],
                middle: [],
                right: ["close"],
            },
        },
        Images: {
            zoom: false,
        },
    });

});