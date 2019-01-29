<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateExitPopUpOnCTAUpdate extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('exit_pop_ups', function (Blueprint $table) {
            $table->enum('btn_size', ['L','S'])->after('campaign_id')->nullable()->default('L');
            $table->string('btn_text')->after('btn_size')->default('CTA')->nullable();
            $table->string('btn_color')->after('btn_text')->default('#0074d9')->nullable();
            $table->string('btn_text_color')->after('btn_color')->default('#fff')->nullable();
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
            $table->dropColumn('btn_size');
            $table->dropColumn('btn_text');
            $table->dropColumn('btn_color');
            $table->dropColumn('btn_text_color');
        });
    }
}
