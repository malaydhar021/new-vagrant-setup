<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateUsersTableAddClomunsNewStripe extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function ($table) {
            $table->string('stripe_id')->nullable()->collation('utf8mb4_bin')->after('password');
            $table->string('card_brand')->nullable()->after('stripe_id');
            $table->string('card_last_four', 4)->nullable()->after('card_brand');
            $table->timestamp('trial_ends_at')->nullable()->after('card_last_four');
            $table->string('pricing_plan')->nullable()->after('trial_ends_at');
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
            $table->dropColumn([
                'stripe_id',
                'card_brand',
                'card_last_four',
                'trial_ends_at',
                'pricing_plan',
            ]);
        });
    }
}
