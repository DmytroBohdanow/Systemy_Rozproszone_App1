import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function findUserByUsername(username: string) {
  // Read the JSON file
  const data = fs.readFileSync(path.join(__dirname, "/../users.json"), 'utf8');
  const usersData = JSON.parse(data);

  // Search for users in the 'users' array
  const users = usersData.users.filter((user: { username: string; }) => user.username === username);

  // Return the found users
  return users;
}

export function findAdminByUsername(username: string) {
  // Read the JSON file
  const data = fs.readFileSync(path.join(__dirname, "/../users.json"), 'utf8');
  const adminsData = JSON.parse(data);

  // Search for admins in the 'admins' array
  const admins = adminsData.admins.filter((admin: { username: string; }) => admin.username === username);

  // Return the found admins
  return admins;
}

export function getAllUsers() {

}

export function getAllAdmins() {
  
}
