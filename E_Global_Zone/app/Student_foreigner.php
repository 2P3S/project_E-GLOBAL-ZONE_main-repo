<?php

namespace App;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use SMartins\PassportMultiauth\HasMultiAuthApiTokens;

/**
 * @method static select(array $select_column)
 */
class Student_foreigner extends Authenticatable
{
    use Notifiable, HasMultiAuthApiTokens;

    protected $guard = 'foreigner';

    /* 기본키 설정 */
    protected $primaryKey = 'std_for_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'std_for_id',
        'password',
        'std_for_dept',
        'std_for_name',
        'std_for_lang',
        'std_for_country',
        'std_for_num_of_delay_permission',
        'std_for_num_of_delay_input',
        'std_for_state_of_favorite'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password'
    ];

    public function set_user_info(
        array $request
    ): int
    {
        try {
            $admin = self::where('std_for_id', $request['account']);
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

            $admin = self::where('std_for_id', $request['account'])
                ->where('remember_token', $ran_token);

        } catch (\Exception $e) {
            return null;
        }

        return $admin;
    }

    public function update_user_info(
        Builder $user, string $hashed_password
    ): bool
    {
        try {
            $user->update([
                'password' => $hashed_password
            ]);
        } catch (\Exception $e) {
            return false;
        }

        return true;
    }

    public function get_sect_not_work_std_for_list
    (
        array $work_std_for_id
    ): Collection
    {

        $select_column = [
            'student_foreigners.std_for_lang',
            'student_foreigners.std_for_country',
            'student_foreigners.std_for_id',
            'student_foreigners.std_for_name',
            'student_foreigners.std_for_dept',
            'contact.std_for_phone',
            'contact.std_for_mail',
            'contact.std_for_zoom_id'
        ];

        return self::select($select_column)
            ->join('student_foreigners_contacts as contact', 'student_foreigners.std_for_id', 'contact.std_for_id')
            ->whereNotIn('student_foreigners.std_for_id', $work_std_for_id)
            ->orderBy('student_foreigners.std_for_lang')
            ->get();
    }
}
