<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateExitPopupsTableAddCtaFields extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('exit_pop_ups', function (Blueprint $table) {
            $table->string('cta_button_text')->nullable()->after('style_id');
            $table->string('cta_button_text_color')->nullable()->after('cta_button_text');
            $table->string('cta_button_background_color')->nullable()->after('cta_button_text_color');
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
                'cta_button_text',
                'cta_button_text_color',
                'cta_button_background_color',
            ]);
        });
    }
}
