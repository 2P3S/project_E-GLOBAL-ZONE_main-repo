<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStudentForeignersContactsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('student_foreigners_contacts', function (Blueprint $table) {
            $table->unsignedBigInteger('std_for_id');
            $table->string('std_for_phone')->unique();
            $table->string('std_for_mail')->unique();
            $table->unsignedBigInteger('std_for_zoom_id')->unique();
            $table->timestamps();

            /* 기본키 설정 */
            $table->primary('std_for_id');

            /* 외래키 설정 */
            $table->foreign('std_for_id')
                ->references('std_for_id')
                ->on('student_foreigners')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('student_foreigners_contacts');
    }
}
