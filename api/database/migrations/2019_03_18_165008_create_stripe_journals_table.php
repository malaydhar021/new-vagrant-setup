<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStripeJournalsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('stripe_journal', function (Blueprint $table) {
            $table->string('id')->unique()->comment('Stripe event ID');
            $table->string('type')->comment('Stripe event type');
            $table->string('object')->comment('Stripe object type');
            $table->string('object_id')->comment('Stripe object ID');
            $table->json('object_meta')->nullable()->comment('Stripe Object metadata e.g. customer.email');
            $table->dateTime('created_at')->comment('Stripe\'s event creation timestamp');
            /** Primary Key and index constraints... */
            $table->primary('id');
            $table->index('type');
            $table->index('object');
            $table->index('object_id');
            $table->index(['type', 'object']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('stripe_journal');
    }
}
