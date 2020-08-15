<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRestrictedStudentKoreansTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('restricted_student_koreans', function (Blueprint $table) {
            $table->bigIncrements('restrict_id');
            $table->unsignedBigInteger('restrict_std_kor');
            $table->string('restrict_reason');
            $table->dateTime('restrict_start_date')->default(now());
            $table->dateTime('restrict_end_date');
            $table->timestamps();


            /* 외래키 설정 */
            $table->foreign('restrict_std_kor')
                ->references('std_kor_id')
                ->on('student_koreans');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('restricted_student_koreans');
    }
}
