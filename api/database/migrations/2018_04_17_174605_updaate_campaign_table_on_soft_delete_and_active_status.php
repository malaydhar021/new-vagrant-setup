<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdaateCampaignTableOnSoftDeleteAndActiveStatus extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('campaigns', function ($table) {
            $table->softDeletes();
            $table->enum('is_active',['0','1'])->comment('0->Active, 1->Inactive')->default(0)->nullable();
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
            $table->dropColumn('deleted_at');
            $table->dropColumn('is_active');
        });
    }
}
