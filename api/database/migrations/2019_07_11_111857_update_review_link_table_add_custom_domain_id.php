<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateReviewLinkTableAddCustomDomainId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('review_links', function (Blueprint $table) {
            $table->integer('custom_domain_id')->unsigned()->after('campaign_id')->nullable();
        });
        Schema::table('review_links', function($table) {
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
        Schema::table('review_links', function (Blueprint $table) {
            $table->dropForeign('review_links_custom_domain_id_foreign');
        });
        Schema::table('review_links', function (Blueprint $table) {
            $table->dropColumn('custom_domain_id');
        });
    }
}
