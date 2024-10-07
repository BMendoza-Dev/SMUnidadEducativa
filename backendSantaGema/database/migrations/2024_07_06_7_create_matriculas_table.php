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
            $table->foreignId('estudiante_id')->nullable()->constrained('estudiantes')->onDelete('set null');
            $table->foreignId('representante_id')->nullable()->constrained('representantes')->onDelete('set null');
            $table->foreignId('anio_lectivo_id')->nullable()->constrained('anio_lectivos')->onDelete('set null');
            $table->foreignId('curso_id')->nullable()->constrained('cursos')->onDelete('set null');
            $table->decimal('promedio', 4, 2)->nullable();
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
