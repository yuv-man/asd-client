export const gameContent = {
  1: [
    {
      id: 'monkey',
      character: '🐵',
      name: 'Milo Monkey',
      question: 'What is your name?',
      audioText: 'Hi! I\'m Milo Monkey! What is your name?',
      expectedAnswer: ['my name is', 'i am', 'im'],
      hint: 'Tell me your name!',
      hintAudioText: 'Can you tell me your name? Say: My name is...',
      feedback: {
        good: 'Nice to meet you, friend! Milo is happy!',
        goodAudioText: 'Nice to meet you! Milo is so happy to be your friend!',
        try: 'Can you say "My name is..." or "I am..."?',
        tryAudioText: 'Let\'s try again! Say: My name is...'
      },
      points: 5
    },
    {
      id: 'dog',
      character: '🐶',
      name: 'Daisy Dog',
      question: 'How old are you?',
      audioText: 'Woof! I\'m Daisy Dog! How old are you?',
      expectedAnswer: ['four', '4', 'five', '5', 'four years', 'five years'],
      hint: 'How many years old are you?',
      hintAudioText: 'Tell me how many years old you are! Are you 4? Are you 5?',
      feedback: {
        good: 'Wow! You are growing so big!',
        goodAudioText: "Wow! You're growing so big! Good job telling me your age!",
        try: 'Can you tell me how old you are?',
        tryAudioText: 'Let\'s try again! How old are you? Are you 4? Are you 5?'
      },
      points: 5
    },
    {
      id: 'cat',
      character: '🐱',
      name: 'Coco Cat',
      question: 'What color do you like?',
      audioText: 'Meow! I\'m Coco Cat! What color do you like?',
      expectedAnswer: ['blue', 'red', 'green', 'yellow', 'purple', 'pink', 'orange', 'black', 'white', 'brown', 'i like'],
      hint: 'Tell me a color you like!',
      hintAudioText: 'Do you like blue? Or red? Or green? Tell me a color you like!',
      feedback: {
        good: 'That\'s a beautiful color!',
        goodAudioText: 'That\'s a beautiful color! Coco likes that color too!',
        try: 'Can you name a color you like?',
        tryAudioText: 'Let\'s try again! Tell me a color that you like. Like blue or red or green!'
      },
      points: 5
    },
    {
      id: 'rabbit',
      character: '🐰',
      name: 'Rosie Rabbit',
      question: 'Do you like carrots?',
      audioText: 'Hello! I\'m Rosie Rabbit! Do you like carrots?',
      expectedAnswer: ['yes', 'no', 'i like', 'i don\'t like', 'i do', 'i dont', 'i do not'],
      hint: 'Do you like carrots or not?',
      hintAudioText: 'Do you like carrots? You can say yes or no!',
      feedback: {
        good: 'Thank you for telling Rosie!',
        goodAudioText: 'Thank you for telling me! Rosie loves carrots!',
        try: 'Can you say "Yes" or "No" or "I like" or "I don\'t like"?',
        tryAudioText: 'Let\'s try again! Do you like carrots? Say yes or no!'
      },
      points: 5
    },
    {
      id: 'elephant',
      character: '🐘',
      name: 'Ellie Elephant',
      question: 'What is your favorite animal?',
      audioText: 'Hi there! I\'m Ellie Elephant! What is your favorite animal?',
      expectedAnswer: ['dog', 'cat', 'fish', 'bird', 'rabbit', 'bunny', 'elephant', 'monkey', 'tiger', 'lion', 'bear', 'favorite', 'like'],
      hint: 'Tell me which animal you like best!',
      hintAudioText: 'What animal do you like? Do you like dogs? Or cats? Tell me your favorite animal!',
      feedback: {
        good: 'That\'s a wonderful animal!',
        goodAudioText: 'That\'s a wonderful animal! I like that animal too!',
        try: 'Can you name an animal you like?',
        tryAudioText: 'Let\'s try again! Tell me an animal you like. Like dogs or cats or elephants!'
      },
      points: 5
    }
  ],
  
  2: [
    {
      id: 'monkey',
      character: '🐵',
      name: 'Milo Monkey',
      question: 'What is your favorite food and color?',
      audioText: 'Hi! I\'m Milo Monkey! Tell me your favorite food and color!',
      expectedAnswer: ['i like', 'my favorite', 'and'],
      hint: 'Tell me both your favorite food and color!',
      hintAudioText: 'Can you tell me what food you like and what color you like? For example: I like pizza and blue!',
      feedback: {
        good: 'Those are great choices! Milo loves those too!',
        goodAudioText: 'Those are wonderful choices! Milo thinks you have great taste!',
        try: 'Can you tell me both a food AND a color you like?',
        tryAudioText: 'Let\'s try again! Tell me a food you like and a color you like!'
      },
      points: 10
    },
    {
      id: 'dog',
      character: '🐶',
      name: 'Daisy Dog',
      question: 'What did you do today?',
      audioText: 'Woof! I\'m Daisy Dog! What did you do today?',
      expectedAnswer: ['i played', 'i went', 'i had', 'i was', 'today i'],
      hint: 'Tell me about your day!',
      hintAudioText: 'Tell me something you did today! Did you play? Did you go somewhere?',
      feedback: {
        good: 'That sounds like fun!',
        goodAudioText: 'That sounds like so much fun! Thank you for sharing!',
        try: 'Can you tell me something you did today?',
        tryAudioText: 'Let\'s try again! Tell me what you did today!'
      },
      points: 10
    }
  ],

  3: [
    {
      id: 'monkey',
      character: '🐵',
      name: 'Milo Monkey',
      question: 'If you could go anywhere, where would you go and why?',
      audioText: 'Hi! I\'m Milo Monkey! If you could go anywhere, where would you go and why?',
      expectedAnswer: ['i would go', 'i want to go', 'because', 'i would like'],
      hint: 'Tell me where you want to go and why!',
      hintAudioText: 'Where would you like to go? And tell me why! For example: I would go to the beach because I love swimming!',
      feedback: {
        good: 'That sounds like an amazing adventure!',
        goodAudioText: 'What a fantastic choice! That would be such an exciting adventure!',
        try: 'Can you tell me where you want to go AND why?',
        tryAudioText: 'Let\'s try again! Tell me where you would go and why you want to go there!'
      },
      points: 15
    },
    {
      id: 'dog',
      character: '🐶',
      name: 'Daisy Dog',
      question: 'What do you want to be when you grow up and why?',
      audioText: 'Woof! I\'m Daisy Dog! What do you want to be when you grow up and why?',
      expectedAnswer: ['i want to be', 'i would like to be', 'because', 'when i grow up'],
      hint: 'Tell me what job you want and why!',
      hintAudioText: 'What do you want to be when you grow up? And tell me why! For example: I want to be a teacher because I like helping others!',
      feedback: {
        good: 'That\'s a wonderful dream!',
        goodAudioText: 'That\'s such a wonderful dream! You would be great at that!',
        try: 'Can you tell me what you want to be AND why?',
        tryAudioText: 'Let\'s try again! Tell me what job you want when you grow up and why!'
      },
      points: 15
    }
  ]
};