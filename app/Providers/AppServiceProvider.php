<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Validator;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        // 휴대폰 번호 확인
        Validator::extend('phone_number', function($attribute, $value, $parameters, $validator) {
            $regular_expression = '/^\d{3}-\d{3,4}-\d{4}$/i';

            return preg_match($regular_expression, $value);
        });

        // G-suite 계정 확인
        Validator::extend('g_suite_mail', function ($attribute, $value, $parameters, $validator) {
            $parse_email = explode('@', $value)[1];

            return strcmp($parse_email, 'g.yju.ac.kr');
        });
    }
}
