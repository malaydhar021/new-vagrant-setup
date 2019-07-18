<?php
if ( $_SERVER['REQUEST_METHOD'] == 'GET' && realpath(__FILE__) == realpath( $_SERVER['SCRIPT_FILENAME'] ) ) {
    header( 'HTTP/1.0 404 Not Found', TRUE, 404 );
    include '404.php';
    exit();
}
?>
<!-- header -->
<?php include("header.php"); ?>
<div class="maintainPages">
    <div class="errorBody">
        <div class="graphicsError">
            <img src="../images/sr_maintenance_graphic.png" alt="">
        </div>
        <div class="txtNote text-center">
            <h3>Oops! Something went wrong</h3>
            <p>This page is missing or you assembled the link incorrectly.</p>

            <a href="/" class="btn-oval">Let's go home</a>
        </div>
    </div>
</div>
<!-- footer -->
<?php include("footer.php"); ?>