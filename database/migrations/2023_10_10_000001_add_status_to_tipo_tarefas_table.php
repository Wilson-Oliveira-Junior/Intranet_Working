<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddStatusToTipoTarefasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tb_tipostarefas', function (Blueprint $table) {
            $table->enum('status', ['Ativo', 'Inativo'])->default('Ativo')->after('descricao');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tb_tipostarefas', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
}
