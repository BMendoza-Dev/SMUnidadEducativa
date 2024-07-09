<?php

namespace App\Http\Controllers;

use App\Models\AnioLectivo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AnioLectivoController extends Controller
{


    public function Register(Request $request){
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
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

        return response()->json(['menssage'=>'registro correcto','code'=>'200']);
    }


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\AnioLectivo  $anioLectivo
     * @return \Illuminate\Http\Response
     */
    public function show(AnioLectivo $anioLectivo)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\AnioLectivo  $anioLectivo
     * @return \Illuminate\Http\Response
     */
    public function edit(AnioLectivo $anioLectivo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\AnioLectivo  $anioLectivo
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, AnioLectivo $anioLectivo)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\AnioLectivo  $anioLectivo
     * @return \Illuminate\Http\Response
     */
    public function destroy(AnioLectivo $anioLectivo)
    {
        //
    }

    
}
