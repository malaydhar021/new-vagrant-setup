<?php
require __DIR__.'/../api/vendor/autoload.php';
// location of .env file in api dir
$dot = new \Dotenv\Dotenv(__DIR__.'/../api/');
$dot->load(); // Load the configuration (Not override, for override use overload() method
/* get the env url and set urls */
 $getEnvUrl = $_SERVER['SERVER_NAME'];

if (strpos($getEnvUrl, 'local') !== false) {
    $linkUrl = 'local.usestickyreviews.com';
} elseif (strpos($getEnvUrl, 'beta') !== false ){
    $linkUrl = 'beta.usestickyreviews.com';
} else {
    $linkUrl = 'usestickyreviews.com';
}
/* get affiliate id from the url and store into the cookie */
if($_GET['aid']){
    // store it to the cookie
    if(!isset($_COOKIE['aid'])) {
        // set the cookie
        setcookie(aid, $_GET['aid'], time() + (86400 * 30), "/",".usestickyreviews.com");
    } else {
        setcookie(aid, $_GET['aid'], time() + (86400 * 30), "/",".usestickyreviews.com");
    }
}
?>
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

<body class="bodyDesign">

<!-- <button onclick="topFunction()" id="myBtn" title="Go to top">Top</button> -->

<header class="headerArea homeHeader">
    <div class="container">
        <div class="logo">
            <a href="/"><img src="images/logo.png" alt=""></a>
        </div>
        <div class="navArea">
            <ul class="nav">
                <li><a href="https://<?php echo $linkUrl; ?>/#howItWorks">How It Works</a></li>
                <li><a href="https://<?php echo $linkUrl; ?>/#pricing">Pricing</a></li>
                <li><a href="https://app.<?php echo $linkUrl; ?>/sign-up" target="_blank"> 14 Day Free Trial</a></li>
            </ul>
            <div class="loginBtn">
                <span id="loginBtn"> <a href="https://app.<?php echo $linkUrl; ?>" style="background-image: url(images/icon_menu_login.png);"></a></span>
                <span id="dashboard"> <a id="profileImage" href="https://app.<?php echo $linkUrl; ?>/home/dashboard" style="background-image: url(images/user.png);"></a></span>
            </div>
        </div>
        <div class="responsiveNav">
            <span></span>
        </div>
        <div class="fogLayer"></div>
    </div>
</header>