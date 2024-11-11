<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('permission_user_type', function (Blueprint $table) {
        $table->string('label')->nullable();  // Adiciona a coluna 'label'
    });
}

public function down()
{
    Schema::table('permission_user_type', function (Blueprint $table) {
        $table->dropColumn('label');  // Remove a coluna 'label'
    });
}

};
