// Simple rule-based keyword matcher — no ML/NLP, deliberately.
import { FAQ_ENTRIES, FALLBACK_ANSWER } from "./faqData";

function normalize(str) {
  return str.toLowerCase().trim();
}

// Scores each FAQ entry by how many of its keywords appear in the
// user's question, for the given language, and returns the best match.
export function matchFAQ(userInput, lang = "en") {
  const input = normalize(userInput);
  let bestMatch = null;
  let bestScore = 0;

  for (const entry of FAQ_ENTRIES) {
    const keywords = entry.keywords[lang] || entry.keywords.en;
    let score = 0;
    for (const kw of keywords) {
      if (input.includes(normalize(kw))) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  if (!bestMatch || bestScore === 0) {
    return { matched: false, answer: FALLBACK_ANSWER[lang] || FALLBACK_ANSWER.en };
  }
  return { matched: true, id: bestMatch.id, answer: bestMatch.answer[lang] || bestMatch.answer.en };
}