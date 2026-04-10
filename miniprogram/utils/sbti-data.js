'use strict';
module.exports = (function () {
const dimensionMeta = {
      D1: { name: 'D1 Dimension-One', model: 'Model-A' },
      D2: { name: 'D2 Dimension-Two', model: 'Model-A' },
      D3: { name: 'D3 Dimension-Three', model: 'Model-A' },
      D4: { name: 'D4 Dimension-Four', model: 'Model-B' },
      D5: { name: 'D5 Dimension-Five', model: 'Model-B' },
      D6: { name: 'D6 Dimension-Six', model: 'Model-B' },
      D7: { name: 'D7 Dimension-Seven', model: 'Model-C' },
      D8: { name: 'D8 Dimension-Eight', model: 'Model-C' },
      D9: { name: 'D9 Dimension-Nine', model: 'Model-C' },
      D10: { name: 'D10 Dimension-Ten', model: 'Model-D' },
      D11: { name: 'D11 Dimension-Eleven', model: 'Model-D' },
      D12: { name: 'D12 Dimension-Twelve', model: 'Model-D' },
      D13: { name: 'D13 Dimension-Thirteen', model: 'Model-E' },
      D14: { name: 'D14 Dimension-Fourteen', model: 'Model-E' },
      D15: { name: 'D15 Dimension-Fifteen', model: 'Model-E' }
    };
    const questions = [
      {
        id: 'q1', dim: 'D1',
        text: 'Example question 1: How do you feel about mornings?',
        options: [
          { label: 'Love them', value: 1 },
          { label: 'They are okay', value: 2 },
          { label: 'Hate them', value: 3 }
        ]
      },
      {
        id: 'q2', dim: 'D2',
        text: 'Example question 2: Pick your ideal weekend activity.',
        options: [
          { label: 'Reading a book', value: 1 },
          { label: 'Going for a hike', value: 2 },
          { label: 'Sleeping in', value: 3 }
        ]
      },
      {
        id: 'q3', dim: 'D3',
        text: 'Example question 3: How do you handle disagreements?',
        options: [
          { label: 'Avoid conflict', value: 1 },
          { label: 'Discuss calmly', value: 2 },
          { label: 'Argue passionately', value: 3 }
        ]
      }
    ];
    const specialQuestions = [
      {
        id: 'special_gate_q1',
        special: true,
        kind: 'drink_gate',
        text: 'Example special question: What is your hobby?',
        options: [
          { label: 'Sports', value: 1 },
          { label: 'Arts', value: 2 },
          { label: 'Cooking', value: 3 },
          { label: 'Gaming', value: 4 }
        ]
      },
      {
        id: 'special_gate_q2',
        special: true,
        kind: 'drink_trigger',
        text: 'Example trigger question: How much do you enjoy this hobby?',
        options: [
          { label: 'A little', value: 1 },
          { label: 'It defines me', value: 2 }
        ]
      }
    ];

    const TYPE_LIBRARY = {
  "ALPHA": {
    "code": "ALPHA",
    "cn": "Alpha Type",
    "intro": "You are the Alpha archetype.",
    "desc": "This is a placeholder description for the Alpha personality type. Replace this with your own creative content. The Alpha type represents a balanced, confident individual who approaches life with curiosity and determination."
  },
  "BETA": {
    "code": "BETA",
    "cn": "Beta Type",
    "intro": "You are the Beta archetype.",
    "desc": "This is a placeholder description for the Beta personality type. Replace this with your own creative content. The Beta type represents a thoughtful, empathetic individual who values harmony and deep connections."
  },
  "FALLBACK": {
    "code": "FALLBACK",
    "cn": "Fallback Type",
    "intro": "The system assigned you the fallback type.",
    "desc": "This is the fallback personality type, activated when no standard type matches above the threshold. Replace this with your own creative fallback description."
  },
  "HIDDEN": {
    "code": "HIDDEN",
    "cn": "Hidden Type",
    "intro": "A hidden personality has been unlocked.",
    "desc": "This is a placeholder for the hidden personality type, triggered by a special branch in the questionnaire. Replace with your own content."
  }
};
    const TYPE_IMAGES = {
  "ALPHA": "/packageImages/images/placeholder.svg",
  "BETA": "/packageImages/images/placeholder.svg",
  "FALLBACK": "/packageImages/images/placeholder.svg",
  "HIDDEN": "/packageImages/images/placeholder.svg"
};

    const NORMAL_TYPES = [
  {
    "code": "ALPHA",
    "pattern": "HHH-HMH-MHH-HHH-MHM"
  },
  {
    "code": "BETA",
    "pattern": "MLH-LHL-HLH-MLM-MLH"
  }
];
    const DIM_EXPLANATIONS = {
  "D1": {
    "L": "Low on Dimension 1: You tend to be reserved in this area.",
    "M": "Medium on Dimension 1: You show a balanced approach.",
    "H": "High on Dimension 1: You are confident and assertive here."
  },
  "D2": {
    "L": "Low on Dimension 2: You prefer stability over novelty.",
    "M": "Medium on Dimension 2: You balance routine and exploration.",
    "H": "High on Dimension 2: You actively seek new experiences."
  },
  "D3": {
    "L": "Low on Dimension 3: You tend toward caution.",
    "M": "Medium on Dimension 3: A moderate approach.",
    "H": "High on Dimension 3: You lean toward bold action."
  },
  "D4": {
    "L": "Low on Dimension 4.",
    "M": "Medium on Dimension 4.",
    "H": "High on Dimension 4."
  },
  "D5": {
    "L": "Low on Dimension 5.",
    "M": "Medium on Dimension 5.",
    "H": "High on Dimension 5."
  },
  "D6": {
    "L": "Low on Dimension 6.",
    "M": "Medium on Dimension 6.",
    "H": "High on Dimension 6."
  },
  "D7": {
    "L": "Low on Dimension 7.",
    "M": "Medium on Dimension 7.",
    "H": "High on Dimension 7."
  },
  "D8": {
    "L": "Low on Dimension 8.",
    "M": "Medium on Dimension 8.",
    "H": "High on Dimension 8."
  },
  "D9": {
    "L": "Low on Dimension 9.",
    "M": "Medium on Dimension 9.",
    "H": "High on Dimension 9."
  },
  "D10": {
    "L": "Low on Dimension 10.",
    "M": "Medium on Dimension 10.",
    "H": "High on Dimension 10."
  },
  "D11": {
    "L": "Low on Dimension 11.",
    "M": "Medium on Dimension 11.",
    "H": "High on Dimension 11."
  },
  "D12": {
    "L": "Low on Dimension 12.",
    "M": "Medium on Dimension 12.",
    "H": "High on Dimension 12."
  },
  "D13": {
    "L": "Low on Dimension 13.",
    "M": "Medium on Dimension 13.",
    "H": "High on Dimension 13."
  },
  "D14": {
    "L": "Low on Dimension 14.",
    "M": "Medium on Dimension 14.",
    "H": "High on Dimension 14."
  },
  "D15": {
    "L": "Low on Dimension 15.",
    "M": "Medium on Dimension 15.",
    "H": "High on Dimension 15."
  }
};
    const dimensionOrder = ['D1','D2','D3','D4','D5','D6','D7','D8','D9','D10','D11','D12','D13','D14','D15'];

    const DRUNK_TRIGGER_QUESTION_ID = 'special_gate_q2';
return {
  dimensionMeta,
  questions,
  specialQuestions,
  TYPE_LIBRARY,
  TYPE_IMAGES,
  NORMAL_TYPES,
  DIM_EXPLANATIONS,
  dimensionOrder,
  DRUNK_TRIGGER_QUESTION_ID
};
})();
