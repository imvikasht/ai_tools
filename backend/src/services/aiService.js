import OpenAI from "openai";

const aiToolProfiles = {
  "study-planner": {
    objective: "Create a practical study plan with day-wise breakdown, priorities, and revision blocks.",
    sectionIdeas: ["Goal", "Day-wise plan", "Time split", "Revision strategy"],
    mock: (prompt) => ({
      title: "7-Day Study Planner",
      overview: `A focused plan built around ${prompt}.`,
      sections: [
        {
          heading: "Goal",
          content: [`Cover the most important concepts related to ${prompt}.`, "Build confidence with steady revision and short practice blocks."]
        },
        {
          heading: "Day-Wise Plan",
          content: [
            "Day 1: Understand the core concepts and collect study material.",
            "Day 2: Finish the first major topic and create short notes.",
            "Day 3: Practice examples and identify weak areas.",
            "Day 4: Cover the second major topic with active recall.",
            "Day 5: Solve questions and review mistakes.",
            "Day 6: Revise both topics and prepare a cheat sheet.",
            "Day 7: Take a quick test and refine the weak points."
          ]
        },
        {
          heading: "Revision Strategy",
          content: ["Reserve the last 20 minutes of every session for recap.", "Mark difficult concepts and revisit them on Day 6 and Day 7."]
        }
      ],
      quickTips: ["Use a timer for each block.", "Study the hardest topic early in the day.", "End each session with self-testing."],
      nextStep: "Start with the first topic and create one-page notes today."
    })
  },
  "notes-generator": {
    objective: "Turn the topic into concise, student-friendly notes with headings and bullet points.",
    sectionIdeas: ["Overview", "Key concepts", "Examples", "Revision summary"],
    mock: (prompt) => ({
      title: "Smart Notes",
      overview: `Concise notes prepared for ${prompt}.`,
      sections: [
        {
          heading: "Overview",
          content: [`${prompt} can be understood best by focusing on its definition, purpose, and practical use.`]
        },
        {
          heading: "Key Concepts",
          content: ["Core definition and meaning", "Important subtopics and keywords", "Where this concept is used in practice"]
        },
        {
          heading: "Revision Summary",
          content: ["Memorize the important terms first.", "Link each subtopic with a simple example.", "Review the summary once before practice."]
        }
      ],
      quickTips: ["Underline key terms.", "Write one example in your own words.", "Revise the summary after 24 hours."],
      nextStep: "Turn these notes into a one-page revision sheet."
    })
  },
  "summary-generator": {
    objective: "Produce a short, crisp summary that preserves the main idea and removes repetition.",
    sectionIdeas: ["One-line summary", "Key takeaways", "Why it matters"],
    mock: (prompt) => ({
      title: "Concise Summary",
      overview: `A short summary was created from the request: ${prompt}.`,
      sections: [
        {
          heading: "One-Line Summary",
          content: [prompt]
        },
        {
          heading: "Key Takeaways",
          content: ["Keep only the essential message.", "Remove repeated detail.", "Present the idea in direct, readable language."]
        }
      ],
      quickTips: ["Aim for clarity over length.", "Keep the most important fact first."],
      nextStep: "Review whether the summary still preserves the original intent."
    })
  },
  "script-generator": {
    objective: "Write an engaging presentation or short-form script with a strong opening and a clear close.",
    sectionIdeas: ["Hook", "Main script", "Call to action"],
    mock: (prompt) => ({
      title: "Presentation Script",
      overview: `A short script was drafted for ${prompt}.`,
      sections: [
        {
          heading: "Hook",
          content: ["Start with one surprising line or strong question that immediately creates curiosity."]
        },
        {
          heading: "Main Script",
          content: [`Introduce ${prompt}, explain the value clearly, and move through the key idea in a natural flow.`]
        },
        {
          heading: "Call To Action",
          content: ["Close with one crisp next step for the audience."]
        }
      ],
      quickTips: ["Keep sentences short.", "Speak in a natural tone.", "End with a memorable line."],
      nextStep: "Read the script aloud once and trim any awkward phrasing."
    })
  },
  "email-writer": {
    objective: "Draft a polished professional email with subject line and clear body copy.",
    sectionIdeas: ["Subject", "Email body", "Closing"],
    mock: (prompt) => ({
      title: "Professional Email Draft",
      overview: `A clear email draft was prepared for ${prompt}.`,
      sections: [
        {
          heading: "Suggested Subject",
          content: [`Regarding ${prompt}`]
        },
        {
          heading: "Email Body",
          content: [
            "Hello,",
            `I'm reaching out regarding ${prompt}. I wanted to connect with a concise update and keep the message professional and clear.`,
            "Thank you for your time and consideration."
          ]
        }
      ],
      quickTips: ["Keep the first sentence direct.", "Avoid long paragraphs.", "End with one clear ask if needed."],
      nextStep: "Add the recipient name and your exact context before sending."
    })
  },
  "resume-bullet-writer": {
    objective: "Write ATS-friendly resume bullets with action verbs and measurable impact.",
    sectionIdeas: ["Resume bullets", "Impact wording", "Optimization tip"],
    mock: (prompt) => ({
      title: "Resume Bullet Suggestions",
      overview: `ATS-friendly bullets were created from: ${prompt}.`,
      sections: [
        {
          heading: "Resume Bullets",
          content: [
            `Led work related to ${prompt} with clear ownership and execution.`,
            "Improved delivery speed and quality through structured problem-solving.",
            "Collaborated with stakeholders and delivered measurable value."
          ]
        }
      ],
      quickTips: ["Start with an action verb.", "Mention impact where possible.", "Keep each bullet compact and scannable."],
      nextStep: "Add metrics like percentages, time saved, or user growth."
    })
  },
  "sql-query-helper": {
    objective: "Generate the SQL query, explain it briefly, and mention assumptions if needed.",
    sectionIdeas: ["SQL query", "Explanation", "Assumptions"],
    mock: (prompt) => ({
      title: "SQL Query Draft",
      overview: `A draft SQL approach was prepared for ${prompt}.`,
      sections: [
        {
          heading: "SQL Query",
          content: ["SELECT *", "FROM your_table", `WHERE /* condition based on: ${prompt} */;`]
        },
        {
          heading: "Explanation",
          content: ["Replace the table and column names with your schema.", "Add sorting, filtering, or joins based on your exact requirement."]
        }
      ],
      quickTips: ["Validate table names first.", "Check whether aggregation is required.", "Use LIMIT while testing."],
      nextStep: "Match the draft query with your real table and field names."
    })
  },
  "blog-outline-generator": {
    objective: "Create a structured blog outline with an attention-grabbing title and logical sections.",
    sectionIdeas: ["Title ideas", "Outline", "SEO angle"],
    mock: (prompt) => ({
      title: "Blog Outline",
      overview: `A blog structure was prepared for ${prompt}.`,
      sections: [
        {
          heading: "Title Ideas",
          content: [`${prompt}: A Practical Guide`, `How to Approach ${prompt}`]
        },
        {
          heading: "Outline",
          content: ["Introduction", "Why it matters", "Main ideas", "Examples or case study", "Conclusion"]
        }
      ],
      quickTips: ["Open with a relatable problem.", "Use clear H2 sections.", "End with a takeaway or CTA."],
      nextStep: "Choose the title that best matches your audience."
    })
  },
  "product-description-generator": {
    objective: "Write a persuasive product description focused on benefits, use cases, and buyer appeal.",
    sectionIdeas: ["Headline", "Short description", "Key benefits", "CTA"],
    mock: (prompt) => ({
      title: "Product Description Draft",
      overview: `A product description was created for ${prompt}.`,
      sections: [
        {
          heading: "Headline",
          content: [`Meet the smarter solution for ${prompt}.`]
        },
        {
          heading: "Key Benefits",
          content: ["Designed for convenience and clarity.", "Focused on practical everyday value.", "Easy to communicate and promote."]
        }
      ],
      quickTips: ["Lead with the buyer benefit.", "Use sensory or practical language.", "Keep the CTA action-focused."],
      nextStep: "Add one specific product feature to make the copy more credible."
    })
  },
  "linkedin-post-generator": {
    objective: "Draft a professional LinkedIn post with a hook, story/value, and CTA.",
    sectionIdeas: ["Hook", "Body", "CTA", "Hashtags"],
    mock: (prompt) => ({
      title: "LinkedIn Post Draft",
      overview: `A professional LinkedIn post was shaped around ${prompt}.`,
      sections: [
        {
          heading: "Opening Hook",
          content: [`Something important clicked for me while working on ${prompt}.`]
        },
        {
          heading: "Body",
          content: ["Share the lesson clearly.", "Add one practical insight.", "Keep the tone honest and useful."]
        },
        {
          heading: "Call To Action",
          content: ["Invite others to share their experience or perspective."]
        }
      ],
      quickTips: ["Use short paragraphs.", "Make the first line strong.", "Keep hashtags relevant and limited."],
      nextStep: "Add one real experience to make the post more authentic."
    })
  },
  "cover-letter-generator": {
    objective: "Write a tailored cover letter that feels job-specific and confident.",
    sectionIdeas: ["Opening", "Why you fit", "Closing"],
    mock: (prompt) => ({
      title: "Cover Letter Draft",
      overview: `A tailored cover letter structure was generated for ${prompt}.`,
      sections: [
        {
          heading: "Opening",
          content: ["Introduce yourself confidently.", `Reference the opportunity related to ${prompt}.`]
        },
        {
          heading: "Why You Fit",
          content: ["Mention relevant skills and strengths.", "Connect your experience to the role requirements."]
        },
        {
          heading: "Closing",
          content: ["Thank the employer and express interest in the next step."]
        }
      ],
      quickTips: ["Mention the company name.", "Keep it personalized.", "Avoid repeating the resume line by line."],
      nextStep: "Add one specific achievement that matches the job posting."
    })
  },
  "interview-question-generator": {
    objective: "Generate relevant interview questions grouped by theme and difficulty.",
    sectionIdeas: ["Core questions", "Practical questions", "Follow-up questions"],
    mock: (prompt) => ({
      title: "Interview Question Set",
      overview: `Questions were generated around ${prompt}.`,
      sections: [
        {
          heading: "Core Questions",
          content: [`Tell me about your experience with ${prompt}.`, "How do you approach problem-solving in this area?"]
        },
        {
          heading: "Practical Questions",
          content: ["Describe a real project where you applied this skill.", "What tradeoffs would you consider in a typical implementation?"]
        }
      ],
      quickTips: ["Mix conceptual and practical questions.", "Use follow-ups to test depth.", "Ask for real examples."],
      nextStep: "Choose the questions that best match the role level."
    })
  },
  "business-name-generator": {
    objective: "Suggest memorable business names with style variety and quick rationale.",
    sectionIdeas: ["Name ideas", "Why they work", "Tagline direction"],
    mock: () => ({
      title: "Business Name Ideas",
      overview: "A shortlist of memorable brand names was created.",
      sections: [
        {
          heading: "Name Ideas",
          content: ["NovaForge", "BrightLane", "SkillNest", "LaunchMint", "CoreSprint"]
        },
        {
          heading: "Why They Work",
          content: ["Short and memorable", "Flexible for digital branding", "Easy to pronounce and adapt"]
        }
      ],
      quickTips: ["Check domain availability.", "Avoid names that are too generic.", "Pick something easy to say aloud."],
      nextStep: "Shortlist two names and validate them with your target audience."
    })
  },
  "proposal-generator": {
    objective: "Create a professional proposal with scope, deliverables, timeline, and next steps.",
    sectionIdeas: ["Project summary", "Scope", "Deliverables", "Timeline", "Next steps"],
    mock: (prompt) => ({
      title: "Project Proposal Draft",
      overview: `A proposal outline was prepared for ${prompt}.`,
      sections: [
        {
          heading: "Project Summary",
          content: [`Proposal prepared for: ${prompt}.`, "This draft is designed to be refined into a client-ready document."]
        },
        {
          heading: "Deliverables",
          content: ["Discovery and planning", "Core implementation", "Review and handoff"]
        },
        {
          heading: "Next Steps",
          content: ["Confirm scope", "Approve timeline", "Begin execution"]
        }
      ],
      quickTips: ["Keep deliverables specific.", "Include timing where possible.", "Show clear ownership in the scope."],
      nextStep: "Add project dates and pricing before sharing."
    })
  },
  "swot-generator": {
    objective: "Build a clear SWOT analysis with actionable insights.",
    sectionIdeas: ["Strengths", "Weaknesses", "Opportunities", "Threats", "Recommendation"],
    mock: (prompt) => ({
      title: "SWOT Analysis",
      overview: `A SWOT view was created for ${prompt}.`,
      sections: [
        { heading: "Strengths", content: ["Clear value proposition", "Strong relevance for the target user"] },
        { heading: "Weaknesses", content: ["Needs stronger differentiation", "May require clearer positioning"] },
        { heading: "Opportunities", content: ["Growing demand in the market", "Room for niche specialization"] },
        { heading: "Threats", content: ["Competitive alternatives", "Fast-changing user expectations"] }
      ],
      quickTips: ["Keep strengths evidence-based.", "Treat weaknesses honestly.", "Turn opportunities into action items."],
      nextStep: "Use the weaknesses and threats to plan your next improvements."
    })
  },
  "meeting-agenda": {
    objective: "Create a focused meeting agenda with timing, topics, and outcomes.",
    sectionIdeas: ["Objective", "Agenda", "Expected outcomes", "Preparation notes"],
    mock: (prompt) => ({
      title: "Meeting Agenda",
      overview: `A meeting structure was prepared for ${prompt}.`,
      sections: [
        { heading: "Objective", content: [`Align everyone on ${prompt}.`] },
        { heading: "Agenda", content: ["Welcome and context", "Main discussion points", "Decisions needed", "Action items and owners"] }
      ],
      quickTips: ["Keep the meeting goal singular.", "Time-box discussion points.", "End with ownership and deadlines."],
      nextStep: "Assign time limits to each agenda item."
    })
  },
  "caption-generator": {
    objective: "Write multiple caption options suited for social posts with strong hooks and different tones.",
    sectionIdeas: ["Caption options", "Tone ideas", "CTA ideas"],
    mock: (prompt) => ({
      title: "Caption Ideas",
      overview: `Social caption options were created for ${prompt}.`,
      sections: [
        {
          heading: "Caption Options",
          content: [
            `Building smarter ways to grow with ${prompt}. Ready for the next step?`,
            `Real progress starts when ideas turn into action. ${prompt}`,
            `Learning, building, and sharing the journey around ${prompt}.`
          ]
        },
        {
          heading: "CTA Ideas",
          content: ["Share your thoughts below.", "Follow for more practical ideas."]
        }
      ],
      quickTips: ["Choose one emotion per caption.", "Keep the hook in the first line.", "Match the CTA to the platform."],
      nextStep: "Pick the caption that best matches your brand tone."
    })
  },
  "hashtag-helper": {
    objective: "Generate relevant hashtags grouped by broad, niche, and branded use.",
    sectionIdeas: ["Broad hashtags", "Niche hashtags", "Branded hashtags", "Usage tip"],
    mock: (prompt) => ({
      title: "Hashtag Set",
      overview: `Hashtag ideas were generated for ${prompt}.`,
      sections: [
        { heading: "Broad Hashtags", content: ["#growth", "#business", "#productivity"] },
        { heading: "Niche Hashtags", content: [`#${String(prompt).toLowerCase().replace(/[^a-z0-9]+/g, "")}`, "#contentstrategy", "#digitalbranding"] }
      ],
      quickTips: ["Mix broad and niche tags.", "Avoid stuffing too many hashtags.", "Reuse the best-performing groups."],
      nextStep: "Test two hashtag combinations over a few posts."
    })
  },
  "task-breakdown": {
    objective: "Break a large task into clear, actionable steps in a sensible order.",
    sectionIdeas: ["Goal", "Step-by-step plan", "Risks", "Suggested first action"],
    mock: (prompt) => ({
      title: "Task Breakdown",
      overview: `A structured execution plan was created for ${prompt}.`,
      sections: [
        { heading: "Goal", content: [prompt] },
        {
          heading: "Step-By-Step Plan",
          content: [
            "Clarify the final outcome.",
            "Gather the required inputs and constraints.",
            "Split the work into 3 to 5 milestones.",
            "Complete the first milestone before expanding scope.",
            "Review and polish the final output."
          ]
        }
      ],
      quickTips: ["Keep each step action-focused.", "Avoid vague milestones.", "Start with the smallest useful step."],
      nextStep: "Complete the first milestone today to build momentum."
    })
  },
  "daily-planner-generator": {
    objective: "Build a realistic day plan with priorities, time blocks, and buffer time.",
    sectionIdeas: ["Top priorities", "Schedule", "Focus blocks", "Wrap-up"],
    mock: (prompt) => ({
      title: "Daily Planner",
      overview: `A realistic daily plan was created for ${prompt}.`,
      sections: [
        { heading: "Top Priorities", content: [`Complete the most important part of ${prompt}.`, "Leave time for review and a small buffer."] },
        { heading: "Suggested Schedule", content: ["Morning: Deep work", "Afternoon: Execution and follow-ups", "Evening: Review and planning"] }
      ],
      quickTips: ["Protect your first focus block.", "Leave transition time between tasks.", "Do a short end-of-day review."],
      nextStep: "Block your first 90-minute focus session now."
    })
  },
  "meeting-summary-generator": {
    objective: "Convert meeting notes into a clean summary with decisions and action items.",
    sectionIdeas: ["Summary", "Key decisions", "Action items", "Open questions"],
    mock: (prompt) => ({
      title: "Meeting Summary",
      overview: `A clean summary was created from the discussion around ${prompt}.`,
      sections: [
        { heading: "Summary", content: [`The discussion focused on ${prompt}.`, "Main priorities and next steps were clarified."] },
        { heading: "Action Items", content: ["Assign owners", "Set deadlines", "Track follow-up items"] }
      ],
      quickTips: ["Separate discussion from decisions.", "Write action items with owners.", "Keep summaries short and factual."],
      nextStep: "Share the summary with clear ownership after the meeting."
    })
  },
  "habit-tracker-plan": {
    objective: "Create a simple habit plan with a daily checklist and realistic progression.",
    sectionIdeas: ["Habit goal", "7-day plan", "Tracking method", "Consistency tips"],
    mock: (prompt) => ({
      title: "Habit Plan",
      overview: `A 7-day habit plan was built for ${prompt}.`,
      sections: [
        { heading: "Habit Goal", content: [prompt] },
        { heading: "7-Day Plan", content: ["Day 1-2: Keep the habit very small", "Day 3-4: Add consistency triggers", "Day 5-6: Increase effort slightly", "Day 7: Review progress and reset goals"] }
      ],
      quickTips: ["Attach the habit to an existing routine.", "Track completion visually.", "Make the first week easy to sustain."],
      nextStep: "Choose one trigger that reminds you to start the habit daily."
    })
  },
  "focus-session-planner": {
    objective: "Create deep-work sessions with timing, task order, and recovery breaks.",
    sectionIdeas: ["Session plan", "Focus blocks", "Break schedule", "Execution tips"],
    mock: (prompt) => ({
      title: "Focus Session Planner",
      overview: `A deep-work structure was prepared for ${prompt}.`,
      sections: [
        { heading: "Session Plan", content: ["Block 1: Highest-priority task", "Short break", "Block 2: Secondary task", "Short break", "Block 3: Review and close"] },
        { heading: "Execution Tips", content: ["Silence distractions", "Keep one clear goal per block", "Review progress before ending the session"] }
      ],
      quickTips: ["Define the outcome before starting.", "Use a timer for each block.", "Keep breaks short and intentional."],
      nextStep: "Choose the single most important task for your first focus block."
    })
  }
};

const createKeywordProfile = ({ keywords, objective, sectionIdeas, mock }) => ({
  keywords,
  objective,
  sectionIdeas,
  mock
});

const keywordProfiles = [
  createKeywordProfile({
    keywords: ["quiz", "exam-question"],
    objective: "Generate quiz or exam-style questions with answers and a balanced difficulty mix.",
    sectionIdeas: ["Question set", "Answer key", "Difficulty split", "Revision tips"],
    mock: (prompt) => ({
      title: "Quiz Set",
      overview: `A structured quiz was created for ${prompt}.`,
      sections: [
        {
          heading: "Questions",
          content: [
            `1. Define the core concept behind ${prompt}.`,
            `2. Explain one real-world use case related to ${prompt}.`,
            `3. Compare two important ideas connected with ${prompt}.`,
            `4. What is one common mistake students make when learning ${prompt}?`,
            `5. Write one short-answer question and one application-based question about ${prompt}.`
          ]
        },
        {
          heading: "Answer Key",
          content: [
            "Include one-line definitions for conceptual questions.",
            "Use a practical example for the application question.",
            "Explain comparisons with 2 to 3 clear points."
          ]
        }
      ],
      quickTips: ["Mix theory and application questions.", "Add one tricky question for revision.", "Practice answering without notes first."],
      nextStep: "Turn these questions into a timed practice set."
    })
  }),
  createKeywordProfile({
    keywords: ["flashcard"],
    objective: "Generate flashcards with concise question-answer pairs for quick revision.",
    sectionIdeas: ["Flashcards", "Memory cues", "Revision tips"],
    mock: (prompt) => ({
      title: "Flashcard Set",
      overview: `Flashcards were created for ${prompt}.`,
      sections: [
        {
          heading: "Flashcards",
          content: [
            `Card 1: What is the definition of ${prompt}?`,
            `Card 2: What are the key components of ${prompt}?`,
            `Card 3: Give one example related to ${prompt}.`,
            `Card 4: What is a common exam question on ${prompt}?`
          ]
        }
      ],
      quickTips: ["Keep one fact per card.", "Review using spaced repetition.", "Say answers aloud to improve recall."],
      nextStep: "Convert the flashcards into a daily revision routine."
    })
  }),
  createKeywordProfile({
    keywords: ["paraphrasing", "grammar", "translation"],
    objective: "Rewrite text for clarity, correctness, and tone while preserving meaning.",
    sectionIdeas: ["Improved version", "What changed", "Optional variations"],
    mock: (prompt) => ({
      title: "Improved Text",
      overview: `A clearer version was prepared based on: ${prompt}.`,
      sections: [
        {
          heading: "Improved Version",
          content: ["A cleaner, more professional rewrite would simplify the message, improve grammar, and preserve the original meaning."]
        },
        {
          heading: "What Changed",
          content: ["Grammar errors were corrected.", "Sentences were tightened for readability.", "The tone was made more polished."]
        }
      ],
      quickTips: ["Keep the original intent intact.", "Avoid overcomplicating sentences.", "Adjust tone for the audience."],
      nextStep: "Paste the exact source text to get a more precise rewrite."
    })
  }),
  createKeywordProfile({
    keywords: ["slogan", "hook", "tweet", "caption", "bio", "name-ideas"],
    objective: "Generate short, catchy creative options with different tones and angles.",
    sectionIdeas: ["Options", "Best angle", "Usage tip"],
    mock: (prompt) => ({
      title: "Creative Options",
      overview: `Short-form creative ideas were generated for ${prompt}.`,
      sections: [
        {
          heading: "Options",
          content: [
            `Bold option: ${prompt} that actually stands out.`,
            `Friendly option: Simple, smart, and built around ${prompt}.`,
            `Professional option: Clear value and a strong message for ${prompt}.`
          ]
        }
      ],
      quickTips: ["Pick one tone and stay consistent.", "Keep the first line strong.", "Test multiple options before choosing."],
      nextStep: "Shortlist the option that best matches your audience."
    })
  }),
  createKeywordProfile({
    keywords: ["email", "cold-email", "support-reply", "refund-response", "invoice-email"],
    objective: "Draft a clear professional message with strong structure and appropriate tone.",
    sectionIdeas: ["Subject", "Message draft", "Tone notes"],
    mock: (prompt) => ({
      title: "Email Draft",
      overview: `A professional message draft was created for ${prompt}.`,
      sections: [
        {
          heading: "Suggested Subject",
          content: [`Regarding ${prompt}`]
        },
        {
          heading: "Message Draft",
          content: [
            "Hello,",
            `I'm reaching out regarding ${prompt}. This draft keeps the message clear, concise, and professional.`,
            "Please let me know if you need any additional details."
          ]
        }
      ],
      quickTips: ["Keep the subject line direct.", "Use short paragraphs.", "End with one clear next step or ask."],
      nextStep: "Personalize the recipient and context before sending."
    })
  }),
  createKeywordProfile({
    keywords: ["script", "youtube-script", "story", "newsletter", "press-release", "blog", "landing-page", "ad-copy"],
    objective: "Create content with a strong structure, clear messaging, and practical flow.",
    sectionIdeas: ["Opening", "Main content", "Call to action"],
    mock: (prompt) => ({
      title: "Content Draft",
      overview: `A structured content draft was created for ${prompt}.`,
      sections: [
        {
          heading: "Opening",
          content: ["Start with a compelling hook that quickly frames the value of the topic."]
        },
        {
          heading: "Main Content",
          content: [`Build the message around ${prompt} with 3 to 5 practical supporting points.`]
        },
        {
          heading: "Call To Action",
          content: ["Close with one clear next action for the reader or viewer."]
        }
      ],
      quickTips: ["Keep the structure simple.", "Lead with value.", "Use short, direct language."],
      nextStep: "Refine the draft for your target platform and audience."
    })
  }),
  createKeywordProfile({
    keywords: ["faq", "acceptance-criteria", "checklist", "sop"],
    objective: "Generate organized lists, criteria, or reference sections that are easy to scan and use.",
    sectionIdeas: ["Main list", "Recommended structure", "Usage notes"],
    mock: (prompt) => ({
      title: "Structured Reference",
      overview: `A structured reference draft was created for ${prompt}.`,
      sections: [
        {
          heading: "Main Items",
          content: [
            "List the essential points in a logical order.",
            "Keep each item clear, specific, and actionable.",
            "Remove overlap between items."
          ]
        }
      ],
      quickTips: ["Use one idea per bullet.", "Write in plain language.", "Keep items easy to verify."],
      nextStep: "Customize the list with your exact workflow or context."
    })
  }),
  createKeywordProfile({
    keywords: ["roadmap", "plan", "priority", "time-block", "routine", "review", "journal", "reflection", "goal"],
    objective: "Create an actionable plan with structure, sequencing, and practical next steps.",
    sectionIdeas: ["Goal", "Plan", "Execution tips", "Next step"],
    mock: (prompt) => ({
      title: "Structured Plan",
      overview: `A practical plan was created for ${prompt}.`,
      sections: [
        {
          heading: "Goal",
          content: [prompt]
        },
        {
          heading: "Plan",
          content: [
            "Clarify the outcome you want to achieve.",
            "Break the work into small milestones or blocks.",
            "Review progress at the end of each cycle."
          ]
        }
      ],
      quickTips: ["Start with the highest-impact step.", "Keep the plan realistic.", "Review and adjust weekly."],
      nextStep: "Schedule the first milestone on your calendar now."
    })
  }),
  createKeywordProfile({
    keywords: ["analysis", "validator", "matrix", "risk", "competitor", "pricing", "marketing", "kpi", "scorecard", "status-update"],
    objective: "Generate a structured analysis with clear evaluation points and recommendations.",
    sectionIdeas: ["Summary", "Key insights", "Risks or tradeoffs", "Recommendation"],
    mock: (prompt) => ({
      title: "Structured Analysis",
      overview: `An analysis draft was created for ${prompt}.`,
      sections: [
        {
          heading: "Key Insights",
          content: [
            "Highlight the strongest opportunities or advantages.",
            "Call out the biggest risks or constraints.",
            "Compare options using consistent criteria."
          ]
        },
        {
          heading: "Recommendation",
          content: ["Choose the option with the strongest balance of impact, feasibility, and clarity."]
        }
      ],
      quickTips: ["Use evidence where possible.", "Separate facts from assumptions.", "Keep recommendations actionable."],
      nextStep: "Add your real constraints or data to strengthen the analysis."
    })
  }),
  createKeywordProfile({
    keywords: ["persona", "thesis", "research-topic", "citation"],
    objective: "Generate structured academic or research-oriented output with clarity and relevance.",
    sectionIdeas: ["Main output", "Supporting points", "Refinement tips"],
    mock: (prompt) => ({
      title: "Academic Draft",
      overview: `A structured academic draft was created for ${prompt}.`,
      sections: [
        {
          heading: "Main Output",
          content: ["Start with a clear central idea and support it with relevant context and direction."]
        },
        {
          heading: "Supporting Points",
          content: ["Keep the scope focused.", "Use clear definitions.", "Align the output with the assignment goal."]
        }
      ],
      quickTips: ["Stay specific.", "Avoid vague claims.", "Match the format to the academic task."],
      nextStep: "Refine the draft with your exact source material or assignment brief."
    })
  })
];

const defaultProfile = {
  objective: "Generate a useful result tailored to the selected tool.",
  sectionIdeas: ["Main response", "Key details", "Next steps"],
  mock: (prompt, toolName) => ({
    title: toolName,
    overview: `A tailored result was generated from: ${prompt}.`,
    sections: [{ heading: "Main Response", content: [prompt] }],
    quickTips: ["Keep the output specific.", "Review and refine before sharing."],
    nextStep: "Use this response as a starting point and customize it."
  })
};

const normalizeStringArray = (value) => {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item).trim()).filter(Boolean);
};

const normalizeSections = (sections) => {
  if (!Array.isArray(sections)) return [];
  return sections
    .map((section) => ({
      heading: String(section?.heading || "").trim(),
      content: normalizeStringArray(section?.content)
    }))
    .filter((section) => section.heading && section.content.length);
};

const normalizeAiResult = (result, toolName) => ({
  title: String(result?.title || toolName).trim(),
  overview: String(result?.overview || "").trim(),
  sections: normalizeSections(result?.sections),
  quickTips: normalizeStringArray(result?.quickTips),
  nextStep: String(result?.nextStep || "").trim()
});

const inferKeywordProfile = (toolSlug) => {
  const normalizedSlug = String(toolSlug || "").toLowerCase();
  return keywordProfiles.find((profile) => profile.keywords.some((keyword) => normalizedSlug.includes(keyword)));
};

const getToolProfile = (toolSlug) => aiToolProfiles[toolSlug] || inferKeywordProfile(toolSlug) || defaultProfile;

const createPrompt = ({ toolSlug, toolName, prompt, extra = {} }) => {
  const profile = getToolProfile(toolSlug);
  return `
You are an expert assistant inside an AI multi-tool platform.
Tool: ${toolName}
Tool Slug: ${toolSlug}
Primary Objective: ${profile.objective}
User Request: ${prompt}
Extra Context: ${JSON.stringify(extra)}

Return only valid JSON with this exact structure:
{
  "title": "short title",
  "overview": "2 to 3 sentence summary",
  "sections": [
    {
      "heading": "section name",
      "content": ["bullet or paragraph 1", "bullet or paragraph 2"]
    }
  ],
  "quickTips": ["tip 1", "tip 2", "tip 3"],
  "nextStep": "single practical next step"
}

Rules:
- Make the output specific to this tool.
- Keep sections practical and readable.
- Do not include markdown fences.
- Do not include any text outside the JSON object.
`.trim();
};

const mockAiResponse = ({ toolSlug, toolName, prompt }) => {
  const profile = getToolProfile(toolSlug);
  return normalizeAiResult(profile.mock(prompt, toolName), toolName);
};

const safeJsonParse = (content) => {
  try {
    return JSON.parse(content);
  } catch (_error) {
    return null;
  }
};

export const generateAiContent = async ({ toolSlug, toolName, prompt, extra }) => {
  if (!process.env.OPENAI_API_KEY) {
    return mockAiResponse({ toolSlug, toolName, prompt });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant for a multi-tool SaaS platform. Always return valid JSON only."
        },
        {
          role: "user",
          content: createPrompt({ toolSlug, toolName, prompt, extra })
        }
      ]
    });

    const content = completion.choices[0]?.message?.content || "";
    const parsed = safeJsonParse(content);

    if (parsed) {
      const normalized = normalizeAiResult(parsed, toolName);
      if (normalized.sections.length || normalized.overview || normalized.quickTips.length) {
        return normalized;
      }
    }
  } catch (_error) {
    return mockAiResponse({ toolSlug, toolName, prompt });
  }

  return mockAiResponse({ toolSlug, toolName, prompt });
};
