import { getServerSession } from 'next-auth'
import { connectToClient } from '../../../lib/db'
import { compare, hash } from 'bcryptjs'
import { options } from './[...nextauth]'

async function handler(req, res) {
  const client = await connectToClient()

  const usersCollection = client.db().collection('users')

  if (req.method === 'POST') {
    await createUser(req, res, usersCollection)
  } else if (req.method === 'PATCH') {
    await updateUser(req, res, usersCollection)
  }

  res.status(302).setHeader('Location', '/404')
  res.end()
  client.close()
}

async function createUser(req, res, usersCollection) {
  const data = req.body
  const { email, password } = data
  console.log(req.body)
  if (
    !email ||
    !email.includes('@') ||
    !password ||
    password.trim().length < 7
  ) {
    res.status(403).json({ message: 'Invalid input' })
    return
  }

  await usersCollection.createIndex({ email: 1 }, { unique: true })

  const hashedPassword = await hash(password, 12)

  try {
    await usersCollection.insertOne({ email, password: hashedPassword })
    res.status(200).json({ message: 'User registered successfully!' })
  } catch (error) {
    if (error.code === 11000) {
      res.status(500).json({ message: 'User with this email already exists' })
    } else {
      res.status(500).json({ message: 'Error registering user' })
    }
  }
}

async function updateUser(req, res, usersCollection) {
  const session = await getServerSession(req, res, options)
  const { oldPassword, newPassword } = req.body

  if (!session.user.email) {
    return res.status(401).json({ message: 'Not authenticated' })
  }

  const email = session.user.email

  const user = await usersCollection.findOne({ email })

  const isValid = await compare(oldPassword, user.password)

  const samePassword = await compare(newPassword, user.password)

  if (samePassword) {
    return res
      .status(400)
      .json({ message: 'New password must be different from old password' })
  }

  console.log(isValid)

  const hashedPassword = await hash(newPassword, 12)

  try {
    if (isValid) {
      const response = await usersCollection.updateOne(
        { email },
        { $set: { password: hashedPassword } }
      )
      res.status(200).json({ message: 'Password updated successfully!' })
    } else {
      res.status(401).json({ message: 'Old password is not correct' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating password' })
  }
}

export default handler
