<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Certificado Anual de Promoción</title>
    <style>
        @page {
            margin: 47px 47px 47px 60px;
        }
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
        }

        .text-center {
            text-align: center;
        }

        .title {
            font-size: 36px;
            font-weight: bold;
        }

        .subtitle {
            font-size: 20px;
            font-weight: bold;
        }

        .subtitle_2 {
            font-size: 14px;
            font-weight: bold;
        }

        .subtitle_3 {
            font-size: 8px;
        }

        .section {
            text-align: justify;
            font-size: 12px;
        }

        table {
            width: 90%;
            margin: 20px auto;
            border-collapse: collapse;
            font-size: 12px;
        }

        th, td {
            border: 1px solid #000;
            padding: 6px;
            text-align: center;
        }

        .footer {
            font-size: 12px;
            text-align: justify;
            margin-top: 20px;
        }

        .signature {
            margin-top: 70px;
            text-align: left;
            padding-right: 40px;
            font-weight: bold;
        }

        .mt-1 { margin-top: 5px; }
        .mt-2 { margin-top: 10px; }
        .mt-3 { margin-top: 15px; }
        .mt-4 { margin-top: 20px; }
        .mt-5 { margin-top: 25px; }
        .mt-6 { margin-top: 30px; }
    </style>
</head>
<body>

    <div class="text-center">
        <div class="subtitle_3">REPÚBLICA DEL ECUADOR</div>
        <div class="subtitle_2 mt-1">Colegio Particular Vespertino Femenino</div>
        <div class="title mt-1">“SANTA GEMA”</div>
        <div class="subtitle_3 mt-1">PICHINCHA – MANABÍ – ECUADOR</div>
        <div class="mt-1 subtitle">Certificado Anual de Promoción</div>
        <div class="subtitle_2 mt-1">{{ $anio }}</div>
    </div>

    <div class="section mt-4">
        El Colegio, conforme al Art. 315 del Reglamento General de la Ley de Educación, confiere el presente
        <strong>CERTIFICADO DE PROMOCIÓN</strong> al/la estudiante:
    </div>

    <div class="text-center mt-2"><div><strong>{{ $estudiante }}</strong></div></div>

    <div class="section mt-2">
        Del <strong>{{ $curso }}</strong>, luego de haberse presentado a exámenes y obtenido las siguientes calificaciones:
    </div>

    <table>
        <thead>
            <tr>
                <th>Asignaturas</th>
                <th>Promedio final</th>
                <th>Observaciones</th>
            </tr>
        </thead>
        <tbody>
            @foreach($notas as $nota)
                <tr>
                    <td style="text-align: left;">{{ $nota['materia'] }}</td>
                    <td>{{ $nota['promedio'] }}</td>
                    <td>{{ $nota['observaciones'] }}</td>
                </tr>
            @endforeach
            <tr>
                <td style="text-align: left;"><strong>Promedio Global de rendimiento</strong></td>
                <td><strong>{{ $promedio_global }}</strong></td>
                <td><strong>{{ $observacion_global }}</strong></td>
            </tr>
        </tbody>
    </table>

    <div class="footer">
        Por lo tanto, se le promueve al Segundo Curso del Ciclo Básico.
    </div>

    <div class="footer">
        Así consta en los libros de calificaciones de la Secretaría del Plantel.
    </div>

    <div class="footer">
        {{ $lugar_fecha }}
    </div>

    <div class="signature">RECTOR/A</div>

</body>
</html>
