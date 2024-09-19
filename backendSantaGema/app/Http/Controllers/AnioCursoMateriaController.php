<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AnioLectivo;
use Illuminate\Http\Request;

class AnioCursoMateriaController extends Controller
{
    public function attachMateriasToCursoInAnioLectivo(Request $request)
    {
        // Encuentra el año lectivo
        $anioLectivo = AnioLectivo::find($request->anio_lectivo_id);

        // Encuentra el curso
        $cursoId = $request->curso_id;

        // Asegúrate de que $request->materia_ids es un array
        $materiaIds = $request->materia_ids;

        // Validar que $materiaIds es un array
        if (!is_array($materiaIds)) {
            return response()->json(['message' => 'materia_ids debe ser un array', 'code' => '422']);
        }

        // Iterar sobre las materias y adjuntarlas en la tabla pivote
        foreach ($materiaIds as $materiaId) {
            $anioLectivo->cursosMaterias()->attach($cursoId, ['materia_id' => $materiaId]);
        }

        return response()->json(['message' => 'Materias asociadas al curso correctamente', 'code' => '200']);
    }
}
