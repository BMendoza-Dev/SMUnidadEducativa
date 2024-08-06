<?php

namespace App\Http\Controllers;

use App\Models\Matricula;
use Illuminate\Http\Request;

class MatriculaController extends Controller
{
    public function createMatricula(Request $request) {

        $matricula = Matricula::create([
            'matriculaNum' => $request->matriculaNum,
            'estudiante_id' => $request->estudiante_id,
            'representante_id' => $request->representante_id,
            'anio_lectivo_id' => $request->anio_lectivo_id,
            'curso_id' => $request->curso_id
        ]);

        // $id = $matricula->id;

        return response()->json(['message' => 'Representante creado correctamente','code' => '200', 'dato' => $request->all()]);
    }
}
