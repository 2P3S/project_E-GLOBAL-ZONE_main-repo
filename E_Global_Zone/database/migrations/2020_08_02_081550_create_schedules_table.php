<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSchedulesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('schedules', function (Blueprint $table) {
            $table->bigIncrements('sch_id');
            $table->unsignedBigInteger('sch_sect');
            $table->unsignedBigInteger('sch_std_for');
            $table->dateTime('sch_start_date');
            $table->dateTime('sch_end_date');
            $table->unsignedBigInteger('sch_res_count');
            $table->tinyInteger('sch_state_of_result_input');
            $table->tinyInteger('sch_state_of_permission');
            $table->string('sch_for_zoom_pw');

            /*
                외래키 설정
            */
            $table->foreign('sch_sect')
                ->references('sect_id')
                ->on('sections');

            $table->foreign('sch_std_for')
                ->references('std_for_id')
                ->on('student_foreigners');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('schedules');
    }
}
