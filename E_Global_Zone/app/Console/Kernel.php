<?php

namespace App\Console;

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
            // <<-- 결과 지연 입력 횟수 카운팅
            $start_date = date("Y-m-d", strtotime("-1 days"));
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
