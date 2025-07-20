// scripts/challenge-generators/athletes-generator.ts
import { CategoryType, AthleteFactType } from '../../src/types';
import { BaseChallengeGenerator } from './generator';

// Athlete fact types
const athleteFactTypes: AthleteFactType[] = [
  "Personal Life",
  "Affiliations",
  "Era", 
  "Nationality",
  "Physique",
  "Stats",
  "Achievements",
  "Wildcard"
];

// Athletes data with facts for each fact type
const athleteData = [
  {
    answer: {
      en: "Michael Jordan",
      es: "Michael Jordan"
    },
    imageUrl: "https://res.cloudinary.com/fact5-trivia-game/image/upload/v1/athletes/michael_jordan.jpg",
    facts: {
      "Personal Life": {
        en: "I was born in Brooklyn, New York, but raised in Wilmington, North Carolina, where I developed my competitive drive partly from being cut from my high school varsity basketball team as a sophomore.",
        es: "Nací en Brooklyn, Nueva York, pero fui criado en Wilmington, Carolina del Norte, donde desarrollé mi impulso competitivo en parte por ser eliminado del equipo universitario de baloncesto de mi escuela secundaria como estudiante de segundo año."
      },
      "Affiliations": {
        en: "I played 15 seasons in the NBA, primarily with the Chicago Bulls where I won six championships, with a brief retirement to play baseball for the Birmingham Barons, a minor league affiliate of the Chicago White Sox.",
        es: "Jugué 15 temporadas en la NBA, principalmente con los Chicago Bulls donde gané seis campeonatos, con un breve retiro para jugar béisbol para los Birmingham Barons, un afiliado de ligas menores de los Chicago White Sox."
      },
      "Era": {
        en: "I dominated professional basketball from 1984 to 2003, with my peak years in the 1990s when I led the Bulls to six NBA championships in eight years, defining the golden era of basketball.",
        es: "Dominé el baloncesto profesional de 1984 a 2003, con mis años pico en los años 90 cuando llevé a los Bulls a seis campeonatos de la NBA en ocho años, definiendo la era dorada del baloncesto."
      },
      "Nationality": {
        en: "I am American, born and raised in the United States, and I represented my country in international competition, winning gold medals in the 1984 and 1992 Olympics as part of the legendary 'Dream Team.'",
        es: "Soy estadounidense, nacido y criado en los Estados Unidos, y representé a mi país en competencia internacional, ganando medallas de oro en las Olimpiadas de 1984 y 1992 como parte del legendario 'Dream Team'."
      },
      "Physique": {
        en: "I stand 6 feet 6 inches tall with exceptional athleticism, featuring large hands that helped me palm basketballs effortlessly and incredible leaping ability that earned me the nickname 'His Airness.'",
        es: "Mido 6 pies 6 pulgadas de altura con atletismo excepcional, con manos grandes que me ayudaron a agarrar balones de baloncesto sin esfuerzo y habilidad de salto increíble que me valió el apodo 'His Airness'."
      },
      "Stats": {
        en: "I averaged 30.1 points per game over my NBA career, the highest in league history, while also averaging 6.2 rebounds and 5.3 assists per game, and I scored over 32,000 career points.",
        es: "Promedié 30.1 puntos por partido durante mi carrera en la NBA, el más alto en la historia de la liga, mientras también promedié 6.2 rebotes y 5.3 asistencias por partido, y anoté más de 32,000 puntos en mi carrera."
      },
      "Achievements": {
        en: "I won six NBA championships, five MVP awards, six Finals MVP awards, 14 All-Star selections, and was inducted into the Basketball Hall of Fame in 2009, widely considered the greatest basketball player of all time.",
        es: "Gané seis campeonatos de la NBA, cinco premios MVP, seis premios MVP de las Finales, 14 selecciones All-Star, y fui incluido en el Salón de la Fama del Baloncesto en 2009, ampliamente considerado el mejor jugador de baloncesto de todos los tiempos."
      },
      "Wildcard": {
        en: "My signature shoe line with Nike, the Air Jordan brand, revolutionized sports marketing and continues to generate over $3 billion in annual revenue decades after my retirement, making me one of the highest-paid retired athletes ever.",
        es: "Mi línea de zapatos exclusiva con Nike, la marca Air Jordan, revolucionó el marketing deportivo y continúa generando más de $3 mil millones en ingresos anuales décadas después de mi retiro, convirtiéndome en uno de los atletas retirados mejor pagados de la historia."
      }
    },
    alternatives: {
      en: ["LeBron James", "Kobe Bryant", "Magic Johnson", "Larry Bird", "Shaquille O'Neal", "Kareem Abdul-Jabbar", "Tim Duncan", "Stephen Curry", "Wilt Chamberlain"],
      es: ["LeBron James", "Kobe Bryant", "Magic Johnson", "Larry Bird", "Shaquille O'Neal", "Kareem Abdul-Jabbar", "Tim Duncan", "Stephen Curry", "Wilt Chamberlain"]
    }
  },
  {
    answer: {
      en: "Serena Williams",
      es: "Serena Williams"
    },
    imageUrl: "https://res.cloudinary.com/fact5-trivia-game/image/upload/v1/athletes/serena_williams.jpg",
    facts: {
      "Personal Life": {
        en: "I was born in Saginaw, Michigan, but raised in Compton, California, where I learned tennis on public courts with my father as my coach and my sister Venus as my primary practice partner and rival.",
        es: "Nací en Saginaw, Michigan, pero fui criada en Compton, California, donde aprendí tenis en canchas públicas con mi padre como entrenador y mi hermana Venus como mi compañera de práctica principal y rival."
      },
      "Affiliations": {
        en: "I have been sponsored by Nike since 2003 in a deal worth over $40 million, and I've been associated with various charities including the Serena Williams Foundation, which focuses on education and community violence prevention.",
        es: "He sido patrocinada por Nike desde 2003 en un acuerdo valorado en más de $40 millones, y he estado asociada con varias organizaciones benéficas incluyendo la Fundación Serena Williams, que se enfoca en educación y prevención de violencia comunitaria."
      },
      "Era": {
        en: "I dominated women's tennis from 1999 to 2022, spanning over two decades of professional play, with my peak dominance occurring in the 2010s when I held all four Grand Slam titles simultaneously twice.",
        es: "Dominé el tenis femenino de 1999 a 2022, abarcando más de dos décadas de juego profesional, con mi dominio pico ocurriendo en los 2010s cuando mantuve los cuatro títulos de Grand Slam simultáneamente dos veces."
      },
      "Nationality": {
        en: "I am American and have represented the United States in international competition, winning four Olympic gold medals including three in doubles with my sister Venus and one in singles at the 2012 London Olympics.",
        es: "Soy estadounidense y he representado a los Estados Unidos en competencia internacional, ganando cuatro medallas de oro olímpicas incluyendo tres en dobles con mi hermana Venus y una en individuales en las Olimpiadas de Londres 2012."
      },
      "Physique": {
        en: "I stand 5 feet 9 inches tall with exceptional power and athleticism, known for my muscular build and powerful serve that regularly exceeded 120 mph, making me one of the most physically dominant players in tennis history.",
        es: "Mido 5 pies 9 pulgadas de altura con poder y atletismo excepcionales, conocida por mi constitución muscular y saque poderoso que regularmente excedía 120 mph, convirtiéndome en una de las jugadoras físicamente más dominantes en la historia del tenis."
      },
      "Stats": {
        en: "I won 23 Grand Slam singles titles, the most in the Open Era, spent 319 weeks ranked as the world's No. 1 player, and achieved a career prize money total of over $94 million, the highest in women's tennis history.",
        es: "Gané 23 títulos de Grand Slam en individuales, el más en la Era Abierta, pasé 319 semanas clasificada como la jugadora No. 1 del mundo, y logré un total de premios en dinero de carrera de más de $94 millones, el más alto en la historia del tenis femenino."
      },
      "Achievements": {
        en: "I completed the career Grand Slam in singles and doubles, won the 'Serena Slam' (holding all four major titles at once) twice, and was named AP Female Athlete of the Year five times, cementing my status as one of the greatest athletes ever.",
        es: "Completé el Grand Slam de carrera en individuales y dobles, gané el 'Serena Slam' (manteniendo los cuatro títulos principales a la vez) dos veces, y fui nombrada Atleta Femenina del Año por AP cinco veces, cementando mi estatus como una de las mejores atletas de la historia."
      },
      "Wildcard": {
        en: "I won the 2017 Australian Open while eight weeks pregnant with my daughter, defeating my sister Venus in the final, and this victory was later revealed to be one of the most remarkable athletic achievements in sports history.",
        es: "Gané el Abierto de Australia 2017 mientras estaba embarazada de ocho semanas con mi hija, derrotando a mi hermana Venus en la final, y esta victoria fue posteriormente revelada como uno de los logros atléticos más notables en la historia deportiva."
      }
    },
    alternatives: {
      en: ["Venus Williams", "Steffi Graf", "Martina Navratilova", "Chris Evert", "Maria Sharapova", "Simona Halep", "Naomi Osaka", "Billie Jean King", "Monica Seles"],
      es: ["Venus Williams", "Steffi Graf", "Martina Navratilova", "Chris Evert", "Maria Sharapova", "Simona Halep", "Naomi Osaka", "Billie Jean King", "Monica Seles"]
    }
  },
  {
    answer: {
      en: "Usain Bolt",
      es: "Usain Bolt"
    },
    imageUrl: "https://res.cloudinary.com/fact5-trivia-game/image/upload/v1/athletes/usain_bolt.jpg",
    facts: {
      "Personal Life": {
        en: "I was born in Sherwood Content, a small town in Jamaica, where I grew up playing cricket and football before discovering my exceptional sprinting ability as a teenager at William Knibb Memorial High School.",
        es: "Nací en Sherwood Content, un pequeño pueblo en Jamaica, donde crecí jugando cricket y fútbol antes de descubrir mi habilidad excepcional para correr como adolescente en William Knibb Memorial High School."
      },
      "Affiliations": {
        en: "I was sponsored by Puma throughout my career in a deal worth over $10 million annually, and I represented the Racers Track Club in Kingston, Jamaica, under coach Glen Mills who helped refine my technique.",
        es: "Fui patrocinado por Puma durante toda mi carrera en un acuerdo valorado en más de $10 millones anuales, y representé al Racers Track Club en Kingston, Jamaica, bajo el entrenador Glen Mills quien ayudó a refinar mi técnica."
      },
      "Era": {
        en: "I dominated world sprinting from 2008 to 2017, competing in an era with exceptional depth in sprint events, and my rivalry with fellow sprinters like Justin Gatlin and Yohan Blake elevated the sport to new heights.",
        es: "Dominé el sprint mundial de 2008 a 2017, compitiendo en una era con profundidad excepcional en eventos de sprint, y mi rivalidad con otros velocistas como Justin Gatlin y Yohan Blake elevó el deporte a nuevas alturas."
      },
      "Nationality": {
        en: "I am Jamaican and proudly represented Jamaica throughout my career, helping put my small Caribbean nation on the global athletics map and inspiring a generation of Jamaican sprinters who continue to dominate world sprinting.",
        es: "Soy jamaicano y orgullosamente representé a Jamaica durante toda mi carrera, ayudando a poner mi pequeña nación caribeña en el mapa atlético global e inspirando a una generación de velocistas jamaicanos que continúan dominando el sprint mundial."
      },
      "Physique": {
        en: "I stand 6 feet 5 inches tall, unusually tall for a sprinter, with long legs that give me an enormous stride length of over 9 feet, allowing me to take fewer steps than my competitors while covering the same distance.",
        es: "Mido 6 pies 5 pulgadas de altura, inusualmente alto para un velocista, con piernas largas que me dan una longitud de zancada enorme de más de 9 pies, permitiéndome dar menos pasos que mis competidores mientras cubro la misma distancia."
      },
      "Stats": {
        en: "I hold the world records in both the 100 meters (9.58 seconds) and 200 meters (19.19 seconds), both set at the 2009 World Championships in Berlin, and I'm the only sprinter to win three consecutive Olympic titles in both events.",
        es: "Tengo los récords mundiales tanto en los 100 metros (9.58 segundos) como en los 200 metros (19.19 segundos), ambos establecidos en los Campeonatos Mundiales de 2009 en Berlín, y soy el único velocista en ganar tres títulos olímpicos consecutivos en ambos eventos."
      },
      "Achievements": {
        en: "I won eight Olympic gold medals and 11 World Championship gold medals, completed an unprecedented 'triple-triple' by winning the 100m, 200m, and 4x100m relay at three consecutive Olympics (2008, 2012, 2016).",
        es: "Gané ocho medallas de oro olímpicas y 11 medallas de oro en Campeonatos Mundiales, completé un 'triple-triple' sin precedentes al ganar los 100m, 200m y relevo 4x100m en tres Olimpiadas consecutivas (2008, 2012, 2016)."
      },
      "Wildcard": {
        en: "Despite my incredible speed, I have scoliosis (curvature of the spine) which doctors said could limit my athletic potential, but I turned this perceived disadvantage into part of my unique running style and success.",
        es: "A pesar de mi velocidad increíble, tengo escoliosis (curvatura de la columna) que los doctores dijeron que podría limitar mi potencial atlético, pero convertí esta desventaja percibida en parte de mi estilo único de correr y éxito."
      }
    },
    alternatives: {
      en: ["Carl Lewis", "Jesse Owens", "Justin Gatlin", "Yohan Blake", "Asafa Powell", "Maurice Greene", "Donovan Bailey", "Ben Johnson", "Tyson Gay"],
      es: ["Carl Lewis", "Jesse Owens", "Justin Gatlin", "Yohan Blake", "Asafa Powell", "Maurice Greene", "Donovan Bailey", "Ben Johnson", "Tyson Gay"]
    }
  }
];

export class AthletesGenerator extends BaseChallengeGenerator {
  constructor() {
    super(CategoryType.ATHLETES, athleteFactTypes, athleteData);
  }
} 