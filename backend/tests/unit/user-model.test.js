const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const User = require('../../models/User')

let mongo

beforeAll(async () => {
  mongo = await MongoMemoryServer.create()
  const uri = mongo.getUri()
  await mongoose.connect(uri)
})

afterAll(async () => {
  await mongoose.connection.close()
  await mongo.stop()
})

afterEach(async () => {
  await User.deleteMany({})
})

describe('User model transformation', () => {
  it('should not include passwordHash and securityAnswerHash in JSON output', async () => {
    const user = new User ({
      username: 'tricia12',
      birthYear: 1994,
      passwordHash: 'hashedVersionOfPasswordHere',
      email: 'sampleEmail@gmail.com',
      securityQuestion: 'in-what-city-were-you-born',
      securityAnswerHash: 'hashedVersionOfAnswerHere',
    })

    await user.save()
    const jsonOutput = user.toJSON()

    expect(jsonOutput.passwordHash).toBeUndefined()
    expect(jsonOutput.securityAnswerHash).toBeUndefined()

  })

  it('should have id instead of _id and no  more __v', async () => {
    const user = new User ({
      username: 'tricia12',
      birthYear: 1994,
      passwordHash: 'hashedVersionOfPasswordHere',
      email: 'sampleEmail@gmail.com',
      securityQuestion: 'in-what-city-were-you-born',
      securityAnswerHash: 'hashedVersionOfAnswerHere',
    })

    await user.save()
    const jsonOutput = user.toJSON()

    expect(jsonOutput).not.toHaveProperty('_id')
    expect(jsonOutput).not.toHaveProperty('__v')
    expect(jsonOutput).toHaveProperty('id')

  })

  it('should fail if security question is invalid', async () => {
    const user = new User ({
      username: 'tricia12',
      birthYear: 1994,
      passwordHash: 'hashedVersionOfPasswordHere',
      email: 'sampleEmail@gmail.com',
      securityQuestion: 'in-what-city-were-you-bor',
      securityAnswerHash: 'hashedVersionOfAnswerHere',
    })

    let error
    
    try {
      await user.save()
    } catch(err) {
      error = err
    }

    expect(error).toBeDefined()
    expect(error.name).toBe('ValidationError')
    expect(error.errors.securityQuestion).toBeDefined()
    expect(error.errors.securityQuestion.kind).toBe('enum')
    
  })

  it('should fail user is younger than the minimum age of 13', async () => {
    const user = new User ({
      username: 'tricia12',
      birthYear: 2015,
      passwordHash: 'hashedVersionOfPasswordHere',
      email: 'sampleEmail@gmail.com',
      securityQuestion: 'in-what-city-were-you-bor',
      securityAnswerHash: 'hashedVersionOfAnswerHere',
    })

    let error
    try {
      await user.save()
    } catch(err) {
      error = err
    }

    expect(error).toBeDefined()
    expect(error.name).toBe('ValidationError')
    expect(error.errors.birthYear).toBeDefined()

  })
})