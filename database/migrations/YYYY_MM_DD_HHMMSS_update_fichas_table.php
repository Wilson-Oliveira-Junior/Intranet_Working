<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateFichasTable extends Migration
{
    public function up()
    {
        Schema::table('fichas', function (Blueprint $table) {
            $table->string('nome_empresa')->nullable();
            $table->string('cnpj', 14)->nullable();
            $table->string('responsavel')->nullable();
            $table->string('telefone')->nullable();
            $table->string('email')->nullable();
            $table->string('status')->default('pendente'); // pendente, aprovado, rejeitado
            $table->string('cep')->nullable();
            $table->string('rua')->nullable();
            $table->string('numero')->nullable();
            $table->string('bairro')->nullable();
            $table->string('cidade')->nullable();
            $table->string('estado')->nullable();
            $table->decimal('limite_credito', 15, 2)->nullable();
            $table->string('tipo_pagamento')->nullable(); // boleto, cartão, pix, etc.
            $table->integer('prazo_pagamento')->nullable(); // Dias para pagamento
            $table->text('observacoes')->nullable();
            $table->unsignedBigInteger('user_id')->nullable(); // Quem cadastrou a ficha
            $table->unsignedBigInteger('aprovado_por')->nullable(); // Usuário que aprovou a ficha
            $table->timestamp('data_aprovacao')->nullable();
            $table->unsignedBigInteger('client_id')->nullable(); // Relacionamento com a tabela clients

            // Foreign keys
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('aprovado_por')->references('id')->on('users')->onDelete('set null');
            $table->foreign('client_id')->references('id')->on('clients')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::table('fichas', function (Blueprint $table) {
            $table->dropColumn([
                'nome_empresa',
                'cnpj',
                'responsavel',
                'telefone',
                'email',
                'status',
                'cep',
                'rua',
                'numero',
                'bairro',
                'cidade',
                'estado',
                'limite_credito',
                'tipo_pagamento',
                'prazo_pagamento',
                'observacoes',
                'user_id',
                'aprovado_por',
                'data_aprovacao',
                'client_id',
            ]);

            // Drop foreign keys
            $table->dropForeign(['user_id']);
            $table->dropForeign(['aprovado_por']);
            $table->dropForeign(['client_id']);
        });
    }
}
