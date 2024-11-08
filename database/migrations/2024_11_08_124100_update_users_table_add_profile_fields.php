<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            // Adiciona os campos somente se não existirem
            if (!Schema::hasColumn('users', 'sector')) {
                $table->string('sector')->nullable();
            }
            if (!Schema::hasColumn('users', 'birth_date')) {
                $table->date('birth_date')->nullable();
            }
            if (!Schema::hasColumn('users', 'middlename')) {
                $table->string('middlename')->nullable();
            }
            if (!Schema::hasColumn('users', 'lastname')) {
                $table->string('lastname')->nullable();
            }
            if (!Schema::hasColumn('users', 'address')) {
                $table->string('address')->nullable();
            }
            if (!Schema::hasColumn('users', 'social_media')) {
                $table->string('social_media')->nullable();
            }
            if (!Schema::hasColumn('users', 'curiosity')) {
                $table->text('curiosity')->nullable();
            }

            // Verifica e adiciona a chave estrangeira se necessário
            if (!Schema::hasColumn('users', 'user_type_id')) {
                $table->foreign('user_type_id')->references('id')->on('user_types')->onDelete('set null');
            }
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            // Remove os campos
            $table->dropColumn('sector');
            $table->dropColumn('birth_date');
            $table->dropColumn('middlename');
            $table->dropColumn('lastname');
            $table->dropColumn('address');
            $table->dropColumn('social_media');
            $table->dropColumn('curiosity');

            // Remove a chave estrangeira
            $table->dropForeign(['user_type_id']);
        });
    }
};
