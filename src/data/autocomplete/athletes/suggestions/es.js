// Clean suggestions array (what users see in dropdown)
// Includes distinct alternatives that users would search for differently
export const athletesSuggestions = [
  // Challenge athletes (from /challenges/athletes/)
  "Alex Morgan",
  "Cristiano Ronaldo",
  "Derek Jeter",
  "Lindsey Vonn",
  "Naomi Osaka",
  "Michael Phelps",
  "Simone Biles",
  "Michael Strahan",
  "Tiger Woods",
  "Tim Duncan",

  // Basketball - distinct names users search for
  "LeBron James",
  "LeBron", // Distinct from full name
  "Michael Jordan",
  "Jordan", // Distinct from full name
  "Kobe Bryant",
  "Kobe", // Distinct from full name
  "Stephen Curry",
  "Steph Curry", // Distinct from Stephen
  "Kevin Durant",
  "Shaquille O'Neal",
  "Shaq", // Distinct from full name
  "Magic Johnson",
  "Larry Bird",
  "Kareem Abdul-Jabbar",
  "Wilt Chamberlain",
  "Bill Russell",
  "Scottie Pippen",
  "Charles Barkley",
  "Dirk Nowitzki",
  "Giannis Antetokounmpo",

  // Football Americano - distinct names
  "Tom Brady",
  "Peyton Manning",
  "Joe Montana",
  "Johnny Unitas",
  "Brett Favre",
  "Aaron Rodgers",
  "Drew Brees",
  "Dan Marino",
  "Joe Namath",
  "Terry Bradshaw",
  "Troy Aikman",
  "Steve Young",
  "John Elway",
  "Jerry Rice",
  "Randy Moss",
  "Calvin Johnson",
  "Megatron", // Distinct nickname
  "Lawrence Taylor",
  "Jim Brown",
  "Barry Sanders",
  "Emmitt Smith",
  "Walter Payton",

  // Baseball - iconic single names and full names
  "Babe Ruth",
  "Lou Gehrig",
  "Joe DiMaggio",
  "Mickey Mantle",
  "Ted Williams",
  "Hank Aaron",
  "Willie Mays",
  "Sandy Koufax",
  "Cy Young",
  "Jackie Robinson",
  "Barry Bonds",
  "Ken Griffey Jr.",
  "Tony Gwynn",
  "Cal Ripken Jr.",
  "Nolan Ryan",
  "Pedro Martínez", // With accent
  "Randy Johnson",
  "Greg Maddux",
  "Frank Thomas",

  // Fútbol - global icons (Spanish names where applicable)
  "Pelé", // Distinct from full name
  "Edson Arantes do Nascimento", // Full name of Pelé
  "Diego Maradona",
  "Maradona", // Distinct from full name
  "Lionel Messi",
  "Messi", // Distinct from full name
  "Ronaldinho",
  "Zinedine Zidane",
  "Zidane", // Distinct from full name
  "Thierry Henry",
  "David Beckham",
  "Beckham", // Distinct from full name
  "Ronaldo", // The original Ronaldo (Brazilian)
  "Kaká",
  "Roberto Carlos",
  "Cafu",
  "Paolo Maldini",
  "Francesco Totti",
  "Andrea Pirlo",
  "Xavi",
  "Andrés Iniesta", // With accent
  "Sergio Ramos",
  "Virgil van Dijk",
  "Kevin De Bruyne",
  "Neymar",
  "Kylian Mbappé", // With accent
  "Erling Haaland",

  // Spanish/Latin American Soccer Stars
  "Raúl González", // With accent
  "Raúl", // Distinct from full name
  "Iker Casillas",
  "Casillas", // Distinct from full name
  "Fernando Torres",
  "Torres", // Distinct from full name
  "Xabi Alonso",
  "Carles Puyol",
  "Gerard Piqué", // With accent
  "Piqué", // Distinct from full name
  "Jordi Alba",
  "Sergio Busquets",
  "Luis Suárez", // With accent
  "Suárez", // Distinct from full name
  "Edinson Cavani",
  "Cavani", // Distinct from full name
  "James Rodríguez", // With accent
  "Carlos Vela",
  "Chicharito", // Distinct from Javier Hernández
  "Javier Hernández", // With accent
  "Hugo Sánchez", // With accent
  "Rafael Márquez", // With accent

  // Tennis - distinct names
  "Serena Williams",
  "Venus Williams",
  "Roger Federer",
  "Rafael Nadal",
  "Rafa", // Distinct nickname for Nadal
  "Novak Djokovic",
  "Andy Murray",
  "Steffi Graf",
  "Martina Navratilova",
  "Chris Evert",
  "Billie Jean King",
  "John McEnroe",
  "Björn Borg", // With accent
  "Andre Agassi",
  "Pete Sampras",
  "Jimmy Connors",
  "Arthur Ashe",
  "Monica Seles",
  "Maria Sharapova",

  // Spanish Tennis Players
  "Carlos Alcaraz",
  "Garbiñe Muguruza", // With accent
  "Roberto Bautista",
  "Pablo Carreño", // With accent
  "Alejandro Davidovich",

  // Golf - iconic names
  "Jack Nicklaus",
  "Arnold Palmer",
  "Gary Player",
  "Ben Hogan",
  "Sam Snead",
  "Byron Nelson",
  "Bobby Jones",
  "Phil Mickelson",
  "Lefty", // Distinct nickname
  "Rory McIlroy",
  "Jordan Spieth",
  "Brooks Koepka",
  "Dustin Johnson",
  "Jason Day",
  "Rickie Fowler",

  // Spanish Golfers
  "Sergio García", // With accent
  "García", // Distinct from full name
  "Jon Rahm",
  "José María Olazábal", // With accents
  "Seve Ballesteros",

  // Track & Field / Olympics
  "Usain Bolt",
  "Carl Lewis",
  "Jesse Owens",
  "Florence Griffith-Joyner",
  "Flo-Jo", // Distinct nickname
  "Jackie Joyner-Kersee",
  "Bob Beamon",
  "Edwin Moses",
  "Michael Johnson",
  "Allyson Felix",
  "Ryan Lochte",
  "Katie Ledecky",
  "Mark Spitz",
  "Nadia Comăneci", // With accent
  "Mary Lou Retton",
  "Nastia Liukin",
  "Shawn Johnson",
  "Gabby Douglas",
  "Aly Raisman",

  // Boxing - legendary names
  "Muhammad Ali",
  "Ali", // Distinct from full name
  "Cassius Clay", // Ali's birth name
  "Mike Tyson",
  "Tyson", // Distinct from full name
  "Joe Frazier",
  "George Foreman",
  "Sugar Ray Leonard",
  "Sugar Ray Robinson",
  "Rocky Marciano",
  "Joe Louis",
  "Evander Holyfield",
  "Lennox Lewis",
  "Oscar De La Hoya",
  "Manny Pacquiao",
  "Pacman", // Distinct nickname
  "Floyd Mayweather",

  // Spanish/Mexican Boxers
  "Julio César Chávez", // With accent
  "Chávez", // Distinct from full name
  "Saúl Álvarez", // With accents
  "Canelo Álvarez", // With accent
  "Canelo", // Distinct nickname
  "Juan Manuel Márquez", // With accent
  "Marco Antonio Barrera",
  "Erik Morales",
  "Salvador Sánchez", // With accent

  // Hockey - iconic names
  "Wayne Gretzky",
  "Mario Lemieux",
  "Gordie Howe",
  "Maurice Richard",
  "Bobby Orr",
  "Mark Messier",
  "Patrick Roy",
  "Martin Brodeur",
  "Jaromir Jagr",
  "Sidney Crosby",
  "Alexander Ovechkin",
  "Ovie", // Distinct nickname
  "Connor McDavid",

  // Auto Racing
  "Dale Earnhardt",
  "Dale Earnhardt Jr.",
  "Junior", // Distinct nickname
  "Jeff Gordon",
  "Jimmie Johnson",
  "Tony Stewart",
  "Kyle Busch",
  "Kevin Harvick",
  "Denny Hamlin",
  "Lewis Hamilton",
  "Michael Schumacher",
  "Ayrton Senna",
  "Alain Prost",
  "Sebastian Vettel",
  "Max Verstappen",
  "Daniel Ricciardo",

  // Spanish/Latin American Drivers
  "Fernando Alonso",
  "Alonso", // Distinct from full name
  "Carlos Sainz",
  "Sainz", // Distinct from full name
  "Sergio Pérez", // With accent
  "Pérez", // Distinct from full name
  "Checo Pérez", // With accent

  // MMA/UFC
  "Conor McGregor",
  "Anderson Silva",
  "Jon Jones",
  "Georges St-Pierre",
  "GSP", // Distinct nickname
  "Chuck Liddell",
  "Tito Ortiz",
  "Randy Couture",
  "Matt Hughes",
  "BJ Penn",
  "Fedor Emelianenko",
  "Ronda Rousey",
  "Amanda Nunes",

  // Other Sports
  "Tony Hawk",
  "Shaun White",
  "Kelly Slater",
  "Danica Patrick",
  "Bode Miller",
  "Apolo Ohno",
  "Dan Gable",
  "John Daly"
];
