
$(document).ready(function() {
    var slideCount = 0;
    var slideDuration = 5000;
    var slide = [];
    var slideNavFlag = [];
    var slideNav = $(".sliderNav span");

    if($(".slide").length>0){
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
    }

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

// window.onscroll = function() {scrollFunction()};
//
// function scrollFunction() {
//     if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
//         document.getElementById("myBtn").style.display = "block";
//     } else {
//         document.getElementById("myBtn").style.display = "none";
//     }
// }

// When the user clicks on the button, scroll to the top of the document
// function topFunction() {
//     document.body.scrollTop = 0;
//     document.documentElement.scrollTop = 0;
// }

// cookie
var cookiePage = $.cookie('_readSite');

$(document).ready(function () {
    if (cookiePage) {
        $('body').removeClass('showCookie-body');
        $('.cookieCompliance').removeClass('showCookie');
    } else {
        setTimeout(() => {
            $('body').addClass('showCookie-body');
            $('.cookieCompliance').addClass('showCookie');
        }, 200);
    }
    
    /* for websocket integration */
    
    var socket = io(websocket.url, {
        transports: ["websocket"]
    });
    socket.on("update_user_count", function(count) {
        $(".total-user-count").text(count);
    });

    socket.on("update_sticky_reviews_count", function(count) {
        $(".total-sticky-reviews-count").text(count);
    });

    socket.on("update_reviews_from_review_link_count", function(count) {
        $(".total-reviews-from-review-link-count").text(count);
    });

    socket.on("update_subscribed_email_count", function(count) {
        $(".total-subscribed-email-count").text(count);
    });

    socket.emit("get_total_users");
    socket.emit("get_total_sticky_reviews");
    socket.emit("get_total_reviews_from_review_link");
    socket.emit("get_total_subscribed_emails");
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

if($.cookie('_loginUserImage')) {
    if($.cookie('_loginUserImage') != 'null'){
        $("#profileImage").css("background-image", 'url(' + $.cookie('_loginUserImage') + ')');
    }else{
        $("#profileImage").css("background-image", 'images/user.png');
    }
}
