// Clean suggestions array (what users see in dropdown)
// INDIVIDUAL movies with specific years/versions - NO generic titles
export const moviesSuggestions = [
  // Challenge movies (from /challenges/movies/)
  "Back to the Future",
  "A Quiet Place",
  "Coraline",
  "Fight Club",
  "Finding Nemo",
  "Groundhog Day",
  "Inception",
  "Shrek",
  "The Martian",
  "When Harry Met Sally",

  // Classic Hollywood (1930s-1960s)
  "Casablanca",
  "Gone with the Wind",
  "Citizen Kane",
  "The Wizard of Oz",
  "Singin' in the Rain",
  "Some Like It Hot",
  "Vertigo",
  "Psycho",
  "North by Northwest",
  "The Maltese Falcon",
  "Sunset Boulevard",
  "All About Eve",
  "The Treasure of the Sierra Madre",
  "The Best Years of Our Lives",
  "It's a Wonderful Life",
  "The Third Man",
  "Double Indemnity",
  "The Big Sleep",
  "Notorious",
  "Rebecca",

  // 1970s Classics
  "The Godfather",
  "The Godfather Part II",
  "Jaws",
  "Star Wars",
  "Taxi Driver",
  "The Exorcist",
  "Chinatown",
  "The Deer Hunter",
  "Apocalypse Now",
  "All the President's Men",
  "One Flew Over the Cuckoo's Nest",
  "Network",
  "Annie Hall",
  "Manhattan",
  "The French Connection",
  "Dirty Harry",
  "Klute",
  "The Conversation",
  "Serpico",
  "Dog Day Afternoon",

  // 1980s Hits
  "The Empire Strikes Back",
  "Return of the Jedi",
  "Raiders of the Lost Ark",
  "Indiana Jones and the Temple of Doom",
  "Indiana Jones and the Last Crusade",
  "E.T. the Extra-Terrestrial",
  "Blade Runner",
  "The Terminator",
  "Aliens",
  "Ghostbusters",
  "The Breakfast Club",
  "Ferris Bueller's Day Off",
  "Pretty in Pink",
  "Sixteen Candles",
  "Say Anything",
  "The Princess Bride",
  "Dead Poets Society",
  "Top Gun",
  "Risky Business",
  "Scarface",

  // 1990s Cinema
  "Pulp Fiction",
  "The Shawshank Redemption",
  "Goodfellas",
  "Schindler's List",
  "Forrest Gump",
  "The Silence of the Lambs",
  "Terminator 2: Judgment Day",
  "Jurassic Park",
  "The Lion King",
  "Beauty and the Beast",
  "Toy Story",
  "The Matrix",
  "Titanic",
  "Saving Private Ryan",
  "American Beauty",
  "Fargo",
  "The Big Lebowski",
  "Reservoir Dogs",
  "Heat",
  "Se7en",

  // 2000s Era
  "Gladiator",
  "A Beautiful Mind",
  "Chicago",
  "The Lord of the Rings: The Fellowship of the Ring",
  "The Lord of the Rings: The Two Towers",
  "The Lord of the Rings: The Return of the King",
  "Pirates of the Caribbean: The Curse of the Black Pearl",
  "Finding Nemo",
  "Monsters, Inc.",
  "Shrek",
  "Shrek 2",
  "The Incredibles",
  "WALL-E",
  "Up",
  "Ratatouille",
  "Cars",
  "Crash",
  "Million Dollar Baby",
  "No Country for Old Men",
  "There Will Be Blood",

  // Superhero Movies (Individual Films)
  "Spider-Man", // 2002 Tobey Maguire
  "Spider-Man 2", // 2004 Tobey Maguire
  "Spider-Man 3", // 2007 Tobey Maguire
  "The Amazing Spider-Man", // 2012 Andrew Garfield
  "The Amazing Spider-Man 2", // 2014 Andrew Garfield
  "Spider-Man: Homecoming", // 2017 Tom Holland
  "Spider-Man: Far From Home", // 2019 Tom Holland
  "Spider-Man: No Way Home", // 2021 Tom Holland
  "X-Men", // 2000
  "X2: X-Men United", // 2003
  "X-Men: The Last Stand", // 2006
  "X-Men Origins: Wolverine", // 2009
  "X-Men: First Class", // 2011
  "The Wolverine", // 2013
  "X-Men: Days of Future Past", // 2014
  "X-Men: Apocalypse", // 2016
  "Logan", // 2017
  "Deadpool", // 2016
  "Deadpool 2", // 2018
  "Iron Man", // 2008
  "Iron Man 2", // 2010
  "Iron Man 3", // 2013
  "The Incredible Hulk", // 2008
  "Thor", // 2011
  "Thor: The Dark World", // 2013
  "Thor: Ragnarok", // 2017
  "Thor: Love and Thunder", // 2022
  "Captain America: The First Avenger", // 2011
  "Captain America: The Winter Soldier", // 2014
  "Captain America: Civil War", // 2016
  "The Avengers", // 2012
  "Avengers: Age of Ultron", // 2015
  "Avengers: Infinity War", // 2018
  "Avengers: Endgame", // 2019
  "Guardians of the Galaxy", // 2014
  "Guardians of the Galaxy Vol. 2", // 2017
  "Ant-Man", // 2015
  "Ant-Man and the Wasp", // 2018
  "Doctor Strange", // 2016
  "Black Panther", // 2018
  "Captain Marvel", // 2019
  "Eternals", // 2021
  "Shang-Chi and the Legend of the Ten Rings", // 2021

  // DC Movies (Individual Films)
  "Batman", // 1989 Michael Keaton
  "Batman Returns", // 1992 Michael Keaton
  "Batman Forever", // 1995 Val Kilmer
  "Batman & Robin", // 1997 George Clooney
  "Batman Begins", // 2005 Christian Bale
  "The Dark Knight", // 2008 Christian Bale
  "The Dark Knight Rises", // 2012 Christian Bale
  "Batman v Superman: Dawn of Justice", // 2016 Ben Affleck
  "Justice League", // 2017
  "Zack Snyder's Justice League", // 2021
  "Superman", // 1978 Christopher Reeve
  "Superman II", // 1980 Christopher Reeve
  "Superman III", // 1983 Christopher Reeve
  "Superman IV: The Quest for Peace", // 1987 Christopher Reeve
  "Superman Returns", // 2006 Brandon Routh
  "Man of Steel", // 2013 Henry Cavill
  "Wonder Woman", // 2017
  "Wonder Woman 1984", // 2020
  "Aquaman", // 2018
  "The Suicide Squad", // 2021
  "Birds of Prey", // 2020
  "Joker", // 2019
  "The Batman", // 2022 Robert Pattinson

  // Horror Movies (Individual Films)
  "Halloween", // 1978 John Carpenter
  "Halloween", // 2018 David Gordon Green
  "Friday the 13th", // 1980
  "A Nightmare on Elm Street", // 1984
  "The Texas Chain Saw Massacre", // 1974
  "The Texas Chainsaw Massacre", // 2003
  "Scream", // 1996
  "Scream 2", // 1997
  "Scream 3", // 2000
  "Scream 4", // 2011
  "Scream", // 2022
  "The Thing", // 1982 John Carpenter
  "The Shining", // 1980
  "Carrie", // 1976 Brian De Palma
  "Carrie", // 2013 Kimberly Peirce
  "It", // 2017
  "It Chapter Two", // 2019
  "The Conjuring", // 2013
  "The Conjuring 2", // 2016
  "The Conjuring: The Devil Made Me Do It", // 2021
  "Insidious", // 2010
  "Insidious: Chapter 2", // 2013
  "Paranormal Activity", // 2007
  "Get Out", // 2017
  "Us", // 2019
  "Nope", // 2022
  "Hereditary", // 2018
  "Midsommar", // 2019
  "The Babadook", // 2014
  "A Quiet Place", // 2018
  "A Quiet Place Part II", // 2020

  // Action/Thriller (Individual Films)
  "Die Hard", // 1988
  "Die Hard 2", // 1990
  "Die Hard with a Vengeance", // 1995
  "Live Free or Die Hard", // 2007
  "A Good Day to Die Hard", // 2013
  "Lethal Weapon", // 1987
  "Lethal Weapon 2", // 1989
  "Lethal Weapon 3", // 1992
  "Lethal Weapon 4", // 1998
  "Speed", // 1994
  "Speed 2: Cruise Control", // 1997
  "Point Break", // 1991
  "Point Break", // 2015
  "The Fast and the Furious", // 2001
  "2 Fast 2 Furious", // 2003
  "The Fast and the Furious: Tokyo Drift", // 2006
  "Fast & Furious", // 2009
  "Fast Five", // 2011
  "Fast & Furious 6", // 2013
  "Furious 7", // 2015
  "The Fate of the Furious", // 2017
  "F9", // 2021
  "Fast X", // 2023
  "Mission: Impossible", // 1996
  "Mission: Impossible 2", // 2000
  "Mission: Impossible III", // 2006
  "Mission: Impossible - Ghost Protocol", // 2011
  "Mission: Impossible - Rogue Nation", // 2015
  "Mission: Impossible - Fallout", // 2018
  "Mission: Impossible – Dead Reckoning Part One", // 2023

  // Animated Movies (Individual Films)
  "Snow White and the Seven Dwarfs", // 1937
  "Pinocchio", // 1940
  "Fantasia", // 1940
  "Dumbo", // 1941
  "Bambi", // 1942
  "Cinderella", // 1950
  "Alice in Wonderland", // 1951
  "Peter Pan", // 1953
  "Lady and the Tramp", // 1955
  "Sleeping Beauty", // 1959
  "One Hundred and One Dalmatians", // 1961
  "The Jungle Book", // 1967
  "The Little Mermaid", // 1989
  "Beauty and the Beast", // 1991
  "Aladdin", // 1992
  "The Lion King", // 1994
  "Pocahontas", // 1995
  "The Hunchback of Notre Dame", // 1996
  "Hercules", // 1997
  "Mulan", // 1998
  "Tarzan", // 1999
  "Fantasia 2000", // 1999
  "The Emperor's New Groove", // 2000
  "Atlantis: The Lost Empire", // 2001
  "Lilo & Stitch", // 2002
  "Treasure Planet", // 2002
  "Brother Bear", // 2003
  "Home on the Range", // 2004
  "Chicken Little", // 2005
  "Meet the Robinsons", // 2007
  "Bolt", // 2008
  "The Princess and the Frog", // 2009
  "Tangled", // 2010
  "Wreck-It Ralph", // 2012
  "Frozen", // 2013
  "Big Hero 6", // 2014
  "Zootopia", // 2016
  "Moana", // 2016
  "Ralph Breaks the Internet", // 2018
  "Frozen II", // 2019
  "Raya and the Last Dragon", // 2021
  "Encanto", // 2021
  "Strange World", // 2022

  // Pixar (Individual Films)
  "Toy Story", // 1995
  "A Bug's Life", // 1998
  "Toy Story 2", // 1999
  "Monsters, Inc.", // 2001
  "Finding Nemo", // 2003
  "The Incredibles", // 2004
  "Cars", // 2006
  "Ratatouille", // 2007
  "WALL-E", // 2008
  "Up", // 2009
  "Toy Story 3", // 2010
  "Cars 2", // 2011
  "Brave", // 2012
  "Monsters University", // 2013
  "Inside Out", // 2015
  "The Good Dinosaur", // 2015
  "Finding Dory", // 2016
  "Cars 3", // 2017
  "Coco", // 2017
  "Incredibles 2", // 2018
  "Toy Story 4", // 2019
  "Onward", // 2020
  "Soul", // 2020
  "Luca", // 2021
  "Turning Red", // 2022
  "Lightyear", // 2022
  "Elemental", // 2023

  // DreamWorks (Individual Films)
  "Antz", // 1998
  "The Prince of Egypt", // 1998
  "The Road to El Dorado", // 2000
  "Chicken Run", // 2000
  "Shrek", // 2001
  "Spirit: Stallion of the Cimarron", // 2002
  "Sinbad: Legend of the Seven Seas", // 2003
  "Shrek 2", // 2004
  "Shark Tale", // 2004
  "Madagascar", // 2005
  "Over the Hedge", // 2006
  "Flushed Away", // 2006
  "Shrek the Third", // 2007
  "Bee Movie", // 2007
  "Kung Fu Panda", // 2008
  "Madagascar: Escape 2 Africa", // 2008
  "Monsters vs. Aliens", // 2009
  "How to Train Your Dragon", // 2010
  "Shrek Forever After", // 2010
  "Megamind", // 2010
  "Kung Fu Panda 2", // 2011
  "Puss in Boots", // 2011
  "Madagascar 3: Europe's Most Wanted", // 2012
  "Rise of the Guardians", // 2012
  "The Croods", // 2013
  "Turbo", // 2013
  "Mr. Peabody & Sherman", // 2014
  "How to Train Your Dragon 2", // 2014
  "Penguins of Madagascar", // 2014
  "Home", // 2015
  "Kung Fu Panda 3", // 2016
  "Trolls", // 2016
  "The Boss Baby", // 2017
  "Captain Underpants: The First Epic Movie", // 2017
  "How to Train Your Dragon: The Hidden World", // 2019
  "Abominable", // 2019
  "Trolls World Tour", // 2020
  "The Croods: A New Age", // 2020
  "The Boss Baby: Family Business", // 2021
  "Spirit Untamed", // 2021
  "The Bad Guys", // 2022
  "Puss in Boots: The Last Wish", // 2022

  // Modern Dramas & Thrillers (2010s-2020s)
  "The Social Network", // 2010
  "Black Swan", // 2010
  "The King's Speech", // 2010
  "The Artist", // 2011
  "Hugo", // 2011
  "The Help", // 2011
  "Argo", // 2012
  "Life of Pi", // 2012
  "Django Unchained", // 2012
  "12 Years a Slave", // 2013
  "Gravity", // 2013
  "Her", // 2013
  "The Wolf of Wall Street", // 2013
  "Birdman", // 2014
  "Boyhood", // 2014
  "Whiplash", // 2014
  "The Grand Budapest Hotel", // 2014
  "Spotlight", // 2015
  "The Revenant", // 2015
  "Mad Max: Fury Road", // 2015
  "Room", // 2015
  "Moonlight", // 2016
  "La La Land", // 2016
  "Arrival", // 2016
  "Manchester by the Sea", // 2016
  "The Shape of Water", // 2017
  "Three Billboards Outside Ebbing, Missouri", // 2017
  "Call Me by Your Name", // 2017
  "Lady Bird", // 2017
  "Get Out", // 2017
  "The Post", // 2017
  "Green Book", // 2018
  "Roma", // 2018
  "A Star Is Born", // 2018
  "BlacKkKlansman", // 2018
  "Bohemian Rhapsody", // 2018
  "Vice", // 2018
  "Parasite", // 2019
  "Joker", // 2019
  "1917", // 2019
  "Once Upon a Time in Hollywood", // 2019
  "Jojo Rabbit", // 2019
  "Little Women", // 2019
  "Marriage Story", // 2019
  "The Irishman", // 2019
  "Nomadland", // 2020
  "Minari", // 2020
  "The Father", // 2020
  "Sound of Metal", // 2020
  "Judas and the Black Messiah", // 2021
  "The Trial of the Chicago 7", // 2020
  "Mank", // 2020
  "CODA", // 2021
  "Dune", // 2021
  "The Power of the Dog", // 2021
  "West Side Story", // 2021
  "King Richard", // 2021
  "Belfast", // 2021
  "Licorice Pizza", // 2021
  "Drive My Car", // 2021
  "Everything Everywhere All at Once", // 2022
  "Top Gun: Maverick", // 2022
  "The Banshees of Inisherin", // 2022
  "Tár", // 2022
  "The Fabelmans", // 2022
  "Avatar: The Way of Water", // 2022
  "Glass Onion: A Knives Out Mystery", // 2022
  "Women Talking", // 2022
  "Triangle of Sadness", // 2022

  // Sci-Fi Classics & Modern
  "2001: A Space Odyssey", // 1968
  "Close Encounters of the Third Kind", // 1977
  "Alien", // 1979
  "Blade Runner", // 1982
  "The Terminator", // 1984
  "Back to the Future", // 1985
  "Back to the Future Part II", // 1989
  "Back to the Future Part III", // 1990
  "Total Recall", // 1990
  "Terminator 2: Judgment Day", // 1991
  "Jurassic Park", // 1993
  "The Matrix", // 1999
  "The Matrix Reloaded", // 2003
  "The Matrix Revolutions", // 2003
  "The Matrix Resurrections", // 2021
  "Minority Report", // 2002
  "I, Robot", // 2004
  "War of the Worlds", // 2005
  "Children of Men", // 2006
  "WALL-E", // 2008
  "District 9", // 2009
  "Avatar", // 2009
  "Inception", // 2010
  "Source Code", // 2011
  "Looper", // 2012
  "Gravity", // 2013
  "Her", // 2013
  "Interstellar", // 2014
  "Ex Machina", // 2014
  "The Martian", // 2015
  "Arrival", // 2016
  "Blade Runner 2049", // 2017
  "Annihilation", // 2018
  "Ready Player One", // 2018
  "Ad Astra", // 2019
  "Tenet", // 2020
  "Dune", // 2021
  "Don't Look Up", // 2021
  "Everything Everywhere All at Once", // 2022
  "Avatar: The Way of Water", // 2022

  // Comedy Classics
  "Some Like It Hot", // 1959
  "The Odd Couple", // 1968
  "Blazing Saddles", // 1974
  "Young Frankenstein", // 1974
  "Monty Python and the Holy Grail", // 1975
  "Annie Hall", // 1977
  "Manhattan", // 1979
  "Caddyshack", // 1980
  "Airplane!", // 1980
  "The Blues Brothers", // 1980
  "Stripes", // 1981
  "Fast Times at Ridgemont High", // 1982
  "Trading Places", // 1983
  "This Is Spinal Tap", // 1984
  "Ghostbusters", // 1984
  "Pee-wee's Big Adventure", // 1985
  "Ferris Bueller's Day Off", // 1986
  "The Princess Bride", // 1987
  "Big", // 1988
  "Coming to America", // 1988
  "When Harry Met Sally", // 1989
  "Groundhog Day", // 1993
  "Mrs. Doubtfire", // 1993
  "Dumb and Dumber", // 1994
  "The Mask", // 1994
  "Ace Ventura: Pet Detective", // 1994
  "Tommy Boy", // 1995
  "Happy Gilmore", // 1996
  "The Nutty Professor", // 1996
  "Liar Liar", // 1997
  "Austin Powers: International Man of Mystery", // 1997
  "There's Something About Mary", // 1998
  "The Big Lebowski", // 1998
  "Austin Powers: The Spy Who Shagged Me", // 1999
  "Galaxy Quest", // 1999
  "Meet the Parents", // 2000
  "Zoolander", // 2001
  "Austin Powers in Goldmember", // 2002
  "Old School", // 2003
  "Elf", // 2003
  "Anchorman: The Legend of Ron Burgundy", // 2004
  "Dodgeball: A True Underdog Story", // 2004
  "Wedding Crashers", // 2005
  "The 40-Year-Old Virgin", // 2005
  "Talladega Nights: The Ballad of Ricky Bobby", // 2006
  "Borat", // 2006
  "Knocked Up", // 2007
  "Superbad", // 2007
  "Step Brothers", // 2008
  "Tropic Thunder", // 2008
  "The Hangover", // 2009
  "Zombieland", // 2009
  "Grown Ups", // 2010
  "Bridesmaids", // 2011
  "21 Jump Street", // 2012
  "Ted", // 2012
  "This Is the End", // 2013
  "The Grand Budapest Hotel", // 2014
  "22 Jump Street", // 2014
  "Trainwreck", // 2015
  "Deadpool", // 2016
  "The Nice Guys", // 2016
  "Game Night", // 2018
  "Booksmart", // 2019
  "Knives Out", // 2019
  "Jojo Rabbit", // 2019
  "Palm Springs", // 2020
  "Borat Subsequent Moviefilm", // 2020
  "The French Dispatch", // 2021
  "Don't Look Up", // 2021
  "Licorice Pizza", // 2021
  "The Menu", // 2022
  "Glass Onion: A Knives Out Mystery", // 2022
  "Everything Everywhere All at Once", // 2022
  "The Banshees of Inisherin", // 2022
  "Babylon", // 2022
  "Cocaine Bear", // 2023
  "Scream VI", // 2023
  "John Wick: Chapter 4", // 2023
  "Spider-Man: Across the Spider-Verse", // 2023
  "Guardians of the Galaxy Vol. 3", // 2023
  "Fast X", // 2023
  "Indiana Jones and the Dial of Destiny", // 2023
  "Mission: Impossible – Dead Reckoning Part One", // 2023
  "Oppenheimer", // 2023
  "Barbie", // 2023
  "The Super Mario Bros. Movie", // 2023
  "Scream VI", // 2023
  "Creed III", // 2023
  "Ant-Man and the Wasp: Quantumania", // 2023
  "John Wick: Chapter 4", // 2023
  "The Little Mermaid", // 2023
  "Transformers: Rise of the Beasts", // 2023
  "The Flash", // 2023
  "Elemental", // 2023
  "Spider-Man: Across the Spider-Verse", // 2023
  "Transformers: Rise of the Beasts", // 2023
  "Indiana Jones and the Dial of Destiny", // 2023
  "Insidious: The Red Door", // 2023
  "Mission: Impossible – Dead Reckoning Part One", // 2023
  "Barbie", // 2023
  "Oppenheimer", // 2023
  "Teenage Mutant Ninja Turtles: Mutant Mayhem", // 2023
  "Meg 2: The Trench", // 2023
  "Blue Beetle", // 2023
  "Gran Turismo", // 2023
  "The Nun II", // 2023
  "A Haunting in Venice", // 2023
  "The Creator", // 2023
  "Killers of the Flower Moon", // 2023
  "The Marvels", // 2023
  "Napoleon", // 2023
  "Wish", // 2023
  "Thanksgiving", // 2023
  "The Hunger Games: The Ballad of Songbirds & Snakes", // 2023
  "Trolls Band Together", // 2023
  "The Marvels", // 2023
  "Next Goal Wins", // 2023
  "Napoleon", // 2023
  "Wish", // 2023
  "Renaissance: A Film by Beyoncé", // 2023
  "Godzilla Minus One", // 2023
  "The Boy and the Heron", // 2023
  "Poor Things", // 2023
  "The Zone of Interest", // 2023
  "American Fiction", // 2023
  "The Holdovers", // 2023
  "May December", // 2023
  "Maestro", // 2023
  "Rustin", // 2023
  "The Color Purple", // 2023
  "Ferrari", // 2023
  "The Iron Claw", // 2023
  "Anyone But You", // 2023
  "Aquaman and the Lost Kingdom" // 2023
];
