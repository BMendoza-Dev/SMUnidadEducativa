<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UsuarioController extends Controller
{
    public function consultarCedula($cedula)
    {
        // Buscar el usuario por la cédula
        $usuario = Usuario::where('cedula', $cedula)->first();

        // Verificar si el usuario existe
        if ($usuario) {
            return response()->json(['message' => 'La cédula existe en la base de datos.', 'code' => '200']);
        } else {
            return response()->json(['message' => 'La cédula no existe en la base de datos.', 'code' => '404']);
        }
    }

    public function registrarUsuario(Request $request)
    {
        // Validar la solicitud
        $validator = Validator::make($request->all(), [
            'cedula' => 'required|string|size:10|regex:/^[0-9]+$/',
            'nombres' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'nacionalidad' => 'required|string|max:255',
            'genero' => 'required|string|max:255',
            'fecha_nacimiento' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors(), 'code' => 422]);
        }

        // Buscar el usuario por la cédula
        $usuario = Usuario::where('cedula', $request->cedula)->first();


        // Verificar si el usuario existe
        if ($usuario) {
            return response()->json(['message' => 'La cédula existe en la base de datos.', 'code' => 201]);
        }


        $fechaNacimiento = date('Y-m-d', strtotime($request->fecha_nacimiento));
        // Crear el usuario
        $usuario = Usuario::create([
            'cedula' => $request->cedula,
            'nombres' => $request->nombres,
            'apellidos' => $request->apellidos,
            'nacionalidad' => $request->nacionalidad,
            'genero' => $request->genero,
            'fecha_nacimiento' => $fechaNacimiento,
        ]);

        $id = $usuario->id;

        return response()->json(['message' => 'Usuario registrado correctamente', 'id' => $id, 'code' => 200]);
    }

    public function getListUsuario()
    {
        $usuarios = Usuario::select('id', 'cedula', 'nombres', 'apellidos', 'nacionalidad', 'genero', 'fecha_nacimiento')->get();
        if ($usuarios->isEmpty()) {
            return response()->json(['message' => 'No existen datos agregados', 'code' => '404']);
        }
        return response()->json(['message' => $usuarios, 'code' => '200']);
    }

    public function deleteALectivo(Request $request)
    {

        $ids = $request->input('ids');
        Usuario::whereIn('id', $ids)->delete();

        return response()->json(['message' => 'Registro eliminado correctamente', 'code' => '200']);
    }

    public function updateUsuario(Request $request)
    {
        // Validar la solicitud
        $validator = Validator::make($request->all(), [
            'cedula' => 'required|string|size:10|regex:/^[0-9]+$/',
            'nombres' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'nacionalidad' => 'required|string|max:255',
            'genero' => 'required|string|max:255',
            'fecha_nacimiento' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors(), 'code' => 422]);
        }

        $usuario = Usuario::find($request->id);
        if (!$usuario) {
            return response()->json(['error' => 'Usuario no encontrado', 'code' => '404']);
        }

        $fechaNacimiento = date('Y-m-d', strtotime($request->fecha_nacimiento));
        $usuario->cedula = $request->cedula;
        $usuario->nombres = $request->nombres;
        $usuario->apellidos = $request->apellidos;
        $usuario->nacionalidad = $request->nacionalidad;
        $usuario->genero = $request->genero;
        $usuario->fecha_nacimiento = $fechaNacimiento;

        $usuario->save();

        return response()->json(['message' => 'Usuario Actualizado correctamente', 'code' => '200']);
    }

    public function deleteUsuario(Request $request)
    {

        $ids = $request->input('ids');
        Usuario::whereIn('id', $ids)->delete();

        return response()->json(['message' => 'Registro eliminado correctamente', 'code' => '200']);
    }

    public function generarDNI()
    {
        do {
            // Generar un número de 8 dígitos aleatorio
            $randomDigits = str_pad(mt_rand(0, 99999999), 8, '0', STR_PAD_LEFT);

            // Concatenar '00' al inicio para formar el DNI
            $dni = '00' . $randomDigits;

            // Verificar si el número ya existe en la tabla de usuarios
            $exists = Usuario::where('cedula', $dni)->exists();
        } while ($exists); // Repetir hasta que el número sea único

        // Retornar el DNI generado
        return response()->json(['message' => $dni, 'code' => '200']);
    }
}
