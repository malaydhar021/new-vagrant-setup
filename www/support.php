<!-- header -->
<?php include("header.php"); ?>
<!-- Main wrapper  -->
<div>
    <div id="main-wrapper" class="spacingheader">
        <app-noticelabel [showNotice]="isMaintenance"></app-noticelabel>
        <style>
            /* iframe's parent node */
            div#root {
                position: fixed;
                width: 100%;
                height: 100%;
            }

            /* iframe itself */
            div#root>iframe {
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
        <div id="root" class="supportContent">
            <iframe src="https://stickyreviews.nolt.io/" class="iframe-div"></iframe>
            <div class="container inSupport">
                <p>
                    For any product related support please click on the messenger button showing on the right bottom
                    corner of this page and connect with us.
                </p>
            </div>
        </div>
    </div>
</div>
<!-- FB Customer messenger chat widget-->
<script>
  var div = document.createElement('div');
  div.className = 'fb-customerchat';
  div.setAttribute('page_id', '280656062532697');
  div.setAttribute('ref', '');
  document.body.appendChild(div);
  window.fbMessengerPlugins = window.fbMessengerPlugins || {
    init: function () {
      FB.init({
        appId            : '1678638095724206',
        autoLogAppEvents : true,
        xfbml            : true,
        version          : 'v3.0'
      });
    }, callable: []
  };
  window.fbAsyncInit = window.fbAsyncInit || function () {
    window.fbMessengerPlugins.callable.forEach(function (item) { item(); });
    window.fbMessengerPlugins.init();
  };
  setTimeout(function () {
    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s);
      js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk/xfbml.customerchat.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }, 0);
</script>
<!-- footer -->
<?php include("footer.php"); ?>