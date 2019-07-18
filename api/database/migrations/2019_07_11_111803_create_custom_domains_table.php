<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCustomDomainsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('custom_domains', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name')->nullable();
            $table->string('domain')->index('custom_domains_domain_index')->unique();
            $table->unsignedInteger('created_by');
            $table->tinyInteger('is_default')->default(0)->comment("1. Default 0. Not default");
            $table->softDeletes();
            $table->timestamps();
            // adding foreign key reference to custom domains table
            $table->foreign('created_by')->on('users')->references('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('custom_domains');
    }
}
