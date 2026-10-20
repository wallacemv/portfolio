/**
 * Moderação de palavrões e ofensas — espelho de
 * `node-websocket-server/lib/moderation.js`.
 *
 * Cada lado cuida de uma direção da conversa:
 *  - aqui (widget) a gente mascara a PRÓPRIA mensagem, que é renderizada e
 *    salva no localStorage sem eco pelo servidor;
 *  - lá no servidor mascararam-se a resposta do assistente e o contexto do
 *    Gemini, para um cliente fora do widget não passar reto.
 * Se mexer numa lista, mexe na outra.
 *
 * Máscara: primeira letra + asterixos, preservando o tamanho:
 *   maskAbuse('isso é uma merda') === 'isso é uma m****'
 *   maskAbuse('filho da puta')    === 'f**** ** p***'
 *
 * A comparação ignora acento ("otário" é o mesmo que "otario") e aceita
 * plural/arranjo ("filhos da puta", "fodase").
 */

export const ABUSOS = [
  // palavrões pt-BR
  "caralho",
  "merda",
  "bosta",
  "porra",
  "puta",
  "puto",
  "putaria",
  "foder",
  "foda-se",
  "foda",
  "fodido",
  "fdp",
  "buceta",
  "xoxota",
  "xereca",
  "piroca",
  "punheta",
  "punheteiro",
  "boquete",
  "cuzao",
  "cu",
  "arrombado",
  "arrombada",
  "vagabunda",
  "vagabundo",
  "corno",
  "desgraca",
  "desgracado",
  "desgracada",
  "filho da puta",
  "vsf",
  "vtnc",
  "pqp",
  "ppk",
  "viado",
  "viada",
  "mongoloide",
  // ofensas pt-BR
  "idiota",
  "imbecil",
  "babaca",
  "otario",
  "otaria",
  "trouxa",
  "palhoco",
  "bocal",
  "burro",
  "retardado",
  // inglês
  "fuck",
  "fucking",
  "fucked",
  "fuk",
  "motherfucker",
  "shit",
  "shitty",
  "bitch",
  "asshole",
  "bastard",
  "dick",
  "cock",
  "pussy",
  "cum",
  "whore",
  "slut",
  "stfu",
  "idiot",
  "nigger",
  "nigga",
];

// "otario" precisa casar com "otário" sem perder a letra original da máscara
const CHAR_CLASS = {
  a: "[aáàâãä]",
  e: "[eéèêë]",
  i: "[iíìîï]",
  o: "[oóòôõö]",
  u: "[uúùûü]",
  c: "[cç]",
};

const ESCAPE_RE = /[.*+?^${}()|[\]\\]/g;

function segmentToPattern(segment) {
  return Array.from(segment)
    .map((ch) => CHAR_CLASS[ch] || ch.replace(ESCAPE_RE, "\\$&"))
    .join("");
}

function wordToPattern(word) {
  // separador opcional ("foda-se"/"fodase", "filho da puta"/"filhodaputa") e
  // plural solto em qualquer segmento ("filhos da puta", "merdas")
  return (
    word
      .split(/[\s-]+/)
      .map(segmentToPattern)
      .join("s?[-\\s]*") + "s?"
  );
}

// Palavra inteira, nunca no meio de outra: \b é ASCII, então usamos o
// lookaround com propriedades unicode ("cu" não casa em "cursos").
const ABUSE_PATTERN = new RegExp(
  `(?<![\\p{L}\\p{N}])(?:${[...ABUSOS]
    .sort((a, b) => b.length - a.length)
    .map(wordToPattern)
    .join("|")})(?![\\p{L}\\p{N}])`,
  "giu",
);

function maskWord(word) {
  if (word.length <= 2) return "*".repeat(word.length);
  return word[0] + "*".repeat(word.length - 1);
}

export function maskAbuse(text) {
  if (typeof text !== "string" || text.length === 0) return text;
  // replace com flag g zera o lastIndex — é seguro reutilizar o RegExp
  return text.replace(ABUSE_PATTERN, (match) =>
    match
      .split(/([\s-]+)/)
      .map((part) => (/^[\s-]+$/.test(part) ? part : maskWord(part)))
      .join(""),
  );
}

// Apelido: sem quebra de linha/tab, no máximo 20 caracteres e mascarado
// (quem se apresentar como "FDP" aparece como "F**").
export function sanitizeUsername(name) {
  if (typeof name !== "string") return "";
  return maskAbuse(
    name
      .replace(/[\r\n\t]+/g, " ")
      .trim()
      .slice(0, 20),
  );
}
