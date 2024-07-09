<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AnioLectivoController;
use App\Http\Controllers\CursoController;
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
Route::post('registerCurso', [CursoController::class,'Register']);
Route::get('getListALectivo', [AnioLectivoController::class,'getListALectivo']);
Route::get('getListCurso', [CursoController::class,'getListCurso']);
Route::post('updateALectivo', [AnioLectivoController::class,'updateALectivo']);
Route::delete('deleteALectivo/{id}', [AnioLectivoController::class,'deleteALectivo']);