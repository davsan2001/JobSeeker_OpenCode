export type RecruiterEmail = {
  email: string
  confidence: 'high' | 'medium' | 'low'
  source: 'domain' | 'linkedin' | 'about_page' | 'contact_page'
}

const EMAIL_PATTERNS = [
  /[a-zA-Z0-9._%+-]+@(?:recruiting|hiring|talent|hr|people)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi,
  /[a-zA-Z0-9._%+-]+@(?:staff|recruiter|recruitment)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi,
  /[a-zA-Z0-9._%+-]+@(?!gmail|yahoo|hotmail|outlook)[a-zA-Z0-9.-]+\.(?:com|io|co|ai|tech|org)/gi,
]

const RECRUITER_KEYWORDS = [
  'recruiting', 'recruiter', 'hiring', 'talent', 'hr', 'people',
  'staffing', 'human resources', 'careers', 'jobs', 'employment'
]

export async function findRecruiterEmail(
  jobUrl: string,
  jobHtml?: string
): Promise<RecruiterEmail | null> {
  const domain = getDomain(jobUrl)

  if (!domain) return null

  if (jobHtml) {
    const emailsFromPage = extractEmails(jobHtml)
    for (const email of emailsFromPage) {
      const confidence = getEmailConfidence(email, domain)
      if (confidence !== 'low') {
        return { email, confidence, source: 'about_page' }
      }
    }
  }

  const contactUrls = [
    `https://${domain}/about`,
    `https://${domain}/contact`,
    `https://${domain}/careers`,
    `https://${domain}/jobs`,
    `https://${domain}/about-us`,
    `https://${domain}/contact-us`,
    `https://${domain}/human-resources`,
    `https://${domain}/people`,
  ]

  for (const url of contactUrls.slice(0, 5)) {
    try {
      const res = await fetch(url, { 
        method: 'HEAD',
        signal: AbortSignal.timeout(3000)
      })
      if (res.ok) {
        const html = await res.text().catch(() => '')
        const emails = extractEmails(html)
        for (const email of emails) {
          const confidence = getEmailConfidence(email, domain)
          if (confidence !== 'low') {
            return { email, confidence, source: 'contact_page' }
          }
        }
      }
    } catch {
      continue
    }
  }

  const likelyEmail = guessRecruiterEmail(domain)
  return likelyEmail 
    ? { email: likelyEmail, confidence: 'low', source: 'domain' }
    : null
}

function getDomain(url: string): string | null {
  try {
    const u = new URL(url)
    return u.hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

function extractEmails(html: string): string[] {
  const emails = new Set<string>()
  const regex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  let match
  while ((match = regex.exec(html)) !== null) {
    const email = match[0].toLowerCase()
    if (!email.includes('example') && !email.includes('test')) {
      emails.add(email)
    }
  }
  return Array.from(emails)
}

function getEmailConfidence(email: string, domain: string): 'high' | 'medium' | 'low' {
  const e = email.toLowerCase()
  const d = domain.toLowerCase()

  if (d.includes(e.split('@')[1])) {
    for (const kw of RECRUITER_KEYWORDS) {
      if (e.includes(kw)) return 'high'
    }
    return 'medium'
  }

  return 'low'
}

function guessRecruiterEmail(domain: string): string | null {
  const parts = domain.split('.')
  const company = parts[0]

  const patterns = [
    `recruiting@${domain}`,
    `hiring@${domain}`,
    `jobs@${domain}`,
    `careers@${domain}`,
    `hr@${domain}`,
    `people@${domain}`,
    `talent@${domain}`,
    `recruiter@${domain}`,
  ]

  return patterns[0]
}