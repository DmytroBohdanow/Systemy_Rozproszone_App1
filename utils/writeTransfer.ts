import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function writeTransferToFile(newTransfer: Object) {
  try {
    // Read the existing JSON file
    const existingData = fs.readFileSync(path.join(__dirname, '/../transfers.json'), 'utf8');
    const existingObjects = JSON.parse(existingData);
    // Add the new object to the existing objects
    existingObjects.transfers.push(newTransfer);

    // Write the updated objects back to the JSON file
    fs.writeFileSync(path.join(__dirname, '/../transfers.json'), JSON.stringify(existingObjects));

    console.log('New object written to file successfully.');
  } catch (error) {
    console.error('Error writing object to file:', error);
  }
}