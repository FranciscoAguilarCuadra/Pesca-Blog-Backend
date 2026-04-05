import bcrypt from 'bcrypt'

const password = '1234'
const hashedPassword = await bcrypt.hash(password, 10)

console.log(hashedPassword)