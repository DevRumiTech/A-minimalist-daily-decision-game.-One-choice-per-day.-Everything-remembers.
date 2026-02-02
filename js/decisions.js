/*
  decisions.js
  ------------
  This file defines ALL possible decision templates.

  Each decision:
  - is narrative-first (no visible stats)
  - modifies hidden long-term variables
  - influences future decisions via tags

  IMPORTANT:
  - Numbers here are NEVER shown to the player.
  - Only narrative consequences are exposed.
*/

window.Decisions = [
    {
      // Internal identifier (never shown)
      id: "signal",
  
      // Short thematic label shown above the card
      kicker: "INTERFERENCE",
  
      // Main decision title
      title: "A message arrives with no sender.",
  
      // Narrative description
      body:
        "It contains a single instruction. No threats. No context. Just a calm imperative.",
  
      // Tags used by the engine to weight future decisions
      tags: ["trust", "entropy", "control"],
  
      // Available choices (exactly one per day)
      choices: [
        {
          // Choice text shown to the player
          text: "Follow the instruction precisely.",
  
          // Hidden variable effects
          effects: {
            stability: +3,
            pressure: +6,
            trust: -2,
            entropy: -4
          },
  
          // Narrative consequence tiers
          consequences: {
            low: "You comply. Nothing visibly changes.",
            mid: "Later, you realize the day feels arranged.",
            high: "Something else moved because you did."
          }
        },
        {
          text: "Ignore it completely.",
          effects: {
            stability: -2,
            pressure: +2,
            trust: +1,
            entropy: +4
          },
          consequences: {
            low: "Nothing happens. That worries you.",
            mid: "You wait for consequences that never arrive.",
            high: "The next day contains a small inconvenience."
          }
        },
        {
          text: "Test the sender with a harmless question.",
          effects: {
            stability: -1,
            pressure: +4,
            trust: +3,
            entropy: +2
          },
          consequences: {
            low: "The silence feels practiced.",
            mid: "A reply arrives — wrong, but confident.",
            high: "The reply mentions a detail you never shared."
          }
        }
      ]
    },
  
    {
      id: "key",
      kicker: "ACCESS",
      title: "Someone offers you a spare key.",
      body:
        "They call it insurance. Their smile lingers longer than it should.",
      tags: ["control", "stability", "trust"],
      choices: [
        {
          text: "Accept the key.",
          effects: {
            stability: +4,
            pressure: +3,
            trust: +2,
            entropy: -3
          },
          consequences: {
            low: "The key feels colder than expected.",
            mid: "You never hear it jingle.",
            high: "That night, you dream of unfamiliar rooms."
          }
        },
        {
          text: "Refuse politely.",
          effects: {
            stability: -1,
            pressure: +2,
            trust: -2,
            entropy: +2
          },
          consequences: {
            low: "They nod, unchanged.",
            mid: "You feel the loss of something you never had.",
            high: "Later, you find a key-shaped indent in your pocket."
          }
        },
        {
          text: "Insist on a trade instead.",
          effects: {
            stability: +1,
            pressure: +5,
            trust: -1,
            entropy: +1
          },
          consequences: {
            low: "They hesitate. That pause matters.",
            mid: "Their key is warm in your hand.",
            high: "For days, you feel both doors in your mind."
          }
        }
      ]
    }
  ];
  