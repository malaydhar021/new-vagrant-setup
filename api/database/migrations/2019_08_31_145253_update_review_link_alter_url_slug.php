<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateReviewLinkAlterUrlSlug extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('review_links', function (Blueprint $table) {
            $table->dropUnique('review_links_url_slug_unique');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // make it unique
        Schema::table('review_links', function (Blueprint $table) {
            $table->unique('url_slug');
        });
    }
}
