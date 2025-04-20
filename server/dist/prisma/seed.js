"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const email = "superadmin@gmail.com";
        const password = "pass@1234";
        const name = "Super Admin";
        // check for existingSuperAdmin:
        const existingSuperAdmin = yield prisma.user.findFirst({
            where: { role: 'SUPER_ADMIN' },
        });
        if (existingSuperAdmin) {
            return;
        }
        // if no existingSuperAdmin then create a new:
        const salt = 10;
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const superAdminUser = yield prisma.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: 'SUPER_ADMIN',
            }
        });
        console.log("super admin created succesfully", superAdminUser.email);
    });
}
main()
    .catch((error) => {
    console.error(error);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
