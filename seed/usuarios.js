import bcrypt from 'bcrypt'

const usuarios = [
    {
        nombre: 'Dario',
        email : 'dario@google.com',
        confirmado: 1,
        password: bcrypt.hashSync('password', 10),

    }
]


export default usuarios;