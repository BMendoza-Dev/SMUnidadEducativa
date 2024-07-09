<?php

namespace App\Http\Controllers;

use App\Models\AnioLectivo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AnioLectivoController extends Controller
{
    public function Register(Request $request){
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|max:255',
            'anioInicio' => 'required|date',
            'anioFin' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors(), 'code'=>'422']);
        }

        $fechaInicioConvertida = date('Y-m-d', strtotime($request->anioInicio));
        $fechaFinConvertida = date('Y-m-d', strtotime($request->anioFin));
        $anioLectivo = AnioLectivo::create([
            'nombre' =>$request->nombre,
            'anioInicio' =>$fechaInicioConvertida,
            'anioFin'=> $fechaFinConvertida
        ]);

        // Obtener el ID del registro creado
        $id = $anioLectivo->id;

        return response()->json(['menssage'=>'registro correcto','id' => $id,'code'=>'200']);
    }

    public function getListALectivo(){
        $anioLectivo = AnioLectivo::select('id','nombre','anioInicio','anioFin')->get();
        return response()->json(['menssage'=> $anioLectivo,'code'=>'200']);
    }

    public function updateALectivo(Request $request){
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|max:255',
            'anioInicio' => 'required|date',
            'anioFin' => 'required|date',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors(), 'code'=>'422']);
        }
    
        $fechaInicioConvertida = date('Y-m-d', strtotime($request->anioInicio));
        $fechaFinConvertida = date('Y-m-d', strtotime($request->anioFin));
    
        $anioLectivo = AnioLectivo::find($request->id);
        if (!$anioLectivo) {
            return response()->json(['error' => 'Año Lectivo no encontrado', 'code'=>'404']);
        }
    
        $anioLectivo->nombre = $request->nombre;
        $anioLectivo->anioInicio = $fechaInicioConvertida;
        $anioLectivo->anioFin = $fechaFinConvertida;
        $anioLectivo->save();
    
        return response()->json(['message'=>'Registro actualizado correctamente', 'code'=>'200']);
    }

    public function deleteALectivo($id){
        $anioLectivo = AnioLectivo::find($id);
        if (!$anioLectivo) {
            return response()->json(['error' => 'Año Lectivo no encontrado', 'code'=>'404']);
        }

        $anioLectivo->delete();

        return response()->json(['message'=>'Registro eliminado correctamente', 'code'=>'200']);
    }
}
