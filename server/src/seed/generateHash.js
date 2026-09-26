import readline from 'node:readline';
import bcrypt from 'bcryptjs';
import { logger } from '../utils/looger.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter the admin password to hash: ', async (password) => {
  if (!password) {
    logger.error('No password entered.');
    rl.close();
    process.exit(1);
  }

  try {
    const hash = await bcrypt.hash(password, 12);

    logger.success('Password hash generated successfully.');

    console.log('\nPut this in your .env as ADMIN_PASSWORD_HASH:\n');
    console.log(hash);
    console.log(
      '\n(This hash is safe to store — the plaintext password is not saved anywhere.)'
    );
  } catch (error) {
    logger.error(`Failed to generate password hash: ${error.message}`);
    process.exitCode = 1;
  } finally {
    rl.close();
  }
});