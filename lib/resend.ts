import { Resend } from 'resend'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const RESEND_FROM = process.env.RESEND_FROM || 'JobSeeker <noreply@jobseeker.app>'

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

export interface DailySummary {
  userEmail: string
  date: string
  stats: {
    discovered: number
    applied: number
    responses: number
    interviews: number
  }
  topJobs: Array<{
    title: string
    company: string
    matchScore: number
    url: string
  }>
}

export async function sendDailySummary(
  to: string,
  summary: DailySummary
): Promise<boolean> {
  if (!resend) {
    console.warn('[resend] No API key configured')
    return false
  }

  const { stats, topJobs, date } = summary

  const jobsList = topJobs
    .map((job, i) => `${i + 1}. **${job.title}** at ${job.company} (${job.matchScore}% match)`)
    .join('\n')

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { border-bottom: 2px solid #22c55e; padding-bottom: 16px; margin-bottom: 24px; }
    .title { font-size: 24px; font-weight: 600; color: #1a1a1a; margin: 0; }
    .date { font-size: 14px; color: #6b7280; margin-top: 4px; }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
    .stat { text-align: center; padding: 16px; background: #f9fafb; border-radius: 8px; }
    .stat-value { font-size: 24px; font-weight: 600; color: #22c55e; }
    .stat-label { font-size: 12px; color: #6b7280; }
    .jobs { margin-top: 24px; }
    .jobs h3 { font-size: 16px; margin-bottom: 12px; }
    .job { padding: 12px; background: #f9fafb; border-radius: 6px; margin-bottom: 8px; }
    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; }
    .cta { display: inline-block; background: #22c55e; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="header">
    <h1 class="title">JobSeeker Daily</h1>
    <p class="date">${date}</p>
  </div>

  <div class="stats">
    <div class="stat">
      <div class="stat-value">${stats.discovered}</div>
      <div class="stat-label">Discovered</div>
    </div>
    <div class="stat">
      <div class="stat-value">${stats.applied}</div>
      <div class="stat-label">Applied</div>
    </div>
    <div class="stat">
      <div class="stat-value">${stats.responses}</div>
      <div class="stat-label">Responses</div>
    </div>
    <div class="stat">
      <div class="stat-value">${stats.interviews}</div>
      <div class="stat-label">Interviews</div>
    </div>
  </div>

  ${topJobs.length > 0 ? `
  <div class="jobs">
    <h3>Top Matching Jobs</h3>
    ${topJobs.map(job => `
      <div class="job">
        <strong>${job.title}</strong> at ${job.company}<br>
        <span style="color: #22c55e; font-size: 13px;">${job.matchScore}% match</span>
      </div>
    `).join('')}
  </div>
  ` : ''}

  <div class="footer">
    <p>You're receiving this because you're an Elite member.</p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/app" class="cta">Open Dashboard</a>
  </div>
</body>
</html>
  `.trim()

  try {
    const result = await resend.emails.send({
      from: RESEND_FROM,
      to,
      subject: `JobSeeker Daily — ${date}`,
      html
    })

    return !!result.data?.id
  } catch (err) {
    console.error('[resend] Send error:', err)
    return false
  }
}

export async function sendApplicationConfirmation(
  to: string,
  jobTitle: string,
  company: string
): Promise<boolean> {
  if (!resend) return false

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
  <h2>Application Sent!</h2>
  <p>Your application to <strong>${company}</strong> for <strong>${jobTitle}</strong> has been sent.</p>
  <p>We'll notify you when there's a response.</p>
  <p style="margin-top: 24px; color: #6b7280; font-size: 13px;">
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/app/history">View in Pipeline</a>
  </p>
</body>
</html>
  `.trim()

  try {
    const result = await resend.emails.send({
      from: RESEND_FROM,
      to,
      subject: `Application sent to ${company}`,
      html
    })
    return !!result.data?.id
  } catch (err) {
    console.error('[resend] Send error:', err)
    return false
  }
}