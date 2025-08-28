import { routeIntent } from "./router";
import { he } from "../locales/he";
import { en } from "../locales/en";
import { es } from "../locales/es";
import { pt } from "../locales/pt";

export type LocaleKey = "he" | "en" | "es" | "pt";
const PACKS: Record<LocaleKey, any> = { he, en, es, pt };

export const detectLocale = (s: string): LocaleKey => {
  if (/\p{Script=Hebrew}/u.test(s)) return "he";
  if (/[áéíóúñü¿¡]/i.test(s)) return "es";
  if (/[ãõçêâáéíóú]/i.test(s)) return "pt";
  return "en";
};

export const extractEntity = (s: string) => {
  const heNamed = s.match(/בשם\s+[\"“]?([^\"”]+)[\"”]?/);
  if (heNamed) return heNamed[1].trim();
  const byNamed = s.match(/(?:called|named)\s+[\"“]?([^\"”]+)[\"”]?/i);
  if (byNamed) return byNamed[1].trim();
  const quoted = s.match(/[\"“]([^\"”]+)[\"”]/);
  if (quoted) return quoted[1].trim();
  return null;
};

function createStructuredPrompt(
  subject: string,
  type: string,
  persona: { role: string; voice: string },
  goal: string,
  context: { subject: string; audience: string; constraints: string },
  tasks: string[],
  output: { format: string; sections: string; length?: string },
  qualityChecks: string[],
  language: { target: string; tone: string }
): string {
  return `[Persona]
Role: ${persona.role}
Voice: ${persona.voice}

[Goal]
${goal}

[Context]
Subject: ${context.subject}
Audience: ${context.audience}
Constraints: ${context.constraints}

[Tasks]
${tasks.map((task) => `• ${task}`).join("\n")}

[Output]
Format: ${output.format}${output.length ? ` (${output.length})` : ""}
Sections: ${output.sections}

[Quality Checks]
${qualityChecks.map((check) => `• ${check}`).join("\n")}

[Language]
Target: ${language.target}
Tone: ${language.tone}`;
}

function rewritePrompt(
  text: string,
  intent: string,
  locale: LocaleKey
): string {
  const lowerText = text.toLowerCase();

  switch (intent) {
    case "ads":
      const adSubject = text
        .replace(
          /^(compose|write|create|make)\s+(me\s+)?a\s+(facebook\s+post|instagram\s+post|social\s+media\s+post|ad)\s+about\s+/i,
          ""
        )
        .replace(/^(about|for)\s+/i, "");

      if (lowerText.includes("facebook")) {
        return createStructuredPrompt(
          adSubject,
          "Facebook Post",
          {
            role: "Social Media Marketing Specialist",
            voice: "Engaging, conversational",
          },
          `Create a compelling Facebook post about ${adSubject} that drives engagement and action.`,
          {
            subject: adSubject,
            audience: "Facebook users interested in the topic",
            constraints:
              "Facebook algorithm optimization, authentic engagement, clear CTA",
          },
          [
            "Craft a hook that stops scrolling",
            "Include relevant hashtags (3-5)",
            "Add a clear call-to-action",
            "Optimize for Facebook's algorithm",
            "Ensure mobile-friendly formatting",
          ],
          {
            format: "Facebook Post",
            sections: "Hook → Value → CTA",
            length: "1-2 sentences + hashtags",
          },
          [
            "Engagement rate optimization",
            "Hashtag relevance check",
            "Mobile readability verification",
          ],
          { target: "English", tone: "Engaging, authentic" }
        );
      }

      if (lowerText.includes("instagram")) {
        return createStructuredPrompt(
          adSubject,
          "Instagram Post",
          { role: "Instagram Marketing Expert", voice: "Visual, trendy" },
          `Create an engaging Instagram post about ${adSubject} with strong visual appeal.`,
          {
            subject: adSubject,
            audience: "Instagram users seeking visual content",
            constraints:
              "Visual storytelling, Instagram aesthetics, story format",
          },
          [
            "Write compelling caption with visual cues",
            "Include relevant hashtags (10-15)",
            "Add engaging call-to-action",
            "Optimize for Instagram feed",
            "Consider story format",
          ],
          { format: "Instagram Post", sections: "Caption → Hashtags → CTA" },
          [
            "Visual appeal assessment",
            "Hashtag performance check",
            "Engagement optimization",
          ],
          { target: "English", tone: "Visual, trendy" }
        );
      }

    case "copy.product":
      const product = text
        .replace(
          /^(write|create|make|compose)\s+(me\s+)?a\s+(product\s+)?(description|copy)\s+(for|about)\s+/i,
          ""
        )
        .replace(/^(for|about)\s+/i, "");

      return createStructuredPrompt(
        product,
        "Product Description",
        { role: "E-commerce Copywriter", voice: "Persuasive, benefit-focused" },
        `Write a compelling product description for ${product} that converts browsers into buyers.`,
        {
          subject: product,
          audience: "Online shoppers seeking quality products",
          constraints: "SEO optimization, conversion focus, trust building",
        },
        [
          "Create attention-grabbing headline",
          "List key features with benefits",
          "Address customer pain points",
          "Include social proof elements",
          "Add clear call-to-action",
        ],
        {
          format: "Product Description",
          sections: "Hook → Features → Benefits → CTA",
          length: "150-300 words",
        },
        [
          "Conversion rate optimization",
          "SEO keyword integration",
          "Trust signal verification",
        ],
        { target: "English", tone: "Persuasive, trustworthy" }
      );

    case "code.fix":
      const issue = text.replace(/^(fix|debug|help\s+with|solve)\s+/i, "");

      return createStructuredPrompt(
        issue,
        "Technical Debugging",
        { role: "Senior Software Engineer", voice: "Precise, methodical" },
        `Debug and resolve the technical issue: ${issue}`,
        {
          subject: issue,
          audience: "Developers facing similar problems",
          constraints:
            "Minimal changes, clear explanation, maintainable solution",
        },
        [
          "Identify root cause of the issue",
          "Provide step-by-step solution",
          "Explain why the fix works",
          "Include code examples",
          "Suggest prevention measures",
        ],
        {
          format: "Technical Solution",
          sections: "Problem → Analysis → Solution → Prevention",
        },
        [
          "Code quality verification",
          "Solution completeness check",
          "Documentation clarity review",
        ],
        { target: "English", tone: "Technical, clear" }
      );

    case "translate":
      const translateText = text.replace(/^(translate|convert)\s+/i, "");

      return createStructuredPrompt(
        translateText,
        "Translation",
        {
          role: "Professional Translator",
          voice: "Accurate, culturally aware",
        },
        `Translate the text accurately while preserving meaning and cultural context.`,
        {
          subject: translateText,
          audience: "Target language speakers",
          constraints: "Cultural accuracy, tone preservation, natural flow",
        },
        [
          "Maintain original meaning and tone",
          "Adapt cultural references appropriately",
          "Ensure natural language flow",
          "Preserve technical terminology",
          "Verify cultural sensitivity",
        ],
        { format: "Translation", sections: "Original → Translated → Notes" },
        [
          "Accuracy verification",
          "Cultural appropriateness check",
          "Natural language flow review",
        ],
        { target: "Target Language", tone: "Natural, culturally appropriate" }
      );

    case "summarize":
      const summarySubject = text.replace(
        /^(summarize|summarise|brief|overview)\s+/i,
        ""
      );

      return createStructuredPrompt(
        summarySubject,
        "Summary",
        { role: "Content Analyst", voice: "Concise, objective" },
        `Create a comprehensive yet concise summary of: ${summarySubject}`,
        {
          subject: summarySubject,
          audience: "Readers seeking key insights",
          constraints: "Accuracy, brevity, key point extraction",
        },
        [
          "Extract main arguments and themes",
          "Identify key supporting evidence",
          "Highlight critical insights",
          "Maintain logical flow",
          "Preserve essential context",
        ],
        {
          format: "Summary",
          sections: "Overview → Key Points → Conclusions",
          length: "200-400 words",
        },
        [
          "Completeness verification",
          "Accuracy check against source",
          "Clarity and coherence review",
        ],
        { target: "English", tone: "Objective, concise" }
      );

    case "writing":
      const content = text.replace(
        /^(write|compose|create|draft)\s+(me\s+)?(an?\s+)?/i,
        ""
      );

      if (lowerText.includes("essay")) {
        return createStructuredPrompt(
          content,
          "Essay",
          { role: "Academic Writer", voice: "Analytical, balanced" },
          `Produce a structured essay that explores ${content} with academic rigor and balanced perspective.`,
          {
            subject: content,
            audience: "Academic readers seeking understanding",
            constraints: "Evidence-based, neutral tone, comprehensive coverage",
          },
          [
            "Develop clear thesis statement",
            "Provide historical and contextual background",
            "Present multiple perspectives objectively",
            "Support arguments with credible evidence",
            "Conclude with analytical insights",
          ],
          {
            format: "Academic Essay",
            sections:
              "Introduction → Background → Analysis → Perspectives → Conclusion",
            length: "800-1200 words",
          },
          [
            "Thesis clarity verification",
            "Evidence quality assessment",
            "Bias detection and neutrality check",
            "Academic tone consistency",
          ],
          { target: "English", tone: "Academic, analytical" }
        );
      }

      if (lowerText.includes("article") || lowerText.includes("blog")) {
        return createStructuredPrompt(
          content,
          "Article",
          { role: "Content Writer", voice: "Engaging, informative" },
          `Write an engaging article about ${content} that educates and entertains readers.`,
          {
            subject: content,
            audience: "General readers seeking information",
            constraints:
              "Accessible language, engaging storytelling, practical value",
          },
          [
            "Create compelling introduction",
            "Structure information logically",
            "Use engaging storytelling techniques",
            "Include practical examples",
            "End with actionable insights",
          ],
          {
            format: "Article",
            sections: "Hook → Information → Examples → Insights",
            length: "600-1000 words",
          },
          [
            "Readability optimization",
            "Engagement factor assessment",
            "Information accuracy verification",
          ],
          { target: "English", tone: "Engaging, accessible" }
        );
      }

      if (lowerText.includes("report")) {
        return createStructuredPrompt(
          content,
          "Report",
          { role: "Business Analyst", voice: "Professional, data-driven" },
          `Compile a comprehensive report on ${content} with actionable insights and recommendations.`,
          {
            subject: content,
            audience: "Stakeholders and decision-makers",
            constraints:
              "Data-driven, objective analysis, actionable recommendations",
          },
          [
            "Provide executive summary",
            "Present key findings and data",
            "Analyze trends and patterns",
            "Identify opportunities and risks",
            "Recommend specific actions",
          ],
          {
            format: "Business Report",
            sections:
              "Executive Summary → Findings → Analysis → Recommendations",
            length: "1000-1500 words",
          },
          [
            "Data accuracy verification",
            "Recommendation feasibility check",
            "Executive summary clarity review",
          ],
          { target: "English", tone: "Professional, objective" }
        );
      }

    default:
      return text;
  }
}

export function buildLocalSuggestion(
  text: string,
  locale: LocaleKey,
  intent?: string
) {
  const pack = PACKS[locale] ?? en;
  const i = intent ?? routeIntent(text);
  const tip = pack.tips[i];

  // Create a rewritten version of the user's input
  const instruction = rewritePrompt(text, i, locale);

  return { instruction, tip };
}
