import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function fixPasswordHashes() {
  try {
    console.log('Starting password hash fix...');
    
    // Get all users
    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users to process`);
    
    // Generate a new hash for "password123"
    const password = 'password123';
    const saltRounds = 10;
    const newHash = await bcrypt.hash(password, saltRounds);
    
    console.log(`Generated new hash for "${password}": ${newHash}`);
    
    // Update each user with the new hash
    for (const user of users) {
      await prisma.user.update({
        where: { id: user.id },
        data: { password: newHash }
      });
      console.log(`Updated password hash for user ${user.username} (${user.email})`);
    }
    
    console.log('Password hash fix completed successfully!');
  } catch (error) {
    console.error('Error fixing password hashes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixPasswordHashes();
