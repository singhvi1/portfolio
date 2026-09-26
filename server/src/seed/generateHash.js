import readline from 'node:readline';
import bcrypt from 'bcryptjs';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question('Enter the admin password to hash: ', async (password) => {
  if (!password) {
    console.error('No password entered.');
    rl.close();
    process.exit(1);
  }
  const hash = await bcrypt.hash(password, 12);
  console.log('\nPut this in your .env as ADMIN_PASSWORD_HASH:\n');
  console.log(hash);
  console.log('\n(This hash is safe to store — the plaintext password is not saved anywhere.)');
  rl.close();
});
