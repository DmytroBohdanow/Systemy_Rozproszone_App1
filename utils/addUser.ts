import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface User {
  userId: string;
  username: string;
  password: string;
  accountType: string;
  balance: number;
  firstName: string,
  lastName: string,
  PESEL: string,
}

export function addUser(newUser: User) {
  let filePath: string = path.join(__dirname, "/../users.json");

  // Read the JSON file
  const data = fs.readFileSync(path.join(__dirname, "/../users.json"), "utf8");
  const usersData = JSON.parse(data);

  usersData.users.push(newUser);

  // Return the found users
  try {
    fs.writeFileSync(filePath, JSON.stringify(usersData));
    console.log("Fields updated successfully!");
  } catch (error) {
    console.error("Error writing to JSON file:", error);
  }
}
