<?php

namespace App;

use App\Http\Controllers\SchedulesResultImgController;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Notices_img extends Model
{
    use Notifiable;

    /* 기본키 설정 */
    protected $primaryKey = 'noti_id';

    protected $guarded = [];

    public function set_imgs(Notice $notice, array $imgs): bool
    {
        $img_controller = new SchedulesResultImgController();

        try {
            foreach($imgs as $key => $img_file) {
                $file_name = "{$notice['noti_id']}-{$key}";

                self::create([
                    'noti_id' => $notice['noti_id'],
                    'noti_img_url' => $img_controller->set_img($img_file, $file_name, 'notice')
                ]);
            }
        } catch (Exception $e) {
            $notice->delete();
            dd($e);
            return false;
        }

        return true;
    }
}
