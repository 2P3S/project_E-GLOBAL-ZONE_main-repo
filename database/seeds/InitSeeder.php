<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Hash;

class InitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('admins')->insert([
            "account" => "oic_yju",
            "password" => Hash::make(env('ADMIN_INITIAL_PASSWORD')),
            "name" => "국제교류원"
        ]);

        DB::table('departments')->insert([
            "dept_name" => "컴정_컴퓨터정보계열"
        ]);
        DB::table('departments')->insert([
            "dept_name" => "기계_컴퓨터응용기계계열"
        ]);
        DB::table('departments')->insert([
            "dept_name" => "전자_ICT반도체전자계열"
        ]);
        DB::table('departments')->insert([
            "dept_name" => "전기_신재생에너지전기계열"
        ]);
        DB::table('departments')->insert([
            "dept_name" => "건축_건축인테리어디자인계열"
        ]);
        DB::table('departments')->insert([
            "dept_name" => "부사관_부사관계열"
        ]);
        DB::table('departments')->insert([
            "dept_name" => "콘디_콘텐츠디자인과"
        ]);
        DB::table('departments')->insert([
            "dept_name" => "드론전자_드론항공전자과"
        ]);
        DB::table('departments')->insert([
            "dept_name" => "경영_경영회계서비스계열"
        ]);
        DB::table('departments')->insert([
            "dept_name" => "관광_호텔항공관광계열"
        ]);
        DB::table('departments')->insert([
            "dept_name" => "사회복지_사회복지과"
        ]);
        DB::table('departments')->insert([
            "dept_name" => "유아_유아교육과"
        ]);
        DB::table('departments')->insert([
            "dept_name" => "보건의료_보건의료행정과"
        ]);
        DB::table('departments')->insert([
            "dept_name" => "간호_간호학과"
        ]);

        DB::table('settings')->insert([
            "max_res_per_day" => 1
        ]);
    }
}
