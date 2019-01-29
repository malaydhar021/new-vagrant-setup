<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateExitPopUpsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('exit_pop_ups', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('created_by')->unsigned();
            $table->string('name');
            $table->string('header_text')->nullable();
            $table->string('header_background_color')->nullable();
            $table->string('header_text_color')->nullable();
            $table->string('semi_header_text')->nullable()->default(null);
            $table->string('semi_header_text_color')->nullable();
            $table->string('body_background_color')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
        Schema::table('exit_pop_ups', function($table) {
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
        Schema::dropIfExists('exit_pop_ups');
    }
}
