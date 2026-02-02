const jsonServer = require('json-server');
const cors = require('cors');
const https = require('https');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(cors({ origin: true, credentials: true }));
server.use(jsonServer.bodyParser);
server.use(middlewares);

// ============================================
// SLACK CONFIGURATION (ENV-BASED)
// ============================================
const PRODUCT_CONFIG = {
  'MicroBuilder': {
    botToken: process.env.SLACK_BOT_TOKEN_MICROBUILDER || '',
    channelName: 'elb-microbuilder-feedback',
    channelId: 'C0A5XCEF41Z',
    webhookToken: process.env.SLACK_WEBHOOK_TOKEN_MICROBUILDER || '',
  },
  'Lectora Online': {
    botToken: process.env.SLACK_BOT_TOKEN_LECTORA_ONLINE || '',
    channelName: 'lectora-online-feedback',
    channelId: 'C0A3VKKSZRD',
    webhookToken: process.env.SLACK_WEBHOOK_TOKEN_LECTORA_ONLINE || '',
  },
  'Lectora Desktop': {
    botToken: process.env.SLACK_BOT_TOKEN_LECTORA_DESKTOP || '',
    channelName: 'lectora-desktop-feedback',
    channelId: 'C0A44MPH9B5',
    webhookToken: process.env.SLACK_WEBHOOK_TOKEN_LECTORA_DESKTOP || '',
  },
  'The Training Arcade': {
    botToken: process.env.SLACK_BOT_TOKEN_TRAINING_ARCADE || '',
    channelName: 'the-training-arcade-feedback',
    channelId: 'C0A4E2RK1M0',
    webhookToken: process.env.SLACK_WEBHOOK_TOKEN_TRAINING_ARCADE || '',
  },
  'Rehearsal & RolePlay': {
    botToken: process.env.SLACK_BOT_TOKEN_REHEARSAL_ROLEPLAY || '',
    channelName: 'rehearsal-roleplay-feedback',
    channelId: 'C0A4E7EL9EW',
    webhookToken: process.env.SLACK_WEBHOOK_TOKEN_REHEARSAL_ROLEPLAY || '',
  },
  'Rockstar Learning Platform': {
    botToken: process.env.SLACK_BOT_TOKEN_ROCKSTAR || '',
    channelName: 'rockstar-learning-platform-feedback',
    channelId: 'C0A3YSMAR9V',
    webhookToken: process.env.SLACK_WEBHOOK_TOKEN_ROCKSTAR || '',
  },
  'CourseMill': {
    botToken: process.env.SLACK_BOT_TOKEN_COURSEMILL || '',
    channelName: 'coursemill-feedback',
    channelId: 'C0A4Y96BBA5',
    webhookToken: process.env.SLACK_WEBHOOK_TOKEN_COURSEMILL || '',
  },
  'CenarioVR Studio & Studio Platform Services - AI Toolkit': {
    botToken: process.env.SLACK_BOT_TOKEN_CENARIOVR || '',
    channelName: 'cenariovr-feedback',
    channelId: 'C0A4FVCSX3P',
    webhookToken: process.env.SLACK_WEBHOOK_TOKEN_CENARIOVR || '',
  },
  'Review Link': {
    botToken: process.env.SLACK_BOT_TOKEN_REVIEW_LINK || '',
    channelName: 'review-link-feedback',
    channelId: 'C0A443B24MD',
    webhookToken: process.env.SLACK_WEBHOOK_TOKEN_REVIEW_LINK || '',
  },
  'Asset Library Interface / Keeper': {
    botToken: process.env.SLACK_BOT_TOKEN_ASSET_LIBRARY || '',
    channelName: 'asset-library-feedback',
    channelId: 'C0A4KJBCZ7C',
    webhookToken: process.env.SLACK_WEBHOOK_TOKEN_ASSET_LIBRARY || '',
  },
  'Spice - New Development': {
    botToken: process.env.SLACK_BOT_TOKEN_SPICE || '',
    channelName: 'spice-feedback',
    channelId: 'C0A500UH2HF',
    webhookToken: process.env.SLACK_WEBHOOK_TOKEN_SPICE || '',
  },
};

const WEBHOOK_TOKENS = {
  admin: process.env.SLACK_WEBHOOK_TOKEN_ADMIN || '',
  microbuilder: process.env.SLACK_WEBHOOK_TOKEN_MICROBUILDER || '',
  'lectora-online': process.env.SLACK_WEBHOOK_TOKEN_LECTORA_ONLINE || '',
  'lectora-desktop': process.env.SLACK_WEBHOOK_TOKEN_LECTORA_DESKTOP || '',
  'training-arcade': process.env.SLACK_WEBHOOK_TOKEN_TRAINING_ARCADE || '',
  'the-training-arcade-feedback': process.env.SLACK_WEBHOOK_TOKEN_TRAINING_ARCADE || '',
  'rehearsal-roleplay': process.env.SLACK_WEBHOOK_TOKEN_REHEARSAL_ROLEPLAY || '',
  rockstar: process.env.SLACK_WEBHOOK_TOKEN_ROCKSTAR || '',
  'rockstar-learning-platform-feedback': process.env.SLACK_WEBHOOK_TOKEN_ROCKSTAR || '',
  coursemill: process.env.SLACK_WEBHOOK_TOKEN_COURSEMILL || '',
  cenariovr: process.env.SLACK_WEBHOOK_TOKEN_CENARIOVR || '',
  'review-link': process.env.SLACK_WEBHOOK_TOKEN_REVIEW_LINK || '',
  'asset-library': process.env.SLACK_WEBHOOK_TOKEN_ASSET_LIBRARY || '',
  spice: process.env.SLACK_WEBHOOK_TOKEN_SPICE || '',
};

const channelIdCache = {};

const httpsAgent = new https.Agent({ keepAlive: true });

function callSlackAPI(botToken, endpoint, data) {
  return new Promise((resolve, reject) => {
    if (!botToken) {
      resolve({ ok: false, error: 'Missing Slack bot token' });
      return;
    }
    const formData = new URLSearchParams(data).toString();
    const options = {
      hostname: 'slack.com',
      port: 443,
      path: `/api/${endpoint}`,
      method: 'POST',
      agent: httpsAgent,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${botToken}`,
        'Content-Length': Buffer.byteLength(formData),
      },
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ ok: false, error: 'Invalid JSON response' });
        }
      });
    });

    req.on('error', reject);
    req.write(formData);
    req.end();
  });
}

async function findChannelByName(botToken, channelName) {
  if (channelIdCache[channelName]) return channelIdCache[channelName];

  const result = await callSlackAPI(botToken, 'conversations.list', {
    types: 'public_channel,private_channel',
    limit: '1000',
  });

  if (result.ok && result.channels) {
    const channel = result.channels.find(
      ch =>
        ch.name === channelName ||
        ch.name === channelName.replace(/-/g, '_') ||
        ch.name.includes(channelName.split('-')[0])
    );
    if (channel) {
      channelIdCache[channelName] = channel.id;
      return channel.id;
    }
  }
  return null;
}

async function lookupUserByEmail(botToken, email) {
  const result = await callSlackAPI(botToken, 'users.lookupByEmail', { email });
  return result.ok ? result.user : null;
}

async function inviteUserToChannel(botToken, userId, channelId) {
  const result = await callSlackAPI(botToken, 'conversations.invite', {
    channel: channelId,
    users: userId,
  });
  if (result.error === 'already_in_channel') {
    result.ok = true;
  }
  return result;
}

async function removeUserFromChannel(botToken, userId, channelId) {
  const result = await callSlackAPI(botToken, 'conversations.kick', {
    channel: channelId,
    user: userId,
  });
  if (result.error === 'not_in_channel') {
    result.ok = true;
  }
  return result;
}

function getProductConfig(product) {
  if (PRODUCT_CONFIG[product]) return PRODUCT_CONFIG[product];
  const productLower = product.toLowerCase();
  for (const [key, config] of Object.entries(PRODUCT_CONFIG)) {
    if (key.toLowerCase() === productLower) return config;
  }
  for (const [key, config] of Object.entries(PRODUCT_CONFIG)) {
    if (key.toLowerCase().includes(productLower) || productLower.includes(key.toLowerCase())) {
      return config;
    }
  }
  return null;
}

async function handleAddToChannel(req, res) {
  try {
    const { email, product } = req.body || {};
    if (!email || !product) {
      res.status(400).json({ success: false, error: 'Missing email or product' });
      return;
    }
    const config = getProductConfig(product);
    if (!config) {
      res.status(200).json({ success: false, error: 'No channel configured for this product' });
      return;
    }
    const user = await lookupUserByEmail(config.botToken, email);
    if (!user) {
      res.status(200).json({ success: false, error: 'User not found in Slack workspace' });
      return;
    }
    let channelId = config.channelId;
    if (!channelId) {
      channelId = await findChannelByName(config.botToken, config.channelName);
    }
    if (!channelId) {
      res.status(200).json({ success: false, error: 'Channel ID not configured' });
      return;
    }
    const result = await inviteUserToChannel(config.botToken, user.id, channelId);
    res.status(200).json({
      success: Boolean(result.ok),
      userId: user.id,
      channelId,
      channelName: config.channelName,
      error: result.error,
    });
  } catch (error) {
    res.status(200).json({ success: false, error: error.message });
  }
}

async function handleRemoveFromChannel(req, res) {
  try {
    const { email, product } = req.body || {};
    if (!email || !product) {
      res.status(400).json({ success: false, error: 'Missing email or product' });
      return;
    }
    const config = getProductConfig(product);
    if (!config) {
      res.status(200).json({ success: false, error: 'No channel configured for this product' });
      return;
    }
    const user = await lookupUserByEmail(config.botToken, email);
    if (!user) {
      res.status(200).json({ success: false, error: 'User not found in Slack workspace' });
      return;
    }
    let channelId = config.channelId;
    if (!channelId) {
      channelId = await findChannelByName(config.botToken, config.channelName);
    }
    if (!channelId) {
      res.status(200).json({ success: false, error: 'Channel ID not configured' });
      return;
    }
    const result = await removeUserFromChannel(config.botToken, user.id, channelId);
    res.status(200).json({
      success: Boolean(result.ok),
      userId: user.id,
      channelId,
      channelName: config.channelName,
      error: result.error,
    });
  } catch (error) {
    res.status(200).json({ success: false, error: error.message });
  }
}

function handleWebhook(req, res) {
  const channel = req.params.channel || 'admin';
  const webhookToken = WEBHOOK_TOKENS[channel] || WEBHOOK_TOKENS.admin;
  if (!webhookToken) {
    res.status(200).json({ success: false, error: 'Webhook token not configured' });
    return;
  }
  const body = JSON.stringify(req.body || {});
  const options = {
    hostname: 'hooks.slack.com',
    port: 443,
    path: `/services/${webhookToken}`,
    method: 'POST',
    agent: httpsAgent,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
    },
  };

  const slackReq = https.request(options, slackRes => {
    let responseData = '';
    slackRes.on('data', chunk => (responseData += chunk));
    slackRes.on('end', () => {
      res.status(200).json({ success: slackRes.statusCode === 200, channel });
    });
  });

  slackReq.on('error', error => {
    res.status(200).json({ success: false, error: error.message });
  });

  slackReq.write(body);
  slackReq.end();
}

// ============================================
// GMAIL (APPS SCRIPT) PROXY
// ============================================
function sendViaAppsScript(urlString, payload) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlString);
    const postData = JSON.stringify(payload);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: 'POST',
      agent: httpsAgent,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          resolve({ success: true, message: 'Email sent via Apps Script' });
        } else {
          reject(new Error(`Apps Script error: ${res.statusCode}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function handleSendGmail(req, res) {
  try {
    const appsScriptUrl = process.env.GMAIL_APPS_SCRIPT_URL || '';
    if (!appsScriptUrl) {
      res.status(200).json({ success: true, note: 'Gmail not configured' });
      return;
    }
    const result = await sendViaAppsScript(appsScriptUrl, req.body || {});
    res.status(200).json({ success: true, method: 'apps_script', message: result.message });
  } catch (error) {
    res.status(200).json({ success: false, error: error.message });
  }
}

// ============================================
// CUSTOM ROUTES
// ============================================
server.post('/api/slack/channel/add', handleAddToChannel);
server.post('/api/slack/channel/remove', handleRemoveFromChannel);
server.post('/api/slack-webhook', handleWebhook);
server.post('/api/slack-webhook/:channel', handleWebhook);
server.post('/api/gmail/send', handleSendGmail);

server.use(router);

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`✅ API server running on port ${port}`);
});
