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

            <a [routerlink]="['/home/dashboard']" class="btn-oval">Let's go home</a>
        </div>
    </div>
</div>
<!-- footer -->
<?php include("footer.php")?>