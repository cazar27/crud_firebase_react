<?php

function readScoresFile($filename) {
    $scores = array();

    // Abrir el archivo en modo lectura
    $file = fopen($filename, 'r');

    if ($file) {
        // Leer el archivo línea por línea
        while (($line = fgets($file)) !== false) {
            // Dividir la línea en nombre y puntuación
            $parts = explode('-', $line);
            
            // Eliminar espacios en blanco y caracteres adicionales
            $name = trim($parts[0]);
            $score = intval(trim($parts[1]));
            
            // Agregar el nombre y la puntuación al array
            $scores[] = array('name' => $name, 'score' => $score);
        }

        // Cerrar el archivo
        fclose($file);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al abrir el archivo.']);
    }
    
    return $scores;
}

$playerName = $_POST['name']; // Obtener el nombre del jugador
$score = $_POST['score']; // Obtener la puntuación

// Ruta al archivo de texto donde se guardarán los registros
$filePath = '../data/scores.txt';

$scores = readScoresFile($filePath);

// Añadir el nuevo registro al array de puntuaciones
$scores[] = array('name' => $playerName, 'score' => $score);

// Ordenar el array de puntuaciones en orden descendente
usort($scores, function($a, $b) {
    return $b['score'] - $a['score'];
});

// Crear el registro en formato de texto
$recordsText = '';
foreach ($scores as $record) {
    $recordsText .= $record['name'] . ' - ' . $record['score'] . PHP_EOL;
}

// Guardar los registros en el archivo
$file = fopen($filePath, 'w');
if ($file) {
    fwrite($file, $recordsText);
    fclose($file);
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al abrir el archivo.']);
}

?>

