<?php

namespace App\Console;

use App\Library\Services\Preference;
use App\Schedule as ScheduleList;
use App\Student_foreigner;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        //
    ];

    /**
     * Define the application's command schedule.
     *
     * @param \Illuminate\Console\Scheduling\Schedule $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->call(function () {
            // 환경변수
            $setting_obj = new Preference();
            $setting_values = $setting_obj->getPreference();

            // <<-- 결과 지연 입력 횟수 카운팅
            $start_date = date("Y-m-d", strtotime("-{$setting_values['result_input_deadline']} days"));
            $end_date = date("Y-m-d");

            $student_foreigners = ScheduleList::join('student_foreigners as for', 'schedules.sch_std_for', 'for.std_for_id')
                ->where('sch_state_of_result_input', 0)
                ->where('sch_start_date', '>=', $start_date)
                ->where('sch_start_date', '<', $end_date)
                ->where('sch_end_date', '>=', $start_date)
                ->where('sch_end_date', '<', $end_date)
                ->get();

            foreach ($student_foreigners as $schedule) {
                $reservation_data = ScheduleList::join('reservations as res', 'schedules.sch_id', '=', 'res.res_sch');

                // 전체 예약 한국인 인원수
                $reservated_count = $reservation_data
                    ->whereNotNull('res.res_std_kor')
                    ->where('res.res_sch', '=', $schedule->sch_id)->count();

                // 예약 한국인이 0 명일 경우 자동 관리자 승인 ( 근로 시간 인증 )
                if ($reservated_count == 0) {
                    $schedule->update([
                        'sch_state_of_permission' => true,
                    ]);
                } // 예약 한국인 학생이 있을 경우 결과 지연 입력 횟수 증가
                else {
                    $tmp_student_foreigner = Student_foreigner::find($schedule['std_for_id']);

                    $tmp_student_foreigner->update([
                        'std_for_num_of_delay_input' => $tmp_student_foreigner['std_for_num_of_delay_input'] + 1
                    ]);
                }
            }
            // -->>
        })->daily();

        $schedule->call(function () {
            // 환경변수
            $setting_obj = new Preference();
            $setting_values = $setting_obj->getPreference();

            // <<-- 예약 미승인 횟수 카운팅
            $reservation_due_period = $setting_values['res_end_period'] - 1;
            $reservation_due_date = date("Y-m-d", strtotime("-{$reservation_due_period} days"));

            //            $now_date = date("Y-m-d");

            $student_foreigners = ScheduleList::select('sch_id', 'std_for_id')
                ->join('student_foreigners as for', 'schedules.sch_std_for', 'for.std_for_id')
                ->join('reservations as res', 'schedules.sch_id', 'res.res_sch')
                ->where('res_state_of_permission', 0)
                ->whereDate('sch_start_date', '=', $reservation_due_date)
                ->groupBy('sch_id')
                ->get();

            foreach ($student_foreigners as $student_foreigner) {
                $tmp_student_foreigner = Student_foreigner::find($student_foreigner['std_for_id']);

                $tmp_student_foreigner->update([
                    'std_for_num_of_delay_permission' => $tmp_student_foreigner['std_for_num_of_delay_permission'] + 1
                ]);
            }
            // -->>
        })->daily();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
