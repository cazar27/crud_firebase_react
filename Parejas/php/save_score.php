<?php

$playerName = $_POST['name']; // Obtener el nombre del jugador
$score = $_POST['score']; // Obtener la puntuación

// Ruta al archivo de texto donde se guardarán los registros
$filePath = '../data/scores.txt';

// Crear el registro en formato de texto
$record = "$playerName - $score" . PHP_EOL;

// Guardar el registro en el archivo
$file = fopen($filePath, 'a');
if ($file) {
    fwrite($file, $record);
    fclose($file);
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al abrir el archivo.']);
}

?>
