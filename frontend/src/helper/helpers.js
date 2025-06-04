
// even the subcategory and maincategory as helpers?

export const securityQuestions = [
  { 
    name: 'In what city were you born?',
    question: 'in-what-city-were-you-born'
  },
  { 
    name: 'What is the name of your favorite pet?',
    question: 'what-is-the-name-of-your-favorite-pet'
  },
  { 
    name: "What is your mother's maiden name?",
    question: 'what-is-your-mother-maiden-name'
  },
  { 
    name: 'What high school did you attend?',
    question: 'what-high-school-did-you-attend'
  },
  { 
    name: 'What was the name of your elementary school?',
    question: 'what-was-the-name-of-your-elementary-school'
  },
  { 
    name: 'What was your favorite food as a child?',
    question: 'what-was-your-favorite-food-as-a-child'
  },
  { 
    name: 'What year was your father (or mother) born',
    question: 'what-year-was-your-father-or-mother-born'
  },
]

export const validSubcategories = {
  'upcoming-event': [
      {
        name: 'Festivals and Celebrations',
        subCat: 'festivals-and-celebrations'
      },
      {
        name: 'Arts and Entertainment',
        subCat:  'arts-and-entertainment'
      }, 
      {
        name: 'Community and Social Events',
        subCat: 'community-and-social-events', 
      },
      {
        name: 'Sports and Outdoor Activities',
        subCat: 'sports-and-outdoor-activities', 
      },
      {
        name: 'Educational and Workshops',
        subCat: 'educational-and-workshops'
      },
      {
        name: 'Others',
        subCat: 'others'
      }],
  'announcement': [
    {
      name: 'Public Services and Utilities',
      subCat: 'public-services-and-utilities'
    }, 
    {
      name: 'Safety and Security',
      subCat: 'safety-and-security'
    },
    {
      name: 'Government and Civic Affairs',
      subCat: 'government-and-civic-affairs'
    },
    {
      name: 'Health and Social Services',
      subCat: 'health-and-social-services'
    },
    {
      name: 'Arts, Culture and Recreation',
      subCat: 'arts-culture-and-recreation'
    },
    {
      name: 'Business and Economy',
      subCat: 'business-and-economy'
    }, 
    {
      name: 'Others',
      subCat: 'others'
    }],
  'lost-and-found': [
    {
      name: 'Lost',
      subCat: 'lost'
    },
    {
      name: 'Found',
      subCat: 'found'
    }],
  'shops-promotion': [
    {
      name: 'Food',
      subCat: 'food'
    },
    {
      name: 'Clothing',
      subCat: 'clothing'
    },
    {
      name: 'Home Goods',
      subCat: 'home-goods'
    },
    {
      name: 'Services',
      subCat: 'services'
    },
    {
      name: 'Others',
      subCat: 'others'
    }],
  'garage-sale-and-giveaways': [
    {
      name: 'Sale',
      subCat: 'sale'
    },
    {
      name: 'Giveaways',
      subCat: 'giveaway' 
    }]
}

export const mainCategories = [
  {
    name: 'Home',
    category: 'home'
  },
  { 
    name: 'Announcement',
    category: 'announcement'
  }, 
  {
    name: 'Events',
    category: 'upcoming-event'
  }, 
  {
    name: 'Garage Sale & Giveaways',
    category: 'garage-sale-and-giveaways'
  }, 
  { 
    name: 'Shops Promo',
    category: 'shops-promotion'
  },
  {
    name: 'Lost and Found',
    category: 'lost-and-found'
  }
]