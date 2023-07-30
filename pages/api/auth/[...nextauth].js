import { connectToClient } from '../../../lib/db'
import { compare } from 'bcryptjs'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const options = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const client = await connectToClient()
        const usersCollection = client.db().collection('users')

        const user = await usersCollection.findOne({
          email: credentials.email,
        })

        if (!user) {
          client.close()
          throw new Error('No user found with this email')
        }

        const isValid = await compare(credentials.password, user.password)

        if (!isValid) {
          client.close()
          throw new Error('Incorrect password')
        }

        client.close()

        return { email: user.email }
      },
    }),
  ],
}

export default NextAuth(options)
