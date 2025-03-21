<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFtpTable extends Migration
{
    public function up()
    {
        Schema::create('ftp', function (Blueprint $table) {
            $table->id('idClienteDominioFTP'); // Chave primária
            $table->unsignedBigInteger('id_dominio'); // Relacionamento com a tabela de domínios
            $table->string('servidor', 128);
            $table->string('protocolo', 8)->default('FTP');
            $table->string('usuario', 128);
            $table->string('senha', 128);
            $table->text('observacao')->nullable();
            $table->timestamps();

            // Índice e chave estrangeira
            $table->foreign('id_dominio')->references('id')->on('dominios')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('ftp');
    }
}
