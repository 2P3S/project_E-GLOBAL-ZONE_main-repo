<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

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
            $table->string('password')->default('$2y$10$UGkHe7JlJAGcto9F9pHKveMdiXQT4C/ktm8t3OmXDD7njV0wq2ACS');
            $table->unsignedBigInteger('std_for_dept');
            $table->string('std_for_name');
            $table->string('std_for_lang');
            $table->string('std_for_country');
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
