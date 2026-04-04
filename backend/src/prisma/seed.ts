import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("--- Cleaning Database ---");

  await prisma.projectVersion.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.template.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.company.deleteMany({});
  // Optional: await prisma.user.deleteMany({});
  console.log("--- Starting Seed ---");

  // Hash the password once to reuse for all test users
  const hashedPassword = await bcrypt.hash("12345678", 10);
  console.log(`Hashed Password generated for all users.`);

  // 1. Create 3 Test Users
  const userData = [
    { name: "User One", email: "user@example.com" },
    { name: "Admin User", email: "admin@zephy.co.in" },
    { name: "Security Auditor", email: "auditor@securecorp.in" },
  ];

  for (const data of userData) {
    const user = await prisma.user.upsert({
      where: { email: data.email },
      update: {},
      create: {
        name: data.name,
        email: data.email,
        passwordHash: hashedPassword,
      },
    });
    console.log(`User confirmed: ${user.email}`);
  }

  // 2. Create a Test Company
  const company = await prisma.company.create({
    data: {
      name: "SecureCorp India",
      email: "contact@securecorp.in",
      scope: "External Web Application Pentest",
    },
  });
  console.log(`Company created: ${company.name}`);

  // 3. Create a Service
  const service = await prisma.service.create({
    data: {
      name: "Web VAPT",
    },
  });
  console.log(`Service created: ${service.name}`);

  // 4. Create an Active Template
  // Required for Flow 1: Create Project
  const template = await prisma.template.create({
    data: {
      name: "Standard Web Template",
      serviceId: service.id,
      version: "1.0.0",
      isActive: true,
      sections: [
        {
          sectionId: "sec_1",
          title: "Executive Summary",
          blocks: [
            { type: "rich_text", config: { placeholder: "Enter summary..." } },
          ],
        },
      ],
    },
  });
  console.log(`Active Template created: ${template.name}`);

  console.log("--- Seed Finished Successfully ---");
}

main()
  .catch((e) => {
    console.error("Seed Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
