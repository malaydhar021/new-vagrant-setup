<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSubscribedEmailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('subscribed_emails', function (Blueprint $table) {
            $table->increments('id');
            $table->string('email')->index('subscribed_emails_email_index');
            $table->unsignedInteger('exit_pop_up_id');
            $table->timestamps();

            $table->foreign('exit_pop_up_id')->on('exit_pop_ups')->references('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('subscribed_emails');
    }
}
