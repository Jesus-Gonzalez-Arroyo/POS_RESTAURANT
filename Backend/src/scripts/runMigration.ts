import pool from '../config/connectDB';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Script para ejecutar migraciones de base de datos
 * Uso: ts-node src/scripts/runMigration.ts <nombre_del_archivo>
 * Ejemplo: ts-node src/scripts/runMigration.ts 001_add_stock_to_products.sql
 */

const runMigration = async (filename: string) => {
  try {
    const migrationPath = path.join(__dirname, '../../migrations', filename);
    
    // Verificar si el archivo existe
    if (!fs.existsSync(migrationPath)) {
      console.error(`❌ Error: El archivo ${filename} no existe en el directorio migrations`);
      process.exit(1);
    }

    // Leer el contenido del archivo SQL
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    console.log(`🚀 Ejecutando migración: ${filename}`);
    console.log('-----------------------------------');
    
    // Ejecutar la migración
    await pool.query(sql);
    
    console.log(`✅ Migración ${filename} ejecutada exitosamente`);
    console.log('-----------------------------------');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al ejecutar la migración:', error);
    process.exit(1);
  }
};

// Obtener el nombre del archivo desde los argumentos de línea de comandos
const filename = process.argv[2];

if (!filename) {
  console.error('❌ Error: Debes proporcionar el nombre del archivo de migración');
  console.log('Uso: ts-node src/scripts/runMigration.ts <nombre_del_archivo>');
  console.log('Ejemplo: ts-node src/scripts/runMigration.ts 001_add_stock_to_products.sql');
  process.exit(1);
}

runMigration(filename);
