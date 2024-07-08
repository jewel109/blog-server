const bcrypt = require('bcryptjs')

const validateInput = (email , password) => {
  return (
    email && password
  )
}


const comparePassword = (password, hashedPassword) => {

  return bcrypt.compareSync(password,hashedPassword)
}

module.exports = {
  comparePassword,validateInput
}
