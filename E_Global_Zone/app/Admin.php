<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use SMartins\PassportMultiauth\HasMultiAuthApiTokens;

class Admin extends Authenticatable
{
    use Notifiable, HasMultiAuthApiTokens;

    protected $guard = 'admin';
    protected $primaryKey = 'id';

    protected $fillable = [
        'id', 'account', 'name'
    ];

    protected $hidden = [
        'password'
    ];
}
