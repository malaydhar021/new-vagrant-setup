<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateCampaignTableAddCustomDomainId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('campaigns', function (Blueprint $table) {
            $table->integer('custom_domain_id')->unsigned()->after('branding_id')->nullable();
        });
        Schema::table('campaigns', function($table) {
            $table->foreign('custom_domain_id')->references('id')->on('custom_domains');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('campaigns', function (Blueprint $table) {
            $table->dropForeign('campaigns_custom_domain_id_foreign');
        });
        Schema::table('campaigns', function (Blueprint $table) {
            $table->dropColumn('custom_domain_id');
        });
    }
}
