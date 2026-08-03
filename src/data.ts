import type { OdysseyTask } from "./types";

export const topics = [
  "Population",
  "Indigenous history",
  "Race",
  "Neighborhoods",
  "Economy",
  "Climate",
  "Arts and culture",
  "Parks",
  "Sports",
  "Government",
  "Education",
];

const recommendations = [...topics];

export const tasks: OdysseyTask[] = [
  {
    id: "disaster",
    type: "single-choice",
    topic: "History",
    articleSectionId: "history",
    articlePassageId: "history-earthquake",
    instruction: "Choose one answer using the article section on the left.",
    question: "What natural disaster struck San Francisco in 1906?",
    points: 1,
    options: [
      { id: "flood", label: "Flood" },
      { id: "earthquake", label: "Earthquake and fire" },
      { id: "hurricane", label: "Hurricane" },
      { id: "tornado", label: "Tornado" },
    ],
    correctOptionIds: ["earthquake"],
    explanation:
      "The 1906 earthquake and subsequent fires destroyed more than three-quarters of San Francisco. The city was quickly rebuilt.",
    recommendationTopics: recommendations,
  },
  {
    id: "transport",
    type: "multiple-choice",
    topic: "Infrastructure",
    articleSectionId: "infrastructure",
    articlePassageId: "transport-options",
    instruction: "Choose every answer supported by the article section on the left.",
    question: "Which public transportation systems help keep this hilly city moving?",
    points: 2,
    options: [
      { id: "caltrain", label: "Caltrain" },
      { id: "muni", label: "Muni" },
      { id: "metro-sf", label: "Metro SF" },
      { id: "bart", label: "BART" },
    ],
    correctOptionIds: ["caltrain", "muni", "bart"],
    explanation:
      "Muni, BART, and Caltrain form the core of public transportation in and around San Francisco. “Metro SF” is not a transit agency.",
  },
  {
    id: "tallest-hill",
    type: "short-answer",
    topic: "Geography",
    articleSectionId: "geography",
    articlePassageId: "mount-davidson",
    instruction: "Drag-select the answer from the article, or type one or two words.",
    question: "Which is the tallest hill in San Francisco?",
    points: 2,
    acceptedAnswers: ["mount davidson", "mt davidson", "mt. davidson"],
    explanation: "Mount Davidson is San Francisco's tallest natural point at 928 feet (283 m).",
    recommendationTopics: recommendations,
  },
  {
    id: "population-check",
    type: "fact-check",
    topic: "Population",
    articleSectionId: "demographics",
    articlePassageId: "population-statement",
    instruction: "Verify this claim with a reliable source outside Wikipedia.",
    question: "This page says San Francisco's population is 873,965. Is that information current?",
    points: 4,
    options: [
      { id: "yes", label: "Yes" },
      { id: "no", label: "No" },
    ],
    correctOptionIds: ["no"],
    acceptedAnswers: ["808988", "808,988"],
    explanation:
      "The figure shown was from the 2020 census. A newer estimate should replace it and be supported by a reliable citation.",
    impactMessage:
      "This page is viewed by 5,800 readers monthly. Your contribution will help readers find more accurate information.",
    requiresCitation: true,
    recommendationTopics: recommendations,
  },
  {
    id: "population-update",
    type: "contribution",
    topic: "Population",
    articleSectionId: "demographics",
    articlePassageId: "population-statement",
    instruction: "Highlight any article text, then replace it using a reliable source.",
    question: "Improve outdated information with a sourced replacement.",
    points: 5,
    existingText:
      "The 2020 United States census showed San Francisco's population to be 873,965, an increase of 8.5% from the 2010 census.",
    explanation:
      "Strong contributions make a focused change, explain the update clearly, and cite a trustworthy source.",
    impactMessage: "You moved from checking knowledge to improving it for the next reader.",
    requiresCitation: true,
    recommendationTopics: recommendations,
  },
  {
    id: "neighborhoods",
    type: "single-choice",
    topic: "Neighborhoods",
    articleSectionId: "neighborhoods",
    articlePassageId: "neighborhood-landmarks",
    instruction: "Choose one answer using the article section on the left.",
    question: "Which San Francisco street is famous for its steep, crooked section?",
    points: 1,
    options: [
      { id: "market", label: "Market Street" },
      { id: "lombard", label: "Lombard Street" },
      { id: "mission", label: "Mission Street" },
      { id: "van-ness", label: "Van Ness Avenue" },
    ],
    correctOptionIds: ["lombard"],
    explanation:
      "Lombard Street is known internationally for the eight hairpin turns in its steep Russian Hill block.",
    recommendationTopics: recommendations,
  },
  {
    id: "economy-check",
    type: "fact-check",
    topic: "Economy",
    articleSectionId: "economy",
    articlePassageId: "economy-statement",
    instruction: "Verify one more claim with a reliable source outside Wikipedia.",
    question: "The article calls tourism San Francisco's largest private-sector industry. Is that claim sufficiently precise?",
    points: 4,
    options: [
      { id: "yes", label: "Yes" },
      { id: "no", label: "No" },
    ],
    correctOptionIds: ["no"],
    explanation:
      "Broad economic claims can become misleading as industries change. A precise date, measure, and citation make the statement verifiable.",
    requiresCitation: true,
    recommendationTopics: recommendations,
  },
  {
    id: "final-contribution",
    type: "contribution",
    topic: "Selected topic",
    articleSectionId: "economy",
    articlePassageId: "economy-statement",
    instruction: "Highlight any article text, then replace it using a reliable source.",
    question: "Make one final sourced improvement to complete WikiPlay.",
    points: 5,
    existingText:
      "San Francisco is a global center of economic activity, technology, arts, sciences, and tourism.",
    explanation:
      "A concise, sourced addition is easier for volunteer editors to review and more useful to readers.",
    impactMessage: "Your contribution is ready for community review.",
    requiresCitation: true,
  },
];

const topicTargets: Record<string, Pick<OdysseyTask, "topic" | "articleSectionId" | "articlePassageId">> = {
  Population: { topic: "Population", articleSectionId: "demographics", articlePassageId: "population-statement" },
  "Indigenous history": { topic: "Indigenous history", articleSectionId: "history", articlePassageId: "indigenous-history" },
  Race: { topic: "Race", articleSectionId: "demographics", articlePassageId: "race-statement" },
  Neighborhoods: { topic: "Neighborhoods", articleSectionId: "neighborhoods", articlePassageId: "neighborhood-landmarks" },
  Economy: { topic: "Economy", articleSectionId: "economy", articlePassageId: "economy-statement" },
  Climate: { topic: "Climate", articleSectionId: "climate", articlePassageId: "climate-statement" },
  "Arts and culture": { topic: "Arts and culture", articleSectionId: "arts-culture", articlePassageId: "arts-statement" },
  Parks: { topic: "Parks", articleSectionId: "parks", articlePassageId: "parks-statement" },
  Sports: { topic: "Sports", articleSectionId: "sports", articlePassageId: "sports-statement" },
  Government: { topic: "Government", articleSectionId: "government", articlePassageId: "government-statement" },
  Education: { topic: "Education", articleSectionId: "education", articlePassageId: "education-statement" },
};

export function resolveTask(step: number, selectedTopic?: string): OdysseyTask {
  const task = tasks[step];
  if (!task || !selectedTopic || (step !== 5 && step !== 7)) return task;

  const target = topicTargets[selectedTopic];
  if (!target) return task;

  if (step === 5) {
    const prompts: Record<string, string> = {
      Population: "Which figure is used for San Francisco's 2020 census population?",
      "Indigenous history": "Which Indigenous people lived in the San Francisco area before European settlement?",
      Race: "Which census is the demographic section primarily based on?",
      Neighborhoods: "Which street is famous for its steep, crooked section?",
      Economy: "Which industry helped make San Francisco a global technology center?",
      Climate: "Which climate type best describes San Francisco?",
      "Arts and culture": "Which institution is San Francisco's modern art museum?",
      Parks: "Which major park stretches west toward the Pacific Ocean?",
      Sports: "Which Major League Baseball team plays at Oracle Park?",
      Government: "How many members serve on San Francisco's Board of Supervisors?",
      Education: "Which university is dedicated to graduate health and biomedical sciences?",
    };
    const answers: Record<string, { options: OdysseyTask["options"]; correct: string[] }> = {
      Population: { options: [{ id: "873965", label: "873,965" }, { id: "808988", label: "808,988" }, { id: "715674", label: "715,674" }], correct: ["873965"] },
      "Indigenous history": { options: [{ id: "ramaytush", label: "Ramaytush Ohlone" }, { id: "navajo", label: "Navajo" }, { id: "seminole", label: "Seminole" }], correct: ["ramaytush"] },
      Race: { options: [{ id: "2020", label: "2020 census" }, { id: "1990", label: "1990 census" }, { id: "1950", label: "1950 census" }], correct: ["2020"] },
      Neighborhoods: { options: [{ id: "lombard", label: "Lombard Street" }, { id: "market", label: "Market Street" }, { id: "castro", label: "Castro Street" }], correct: ["lombard"] },
      Economy: { options: [{ id: "technology", label: "Technology" }, { id: "mining", label: "Mining" }, { id: "agriculture", label: "Agriculture" }], correct: ["technology"] },
      Climate: { options: [{ id: "mediterranean", label: "Warm-summer Mediterranean" }, { id: "continental", label: "Humid continental" }, { id: "tropical", label: "Tropical rainforest" }], correct: ["mediterranean"] },
      "Arts and culture": { options: [{ id: "sfmoma", label: "SFMOMA" }, { id: "met", label: "The Met" }, { id: "moma-ny", label: "MoMA New York" }], correct: ["sfmoma"] },
      Parks: { options: [{ id: "golden-gate", label: "Golden Gate Park" }, { id: "central", label: "Central Park" }, { id: "balboa", label: "Balboa Park" }], correct: ["golden-gate"] },
      Sports: { options: [{ id: "giants", label: "San Francisco Giants" }, { id: "athletics", label: "Athletics" }, { id: "padres", label: "San Diego Padres" }], correct: ["giants"] },
      Government: { options: [{ id: "eleven", label: "11 members" }, { id: "seven", label: "7 members" }, { id: "fifteen", label: "15 members" }], correct: ["eleven"] },
      Education: { options: [{ id: "ucsf", label: "UCSF" }, { id: "ucd", label: "UC Davis" }, { id: "ucsc", label: "UC Santa Cruz" }], correct: ["ucsf"] },
    };
    return {
      ...task,
      ...target,
      question: prompts[selectedTopic],
      options: answers[selectedTopic].options,
      correctOptionIds: answers[selectedTopic].correct,
    };
  }

  return {
    ...task,
    ...target,
    question: `Add one useful, verifiable detail about ${selectedTopic.toLowerCase()} and support it with a reliable source.`,
  };
}
