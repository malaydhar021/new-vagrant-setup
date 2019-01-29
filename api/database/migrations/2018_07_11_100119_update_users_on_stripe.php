<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateUsersOnStripe extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function ($table) {
            $table->string('customer_id')->after('password')->default(null)->nullable();
            $table->string('subscription_id')->after('customer_id')->default(null)->nullable();
            $table->string('card_brand')->after('subscription_id')->default(null)->nullable();
            $table->string('last_four')->after('card_brand')->default(null)->nullable();
            $table->string('expiry_date')->after('last_four')->default(null)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function ($table) {
            $table->dropColumn('customer_id');
            $table->dropColumn('subscription_id');
            $table->dropColumn('card_brand');
            $table->dropColumn('last_four');
            $table->dropColumn('expiry_date');
        });
    }
}
