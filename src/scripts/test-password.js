import bcrypt from 'bcrypt';

async function testPassword() {
  const password = 'password123';
  const storedHash = '$2b$10$kctZwbQ/VDBqxVG80w/h6OvR4cQbWydeZnAoVB3qgoXe5Kf1bbV4i';
  
  try {
    console.log(`Testing password "${password}" against hash:`);
    console.log(storedHash);
    
    const passwordMatch = await bcrypt.compare(password, storedHash);
    console.log(`Password match result: ${passwordMatch}`);
  } catch (error) {
    console.error('Error testing password:', error);
  }
}

testPassword();
