// Normalization data (grouped catch-all variations)
// Maps user input variations to the official movie title
// IMPORTANT: Individual movies only - Carrie (1976) ≠ Carrie (2013), Spider-Man (2002) ≠ The Amazing Spider-Man (2012)
export const moviesNormalization = {
  // Challenge movies - common variations
  "Back to the Future": [
    "BTTF",
    "Back to Future"
  ],

  "A Quiet Place": [
    "Quiet Place"
  ],

  "Fight Club": [
    "The Fight Club"
  ],

  "Finding Nemo": [
    "Nemo"
  ],

  "The Martian": [
    "Martian"
  ],

  "When Harry Met Sally": [
    "When Harry Met Sally..."
  ],

  // Spider-Man Movies - INDIVIDUAL FILMS with specific actors/years
  "Spider-Man": [ // 2002 Tobey Maguire
    "Spiderman",
    "Spider Man",
    "Spider-Man 1",
    "Tobey Maguire Spider-Man"
  ],

  "Spider-Man 2": [ // 2004 Tobey Maguire
    "Spiderman 2",
    "Spider Man 2"
  ],

  "Spider-Man 3": [ // 2007 Tobey Maguire
    "Spiderman 3",
    "Spider Man 3"
  ],

  "The Amazing Spider-Man": [ // 2012 Andrew Garfield
    "Amazing Spiderman",
    "Amazing Spider Man",
    "TASM",
    "Andrew Garfield Spider-Man"
  ],

  "The Amazing Spider-Man 2": [ // 2014 Andrew Garfield
    "Amazing Spiderman 2",
    "Amazing Spider Man 2",
    "TASM 2"
  ],

  "Spider-Man: Homecoming": [ // 2017 Tom Holland
    "Spiderman Homecoming",
    "Spider Man Homecoming",
    "Tom Holland Spider-Man"
  ],

  "Spider-Man: Far From Home": [ // 2019 Tom Holland
    "Spiderman Far From Home",
    "Spider Man Far From Home"
  ],

  "Spider-Man: No Way Home": [ // 2021 Tom Holland
    "Spiderman No Way Home",
    "Spider Man No Way Home"
  ],

  // Batman Movies - INDIVIDUAL FILMS with specific actors/years
  "Batman": [ // 1989 Michael Keaton
    "Batman 1989",
    "Tim Burton Batman",
    "Michael Keaton Batman"
  ],

  "Batman Returns": [ // 1992 Michael Keaton
    "Batman 2"
  ],

  "Batman Forever": [ // 1995 Val Kilmer
    "Batman 3",
    "Val Kilmer Batman"
  ],

  "Batman & Robin": [ // 1997 George Clooney
    "Batman and Robin",
    "Batman 4",
    "George Clooney Batman"
  ],

  "Batman Begins": [ // 2005 Christian Bale
    "Christian Bale Batman"
  ],

  "The Dark Knight": [ // 2008 Christian Bale
    "Dark Knight",
    "TDK"
  ],

  "The Dark Knight Rises": [ // 2012 Christian Bale
    "Dark Knight Rises",
    "TDKR"
  ],

  "Batman v Superman: Dawn of Justice": [ // 2016 Ben Affleck
    "Batman vs Superman",
    "BvS",
    "Dawn of Justice"
  ],

  "The Batman": [ // 2022 Robert Pattinson
    "Batman 2022",
    "Robert Pattinson Batman"
  ],

  // Superman Movies - INDIVIDUAL FILMS
  "Superman": [ // 1978 Christopher Reeve
    "Superman 1978",
    "Superman 1",
    "Christopher Reeve Superman"
  ],

  "Superman II": [ // 1980 Christopher Reeve
    "Superman 2"
  ],

  "Superman III": [ // 1983 Christopher Reeve
    "Superman 3"
  ],

  "Superman IV: The Quest for Peace": [ // 1987 Christopher Reeve
    "Superman 4",
    "Quest for Peace"
  ],

  "Superman Returns": [ // 2006 Brandon Routh
    "Brandon Routh Superman"
  ],

  "Man of Steel": [ // 2013 Henry Cavill
    "Henry Cavill Superman"
  ],

  // Star Wars - Original Trilogy
  "Star Wars": [ // 1977
    "A New Hope",
    "Star Wars: A New Hope",
    "Star Wars Episode IV"
  ],

  "The Empire Strikes Back": [ // 1980
    "Empire Strikes Back",
    "Star Wars Episode V"
  ],

  "Return of the Jedi": [ // 1983
    "Star Wars Episode VI"
  ],

  // Marvel Cinematic Universe - INDIVIDUAL FILMS
  "Iron Man": [ // 2008
    "Iron Man 1"
  ],

  "Iron Man 2": [ // 2010
    "Ironman 2"
  ],

  "Iron Man 3": [ // 2013
    "Ironman 3"
  ],

  "The Incredible Hulk": [ // 2008
    "Incredible Hulk",
    "Hulk 2008"
  ],

  "Thor": [ // 2011
    "Thor 1"
  ],

  "Thor: The Dark World": [ // 2013
    "Thor 2",
    "Dark World"
  ],

  "Thor: Ragnarok": [ // 2017
    "Thor 3",
    "Ragnarok"
  ],

  "Thor: Love and Thunder": [ // 2022
    "Thor 4",
    "Love and Thunder"
  ],

  "Captain America: The First Avenger": [ // 2011
    "Captain America 1",
    "First Avenger"
  ],

  "Captain America: The Winter Soldier": [ // 2014
    "Captain America 2",
    "Winter Soldier"
  ],

  "Captain America: Civil War": [ // 2016
    "Captain America 3",
    "Civil War"
  ],

  "The Avengers": [ // 2012
    "Avengers",
    "Avengers 1"
  ],

  "Avengers: Age of Ultron": [ // 2015
    "Avengers 2",
    "Age of Ultron"
  ],

  "Avengers: Infinity War": [ // 2018
    "Avengers 3",
    "Infinity War"
  ],

  "Avengers: Endgame": [ // 2019
    "Avengers 4",
    "Endgame"
  ],

  "Guardians of the Galaxy": [ // 2014
    "GOTG",
    "Guardians 1"
  ],

  "Guardians of the Galaxy Vol. 2": [ // 2017
    "GOTG 2",
    "Guardians 2"
  ],

  "Guardians of the Galaxy Vol. 3": [ // 2023
    "GOTG 3",
    "Guardians 3"
  ],

  "Ant-Man": [ // 2015
    "Antman"
  ],

  "Ant-Man and the Wasp": [ // 2018
    "Antman and the Wasp"
  ],

  "Doctor Strange": [ // 2016
    "Dr Strange"
  ],

  // Horror Movies - INDIVIDUAL FILMS by year/director
  "Halloween": [ // 1978 John Carpenter
    "Halloween 1978",
    "John Carpenter Halloween"
  ],

  "Halloween": [ // 2018 David Gordon Green
    "Halloween 2018"
  ],

  "Friday the 13th": [ // 1980
    "Friday the 13th 1980"
  ],

  "A Nightmare on Elm Street": [ // 1984
    "Nightmare on Elm Street",
    "Freddy Krueger"
  ],

  "The Texas Chain Saw Massacre": [ // 1974
    "Texas Chainsaw Massacre 1974",
    "Chain Saw Massacre"
  ],

  "The Texas Chainsaw Massacre": [ // 2003
    "Texas Chainsaw Massacre 2003"
  ],

  "Scream": [ // 1996
    "Scream 1996"
  ],

  "Scream": [ // 2022
    "Scream 2022"
  ],

  "The Thing": [ // 1982 John Carpenter
    "Thing 1982",
    "John Carpenter's The Thing"
  ],

  "Carrie": [ // 1976 Brian De Palma
    "Carrie 1976",
    "Brian De Palma Carrie"
  ],

  "Carrie": [ // 2013 Kimberly Peirce
    "Carrie 2013"
  ],

  "It": [ // 2017
    "IT",
    "It 2017"
  ],

  "It Chapter Two": [ // 2019
    "IT Chapter 2",
    "It 2"
  ],

  // Fast & Furious - INDIVIDUAL FILMS
  "The Fast and the Furious": [ // 2001
    "Fast and Furious 1",
    "Fast and the Furious"
  ],

  "2 Fast 2 Furious": [ // 2003
    "Fast and Furious 2"
  ],

  "The Fast and the Furious: Tokyo Drift": [ // 2006
    "Tokyo Drift",
    "Fast and Furious 3"
  ],

  "Fast & Furious": [ // 2009
    "Fast and Furious 4"
  ],

  "Fast Five": [ // 2011
    "Fast and Furious 5"
  ],

  "Fast & Furious 6": [ // 2013
    "Fast and Furious 6"
  ],

  "Furious 7": [ // 2015
    "Fast and Furious 7"
  ],

  "The Fate of the Furious": [ // 2017
    "Fast and Furious 8",
    "F8"
  ],

  "F9": [ // 2021
    "Fast and Furious 9"
  ],

  "Fast X": [ // 2023
    "Fast and Furious 10"
  ],

  // Mission: Impossible - INDIVIDUAL FILMS
  "Mission: Impossible": [ // 1996
    "Mission Impossible",
    "M:I"
  ],

  "Mission: Impossible 2": [ // 2000
    "Mission Impossible 2",
    "M:I-2"
  ],

  "Mission: Impossible III": [ // 2006
    "Mission Impossible 3",
    "M:I-III"
  ],

  "Mission: Impossible - Ghost Protocol": [ // 2011
    "Mission Impossible Ghost Protocol",
    "Ghost Protocol"
  ],

  "Mission: Impossible - Rogue Nation": [ // 2015
    "Mission Impossible Rogue Nation",
    "Rogue Nation"
  ],

  "Mission: Impossible - Fallout": [ // 2018
    "Mission Impossible Fallout",
    "Fallout"
  ],

  // Die Hard - INDIVIDUAL FILMS
  "Die Hard": [ // 1988
    "Die Hard 1"
  ],

  "Die Hard 2": [ // 1990
    "Die Hard 2: Die Harder"
  ],

  "Die Hard with a Vengeance": [ // 1995
    "Die Hard 3"
  ],

  "Live Free or Die Hard": [ // 2007
    "Die Hard 4"
  ],

  "A Good Day to Die Hard": [ // 2013
    "Die Hard 5"
  ],

  // Lord of the Rings - INDIVIDUAL FILMS
  "The Lord of the Rings: The Fellowship of the Ring": [
    "Fellowship of the Ring",
    "LOTR 1"
  ],

  "The Lord of the Rings: The Two Towers": [
    "Two Towers",
    "LOTR 2"
  ],

  "The Lord of the Rings: The Return of the King": [
    "Return of the King",
    "LOTR 3"
  ],

  // Back to the Future - INDIVIDUAL FILMS
  "Back to the Future": [ // 1985
    "BTTF",
    "BTTF 1"
  ],

  "Back to the Future Part II": [ // 1989
    "BTTF 2"
  ],

  "Back to the Future Part III": [ // 1990
    "BTTF 3"
  ],

  // Indiana Jones - INDIVIDUAL FILMS
  "Raiders of the Lost Ark": [
    "Indiana Jones 1"
  ],

  "Indiana Jones and the Temple of Doom": [
    "Temple of Doom",
    "Indiana Jones 2"
  ],

  "Indiana Jones and the Last Crusade": [
    "Last Crusade",
    "Indiana Jones 3"
  ],

  "Indiana Jones and the Dial of Destiny": [
    "Dial of Destiny",
    "Indiana Jones 5"
  ],

  // The Matrix - INDIVIDUAL FILMS
  "The Matrix": [ // 1999
    "Matrix"
  ],

  "The Matrix Reloaded": [ // 2003
    "Matrix Reloaded"
  ],

  "The Matrix Revolutions": [ // 2003
    "Matrix Revolutions"
  ],

  "The Matrix Resurrections": [ // 2021
    "Matrix Resurrections"
  ],

  // Terminator - INDIVIDUAL FILMS
  "The Terminator": [ // 1984
    "Terminator"
  ],

  "Terminator 2: Judgment Day": [ // 1991
    "Terminator 2",
    "T2"
  ],

  // Toy Story - INDIVIDUAL FILMS
  "Toy Story": [ // 1995
    "Toy Story 1"
  ],

  "Toy Story 2": [ // 1999
    "Toystory 2"
  ],

  "Toy Story 3": [ // 2010
    "Toystory 3"
  ],

  "Toy Story 4": [ // 2019
    "Toystory 4"
  ],

  // Shrek - INDIVIDUAL FILMS
  "Shrek": [ // 2001
    "Shrek 1"
  ],

  "Shrek 2": [ // 2004
    "Shrek Two"
  ],

  "Shrek the Third": [ // 2007
    "Shrek 3"
  ],

  "Shrek Forever After": [ // 2010
    "Shrek 4"
  ],

  // X-Men - INDIVIDUAL FILMS
  "X-Men": [ // 2000
    "X Men",
    "X-Men 1"
  ],

  "X2: X-Men United": [ // 2003
    "X2",
    "X-Men 2"
  ],

  "X-Men: The Last Stand": [ // 2006
    "X-Men 3",
    "Last Stand"
  ],

  "X-Men Origins: Wolverine": [ // 2009
    "Wolverine Origins"
  ],

  "X-Men: First Class": [ // 2011
    "First Class"
  ],

  "The Wolverine": [ // 2013
    "Wolverine 2013"
  ],

  "X-Men: Days of Future Past": [ // 2014
    "Days of Future Past"
  ],

  "X-Men: Apocalypse": [ // 2016
    "Apocalypse"
  ],

  "Logan": [ // 2017
    "Wolverine 3"
  ],

  "Deadpool": [ // 2016
    "Deadpool 1"
  ],

  "Deadpool 2": [ // 2018
    "Deadpool Two"
  ],

  // Common abbreviations and variations
  "E.T. the Extra-Terrestrial": [
    "ET",
    "E.T."
  ],

  "2001: A Space Odyssey": [
    "2001 Space Odyssey"
  ],

  "Dr. No": [
    "Doctor No"
  ],

  "From Russia with Love": [
    "From Russia With Love"
  ],

  "The Godfather": [
    "Godfather"
  ],

  "The Godfather Part II": [
    "Godfather 2"
  ],

  "The Shawshank Redemption": [
    "Shawshank Redemption"
  ],

  "One Flew Over the Cuckoo's Nest": [
    "Cuckoo's Nest"
  ],

  "Apocalypse Now": [
    "Apocalypse Now Redux"
  ],

  "Blade Runner": [
    "Blade Runner: Director's Cut"
  ],

  "Blade Runner 2049": [
    "Blade Runner 2"
  ],

  "The Silence of the Lambs": [
    "Silence of the Lambs"
  ],

  "The Lion King": [
    "Lion King"
  ],

  "Beauty and the Beast": [
    "Beauty & the Beast"
  ],

  "Snow White and the Seven Dwarfs": [
    "Snow White"
  ],

  "One Hundred and One Dalmatians": [
    "101 Dalmatians"
  ],

  "The Princess and the Frog": [
    "Princess and the Frog"
  ],

  "The Little Mermaid": [
    "Little Mermaid"
  ],

  "The Hunchback of Notre Dame": [
    "Hunchback of Notre Dame"
  ],

  "Lilo & Stitch": [
    "Lilo and Stitch"
  ],

  "Meet the Robinsons": [
    "The Robinsons"
  ],

  "Wreck-It Ralph": [
    "Wreck It Ralph"
  ],

  "Ralph Breaks the Internet": [
    "Wreck-It Ralph 2"
  ],

  "Raya and the Last Dragon": [
    "Raya"
  ],

  "A Bug's Life": [
    "Bug's Life",
    "Bugs Life"
  ],

  "Monsters, Inc.": [
    "Monsters Inc"
  ],

  "The Incredibles": [
    "Incredibles"
  ],

  "Incredibles 2": [
    "The Incredibles 2"
  ],

  "The Good Dinosaur": [
    "Good Dinosaur"
  ],

  "Inside Out": [
    "Inside Out 1"
  ],

  "Finding Dory": [
    "Dory"
  ],

  "Turning Red": [
    "Red"
  ],

  "Spider-Man: Into the Spider-Verse": [
    "Into the Spider-Verse",
    "Spiderverse"
  ],

  "Spider-Man: Across the Spider-Verse": [
    "Across the Spider-Verse"
  ]
};
