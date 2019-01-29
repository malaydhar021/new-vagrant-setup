<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateStickyReviewsOnTypes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sticky_reviews', function (Blueprint $table) {
            $table->enum('review_type', ['1','2','3','4'])->after('rating')->comment('1-> created manually in web, 2-> created by user through review link but no permission to show in web recommend us yes , 3-> created by user through review link and also show, 4-> created by user through review link with recommend us no')->nullable()->default('1');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sticky_reviews', function (Blueprint $table)
        {
            $table->dropColumn('review_type');
        });
    }
}
