import { v4 as uuidv4 } from 'uuid'

export const ratings = [
  {
    id: uuidv4(),
    rate: 5,
    description:
      'No other single syllable means as much to the science fiction genre, a single word that conjures images of sandworms, spice wars, great battles between rival dynastic families and a massively detailed and intricately crafted universe. No wonder this is widely regarded as not just a Science Fiction masterpiece, but a literary achievement as well.',
    bookId: 'c8176d86-896a-4c21-9219-6bb28cccaa5f', // Dune
    userId: '48e458c0-8b1e-4994-b85a-1e1cfcc9dd60', // Jaxson
  },
  {
    id: uuidv4(),
    rate: 5,
    description:
      'This is classic sci-fi that really deserves the label. What Frank Herbert accomplished in one novel is stunning because he built a fascinatingly detailed universe in which the politics, religion, economics, espionage, and military strategy are all equally important. He then blended these more grounded concepts with bigger sci-fi ideas like being able to use spice to see through space-time, and the scope of that encompasses trying to pick the proper path through various potential timelines as well as free will vs. fate.',
    bookId: 'c8176d86-896a-4c21-9219-6bb28cccaa5f', // Dune
    userId: 'c296c6c0-5c59-40dd-aa8a-ef2b015b7502', // Brandon
  },
  {
    id: uuidv4(),
    rate: 4,
    description:
      "I was surprised, sad and scared and excited in all the right places. I could picture so clearly all of the places like Bag End, Rivendell and Gollum's lake in my mind's eye and even found myself chuckling at Tolkien's little jokes in the writing. The stunning illustrations by Alan Lee in my edition made my journey there and back again that bit more magical! For someone who often struggles to enjoy fantasy, I absolutely adored this beautiful tale. I can genuinely say that I’m looking forward to continuing with the series!",
    bookId: '375948a7-bca3-4b59-9f97-bfcde036b4ca', // The Hobbit
    userId: 'c296c6c0-5c59-40dd-aa8a-ef2b015b7502', // Brandon
  },
  {
    id: uuidv4(),
    rate: 4,
    description:
      'To call this the epitome in which all high fantasy should be judged does not quite suffice; this is simply one of the best books that has ever been written or will ever be written. The Hobbit defines the high fantasy genre along with its sequel, of course, and has been an inspiration to countless authors and readers alike. Tolkien, quite literally, kick started a genre that would eventually capture the hearts of thousands of people. He changed the literary world. He made fantasy real.',
    bookId: '375948a7-bca3-4b59-9f97-bfcde036b4ca', // The Hobbit
    userId: '4383f783-6ce1-4f92-b1dd-7a7a693c4aef', // Lindsey
  },
  {
    id: uuidv4(),
    rate: 4,
    description:
      'Not much more needs to be said about The Hobbit than that it is excellent! Great storytelling, fun characters, humor, action – it has it all. Tolkien is rightfully one of the (if not THE) founding fathers of modern Fantasy. If you are already into the Fantasy genre and you haven’t read him, you need to. If you are looking to get into Fantasy, The Hobbit is a great place to start.',
    bookId: '375948a7-bca3-4b59-9f97-bfcde036b4ca', // The Hobbit
    userId: '48e458c0-8b1e-4994-b85a-1e1cfcc9dd60', // Jaxson
  },
  {
    id: uuidv4(),
    rate: 5,
    description:
      "In my experience, readers either love Adams' books or quickly put them down. I, for example, quite literally worship the words Adams puts on the page, and have read the Hitchhiker's Trilogy so many times that I have large tracts of it memorized. But both my wife and father couldn't get past book one: the former because she found it too silly, and the latter because he found the writing to be more about the author's personality than plot and character.",
    bookId: '86596503-369b-4614-bacf-11c9bb73e779', // The Hitchhiker's
    userId: 'c296c6c0-5c59-40dd-aa8a-ef2b015b7502', // Brandon
  },
  {
    id: uuidv4(),
    rate: 4,
    description:
      'Even before I was shown the meaning of life in a dream at 17 (then promptly forgot it because I thought I smelled pancakes), I knew this to be true--and yet, I have always felt a need to search for the truth, that nebulous, ill-treated creature. Adams has always been, to me, to be a welcome companion in that journey.',
    bookId: '86596503-369b-4614-bacf-11c9bb73e779', // The Hitchhiker's
    userId: 'vadsdeq1-ef47-4f3c-1c7e-39d8c40fa158', // Jack
  },
  {
    id: uuidv4(),
    rate: 4,
    description:
      "This was the book that started my love affair with the dystopian genre. And maybe indirectly influenced my decision to do a politics degree. I was only 12 years old when I first read it but I suddenly saw how politics could be taken and manipulated to tell one hell of a scary and convincing story. I'm a lot more well-read now but, back then, this was a game-changer. I started to think about things differently. I started to think about 2 + 2 = 5 and I wanted to read more books that explored the idea of control.",
    bookId: 'd0d70b05-d48f-4d83-b1e8-0b4dd984c97d', // 1984
    userId: '4383f783-6ce1-4f92-b1dd-7a7a693c4aef', // Lindsey
  },
  {
    id: uuidv4(),
    rate: 5,
    description:
      'Semper et sapien proin vitae nisi. Feugiat neque integer donec et aenean posuere amet ultrices. Cras fermentum id pulvinar varius leo a in. Amet libero pharetra nunc elementum fringilla velit ipsum. Sed vulputate massa velit nibh',
    bookId: '48b86ac2-014e-401d-bcbb-331ce5f4a457', // Siddartha
    userId: 'vadsdeq1-ef47-4f3c-1c7e-39d8c40fa158', // Jack
  },
  {
    id: uuidv4(),
    rate: 3,
    description:
      "If you want to understand Buddhism, start somewhere else, because you'd just have to unlearn all of Hesse's incorrect arguments and definitions. Happily, we have come a long way since Hesse's time, with experts and commentaries in many different languages available to the avid student. But, if you'd like to see someone try to explain the principles of Lutheranism using only misused Hindu terms, this may be the book for you.",
    bookId: '48b86ac2-014e-401d-bcbb-331ce5f4a457', // Siddartha
    userId: '7823dc61-e947-4f3c-1c7e-39d8c40fa158', // Lilly
  },
  {
    id: uuidv4(),
    rate: 2,
    description:
      "Sometimes truth isn't just stranger than fiction, it's also more interesting and better plotted. Salinger helped to pioneer a genre where fiction was deliberately less remarkable than reality. His protagonist says little, does little, and thinks little, and yet Salinger doesn't string Holden up as a satire of deluded self-obsessives, he is rather the epic archetype of the boring, yet self-important depressive.",
    bookId: 'e688c24f-d14d-4607-a12e-90e6e367398d', // The Catcher in the Rye
    userId: '7823dc61-e947-4f3c-1c7e-39d8c40fa158', // Lilly
  },
  {
    id: uuidv4(),
    rate: 5,
    description:
      "Holden Caulfield takes us to bourgeois America in the 1950s, from his college, where he just has been dismissed, to New York Central Station. Scrolling through friends, families, and acquaintances, and delivering us, by freeing ourselves, his wounds and joys, his loves and dislikes of people and things, of life, of his teenage life. But enough talk - 'Digression'!! (you will understand by reading it) - read on.",
    bookId: 'e688c24f-d14d-4607-a12e-90e6e367398d', // The Catcher in the Rye
    userId: '349vrtq1-ef32-4f3c-3o7l-67d8c40fa158', // Daniel
  },
  {
    id: uuidv4(),
    rate: 4,
    description:
      'There are some areas in this book that we might question the actions of Holden, especially if we reread this book after we have grown up. But still, I think that this is one of the best coming of age novels I was lucky enough to read in my life.',
    bookId: 'e688c24f-d14d-4607-a12e-90e6e367398d', // The Catcher in the Rye
    userId: '4383f783-6ce1-4f92-b1dd-7a7a693c4aef', // Lindsey
  },
  {
    id: uuidv4(),
    rate: 3,
    description:
      'This short novel is an opportunity to take stock of the knowledge of the time about space and the moon. Of course, from our point of view, some issues seem very naive: the presence of selenites, gravity "reversing" on the way between the two stars, and an astronaut opening the cabin window to throw garbage … But we must, however, keep in mind the utterly novel idea of 1869 of the very idea of such an expedition, not to mention its disturbing similarity with specific Apollo missions that took place a century after exactly.',
    bookId: '0440ad7d-230e-4573-b455-84ca38b5d339', // Journey to the Center of the Earth
    userId: '7823dc61-e947-4f3c-1c7e-39d8c40fa158', // Lilly
  },
  {
    id: uuidv4(),
    rate: 4,
    description:
      "I'm not easily scared these days. As a grown woman, the only thing that brings the feeling of dread into my heart is the constant pinging of new work emails requiring my attention when I'm at home, but there was a time when I was a shy, delicate, sweet little girl who was scared of my own shadow.",
    bookId: '14f410df-b28a-4e72-b1b4-363e26e160dd', // It: A Novel
    userId: '7823dc61-e947-4f3c-1c7e-39d8c40fa158', // Lilly
  },
  {
    id: uuidv4(),
    rate: 5,
    description:
      'This is a huge book, but if you consider to read it, it is definitely worth your time. Of course, it is very well written with a lot of description, which was sometimes hard to go through, but it didn’t ruin the experience. The story itself is layered and complex and everything happens for a reason and that is very important for a book like this to have that. It is definitely an interesting and captivating story.',
    bookId: '14f410df-b28a-4e72-b1b4-363e26e160dd', // It: A Novel
    userId: '4383f783-6ce1-4f92-b1dd-7a7a693c4aef', // Lindsey
  },
  {
    id: uuidv4(),
    rate: 5,
    description:
      "My original review was a comparison of sorts between Harry Potter and Twilight. However, this is stupid as the two are incomparable. Honestly, its not even worth discussing. Its not just that Twilight doesn't come close, it is the fact that Harry Potter transcends other similar works. Its peerless.",
    bookId: 'd2870ad0-3312-4ac2-af9f-76af6565587d', // Harry Potter and the Philosopher's Stone
    userId: '7823dc61-e947-4f3c-1c7e-39d8c40fa158', // Lilly
  },
  {
    id: uuidv4(),
    rate: 5,
    description:
      'So I read the newest editions of the books that I’m going to collect. I have so many different collections I’ll probably add later. In these new books I actually love the art on all the pages instead of the interactive stuff. I put together a collage of a couple pages.',
    bookId: 'd2870ad0-3312-4ac2-af9f-76af6565587d', // Harry Potter and the Philosopher's Stone
    userId: '4383f783-6ce1-4f92-b1dd-7a7a693c4aef', // Lindsey
  },
  {
    id: uuidv4(),
    rate: 5,
    description:
      "As wonderful and magical as promised. Because I didn't remember the movie, the third act of the book was a delightful surprise to me. I wish I'd had this book when I was a kid, because the idea that someone could be special without knowing it, and then get to visit a special world where the things that made him different were the same things that made him awesome would have been really inspiring to me.",
    bookId: 'd2870ad0-3312-4ac2-af9f-76af6565587d', // Harry Potter and the Philosopher's Stone
    userId: 'vadsdeq1-ef47-4f3c-1c7e-39d8c40fa158', // Jack
  },
  {
    id: uuidv4(),
    rate: 4,
    description:
      "One of the many cornerstones of King's early career was, is, love of the American automobile, and Christine brings together a lot of his early themes - youth, coming of age, cars, friendship and horror! Even after re-reading this classic possessed car story, it is still one of my least favourite King novels. It's still a great tale, but not one that I'll revisit much, if ever again, unlike a lot of his better works. In getting a 7 out of 12 from me, it is far from being my lowest rated King - I just don't care about anyone in this book!",
    bookId: '4fd2b389-b211-40b5-9797-f78cbb985645', // Christine
    userId: 'vadsdeq1-ef47-4f3c-1c7e-39d8c40fa158', // Jack
  },
  {
    id: uuidv4(),
    rate: 5,
    description:
      'Tara’s process of self-discovery is beautifully captured in Educated. It’s the kind of book that I think everyone will enjoy, no matter what genre you usually pick up. She’s a talented writer, and I suspect this book isn’t the last we’ll hear from her. I can’t wait to see what she does next.',
    bookId: '6de9f6b8-5ff4-4e06-b9f4-843eca462803', // Educated: A Memoir
    userId: 'c296c6c0-5c59-40dd-aa8a-ef2b015b7502', // Brandon
  },
  {
    id: uuidv4(),
    rate: 4,
    description:
      'This book does a great job of laying down the framework of how habits are formed, and shares insightful strategies for building good habits and breaking bad ones. Even though I was already familiar with research behind habit formation, reading through this book helped me approach habits I’m trying to adopt or break in my own life from different angles.',
    bookId: 'd0590f9a-dd89-42fd-9bbb-bf26c2e4dcf9', // Atomic Habits
    userId: '319vtbq1-ef32-4f3c-1c7e-39d8c40fa158', // Petter
  },
  {
    id: uuidv4(),
    rate: 5,
    description:
      "I'm a little horrified at myself for not having this book up before now. We had a discussion about it in class today, and I had to write this as soon it was over. I wish there were more stars to give The Outsiders, but five will have to do. I love this book, and have loved it faithfully since I read it in sixth grade - I must have read it a dozen times, and possibly more. I can quote long sections of the book. I was obsessed, and to some degree still am.",
    bookId: '1d5cdbdc-b90f-40d5-8fe9-d4923ae12dbd', // The Outsiders
    userId: '48e458c0-8b1e-4994-b85a-1e1cfcc9dd60', // Jaxson
  },
  {
    id: uuidv4(),
    rate: 4,
    description:
      'One thing that you can believe is, when your elders say that you don’t stay the same, they are correct. They mean that you change the way you think, the way you do things, the way that you look upon the world. I’ve heard this said so many times that I can dream about it. In other words, I used to adore this book. And I thought Ponyboy was adorable. Of course, I was twelve-years old and had different standards for adoration (maybe). I have to confess, though, I wasn’t confused like him. I thought that he should snitch.',
    bookId: '1d5cdbdc-b90f-40d5-8fe9-d4923ae12dbd', // The Outsiders
    userId: 'c296c6c0-5c59-40dd-aa8a-ef2b015b7502', // Brandon
  },
  {
    id: uuidv4(),
    rate: 4,
    description:
      "First off, I'm a heavy duty fan of GRRM. I've read over a 100 different fantasy authors in my time. Took about 5 years off from the genre b/c I felt it was all getting too formulaic and cliched. So, when I came back to fantasy I read the usual: Goodkind, Jordan, etc. and then someone told me about GRRM and man, that was the kicker!",
    bookId: '404e47f8-da53-44fd-ab53-37ed171c3a9f', // A Game of Thrones
    userId: '48e458c0-8b1e-4994-b85a-1e1cfcc9dd60', // Jaxson
  },
  {
    id: uuidv4(),
    rate: 5,
    description:
      'So glad I reread this! I loved it even more this time and it just reaffirmed that this is my favorite series!',
    bookId: '4fd2b389-b211-40b5-9797-f78cbb985645', // A Game of Thrones
    userId: '349vrtq1-ef32-4f3c-3o7l-67d8c40fa158', // Daniel
  },
  {
    id: uuidv4(),
    rate: 5,
    description:
      'Nowadays, it seems like every horror movie is either a remake, a sequel or the kind of vile torture porn that makes you want to puke in your bag of popcorn. Filming one of these flicks requires tens of millions of dollars for a platoon of pretty actors, gallons of fake blood, special effects and a marketing campaign. Oddly, they don’t seem to spend any money on scripts for these things.',
    bookId: '66cb0f47-7e20-4492-b640-9c020fcae6f2', // Psycho: A Novel
    userId: '48e458c0-8b1e-4994-b85a-1e1cfcc9dd60', // Jaxson
  },
  {
    id: uuidv4(),
    rate: 5,
    description:
      "I would give this book to every teenage boy and girl I knew. While Charlie isn't exactly a excellent role model, he does show that being different is O.K. and that friends come in all kinds of packages...to stay true to yourself. These things matter.",
    bookId: '43de0g44-1e50-7891-e640-9v340fwdr6f2', // The Perks of Being a Wallflower
    userId: '6624df61-5947-4f8c-9c7e-39c8c40fa158', // Jaylon
  },
  {
    id: uuidv4(),
    rate: 4,
    description:
      "I don't even think I can truly convey how much I loved this book other than to say it was entirely life changing and I'm so upset it took me this long to read it.",
    bookId: '43de0g44-1e50-7891-e640-9v340fwdr6f2', // The Perks of Being a Wallflower
    userId: '319vtbq1-ef32-4f3c-1c7e-39d8c40fa158', // Petter
  },
  {
    id: uuidv4(),
    rate: 5,
    description:
      "What a fantastic book. I can see why everyone from Bill Gates to Barack Obama was raving about it. It's an extremely compelling, accessible history - almost like a novelization - of humankind.",
    bookId: '88fb0f27-6w20-4592-b640-9d020fvgh6f2', // Sapiens
    userId: '6624df61-5947-4f8c-9c7e-39c8c40fa158', // Jaylon
  },
  {
    id: uuidv4(),
    rate: 4,
    description:
      'Take My Hand is a gem of a read! It reminds us just how important it is for these stories to be told, for them to be heard, to be acknowledged and remembered and to care; that feels crucial right now. This is why I read the books I do!',
    bookId: '67cb0f47-9e50-4492-b640-9c020fcae6f2', // Take my Hand
    userId: '456adeq1-ef32-4f3c-1c7e-39d8c40fa158', // Rute
  },
  {
    id: uuidv4(),
    rate: 5,
    description:
      "I'll give this 5* with no begrudging. I'm pretty easy with my 5*, they're not reserved for the best book I've ever read, just very good books. I thought The Name of the Wind was very good. I read it in what for me was a very short span of time - it had that 'more-ish' quality that best sellers need.",
    bookId: '61cb0f47-9e50-4492-b640-9c020fcae6r2', // The Name of the Wind
    userId: '6624df61-5947-4f8c-9c7e-39c8c40fa158', // Jaylon
  },
  {
    id: uuidv4(),
    rate: 5,
    description:
      'When I began reading this, I did so with a yawn. It initially appeared quite basic and completely uninspiring. I almost stopped reading after twenty five pages, shocking I know. If I did that it would have been a massive mistake because this is one of the best fantasy novels published in the last twenty years. Those first few pages did nothing to encourage me, but as soon as I realised that this is, essentially, a story about a story, I was hooked of Rothfuss’ magic.',
    bookId: '61cb0f47-9e50-4492-b640-9c020fcae6r2', // The Name of the Wind
    userId: '456adeq1-ef32-4f3c-1c7e-39d8c40fa158', // Rute
  },
  {
    id: uuidv4(),
    rate: 4,
    description:
      'One of my favorite things in the book was the character interaction. There are some really odd characters here along with the stereotypical good and bad guys. I saw many comparisons from other reviewers to Harry Potter and I could definitely see some Harry vs Draco vs Snape type action going on here. Those were probably my favorite parts of the book.',
    bookId: '61cb0f47-9e50-4492-b640-9c020fcae6r2', // The Name of the Wind
    userId: '319vtbq1-ef32-4f3c-1c7e-39d8c40fa158', // Petter
  },
  {
    id: uuidv4(),
    rate: 4,
    description:
      "I understand why many people hate this book. Catherine and Heathcliff are monstrous. Monstrous. You won't like them because they are unlikable. They are irrational, self-absorbed, malicious and pretty much any negative quality you can think a person is capable of possessing without imploding. They seek and destroy and act with no thought to consequence. And I find it fascinating that Emily Bronte chose them to be her central protagonists.",
    bookId: '21cb0f47-3l40-4492-b640-9c020fcae6r2', // Wuthering Heights
    userId: '349vrtq1-ef32-4f3c-3o7l-67d8c40fa158', // Daniel
  },
  {
    id: uuidv4(),
    rate: 3,
    description:
      'Inside me, there are two wolves. (I am saying there are two wolves in order to reference the meme, but what would be more accurate is to say that inside of me there are two boring and nonviolent creatures. Like a pigeon. Or an accountant.)',
    bookId: '21cb0f47-3l40-4492-b640-9c020fcae6r2', // Wuthering Heights
    userId: '319vtbq1-ef32-4f3c-1c7e-39d8c40fa158', // Petter
  },
  {
    id: uuidv4(),
    rate: 4,
    description:
      "This is one of those books that can be life-changing. I read this as a teenager and I remember exactly where I was (sitting on my bed, in my grandmother's house, in southern Germany) when I finished it. I must have spent an hour just staring out the window, in awe of the lives I'd just led, the experiences I'd just had.",
    bookId: '55gg5f44-3l40-4492-b640-9c020fcae6r2', // War and Peace
    userId: '349vrtq1-ef32-4f3c-3o7l-67d8c40fa158', // Daniel
  },
  {
    id: uuidv4(),
    rate: 5,
    description:
      "A fantastic novel I would recommend to everyone. As a second generation Vietnamese American living in the United States, I have felt so inspired by Lee's book to think about my family's many sacrifices coming to the United States, as well as the ways I have coped with and adapted to various forms of racism and colonization. I am excited to see what other reads 2018 brings, and I already know Pachinko will stand as one of my favorites.",
    bookId: '90rt0f34-6g5h-4492-b640-9c020fcae6r2', // Pachinko
    userId: '456adeq1-ef32-4f3c-1c7e-39d8c40fa158', // Rute
  },
]
