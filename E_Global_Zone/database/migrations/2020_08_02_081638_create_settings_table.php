<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->unsignedInteger('max_res_per_day');
            $table->unsignedInteger('max_std_once');
            $table->unsignedInteger('res_start_period');
            $table->unsignedInteger('res_end_period');
            $table->unsignedInteger('once_meet_time');
            $table->unsignedInteger('once_rest_time');
            $table->unsignedInteger('min_absent');
            $table->unsignedInteger('max_absent');
            $table->unsignedInteger('once_limit_period');
            $table->unsignedInteger('result_input_deadline');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('settings');
    }
}
