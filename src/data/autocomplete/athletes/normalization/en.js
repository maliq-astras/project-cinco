// Normalization data (grouped catch-all variations)
// Maps user input variations to the official athlete name
export const athletesNormalization = {
  // Challenge athletes - variations and nicknames
  "Derek Jeter": [
    "Jeter", // Iconic single name
    "The Captain",
    "Mr. November"
  ],
  
  "Tiger Woods": [
    "Tiger", // Iconic single name
    "Eldrick Woods", // Birth name
    "The Tiger"
  ],
  
  "Michael Phelps": [
    "Phelps", // Single name
    "The Baltimore Bullet",
    "The Flying Fish"
  ],
  
  "Michael Strahan": [
    "Strahan", // Single name
    "The Gap"
  ],
  
  "Cristiano Ronaldo": [
    "Cristiano", // Single name
    "CR7",
    "Ronaldo" // Note: This is tricky since there's also Brazilian Ronaldo
  ],

  // Basketball - iconic single name normalizations
  "LeBron James": [
    "LeBron", // Normalize single name to full
    "King James",
    "The King",
    "The Chosen One",
    "Bron"
  ],
  
  "Michael Jordan": [
    "Jordan", // Normalize single name to full
    "MJ",
    "His Airness",
    "Air Jordan"
  ],
  
  "Kobe Bryant": [
    "Kobe", // Normalize single name to full
    "The Black Mamba",
    "Mamba",
    "Bean" // Childhood nickname
  ],
  
  "Shaquille O'Neal": [
    "Shaq", // Normalize nickname to full
    "The Big Aristotle",
    "Superman",
    "The Diesel"
  ],
  
  "Stephen Curry": [
    "Steph Curry", // Normalize to Stephen
    "Steph",
    "Chef Curry",
    "The Baby-Faced Assassin"
  ],
  
  "Magic Johnson": [
    "Magic", // Single name
    "Earvin Johnson",
    "Earvin Magic Johnson"
  ],

  // Football - quarterback legends
  "Tom Brady": [
    "Brady",
    "TB12",
    "The GOAT"
  ],
  
  "Joe Montana": [
    "Montana",
    "Joe Cool",
    "The Comeback Kid"
  ],
  
  "Peyton Manning": [
    "Manning", // Note: Could conflict with Eli
    "The Sheriff"
  ],
  
  "Brett Favre": [
    "Favre",
    "The Gunslinger"
  ],

  // Baseball - legendary nicknames
  "Babe Ruth": [
    "The Babe", // Normalize to Babe Ruth
    "Babe",
    "The Sultan of Swat",
    "The Bambino",
    "George Herman Ruth"
  ],
  
  "Lou Gehrig": [
    "Gehrig",
    "The Iron Horse",
    "Larrupin' Lou"
  ],
  
  "Mickey Mantle": [
    "Mantle",
    "The Mick",
    "The Commerce Comet"
  ],
  
  "Willie Mays": [
    "Mays",
    "The Say Hey Kid",
    "Willie"
  ],
  
  "Hank Aaron": [
    "Aaron",
    "Hammerin' Hank",
    "The Hammer"
  ],
  
  "Barry Bonds": [
    "Bonds",
    "The Home Run King"
  ],
  
  "Ken Griffey Jr.": [
    "Griffey",
    "Junior",
    "The Kid",
    "Ken Griffey Junior"
  ],
  
  "Cal Ripken Jr.": [
    "Ripken",
    "The Iron Man",
    "Cal Ripken Junior"
  ],
  
  "Randy Johnson": [
    "The Big Unit", // Normalize nickname to full name
    "Johnson" // Note: Common last name, might conflict
  ],
  
  "Frank Thomas": [
    "The Big Hurt", // Normalize nickname to full name
    "Thomas" // Note: Common last name
  ],

  // Soccer - global icons with single names
  "Pelé": [
    "Edson Arantes do Nascimento", // Normalize full name to Pelé
    "Pele" // Without accent
  ],
  
  "Diego Maradona": [
    "Maradona", // Normalize to full name
    "El Pibe de Oro",
    "The Hand of God"
  ],
  
  "Lionel Messi": [
    "Messi", // Normalize to full name
    "Leo Messi",
    "La Pulga",
    "The GOAT"
  ],
  
  "Zinedine Zidane": [
    "Zidane", // Normalize to full name
    "Zizou"
  ],
  
  "David Beckham": [
    "Beckham", // Normalize to full name
    "Becks",
    "Golden Balls"
  ],
  
  "Ronaldinho": [
    "Ronaldinho Gaúcho",
    "Ronaldinho Gaucho" // Without accent
  ],

  // Tennis - distinctive names
  "Rafael Nadal": [
    "Rafa", // Normalize nickname to full
    "Nadal",
    "The King of Clay"
  ],
  
  "Roger Federer": [
    "Federer",
    "Fed",
    "The Swiss Maestro",
    "RF"
  ],
  
  "Novak Djokovic": [
    "Djokovic",
    "Nole",
    "The Joker"
  ],
  
  "Serena Williams": [
    "Serena",
    "Queen Serena"
  ],

  // Golf - legendary nicknames
  "Jack Nicklaus": [
    "The Golden Bear", // Normalize nickname to full
    "Nicklaus",
    "Golden Bear"
  ],
  
  "Tiger Woods": [
    "Tiger", // Already handled above
    "Woods"
  ],
  
  "Arnold Palmer": [
    "Palmer",
    "Arnie",
    "The King"
  ],
  
  "Phil Mickelson": [
    "Lefty", // Normalize nickname to full
    "Mickelson",
    "Phil the Thrill"
  ],

  // Track & Field / Olympics
  "Usain Bolt": [
    "Bolt",
    "Lightning Bolt",
    "The Fastest Man Alive"
  ],
  
  "Florence Griffith-Joyner": [
    "Flo-Jo", // Normalize nickname to full
    "FloJo"
  ],
  
  "Carl Lewis": [
    "Lewis" // Note: Common name
  ],
  
  "Jesse Owens": [
    "Owens",
    "The Buckeye Bullet"
  ],

  // Boxing - legendary fighters
  "Muhammad Ali": [
    "Ali", // Normalize to full name
    "Cassius Clay", // Birth name - normalize to Ali
    "The Greatest",
    "The Louisville Lip"
  ],
  
  "Mike Tyson": [
    "Tyson", // Normalize to full name
    "Iron Mike",
    "Kid Dynamite"
  ],
  
  "Sugar Ray Leonard": [
    "Sugar Ray", // Partial name
    "Leonard"
  ],
  
  "Sugar Ray Robinson": [
    "Sugar Ray", // Note: Conflicts with Leonard
    "Robinson"
  ],
  
  "Manny Pacquiao": [
    "Pacman", // Normalize nickname to full
    "Pacquiao",
    "The Fighting Pride of the Philippines"
  ],
  
  "Floyd Mayweather": [
    "Money Mayweather", // Normalize to Floyd
    "Mayweather",
    "Money",
    "Pretty Boy Floyd"
  ],

  // Hockey - The Great One and others
  "Wayne Gretzky": [
    "The Great One", // Normalize nickname to full
    "Gretzky",
    "The Great One",
    "99"
  ],
  
  "Mario Lemieux": [
    "Lemieux",
    "Super Mario",
    "Le Magnifique"
  ],
  
  "Gordie Howe": [
    "Howe",
    "Mr. Hockey"
  ],
  
  "Alexander Ovechkin": [
    "Ovie", // Normalize nickname to full
    "Ovechkin",
    "Ovi",
    "The Great Eight"
  ],

  // Auto Racing
  "Dale Earnhardt": [
    "The Intimidator", // Normalize nickname to full
    "Earnhardt",
    "Ironhead"
  ],
  
  "Dale Earnhardt Jr.": [
    "Junior", // Normalize nickname to full
    "Dale Jr.",
    "Little E"
  ],
  
  "Michael Schumacher": [
    "Schumacher",
    "Schumi",
    "The Red Baron"
  ],

  // MMA/UFC
  "Conor McGregor": [
    "The Notorious", // Normalize nickname to full
    "McGregor",
    "Notorious"
  ],
  
  "Georges St-Pierre": [
    "GSP", // Normalize abbreviation to full
    "St-Pierre",
    "Rush"
  ],
  
  "Anderson Silva": [
    "Silva", // Note: Common name
    "The Spider"
  ],

  // Simple single name normalizations
  "Larry Bird": ["Bird", "The Hick from French Lick"],
  "Magic Johnson": ["Magic", "Earvin Johnson"],
  "Joe Frazier": ["Frazier", "Smokin' Joe"],
  "George Foreman": ["Foreman", "Big George"],
  "Rocky Marciano": ["Marciano", "The Brockton Blockbuster"],
  "Joe Louis": ["Louis", "The Brown Bomber"],
  "Bobby Orr": ["Orr", "Number 4"],
  "Tony Hawk": ["Hawk", "The Birdman"],
  "Kelly Slater": ["Slater", "The GOAT of Surfing"],
  "Shaun White": ["White", "The Flying Tomato"]
};
