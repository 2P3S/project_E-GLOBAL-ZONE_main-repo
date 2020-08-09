<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSchedulesResultImgsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('schedules_result_imgs', function (Blueprint $table) {
            $table->unsignedBigInteger('sch_id');
            $table->string('start_img_url')->unique();
            $table->string('end_img_url')->unique();
            $table->timestamps();

            $table->primary('sch_id');

            $table->foreign('sch_id')
                ->references('sch_id')
                ->on('schedules');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('schedules_result_imgs');
    }
}
