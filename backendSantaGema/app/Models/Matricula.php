<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Matricula extends Model
{
    use HasFactory;
    protected $fillable = [
        'matriculaNum',
        'estudiante_id',
        'representante_id',
        'anio_lectivo_id',
        'curso_id',
    ];

    // Relaciones con otros modelos
    public function estudiante()
    {
        return $this->belongsTo(Estudiante::class, 'estudiante_id'); 
    }

    public function representante()
    {
        return $this->belongsTo(Representante::class, 'representante_id');
    }

    public function anioLectivo()
    {
        return $this->belongsTo(AnioLectivo::class, 'anio_lectivo_id');
    }

    public function curso()
    {
        return $this->belongsTo(Curso::class, 'curso_id');
    }
}

