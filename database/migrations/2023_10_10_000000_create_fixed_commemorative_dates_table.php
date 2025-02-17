<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFixedCommemorativeDatesTable extends Migration
{
    public function up()
    {
        Schema::create('fixed_commemorative_dates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->date('date');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('fixed_commemorative_dates');
    }
}
