<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateTbGatilhosProjetosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tb_gatilhos_projetos', function (Blueprint $table) {
            if (!Schema::hasColumn('tb_gatilhos_projetos', 'id_projeto')) {
                $table->integer('id_projeto')->unsigned()->after('id');
            }
            if (!Schema::hasColumn('tb_gatilhos_projetos', 'data_inicio')) {
                $table->date('data_inicio')->nullable()->after('id_projeto');
            }
            if (!Schema::hasColumn('tb_gatilhos_projetos', 'data_fim')) {
                $table->date('data_fim')->nullable()->after('data_inicio');
            }
            if (!Schema::hasColumn('tb_gatilhos_projetos', 'status')) {
                $table->enum('status', ['E', 'F', 'P'])->after('data_fim');
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
        Schema::table('tb_gatilhos_projetos', function (Blueprint $table) {
            if (Schema::hasColumn('tb_gatilhos_projetos', 'id_projeto')) {
                $table->dropColumn('id_projeto');
            }
            if (Schema::hasColumn('tb_gatilhos_projetos', 'data_inicio')) {
                $table->dropColumn('data_inicio');
            }
            if (Schema::hasColumn('tb_gatilhos_projetos', 'data_fim')) {
                $table->dropColumn('data_fim');
            }
            if (Schema::hasColumn('tb_gatilhos_projetos', 'status')) {
                $table->dropColumn('status');
            }
        });
    }
}
