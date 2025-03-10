<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFichasTable extends Migration
{
    public function up()
    {
        Schema::create('fichas', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            // Outros campos necessários
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('fichas');
    }
}
