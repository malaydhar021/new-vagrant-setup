<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateStickyReviewsOnReviewLinkForeignKey extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sticky_reviews', function (Blueprint $table) {
            $table->integer('review_link_id')->after('review_type')->unsigned()->nullable()->default(null);
        });
        Schema::table('sticky_reviews', function($table) {
            $table->engine = 'InnoDB';
            $table->foreign('review_link_id')->references('id')->on('review_links');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sticky_reviews', function (Blueprint $table)
        {
            $table->dropColumn('review_link_id');
        });
    }
}
