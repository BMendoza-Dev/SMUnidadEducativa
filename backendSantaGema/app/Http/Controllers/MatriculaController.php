<?php

namespace App\Http\Controllers;

use App\Models\Matricula;
use Illuminate\Http\Request;

class MatriculaController extends Controller
{
    public function createMatricula(Request $request)
    {

        $matricula = Matricula::create([
            'matriculaNum' => $request->matriculaNum,
            'estudiante_id' => $request->estudiante_id,
            'representante_id' => $request->representante_id,
            'anio_lectivo_id' => $request->anio_lectivo_id,
            'curso_id' => $request->curso_id
        ]);

        return response()->json(['message' => 'Representante creado correctamente', 'code' => '200']);
    }

    public function updateMatricula(Request $request, $id)
    {
        // Encuentra la matrícula por su ID
        $matricula = Matricula::find($id);

        if (!$matricula) {
            return response()->json(['message' => 'Representante no encontrado','code' => '404']);
        }
        // Actualiza los campos de la matrícula
        $matricula->update([
            'matriculaNum' => $request->matriculaNum,
            'estudiante_id' => $request->estudiante_id,
            'representante_id' => $request->representante_id,
            'anio_lectivo_id' => $request->anio_lectivo_id,
            'curso_id' => $request->curso_id
        ]);

        // Retorna una respuesta JSON indicando que la actualización fue exitosa
        return response()->json(['message' => 'Matrícula actualizada correctamente', 'code' => '200']);
    }

    public function getMatriculasByAnioAndCurso(Request $request)
    {
        $anio_lectivo_id = $request->input('anio_lectivo_id');
        $curso_id = $request->input('curso_id');

        if ($anio_lectivo_id == 0 && $curso_id == 0) {
            $matriculas = Matricula::with([
                'estudiante.usuario',
                'representante.usuario',
                'aniolectivo',
                'curso'
            ])->get();
        } else if ($anio_lectivo_id != 0 && $curso_id == 0) {
            $matriculas = Matricula::with([
                'estudiante.usuario',
                'representante.usuario',
                'aniolectivo',
                'curso'
            ])->where('anio_lectivo_id', $anio_lectivo_id)
                ->get();
        } else if ($anio_lectivo_id == 0 && $curso_id != 0) {
            $matriculas = Matricula::with([
                'estudiante.usuario',
                'representante.usuario',
                'aniolectivo',
                'curso'
            ])->where('curso_id', $curso_id)
                ->get();
        } else {
            $matriculas = Matricula::with([
                'estudiante.usuario',
                'representante.usuario',
                'aniolectivo',
                'curso'
            ])
                ->where('anio_lectivo_id', $anio_lectivo_id)
                ->where('curso_id', $curso_id)
                ->get();
        }

        if ($matriculas->isEmpty()) {
            return response()->json(['message' => 'No se encontraron matrículas', 'code' => '404']);
        }

        return response()->json(['message' => $matriculas, 'code' => '200']);
    }

    public function deleteMatricula(Request $request)
    {

        $ids = $request->input('ids');
        Matricula::whereIn('id', $ids)->delete();

        return response()->json(['message' => 'Registro eliminado correctamente', 'code' => '200']);
    }
}
