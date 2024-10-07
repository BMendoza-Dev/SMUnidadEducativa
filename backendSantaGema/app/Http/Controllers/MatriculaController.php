<?php

namespace App\Http\Controllers;

use App\Models\Matricula;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MatriculaController extends Controller
{
    public function createMatricula(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'matriculaNum' => 'required',
            'estudiante_id' => 'required|exists:estudiantes,id',
            'representante_id' => 'required|exists:representantes,id',
            'anio_lectivo_id' => 'required|exists:anio_lectivos,id',
            'curso_id' => 'required|exists:cursos,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'No existe datos relacionados', 'code' => '401']);
        }

        $exists = Matricula::where('estudiante_id', $request->estudiante_id)
            ->where('representante_id', $request->representante_id)
            ->where('anio_lectivo_id', $request->anio_lectivo_id)
            ->where('curso_id', $request->curso_id)
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Ya existe una matrícula con estos datos', 'code' => '401',
            ]);
        }

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
            return response()->json(['message' => 'Representante no encontrado', 'code' => '404']);
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


    public function getMatriculasByAnioAndCursoParaMaterias(Request $request)
    {
        $anio_lectivo_id = $request->input('anio_lectivo_id');
        $curso_id = $request->input('curso_id');

        if ($anio_lectivo_id == 0 && $curso_id == 0) {
            $matriculas = Matricula::with([
                'estudiante.usuario'
            ])->get();
        } else if ($anio_lectivo_id != 0 && $curso_id == 0) {
            $matriculas = Matricula::with([
                'estudiante.usuario'
            ])->where('anio_lectivo_id', $anio_lectivo_id)
                ->get();
        } else if ($anio_lectivo_id == 0 && $curso_id != 0) {
            $matriculas = Matricula::with([
                'estudiante.usuario'
            ])->where('curso_id', $curso_id)
                ->get();
        } else {
            $matriculas = Matricula::with([
                'estudiante.usuario'
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
}
