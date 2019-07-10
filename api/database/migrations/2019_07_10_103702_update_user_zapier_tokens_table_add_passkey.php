<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateUserZapierTokensTableAddPasskey extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_zapier_tokens', function (Blueprint $table) {
            $table->string('passkey')->nullable()->after('token');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_zapier_tokens', function (Blueprint $table) {
            $table->dropColumn([
                'passkey',
            ]);
        });
    }
}
