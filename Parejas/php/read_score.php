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
    }

    return $scores;
}

// Ejemplo de uso
$filename = '../data/scores.txt';
$scores = readScoresFile($filename);

// Imprimir el array de puntuaciones
echo json_encode($scores);
?>
