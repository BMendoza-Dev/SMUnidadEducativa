<?php

namespace App\Http\Controllers;

use App\Models\Curso;
use App\Models\AnioLectivo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CursoController extends Controller
{
    public function Register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors(), 'code' => '422']);
        }
        $curso = Curso::create([
            'nombre' => $request->nombre
        ]);
        // Obtener el ID del registro creado
        $id = $curso->id;
        return response()->json(['message' => 'registro correcto', 'id' => $id, 'code' => '200']);
    }

    public function getListCurso()
    {
        $cursos = Curso::all();
        return response()->json(['message' => $cursos, 'code' => '200']);
    }



    public function updateCurso(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|max:255',
            'id' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors(), 'code' => '422']);
        }

        // Buscar la instancia del curso que deseas actualizar
        $curso = Curso::find($request->id);
        if (!$curso) {
            return response()->json(['errors' => 'Curso no encontrado', 'code' => '404']);
        }

        // Actualizar los datos del curso
        $curso->nombre = $request->nombre;
        $curso->save();

        return response()->json(['message' => 'Actualización correcta', 'code' => '200']);
    }

    public function deleteCurso(Request $request)
    {
        $ids = $request->input('ids');
        Curso::whereIn('id', $ids)->delete();

        return response()->json(['message' => 'Registro eliminado correctamente', 'code' => '200']);
    }
}
