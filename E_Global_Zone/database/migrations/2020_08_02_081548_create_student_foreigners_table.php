<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/*
 * 수정일 : 2020-08-08
 * 작성자 : 정재순
 * 내용 : Laravel Passport Multi-Auth
 * 세부내용
 *   - 테이블 구조 수정
 *   - rememberToken() 적용
 */

class CreateStudentForeignersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('student_foreigners', function (Blueprint $table) {
            $table->unsignedBigInteger('std_for_id');
            $table->string('std_for_passwd');
            $table->unsignedBigInteger('std_for_dept');
            $table->string('std_for_name');
            $table->string('std_for_lang');
            $table->string('std_for_contry');
            $table->unsignedTinyInteger('std_for_state_of_favorite')->default(0);
            $table->rememberToken();
            $table->timestamps();

            /* 기본키 설정 */
            $table->primary('std_for_id');

            /* 외래키 설정 */
            $table->foreign('std_for_dept')
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
        Schema::dropIfExists('student_foreigners');
    }
}
