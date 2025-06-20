const supertest = require('supertest')
const app = require('../../app')
const User = require('../../models/User')
const Community = require('../../models/Community')
const RefreshToken = require('../../models/RefreshToken')
const Post = require('../../models/Post')
const Comment = require('../../models/Comment')
const { createCommunityData, createCommunityData2, signUpData2, loginAdminData, loginAdminData2, postsInDb, newPost, editedPostDescription, newComment1, newComment2, commentsInDb } = require('../../utils/helper.fortest')

jest.setTimeout(50000)

const api = supertest(app)

beforeEach(async () => {
  await Promise.all([
    User.deleteMany({}),
    Community.deleteMany({}),
    RefreshToken.deleteMany({}),
    Post.deleteMany({}),    
    Comment.deleteMany({})
    ])
  })

  describe('When a user is logged in', () => {

    let communityId
    let token
    let requestUser
    
    beforeEach(async () => {
      
      const communityResponse = await api
        .post('/api/communities')
        .send(createCommunityData)
        .expect(201)
   
      const data = communityResponse.body
      communityId = data.community.id

      const userToLogin = {
        username: data.user.username,
        password: loginAdminData.password,
        communityId: communityId
      }
      const loginResponse = await api
        .post('/api/auth/login')
        .send(userToLogin)
        .expect(200)
      
      const loginData = loginResponse.body
      token = loginData.accessToken
      
      requestUser = {
        username: loginData.username,
        id: loginData.id,
        communityList: loginData.communityList,
        community: loginData.community,
        managedCommunity: loginData.managedCommunity
      }

    })

    test('Logged in user can post and view posts', async () => {
      const initialPostsInDb = await postsInDb()
      const dataToPost = {
        ...newPost,
        communityId,
        author: requestUser.id,
      }

      const postResponse = await api
        .post(`/api/posts/${communityId}/${dataToPost.mainCategory}/${dataToPost.subCategory}`)
        .set('Authorization', `Bearer ${token}`)
        .send(dataToPost)
        .expect(201)

      const finalPostsInDb = await postsInDb()

      const viewPostResponse = await api
        .get(`/api/posts/${communityId}/home`)
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /application\/json/)
        .expect(200)

      expect(initialPostsInDb).toHaveLength(0)
      expect(finalPostsInDb).toHaveLength(1)
      expect(postResponse.body).toBeDefined()
      expect(postResponse.body.community).toBe(communityId)
      expect(postResponse.body.title).toBe(dataToPost.title)
      expect(postResponse.body.author).toBe(requestUser.id)
      expect(viewPostResponse.body).toBeDefined()
      expect(viewPostResponse.body).toHaveLength(1)

    })

    describe("When users are logged in and there are posts in db", () => {

      let communityId2
      let requestUser2
      let token2
      let post

      beforeEach(async () => {
        //Create 2nd community
        const communityResponse = await api
          .post('/api/communities')
          .send(createCommunityData2)
          .expect(201)
        
        communityId2 = communityResponse.body.community.id

        //login its admin
        const admin2 = {
          ...loginAdminData2,
          communityId: communityId2
        }
        const loginResponse2 = await api
          .post('/api/auth/login')
          .send(admin2)
          .expect(200)
        
        const loginData2 = loginResponse2.body
        token2 = loginData2.accessToken
          
        requestUser2 = {
          username: loginData2.username,
          id: loginData2.id,
          communityList: loginData2.communityList,
          community: loginData2.community,
          managedCommunity: loginData2.managedCommunity
        }

        //create a post

        const dataToPost = {
          ...newPost,
          communityId: communityId2,
          author: requestUser2.id,
        }
  
        const postResponse = await api
          .post(`/api/posts/${communityId2}/${dataToPost.mainCategory}/${dataToPost.subCategory}`)
          .set('Authorization', `Bearer ${token2}`)
          .send(dataToPost)
          .expect(201)
  
        post = postResponse.body
      })

      test("User can comment on posts and view comments in their own community", async () => {
        const initialCommentsInDb = await commentsInDb()
      
        const commentResponse = await api
          .post(`/api/posts/${communityId2}/${post.mainCategory}/${post.subCategory}/${post.id}/comments`)
          .set('Authorization', `Bearer ${token2}`)
          .send(newComment1)
          .expect(201)

        const finalCommentsInDb = await commentsInDb()

        const viewCommentsResponse = await api
          .get(`/api/posts/${communityId2}/comments/all`)
          .set('Authorization', `Bearer ${token2}`)
          .expect('Content-Type', /application\/json/)
          .expect(200)

        expect(initialCommentsInDb).toHaveLength(0)
        expect(finalCommentsInDb).toHaveLength(1)
        expect(commentResponse.body).toBeDefined()
        expect(commentResponse.body.comment).toBe(newComment1.comment)
        expect(commentResponse.body.commenter).toBe(requestUser2.id)
        expect(viewCommentsResponse.body).toBeDefined()
        expect(viewCommentsResponse.body[0].comment).toContain(newComment1.comment)

      })

      test("User from another community can't comment on posts", async () => {
        const initialCommentsInDb = await commentsInDb()

        //commenting to community 2 post
        const commentResponse = await api
          .post(`/api/posts/${communityId2}/${post.mainCategory}/${post.subCategory}/${post.id}/comments`)
          .set('Authorization', `Bearer ${token}`)
          .send(newComment2)
          .expect(401)

        const finalCommentsInDb = await commentsInDb()

        expect(initialCommentsInDb).toHaveLength(0)
        expect(finalCommentsInDb).toHaveLength(0)
        expect(commentResponse.body.error).toBeDefined()
        expect(commentResponse.body.error).toContain("You can't comment on posts outside of your community")
        
      })

      test('User can edit their own post', async () => {
        const editPostResponse = await api
          .put(`/api/posts/${communityId2}/${post.mainCategory}/${post.subCategory}/${post.id}`)
          .set('Authorization', `Bearer ${token2}`)
          .send(editedPostDescription)
          .expect(200)

        expect(editPostResponse.body).toBeDefined()
        expect(editPostResponse.body.description).toBe(editedPostDescription.description)

      })

      test('User can delete their own post', async () => {
        const initialPostsInDb = await postsInDb()

        const deleteResponse = await api
          .delete(`/api/posts/${communityId2}/${post.mainCategory}/${post.subCategory}/${post.id}`)
          .set('Authorization', `Bearer ${token2}`)
          .expect(204)
        
        const finalPostsInDb = await postsInDb()

        expect(initialPostsInDb).toHaveLength(1)
        expect(finalPostsInDb).toHaveLength(0)      
        expect(deleteResponse.body).toStrictEqual({})

      })

      test("User can favorite a post and remove a favorite post", async () => {
        const initialUser = await User.findById(requestUser2.id)
        const initialUserFavoritePosts = initialUser.favoritePosts
        
        const favoriteResponse = await api
          .put('/api/user/favorites')
          .set('Authorization', `Bearer ${token2}`)
          .send({ postId: post.id })
          .expect(200)
        
        const finalUser = await User.findById(requestUser2.id)
        const finalUserFavoritePosts = finalUser.favoritePosts

        const removeFavoriteResponse = await api
          .delete(`/api/user/favorites/${post.id}`)
          .set('Authorization', `Bearer ${token2}`)
          .expect(204)

        const removedFaveUser = await User.findById(requestUser2.id)
        const removedFaveUserPosts = removedFaveUser.favoritePosts

        expect(initialUserFavoritePosts).toHaveLength(0)
        expect(finalUserFavoritePosts).toHaveLength(1)
        expect(favoriteResponse.body).toBeDefined()
        expect(favoriteResponse.body.favoritePosts).toContain(finalUserFavoritePosts.toString())
        expect(removedFaveUserPosts).toHaveLength(0)
        expect(removeFavoriteResponse.body).toStrictEqual({})
        
      })


    describe("When there are multiple users in the same community", () => {

      let newUserToken
      let comment

      beforeEach(async () => {

        //sign up user 2 of community 2

        const newUser3 = {
          ...signUpData2,
          communityId: communityId2
        }

        await api
          .post('/api/auth/users')
          .send(newUser3)
          .expect(201)
        
        //login new user

        const newUser3login = {
          username: newUser3.username,
          password: newUser3.password,
          communityId: communityId2
        }

        const loginResponse = await api
          .post('/api/auth/login')
          .send(newUser3login)
          .expect(200)

        newUserToken = loginResponse.body.accessToken

        //admin to post a comment 

        const commentResponse = await api
          .post(`/api/posts/${communityId2}/${post.mainCategory}/${post.subCategory}/${post.id}/comments`)
          .set('Authorization', `Bearer ${token2}`)
          .send(newComment1)
          .expect(201)
        
        comment = commentResponse.body
      })


      test("Users can't edit others' post", async () => {
        //edit description of existing post - post by admin

        const editPostResponse = await api
          .put(`/api/posts/${communityId2}/${post.mainCategory}/${post.subCategory}/${post.id}`)
          .set('Authorization', `Bearer ${newUserToken}`)
          .send({ description: "New edited here okay" })
          .expect(410)

        expect(editPostResponse.body.error).toBeDefined()
        expect(editPostResponse.body.error).toContain("Post not found or invalid author or community.")
      })

      test("User can't delete others' post", async () => {
        const initialPostsInDb = await postsInDb()

        const deleteResponse = await api
          .delete(`/api/posts/${communityId2}/${post.mainCategory}/${post.subCategory}/${post.id}`) //post by admin
          .set('Authorization', `Bearer ${newUserToken}`)
          .expect(410)
        
        const finalPostsInDb = await postsInDb()

        expect(initialPostsInDb).toHaveLength(1)
        expect(finalPostsInDb).toHaveLength(1)        
        expect(deleteResponse.body.error).toBeDefined()
        expect(deleteResponse.body.error).toContain("Post not found, already deleted or you're forbidden to delete this post.")

      })

      test('User can edit their own comment', async () => {
        const initialCommentsInDb = await commentsInDb()

        const editCommentResponse = await api
          .put(`/api/posts/comment/${comment.id}`)
          .set('Authorization', `Bearer ${token2}`)
          .send({ comment: newComment2.comment })
          .expect(200)
        
        const finalCommentsInDb = await commentsInDb()

        expect(editCommentResponse.body).toBeDefined()
        expect(editCommentResponse.body.comment).toBe(newComment2.comment)
        expect(initialCommentsInDb).toHaveLength(1)
        expect(finalCommentsInDb).toHaveLength(1)

      })

      test('User can delete their own comment', async () => {
        const initialCommentsInDb = await commentsInDb()

        const deleteCommentResponse = await api
          .delete(`/api/posts/comment/${comment.id}`)
          .set('Authorization', `Bearer ${token2}`)
          .expect(204)
        
        const finalCommentsInDb = await commentsInDb()
        
        expect(initialCommentsInDb).toHaveLength(1)
        expect(finalCommentsInDb).toHaveLength(0)
        expect(deleteCommentResponse.body).toStrictEqual({})
        
      })

      test("User can't edit another user's comment", async () => {
        const editCommentResponse = await api
          .put(`/api/posts/comment/${comment.id}`)
          .set('Authorization', `Bearer ${newUserToken}`)
          .send({ comment: newComment2.comment })
          .expect(404)
        
        expect(editCommentResponse.body.error).toBeDefined()
        expect(editCommentResponse.body.error).toContain("Comment not found or you don't have permission to edit it" )

      })

      test("User can't delete another user's comment", async () => {
        const editCommentResponse = await api
          .delete(`/api/posts/comment/${comment.id}`)
          .set('Authorization', `Bearer ${newUserToken}`)
          .expect(410)
        
        expect(editCommentResponse.body.error).toContain("Comment not found, already deleted or you're forbidden to delete this comment.")

      })

    })
  })
})


afterAll(async () => {
  await Promise.all([
    User.deleteMany({}),
    Community.deleteMany({}),
    RefreshToken.deleteMany({}),
    Post.deleteMany({}),
    Comment.deleteMany({})
  ])
})