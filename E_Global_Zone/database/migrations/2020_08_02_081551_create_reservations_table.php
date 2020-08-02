<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReservationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->bigIncrements('res_id');
            $table->unsignedBigInteger('res_sch');
            $table->unsignedBigInteger('res_std_kor');
            $table->unsignedTinyInteger('res_state_of_permission')->default(false);
            $table->unsignedTinyInteger('res_state_of_attendance')->default(false);
            $table->timestamps();

            /* 외래키 설정 */
            $table->foreign('res_std_kor')
                ->references('std_kor_id')
                ->on('student_koreans');

            $table->foreign('res_sch')
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
        Schema::dropIfExists('reservations');
    }
}
