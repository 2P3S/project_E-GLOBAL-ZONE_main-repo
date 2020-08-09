<?php

namespace App\Model;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Hashing\HashManager;
use RuntimeException;

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
     * @param string $column
     * @return Authenticatable|null
     */
    public function attempt(
        string $account,
        string $password,
        string $provider,
        string $column
    ): ?Authenticatable
    {
        if (!$model = config('auth.providers.' . $provider . '.model')) {
            throw new RuntimeException('Unable to determine authentication model from configuration.');
        }

        if ($provider !== 'admins' && $provider !== 'foreigners') {
            return null;
        }

        /** @var Authenticatable $user */
        if (!$user = (new $model)->where($column, $account)->first()) {
            return null;
        }

        if (!$this->hasher->check($password, $user->getAuthPassword())) {
            return null;
        }

        return $user;
    }
}
