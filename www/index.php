<!-- header -->
<?php include("header.php");

// Create a CURL call to fetch the pricing information
if (strpos($getEnvUrl, 'local') !== false) {
    $url = 'https://api.local.usestickyreviews.com/v2/pricing-plans/';
} elseif (strpos($getEnvUrl, 'beta') !== false ) {
    $url = 'https://api.beta.usestickyreviews.com/v2/pricing-plans/';
} else {
    $url = 'https://api.usestickyreviews.com/v2/pricing-plans/';
}

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);
$allPlansData = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
$planData = json_decode($allPlansData,true);

?>
<section class="bannerArea spacingheader">
        <div class="bannerMid">
            <div class="container">
                <h1>
                    <span>USING STICKY REVIEWS</span>
                    Can increase your leads and<br>sales <strong>up to 100%</strong> in less than <strong>10 minutes!</strong>
                </h1>
                <p>
                    Sticky Reviews makes increasing conversions simple. It's super simple to set up and takes only around 10 minutes to get started.
                </p>
                <a href="https://app.<?php echo $linkUrl; ?>/sign-up" target="_blank" class="freeTrialBtn">Start 14 days FREE trial</a>
            </div>
        </div>

        <div class="socketInfo">
            <div class="container">
                <div class="inSocket">
                    <div class="d-flex p-Socket">
                        <div class="socket-e">
                            <span>Total Users</span>
                            <h3>64,314</h3>
                        </div>
                        <div class="socket-e">
                            <span>Total Number of Sticky Reviews</span>
                            <h3>8,56,561</h3>
                        </div>
                        <div class="socket-e">
                            <span>Total Number of Reviews from Review Link</span>
                            <h3>3,659</h3>
                        </div>
                        <div class="socket-e">
                            <span>Fourth Socket Parameter</span>
                            <h3>13,659</h3>
                        </div>
                    </div>
                </div>
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
                <a href="https://app.<?php echo $linkUrl; ?>/sign-up" target="_blank" class="freeTrialBtn">Start 14 days FREE trial</a>
                <div class="plan">
                    <?php foreach($planData['data'] as $data) { ?>
                    <div class="planCell">
                        <div class="planHead">
                            <div class="planImg">
                                <img alt="" src="images/icon_price_plan_starter.png">
                            </div>
                            <h2><?php echo $data['name']; ?> </h2>
                        </div>
                        <ul class="features">
                            <?php foreach($data['features'] as $feature) { ?>
                            <li><?php echo $feature['text']; ?></li>
                            <?php } ?>
                        </ul>
                        <p class="price">$<?php echo $data['amount']?></p>
                    </div>

                   <?php  } ?>
                </div>
            </div>
        </div>
    </section>
    <!-- footer -->
    <?php include("footer.php")?>