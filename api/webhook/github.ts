import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY;
const githubWebhookSecret = process.env.GITHUB_WEBHOOK_SECRET;

export default async function handler(req: any, res: any) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check configuration
  if (!supabaseUrl || !supabaseKey || !githubWebhookSecret) {
    return res.status(500).json({ error: 'Server not configured. Missing env vars.' });
  }

  // Initialize Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Get raw body for signature verification
  const rawBody = req.body;
  const signature = req.headers['x-hub-signature-256'] || req.headers['X-Hub-Signature-256'];

  if (!signature) {
    return res.status(401).json({ error: 'Missing GitHub signature' });
  }

  // Verify HMAC signature
  const hmac = crypto.createHmac('sha256', githubWebhookSecret);
  const digest = 'sha256=' + hmac.update(JSON.stringify(rawBody)).digest('hex');

  if (digest !== signature) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Parse GitHub event
  const event = req.headers['x-github-event'] || req.headers['X-GitHub-Event'];
  const { repository, action, sender } = rawBody;

  // Only handle repository events from repository owner
  if (!repository || !repository.full_name) {
    return res.status(200).json({ error: 'No repository data' });
  }

  // Only sync from the portfolio owner's repositories
  const ownerLogin = repository.owner?.login;
  if (ownerLogin !== 'h4mmad07') {
    return res.status(200).json({ error: 'Not from portfolio owner' });
  }

  // Only handle push events or repository creation
  if (event !== 'push' && event !== 'create' && event !== 'repository') {
    return res.status(200).json({ error: `Event ${event} not handled` });
  }

  try {
    // Fetch repository details from GitHub API
    const repoResponse = await fetch(`https://api.github.com/repos/${repository.full_name}`, {
      headers: {
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'h4mmad07-portfolio-sync'
      }
    });

    if (!repoResponse.ok) {
      return res.status(500).json({ error: 'Failed to fetch repo from GitHub' });
    }

    const repo = await repoResponse.json();

    // Map GitHub languages to portfolio technologies
    const languagesResponse = await fetch(repo.languages_url, {
      headers: {
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'h4mmad07-portfolio-sync'
      }
    });
    const languages = languagesResponse.ok ? await languagesResponse.json() : {};
    const techStack = Object.keys(languages);

    // Determine category based on languages
    const category = determineCategory(techStack, repo.name, repo.description || '');

    // Generate a unique ID based on GitHub repo ID
    const projectId = `gh-${repository.id}`;

    // Upsert project into Supabase
    const { error } = await supabase
      .from('portfolio_projects')
      .upsert({
        id: projectId,
        title: repo.name.replace(/[-_]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        year: new Date(repo.pushed_at || repo.updated_at).getFullYear().toString(),
        category: category,
        description: repo.description || 'No description provided.',
        technologies: techStack.length > 0 ? techStack : ['GitHub'],
        github_url: repo.html_url,
        live_url: repo.homepage || '',
        thumbnail_url: '',
        screenshots: [],
        status: 'Completed',
        featured: false,
        highlights: [
          `Stars: ${repo.stargazers_count}`,
          `Forks: ${repo.forks_count}`,
          `Last updated: ${new Date(repo.pushed_at || repo.updated_at).toLocaleDateString()}`
        ],
        gradient: 'from-cyan-600/30 to-blue-600/20',
        display_order: 999,
        is_published: true,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (error) {
      console.error('Supabase upsert error:', error);
      return res.status(500).json({ error: 'Failed to save project' });
    }

    return res.status(200).json({
      success: true,
      project: projectId,
      message: `Synced ${repo.full_name}`
    });
  } catch (err: any) {
    console.error('Webhook error:', err);
    return res.status(500).json({ error: err.message || 'Internal error' });
  }
}

function determineCategory(techStack: string[], repoName: string, description: string): string {
  const text = `${techStack.join(' ')} ${repoName} ${description}`.toLowerCase();

  if (text.includes('unity') || text.includes('c#') || text.includes('game')) return 'Game Dev';
  if (text.includes('python') || text.includes('ml') || text.includes('ai') || text.includes('tensorflow') || text.includes('pytorch')) return 'AI & ML';
  if (text.includes('sql') || text.includes('database') || text.includes('postgres') || text.includes('mysql')) return 'Database System';
  if (text.includes('c++') || text.includes('cpp') || text.includes('windows') || text.includes('.net')) return 'Desktop App';
  if (text.includes('react') || text.includes('vue') || text.includes('web') || text.includes('javascript') || text.includes('typescript')) return 'Software Arch';

  return 'Software Arch';
}
