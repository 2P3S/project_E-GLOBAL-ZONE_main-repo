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
            $table->dateTime('setting_date')->default(NOW());
            $table->unsignedInteger('max_res_per_day')->default(1);
            $table->unsignedInteger('max_std_once')->default(4);
            $table->unsignedInteger('res_start_period')->default(1);
            $table->unsignedInteger('res_end_period')->default(1);
            $table->unsignedInteger('once_meet_time')->default(20);
            $table->unsignedInteger('once_rest_time')->default(10);
            $table->unsignedInteger('min_absent')->default(3);
            $table->unsignedInteger('max_absent')->default(5);
            $table->unsignedInteger('once_limit_period')->default(3);
            $table->unsignedInteger('result_input_deadline')->default(1);
            $table->string('default_admin_pw');
            $table->string('default_std_for_pw');
            /* 기본키 설정 */
            $table->primary('setting_date');
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
