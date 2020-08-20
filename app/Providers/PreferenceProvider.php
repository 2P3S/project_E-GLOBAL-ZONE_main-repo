<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Library\Services\Preference;

class PreferenceProvider extends ServiceProvider
{
    /**
     * 서비스 컨테이너에 바인딩. 라라벨은 App\config\app.php - providers에 있는
     * 서비스 프로바이더들을 돌면서 register 메서드를 호출함
     * 이 곳에서는 서비스 컨테이너에 바인딩하는 코드만 작성해야한다.
     */
    public function register()
    {
        // register Method
        $this->app->bind('App\Library\Services\Preference', function ($app) {
            return new Preference();
        });
    }
    /**
     * register이 끝난 이후, 라라벨은 다시한번 pp\config\app.php - providers에 있는
     * 서비스 프로바이더들을 돌면서 boot 메서드를 호출함.
     *
     * @return void
     */
    public function boot()
    {
        // boot Method
        // 다른 모든 서비스 프로바이더들이 등록된 후 호출됨
        // 즉, Bootstrap 이 완료 된 뒤에 호출, 다른 서비스 프로바이더 사용 가능
        // 생성자에 Type-Hinting 으로 의존성 주입도 가능하다.
    }
}
