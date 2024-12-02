<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cliente_contato', function (Blueprint $table) {
            $table->id()->unsigned(); // ID principal unsigned e auto_increment
            $table->unsignedBigInteger('id_cliente'); // Relacionamento com cliente, unsigned
            $table->string('nome_contato', 255); // Nome do contato
            $table->string('telefone', 255)->nullable(); // Telefone, opcional
            $table->string('celular', 255)->nullable(); // Celular, opcional
            $table->string('email', 255)->nullable(); // Email, opcional
            $table->enum('tipo_contato', [
                'Responsável do Projeto',
                'Responsável Financeiro',
                'Outro',
                'Responsável Projeto/Financeiro'
            ])->default('Outro'); // Tipo de contato com valores limitados
            $table->string('ramal', 12)->nullable(); // Ramal, opcional
            $table->timestamps(); // Campos created_at e updated_at

            // Adicionando a chave estrangeira
            $table->foreign('id_cliente')->references('id')->on('clientes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cliente_contato');
    }
};
