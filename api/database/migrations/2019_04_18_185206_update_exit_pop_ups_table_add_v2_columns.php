<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateExitPopUpsTableAddV2Columns extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('exit_pop_ups', function (Blueprint $table) {
            $table->string('popup_backdrop_color')->nullable()->after('body_background_color');
            $table->boolean('has_email_field')->default(0)->comment("0 => No, 1 => Yes")->after('popup_backdrop_color');
            $table->boolean('has_campaign')->default(0)->comment("0 => No, 1 => Yes")->after('cta_link_url');
            $table->boolean('has_sticky_reviews')->default(0)->comment("0 => No, 1 => Yes")->after('campaign_id');
            $table->unsignedInteger('style_id')->nullable()->after('btn_text_color');

            $table->foreign('style_id')->on('exit_popup_styles')->references('id');
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
                'popup_backdrop_color',
                'has_email_field',
                'has_campaign',
                'has_sticky_reviews',
                'style_id',
            ]);
        });
    }
}
