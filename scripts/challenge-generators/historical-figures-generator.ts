// scripts/challenge-generators/historical-figures-generator.ts
import { CategoryType, HistoricalFigureFactType } from '../../src/types';
import { BaseChallengeGenerator } from './generator';

// Historical figure fact types
const historicalFigureFactTypes: HistoricalFigureFactType[] = [
  "Occupation",
  "Early Life",
  "Nationality", 
  "Legacy",
  "Physical Appearance",
  "Famous Quotes",
  "Demise",
  "Wildcard"
];

// Historical figures data with facts for each fact type
const historicalFigureData = [
  {
    answer: {
      en: "Leonardo da Vinci",
      es: "Leonardo da Vinci"
    },
    imageUrl: "https://res.cloudinary.com/fact5-trivia-game/image/upload/v1/historical/leonardo_da_vinci.jpg",
    facts: {
      "Occupation": {
        en: "I was a Renaissance polymath who worked as an artist, inventor, engineer, scientist, mathematician, architect, anatomist, geologist, cartographer, botanist, and writer, truly embodying the ideal of the 'Renaissance man.'",
        es: "Fui un polímata del Renacimiento que trabajé como artista, inventor, ingeniero, científico, matemático, arquitecto, anatomista, geólogo, cartógrafo, botánico y escritor, verdaderamente encarnando el ideal del 'hombre del Renacimiento'."
      },
      "Early Life": {
        en: "I was born in 1452 in Vinci, a small town near Florence, as the illegitimate son of a notary, which initially limited my formal education but allowed me to develop my observational skills and curiosity about the natural world.",
        es: "Nací en 1452 en Vinci, un pequeño pueblo cerca de Florencia, como hijo ilegítimo de un notario, lo que inicialmente limitó mi educación formal pero me permitió desarrollar mis habilidades de observación y curiosidad sobre el mundo natural."
      },
      "Nationality": {
        en: "I was Italian, born during the height of the Italian Renaissance, and I worked in various Italian city-states including Florence, Milan, and Rome, as well as spending my final years in France under the patronage of King Francis I.",
        es: "Fui italiano, nacido durante el apogeo del Renacimiento italiano, y trabajé en varios estados-ciudad italianos incluyendo Florencia, Milán y Roma, así como pasando mis años finales en Francia bajo el patrocinio del Rey Francisco I."
      },
      "Legacy": {
        en: "I am remembered as one of history's greatest geniuses, with my paintings like the Mona Lisa and The Last Supper remaining iconic, while my scientific notebooks containing designs for flying machines, tanks, and anatomical studies were centuries ahead of their time.",
        es: "Soy recordado como uno de los más grandes genios de la historia, con mis pinturas como la Mona Lisa y La Última Cena permaneciendo icónicas, mientras mis cuadernos científicos conteniendo diseños para máquinas voladoras, tanques y estudios anatómicos estuvieron siglos adelantados a su tiempo."
      },
      "Physical Appearance": {
        en: "I was described as a tall, graceful man with long curly hair and a flowing beard in my later years, known for my elegant dress and striking presence, often wearing rose-colored tunics that reflected my artistic sensibility.",
        es: "Fui descrito como un hombre alto y elegante con cabello rizado largo y una barba fluida en mis años posteriores, conocido por mi vestimenta elegante y presencia llamativa, a menudo usando túnicas color rosa que reflejaban mi sensibilidad artística."
      },
      "Famous Quotes": {
        en: "I believed that 'Learning never exhausts the mind,' and 'Simplicity is the ultimate sophistication,' reflecting my lifelong pursuit of knowledge and my approach to both art and science through careful observation and elegant solutions.",
        es: "Creía que 'El aprendizaje nunca agota la mente' y 'La simplicidad es la sofisticación definitiva,' reflejando mi búsqueda de por vida del conocimiento y mi enfoque tanto del arte como la ciencia a través de observación cuidadosa y soluciones elegantes."
      },
      "Demise": {
        en: "I died on May 2, 1519, at the Château du Clos Lucé in France at age 67, reportedly in the arms of King Francis I, leaving behind thousands of pages of notes and sketches but also many unfinished paintings and inventions.",
        es: "Morí el 2 de mayo de 1519, en el Château du Clos Lucé en Francia a los 67 años, según se reporta en los brazos del Rey Francisco I, dejando atrás miles de páginas de notas y bocetos pero también muchas pinturas e invenciones sin terminar."
      },
      "Wildcard": {
        en: "I wrote all my personal notes in mirror script, from right to left, which could only be easily read using a mirror, possibly to keep my ideas secret or simply because I was left-handed and this prevented smudging the ink.",
        es: "Escribí todas mis notas personales en escritura espejo, de derecha a izquierda, que solo podía leerse fácilmente usando un espejo, posiblemente para mantener mis ideas en secreto o simplemente porque era zurdo y esto evitaba manchar la tinta."
      }
    },
    alternatives: {
      en: ["Michelangelo", "Galileo Galilei", "Raphael", "Dante Alighieri", "Marco Polo", "Christopher Columbus", "Niccolò Machiavelli", "Donatello", "Botticelli"],
      es: ["Miguel Ángel", "Galileo Galilei", "Rafael", "Dante Alighieri", "Marco Polo", "Cristóbal Colón", "Niccolò Machiavelli", "Donatello", "Botticelli"]
    }
  },
  {
    answer: {
      en: "Cleopatra",
      es: "Cleopatra"
    },
    imageUrl: "https://res.cloudinary.com/fact5-trivia-game/image/upload/v1/historical/cleopatra.jpg",
    facts: {
      "Occupation": {
        en: "I was the last active pharaoh of Ptolemaic Egypt, ruling as both a political leader and a religious figure, while also serving as a diplomat, naval commander, linguist, and administrator of one of the ancient world's wealthiest kingdoms.",
        es: "Fui la última faraona activa del Egipto Ptolemaico, gobernando tanto como líder política y figura religiosa, mientras también servía como diplomática, comandante naval, lingüista y administradora de uno de los reinos más ricos del mundo antiguo."
      },
      "Early Life": {
        en: "I was born around 69 BCE into the Ptolemaic dynasty, descendants of Alexander the Great's general Ptolemy I, and despite popular belief, I was actually of Macedonian Greek descent, not ethnically Egyptian, though I was the first Ptolemaic ruler to learn the Egyptian language.",
        es: "Nací alrededor del 69 a.C. en la dinastía Ptolemaica, descendientes del general de Alejandro Magno Ptolomeo I, y a pesar de la creencia popular, en realidad era de ascendencia griega macedonia, no étnicamente egipcia, aunque fui la primera gobernante ptolemaica en aprender el idioma egipcio."
      },
      "Nationality": {
        en: "I was Egyptian by rule and culture but Macedonian Greek by ancestry, representing the final chapter of the Hellenistic period in Egypt that had lasted over 300 years since Alexander the Great's conquest.",
        es: "Fui egipcia por gobierno y cultura pero griega macedonia por ascendencia, representando el capítulo final del período helenístico en Egipto que había durado más de 300 años desde la conquista de Alejandro Magno."
      },
      "Legacy": {
        en: "I am remembered as one of history's most powerful female rulers who maintained Egypt's independence for nearly two decades, spoke nine languages, was highly educated in mathematics and philosophy, and whose death marked the end of the Ptolemaic Kingdom and Egypt's incorporation into the Roman Empire.",
        es: "Soy recordada como una de las gobernantes femeninas más poderosas de la historia que mantuve la independencia de Egipto por casi dos décadas, hablaba nueve idiomas, estaba altamente educada en matemáticas y filosofía, y cuya muerte marcó el fin del Reino Ptolemaico y la incorporación de Egipto al Imperio Romano."
      },
      "Physical Appearance": {
        en: "Contrary to later romanticized depictions, contemporary accounts and coins suggest I had a prominent nose, strong chin, and was likely of average attractiveness, but possessed remarkable charisma, intelligence, and a commanding presence that made me irresistibly compelling to those who met me.",
        es: "Contrario a las representaciones romantizadas posteriores, los relatos contemporáneos y monedas sugieren que tenía una nariz prominente, barbilla fuerte, y probablemente era de atractivo promedio, pero poseía carisma notable, inteligencia y una presencia imponente que me hacía irresistiblemente convincente para quienes me conocían."
      },
      "Famous Quotes": {
        en: "I was reported to have said 'I will not be triumphed over,' referring to my refusal to be paraded as a captive in Rome, and 'Age cannot wither her, nor custom stale her infinite variety,' though this latter quote was actually Shakespeare's description of me.",
        es: "Se reportó que dije 'No seré triunfada,' refiriéndome a mi negativa a ser paseada como cautiva en Roma, y 'La edad no puede marchitarla, ni la costumbre empalagar su variedad infinita,' aunque esta última cita fue en realidad la descripción de Shakespeare de mí."
      },
      "Demise": {
        en: "I died on August 12, 30 BCE, at age 39, by suicide rather than face the humiliation of being displayed as a trophy in Octavian's triumph in Rome, most likely by allowing an asp (Egyptian cobra) to bite me, though the exact method remains historically debated.",
        es: "Morí el 12 de agosto del 30 a.C., a los 39 años, por suicidio en lugar de enfrentar la humillación de ser exhibida como trofeo en el triunfo de Octavio en Roma, muy probablemente permitiendo que un áspid (cobra egipcia) me mordiera, aunque el método exacto permanece históricamente debatido."
      },
      "Wildcard": {
        en: "I once had myself smuggled to Julius Caesar wrapped in a carpet or bed linens to avoid my brother's guards, and later arrived to meet Mark Antony dressed as the goddess Aphrodite on a golden barge with purple sails, demonstrating my flair for dramatic political theater.",
        es: "Una vez me hice contrabandear a Julio César envuelta en una alfombra o ropa de cama para evitar a los guardias de mi hermano, y más tarde llegué a encontrarme con Marco Antonio vestida como la diosa Afrodita en una barcaza dorada con velas púrpura, demostrando mi talento para el teatro político dramático."
      }
    },
    alternatives: {
      en: ["Nefertiti", "Hatshepsut", "Alexander the Great", "Julius Caesar", "Mark Antony", "Octavian", "Ptolemy", "Ramesses II", "Akhenaten"],
      es: ["Nefertiti", "Hatshepsut", "Alejandro Magno", "Julio César", "Marco Antonio", "Octavio", "Ptolomeo", "Ramsés II", "Akhenaton"]
    }
  },
  {
    answer: {
      en: "Albert Einstein",
      es: "Albert Einstein"
    },
    imageUrl: "https://res.cloudinary.com/fact5-trivia-game/image/upload/v1/historical/albert_einstein.jpg",
    facts: {
      "Occupation": {
        en: "I was a theoretical physicist who developed the theory of relativity, one of the two pillars of modern physics alongside quantum mechanics, while also working as a patent examiner, professor, and later as a humanitarian and civil rights advocate.",
        es: "Fui un físico teórico que desarrollé la teoría de la relatividad, uno de los dos pilares de la física moderna junto con la mecánica cuántica, mientras también trabajaba como examinador de patentes, profesor, y más tarde como humanitario y defensor de los derechos civiles."
      },
      "Early Life": {
        en: "I was born in 1879 in Ulm, in the Kingdom of Württemberg in the German Empire, to a middle-class Jewish family, and despite popular myths, I was actually an excellent student, though I did clash with the rigid educational system of my time.",
        es: "Nací en 1879 en Ulm, en el Reino de Württemberg en el Imperio Alemán, en una familia judía de clase media, y a pesar de los mitos populares, en realidad era un estudiante excelente, aunque sí choqué con el sistema educativo rígido de mi época."
      },
      "Nationality": {
        en: "I was German-born but renounced my German citizenship in 1896, became Swiss in 1901, then regained German citizenship in 1914, and finally became an American citizen in 1940 after fleeing Nazi persecution, truly becoming a citizen of the world.",
        es: "Nací alemán pero renuncié a mi ciudadanía alemana en 1896, me hice suizo en 1901, luego recuperé la ciudadanía alemana en 1914, y finalmente me convertí en ciudadano estadounidense en 1940 después de huir de la persecución nazi, verdaderamente convirtiéndome en un ciudadano del mundo."
      },
      "Legacy": {
        en: "My theories revolutionized our understanding of space, time, and gravity, leading to technologies like GPS satellites and nuclear energy, while my equation E=mc² became the world's most famous formula, and I became a global symbol of genius and scientific achievement.",
        es: "Mis teorías revolucionaron nuestra comprensión del espacio, tiempo y gravedad, llevando a tecnologías como satélites GPS y energía nuclear, mientras mi ecuación E=mc² se convirtió en la fórmula más famosa del mundo, y me convertí en un símbolo global de genio y logro científico."
      },
      "Physical Appearance": {
        en: "I was of medium height with wild, unkempt gray hair that became my trademark, expressive dark eyes, and a bushy mustache, often dressed casually in sweaters and without socks, reflecting my disregard for conventional appearance and social conventions.",
        es: "Era de estatura mediana con cabello gris salvaje y despeinado que se convirtió en mi marca registrada, ojos oscuros expresivos y un bigote espeso, a menudo vestido casualmente con suéteres y sin calcetines, reflejando mi desprecio por la apariencia convencional y las convenciones sociales."
      },
      "Famous Quotes": {
        en: "I believed that 'Imagination is more important than knowledge,' and 'The important thing is not to stop questioning,' while also noting that 'God does not play dice with the universe,' reflecting my belief in the fundamental order of nature despite quantum mechanics' apparent randomness.",
        es: "Creía que 'La imaginación es más importante que el conocimiento,' y 'Lo importante es no dejar de cuestionar,' mientras también notaba que 'Dios no juega dados con el universo,' reflejando mi creencia en el orden fundamental de la naturaleza a pesar de la aparente aleatoriedad de la mecánica cuántica."
      },
      "Demise": {
        en: "I died on April 18, 1955, at age 76 in Princeton, New Jersey, from an abdominal aortic aneurysm, refusing surgery with the words 'I want to go when I want. It is tasteless to prolong life artificially,' maintaining my independence of thought until the end.",
        es: "Morí el 18 de abril de 1955, a los 76 años en Princeton, Nueva Jersey, de un aneurisma aórtico abdominal, rechazando cirugía con las palabras 'Quiero irme cuando yo quiera. Es de mal gusto prolongar la vida artificialmente,' manteniendo mi independencia de pensamiento hasta el final."
      },
      "Wildcard": {
        en: "After my death, pathologist Thomas Harvey secretly removed my brain during the autopsy and kept it for decades, studying it in hopes of discovering the source of my genius, though modern analysis has found few significant differences from normal brains.",
        es: "Después de mi muerte, el patólogo Thomas Harvey secretamente removió mi cerebro durante la autopsia y lo mantuvo por décadas, estudiándolo con la esperanza de descubrir la fuente de mi genio, aunque el análisis moderno ha encontrado pocas diferencias significativas de cerebros normales."
      }
    },
    alternatives: {
      en: ["Isaac Newton", "Galileo Galilei", "Charles Darwin", "Nikola Tesla", "Marie Curie", "Stephen Hawking", "Niels Bohr", "Max Planck", "Werner Heisenberg"],
      es: ["Isaac Newton", "Galileo Galilei", "Charles Darwin", "Nikola Tesla", "Marie Curie", "Stephen Hawking", "Niels Bohr", "Max Planck", "Werner Heisenberg"]
    }
  }
];

export class HistoricalFiguresGenerator extends BaseChallengeGenerator {
  constructor() {
    super(CategoryType.HISTORICAL_FIGURES, historicalFigureFactTypes, historicalFigureData);
  }
} 