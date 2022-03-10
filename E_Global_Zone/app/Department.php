<?php

namespace App;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Config;

/**
 * @method static create(array $dept_name)
 */
class Department extends Model
{
    use Notifiable;

    /* 기본키 설정 */
    protected $primaryKey = 'dept_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['dept_name'];

    /**
     * @param bool $flag_make_json
     * @return object
     */
    public function get_departments_list(
        bool $flag_make_json = true
    ): ?object {
        $departments = null;
        try {
            $departments = self::all();
        } catch (\Exception $e) {
            $message = Config::get('constants.kor.dept.index.failure');
            return $flag_make_json ?
                Controller::response_json_error($message) :
                null;
        }

        $is_dept_no_value = !(bool)$departments->count();
        if ($is_dept_no_value) {
            $message = Config::get('constants.kor.dept.index.no_value');
            return $flag_make_json ?
                Controller::response_json_error($message) :
                null;
        }

        $message = Config::get('constants.kor.dept.index.success');

        return $flag_make_json ?
            Controller::response_json(
                $message,
                200,
                $departments
            ) :
            $departments;
    }

    public function store_department(
        string $new_dept_name
    ): JsonResponse {
        try {
            $created_department = self::create([
                'dept_name' => $new_dept_name
            ]);
        } catch (\Exception $e) {
            $message = Config::get('constants.kor.dept.store.success');
            return Controller::response_json_error($message);
        }

        $message = $new_dept_name . Config::get('constants.kor.dept.store.success');
        return Controller::response_json(
            $message,
            201,
            $created_department
        );
    }

    public function update_department(
        Department $department,
        string $update_dept_name
    ): JsonResponse {
        try {
            $department->update([
                'dept_name' => $update_dept_name
            ]);
        } catch (\Exception $e) {
            $message = Config::get('constants.kor.dept.update.failure');
            return Controller::response_json_error($message);
        }

        $message = $update_dept_name . Config::get('constants.kor.dept.update.success');
        return Controller::response_json(
            $message,
            200
        );
    }

    public function destroy_department(
        Department $department
    ): JsonResponse {
        try {
            $deleted_dept_name = $department['dept_name'];
            $department->delete();
        } catch (\Exception $e) {
            $message = $deleted_dept_name . Config::get('constants.kor.dept.destroy.failure');
            return Controller::response_json_error($message);
        }

        $message = $deleted_dept_name . Config::get('constants.kor.dept.destroy.success');
        return Controller::response_json(
            $message,
            200
        );
    }
}
