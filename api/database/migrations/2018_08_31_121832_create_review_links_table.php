<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateReviewLinksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('review_links', function (Blueprint $table) {
            $table->increments('id');
            $table->string('url_slug')->unique();
            $table->integer('min_rating')->nullable()->default(null);
            $table->integer('created_by')->unsigned();
            $table->softDeletes();
            $table->timestamps();
        });
        Schema::table('review_links', function($table) {
            $table->engine = 'InnoDB';
            $table->foreign('created_by')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('review_links');
    }
}
