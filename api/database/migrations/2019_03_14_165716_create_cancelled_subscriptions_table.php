<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCancelledSubscriptionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cancelled_subscriptions', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('user_id');
            $table->unsignedInteger('subscription_id');
            $table->string('reason');
            $table->longText('description')->nullable();
            $table->timestamps();

            /** Foreign key constraints... */
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('subscription_id')->references('id')->on('subscriptions');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('cancelled_subscriptions');
    }
}
