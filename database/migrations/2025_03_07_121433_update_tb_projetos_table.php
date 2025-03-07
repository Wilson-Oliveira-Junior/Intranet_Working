<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateTbProjetosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tb_projetos', function (Blueprint $table) {
            $table->integer('id_tipo_projeto')->nullable()->after('status');
            $table->integer('id_dominio')->unsigned()->nullable()->after('id_tipo_projeto');
            $table->integer('prazo')->nullable()->after('id_dominio');
            $table->date('data_referencia')->nullable()->after('prazo');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tb_projetos', function (Blueprint $table) {
            $table->dropColumn('id_tipo_projeto');
            $table->dropColumn('id_dominio');
            $table->dropColumn('prazo');
            $table->dropColumn('data_referencia');
        });
    }
}
