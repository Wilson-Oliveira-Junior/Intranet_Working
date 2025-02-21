<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePautaCompartilhadosTable extends Migration
{
    public function up()
    {
        Schema::create('pauta_compartilhados', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('id_todolist');
            $table->unsignedInteger('id_usuario');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('pauta_compartilhados');
    }
}
