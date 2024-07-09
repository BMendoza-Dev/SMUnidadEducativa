<?php

namespace App\Http\Controllers;

use App\Models\Curso;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CursoController extends Controller
{
    public function Register(Request $request){
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors(), 'code'=>'422']);
        }
        $curso = Curso::create([
            'nombre' =>$request->nombre
        ]);

        return response()->json(['menssage'=>'registro correcto','code'=>'200']);
    }

    public function getListCurso(){
        $curso = Curso::select('id','nombre')->get();
        return response()->json(['menssage'=> $curso,'code'=>'200']);
    }
}
