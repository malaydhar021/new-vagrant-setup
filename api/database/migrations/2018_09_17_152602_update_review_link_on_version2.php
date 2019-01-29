<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateReviewLinkOnVersion2 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('review_links', function (Blueprint $table) {
            $table->string('logo')->after('id')->nullable();
            $table->string('name')->after('logo')->nullable();
            $table->string('description')->after('logo')->nullable();
            $table->integer('campaign_id')->after('url_slug')->unsigned()->nullable();
            $table->tinyInteger('auto_approve')->after('campaign_id')->nullable()->default(0)->comment('0-> off, 1->on')->after('campaign_id');
            $table->text('negative_info_review_msg_1')->nullable()->after('min_rating');
            $table->text('negative_info_review_msg_2')->nullable()->after('negative_info_review_msg_1');
            $table->text('positive_review_msg')->nullable()->after('negative_info_review_msg_2');
        });
        Schema::table('review_links', function($table) {
            $table->engine = 'InnoDB';
            $table->foreign('campaign_id')->references('id')->on('campaigns');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('review_links', function (Blueprint $table)
        {
            $table->dropColumn('logo');
            $table->dropColumn('name');
            $table->dropColumn('description');
            $table->dropColumn('campaign_id');
            $table->dropColumn('auto_approve');
            $table->dropColumn('negative_info_review_msg_1');
            $table->dropColumn('negative_info_review_msg_2');
            $table->dropColumn('positive_review_msg');
            $table->dropColumn('review_links_id');
        });
    }
}
