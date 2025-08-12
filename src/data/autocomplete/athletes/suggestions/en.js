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
  "LeBron", // Distinct from full name - users search this way
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

  // Football (American) - distinct names
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
  "Megatron", // Distinct nickname for Calvin Johnson
  "Lawrence Taylor",
  "Jim Brown",
  "Barry Sanders",
  "Emmitt Smith",
  "Walter Payton",

  // Baseball - iconic single names and full names
  "Babe Ruth",
  "The Babe", // Distinct from Babe Ruth
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
  "Pedro Martinez",
  "Randy Johnson",
  "The Big Unit", // Distinct nickname for Randy Johnson
  "Greg Maddux",
  "Frank Thomas",
  "The Big Hurt", // Distinct nickname for Frank Thomas

  // Soccer/Football - global icons
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
  "Andrés Iniesta",
  "Sergio Ramos",
  "Virgil van Dijk",
  "Kevin De Bruyne",
  "Neymar",
  "Kylian Mbappé",
  "Erling Haaland",

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
  "Björn Borg",
  "Andre Agassi",
  "Pete Sampras",
  "Jimmy Connors",
  "Arthur Ashe",
  "Monica Seles",
  "Maria Sharapova",

  // Golf - iconic names
  "Jack Nicklaus",
  "The Golden Bear", // Distinct nickname for Nicklaus
  "Arnold Palmer",
  "Gary Player",
  "Ben Hogan",
  "Sam Snead",
  "Byron Nelson",
  "Bobby Jones",
  "Phil Mickelson",
  "Lefty", // Distinct nickname for Phil Mickelson
  "Rory McIlroy",
  "Jordan Spieth",
  "Brooks Koepka",
  "Dustin Johnson",
  "Jason Day",
  "Adam Scott",
  "Rickie Fowler",

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
  "Nadia Comăneci",
  "Mary Lou Retton",
  "Nastia Liukin",
  "Shawn Johnson",
  "Gabby Douglas",
  "Aly Raisman",

  // Boxing - legendary names
  "Muhammad Ali",
  "Ali", // Distinct from full name
  "Cassius Clay", // Ali's birth name - distinct
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
  "Money Mayweather", // Distinct nickname

  // Hockey - iconic names
  "Wayne Gretzky",
  "The Great One", // Distinct nickname for Gretzky
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
  "The Intimidator", // Distinct nickname
  "Dale Earnhardt Jr.",
  "Junior", // Distinct nickname for Dale Jr.
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

  // MMA/UFC
  "Conor McGregor",
  "The Notorious", // Distinct nickname
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
