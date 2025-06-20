const supertest = require('supertest')
const app = require('../../app')
const User = require('../../models/User')
const Community = require('../../models/Community')
const RefreshToken = require('../../models/RefreshToken')
const PasswordResetAttempt = require('../../models/PasswordResetAttempt')
const { createCommunityData, createCommunityData2, signUpData, signUpData2, loginAdminData, usersInDb, communityListInDb, refreshTokenInDb, passwordResetAttemptInDb} = require('../../utils/helper.fortest')
const jwt = require('jsonwebtoken')

jest.setTimeout(30000)

const api = supertest(app)

beforeEach(async () => {
  await Promise.all([
    User.deleteMany({}),
    Community.deleteMany({}),
    RefreshToken.deleteMany({}),
    PasswordResetAttempt.deleteMany({})
  ])
})

describe('When there is initially nothing in db', () => {
    
  test('Can register a new community and users can log in', async () => {
    const response = await api
      .post('/api/communities')
      .send(createCommunityData)
      .expect(201)  
      
    const loginAdmin = {
      ...loginAdminData,
      communityId: response.body.community.id
    }

    const loginResponse = await api
      .post('/api/auth/login')
      .send(loginAdmin)
      .expect(200)

    const communities = await communityListInDb()
    const users = await usersInDb()
    
    expect(response.body).toBeDefined()
    expect(response.body.community).toBeDefined()
    expect(response.body.community.name).toBe(createCommunityData.communityName)

    expect(loginResponse).toBeDefined()
    expect(loginResponse.body.username).toBe(loginAdmin.username)
    expect(loginResponse.body.communityName).toBe(response.body.community.name)

    expect(communities).toHaveLength(1)
    expect(users).toHaveLength(1)
    expect(communities[0].name).toBe(createCommunityData.communityName)
    expect(users[0].username).toBe(loginAdmin.username)
      
  })

  test("Fails when user who's underaged registers a community", async () => {
    const newCommunity = {
      ...createCommunityData,
      birthYear: "2017"
    }

    const response = await api
      .post('/api/communities')
      .send(newCommunity)
      .expect(403)
    
    const communities = await communityListInDb()
    const users = await usersInDb()
    
    expect(response.body.error).toBeDefined()
    expect(response.body.error).toContain('You must be at least 18 years old')
    expect(communities).toHaveLength(0)
    expect(users).toHaveLength(0)
  })

  test("Users can't sign up when there is no community yet", async () => {
    const response = await api
      .post('/api/auth/users')
      .send(signUpData)
      .expect(400)
    
    const communities = await communityListInDb()
    const users = await usersInDb()
        
    expect(response.body.error).toBeDefined()
    expect(communities).toHaveLength(0)
    expect(users).toHaveLength(0)

  })

})

describe("When there is an existing community in db", () => {
  let communityId

  beforeEach(async () => {
    const response = await api
      .post('/api/communities')
      .send(createCommunityData)
      .expect(201)

    communityId = response.body.community.id
  })

  test("Setup created 1 user and 1 community", async () => {
    const communities = await communityListInDb()
    const users = await usersInDb()

    expect(users).toHaveLength(1)
    expect(communities).toHaveLength(1)

  })

  test("Users can sign up with valid info", async () => {
    const newUser = {
      ...signUpData2,
      communityId: communityId
    }
    
    const response = await api
      .post('/api/auth/users')
      .send(newUser)
      .expect(201)
    
    const users = await usersInDb()

    expect(response.body).toBeDefined()
    expect(users).toHaveLength(2)
  
  })

  test('Users can log in with valid credentials', async () => {
    const user = {
      ...loginAdminData,
      communityId
    }

    const response = await api
      .post('/api/auth/login')
      .send(user)
      .expect(200)

    const refreshTokenList = await refreshTokenInDb()
    const decoded = jwt.decode(response.body.accessToken)
    
    expect(response.body).toBeDefined()
    expect(response.body.username).toBe(user.username)
    expect(response.body.accessToken).toBeDefined()
    expect(refreshTokenList).toHaveLength(1)
    expect(decoded.username).toBe(user.username)
    
  })

  test("Users can't login with invalid credentials", async () => {
    const newUser = {
      username: "invalid",
      password: "invalid",
      communityId: communityId
    }
    const response = await api
      .post('/api/auth/login')
      .send(newUser)
      .expect(401)

    expect(response.body.error).toBeDefined()
  })

  test("Users shouldn't access community they don't belong in", async () => {
    // Create a 2nd community 
    const response = await api
      .post('/api/communities')
      .send(createCommunityData2)
      .expect(201)
    
    const community2 = response.body.community.id

    //log in details of community 1 admin to community 2 id
    const loginData = {
      ...loginAdminData,
      communityId: community2
    }

    const login = await api
      .post('/api/auth/login')
      .send(loginData)
      .expect(401)

    expect(login.body.error).toBeDefined()
    expect(login.body.error).toContain('User is not found or not a member of this community')
  })

  test("User can reset password with valid info", async () => {
    const user = {
      username: loginAdminData.username,
      newPassword: 'secret456',
      securityQuestion: "in-what-city-were-you-born",
      securityAnswer: "bulacan"
    }

    const response = await api
      .put('/api/auth/password-reset')
      .send(user)
      .expect(200)

    expect(response.body).toBeDefined()
    expect(response.body.message).toContain('Password reset successfully.')
    
  })

  test("Users can't reset password with invalid info", async () => {
    const user = {
      username: loginAdminData.username,
      newPassword: 'secret456',
      securityQuestion: "in-what-city-were-you-bor", //invalid
      securityAnswer: "bulacan"
    }

    const response = await api
      .put('/api/auth/password-reset')
      .send(user)
      .expect(403)

    expect(response.body.error).toBeDefined()
    expect(response.body.error).toContain('Invalid username or security questions or answer.')    
  })

  test("Users can attempt password reset with invalid info for max 3x a day", async () => {
    const user = {
      username: loginAdminData.username,
      newPassword: 'secret456',
      securityQuestion: "in-what-city-were-you-bor", //invalid
      securityAnswer: "bulacan"
    }

    const validUser = {
      username: loginAdminData.username,
      newPassword: 'secret456',
      securityQuestion: "in-what-city-were-you-born", 
      securityAnswer: "bulacan"
    }

    //First attempt
    await api
      .put('/api/auth/password-reset')
      .send(user)
      .expect(403)
    
    //Second attempt
    await api
      .put('/api/auth/password-reset')
      .send(user)
      .expect(403)

    //Third attempt.
    await api
      .put('/api/auth/password-reset')
      .send(user)
      .expect(403)

      //the 4th attempt but with the right info
    const response4 = await api
      .put('/api/auth/password-reset')
      .send(validUser)
      .expect(429)

    const passwordResetAttempts = await passwordResetAttemptInDb()

    expect(response4.body.error).toBeDefined()
    expect(response4.body.error).toContain('Too many password reset requests.')
    expect(passwordResetAttempts).toHaveLength(3)

  })

})



afterAll(async () => {
  await Promise.all([
    User.deleteMany({}),
    Community.deleteMany({}),
    RefreshToken.deleteMany({}),
    PasswordResetAttempt.deleteMany({})
  ])
})

