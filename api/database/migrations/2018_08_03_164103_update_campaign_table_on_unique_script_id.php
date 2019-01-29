<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateCampaignTableOnUniqueScriptId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('campaigns', function (Blueprint $table) {
            $table->string('unique_script_id')->after('id')->nullable()->default(null)->comment('this id we use for fetching campaign from widget');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (Schema::hasColumn('campaigns', 'unique_script_id'))
        {
            Schema::table('campaigns', function (Blueprint $table)
            {
                $table->dropColumn('unique_script_id');
            });
        }
    }
}
