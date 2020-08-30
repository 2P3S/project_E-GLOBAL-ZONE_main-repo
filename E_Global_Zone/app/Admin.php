<?php

namespace App;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use SMartins\PassportMultiauth\HasMultiAuthApiTokens;

class Admin extends Authenticatable
{
    use Notifiable, HasMultiAuthApiTokens;

    protected $guard = 'admin';
    protected $primaryKey = 'id';

    protected $fillable = [
        'id', 'account', 'name', 'reset_expire_time'
    ];

    protected $hidden = [
        'password'
    ];

    public function set_user_info(
        array $request
    ): int
    {
        try {
            $admin = self::where('account', $request['account']);
            $ran_num = random_int(0, strlen($request['token']) - 101);
            $ran_token = substr($request['token'], $ran_num, 100);

            $admin->update([
                'remember_token' => $ran_token
            ]);
        } catch (\Exception $e) {
            return 0;
        }
        return $ran_num;
    }

    public function get_user_info(
        array $request
    ): ?Builder
    {
        $admin = null;
        try {
            $ran_num = $request['ran_num'];
            $ran_token = substr($request['token'], $ran_num, 100);

            $admin = self::where('account', $request['account'])
                ->where('remember_token', $ran_token);

        } catch (\Exception $e) {
            return null;
        }

        return $admin;
    }
}
