import fs from 'fs';
import path from "path";
import { fileURLToPath } from "url";

interface User {
  username: string;
}

interface UsersData {
  users: User[];
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function deleteUserByUsername(username: string): void {
  // Read the existing data from the JSON file
  let usersData: UsersData = { users: [] };
  let filePath: string = path.join(__dirname, "/../users.json");
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    usersData = JSON.parse(data) as UsersData;
  } catch (error) {
    console.error('Error reading JSON file:', error);
    return;
  }

  // Find the index of the user by username
  const userIndex = usersData.users.findIndex(user => user.username === username);
  if (userIndex !== -1) {
    // Remove the user from the array
    usersData.users.splice(userIndex, 1);

    // Write the updated data back to the JSON file
    try {
      fs.writeFileSync(filePath, JSON.stringify(usersData, null, 2));
      console.log(`User '${username}' deleted successfully!`);
    } catch (error) {
      console.error('Error writing to JSON file:', error);
    }
  } else {
    console.log(`User '${username}' not found.`);
  }
}
