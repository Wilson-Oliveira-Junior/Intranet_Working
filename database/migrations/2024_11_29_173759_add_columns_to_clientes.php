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
        Schema::table('clientes', function (Blueprint $table) {
            $table->string('dominio', 70)->nullable();
            $table->string('razao_social', 255)->nullable();
            $table->string('nome_fantasia', 128)->nullable();
            $table->string('CNPJ', 70)->nullable();
            $table->string('dia_boleto', 70)->nullable();
            $table->string('perfil_cliente', 70)->nullable();
            $table->string('inscricao_estadual', 60)->nullable();
            $table->string('cep', 20)->nullable();
            $table->string('endereco', 128)->nullable();
            $table->string('bairro', 64)->nullable();
            $table->string('cidade', 64)->nullable();
            $table->string('estado', 20)->nullable();
            $table->string('numero', 20)->nullable();
            $table->string('id_segmento', 20)->nullable();
            $table->string('idCustomerAsaas', 164)->nullable();
            $table->integer('status_financeiro')->default(0);
            $table->tinyInteger('status')->default(1);
            $table->string('complemento', 255)->nullable();
            $table->string('idContaAzul', 64)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clientes', function (Blueprint $table) {
            $table->string('dominio', 70)->nullable();
            $table->string('razao_social', 255)->nullable();
            $table->string('nome_fantasia', 128)->nullable();
            $table->string('CNPJ', 70)->nullable();
            $table->string('dia_boleto', 70)->nullable();
            $table->string('perfil_cliente', 70)->nullable();
            $table->string('inscricao_estadual', 60)->nullable();
            $table->string('cep', 20)->nullable();
            $table->string('endereco', 128)->nullable();
            $table->string('bairro', 64)->nullable();
            $table->string('cidade', 64)->nullable();
            $table->string('estado', 20)->nullable();
            $table->string('numero', 20)->nullable();
            $table->string('id_segmento', 20)->nullable();
            $table->string('idCustomerAsaas', 164)->nullable();
            $table->integer('status_financeiro')->default(0);
            $table->tinyInteger('status')->default(1);
            $table->string('complemento', 255)->nullable();
            $table->string('idContaAzul', 64)->nullable();
        });
    }
};
