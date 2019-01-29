<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateNegativeReviewsOnStickyReviewId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('negative_reviews', function (Blueprint $table) {
            $table->integer('sticky_review_id')->unsigned()->after('id')->nullable();
        });
        Schema::table('negative_reviews', function($table) {
            $table->engine = 'InnoDB';
            $table->foreign('sticky_review_id')->references('id')->on('sticky_reviews');
        });
        Schema::table('negative_reviews', function($table) {
            $table->engine = 'InnoDB';
            $table->dropForeign(['review_link_id']);
        });
        Schema::table('negative_reviews', function($table) {
            $table->engine = 'InnoDB';
            $table->dropColumn('review_link_id');
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('negative_reviews', function (Blueprint $table)
        {
            $table->dropForeign(['sticky_review_id']);
            $table->dropColumn('sticky_review_id');
        });
    }
}
