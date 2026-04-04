/**
 * Support service data for signposting [A8] and crisis support [A9].
 * These are the services referenced in the Signposting multi-select
 * field on questions, and the crisis service mapping on topics.
 */

export interface SupportService {
  name: string;
  description: string;
  phone: string | null;
  url: string;
  urlLabel: string;
}

export const SUPPORT_SERVICES: Record<string, SupportService> = {
  Childline: {
    name: 'Childline',
    description: 'Any issue affecting under-19s. Abuse, bullying, mental health, relationships, sexual health.',
    phone: '0800 1111',
    url: 'https://www.childline.org.uk',
    urlLabel: 'childline.org.uk',
  },
  Brook: {
    name: 'Brook',
    description: 'Sexual health, contraception, relationships, STIs. For under-25s.',
    phone: null,
    url: 'https://www.brook.org.uk',
    urlLabel: 'brook.org.uk',
  },
  'The Mix': {
    name: 'The Mix',
    description: 'Mental health, drugs, homelessness, money, sex, relationships. For under-25s.',
    phone: '0808 808 4994',
    url: 'https://www.themix.org.uk',
    urlLabel: 'themix.org.uk',
  },
  NSPCC: {
    name: 'NSPCC',
    description: 'Child abuse and neglect. For children and adults concerned about a child.',
    phone: '0808 800 5000',
    url: 'https://www.nspcc.org.uk',
    urlLabel: 'nspcc.org.uk',
  },
  "Women's Aid": {
    name: "Women's Aid",
    description: 'Domestic abuse. For women and children.',
    phone: null,
    url: 'https://www.womensaid.org.uk',
    urlLabel: 'womensaid.org.uk',
  },
  'NHS Sexual Health': {
    name: 'NHS Sexual Health',
    description: 'Sexual health services, STI testing, contraception.',
    phone: null,
    url: 'https://www.nhs.uk/service-search/sexual-health',
    urlLabel: 'nhs.uk/sexual-health',
  },
  Galop: {
    name: 'Galop',
    description: 'LGBT+ hate crime and domestic abuse.',
    phone: '0800 999 5428',
    url: 'https://www.galop.org.uk',
    urlLabel: 'galop.org.uk',
  },
  CEOP: {
    name: 'CEOP',
    description: 'Online exploitation and abuse of children. Reporting tool.',
    phone: null,
    url: 'https://www.ceop.police.uk',
    urlLabel: 'ceop.police.uk',
  },
};

/**
 * Crisis service mapping by topic area keyword.
 * Used by the crisis support component [A9] when a topic's
 * crisisService field is set.
 */
export const CRISIS_SERVICES: Record<string, { primary: string; fallback: string | null }> = {
  Childline: { primary: 'Childline', fallback: null },
  NSPCC: { primary: 'Childline', fallback: 'NSPCC' },
  "Women's Aid": { primary: 'Childline', fallback: "Women's Aid" },
  CEOP: { primary: 'Childline', fallback: 'CEOP' },
  Galop: { primary: 'Galop', fallback: 'Childline' },
  'The Mix': { primary: 'Childline', fallback: 'The Mix' },
};
