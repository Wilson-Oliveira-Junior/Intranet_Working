<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateTbGatilhosTemplatesTable extends Migration
{
    public function up()
    {
        Schema::table('tb_gatilhos_templates', function (Blueprint $table) {
            // Adicione as alterações necessárias na tabela aqui
        });
    }

    public function down()
    {
        Schema::table('tb_gatilhos_templates', function (Blueprint $table) {
            // Revert as alterações feitas no método up
        });
    }
}
