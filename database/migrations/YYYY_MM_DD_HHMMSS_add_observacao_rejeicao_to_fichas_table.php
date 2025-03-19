<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddObservacaoRejeicaoToFichasTable extends Migration
{
    public function up()
    {
        Schema::table('fichas', function (Blueprint $table) {
            $table->text('observacao_rejeicao')->nullable()->after('client_id'); // Observação do administrador em caso de rejeição
        });
    }

    public function down()
    {
        Schema::table('fichas', function (Blueprint $table) {
            $table->dropColumn('observacao_rejeicao');
        });
    }
}
