<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStudentKoreansTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('student_koreans', function (Blueprint $table) {
            $table->unsignedBigInteger('std_kor_id');
            $table->unsignedBigInteger('std_kor_dept');
            $table->string('std_kor_name');
            $table->string('std_kor_phone')->unique();
            $table->string('std_kor_mail')->unique();
            $table->unsignedBigInteger('std_kor_num_of_attendance');
            $table->unsignedBigInteger('std_kor_num_of_absent');
            $table->tinyInteger('std_kor_state_of_permission');
            $table->tinyInteger('std_kor_state_of_restriction');
            $table->timestamps();

            /*
                외래키 설정
            */
            $table->foreign('std_kor_dept')
                ->references('dept_id')
                ->on('departments');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('student_koreans');
    }
}
