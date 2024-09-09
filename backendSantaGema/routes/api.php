<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AnioLectivoController;
use App\Http\Controllers\CursoController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\RepresentanteController;
use App\Http\Controllers\EstudianteController;
use App\Http\Controllers\MatriculaController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::post('registerALectivo', [AnioLectivoController::class,'Register']);
Route::get('getListALectivo', [AnioLectivoController::class,'getListALectivo']);
Route::post('updateALectivo', [AnioLectivoController::class,'updateALectivo']);
Route::post('deleteALectivo', [AnioLectivoController::class,'deleteALectivo']);

Route::post('registerCurso', [CursoController::class,'Register']);
Route::get('getListCurso', [CursoController::class,'getListCurso']);
Route::post('updateCurso', [CursoController::class,'updateCurso']);
Route::post('deleteCurso', [CursoController::class,'deleteCurso']);

Route::get('consultarCedula/{cedula}', [UsuarioController::class,'consultarCedula']);
Route::post('registrarUsuario', [UsuarioController::class,'registrarUsuario']);
Route::get('getListUsuario', [UsuarioController::class,'getListUsuario']);
Route::post('updateUsuario', [UsuarioController::class,'updateUsuario']);
Route::post('deleteUsuario', [UsuarioController::class,'deleteUsuario']);

Route::get('getUsuarioMatricula/{cedula}', [RepresentanteController::class,'getUsuarioMatricula']);
Route::get('getRepresentante/{id}', [RepresentanteController::class,'getRepresentante']);
Route::post('updateRepresentante',[RepresentanteController::class,'updateRepresentante']);
Route::post('createRepresentante', [RepresentanteController::class,'createRepresentante']);

Route::get('getEstudiante/{id}', [EstudianteController::class,'getEstudiante']);
Route::post('updateEstudiante', [EstudianteController::class,'updateEstudiante']);
Route::post('createEstudiante', [EstudianteController::class,'createEstudiante']);

Route::post('createMatricula', [MatriculaController::class,'createMatricula']);
Route::post('getMatriculasByAnioAndCurso', [MatriculaController::class,'getMatriculasByAnioAndCurso']);
Route::post('deleteMatricula', [MatriculaController::class,'deleteMatricula']);
Route::post('updateMatricula/{id}', [MatriculaController::class,'updateMatricula']);