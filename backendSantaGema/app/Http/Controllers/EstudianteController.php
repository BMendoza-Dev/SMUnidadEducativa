<?php

namespace App\Http\Controllers;

use App\Models\Estudiante;
use App\Models\Matricula;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

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

    public function getListStudentsByALectivo(Request $request)
    {
        $validated = $request->validate([
            'anio_lectivo_id' => ['required', 'integer', 'min:0'],
            'curso_id'        => ['required', 'integer', 'min:0'],
        ]);

        $query = Matricula::with([
            'estudiante.usuario', // estudiante → usuario
            'curso',              // curso de la matrícula
            'anioLectivo'         // año lectivo de la matrícula
        ]);

        if ($validated['anio_lectivo_id'] !== 0) {
            $query->where('anio_lectivo_id', $validated['anio_lectivo_id']);
        }

        if ($validated['curso_id'] !== 0) {
            $query->where('curso_id', $validated['curso_id']);
        }

        // Traemos las matrículas con todas las relaciones
        $estudiantes = $query->get();

        return response()->json([
            'code'        => 200,
            'message'     => 'Estudiantes encontrados.',
            'data' => $estudiantes,
        ]);
    }

    public function generarCertificadoNotasPdf($matricula_id)
    {
        $matricula = Matricula::with([
            'estudiante.usuario',
            'curso',
            'anioLectivo',
            'notas.materia'
        ])->findOrFail($matricula_id);

        $usuario = $matricula->estudiante->usuario;
        $anio = $matricula->anioLectivo->nombre;
        $curso = $matricula->curso->nombre;
        $estudiante = $usuario->nombres . ' ' . $usuario->apellidos;

        $notas = $matricula->notas->map(function ($nota) {
        $materia = $nota->materia;
        $tipo = strtoupper($materia->tipo_nota);

        if ($tipo === 'CUALITATIVA') {
            $promedio = match (true) {
                $nota->calificacion >= 19 => 'A',
                $nota->calificacion >= 16 => 'B',
                $nota->calificacion >= 13 => 'C',
                $nota->calificacion >= 10 => 'D',
                default => 'E',
            };
        } else {
            // Cuantitativa
            $promedio = (int) $nota->calificacion;
        }

        return [
            'materia'       => $materia->nombre,
            'promedio'      => $promedio,
            'observaciones' => ($nota->calificacion >= 17 && $tipo === 'CUANTITATIVA') ? 'Aprobado' : ''
        ];
    });


        $promedio_global = round(
            $matricula->notas
                ->filter(fn($n) => $n->materia->incluye_promedio)
                ->avg('calificacion')
        );

        $observacion_global = $promedio_global >= 14 ? 'Aprobado' : '';

        $lugar_fecha = 'Pichincha, ' . now()->locale('es')->isoFormat('D [de] MMMM [de] YYYY');

        $pdf = Pdf::loadView('pdf.certificado_promocion', compact(
            'anio', 'curso', 'estudiante', 'notas', 'promedio_global', 'observacion_global' , 'lugar_fecha'
        ));

        return response($pdf->output(), 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="certificado.pdf"');
    }

}