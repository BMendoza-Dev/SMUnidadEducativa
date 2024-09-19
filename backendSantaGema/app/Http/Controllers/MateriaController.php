<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Curso;
use App\Models\Materia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class MateriaController extends Controller
{
    public function Register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => [
                'required',
                'max:255',
                // Validar que el campo sea único, insensible a mayúsculas/minúsculas
                Rule::unique('materias')->where(function ($query) use ($request) {
                    return $query->whereRaw('LOWER(nombre) = ?', [strtolower($request->nombre)]);
                }),
            ],
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors(), 'code' => '422']);
        }
        $materia = Materia::create([
            'nombre' => $request->nombre
        ]);
        // Obtener el ID del registro creado
        $id = $materia->id;
        return response()->json(['message' => 'registro correcto', 'id' => $id, 'code' => '200']);
    }

    public function getListMateria()
    {

        $materias = Materia::all();

        return response()->json(['message' => $materias, 'code' => '200']);
    }

    public function updateMateria(Request $request, $id)
    {
        // Validar los datos recibidos
        $validator = Validator::make($request->all(), [
            'nombre' => [
                'required',
                'max:255',
                Rule::unique('materias')->ignore($id)->where(function ($query) use ($request) {
                    return $query->whereRaw('LOWER(nombre) = ?', [strtolower($request->nombre)]);
                }),
            ],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors(), 'code' => '422']);
        }

        // Buscar la materia por ID
        $materia = Materia::find($id);

        // Verificar si la materia existe
        if (!$materia) {
            return response()->json(['message' => 'Materia no encontrada', 'code' => '404']);
        }

        // Actualizar los datos de la materia
        $materia->nombre = $request->nombre;
        $materia->save();

        return response()->json(['message' => 'Registro actualizado correctamente', 'id' => $materia->id, 'code' => '200']);
    }

    public function deleteMateria(Request $request)
    {
        $ids = $request->input('ids');
        Materia::whereIn('id', $ids)->delete();

        return response()->json(['message' => 'Registro eliminado correctamente', 'code' => '200']);
    }
}
