<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAnioLectivoCursosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('anio_lectivo__cursos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('curso')->references('id')->on('cursos')->onDelete('cascade');
            $table->foreignId('anio_lectivo_id')->references('id')->on('anio_lectivos')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('anio_lectivo__cursos');
    }
}
