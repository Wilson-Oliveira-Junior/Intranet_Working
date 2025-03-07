<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateTbGatilhosTemplatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tb_gatilhos_templates', function (Blueprint $table) {
            $table->integer('id_tipo_projeto')->nullable()->change();
            $table->integer('dias_limite_50')->nullable()->change();
            $table->integer('dias_limite_40')->nullable()->change();
            $table->integer('dias_limite_30')->nullable()->change();
            $table->integer('id_referente')->nullable()->change();
            $table->integer('id_grupo_gatilho')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tb_gatilhos_templates', function (Blueprint $table) {
            $table->integer('id_tipo_projeto')->nullable(false)->change();
            $table->integer('dias_limite_50')->nullable(false)->change();
            $table->integer('dias_limite_40')->nullable(false)->change();
            $table->integer('dias_limite_30')->nullable(false)->change();
            $table->integer('id_referente')->nullable(false)->change();
            $table->integer('id_grupo_gatilho')->nullable(false)->change();
        });
    }
}
