<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateUsersOnThirdParty extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('stripe_plan_id')->after('expiry_date')->nullable()->default(null);
            $table->tinyInteger('is_third_party')->after('stripe_plan_id')->nullable()->default(0)->comment('0->not third party, 1->from third party');
            $table->enum('is_active', ['0', '1'])->after('is_third_party')->comment('0->Active, 1->Inactive')->default(0)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table)
        {
            $table->dropColumn('stripe_plan_id');
            $table->dropColumn('is_third_party');
            $table->dropColumn('is_active');
        });
    }
}
