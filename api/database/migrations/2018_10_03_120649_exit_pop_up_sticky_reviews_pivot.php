<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ExitPopUpStickyReviewsPivot extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('exit_pop_up_sticky_review',function(Blueprint $table) {
            $table->increments('id');
            $table->integer('exit_pop_up_id')->unsigned();
            $table->integer('sticky_review_id')->unsigned();
            $table->timestamps();
        });
        Schema::table('exit_pop_up_sticky_review', function($table) {
            $table->engine = 'InnoDB';
            $table->foreign('exit_pop_up_id')->references('id')->on('exit_pop_ups');
            $table->foreign('sticky_review_id')->references('id')->on('sticky_reviews');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('exit_pop_up_sticky_review');
    }
}
