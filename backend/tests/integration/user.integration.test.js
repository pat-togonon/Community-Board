const supertest = require('supertest')
const app = require('../../app')
const User = require('../../models/User')
const Community = require('../../models/Community')
const RefreshToken = require('../../models/RefreshToken')
const { createCommunityData, signUpData, loginAdminData, usersInDb, refreshTokenInDb } = require('../../utils/helper.fortest')

jest.setTimeout(20000)

const api = supertest(app)

beforeEach(async () => {
  await Promise.all([
    User.deleteMany({}),
    Community.deleteMany({}),
    RefreshToken.deleteMany({}),
    ])
  })

describe("When users exist in an active community", () => {

  let communityId
  let adminUser
  let adminUserToken
  let user
  let userToken

  beforeEach(async () => {
    //create the active community
    const communityResponse = await api
      .post('/api/communities')
      .send(createCommunityData)
      .expect(201)
    
    communityId = communityResponse.body.community.id

    //login its admin
    const adminData = {
      ...loginAdminData,
      communityId
    }
    const adminLoginResponse = await api
      .post('/api/auth/login')
      .send(adminData)
      .expect(200)

    const admin = adminLoginResponse.body
    adminUserToken =  admin.accessToken

    adminUser = {
      username: admin.username,
      id: admin.id,
      communityList: admin.communityList,
      community: admin.community,
      managedCommunity: admin.managedCommunity
    }

    //sign up a new user
    const user2 = {
      ...signUpData,
      communityId
    }
    const signupResponse = await api
      .post('/api/auth/users')
      .send(user2)
      .expect(201)


    //login this user
    const user2Login = {
      username: user2.username,
      password: user2.password,
      communityId
    }
    const loginUserResponse = await api
      .post('/api/auth/login')
      .send(user2Login)
      .expect(200)
    
    const userData = loginUserResponse.body
    userToken = userData.accessToken

    user = {
      username: userData.username,
      id: userData.id,
      communityList: userData.communityList,
      community: userData.community,
      managedCommunity: userData.managedCommunity
    }
  })

  test('User can update their own name', async () => {
    const updateNameResponse = await api
      .put(`/api/user/settings/${adminUser.id}`)
      .set('Authorization', `Bearer ${adminUserToken}`)
      .send({ name: "Patricia P." })
      .expect(200)

    expect(updateNameResponse.body).toBeDefined()
    expect(updateNameResponse.body).toBe("Patricia P.")
  })

  test("User can't update another user's name", async () => {

    const updateNameResponse = await api
      .put(`/api/user/settings/${adminUser.id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: "Patricia P." })
      .expect(403)
    
    expect(updateNameResponse.body.error).toBeDefined()
    expect(updateNameResponse.body.error).toContain("Forbidden: Can't update account you don't own")
  })

  test('User can update their own password', async () => {
    
    const initialRefreshTokenInDb = await refreshTokenInDb() //should be 2 because there are 2 logged in users
    
    const forPasswordUpdate = {
      oldPassword: createCommunityData.password,
      newPassword: "NewSecret123"
    }
    const updatePasswordResponse = await api
      .put(`/api/auth/password-update/${adminUser.id}`)
      .set('Authorization', `Bearer ${adminUserToken}`)
      .send(forPasswordUpdate)
      .expect(204)

    const finalRefreshTokenInDb = await refreshTokenInDb() //should be 1 when user updates their password, they get logged out which deletes/invalidates their refresh token too
    
    expect(updatePasswordResponse.body).toBeDefined()
    expect(initialRefreshTokenInDb).toHaveLength(2)
    expect(finalRefreshTokenInDb).toHaveLength(1)  
    
  })

  test("User can't update another user's password", async () => {  
    
    const forPasswordUpdate = {
      oldPassword: createCommunityData.password,
      newPassword: "NewSecret123"
    }
    const updatePasswordResponse = await api
      .put(`/api/auth/password-update/${adminUser.id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(forPasswordUpdate)
      .expect(403)
    
    expect(updatePasswordResponse.body.error).toBeDefined()
    expect(updatePasswordResponse.body.error).toContain("Forbidden: Can't update account password you don't own")
    
  })

  test('User can delete their own account', async () => {
    const initialUsersInDb = await usersInDb()

    const deleteAccountResponse = await api
      .delete(`/api/user/settings/${user.id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(204)

    const finalUsersInDb = await usersInDb()

    expect(deleteAccountResponse.body).toStrictEqual({})
    expect(initialUsersInDb).toHaveLength(2)
    expect(finalUsersInDb).toHaveLength(1)
  })

  test("Admin can't delete their own account unless requested", async () => {
    const initialUsersInDb = await usersInDb()

    const deleteAccountResponse = await api
      .delete(`/api/user/settings/${adminUser.id}`)
      .set('Authorization', `Bearer ${adminUserToken}`)
      .expect(403)

    const finalUsersInDb = await usersInDb()

    expect(deleteAccountResponse.body.error).toBeDefined()
    expect(deleteAccountResponse.body.error).toContain("We see you're an admin. Please contact the webmaster to request deletion of your account")
    expect(initialUsersInDb).toHaveLength(2)
    expect(finalUsersInDb).toHaveLength(2)
  })

  test("User can't delete another user's account", async () => {
    const initialUsersInDb = await usersInDb()

    const deleteAccountResponse = await api
      .delete(`/api/user/settings/${adminUser.id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403)

    const finalUsersInDb = await usersInDb()

    expect(deleteAccountResponse.body.error).toBeDefined()
    expect(deleteAccountResponse.body.error).toContain("Forbidden: Can't delete account you don't own")
    expect(initialUsersInDb).toHaveLength(2)
    expect(finalUsersInDb).toHaveLength(2)
  })

})

afterAll(async () => {
  await Promise.all([
    User.deleteMany({}),
    Community.deleteMany({}),
    RefreshToken.deleteMany({}),
    ])
  })
  
