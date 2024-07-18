<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnioLectivo extends Model
{
    use HasFactory;
    protected $fillable = ['nombre', 'anioInicio','anioFin'];

    public function cursos()
    {
        return $this->belongsToMany(Curso::class,'anio_lectivo__cursos');
    }
}
