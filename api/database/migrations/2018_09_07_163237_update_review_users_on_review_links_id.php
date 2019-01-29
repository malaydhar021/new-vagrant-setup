<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateReviewUsersOnReviewLinksId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('review_users', function (Blueprint $table) {
            $table->integer('review_links_id')->after('show_in_web')->unsigned()->nullable();
        });
        Schema::table('review_users', function($table) {
            $table->engine = 'InnoDB';
            $table->foreign('review_links_id')->references('id')->on('review_links');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('review_users', function (Blueprint $table)
        {
            $table->dropColumn('review_links_id');
        });
    }
}
