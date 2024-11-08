<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnsToUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            // Adicionando as novas colunas
            $table->string('cellphone')->nullable()->after('email');      // Celular
            $table->string('ramal')->nullable()->after('cellphone');     // Ramal
            $table->string('cep')->nullable()->after('ramal');           // CEP
            $table->string('profilepicture')->nullable()->after('cep');  // Imagem de perfil
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
            // Removendo as colunas, caso a migration seja revertida
            $table->dropColumn('cellphone');
            $table->dropColumn('ramal');
            $table->dropColumn('cep');
            $table->dropColumn('profilepicture');
        });
    }
}
