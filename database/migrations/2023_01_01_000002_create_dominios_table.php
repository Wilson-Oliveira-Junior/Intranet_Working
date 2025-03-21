<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDominiosTable extends Migration
{
    public function up()
    {
        Schema::create('dominios', function (Blueprint $table) {
            $table->id('id_dominio'); // Chave primária
            $table->unsignedBigInteger('id_cliente'); // Relacionamento com a tabela de clientes
            $table->string('dominio', 128)->unique(); // Domínio único
            $table->enum('tipo_hospedagem', ['Redirecionamento', 'Hospedagem Interna', 'Hospedagem Externa'])->default('Hospedagem Interna');
            $table->enum('dominio_principal', ['Sim', 'Não'])->default('Sim');
            $table->enum('status', ['Ativo', 'Inativo'])->default('Ativo');
            $table->boolean('ssl')->default(false); // Indica se o SSL está habilitado
            $table->boolean('cdn')->default(false); // Indica se o CDN está habilitado
            $table->timestamps();

            // Índice e chave estrangeira
            $table->foreign('id_cliente')->references('id')->on('clientes')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('dominios');
    }
}
