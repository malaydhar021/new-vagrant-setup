<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateExitPopUpOnCampaignId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('exit_pop_ups', function (Blueprint $table) {
            $table->integer('campaign_id')->after('cta_link_url')->unsigned()->nullable()->default(null);
        });
        Schema::table('exit_pop_ups', function($table) {
            $table->engine = 'InnoDB';
            $table->foreign('campaign_id')->references('id')->on('campaigns');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('exit_pop_ups', function (Blueprint $table)
        {
            $table->dropColumn('campaign_id');
        });
    }
}
