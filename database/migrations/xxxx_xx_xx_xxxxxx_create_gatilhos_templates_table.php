
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGatilhosTemplatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tb_gatilhos_templates', function (Blueprint $table) {
            $table->id();
            $table->string('gatilho');
            $table->unsignedBigInteger('id_tipo_projeto');
            $table->string('tipo_gatilho');
            $table->integer('dias_limite_padrao');
            $table->integer('dias_limite_50')->nullable();
            $table->integer('dias_limite_40')->nullable();
            $table->integer('dias_limite_30')->nullable();
            $table->unsignedBigInteger('id_referente')->nullable();
            $table->unsignedBigInteger('id_grupo_gatilho')->nullable();
            $table->timestamps();

            $table->foreign('id_tipo_projeto')->references('id')->on('tb_tipo_projetos')->onDelete('cascade');
            $table->foreign('id_referente')->references('id')->on('tb_gatilhos_templates')->onDelete('set null');
            $table->foreign('id_grupo_gatilho')->references('id')->on('tb_gatilhos_grupos')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tb_gatilhos_templates');
    }
}
