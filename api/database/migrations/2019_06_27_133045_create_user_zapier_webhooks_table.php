<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUserZapierWebhooksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_zapier_webhooks', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('created_by');
            $table->string('hook_url')->nullable();
            $table->string('trigger_type')->nullable();
            $table->string('exit_popup_id')->nullable();
            $table->string('review_link_id')->nullable();
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
        Schema::dropIfExists('user_zapier_webhooks');
    }
}