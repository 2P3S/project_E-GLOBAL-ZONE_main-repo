<?php

namespace App\Http\Controllers;

use App\Department;
use Box\Spout\Common\Exception\SpoutException;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Config;
use Rap2hpoutre\FastExcel\FastExcel;

class DataExportController extends Controller
{
    private $department;

    public function __construct()
    {
        $this->department = new Department();
    }

    private function set_fastExcel(Collection $collection, string $file_name)
    {
        try {
            return (new FastExcel($collection))->download($file_name);
        } catch (SpoutException $e) {
            $message = Config::get('constants.kor.data_export.failure');
            return self::response_json_error($message);
        }
    }

    public function index_dept()
    {
        $departments = $this->department->get_departments_list(false);
        return $this->set_fastExcel($departments, Config::get('constants.kor.data_export.dept'));
    }
}
