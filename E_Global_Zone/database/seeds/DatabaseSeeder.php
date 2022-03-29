<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // class를 못찾을 때 composer dump-autoload
        // php artisan db:seed
        $this->call(Student_foreignersTableSeeder::class);
    }
}
