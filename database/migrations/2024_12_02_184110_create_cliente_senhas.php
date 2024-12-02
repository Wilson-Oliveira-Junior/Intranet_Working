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
        Schema::create('cliente_senhas', function (Blueprint $table) {
            $table->id('idRegistroSenha')->unsigned(); // ID principal unsigned
            $table->string('strURL', 128)->nullable(); // URL opcional
            $table->string('strLogin', 128); // Login obrigatório
            $table->string('strSenha', 64); // Senha obrigatória
            $table->text('observacao')->nullable(); // Observação opcional
            $table->boolean('admin')->default(0); // Flag de administrador, padrão 0
            $table->unsignedBigInteger('idTipoRegistro')->default(0); // Tipo de registro, padrão 0
            $table->unsignedBigInteger('idDominio')->default(0); // Domínio, padrão 0
            $table->unsignedBigInteger('idCliente'); // Relacionamento com cliente
            $table->string('urlPendente', 128)->nullable(); // URL pendente opcional
            $table->string('loginPendente', 128)->nullable(); // Login pendente opcional
            $table->string('senhaPendente', 64)->nullable(); // Senha pendente opcional
            $table->boolean('pendente')->default(0); // Flag pendente, padrão 0
            $table->integer('idsolicitadopor')->nullable(); // ID de quem solicitou, opcional
            $table->timestamps(); // Campos created_at e updated_at

            // Chave estrangeira
            $table->foreign('idCliente')->references('id')->on('clientes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cliente_senhas');
    }
};
