<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    use HasFactory;
    protected $fillable = [
        'cedula', 
        'nombres', 
        'apellidos', 
        'nacionalidad', 
        'genero', 
        'fecha_nacimiento'
    ];

    public function representantes()
    {
        return $this->hasMany(Representante::class, 'representante');
    }

    public function estudiantes()
    {
        return $this->hasMany(Estudiante::class, 'estudiante');
    }
}
