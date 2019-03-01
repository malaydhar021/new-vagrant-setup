<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateUsersTableRemoveColumnsOldStripe extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function ($table) {
            if (Schema::hasColumn('users', 'customer_id')) {
                $table->dropColumn('customer_id');
            }
            if (Schema::hasColumn('users', 'subscription_id')) {
                $table->dropColumn('subscription_id');
            }
            if (Schema::hasColumn('users', 'card_brand')) {
                $table->dropColumn('card_brand');
            }
            if (Schema::hasColumn('users', 'last_four')) {
                $table->dropColumn('last_four');
            }
            if (Schema::hasColumn('users', 'expiry_date')) {
                $table->dropColumn('expiry_date');
            }
            if (Schema::hasColumn('users', 'stripe_plan_id')) {
                $table->dropColumn('stripe_plan_id');
            }
            if (Schema::hasColumn('users', 'remember_token')) {
                $table->dropColumn('remember_token');
            }
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
            if (! Schema::hasColumn('users', 'customer_id')) {
                $table->string('customer_id')->after('password')->default(null)->nullable();
            }
            if (! Schema::hasColumn('users', 'subscription_id')) {
                $table->string('subscription_id')->after('customer_id')->default(null)->nullable();
            }
            if (! Schema::hasColumn('users', 'card_brand')) {
                $table->string('card_brand')->after('subscription_id')->default(null)->nullable();
            }
            if (! Schema::hasColumn('users', 'last_four')) {
                $table->string('last_four')->after('card_brand')->default(null)->nullable();
            }
            if (! Schema::hasColumn('users', 'expiry_date')) {
                $table->string('expiry_date')->after('last_four')->default(null)->nullable();
            }
            if (! Schema::hasColumn('users', 'stripe_plan_id')) {
                $table->string('stripe_plan_id')->after('expiry_date')->nullable()->default(null);
            }
            if (! Schema::hasColumn('users', 'remember_token')) {
                $table->rememberToken()->after('api_token');
            }
        });
    }
}
