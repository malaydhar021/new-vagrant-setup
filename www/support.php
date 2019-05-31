<html>
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
<header class="headerArea">
    <div class="container">
        <div class="logo">
            <a href="/"><img src="images/logo.png" alt=""></a>
        </div>
        <div class="navArea">
            <ul class="nav">
                <li><a href="<?php $getEnvUrl ?>/#howItWorks">How It Works</a></li>
                <li><a href="<?php $getEnvUrl ?>/#pricing">Pricing</a></li>
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

<!-- FB Customer messenger chat widget-->
<div class="fb-customerchat" page_id="280656062532697" ref="Chat-Widget"></div>
<!-- Main wrapper  -->
<div>
    <div id="main-wrapper">
        <app-noticelabel [showNotice]="isMaintenance"></app-noticelabel>
        <style>


            /* iframe's parent node */
            div#root {
                position: fixed;
                width: 100%;
                height: 100%;
            }

            /* iframe itself */
            div#root > iframe {
                display: block;
                width: 100%;
                height: 80%;
                border: none;
            }

            p {
                margin-top: 10px;
                text-align: center;
                font-size: 16px;
                letter-spacing: 0.5px;
            }
        </style>
        <div id="root">
            <iframe src="https://stickyreviews.nolt.io/" class="iframe-div"></iframe>
            <div>
                <p>
                    For any product related support please click on the messenger button showing on the right bottom corner of this page and connect with us.
                </p>
            </div>
        </div>
    </div>
</div>
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
</body>
<!-- End Wrapper -->
</html>