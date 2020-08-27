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

            foreach ($student_foreigners as $student_foreigner) {
                $tmp_student_foreigner = Student_foreigner::find($student_foreigner['std_for_id']);

                $tmp_student_foreigner->update([
                    'std_for_num_of_delay_input' => $tmp_student_foreigner['std_for_num_of_delay_input'] + 1
                ]);
            }
            // -->>

            // <<-- 예약 미승인 횟수 카운팅
            $res_start_period_day = $setting_values['res_start_period'];              // => 예약 신청 시작 기준
            $res_end_period_day   = $setting_values['res_end_period'] == 0 ?          // => 예약 신청 마감 기준
                $setting_values['res_end_period'] :
                $setting_values['res_end_period'] - 1;

            $start_date  = date("Y-m-d", strtotime("-{$res_start_period_day} days"));
            $end_date    = date("Y-m-d", strtotime("-{$res_end_period_day} days"));

            $student_foreigners = ScheduleList::select('sch_id', 'std_for_id')
                ->join('student_foreigners as for', 'schedules.sch_std_for', 'for.std_for_id')
                ->join('reservations as res', 'schedules.sch_id', 'res.res_sch')
                ->where('res_state_of_permission', 0)
                ->where('sch_start_date', '>=', $start_date)
                ->where('sch_start_date', '<', $end_date)
                ->groupBy('sch_id')
                ->get();

            foreach ($student_foreigners as $student_foreigner) {
                $tmp_student_foreigner = Student_foreigner::find($student_foreigner['std_for_id']);

                $tmp_student_foreigner->update([
                    'std_for_num_of_delay_permission' => $tmp_student_foreigner['std_for_num_of_delay_permission'] + 1
                ]);
            }
            // -->>
        })->dailyAt('00:00');
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
