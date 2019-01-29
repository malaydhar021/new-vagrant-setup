<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateReviewUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('review_users', function (Blueprint $table) {
            $table->increments('id');
            $table->enum('recommend_us',['0','1'])->comment('0-> no , 1-> yes')->default('1')->nullable();
            $table->string('customer_name')->nullable();
            $table->string('customer_email');
            $table->string('customer_image')->nullable();
            $table->enum('show_in_web',['0','1'])->comment('0-> no , 1-> yes')->default('1')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('review_users');
    }
}
