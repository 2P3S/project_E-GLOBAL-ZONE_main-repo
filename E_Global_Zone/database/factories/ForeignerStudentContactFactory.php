<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Student_foreigners_contact;
use Faker\Generator as Faker;

$factory->define(Student_foreigners_contact::class, function (Faker $faker) {
    $std_for = factory('App\Student_foreigner')->make();
    $std_for_id = $std_for->std_for_id;
    $std_for->save();
    return [
        'std_for_id' => $std_for_id,
        'std_for_phone' => $faker->unique()->cellPhoneNumber,
        'std_for_mail' => $faker->unique()->safeEmail,
        'std_for_zoom_id' => $faker->unique()->numberBetween(1000000000, 9999999999)
    ];
});
