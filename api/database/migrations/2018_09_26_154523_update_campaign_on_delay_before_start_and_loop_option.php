<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateCampaignOnDelayBeforeStartAndLoopOption extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('campaigns', function (Blueprint $table) {
            $table->mediumInteger('delay_before_start')->after('delay')->nullable()->default(0);
            $table->enum('loop', [0,1])->after('delay_before_start')->nullable()->default(1)->comment('0-> do not loop, 1-> loop');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('campaigns', function (Blueprint $table)
        {
            $table->dropColumn('delay_before_start');
            $table->dropColumn('loop');
        });
    }
}
