<?php
try {
    $pdo = new PDO("mysql:host=127.0.0.1", "root", "");
    $pdo->exec("CREATE DATABASE IF NOT EXISTS temple_erp");
    echo "Database created or already exists.";
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
