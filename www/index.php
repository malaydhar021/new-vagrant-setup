<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <!-- Favicons -->
    <link rel="shortcut icon" href="images/favicon.png">
    <link rel="shortcut icon" href="images/favicon.ico">

    <title>Stickyreviews</title>

    <link rel="stylesheet" href="style.css">

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js"></script>

</head>

<body>
<button onclick="topFunction()" id="myBtn" title="Go to top">Top</button>

<?php $getEnvUrl = $_SERVER['SERVER_NAME'];
if (strpos($getEnvUrl, 'local') !== false) {
    $linkUrl = 'local';
} elseif (strpos($getEnvUrl, 'beta') !== false ){
    $linkUrl = 'beta';
} else {
    $linkUrl = '';
}
?>

<section class="bannerArea">
        <header class="headerArea">
            <div class="container">
                <div class="logo">
                    <a href="/"><img src="images/logo.png" alt=""></a>
                </div>
                <div class="navArea">
                    <ul class="nav">
                        <li><a href="#howItWorks">How It Works</a></li>
                        <li><a href="#pricing">Pricing</a></li>
                        <li><a href="https://app.<?php echo $linkUrl; ?>.usestickyreviews.com/sign-up" target="_blank">14 Day Free Trial</a></li>
                    </ul>
                    <div class="loginBtn">
                        <a href="">
                            <img src="images/icon_menu_login.png" alt="">
                        </a>
                    </div>
                </div>
                <div class="responsiveNav">
                    <span></span>
                </div>
                <div class="fogLayer"></div>
            </div>
        </header>
        <div class="bannerMid">
            <div class="container">
                <h1>
                    <span>USING STICKY REVIEWS</span>
                    Can increase your leads and<br>sales <strong>up to 100%</strong> in less than <strong>10 minutes!</strong>
                </h1>
                <p>
                    Sticky Reviews makes increasing conversions simple. It's super simple to set up and takes only around 10 minutes to get started.
                </p>
                <a href="https://app.<?php echo $linkUrl; ?>.usestickyreviews.com/sign-up" target="_blank" class="freeTrialBtn">Start 14 days FREE trial</a>
            </div>
        </div>
        <div class="featureArea">
            <div class="container">
                <h2>Unleash the <strong>POWER</strong> of <span>Sticky Reviews!</span></h2>
                <ul>
                    <li>
                        <img src="images/icon_higher_conversion.png" alt="">
                        <h3>Higher Conversions</h3>
                        <p>Convert more website visitors into signups and purchases.</p>
                    </li>
                    <li>
                        <img src="images/icon_save_acquisition.png" alt="">
                        <h3>Save on Acquisition</h3>
                        <p>Your advertising spend will go further than ever before.</p>
                    </li>
                    <li>
                        <img src="images/icon_increase_visitor.png" alt="">
                        <h3>Increase Visitor Trust</h3>
                        <p>People trust companies they see other people buy from as well.</p>
                    </li>
                    <li>
                        <img src="images/icon_social_influence.png" alt="">
                        <h3>Social Influence</h3>
                        <p>Seeing other visitors taking action creates fear of missing out.</p>
                    </li>
                </ul>
            </div>
        </div>
    </section>

    <section class="featureArea2">
        <div class="container">
            <div class="sliderContainer">
                <div class="slide">
                    <div class="slideLeft">
                        <div class="videoArea">
                            <div class="videoAreainner"></div>
                        </div>
                        <span class="blueRing"></span>
                        <span class="redRing"></span>
                    </div>
                    <div class="slideRight">
                        <h2>
                            <span>WORKS ON ANY WEBSITE!</span>
                            Get Started In<br>Just 10 Minutes!
                        </h2>
                        <p>
                            We've really made it so simple and easy to get started using Sticky Reviews. Once you login you can watch the quick set up video and you'll be up and running in less than 10 minutes. Get started now!
                        </p>
                    </div>
                </div>
                <div class="slide">
                    <div class="slideLeft">
                        <div class="videoArea">
                            <div class="videoAreainner"></div>
                        </div>
                        <span class="blueRing"></span>
                        <span class="redRing"></span>
                    </div>
                    <div class="slideRight">
                        <h2>
                            <span>WORKS ON ANY WEBSITE!</span>
                            Get Started In<br>Just 10 Minutes!
                        </h2>
                        <h3>Add Reviews</h3>
                        <p>
                            Upload real reviews from real customers! You can do this manually or you can use our automated review links and add reviews that meet your minimum start rating automatically.
                        </p>
                    </div>
                </div>
                <div class="slide">
                    <div class="slideLeft">
                        <div class="videoArea">
                            <div class="videoAreainner"></div>
                        </div>
                        <span class="blueRing"></span>
                        <span class="redRing"></span>
                    </div>
                    <div class="slideRight">
                        <h2>
                            <span>WORKS ON ANY WEBSITE!</span>
                            Get Started In<br>Just 10 Minutes!
                        </h2>
                        <h3>Launch Campaign</h3>
                        <p>
                            Simply copy & paste the pixel on your website. No coding knowledge required! Display Sticky Reviews on your website and let your customers generate referrals for you!
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="sliderNav">
            <span></span>
            <span></span>
            <span></span>
        </div>
    </section>

    <section class="newRelease" id="howItWorks">
        <div class="container">
            <h2>
                <span class="subHeading">STICKY REVIEWS JUST GOT BETTER</span>
                Latest release of Review Links
                <span class="subHeading2">Sticky Reviews releases it's latest feature</span>
            </h2>
            <ul class="newFeatures">
                <li>
                    <h3>More Reviews</h3>
                    <p>Using review links will allow you to easily collect more reviews from your customers/clients.</p>
                </li>
                <li>
                    <h3>Reputation Management</h3>
                    <p>With review links you keep bad reviews off of social media and public forms all while giving your customers a real way to provide feedback so you can improve your service process.</p>
                </li>
                <li>
                    <h3>Increase Conversions</h3>
                    <p>More positive and recent reviews on your campaigns is proven to increase your conversions even more.</p>
                </li>
            </ul>
        </div>
    </section>

    <section class="introExitPopup">
        <div class="container">
            <div class="content">
                <h2>
                    <span>INTRODUCE EXIT POP-UP</span>
                    Increase your sales with state-of-the-art Exit Pop-up
                </h2>
                <p>
                    Convert your traffic into sales while even they are about leave your website. Through Exit pop-up promote attractive offers to generate more leads.
                </p>
            </div>
        </div>
    </section>

    <section class="reviewLooks">
        <div class="container">
            <div class="heading">
                <h2>
                    <span>Clean & Coolest</span>
                    LOOKS
                    <span>of Sticky Review</span>
                </h2>
            </div>
            <div class="reviewTheme">
                <div class="review1">
                    <img src="images/Sticky-theme-2.png" alt="">
                </div>
                <div class="review2">
                    <img src="images/Sticky-theme-3.png" alt="">
                </div>
                <div class="review3">
                    <img src="images/Sticky-theme-4.png" alt="">
                </div>
                <div class="review4">
                    <img src="images/Sticky-theme-5.png" alt="">
                </div>
                <div class="review5">
                    <img src="images/Sticky-theme-1.png" alt="">
                </div>
            </div>
        </div>
    </section>

    <section class="pricingSec" id="pricing">
        <div class="pricingArea">
            <div class="container">
                <h2>
                    Pricing After Your 14 Day FREE Trial!
                    <span>Save over 50% when compared to our competitors!</span>
                </h2>
                <a href="https://app.<?php echo $linkUrl; ?>.usestickyreviews.com/sign-up" target="_blank" class="freeTrialBtn">Start 14 days FREE trial</a>
                <div class="plan">
                    <div class="planCell">
                        <div class="planHead">
                            <div class="planImg">
                                <img alt="" src="images/icon_price_plan_starter.png">
                            </div>
                            <h2>STARTER</h2>
                        </div>
                        <ul class="features">
                            <li><strong>2 Domains</strong></li>
                            <li>Unlimited Sticky Reviews</li>
                            <li>Unlimited Visitors</li>
                            <li>Multiple Elegant Designs</li>
                            <li>Custom Branding</li>
                            <li><strong>No Review Links</strong></li>
                        </ul>
                        <p class="price">$15</p>
                        <!-- <button class="planBtn" type="button">PURCHASE</button> -->
                    </div>
                    <div class="planCell">
                        <div class="planHead">
                            <div class="planImg">
                                <img alt="" src="images/icon_price_plan_premium.png">
                            </div>
                            <h2>PREMIUM</h2>
                        </div>
                        <ul class="features">
                            <li><strong>10 Domains</strong></li>
                            <li>Unlimited Sticky Reviews</li>
                            <li>Unlimited Visitors</li>
                            <li>Multiple Elegant Designs</li>
                            <li>Custom Branding</li>
                            <li><strong>5 Review Links</strong></li>
                        </ul>
                        <p class="price">$25</p>
                        <!-- <button class="planBtn" type="button">PURCHASE</button> -->
                    </div>
                    <div class="planCell">
                        <div class="planHead">
                            <div class="planImg">
                                <img class="acencyImg" alt="" src="images/icon_price_plan_agency.png">
                            </div>
                            <h2>AGENCY</h2>
                        </div>
                        <ul class="features">
                            <li><strong>Unlimited Domains</strong></li>
                            <li>Unlimited Sticky Reviews</li>
                            <li>Unlimited Visitors</li>
                            <li>Multiple Elegant Designs</li>
                            <li>Custom Branding</li>
                            <li><strong>Unlimited Review Links</strong></li>
                        </ul>
                        <p class="price">$47</p>
                        <!-- <button class="planBtn" type="button">PURCHASE</button> -->
                    </div>
                </div>
            </div>
        </div>
    </section>

    <footer class="footer">
        <!-- cookies -->
        <div class="cookieCompliance">
            <div class="container">
                <p>
                    We use cookies to offer you a better experience and analyze site traffic. By continuing to use this
                    website, you consent to the use of cookies
                </p>

                <button class="closeCookie" onclick="closeCookie()">
                    Accept
                </button>
            </div>
        </div>


        <div class="container">
            <p class="billed">*Billed monthly, <a href="">no set up fee.</a></p>
            <p class="copyright">© 2018 All rights reserved. <strong>Tier5 LLC </strong> | <a href="terms-and-conditions.php"> Terms and Conditions </a> | <a href="privacy-policy.php">Privacy Policy </a> | <a href="support.php">Contact Support</a> </p>
        </div>
    </footer>



    <script>
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
    </script>

<!-- scripts -->
<script>
    var cookiePage = $.cookie('readSite');

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
        $.cookie('readSite', 1);
    };
</script>


</body>


</html> 