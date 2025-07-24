<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Matricula;
use App\Models\Nota;
use App\Models\Materia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NotaController extends Controller
{
    public function agregarNota(Request $request)
    {
        // Validación de los datos utilizando Validator
        $validator = Validator::make($request->all(), [
            'matricula_id' => 'required|exists:matriculas,id',
            'materias' => 'required|array',
            'materias.*.materia_id' => 'required|exists:materias,id',
            'materias.*.calificacion' => 'required|numeric|between:0,20.00',  // Calificación entre 0 y 20
        ]);

        // Comprobar si hay errores de validación
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Ocurrió un error de validación',
                'errors' => $validator->errors(),
                'code' => '401'
            ]); // 422 Unprocessable Entity
        }

        // Si la validación es exitosa, continuar con la lógica de almacenamiento
        $matricula_id = $request->matricula_id;
        $materias = $request->materias;

        // Eliminar notas existentes para la matrícula
        Nota::where('matricula_id', $matricula_id)->delete();

        // Guardar las nuevas notas y calcular el promedio solo de las que incluyen promedio
        $totalCalificaciones = 0;
        $totalMateriasConPromedio = 0;

        foreach ($materias as $materia) {
            // Crear la nota
            Nota::create([
                'matricula_id' => $matricula_id,
                'materia_id' => $materia['materia_id'],
                'calificacion' => $materia['calificacion'],
            ]);

            // Verificar si la materia se incluye en el promedio
            $materiaDB = Materia::find($materia['materia_id']);
            if ($materiaDB && $materiaDB->incluye_promedio) {
                $totalCalificaciones += $materia['calificacion'];
                $totalMateriasConPromedio++;
            }
        }

        $promedio = $totalMateriasConPromedio > 0 ? $totalCalificaciones / $totalMateriasConPromedio : 0;
        $promedio = ($promedio - floor($promedio)) >= 0.5 ? ceil($promedio) : floor($promedio);

        // Actualizar la matrícula con el promedio calculado
        Matricula::where('id', $matricula_id)->update(['promedio' => $promedio]);

        return response()->json([
            'message' => 'Notas guardadas correctamente',
            'code' => '200',
            'promedio' => $promedio,
        ]);
    }

    public function obtenerNotas($idMatricula)
    {
        // Obtener las notas relacionadas con la matrícula
        $notas = Nota::where('matricula_id', $idMatricula)
            ->get(['materia_id as materia_id', 'calificacion']); // Selecciona solo los campos necesarios

        return response()->json($notas);
    }

    public function generarCertificadoPromocion(Request $request) 
    {
        $data = $request->validate([
            'anio_lectivo_id' => 'required|integer|exists:anio_lectivos,id',
            'curso_id'        => 'required|integer|exists:cursos,id',
            // opcional para solo 1 estudiante:
            'matricula_id'    => 'nullable|integer|exists:matriculas,id',
        ]);

        $query = Matricula::with([
            'estudiante',
            'representante',
            'anioLectivo',
            'curso',
            'notas.materia',
        ])->where('anio_lectivo_id', $data['anio_lectivo_id'])
          ->where('curso_id', $data['curso_id']);

        if (!empty($data['matricula_id'])) {
            $query->where('id', $data['matricula_id']);
        }

        $matriculas = $query->get();

        if ($matriculas->isEmpty()) {
            return response()->json(['message' => 'No hay matrículas para esos parámetros'], 404);
        }

        // Preparar datos para la vista
        $certificados = $matriculas->map(function ($m) {
            $notas = $m->notas->map(function ($nota) {
                return [
                    'materia'      => $nota->materia->nombre,
                    'calificacion' => $nota->calificacion,
                    'observacion'  => $this->observacion($nota->calificacion),
                    'incluye_promedio' => $nota->materia->incluye_promedio, // bool
                ];
            });

            // Promedio Global solo con materias que incluyen_promedio = true
            $promedio = round(
                $notas->where('incluye_promedio', true)->avg('calificacion') ?? 0
            );

            // Puedes traer Disciplina u otras notas especiales como materia aparte
            $disciplina = optional(
                $notas->firstWhere('materia', 'Disciplina')
            )['calificacion'] ?? null;

            return [
                'estudiante'       => $m->estudiante->nombre_completo ?? $m->estudiante->nombres.' '.$m->estudiante->apellidos,
                'anio_lectivo'     => $m->anioLectivo->nombre ?? $m->anioLectivo->anio_inicio.' - '.$m->anioLectivo->anio_fin,
                'curso'            => $m->curso->nombre,
                'seccion'          => $m->curso->seccion ?? 'Vespertina',
                'notas'            => $notas,
                'promedio_global'  => $promedio,
                'disciplina'       => $disciplina,
                'fecha_certificado'=> Carbon::parse($m->anioLectivo->fecha_fin ?? now())->locale('es')->isoFormat('D [de] MMMM [de] YYYY'),
            ];
        });

        $pdf = Pdf::loadView('pdf.certificado-promocion', compact('certificados'))
                  ->setPaper('A4', 'portrait');

        return $pdf->stream('certificados.pdf'); // o ->download(...)
    }
}
