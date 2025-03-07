<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateTbGatilhosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tb_gatilhos', function (Blueprint $table) {
            $table->unsignedBigInteger('client_id')->nullable()->after('id');
            $table->foreign('client_id')->references('id')->on('clients')->onDelete('cascade');
            $table->integer('id_projeto')->unsigned()->after('id');
            $table->date('data_inicio')->nullable()->after('id_projeto');
            $table->date('data_fim')->nullable()->after('data_inicio');
            $table->enum('status', ['E', 'F', 'P'])->after('data_fim');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tb_gatilhos', function (Blueprint $table) {
            $table->dropForeign(['client_id']);
            $table->dropColumn('client_id');
            $table->dropColumn('id_projeto');
            $table->dropColumn('data_inicio');
            $table->dropColumn('data_fim');
            $table->dropColumn('status');
        });
    }
}
