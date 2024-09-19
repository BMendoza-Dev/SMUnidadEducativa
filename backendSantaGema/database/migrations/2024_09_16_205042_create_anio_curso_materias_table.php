<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAnioCursoMateriasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('anio_curso_materias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('curso_id')->nullable()->constrained('cursos')->onDelete('set null');
            $table->foreignId('materia_id')->nullable()->constrained('materias')->onDelete('set null');
            $table->foreignId('anio_lectivo_id')->nullable()->constrained('anio_lectivos')->onDelete('set null');
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
        Schema::dropIfExists('anio_curso_materias');
    }
}
