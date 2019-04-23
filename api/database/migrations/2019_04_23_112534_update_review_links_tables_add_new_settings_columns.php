<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateReviewLinksTablesAddNewSettingsColumns extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('review_links', function (Blueprint $table) {
            $table->string('page_background')->nullable()->after('positive_review_msg');
            $table->string('modal_background')->nullable()->after('page_background');
            $table->string('text_color')->nullable()->after('modal_background');
            $table->string('copyright_text')->nullable()->after('text_color');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('review_links', function (Blueprint $table) {
            $table->dropColumn([
                'page_background',
                'modal_background',
                'text_color',
                'copyright_text',
            ]);
        });
    }
}
