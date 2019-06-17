<!-- header -->
<?php include("header.php"); ?>
<!-- FB Customer messenger chat widget-->
<div class="fb-customerchat" page_id="280656062532697" ref="Chat-Widget"></div>
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
            <div class="container">
                <p>
                    For any product related support please click on the messenger button showing on the right bottom
                    corner of this page and connect with us.
                </p>
            </div>
        </div>
    </div>
</div>
<!-- footer -->
<?php include("footer.php"); ?>