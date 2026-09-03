import { hash } from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error("Usage: npm run auth:hash-password -- <password>");
  process.exit(1);
}

const hashed = await hash(password, 12);
console.log(hashed);
