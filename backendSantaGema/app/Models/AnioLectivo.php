<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnioLectivo extends Model
{
    use HasFactory;
    protected $fillable = ['nombre', 'anioInicio', 'anioFin'];

    public function cursosMaterias()
    {
        return $this->belongsToMany(Curso::class, 'anio_curso_materias')
            ->withPivot('materia_id')
            ->withTimestamps();
    }
}
