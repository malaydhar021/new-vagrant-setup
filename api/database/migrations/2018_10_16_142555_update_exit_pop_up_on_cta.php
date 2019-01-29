<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateExitPopUpOnCta extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('exit_pop_ups', function (Blueprint $table) {
            $table->string('cta_link_url')->after('body_background_color')->nullable()->default(null);
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
            $table->dropColumn('cta_link_url');
        });
    }
}
