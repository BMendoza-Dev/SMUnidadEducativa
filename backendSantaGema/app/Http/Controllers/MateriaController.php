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
                Rule::unique('materias')->where(function ($query) use ($request) {
                    return $query->whereRaw('LOWER(nombre) = ?', [strtolower($request->nombre)]);
                }),
            ],
            'tipo_nota' => ['required', Rule::in(['cuantitativa', 'cualitativa'])],
            'incluye_promedio' => ['required', 'boolean'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors(), 'code' => '422']);
        }

        $materia = Materia::create([
            'nombre' => $request->nombre,
            'tipo_nota' => $request->tipo_nota,
            'incluye_promedio' => $request->incluye_promedio,
        ]);

        return response()->json(['message' => 'registro correcto', 'id' => $materia->id, 'code' => '200']);
    }

    public function getListMateria()
    {

        $materias = Materia::orderBy('id', 'desc')->get();

        return response()->json(['message' => $materias, 'code' => '200']);
    }

    public function updateMateria(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => [
                'required',
                'max:255',
                Rule::unique('materias')->ignore($id)->where(function ($query) use ($request) {
                    return $query->whereRaw('LOWER(nombre) = ?', [strtolower($request->nombre)]);
                }),
            ],
            'tipo_nota' => ['required', Rule::in(['cuantitativa', 'cualitativa'])],
            'incluye_promedio' => ['required'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors(), 'code' => '422']);
        }

        $materia = Materia::find($id);

        if (!$materia) {
            return response()->json(['message' => 'Materia no encontrada', 'code' => '404']);
        }

        $materia->nombre = $request->nombre;
        $materia->tipo_nota = $request->tipo_nota;
        $materia->incluye_promedio = $request->incluye_promedio;
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
