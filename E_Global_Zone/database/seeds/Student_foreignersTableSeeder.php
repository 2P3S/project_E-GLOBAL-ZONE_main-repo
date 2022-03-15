<?php

use App\Student_foreigners_contact;
use Illuminate\Database\Seeder;

class Student_foreignersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // 유학생 연락처 만들어지면서 유학생 계정도 새롭게 생성됨.
        factory(Student_foreigners_contact::class, 1000)->create();
    }
}
