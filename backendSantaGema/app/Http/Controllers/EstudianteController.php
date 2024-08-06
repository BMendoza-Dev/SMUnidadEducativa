<?php

namespace App\Http\Controllers;

use App\Models\Estudiante;
use App\Models\Usuario;
use Illuminate\Http\Request;

class EstudianteController extends Controller
{
    public function getEstudiante($id){
        $estudiante = Estudiante::where('usuario_id', $id)->first();
        if (!$estudiante) {
            return response()->json(['message' => 'Usuario no registrado','code' => '404', $id]);
        }

        return response()->json(['message' => $estudiante,'code' => '200']);
    }

    public function updateEstudiante(Request $request) {
        if($request->id){
            $estudiante = Estudiante::find($request->id);
            if (!$estudiante) {
                return response()->json(['message' => 'Representante no encontrado','code' => '404']);
            }

            $estudiante->correo = $request->correo;
            $estudiante->telefono = $request->telefono;
            $estudiante->direccion = $request->direccion;
            $estudiante->save(); 

            return response()->json(['message' => 'Representante actualizado correctamente','code' => '200']);
        }
    }

    public function createEstudiante(Request $request) {

        $estudiante = Estudiante::create([
            'correo' =>$request->correo,
            'telefono'=> $request->telefono,
            'direccion'=> $request->direccion,
            'usuario_id' => $request->usuario_id
        ]);

        $id = $estudiante->id;

        return response()->json(['message' => 'Representante creado correctamente','code' => '200','id' => $id]);
    }
}
