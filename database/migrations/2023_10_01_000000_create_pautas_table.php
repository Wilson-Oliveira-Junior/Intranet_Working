<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePautasTable extends Migration
{
    public function up()
    {
        Schema::create('pautas', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('idUrgencia');
            $table->string('titulo', 128);
            $table->boolean('status')->default(0);
            $table->unsignedInteger('idprojeto');
            $table->unsignedInteger('idcriadopor');
            $table->unsignedInteger('idresponsavel');
            $table->date('data_desejada')->nullable();
            $table->dateTime('data_finalizado')->nullable();
            $table->unsignedInteger('idfinalizadopor')->nullable();
            $table->text('comentario')->nullable();
            $table->boolean('incluir_historico')->default(0);
            $table->boolean('excluido')->default(0);
            $table->unsignedInteger('idexcluidopor')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('pautas');
    }
}
