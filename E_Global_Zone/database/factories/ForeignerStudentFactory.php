<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Department;
use App\Student_foreigner;
use Faker\Generator as Faker;

$factory->define(Student_foreigner::class, function (Faker $faker) {
    $depts = Department::pluck('dept_id')->toArray();
    return [
        'std_for_id' => $faker->unique()->randomNumber(7, true),
        'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        'std_for_dept' => $faker->randomElement($depts),
        'std_for_name' => $faker->name,
        'std_for_lang' => $faker->randomElement(['영어', '일본어', '중국어']),
        'std_for_country' => $faker->randomElement(['프랑스', '일본', '중국', '대만', '러시아', '필리핀']),
    ];
});
