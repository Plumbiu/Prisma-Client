import { Prisma, PrismaClient } from '@prisma/client'
import bodyParser from 'body-parser'
import express from 'express'

const prisma = new PrismaClient()
const app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.get('/relation', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: 1
    },
    include: {
      posts: false
    }
  })
  res.json(user)
})
app.post('/relation', async (req, res) => {
  const { email, name, title } = req.body
  const users = await prisma.user.create({
    data: {
      email,
      name,
      posts: {
        create: [
          { title }
        ]
      }
    },
  })
  res.json(users)
})
app.post('/connect', async (req, res) => {
  const { email } = req.body
  const updatedUser = await prisma.user.create({
    data: {
      email,
      posts: {
        connect: {
          id: 2
        }
      }
    }
  })
  res.json(updatedUser)
})
app.put('/connect', async (req, res) => {
  const { id } = req.body
  const user = await prisma.user.update({
    where: {
      id: +id
    },
    data: {
      posts: {
        connect: {
          id: 2
        },
        create: {
          title: 'This is my new post'
        }
      }
    }
  })
  res.json(user)
})
app.get('/connectorcreated', async (req, res) => {
  const email = 'gxjj@example.com'
  const user = await prisma.post.create({
    data: {
      title: 'connect or created',
      author: {
        connectOrCreate: {
          where: {
            email
          },
          create: {
            email,
          }
        }
      }
    }
  })
  res.json(user)
})
app.get('/disconnect', async (req, res) => {
  const updateUser = await prisma.user.update({
    where: {
      id: 1
    },
    data: {
      posts: {
        set: []
      }
    }
  })
  res.json(updateUser)
})
app.get('/delete', async (req, res) => {
  const deletedUser = await prisma.user.update({
    where: {
      id: 1
    },
    data: {
      posts: {
        deleteMany: {}
      }
    }
  })
  res.json(deletedUser)
})
app.get('/contains', async (req, res) => {
  const containsUsers = await prisma.post.findMany({
    where: {
      NOT: {
        title: {
          contains: 'Prisma'
        }
      }
    }
  })
  res.json(containsUsers)
})
app.get('/none', async (req, res) => {
  const noneUsers = await prisma.user.findMany({
    where: {
      posts: {
        none: {
          published: true
        }
      }
    }
  })
  res.json(noneUsers)
})
app.get('/sort', async (req, res) => {
  const sortedUsers = await prisma.user.findMany({
    include: {
      posts: true
    },
    orderBy: {
      posts: {
        _count: 'desc'
      }
    }
  })
  res.json(sortedUsers)
})
app.get('/safetype', async (req, res) => {
  const userEmail: Prisma.UserSelect = {
    email: false,
    id: true
  }
  const usersWithoutEmail = await prisma.user.findMany({
    select: userEmail
  })
  res.json(usersWithoutEmail)
})

app.get('/use', async (req, res) => {
  console.log(req.params)
  const users = await prisma.user.findMany({
    select: {
      email: true
    }
  })
  res.json(users)
})
// prisma.$use(async (params, next) => {
//   const result = await next(params)
//   const newResult = result.map((item: any) => {
//     return item.email.indexOf('xj') === -1 ? item : { ...item, email: item.email.replace('xj', '**')}
//   })
//   return newResult
// })
app.get('/illegal', async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      email: true
    }
  })
  res.json(users)
})
// prisma.$use(async (params, next) => {
//   console.log(params)
//   if(params.model === 'Post') {
//       if(params.action === 'delete') {
//           params.action = 'update'
//           params.args['data'] = { published: false }
//       } else if(params.action === 'deleteMany') {
//           params.action = 'updateMany'
//           if(params.args.data !== undefined) {
//               params.args.data['published'] = false
//           } else {
//               params.args['data'] = { published: false }
//           }
//       }
//   }
//   return next(params)
// })
app.get('/softdelete', async (req, res) => {
  const users = await prisma.post.deleteMany({
      where: {
          published: true
      }
  })
  res.json(users)
})
prisma.$use(async (params, next) => {
  const before = Date.now()
  const result = await next(params)
  const after = Date.now()
  console.log(`api dutation is ${after - before}ms`)
  return result
})
app.get('/duration', async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      email: true
    }
  })
  res.json(users)
})
app.listen(3001, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`),
)
