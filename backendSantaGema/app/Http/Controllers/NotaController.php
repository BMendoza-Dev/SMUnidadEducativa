<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Matricula;
use App\Models\Nota;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NotaController extends Controller
{
    public function agregarNota(Request $request)
    {
        // Validación de los datos utilizando Validator
        $validator = Validator::make($request->all(), [
            'matricula_id' => 'required|exists:matriculas,id',
            'materias' => 'required|array',
            'materias.*.materia_id' => 'required|exists:materias,id',
            'materias.*.calificacion' => 'required|numeric|between:0,20.00',  // Calificación entre 0 y 20
        ]);

        // Comprobar si hay errores de validación
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Ocurrió un error de validación',
                'errors' => $validator->errors(),
                'code' => '401'
            ]); // 422 Unprocessable Entity
        }

        // Si la validación es exitosa, continuar con la lógica de almacenamiento
        $matricula_id = $request->matricula_id;
        $materias = $request->materias;

        // Eliminar notas existentes para la matrícula
        Nota::where('matricula_id', $matricula_id)->delete();

        // Guardar las nuevas notas y calcular el promedio
        $totalCalificaciones = 0;
        $totalMaterias = count($materias);

        foreach ($materias as $materia) {
            Nota::create([
                'matricula_id' => $matricula_id,
                'materia_id' => $materia['materia_id'],
                'calificacion' => $materia['calificacion'],
            ]);
            $totalCalificaciones += $materia['calificacion']; // Sumar calificaciones
        }

        // Calcular promedio
        $promedio = $totalMaterias > 0 ? $totalCalificaciones / $totalMaterias : 0;

        // Actualizar la matrícula con el promedio de notas
        // Suponiendo que tienes un campo 'promedio' en la tabla 'matriculas'
        Matricula::where('id', $matricula_id)->update(['promedio' => $promedio]);

        return response()->json(['message' => 'Notas guardadas correctamente', 'code' => '200', 'promedio' => $promedio]);
    }


    public function obtenerNotas($idMatricula)
    {
        // Obtener las notas relacionadas con la matrícula
        $notas = Nota::where('matricula_id', $idMatricula)
            ->get(['materia_id as materia_id', 'calificacion']); // Selecciona solo los campos necesarios

        return response()->json($notas);
    }
}
