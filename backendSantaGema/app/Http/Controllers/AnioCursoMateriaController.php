<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AnioCursoMateria;
use App\Models\AnioLectivo;
use App\Models\Curso;
use App\Models\Materia;
use Illuminate\Http\Request;

class AnioCursoMateriaController extends Controller
{
    public function attachMateriasToCursoInAnioLectivo(Request $request)
    {
        $anioLectivo = AnioLectivo::find($request->anio_lectivo_id);
        $cursoId = $request->curso_id;
        $materiaIds = $request->materia_ids;

        // Validar que $materiaIds es un array
        if (!is_array($materiaIds)) {
            return response()->json(['message' => 'materia_ids debe ser un array', 'code' => '422']);
        }

        $exists = $anioLectivo->cursosMaterias()
            ->wherePivot('curso_id', $cursoId)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Ya existe un registro con este curso y año lectivo.', 'code' => '409']);
        }


        foreach ($materiaIds as $materiaId) {
            $anioLectivo->cursosMaterias()->attach($cursoId, ['materia_id' => $materiaId]);
        }

        return response()->json(['message' => 'Materias asociadas al curso correctamente', 'code' => '200']);
    }

    public function getUniqueAnioLectivos()
    {
        try {
            // Obtener los anio_lectivo_id únicos
            $anioLectivoIds = AnioCursoMateria::distinct()
                ->pluck('anio_lectivo_id');

            // Validar que existen registros de anios lectivos
            if ($anioLectivoIds->isEmpty()) {
                return response()->json(['message' => 'No se encontraron años lectivos', 'code' => 404]);
            }

            // Obtener los datos completos de los años lectivos relacionados
            $anioLectivos = AnioLectivo::whereIn('id', $anioLectivoIds)->get();

            // Validar que existen datos en AnioLectivo
            if ($anioLectivos->isEmpty()) {
                return response()->json(['message' => 'No se encontraron datos de años lectivos', 'code' => 404]);
            }

            return response()->json(['message' => $anioLectivos, 'code' => 200]);
        } catch (\Exception $e) {
            // Manejo de excepciones si ocurre algún error
            return response()->json(['message' => 'Ocurrió un error en la consulta: ' . $e->getMessage(), 'code' => 500], 500);
        }
    }

    public function getCursosPorAnioLectivo($anioLectivoId)
    {
        try {
            // Obtener los curso_id relacionados con el anio_lectivo_id proporcionado
            $cursos = AnioCursoMateria::where('anio_lectivo_id', $anioLectivoId)
                ->distinct()
                ->pluck('curso_id');

            // Validar que existan cursos relacionados
            if ($cursos->isEmpty()) {
                return response()->json(['message' => 'No se encontraron cursos para el año lectivo especificado', 'code' => 404]);
            }

            // Obtener los datos completos de los cursos
            $cursosDetalles = Curso::whereIn('id', $cursos)->get();

            // Validar que existan datos completos de cursos
            if ($cursosDetalles->isEmpty()) {
                return response()->json(['message' => 'No se encontraron datos de los cursos', 'code' => 404]);
            }

            return response()->json(['message' => $cursosDetalles, 'code' => 200]);
        } catch (\Exception $e) {
            // Manejo de excepciones
            return response()->json(['message' => 'Ocurrió un error: ' . $e->getMessage(), 'code' => 500]);
        }
    }

    public function getMateriasPorCursoYAnioLectivo($anioLectivoId, $cursoId)
    {
        try {
            // Obtener los materia_id relacionados con el curso_id y anio_lectivo_id proporcionados
            $materias = AnioCursoMateria::where('curso_id', $cursoId)
                ->where('anio_lectivo_id', $anioLectivoId)
                ->distinct()
                ->pluck('materia_id');

            // Validar que existan materias relacionadas para el curso y el año lectivo
            if ($materias->isEmpty()) {
                return response()->json(['message' => 'No se encontraron materias para el curso y año lectivo especificados', 'code' => 404]);
            }

            // Obtener los datos completos de las materias
            $materiasDetalles = Materia::whereIn('id', $materias)->get();

            // Validar que existan datos completos de las materias
            if ($materiasDetalles->isEmpty()) {
                return response()->json(['message' => 'No se encontraron datos de las materias', 'code' => 404]);
            }

            return response()->json(['message' => $materiasDetalles, 'code' => 200]);
        } catch (\Exception $e) {
            // Manejo de excepciones
            return response()->json(['message' => 'Ocurrió un error: ' . $e->getMessage(), 'code' => 500]);
        }
    }

    public function updateMateriasForCursoInAnioLectivo(Request $request)
    {
        $anioLectivo = AnioLectivo::find($request->anio_lectivo_id);
        $cursoId = $request->curso_id;
        $materiaIds = $request->materia_ids;

        // Validar que $materiaIds es un array
        if (!is_array($materiaIds)) {
            return response()->json(['message' => 'materia_ids debe ser un array', 'code' => 422]);
        }

        // Verificar si el curso ya está asociado con el año lectivo
        if (!$anioLectivo) {
            return response()->json(['message' => 'Año lectivo no encontrado', 'code' => 404]);
        }

        // Eliminar relaciones previas del curso con las materias en el año lectivo
        $anioLectivo->cursosMaterias()->wherePivot('curso_id', $cursoId)->detach();

        // Volver a agregar las nuevas materias
        foreach ($materiaIds as $materiaId) {
            $anioLectivo->cursosMaterias()->attach($cursoId, ['materia_id' => $materiaId]);
        }

        return response()->json(['message' => 'Materias actualizadas correctamente para el curso y año lectivo', 'code' => 200]);
    }
}
