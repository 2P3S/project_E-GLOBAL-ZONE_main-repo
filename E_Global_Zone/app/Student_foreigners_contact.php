<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

/**
 * @method static create(array $std_for_contact)
 * @method static find($std_for_id)
 */
class Student_foreigners_contact extends Model
{
    use Notifiable;

    /* 기본키 설정 */
    protected $primaryKey = 'std_for_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

    public function get_std_for_contact(
        Student_foreigner $std_for
    ): self
    {
        return self::find($std_for['std_for_id']);
    }

    public function store_std_for_contact(
        array $std_for_contact_data
    ): ?self
    {
        $std_for_contact = null;
        try {
            $std_for_contact = self::create($std_for_contact_data);
        } catch (\Exception $e) {
            return null;
        }

        return $std_for_contact;
    }

    public function destroy_std_for_contact(
        self $std_for_contact
    ): bool
    {
        try {
            $std_for_contact->delete();
        } catch (\Exception $e) {
            return false;
        }

        return true;
    }
}
