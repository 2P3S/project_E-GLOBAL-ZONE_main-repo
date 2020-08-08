<?php

namespace App\Model;

use RuntimeException;
use Illuminate\Hashing\HashManager;
use Illuminate\Foundation\Auth\User as Authenticatable;

/*
 * TODO
 * 작성일 : 2020-08-08
 * 작성자 : 정재순
 * 내용 : Laravel Passport Multi-Auth 적용
 * 세부내용
 *   - class Authenticator 정의
 */

class Authenticator
{
    /**
     * The hasher implementation.
     *
     * @var \Illuminate\Hashing\HashManager
     */
    protected $hasher;

    /**
     * Create a new repository instance.
     *
     * @param \Illuminate\Hashing\HashManager $hasher
     * @return void
     */
    public function __construct(HashManager $hasher)
    {
        $this->hasher = $hasher->driver();
    }

    /**
     * @param string $account
     * @param string $password
     * @param string $provider
     * @return Authenticatable|null
     */
    public function attempt(
        string $account,
        string $password,
        string $provider
    ): ?Authenticatable
    {
        if (!$model = config('auth.providers.' . $provider . '.model')) {
            throw new RuntimeException('Unable to determine authentication model from configuration.');
        }

        /** @var Authenticatable $user */
        if (!$user = (new $model)->where('account', $account)->first()) {
            return null;
        }

        if (!$this->hasher->check($password, $user->getAuthPassword())) {
            return null;
        }

        return $user;
    }
}
