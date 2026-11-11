import bcrypt from "bcrypt";
import { User, sequelize } from "./src/models";

async function seedAdmin() {
  try {
    await sequelize.authenticate();
    const adminEmail = "admin@heartconnect.com";
    const defaultPassword = "admin123";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    let admin = await User.findOne({ where: { email: adminEmail } });

    if (!admin) {
      admin = await User.create({
        email: adminEmail,
        password: hashedPassword,
        username: "admin",
        first_name: "System",
        last_name: "Admin",
        role: "ADMIN",
        status: "ACTIVE",
        is_verified: true,
      });
      console.log(
        `[SUCCESS] Admin account created: ${adminEmail} / ${defaultPassword}`,
      );
    } else {
      admin.role = "ADMIN";
      admin.status = "ACTIVE";
      admin.password = hashedPassword;
      await admin.save();
      console.log(
        `[SUCCESS] Admin account updated: ${adminEmail} / ${defaultPassword}`,
      );
    }
  } catch (error) {
    console.error("Failed to seed admin:", error);
  } finally {
    process.exit(0);
  }
}

seedAdmin();
