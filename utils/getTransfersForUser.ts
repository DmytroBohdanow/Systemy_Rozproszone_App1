import fs from 'fs';
import path from "path";
import { fileURLToPath } from "url";

interface Transfer {
  transferId: number;
  transferSender: string;
  transferDestination: string;
  transferValue: string;
  balance: string;
  transferDate: string;
  type: string; 
}

interface TransferData {
  transfers: Transfer[];
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getTransfersByUser(username: string): Transfer[] {
  // Read the existing data from the JSON file
  let transferData: TransferData = { transfers: [] };
  const filePath = path.join(__dirname, '/../transfers.json')
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    transferData = JSON.parse(data) as TransferData;
  } catch (error) {
    console.error('Error reading JSON file:', error);
    return [];
  }

  // Filter transfers based on transferSender or transferDestination
  const filteredTransfers = transferData.transfers.filter(
    transfer => transfer.transferSender === username || transfer.transferDestination === username
  );

  return filteredTransfers;
}

