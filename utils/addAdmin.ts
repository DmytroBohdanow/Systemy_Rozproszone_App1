import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Admin {
  userId: string;
  username: string;
  password: string;
  accountType: string;
}

export function addAdmin(newAdmin: Admin) {
  let filePath: string = path.join(__dirname, "/../users.json");

  // Read the JSON file
  const data = fs.readFileSync(path.join(__dirname, "/../users.json"), "utf8");
  const adminsData = JSON.parse(data);

  adminsData.admins.push(newAdmin);

  // Return the found admins
  try {
    fs.writeFileSync(filePath, JSON.stringify(adminsData));
    console.log("Fields updated successfully!");
  } catch (error) {
    console.error("Error writing to JSON file:", error);
  }
}
