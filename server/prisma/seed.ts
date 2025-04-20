

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main(){
    const email = "superadmin@gmail.com";
    const password = "pass@1234";
    const name="Super Admin";

    // check for existingSuperAdmin:
    const existingSuperAdmin = await prisma.user.findFirst({
        where: { role: 'SUPER_ADMIN'},
    }) 

    if(existingSuperAdmin){
        return;
    }

    // if no existingSuperAdmin then create a new:
    const salt=10;
    const hashedPassword = await bcrypt.hash(password, salt);
    const superAdminUser = await prisma.user.create({
        data: {
            email,
            name,
            password: hashedPassword,
            role: 'SUPER_ADMIN',
        }
    });
    console.log("super admin created succesfully", superAdminUser.email);
}

main()
.catch((error)=> {
    console.error(error);
    process.exit(1);
})
.finally(async () => {
    await prisma.$disconnect();
});

