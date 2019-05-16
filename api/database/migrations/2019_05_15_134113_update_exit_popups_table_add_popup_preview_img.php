<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateExitPopupsTableAddPopupPreviewImg extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('exit_pop_ups', function (Blueprint $table) {
            $table->longText('popup_preview_img')->nullable()->after('cta_button_background_color');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('exit_pop_ups', function (Blueprint $table) {
            $table->dropColumn([
                'popup_preview_img',
            ]);
        });
    }
}
