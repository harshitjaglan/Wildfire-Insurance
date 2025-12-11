import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting membership backfill...");

  // Get all rooms
  const rooms = await prisma.room.findMany({
    select: {
      id: true,
      userId: true,
      name: true,
    },
  });

  console.log(`Found ${rooms.length} rooms to process`);

  let created = 0;
  let skipped = 0;

  for (const room of rooms) {
    // Check if membership already exists
    const existing = await prisma.roomMembership.findUnique({
      where: {
        roomId_userId: {
          roomId: room.id,
          userId: room.userId,
        },
      },
    });

    if (existing) {
      console.log(`✓ Membership already exists for room: ${room.name}`);
      skipped++;
      continue;
    }

    // Create OWNER membership
    await prisma.roomMembership.create({
      data: {
        roomId: room.id,
        userId: room.userId,
        role: "OWNER",
      },
    });

    console.log(`✓ Created OWNER membership for room: ${room.name}`);
    created++;
  }

  console.log("\n--- Backfill Complete ---");
  console.log(`Created: ${created} memberships`);
  console.log(`Skipped: ${skipped} (already existed)`);
  console.log(`Total rooms: ${rooms.length}`);
}

main()
  .catch((e) => {
    console.error("Error during backfill:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
