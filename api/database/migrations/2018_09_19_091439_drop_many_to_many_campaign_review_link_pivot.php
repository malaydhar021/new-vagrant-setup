<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DropManyToManyCampaignReviewLinkPivot extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('campaign_review_link');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::create('campaign_review_link',function(Blueprint $table) {
            $table->increments('id');
            $table->integer('campaign_id');
            $table->integer('review_link_id');
            $table->timestamps();
        });
    }
}
