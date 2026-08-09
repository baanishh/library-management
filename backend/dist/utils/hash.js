import bcrypt from "bcrypt";
const SALT_ROUNDS = 10;
// Hash password
export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return bcrypt.hash(password, salt);
}
// Compare password
export async function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
}
