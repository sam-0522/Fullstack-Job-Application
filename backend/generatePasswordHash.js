const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter a new admin password (minimum 12 characters): ', async (password) => {
  try {
    if (password.length < 12) {
      console.log('Password must contain at least 12 characters.');
      return;
    }

    const hash = await bcrypt.hash(password, 12);

    console.log('\nYour password hash is:\n');
    console.log(hash);
    console.log('\nCopy this hash into ADMIN_PASSWORD_HASH in backend/.env.');
  } catch (error) {
    console.error('Could not generate password hash:', error.message);
  } finally {
    rl.close();
  }
});