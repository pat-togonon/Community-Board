const { userRegistrationSchema, loginSchema, updatePasswordSchema, passwordResetSchema } = require('../../validators/auth')
const { communityRegistrationSchema } = require('../../validators/community')
const { newPostSchema, editedPostSchema} = require('../../validators/content')
const { addToFavoritesSchema, updateNameSchema } = require('../../validators/user')
const { newCommentSchema, editCommentSchema } = require('../../validators/comment')

describe ('User registration schema zod validation', () => {
  it('should pass with valid user registration inputs', () => {
    const input = {
      username: 'tricia12',
      email: 'tricia12@gmail.com',
      password: 'secret124',
      communityId: '123456789123123456789874',
      birthYear: 1994,
      chosenSecurityQuestion: 'example-question-here',
      securityAnswer: 'example-answer-here'    
    }

    const result = userRegistrationSchema.safeParse(input)
    expect(result.success).toBe(true)
  })

  it('should fail with incomplete user registration inputs', () => {
    const input = {
      username: 'tricia12',
      email: 'tricia12@gmail.com',
      password: 'secret124',
      communityId: '123456789123123456789874',
      birthYear: 1994, 
    }

    const result = userRegistrationSchema.safeParse(input)
    expect(result.success).toBe(false)
    expect(result.error.issues[0].path).toContain('chosenSecurityQuestion')
    expect(result.error.issues[1].path).toContain('securityAnswer')
  })

  it('should fail when community Id is invalid', () => {
    const input = {
      username: 'tricia12',
      email: 'tricia12@gmail.com',
      password: 'secret124',
      communityId: '12345678912312345678987', // Valid 24 characters 
      birthYear: 2010,
      chosenSecurityQuestion: 'example-question-here',
      securityAnswer: 'example-answer-here'    
    }

    const result = userRegistrationSchema.safeParse(input)
    expect(result.success).toBe(false)
    expect(result.error.issues[0].path).toContain('communityId')
    
  })

  it('should fail if users include additional inputs', () => {
    const input = {
      username: 'tricia12',
      email: 'tricia12@gmail.com',
      password: 'secret124',
      communityId: '123456789123123456789871',
      birthYear: 2010,
      chosenSecurityQuestion: 'example-question-here',
      securityAnswer: 'example-answer-here',
      color: 'red'    
    }

    const result = userRegistrationSchema.safeParse(input)
    expect(result.success).toBe(false)
    expect(result.error.issues[0].keys).toContain('color')

  })
})

describe('User login schema zod validation', () => {
  it('should pass with valid user inputs', () => {
    const input = {
      username: 'tricia12',
      password: 'secret124',
      communityId: '123456789123123456789871'
    }

    const result = loginSchema.safeParse(input)
    expect(result.success).toBe(true)
  })

  it('should fail with incomplete user inputs', () => {
    const input = {
      username: 'tricia12',
      communityId: '123456789123123456789871'
    }

    const result = loginSchema.safeParse(input)
    expect(result.success).toBe(false)
    expect(result.error.issues[0].path).toContain('password')
  })

  it('should fail if user input has additional fields', () => {
    const input = {
      username: 'tricia12',
      password: 'secret124',
      communityId: '123456789123123456789871',
      color: 'red'
    }

    const result = loginSchema.safeParse(input)
    expect(result.success).toBe(false)
    expect(result.error.issues[0].keys).toContain('color')
  })

})

describe('User password update zod validation', () => {
  it('should pass with valid user inputs', () => {
    const input = {
      oldPassword: 'secret124',
      newPassword: 'secret125',
    }

    const result = updatePasswordSchema.safeParse(input)
    expect(result.success).toBe(true)
  })

  it('should fail with invalid user inputs', () => {
    const input = {
      oldPassword: 'secret124',
      newPassword: 'secr', //doesn't meet the min character length
    }

    const result = updatePasswordSchema.safeParse(input)
    expect(result.success).toBe(false)
    expect(result.error.issues[0].path).toContain('newPassword')
    
  })

  it('should fail if user sends in an additional field', () => {
    const input = {
      oldPassword: 'secret124',
      newPassword: 'secret125',
      color: 'red'
    }

    const result = updatePasswordSchema.safeParse(input)
    expect(result.success).toBe(false)
    expect(result.error.issues[0].keys).toContain('color')
  })
})

describe('User password reset zod validation', () => {
  it('should pass with valid user inputs', () => {
    const input = {
      username: 'tricia12',
      newPassword: 'secret125',
      securityQuestion: 'example-question-here',
      securityAnswer: 'example-answer-here'    
    }

    const result = passwordResetSchema.safeParse(input)
    expect(result.success).toBe(true)
  })

  it('should fail with incomplete user inputs', () => {
    const input = {
      username: 'tricia12',
      newPassword: 'secret125',
      securityAnswer: 'example-answer-here'    
    }

    const result = passwordResetSchema.safeParse(input)
    expect(result.success).toBe(false)
    expect(result.error.issues[0].path).toContain('securityQuestion')
  })

  it('should fail if user includes additional fields', () => {
    const input = {
      username: 'tricia12',
      newPassword: 'secret125',
      securityQuestion: 'example-question-here',
      securityAnswer: 'example-answer-here',
      color: 'red'    
    }

    const result = passwordResetSchema.safeParse(input)
    expect(result.success).toBe(false)
    expect(result.error.issues[0].keys).toContain('color')
  })

  it('should fail with invalid password character length', () => {
    const input = {
      username: 'tricia12',
      newPassword: 'secr',
      securityQuestion: 'example-question-here',
      securityAnswer: 'example-answer-here'  
    }

    const result = passwordResetSchema.safeParse(input)
    expect(result.success).toBe(false)
    expect(result.error.issues[0].path).toContain('newPassword')
  })
})

describe('Community registration schema zod validation', () => {
  it('should pass with valid user inputs', () => {
    const input = {
      communityName: 'Growth City',
      communityDescription: 'The community for people with growth mindset',
      username: 'tricia12',
      email: 'tricia12@gmail.com',
      password: 'secret124',
      birthYear: 1994,
      chosenSecurityQuestion: 'example-question-here',
      securityAnswer: 'example-answer-here'    
    }

    const result = communityRegistrationSchema.safeParse(input)
    expect(result.success).toBe(true)
  })

  it('should fail with incomplete user inputs', () => {
    const input = {
      communityName: 'Growth City',
      communityDescription: 'The community for people with growth mindset',
      email: 'tricia12@gmail.com',
      password: 'secret124',
      birthYear: 1994,
      chosenSecurityQuestion: 'example-question-here',
      securityAnswer: 'example-answer-here'    
    }

    const result = communityRegistrationSchema.safeParse(input)
    expect(result.success).toBe(false)
    expect(result.error.issues[0].path).toContain('username')
  })

  it('should fail with additional user inputs', () => {
    const input = {
      communityName: 'Growth City',
      communityDescription: 'The community for people with growth mindset',
      username: 'tricia12',
      email: 'tricia12@gmail.com',
      password: 'secret124',
      birthYear: 1994,
      chosenSecurityQuestion: 'example-question-here',
      securityAnswer: 'example-answer-here',
      color: 'red' 
    }
    
    const result = communityRegistrationSchema.safeParse(input)
    expect(result.success).toBe(false)
    expect(result.error.issues[0].keys).toContain('color')
  })
})

describe('User posts schema zod validation tests', () => {
  it('users should be able to create new posts with valid inputs', () => {
    const input = {
      communityId: '123456789123123456789871',
      mainCategory: 'main-category-here',
      subCategory: 'subCategory-here',
      title: 'title here okay',
      description: 'description here also okay',
      author: '233435678912312345678987',
      startDate: new Date().toISOString(),
      endDate: new Date("2040-06-05").toISOString()
    }

    const result = newPostSchema.safeParse(input)
    expect(result.success).toBe(true)
  })

  it("users can't create posts with incomplete required inputs", () => {
    const input = {
      communityId: '123456789123123456789871',
      mainCategory: 'main-category-here',
      subCategory: 'subCategory-here',
      description: 'description here also okay',
      author: '233435678912312345678987',
      startDate: new Date().toISOString(),
      endDate: new Date("2040-06-05").toISOString()
    }

    const result = newPostSchema.safeParse(input)
    expect(result.success).toBe(false)
    expect(result.error.issues[0].path).toContain('title')
  })

  it('users should be able to create new posts even without dates', () => {
    const input = {
      communityId: '123456789123123456789871',
      mainCategory: 'main-category-here',
      subCategory: 'subCategory-here',
      title: 'title here okay',
      description: 'description here also okay',
      author: '233435678912312345678987'
    }

    const result = newPostSchema.safeParse(input)
    expect(result.success).toBe(true)
  })

  it("users can't create posts with end date earlier than start date", () => {
    const input = {
      communityId: '123456789123123456789871',
      mainCategory: 'main-category-here',
      subCategory: 'subCategory-here',
      title: 'title here okay',
      description: 'description here also okay',
      author: '233435678912312345678987',
      startDate: new Date().toISOString(),
      endDate: new Date("2025-02-05").toISOString()
    }

    const result = newPostSchema.safeParse(input)
    expect(result.success).toBe(false)
    expect(result.error.issues[0].path).toContain('endDate')
    
  })

  it('users can create new posts even without start date', () => {
    const input = {
      communityId: '123456789123123456789871',
      mainCategory: 'main-category-here',
      subCategory: 'subCategory-here',
      title: 'title here okay',
      description: 'description here also okay',
      author: '233435678912312345678987',
      endDate: new Date("2040-06-05").toISOString()
    }

    const result = newPostSchema.safeParse(input)
    expect(result.success).toBe(true)    
  })

  it("users can't create new posts with additional inputs", () => {
    const input = {
      communityId: '123456789123123456789871',
      mainCategory: 'main-category-here',
      subCategory: 'subCategory-here',
      title: 'title here okay',
      description: 'description here also okay',
      author: '233435678912312345678987',
      startDate: new Date().toISOString(),
      endDate: new Date("2040-06-05").toISOString(),
      color: 'red'
    }

    const result = newPostSchema.safeParse(input)
    expect(result.success).toBe(false)
    expect(result.error.issues[0].keys).toContain('color')
  })

  it('users can update or edit their posts with valid inputs', () => {
    const input = {
      description: 'new and updated description here',
      isFound: true
    }

    const result = editedPostSchema.safeParse(input)
    expect(result.success).toBe(true)
  })

  it('users can update or edit their posts even without optional inputs', () => {
    const input = {
      description: 'new and updated description here'
    }

    const input2 = {
      isFound: true
    }

    const result = editedPostSchema.safeParse(input)
    expect(result.success).toBe(true)

    const result2 = editedPostSchema.safeParse(input2)
    expect(result2.success).toBe(true)

  })

  it("users can't update posts with additional fields", () => {
    const input = {
      description: 'new and updated description here',
      color: 'red'
    }

    const result = editedPostSchema.safeParse(input)
    expect(result.success).toBe(false)
    expect(result.error.issues[0].keys).toContain('color')

  })
})

describe('Adding posts to favorites', () => {
  it('users can add posts to favorites with valid inputs', () => {
    const input = {
      postId: '123456789123123456456789'
    }

    const result = addToFavoritesSchema.safeParse(input)
    expect(result.success).toBe(true)
  })

  it("users can't add posts to favorites with invalid or additional inputs", () => {
    const input = {
      postId: '12345678912312345645678' //post id is 24 char long
    }

    const input2 = {
      postId: '123456789123123456456781',
      color: 'red'
    }

    const result = addToFavoritesSchema.safeParse(input)
    expect(result.success).toBe(false)
    expect(result.error.issues[0].path).toContain('postId')

    const result2 = addToFavoritesSchema.safeParse(input2)
    expect(result2.success).toBe(false)
    expect(result2.error.issues[0].keys).toContain('color')
  })
})

describe('Updating the names of users', () => {
  it('users can update their name with valid inputs', () => {
    const input = {
      name: 'Tricia'
    }

    const result = updateNameSchema.safeParse(input)
    expect(result.success).toBe(true)
  })

  it("users can't update their name with invalid or additional inputs", () => {
    const input = {
      name: 'Tr'
    }

    const input2 = {
      name: 'Tricia',
      color: 'red'
    }

    const result = updateNameSchema.safeParse(input)
    expect(result.success).toBe(false)
    expect(result.error.issues[0].path).toContain('name')

    const result2 = updateNameSchema.safeParse(input2)
    expect(result2.success).toBe(false)
    expect(result2.error.issues[0].keys).toContain('color')
  })
})

describe('Comments on posts', () => {
  it('users can comment on posts with valid inputs', () => {
    const input = {
      comment: "Hiiiiii!!",
      parentComment: null
    }

    const result = newCommentSchema.safeParse(input)
    expect(result.success).toBe(true)
  })

  it("users can't comment on posts with invalid inputs", () => {
    const input = {
      comment: "Hi",
      parentComment: null
    }

    const result = newCommentSchema.safeParse(input)
    expect(result.success).toBe(false)
    expect(result.error.issues[0].path).toContain('comment')
    expect(result.error.issues[0].message).toBe('Comments must have at least 3 characters')
  })

  it("users can't comment on posts with additional inputs", () => {
    const input = {
      comment: "Hi!",
      parentComment: null,
      color: 'red'
    }

    const result = newCommentSchema.safeParse(input)
    expect(result.success).toBe(false)
    expect(result.error.issues[0].keys).toContain('color')
  })

  it('users can edit comment on posts with valid inputs', () => {
    const input = {
      comment: "Hi! Edited version"
    }

    const result = editCommentSchema.safeParse(input)
    expect(result.success).toBe(true)
    
  })

  it("users can't edit comment on posts with additional inputs", () => {
    const input = {
      comment: "Hi! Edited version",
      color: 'red'
    }

    const result = editCommentSchema.safeParse(input)
    expect(result.success).toBe(false)
    expect(result.error.issues[0].keys).toContain('color')
    
  })
})