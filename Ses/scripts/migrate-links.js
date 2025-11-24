import 'dotenv/config';
import { config } from 'dotenv';
import path from 'path';

// Explicitly load .env.local
config({ path: path.resolve(process.cwd(), '.env.local') });

import connectDB from "../lib/db.js";
import User from "../models/User.js";

async function migrateLinks() {
  await connectDB();

  const users = await User.find({});
  console.log(`Found ${users.length} users`);

  for (const user of users) {
  const oldLinks = [
    ...(user.allowedModules || []),
    ...(user.customModules || []),
  ];

  if (oldLinks.length === 0) {
    console.log(`No old links for user: ${user.email || user._id}`);
    continue;
  }

  // Ensure links array exists
  if (!Array.isArray(user.links)) {
    user.links = [];
  }

  await User.updateOne(
    { _id: user._id },
    {
      $set: { allowedModules: [], customModules: [] },
      $push: {
        links: { $each: oldLinks.filter(l => !user.links.find(link => link.url === l.url)) }
      }
    }
  );

  console.log(`Migrated user: ${user.email || user._id}`);
}


  console.log("Migration complete!");
  process.exit(0);
}

migrateLinks().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
