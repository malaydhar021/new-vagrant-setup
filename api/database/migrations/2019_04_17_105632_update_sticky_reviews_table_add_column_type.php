<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateStickyReviewsTableAddColumnType extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sticky_reviews', function (Blueprint $table) {
            $table->enum('type', ['textual', 'audio', 'video'])
                ->default('textual')
                ->after('name')
                ->comment(
                    "Type to determine if the review is a audio, video or textual review and not to be confused with " .
                    "review type which is being used to determine if the review is created from review link or not, " .
                    "also has permission to show or not etc."
                );
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('sticky_reviews', function (Blueprint $table) {
            $table->dropColumn('type');
        });
    }
}
