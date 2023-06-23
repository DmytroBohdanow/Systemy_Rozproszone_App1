import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

interface User {
  username: string;
  balance?: number;
  password?: string;
  accountType?: string;
  firstName?: string;
  lastName?: string;
  PESEL?: string;
}

interface UsersData {
  users: User[];
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function modifyUserFields(
  username: string,
  fieldsToUpdate: Partial<User>
): void {
  // Read the existing data from the JSON file
  let usersData: UsersData = { users: [] };
  let filePath: string = path.join(__dirname, "/../users.json");
  try {
    const data = fs.readFileSync(filePath, "utf8");
    usersData = JSON.parse(data) as UsersData;
  } catch (error) {
    console.error("Error reading JSON file:", error);
    return;
  }

  // Find the user by username and update the fields
  const userIndex = usersData.users.findIndex(
    (user) => user.username === username
  );
  if (userIndex !== -1) {
    const userToUpdate = usersData.users[userIndex];
    usersData.users[userIndex] = { ...userToUpdate, ...fieldsToUpdate };
  }

  // Write the updated data back to the JSON file
  try {
    fs.writeFileSync(filePath, JSON.stringify(usersData));
    console.log("Fields updated successfully!");
  } catch (error) {
    console.error("Error writing to JSON file:", error);
  }
}

