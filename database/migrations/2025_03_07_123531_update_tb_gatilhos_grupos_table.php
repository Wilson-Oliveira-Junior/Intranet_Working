<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateTbGatilhosGruposTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tb_gatilhos_grupos', function (Blueprint $table) {
            $table->string('descricao')->nullable()->change();
            $table->string('email_adicionais')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tb_gatilhos_grupos', function (Blueprint $table) {
            $table->string('descricao')->nullable(false)->change();
            $table->string('email_adicionais')->nullable(false)->change();
        });
    }
}
