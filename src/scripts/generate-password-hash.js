import bcrypt from 'bcrypt';

async function generateHash() {
  const password = 'password123';
  const saltRounds = 10;
  
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log(`Hashed password for "${password}":`);
    console.log(hash);
  } catch (error) {
    console.error('Error generating hash:', error);
  }
}

generateHash();
