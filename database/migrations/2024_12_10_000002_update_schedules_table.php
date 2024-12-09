<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateSchedulesTable extends Migration
{
    public function up()
    {
        Schema::table('schedules', function (Blueprint $table) {
            $table->string('title')->after('id');
            $table->text('description')->nullable()->after('title');
            $table->date('date')->after('description');
            $table->foreignId('user_id')->nullable()->constrained('users')->after('sector_id');
            $table->foreignId('client_id')->constrained('clients')->after('user_id');
            $table->integer('hours_worked')->default(0)->after('client_id');
            $table->string('priority')->after('hours_worked');
        });
    }

    public function down()
    {
        Schema::table('schedules', function (Blueprint $table) {
            $table->dropColumn('title');
            $table->dropColumn('description');
            $table->dropColumn('date');
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
            $table->dropForeign(['client_id']);
            $table->dropColumn('client_id');
            $table->dropColumn('hours_worked');
            $table->dropColumn('priority');
        });
    }
}
