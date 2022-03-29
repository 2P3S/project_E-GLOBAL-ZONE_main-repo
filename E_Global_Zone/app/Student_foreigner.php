<?php

namespace App;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Http\JsonResponse;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Config;
use SMartins\PassportMultiauth\HasMultiAuthApiTokens;

/**
 * @method static select(array $select_column)
 * @method static create(array $std_for_data)
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
        'password',
        'remember_token'
    ];

    /** One To One 관계 설정 */
    public function contact()
    {
        return $this->hasOne('App\Student_foreigners_contact', 'std_for_id', 'std_for_id');
    }

    public function set_user_info(
        array $request
    ): int {
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
    ): ?Builder {
        //        $admin = null;
        //        try {
        //        $ran_num = $request['ran_num'];
        //        $ran_token = substr($request['token'], $ran_num, 100);

        $admin = self::where('std_for_id', $request['account']);
        //        $admin = self::where('std_for_id', $request['account'])
        //            ->where('remember_token', $ran_token);

        //        } catch (\Exception $e) {
        //            return null;
        //        }

        return $admin;
    }


    //    public function update_user_info(
    //        Builder $user, string $hashed_password
    //    ): bool
    //    {
    //        try {
    //            $user->update([
    //                'password' => $hashed_password
    //            ]);
    //        } catch (\Exception $e) {
    //            return false;
    //        }
    //
    //        return true;
    //    }

    public function update_user_info(
        string $user,
        string $hashed_password
    ): bool {
        try {
            self::where('std_for_id', $user)
                ->update([
                    'password' => $hashed_password
                ]);
            //            $user->update([
            //                'password' => $hashed_password
            //            ]);
        } catch (\Exception $e) {
            return false;
        }

        return true;
    }

    public function get_sect_not_work_std_for_list(
        array $work_std_for_id
    ): Collection {

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

    // 선택한 유학생의 연락처 정보를 조회
    public function get_std_for_contacts(
        array $std_for_list
    ): JsonResponse {
        $data_std_for = null;
        $select_column = [
            'student_foreigners.std_for_id',
            'student_foreigners.std_for_name',
            'contact.std_for_phone',
            'contact.std_for_mail',
            'contact.std_for_zoom_id'
        ];

        // <<-- foreach 제거 -> wherein 으로 변경
        // 학생 정보 저장
        //        foreach ($std_for_list as $std_for_id) {
        //            // 학번 기준 검색
        //            $search_result =
        //                self::select($select_column)
        //                    ->join('student_foreigners_contacts as contact', 'student_foreigners.std_for_id', 'contact.std_for_id')
        //                    ->where('student_foreigners.std_for_id', $std_for_id)->get()->first();
        //
        //            // 검색 결과 저장
        //            if ($search_result) {
        //                $data_std_for[] = $search_result;
        //            }
        //        }
        // -->>

        $data_std_for =
            self::select($select_column)
            ->join('student_foreigners_contacts as contact', 'student_foreigners.std_for_id', 'contact.std_for_id')
            ->whereIn('student_foreigners.std_for_id', $std_for_list)->get();

        if (empty($data_std_for)) {
            return
                Controller::response_json_error(Config::get('constants.kor.std_for_contacts.index.no_value'));
        }

        return
            Controller::response_json(
                Config::get('constants.kor.std_for_contacts.index.success'),
                200,
                (object)$data_std_for
            );
    }

    public function store_std_for_info(
        array $std_for_data
    ): ?self {
        $std_for = null;
        try {
            $std_for = self::create($std_for_data);
        } catch (\Exception $e) {
            return null;
        }

        return $std_for;
    }

    public function destroy_std_for(
        self $std_for
    ): bool {
        try {
            $std_for->delete();
        } catch (\Exception $e) {
            return false;
        }

        return true;
    }
}
