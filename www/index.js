
$(document).ready(function() {
    var slideCount = 0;
    var slideDuration = 5000;
    var slide = [];
    var slideNavFlag = [];
    var slideNav = $(".sliderNav span");

    $(".slide").each(function() {
        slide.push($(this));
    });
    $(slideNav).each(function() {
        slideNavFlag.push($(this));
    });

    slideNav.click(function() {
        $(".slide").removeClass("active");
        slide[$(this).index()].addClass("active");

        slideNav.removeClass("active");
        $(this).addClass("active");
    });

    slide[slideCount].addClass("active");
    slideNavFlag[slideCount].addClass("active");
    setInterval(function() {
        slideCount = slideCount + 1;
        if (slideCount == 3) {
            slideCount = 0;
        }
        $(".slide").removeClass("active");
        slide[slideCount].addClass("active");
        slideNav.removeClass("active");
        slideNavFlag[slideCount].addClass("active");
    }, slideDuration);


    $(".responsiveNav").click(function() {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
            $(".navArea").removeClass("active");
            $(".fogLayer").removeClass("active");
        } else {
            $(this).addClass("active");
            $(".navArea").addClass("active");
            $(".fogLayer").addClass("active");
        }
    });

})

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("myBtn").style.display = "block";
    } else {
        document.getElementById("myBtn").style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

// cookie
var cookiePage = $.cookie('_readSite');

$(document).ready(function () {
    if (cookiePage) {
        $('.cookieCompliance').removeClass('showCookie');
    } else {
        setTimeout(() => {
            $('.cookieCompliance').addClass('showCookie');
        }, 200);
    }
});

function closeCookie() {
    $('.cookieCompliance').removeClass('showCookie');
    document.cookie = '_readSite' +"=" + 1 + ";expires=" + 450 + ";domain=.usestickyreviews.com;path=/";
};

if($.cookie('_loginUser')) {
    $('#loginBtn').hide();
    $('#dashboard').show();
} else {
    $('#loginBtn').show();
    $('#dashboard').hide();
}
