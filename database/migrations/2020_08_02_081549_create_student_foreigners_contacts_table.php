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
            $table->string('std_for_phone');
            $table->string('std_for_mail');
            $table->string('std_for_zoom_id');
            $table->timestamps();

            /*
                외래키
            */
            $table->foreign('std_for_id')
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
        Schema::dropIfExists('student_foreigners_contacts');
    }
}
