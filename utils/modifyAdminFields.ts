import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

interface Admin {
  username: string;
  password?: string;
  accountType?: string;
}

interface AdminsData {
  admins: Admin[];
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function modifyAdminFields(
  username: string,
  fieldsToUpdate: Partial<Admin>
): void {
  // Read the existing data from the JSON file
  let adminsData: AdminsData = { admins: [] };
  let filePath: string = path.join(__dirname, "/../users.json");
  try {
    const data = fs.readFileSync(filePath, "utf8");
    adminsData = JSON.parse(data) as AdminsData;
  } catch (error) {
    console.error("Error reading JSON file:", error);
    return;
  }

  // Find the admin by username and update the fields
  const adminIndex = adminsData.admins.findIndex(
    (admin) => admin.username === username
  );
  if (adminIndex !== -1) {
    const adminToUpdate = adminsData.admins[adminIndex];
    adminsData.admins[adminIndex] = { ...adminToUpdate, ...fieldsToUpdate };
  }

  // Write the updated data back to the JSON file
  try {
    fs.writeFileSync(filePath, JSON.stringify(adminsData));
    console.log("Fields updated successfully!");
  } catch (error) {
    console.error("Error writing to JSON file:", error);
  }
}

