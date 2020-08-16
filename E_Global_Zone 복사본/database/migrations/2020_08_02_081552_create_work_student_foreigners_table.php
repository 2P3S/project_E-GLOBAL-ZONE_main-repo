<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWorkStudentForeignersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('work_student_foreigners', function (Blueprint $table) {
            $table->bigIncrements('work_list_id');
            $table->unsignedBigInteger('work_std_for');
            $table->unsignedBigInteger('work_sect');

            /* 외래키 설정 */
            $table->foreign('work_std_for')
                ->references('std_for_id')
                ->on('student_foreigners');

            $table->foreign('work_sect')
                ->references('sect_id')
                ->on('sections');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('work_student_foreigners');
    }
}
