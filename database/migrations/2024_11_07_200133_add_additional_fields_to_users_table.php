<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAdditionalFieldsToUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('middlename')->nullable();  // Novo campo para nome do meio
            $table->string('lastname')->nullable();    // Novo campo para sobrenome
            $table->string('address')->nullable();     // Novo campo para endereço
            $table->string('social_media')->nullable(); // Novo campo para redes sociais
            $table->string('curiosity')->nullable();    // Novo campo para curiosidade
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
            $table->dropColumn(['middlename', 'lastname', 'address', 'social_media', 'curiosity']);
        });
    }
}
