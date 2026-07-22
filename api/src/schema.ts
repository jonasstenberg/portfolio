import { createSchema } from 'graphql-yoga';

import { education, experience, links, me, skills } from './cv';
import type { SkillCategory } from './cv';

export const schema = createSchema({
  typeDefs: /* GraphQL */ `
    """
    Jonas Stenberg's CV as a GraphQL API.
    Start with: { experience { company role highlights } }
    """
    type Query {
      "Who this CV belongs to."
      me: Person!

      """
      Professional experience, most recent first.
      Use \`since\` to only include roles still active in or after that year,
      or \`current: true\` for ongoing roles only.
      """
      experience(since: Int, current: Boolean): [Experience!]!

      "Formal education."
      education: [Education!]!

      "Skills, optionally filtered by category."
      skills(category: SkillCategory): [Skill!]!

      "Where to say hello."
      links: [Link!]!
    }

    type Person {
      name: String!
      headline: String!
      location: String!
      "A few paragraphs about me."
      about: [String!]!
      "Where it all began."
      helloWorld: String!
    }

    "A year-bounded period. \`end\` is null while the role is ongoing."
    type Period {
      start: Int!
      end: Int
    }

    type Experience {
      company: String!
      role: String!
      location: String!
      period: Period!
      "Longer-form context about the company or role, when there is a story to tell."
      summary: String
      "The work itself, in bullets."
      highlights: [String!]!
      "Notable technologies, when they deserve a mention."
      tech: [String!]!
    }

    type Education {
      school: String!
      program: String!
      location: String!
      period: Period!
    }

    enum SkillCategory {
      HARD
      SOFT
    }

    type Skill {
      name: String!
      category: SkillCategory!
      "Related tools or specializations under this skill."
      keywords: [String!]!
    }

    type Link {
      label: String!
      url: String!
    }
  `,
  resolvers: {
    Query: {
      me: () => me,
      experience: (_parent, args: { since?: number | null; current?: boolean | null }) =>
        experience.filter(
          (job) =>
            (args.since == null || job.period.end == null || job.period.end >= args.since) &&
            (args.current !== true || job.period.end == null),
        ),
      education: () => education,
      skills: (_parent, args: { category?: SkillCategory | null }) =>
        args.category == null ? skills : skills.filter((s) => s.category === args.category),
      links: () => links,
    },
  },
});
