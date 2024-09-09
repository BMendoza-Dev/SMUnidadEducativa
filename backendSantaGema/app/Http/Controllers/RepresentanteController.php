<?php

namespace App\Http\Controllers;

use App\Models\Representante;
use App\Models\Usuario;
use Illuminate\Http\Request;

class RepresentanteController extends Controller
{
    public function getUsuarioMatricula($cedula){
        $usuario = Usuario::where('cedula', $cedula)->first();
        if (!$usuario) {
            return response()->json(['message' => 'Usuario no registrado','code' => '404']);
        }

        return response()->json(['message' => $usuario,'code' => '200']);
    }

    public function getRepresentante($id){
        $representante = Representante::where('usuario_id', $id)->first();
        if (!$representante) {
            return response()->json(['message' => 'Usuario no registrado','code' => '404']);
        }

        return response()->json(['message' => $representante,'code' => '200']);
    }

    public function updateRepresentante(Request $request) {
        if($request->id){
            $representante = Representante::find($request->id);
            if (!$representante) {
                return response()->json(['message' => 'Representante no encontrado','code' => '404']);
            }

            $representante->parentesco = $request->parentesco;
            $representante->correo = $request->correo;
            $representante->telefono = $request->telefono;
            $representante->direccion = $request->direccion;
            $representante->save(); 

            return response()->json(['message' => 'Representante actualizado correctamente','code' => '200']);
        }
    }

    //Function create Representante
    public function createRepresentante(Request $request) {

        $representante = Representante::create([
            'parentesco' =>$request->parentesco,
            'correo' =>$request->correo,
            'telefono'=> $request->telefono,
            'direccion'=> $request->direccion,
            'usuario_id' => $request->usuario_id
        ]);

        $id = $representante->id;

        return response()->json(['message' => 'Representante creado correctamente','code' => '200','id' => $id]);
    }
}
