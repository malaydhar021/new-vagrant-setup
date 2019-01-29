<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateCampaignOnNewStructre extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('campaigns', function ($table) {
            $table->enum('styles',['rounded','square'])->after('domain_name')->default('rounded')->nullable();
            $table->mediumInteger('delay')->after('styles')->default(3000)->nullable();
            $table->boolean('branding')->after('delay')->default(true)->nullable();
            $table->integer('branding_id')->after('branding')->default(null)->nullable()->unsigned();
        });
        Schema::table('campaigns', function($table) {
            $table->engine = 'InnoDB';
            $table->foreign('branding_id')->references('id')->on('brandings');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('campaigns', function ($table) {
            $table->engine = 'InnoDB';
            $table->dropForeign('campaigns_branding_id_foreign');
        });
        Schema::table('campaigns', function ($table) {
            $table->dropColumn('styles');
            $table->dropColumn('delay');
            $table->dropColumn('branding');
            $table->dropColumn('branding_id');
        });
    }
}
