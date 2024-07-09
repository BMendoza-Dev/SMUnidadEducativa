<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMatriculasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('matriculas', function (Blueprint $table) {
            $table->id();
            $table->string('matriculaNum')->nullable();
            $table->foreignId('estudiante_id')->references('id')->on('estudiantes');
            $table->foreignId('representante')->references('id')->on('representantes');
            $table->foreignId('anio_lectivo_id')->references('id')->on('anio_lectivos');
            $table->foreignId('curso')->references('id')->on('cursos');
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
        Schema::dropIfExists('matriculas');
    }
}
