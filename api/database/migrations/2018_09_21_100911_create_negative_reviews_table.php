<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNegativeReviewsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('review_users');
        Schema::create('negative_reviews', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('review_link_id')->unsigned();
            $table->string('email')->nullable()->default(null);
            $table->string('phone')->nullable()->default(null);
            $table->softDeletes();
            $table->timestamps();
        });
        Schema::table('negative_reviews', function($table) {
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
        Schema::dropIfExists('negative_reviews');
    }
}
