<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddUserDetailsColumnsToUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'rua')) {
                $table->string('rua', 255)->nullable();
            }
            if (!Schema::hasColumn('users', 'bairro')) {
                $table->string('bairro', 255)->nullable();
            }
            if (!Schema::hasColumn('users', 'cidade')) {
                $table->string('cidade', 255)->nullable();
            }
            if (!Schema::hasColumn('users', 'estado')) {
                $table->string('estado', 255)->nullable();
            }
            if (!Schema::hasColumn('users', 'facebook')) {
                $table->string('facebook', 255)->nullable();
            }
            if (!Schema::hasColumn('users', 'instagram')) {
                $table->string('instagram', 255)->nullable();
            }
            if (!Schema::hasColumn('users', 'linkedin')) {
                $table->string('linkedin', 255)->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'rua',
                'bairro',
                'cidade',
                'estado',
                'facebook',
                'instagram',
                'linkedin',
            ]);
        });
    }
}
