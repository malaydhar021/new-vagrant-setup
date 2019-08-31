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
        <p class="billed">*Billed monthly, <a href="#">no set up fee.</a></p>
        <p class="copyright">© 2019 All rights reserved.
            <span class="ftLinks">
                <a href="terms-and-conditions" target="_blank"> Terms and Conditions </a> 
                <a href="privacy-policy" target="_blank">Privacy Policy </a> 
                <a href="support" target="_blank">Contact Support</a>
            </span> 
        </p>
    </div>
</footer>

<script type="text/javascript">
/* <![CDATA[ */
var websocket = {url: '<?php echo getenv('WEBSOCKET_URL');  ?>'};
/* ]]> */
</script>

<script type="text/javascript" src="<?php echo getenv('WEBSOCKET_URL'); ?>/socket.io/socket.io.js"></script>
<script type="text/javascript" src="index.js"></script>

</body>

</html>
<!-- full html close -->