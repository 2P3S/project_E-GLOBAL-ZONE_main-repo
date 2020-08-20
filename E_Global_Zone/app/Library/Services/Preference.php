<?php

namespace App\Library\Services;

use App\Setting;

class Preference
{
    public function getPreference()
    {
        return Setting::orderBy('setting_date', 'DESC')->get()->first();
    }
}
