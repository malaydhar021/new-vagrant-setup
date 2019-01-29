<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateCampaignOnExitPopUp extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('campaigns', function (Blueprint $table) {
            $table->enum('exit_pop_up', [0,1])->after('loop')->nullable()->default(0)->comment('0-> no, 1-> yes');
            $table->integer('exit_pop_up_id')->unsigned()->after('exit_pop_up')->nullable();
        });
        Schema::table('campaigns', function($table) {
            $table->engine = 'InnoDB';
            $table->foreign('exit_pop_up_id')->references('id')->on('exit_pop_ups');
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
            $table->dropColumn('exit_pop_up');
            $table->dropColumn('exit_pop_up_id');
        });
    }
}
