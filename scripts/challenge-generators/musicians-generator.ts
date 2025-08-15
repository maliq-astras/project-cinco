// scripts/challenge-generators/musicians-generator.ts
import { CategoryType, MusicalArtistFactType } from '../../src/types';
import { BaseChallengeGenerator } from './generator';

// Musician fact types
const musicianFactTypes: MusicalArtistFactType[] = [
  "Genre",
  "Background",
  "Iconic Song", 
  "Debut",
  "Achievements",
  "Collaborations",
  "Chart Performance",
  "Wildcard"
];

// Musicians data with facts for each fact type
const musicianData = [
  {
    answer: {
      en: "Beyoncé",
      es: "Beyoncé"
    },
    imageUrl: "https://res.cloudinary.com/fact5-trivia-game/image/upload/v1/artists/beyonce.jpg",
    facts: {
      "Genre": {
        en: "I am primarily known for R&B and pop music, but I have successfully incorporated elements of hip-hop, soul, funk, country, and even rock into my sound, constantly evolving my musical style across different albums and eras.",
        es: "Soy principalmente conocida por música R&B y pop, pero he incorporado exitosamente elementos de hip-hop, soul, funk, country e incluso rock en mi sonido, evolucionando constantemente mi estilo musical a través de diferentes álbumes y eras."
      },
      "Background": {
        en: "I was born in Houston, Texas, in 1981 and began performing in singing and dancing competitions as a child, forming the group Girls Tyme at age nine, which later evolved into Destiny's Child, one of the best-selling girl groups of all time.",
        es: "Nací en Houston, Texas, en 1981 y comencé actuando en competencias de canto y baile cuando era niña, formando el grupo Girls Tyme a los nueve años, que más tarde evolucionó a Destiny's Child, uno de los grupos femeninos más vendidos de todos los tiempos."
      },
      "Iconic Song": {
        en: "My song 'Crazy in Love' featuring Jay-Z became a defining track of the 2000s, with its distinctive horn sample and infectious energy, while 'Single Ladies (Put a Ring on It)' became a cultural phenomenon with its empowering message and iconic dance moves.",
        es: "Mi canción 'Crazy in Love' con Jay-Z se convirtió en una pista definitoria de los 2000s, con su distintiva muestra de trompeta y energía contagiosa, mientras 'Single Ladies (Put a Ring on It)' se convirtió en un fenómeno cultural con su mensaje empoderador y movimientos de baile icónicos."
      },
      "Debut": {
        en: "I launched my solo career in 2003 with the album 'Dangerously in Love' while Destiny's Child was on hiatus, which debuted at number one and established me as a solo artist while I continued with the group until 2006.",
        es: "Lancé mi carrera solista en 2003 con el álbum 'Dangerously in Love' mientras Destiny's Child estaba en pausa, que debutó en el número uno y me estableció como artista solista mientras continué con el grupo hasta 2006."
      },
      "Achievements": {
        en: "I have won 32 Grammy Awards, making me the most awarded artist in Grammy history, and I've sold over 100 million records worldwide as a solo artist, with multiple albums debuting at number one on the Billboard 200.",
        es: "He ganado 32 premios Grammy, convirtiéndome en la artista más premiada en la historia de los Grammy, y he vendido más de 100 millones de discos mundialmente como artista solista, con múltiples álbumes debutando en el número uno del Billboard 200."
      },
      "Collaborations": {
        en: "I have collaborated with diverse artists including Jay-Z (my husband), Ed Sheeran, Lady Gaga, Megan Thee Stallion, and Shakira, while also working with my sister Solange and featuring other members of Destiny's Child on various solo projects.",
        es: "He colaborado con artistas diversos incluyendo Jay-Z (mi esposo), Ed Sheeran, Lady Gaga, Megan Thee Stallion y Shakira, mientras también trabajo con mi hermana Solange y presento otros miembros de Destiny's Child en varios proyectos solistas."
      },
      "Chart Performance": {
        en: "I have achieved seven number-one albums on the Billboard 200, with multiple songs reaching the top of the Hot 100, and I'm one of the few artists to have number-one hits as a solo artist, part of a duo, and as part of a group.",
        es: "He logrado siete álbumes número uno en el Billboard 200, con múltiples canciones alcanzando la cima del Hot 100, y soy una de las pocas artistas en tener éxitos número uno como artista solista, parte de un dúo y como parte de un grupo."
      },
      "Wildcard": {
        en: "I surprise-released my self-titled album 'Beyoncé' in 2013 without any prior announcement or promotion, revolutionizing album releases in the digital age and inspiring many other artists to adopt similar surprise release strategies.",
        es: "Lancé por sorpresa mi álbum homónimo 'Beyoncé' en 2013 sin ningún anuncio o promoción previa, revolucionando los lanzamientos de álbumes en la era digital e inspirando a muchos otros artistas a adoptar estrategias similares de lanzamiento sorpresa."
      }
    },
    alternatives: {
      en: ["Rihanna", "Adele", "Taylor Swift", "Ariana Grande", "Alicia Keys", "Whitney Houston", "Mariah Carey", "Jennifer Lopez", "Lady Gaga"],
      es: ["Rihanna", "Adele", "Taylor Swift", "Ariana Grande", "Alicia Keys", "Whitney Houston", "Mariah Carey", "Jennifer Lopez", "Lady Gaga"]
    }
  },
  {
    answer: {
      en: "The Beatles",
      es: "The Beatles"
    },
    imageUrl: "https://res.cloudinary.com/fact5-trivia-game/image/upload/v1/artists/the_beatles.jpg",
    facts: {
      "Genre": {
        en: "We started as a rock and roll band but evolved to incorporate pop, psychedelic rock, Indian classical music, avant-garde, and even electronic elements, constantly pushing the boundaries of what popular music could be throughout our career.",
        es: "Comenzamos como una banda de rock and roll pero evolucionamos para incorporar pop, rock psicodélico, música clásica india, avant-garde e incluso elementos electrónicos, constantemente empujando los límites de lo que la música popular podría ser durante nuestra carrera."
      },
      "Background": {
        en: "We formed in Liverpool in 1960, consisting of John Lennon, Paul McCartney, George Harrison, and Ringo Starr, emerging from the Mersey beat scene and honing our skills playing in clubs in Hamburg, Germany, and the Cavern Club in Liverpool.",
        es: "Nos formamos en Liverpool en 1960, consistiendo en John Lennon, Paul McCartney, George Harrison y Ringo Starr, emergiendo de la escena Mersey beat y perfeccionando nuestras habilidades tocando en clubes en Hamburgo, Alemania, y el Cavern Club en Liverpool."
      },
      "Iconic Song": {
        en: "Our song 'Yesterday' is one of the most covered songs in music history with over 2,200 recorded versions, while 'Hey Jude' spent nine weeks at number one and became our best-selling single, showcasing our evolution from pop to more complex compositions.",
        es: "Nuestra canción 'Yesterday' es una de las canciones más versionadas en la historia de la música con más de 2,200 versiones grabadas, mientras 'Hey Jude' pasó nueve semanas en el número uno y se convirtió en nuestro sencillo más vendido, mostrando nuestra evolución del pop a composiciones más complejas."
      },
      "Debut": {
        en: "Our debut single 'Love Me Do' was released in October 1962, reaching number 17 on the UK charts, followed by our breakthrough single 'Please Please Me' in 1963, which launched Beatlemania and changed popular music forever.",
        es: "Nuestro sencillo debut 'Love Me Do' fue lanzado en octubre de 1962, alcanzando el número 17 en las listas del Reino Unido, seguido por nuestro sencillo revolucionario 'Please Please Me' en 1963, que lanzó la Beatlemanía y cambió la música popular para siempre."
      },
      "Achievements": {
        en: "We are the best-selling music act of all time with estimated sales of 600 million units worldwide, we hold the record for most number-one hits on the Hot 100 chart, and we were inducted into the Rock and Roll Hall of Fame in 1988.",
        es: "Somos el acto musical más vendido de todos los tiempos con ventas estimadas de 600 millones de unidades mundialmente, tenemos el récord de más éxitos número uno en la lista Hot 100, y fuimos incluidos en el Salón de la Fama del Rock and Roll en 1988."
      },
      "Collaborations": {
        en: "While we primarily wrote and performed together as a group, we worked with producer George Martin who became known as the 'Fifth Beatle,' and we occasionally featured guest musicians like Eric Clapton, who played lead guitar on 'While My Guitar Gently Weeps.'",
        es: "Mientras principalmente escribimos y actuamos juntos como grupo, trabajamos con el productor George Martin quien se conoció como el 'Quinto Beatle,' y ocasionalmente presentamos músicos invitados como Eric Clapton, quien tocó guitarra principal en 'While My Guitar Gently Weeps'."
      },
      "Chart Performance": {
        en: "We dominated the charts in the 1960s with 20 number-one hits on the Billboard Hot 100, and in April 1964, we held the top five positions on the Hot 100 simultaneously, a feat that has never been matched by any other artist.",
        es: "Dominamos las listas en los años 60 con 20 éxitos número uno en el Billboard Hot 100, y en abril de 1964, mantuvimos las primeras cinco posiciones en el Hot 100 simultáneamente, una hazaña que nunca ha sido igualada por ningún otro artista."
      },
      "Wildcard": {
        en: "We were the first band to use feedback as a musical technique in 'I Feel Fine,' pioneered backward recording techniques, and our 1967 album 'Sgt. Pepper's Lonely Hearts Club Band' is often cited as the first concept album and one of the most influential albums ever made.",
        es: "Fuimos la primera banda en usar retroalimentación como técnica musical en 'I Feel Fine,' pioneros en técnicas de grabación hacia atrás, y nuestro álbum de 1967 'Sgt. Pepper's Lonely Hearts Club Band' es a menudo citado como el primer álbum conceptual y uno de los álbumes más influyentes jamás hechos."
      }
    },
    alternatives: {
      en: ["The Rolling Stones", "Led Zeppelin", "Queen", "Pink Floyd", "The Who", "The Beach Boys", "Bob Dylan", "Elvis Presley", "The Kinks"],
      es: ["The Rolling Stones", "Led Zeppelin", "Queen", "Pink Floyd", "The Who", "The Beach Boys", "Bob Dylan", "Elvis Presley", "The Kinks"]
    }
  },
  {
    answer: {
      en: "Michael Jackson",
      es: "Michael Jackson"
    },
    imageUrl: "https://res.cloudinary.com/fact5-trivia-game/image/upload/v1/artists/michael_jackson.jpg",
    facts: {
      "Genre": {
        en: "I mastered multiple genres including pop, rock, soul, funk, disco, and R&B, but I'm most known for creating a unique blend that transcended traditional genre boundaries, making my music universally appealing across all demographics and cultures.",
        es: "Dominé múltiples géneros incluyendo pop, rock, soul, funk, disco y R&B, pero soy más conocido por crear una mezcla única que trascendió los límites de géneros tradicionales, haciendo mi música universalmente atractiva a través de todas las demografías y culturas."
      },
      "Background": {
        en: "I was born in Gary, Indiana, in 1958, the eighth of ten children, and began performing at age five with my brothers in the Jackson 5, quickly becoming the group's lead singer and displaying exceptional talent that would define my entire career.",
        es: "Nací en Gary, Indiana, en 1958, el octavo de diez hijos, y comencé actuando a los cinco años con mis hermanos en los Jackson 5, rápidamente convirtiéndome en el cantante principal del grupo y mostrando talento excepcional que definiría toda mi carrera."
      },
      "Iconic Song": {
        en: "My song 'Billie Jean' became a global phenomenon with its distinctive bassline and my first moonwalk performance on Motown 25, while 'Thriller' not only became the title track of my best-selling album but also featured the most famous music video ever made.",
        es: "Mi canción 'Billie Jean' se convirtió en un fenómeno global con su línea de bajo distintiva y mi primera actuación de moonwalk en Motown 25, mientras 'Thriller' no solo se convirtió en la pista titular de mi álbum más vendido sino que también presentó el video musical más famoso jamás hecho."
      },
      "Debut": {
        en: "I released my first solo album 'Got to Be There' in 1972 at age 13 while still with the Jackson 5, but my breakthrough solo album was 'Off the Wall' in 1979, which established me as a solo artist and set the stage for 'Thriller.'",
        es: "Lancé mi primer álbum solista 'Got to Be There' en 1972 a los 13 años mientras aún estaba con los Jackson 5, pero mi álbum solista revolucionario fue 'Off the Wall' en 1979, que me estableció como artista solista y preparó el escenario para 'Thriller'."
      },
      "Achievements": {
        en: "I won 13 Grammy Awards as a solo artist, was inducted into the Rock and Roll Hall of Fame twice, and 'Thriller' remains the best-selling album of all time with over 66 million copies sold worldwide, earning me the title 'King of Pop.'",
        es: "Gané 13 premios Grammy como artista solista, fui incluido en el Salón de la Fama del Rock and Roll dos veces, y 'Thriller' permanece como el álbum más vendido de todos los tiempos con más de 66 millones de copias vendidas mundialmente, ganándome el título 'Rey del Pop'."
      },
      "Collaborations": {
        en: "I collaborated with legendary producer Quincy Jones on my most successful albums, worked with Paul McCartney on hits like 'The Girl Is Mine,' and featured guest artists like Slash on 'Black or White' and Janet Jackson on 'Scream.'",
        es: "Colaboré con el productor legendario Quincy Jones en mis álbumes más exitosos, trabajé con Paul McCartney en éxitos como 'The Girl Is Mine,' y presenté artistas invitados como Slash en 'Black or White' y Janet Jackson en 'Scream'."
      },
      "Chart Performance": {
        en: "I achieved 13 number-one hits on the Billboard Hot 100 as a solo artist, spent 37 weeks at number one with 'Billie Jean,' 'Beat It,' and 'Rock with You,' and 'Thriller' spent 37 non-consecutive weeks at number one on the Billboard 200.",
        es: "Logré 13 éxitos número uno en el Billboard Hot 100 como artista solista, pasé 37 semanas en el número uno con 'Billie Jean,' 'Beat It' y 'Rock with You,' y 'Thriller' pasó 37 semanas no consecutivas en el número uno del Billboard 200."
      },
      "Wildcard": {
        en: "I owned the rights to the Beatles' music catalog, purchasing ATV Music Publishing for $47.5 million in 1985, which included most of Lennon-McCartney's compositions, creating a famous rift with Paul McCartney who had taught me about music publishing.",
        es: "Poseía los derechos del catálogo musical de los Beatles, comprando ATV Music Publishing por $47.5 millones en 1985, que incluía la mayoría de las composiciones de Lennon-McCartney, creando una famosa división con Paul McCartney quien me había enseñado sobre publicación musical."
      }
    },
    alternatives: {
      en: ["Prince", "Whitney Houston", "Madonna", "Stevie Wonder", "Marvin Gaye", "James Brown", "Elvis Presley", "Diana Ross", "Lionel Richie"],
      es: ["Prince", "Whitney Houston", "Madonna", "Stevie Wonder", "Marvin Gaye", "James Brown", "Elvis Presley", "Diana Ross", "Lionel Richie"]
    }
  }
];

export class MusiciansGenerator extends BaseChallengeGenerator {
  constructor() {
    super(CategoryType.MUSICIANS, musicianFactTypes, musicianData);
  }
} 