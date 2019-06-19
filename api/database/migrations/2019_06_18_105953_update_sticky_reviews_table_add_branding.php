<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateStickyReviewsTableAddBranding extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sticky_reviews', function (Blueprint $table) {
            $table->boolean('has_brand')->default(0)->comment("0 => No, 1 => Yes")->after('review_link_id');
            $table->unsignedInteger('brand_id')->nullable()->after('has_brand');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'has_brand',
                'brand_id',
            ]);
        });
    }
}
