
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class UpdateUsersSectorId extends Migration
{
    public function up()
    {
        DB::table('users')->get()->each(function ($user) {
            $sector = DB::table('sectors')->where('name', $user->sector)->first();
            if ($sector) {
                DB::table('users')->where('id', $user->id)->update(['sector_id' => $sector->id]);
            }
        });
    }

    public function down()
    {
        DB::table('users')->update(['sector_id' => null]);
    }
}
