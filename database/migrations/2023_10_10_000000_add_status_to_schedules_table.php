<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddStatusToSchedulesTable extends Migration // Ensure the class name matches the filename
{
    public function up()
    {
        Schema::table('schedules', function (Blueprint $table) {
            $table->string('status')->default('aberto');
        });
    }

    public function down()
    {
        Schema::table('schedules', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
}
