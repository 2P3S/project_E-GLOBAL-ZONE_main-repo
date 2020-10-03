<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNoticesImgsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('notices_imgs', function (Blueprint $table) {
            $table->unsignedBigInteger('noti_id');
            $table->string('img_url')->unique();
            $table->timestamps();

            $table->primary('noti_id');

            $table->foreign('noti_id')
                ->references('noti_id')
                ->on('notices')
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
        Schema::dropIfExists('notice_imgs');
    }
}
