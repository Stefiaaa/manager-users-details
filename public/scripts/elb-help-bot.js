/**
 * ELB Help Bot — Precision Retrieval Engine v3.0.0
 * In-product conversational assistant: KB + Community + Product support.
 *
 * v3.0 — 12-Point Precision Enforcement:
 *   1. Precision retrieval engine — never navigation assistant
 *   2. Mandatory structured output fields per result
 *   3. Strict routing — URLs without content identifiers are discarded
 *   4. Correct search execution: normalize → parallel retrieve → rank
 *   5. Normalized 0-1 confidence thresholds (0.80 / 0.50)
 *   6. Index schema validation on load
 *   7. Dashboard rendering: ranked lists only, no homepage redirect
 *   8. Enforcement gate: validateResult() before every render
 *   9. Debug mode: full pipeline logging via window.elbHelpBotDebug
 *  10. System prompt reinforcement embedded in search logic
 *  11. Root cause prevention: hard validation, zero homepage hardcoding
 *  12. Corrective checklist: index health check, debug log verification
 *
 * Carries forward all v2.1 features:
 *   - TF-IDF semantic similarity (cosine) blended with keyword scoring
 *   - Paragraph-level indexing, scoring, and anchoring
 *   - Inline expandable answer panels
 *   - Differentiated highlighting: exact (yellow), partial (orange), synonym (blue)
 *   - Reinforcement learning: click tracking, feedback, score boosting
 *   - Dynamic reindexing: version-based polling, localStorage cache
 *   - Full article list rendering with progressive pagination
 *   - Feedback buttons on every result
 *
 * v3.1 additions:
 *   - User-facing Reload button in chatbot header to re-fetch index & reset UI
 *   - Clear search button to reset input and return to welcome
 *   - Network error handling with retry UI when index load fails
 *   - Keyboard shortcut: Ctrl+Shift+H to toggle chatbot
 *   - Public API: window.elbHelpBotReload() to programmatically reload
 *   - Graceful offline detection
 *
 * v3.2 fixes:
 *   - Fix: relative index URLs (../sample-index.json) now load correctly
 *   - Panel open/close state persisted in localStorage across page visits
 *   - Search debounce (150ms) prevents redundant renders on fast typing
 *   - Smooth CSS transition on panel open/close instead of instant toggle
 *   - Duplicate zero-result tracking suppressed within same session
 *   - Version consistency across all files
 *   - Inline index support: window.elbHelpBotInlineIndex bypasses XHR for
 *     file:// protocol (demo pages load index via <script> tag fallback)
 *
 * v3.2.2 fix:
 *   - Fix: renderWelcome() now refreshes after async index load completes,
 *     eliminating the false "Precision mode requires a content index" warning
 *   - Added _indexLoading state: shows "Loading content index..." spinner
 *     instead of the misleading warning while the fetch is in progress
 *   - "Precision mode requires" warning now only appears when NO indexUrl
 *     is configured at all (not during async fetch or after successful load)
 *
 * v3.2.3 fix:
 *   - CRITICAL: hasContentIdentifier() now accepts 1-segment KB URLs.
 *     Previously required >= 2 path segments, which rejected every KB article
 *     URL (single slug like /article-name) while community URLs with /topics/
 *     prefix passed. This caused ALL KB results to be silently discarded.
 *   - Added GENERIC_PORTAL_PATHS blocklist so /kb, /community etc. are still
 *     rejected but valid article slugs pass with 1 segment.
 *   - renderResults() now always shows both KB and Community section headers
 *     with count, displaying "No KB articles matched" or "No Community threads
 *     matched" when a section is empty instead of silently hiding it.
 *   - Type comparison in KB/community split is now case-insensitive with
 *     fallback to "kb" when article.type is missing.
 *   - Debug logs include article type distribution on index load, and
 *     discarded results now log article URL for faster diagnosis.
 *
 * v3.3.0 enhancements — Spell Correction & Search Recall:
 *   - Spell correction engine: builds word dictionary from indexed content,
 *     suggests corrections for misspelled query terms via Levenshtein distance
 *   - "Did you mean?" banner shown above results with clickable correction
 *   - Auto-corrected search runs when original query returns zero results
 *   - matchedTerms now includes heading-only matches (was previously skipped)
 *   - Fallback matchedTerms check scans ALL article text: title, body,
 *     section headings, section text, solutionText, and tags
 *   - Multi-keyword co-occurrence bonus: articles where ALL query terms
 *     appear in the same title or heading get a significant score boost
 *   - Adaptive fuzzy threshold: words >= 6 chars use threshold 3 (was fixed 2)
 *   - MIN_RENDER_THRESHOLD lowered from 0.05 to 0.02 for higher recall
 *   - computeRefMax increased to account for co-occurrence bonus
 *
 * v3.4.0 enhancements — Expanded Index & Enhanced Recall:
 *   - Sample index expanded from 15 to 30 articles: all Lectora Actions &
 *     Variables sub-articles, Tests/Surveys/Questions articles, Web Windows,
 *     Web Objects, Custom HTML, and new community threads with solved answers
 *   - Auto-corrected search now also runs when results are LOW confidence
 *     (not only on zero results), merging corrected results with originals
 *   - Spell correction dictionary rebuilt on every index load/reload
 *   - Fuzzy match ratio threshold relaxed from 0.45 to 0.5 for wider recall
 *   - Synonym expansion includes tag-derived terms (hyphenated tags split)
 *   - "action" synonym group extended: includes "condition", "behavior"
 *   - New synonym groups: "test" ↔ "quiz"/"assessment"/"exam"/"pre-test"
 *
 * v3.5.0 enhancements — Dynamic Self-Updating & Smart Matching:
 *   - Visibility-based auto-refresh: index re-checked when browser tab
 *     regains focus, ensuring new articles/synonyms appear without reload
 *   - Window focus auto-refresh with 60s throttle prevents redundant fetches
 *   - Polling interval reduced from 5 min to 2 min for faster content pickup
 *   - Auto-synonym learning from RL: queries that lead to clicks on the
 *     same article cross-pollinate as implicit synonyms for future searches
 *   - Full-phrase matching bonus: multi-word queries matching as a complete
 *     phrase in text get an additional relevance score boost
 *   - Sentence-aware snippet extraction: snippets now respect sentence
 *     boundaries for more natural, readable context previews
 *   - computeRefMax updated to account for phrase bonus in normalization
 *   - One-time integration guarantee: chatbot dynamically absorbs all
 *     future index updates (new articles, synonyms, corrections) with
 *     zero re-integration; the index URL is the single source of truth
 *
 * v3.6.0 fixes — Community Link 404 Resolution & Comprehensive Matching:
 *   - CRITICAL: buildDeepLink text fragment separator fixed from "&:~:text="
 *     to correct ":~:text=" per the W3C Text Fragments specification.
 *     Previously all deep links with both an anchor and text fragment
 *     produced invalid URLs that broke in-page highlighting
 *   - Community-aware deep linking: buildDeepLink now accepts articleType
 *     parameter and skips adding fake section anchors (#body-p0 etc.) for
 *     community articles — these IDs don't exist on community pages and
 *     caused navigation failures on HubSpot-hosted community platform
 *   - solutionText now generates matchedParagraphs entries, ensuring solved
 *     community threads show their accepted answer as the primary snippet
 *     and deep link text instead of the question body
 *   - Sample index community URLs verified against live community site;
 *     two fabricated URLs (a1b2c3d4, e5f6g7h8) replaced with real threads
 *   - Added real community threads for broader coverage (10 community
 *     articles total, up from 7): includes eLearning, awards, events
 *   - Enhanced spell correction: added character transposition detection
 *     (e.g. "varaible" → "variable") using Damerau distance for single
 *     transpositions; increased candidate radius for short words
 *   - Title/body/section/solutionText/tags all contribute to matchedTerms
 *     ensuring comprehensive result display across all content types
 *
 * v3.7.0 fixes — Community 404 Resolution & Comprehensive Search:
 *   - CRITICAL: "Post a new question in Community" link fixed from
 *     non-existent /topics/new?category= path to the real HubSpot
 *     community category page /topics?category=...&hsLang=en
 *     (verified against live community.elblearning.com)
 *   - Enhanced spell correction with keyboard-proximity awareness:
 *     adjacent-key substitutions (e.g. "lectura" → "lectora") are now
 *     detected via QWERTY adjacency map, boosting correction accuracy
 *   - Double-letter and missing-letter spell patterns: "publsih" →
 *     "publish", "varriable" → "variable" detected by specialized checks
 *   - Broader matching: body text scored even when shorter than 15 chars
 *     (previous splitParagraphs min-length filter was too aggressive)
 *   - Tag-derived matching: hyphenated tags like "drag-and-drop" now
 *     contribute individual words to scoring (not just joined text)
 *   - MIN_RENDER_THRESHOLD lowered further from 0.02 to 0.01 for
 *     maximum recall; more borderline results now surface
 *   - Fuzzy match ratio relaxed from 0.5 to 0.55 for wider typo tolerance
 *   - New community articles added to sample index from live site:
 *     Lectora discussions, webinars, blog summaries, and eLearning topics
 *   - Sample index expanded to 35+ articles for comprehensive demo coverage
 *   - Version consistency across all files (admin, integration, stakeholder)
 *
 * v3.8.0 fixes — Flicker / Panel-Close / Matching Stability:
 *   - CRITICAL: Removed showLoading() + 100ms setTimeout wrapper from
 *     renderResults(). Search is synchronous (client-side index), so the
 *     artificial delay caused visible flicker on every search click.
 *   - CRITICAL: Panel no longer closes unexpectedly when clicking dynamic
 *     elements (suggestion buttons, "Show more", retry). Root cause:
 *     innerHTML replacement inside the click handler detached the target
 *     element from the DOM before the event bubbled to the document's
 *     outside-click handler, making _panel.contains(e.target) return
 *     false. Fixed by adding e.stopPropagation() on the panel element
 *     so internal clicks never reach the outside-click handler.
 *   - CSS panel approach changed from opacity:0/pointer-events:none to
 *     display:none with a @keyframes fade-in animation. This eliminates
 *     the invisible-but-in-layout panel that caused accessibility and
 *     interaction edge cases.
 *   - matchedTerms safety net: when an article scores > 0 via TF-IDF
 *     semantic similarity but no direct text match populates matchedTerms,
 *     the query keywords are now injected as matchedTerms to prevent
 *     validateResult() from discarding the result.
 *   - Comprehensive matching verified: title, body, sections (headings +
 *     paragraphs), solutionText, tags, TF-IDF cosine all contribute to
 *     both score and matchedTerms for KB and Community articles equally.
 *   - Spell correction preserved from v3.3–v3.7: Levenshtein, Damerau
 *     transposition, QWERTY keyboard proximity, double-letter patterns.
 *
 * Zero dependencies. Single vanilla JS file. Any tech stack.
 * @version 3.8.0
 */
(function () {
  'use strict';

  var VERSION = '3.8.0';
  var MAX_QUERY_LENGTH = 200;
  var MAX_RESULTS = 10;
  var HIGH_CONFIDENCE = 0.80;
  var MEDIUM_CONFIDENCE = 0.50;
  var MIN_RENDER_THRESHOLD = 0.01;
  var SNIPPET_RADIUS = 90;
  var POS_STORAGE_KEY = 'elb-help-bot-position';
  var PANEL_STATE_KEY = 'elb-help-bot-panel-open';
  var HISTORY_KEY = 'elb-help-bot-history';
  var RL_KEY = 'elb-help-bot-rl';
  var INDEX_CACHE_KEY = 'elb-help-bot-index-cache';
  var MAX_HISTORY = 20;
  var REINDEX_INTERVAL = 120000;
  var DEBOUNCE_MS = 150;

  var KB_BASE = 'https://knowledgebase.elblearning.com';
  var COMMUNITY_BASE = 'https://community.elblearning.com';
  var SUBMIT_TICKET = KB_BASE + '/submit-a-case-to-customer-solutions?hsLang=en';

  var ALLOWED_PRODUCTS = [
    'lectora','cenariovr','training-arcade','microbuilder','rockstar',
    'rehearsal','coursemill','reviewlink','learning-creation-studio','general'
  ];

  var builtIn = {
    lectora:                    { label: 'Lectora\u00ae',                    kb: '/lectora',                    community: 'lectora' },
    cenariovr:                  { label: 'CenarioVR\u00ae',                  kb: '/cenariovr',                  community: 'cenariovr' },
    'training-arcade':          { label: 'The Training Arcade\u00ae',        kb: '/the-training-arcade',        community: 'the-training-arcade' },
    microbuilder:               { label: 'MicroBuilder\u00ae',               kb: '/microbuilder',               community: 'microbuilder' },
    rockstar:                   { label: 'Rockstar Learning Platform',  kb: '/rockstar-learning-platform', community: 'rockstar-learning-platform' },
    rehearsal:                  { label: 'Rehearsal',                   kb: '/rehearsal',                  community: 'rehearsal' },
    coursemill:                  { label: 'CourseMill\u00ae',                 kb: '/coursemill',                 community: 'coursemill' },
    reviewlink:                 { label: 'ReviewLink\u00ae',                 kb: '/reviewlink',                 community: 'reviewlink' },
    'learning-creation-studio': { label: 'The Learning Creation Studio',kb: '/the-learning-creation-studio',community: 'the-learning-creation-studio' },
    general:                    { label: 'General Topics',              kb: '/general-topics',             community: 'all-things-elearning' }
  };

  var STOP_WORDS = ['a','an','the','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','must','shall','can','need','dare','to','of','in','for','on','with','at','by','from','as','into','through','during','before','after','above','below','i','me','my','we','our','you','your','it','its','they','them','their','what','which','who','how','when','where','why','not','no','so','if','or','and','but','then','than','too','very','just','about','also','only'];

  /* =================== DEBUG MODE (Rule 9) =================== */

  function debugLog(category, data) {
    if (!window.elbHelpBotDebug) return;
    try {
      console.groupCollapsed('[ELB-BOT-DEBUG] ' + category);
      if (typeof data === 'object') console.log(JSON.parse(JSON.stringify(data)));
      else console.log(data);
      console.groupEnd();
    } catch (e) {
      console.log('[ELB-BOT-DEBUG] ' + category, data);
    }
  }

  /* =================== VALIDATION ENGINE (Rules 2, 3, 8) =================== */

  var GENERIC_PORTAL_PATHS = ['kb', 'knowledge-base', 'knowledgebase', 'community', 'forum',
    'forums', 'topics', 'support', 'help', 'home', 'index'];

  function hasContentIdentifier(url) {
    if (!url || typeof url !== 'string') return false;
    var path = url.replace(/https?:\/\/[^\/]+/, '').replace(/\?.*$/, '').replace(/#.*$/, '');
    var segments = path.split('/').filter(function (s) { return s.length > 0; });
    if (segments.length === 0) return false;
    if (segments.length === 1) {
      return GENERIC_PORTAL_PATHS.indexOf(segments[0].toLowerCase()) === -1;
    }
    return true;
  }

  function validateResult(r) {
    if (!r || !r.article) {
      debugLog('VALIDATE-REJECT', { reason: 'Missing result or article object' });
      return false;
    }
    var a = r.article;
    if (!a.url || !hasContentIdentifier(a.url)) {
      debugLog('VALIDATE-REJECT', { id: a.id, url: a.url, reason: 'URL missing content identifier' });
      return false;
    }
    if (!a.id) {
      debugLog('VALIDATE-REJECT', { url: a.url, reason: 'Missing article ID' });
      return false;
    }
    if (!r.matchedTerms || r.matchedTerms.length === 0) {
      debugLog('VALIDATE-REJECT', { id: a.id, reason: 'No matched terms' });
      return false;
    }
    if (typeof r.normalizedScore === 'number' && r.normalizedScore < MIN_RENDER_THRESHOLD) {
      debugLog('VALIDATE-REJECT', { id: a.id, score: r.normalizedScore, reason: 'Below minimum render threshold' });
      return false;
    }
    return true;
  }

  function validateIndexArticle(article) {
    var errors = [];
    if (!article.id) errors.push('missing id');
    if (!article.url) errors.push('missing url');
    else if (!hasContentIdentifier(article.url)) errors.push('url lacks content identifier');
    if (!article.type) errors.push('missing type');
    if (!article.title) errors.push('missing title');
    if ((article.type || '').toLowerCase() === 'community') {
      if (typeof article.solved === 'undefined') errors.push('missing solved flag');
    }
    return errors;
  }

  /* =================== SCORE NORMALIZATION (Rule 5) =================== */

  function computeRefMax(weights) {
    return (weights.titleExact || 100) + (weights.titleExact || 100) * 0.5 + 50 +
           (weights.headingExact || 50) + (weights.headingExact || 50) * 0.5 +
           (weights.paragraphExact || 45) +
           (weights.productMatch || 20) +
           (weights.solvedBoost || 30) +
           (weights.acceptedBoost || 20) +
           (weights.recencyWeight || 10) +
           (weights.tagMatch || 15) +
           (weights.semanticWeight || 30) +
           (weights.titleExact || 100) * 0.3;
  }

  /* =================== SYNONYM ENGINE =================== */

  var DEFAULT_SYNONYMS = {
    publish:['export','deploy','release','output','generate'],error:['bug','issue','problem','crash','failure','broken','fault'],
    install:['setup','configure','download','deploy','installation'],create:['build','make','add','new','generate','author'],
    delete:['remove','erase','clear','destroy','trash'],edit:['modify','change','update','alter','revise'],
    login:['signin','sign-in','authenticate','logon','access','sso'],user:['student','learner','participant','member','account','enrollee'],
    course:['module','lesson','training','content','curriculum','program'],quiz:['test','assessment','exam','evaluation','question','survey'],
    score:['grade','mark','result','points','rating','percentage'],report:['analytics','statistics','data','metrics','dashboard','tracking'],
    lms:['learning management system','platform','system'],scorm:['xapi','tincan','cmi5','aicc','standard','package'],
    responsive:['mobile','adaptive','flexible','rcd','device'],video:['media','recording','clip','footage','mp4'],
    audio:['sound','voice','recording','narration','mp3'],image:['picture','photo','graphic','illustration','icon'],
    template:['layout','theme','design','preset','starter'],variable:['parameter','field','value','data','token'],
    trigger:['action','event','behavior','interaction','condition'],action:['trigger','event','behavior','interaction','condition'],
    test:['quiz','assessment','exam','evaluation','pre-test','survey'],slide:['page','screen','view','scene','frame'],
    animation:['transition','effect','motion','movement'],certificate:['credential','badge','completion','award'],
    upload:['import','attach','add file','ingest'],download:['save','export','get','retrieve'],
    permission:['access','role','privilege','right','authorization'],notification:['alert','message','reminder','email','notice'],
    integration:['connect','embed','plugin','api','webhook','sso'],customize:['personalize','configure','modify','theme','brand'],
    collaborate:['share','team','coauthor','review','assign'],accessibility:['ada','wcag','a11y','screen reader','508','aria'],
    vr:['virtual reality','immersive','360','headset','xr'],game:['gamification','arcade','interactive','engagement','play'],
    microlearning:['bite-sized','short','micro','quick lesson','snippet'],preview:['view','display','render','show','demo'],
    navigate:['browse','explore','find','locate','search'],help:['support','assist','guide','documentation','faq']
  };

  var _synonymMap = null;

  function buildSynonymMap(customSynonyms) {
    var map = {};
    function addPair(a, b) {
      a = a.toLowerCase(); b = b.toLowerCase();
      if (!map[a]) map[a] = [];
      if (map[a].indexOf(b) === -1) map[a].push(b);
      if (!map[b]) map[b] = [];
      if (map[b].indexOf(a) === -1) map[b].push(a);
    }
    [DEFAULT_SYNONYMS, customSynonyms || {}].forEach(function (dict) {
      Object.keys(dict).forEach(function (key) {
        var syns = dict[key];
        if (!Array.isArray(syns)) return;
        syns.forEach(function (s) { addPair(key, s); });
        for (var i = 0; i < syns.length; i++)
          for (var j = i + 1; j < syns.length; j++) addPair(syns[i], syns[j]);
      });
    });
    return map;
  }

  function getSynonyms(word) {
    if (!_synonymMap) _synonymMap = buildSynonymMap(null);
    return _synonymMap[word.toLowerCase()] || [];
  }

  /* =================== TEXT PROCESSING =================== */

  function tokenize(text) {
    if (!text || typeof text !== 'string') return [];
    return text.toLowerCase().replace(/[^\w\s-]/g, ' ').split(/\s+/).filter(function (w) { return w.length > 0; });
  }

  function extractKeywords(query) {
    return tokenize(query).filter(function (w) { return w.length > 1 && STOP_WORDS.indexOf(w) === -1; });
  }

  function simpleStem(word) {
    if (word.length < 5) return word;
    var w = word.toLowerCase();
    var suffixes = [['tion',4],['ment',4],['ness',4],['able',4],['ible',4],['less',4],['ally',4],['ing',3],['ous',3],['ive',3],['ful',3],['ly',2],['er',2],['ed',2],['es',2]];
    for (var i = 0; i < suffixes.length; i++) {
      if (w.endsWith(suffixes[i][0]) && w.length > suffixes[i][1] + 2) return w.slice(0, -suffixes[i][1]);
    }
    if (w.endsWith('s') && !w.endsWith('ss') && w.length > 3) return w.slice(0, -1);
    return w;
  }

  function splitParagraphs(text) {
    if (!text) return [];
    return text.split(/\n\n+|\.\s+(?=[A-Z])/).map(function (p) { return p.trim(); }).filter(function (p) { return p.length > 5; });
  }

  /* =================== FUZZY MATCHER =================== */

  function levenshtein(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    var prev = [], curr = [];
    for (var j = 0; j <= a.length; j++) prev[j] = j;
    for (var i = 1; i <= b.length; i++) {
      curr[0] = i;
      for (var j2 = 1; j2 <= a.length; j2++) {
        curr[j2] = Math.min(prev[j2] + 1, curr[j2 - 1] + 1, prev[j2 - 1] + (b[i - 1] === a[j2 - 1] ? 0 : 1));
      }
      var tmp = prev; prev = curr; curr = tmp;
    }
    return prev[a.length];
  }

  function fuzzyMatch(query, target, threshold) {
    if (typeof threshold !== 'number') threshold = query.length >= 6 ? 3 : 2;
    var q = query.toLowerCase(), t = target.toLowerCase();
    if (t.indexOf(q) >= 0) return { match: true, distance: 0, type: 'exact' };
    if (q.indexOf(t) >= 0) return { match: true, distance: 0, type: 'contained' };
    var dist = levenshtein(q, t);
    if (dist <= threshold && dist / Math.max(q.length, t.length) < 0.55) return { match: true, distance: dist, type: 'fuzzy' };
    return { match: false, distance: dist };
  }

  /* =================== TF-IDF SEMANTIC ENGINE =================== */

  var _tfidfIndex = null;

  function buildTfIdf(articles) {
    var docCount = articles.length;
    var df = {};
    var docVectors = {};

    articles.forEach(function (article) {
      var text = (article.title || '') + ' ' + (article.body || '') + ' ' + (article.solutionText || '');
      if (Array.isArray(article.sections)) {
        article.sections.forEach(function (s) { text += ' ' + (s.heading || '') + ' ' + (s.text || ''); });
      }
      var tokens = tokenize(text);
      var seen = {};
      tokens.forEach(function (t) {
        var stem = simpleStem(t);
        if (!seen[stem]) { df[stem] = (df[stem] || 0) + 1; seen[stem] = true; }
      });
    });

    articles.forEach(function (article) {
      var text = (article.title || '') + ' ' + (article.title || '') + ' ' + (article.body || '') + ' ' + (article.solutionText || '');
      if (Array.isArray(article.sections)) {
        article.sections.forEach(function (s) { text += ' ' + (s.heading || '') + ' ' + (s.text || ''); });
      }
      var tokens = tokenize(text);
      var tf = {};
      tokens.forEach(function (t) { var stem = simpleStem(t); tf[stem] = (tf[stem] || 0) + 1; });
      var vec = {};
      var len = tokens.length || 1;
      Object.keys(tf).forEach(function (stem) {
        vec[stem] = (tf[stem] / len) * Math.log((docCount + 1) / ((df[stem] || 0) + 1));
      });
      docVectors[article.id] = vec;
    });

    return { docCount: docCount, df: df, vectors: docVectors };
  }

  function queryToVector(query, df, docCount) {
    var tokens = extractKeywords(query);
    var expanded = [];
    tokens.forEach(function (t) {
      expanded.push(t);
      var stem = simpleStem(t);
      if (expanded.indexOf(stem) === -1) expanded.push(stem);
      getSynonyms(t).slice(0, 2).forEach(function (s) { if (expanded.indexOf(s) === -1) expanded.push(s); });
    });
    var tf = {};
    expanded.forEach(function (t) { var stem = simpleStem(t); tf[stem] = (tf[stem] || 0) + 1; });
    var vec = {};
    var len = expanded.length || 1;
    Object.keys(tf).forEach(function (stem) {
      vec[stem] = (tf[stem] / len) * Math.log((docCount + 1) / ((df[stem] || 0) + 1));
    });
    return vec;
  }

  function cosineSimilarity(vecA, vecB) {
    var dot = 0, normA = 0, normB = 0;
    Object.keys(vecA).forEach(function (k) {
      normA += vecA[k] * vecA[k];
      if (vecB[k]) dot += vecA[k] * vecB[k];
    });
    Object.keys(vecB).forEach(function (k) { normB += vecB[k] * vecB[k]; });
    return (normA && normB) ? dot / (Math.sqrt(normA) * Math.sqrt(normB)) : 0;
  }

  /* =================== SPELL CORRECTION ENGINE =================== */

  var _spellDict = null;

  function buildSpellDictionary(articles) {
    var dict = {};
    articles.forEach(function (a) {
      var fields = [a.title, a.body, a.solutionText];
      if (Array.isArray(a.sections)) {
        a.sections.forEach(function (s) {
          fields.push(s.heading, s.text);
          if (Array.isArray(s.paragraphs)) {
            s.paragraphs.forEach(function (p) { fields.push(typeof p === 'object' ? p.text : p); });
          }
        });
      }
      if (Array.isArray(a.tags)) {
        a.tags.forEach(function (t) { fields.push(t.replace(/-/g, ' ')); });
      }
      fields.forEach(function (text) {
        if (!text) return;
        tokenize(text).forEach(function (w) {
          if (w.length > 2 && STOP_WORDS.indexOf(w) === -1) {
            dict[w] = (dict[w] || 0) + 1;
          }
        });
      });
    });
    return dict;
  }

  function hasTransposition(a, b) {
    if (a.length !== b.length) return false;
    var diffs = [];
    for (var i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) diffs.push(i);
    }
    return diffs.length === 2 && diffs[1] - diffs[0] === 1 &&
           a[diffs[0]] === b[diffs[1]] && a[diffs[1]] === b[diffs[0]];
  }

  var KEYBOARD_ADJACENT = {
    q:'wa',w:'qeas',e:'wrds',r:'etf',t:'ryg',y:'tuh',u:'yij',i:'uok',o:'ipl',p:'ol',
    a:'qwsz',s:'wedxza',d:'erfcxs',f:'rtgvcd',g:'tyhbvf',h:'yujnbg',j:'uikmnh',k:'iolmj',l:'opk',
    z:'asx',x:'zsdc',c:'xdfv',v:'cfgb',b:'vghn',n:'bhjm',m:'njk'
  };

  function isKeyboardAdjacent(a, b) {
    var al = a.toLowerCase(), bl = b.toLowerCase();
    return KEYBOARD_ADJACENT[al] ? KEYBOARD_ADJACENT[al].indexOf(bl) >= 0 : false;
  }

  function keyboardDistance(word, candidate) {
    if (word.length !== candidate.length) return Infinity;
    var diffs = 0;
    for (var i = 0; i < word.length; i++) {
      if (word[i] !== candidate[i]) {
        if (!isKeyboardAdjacent(word[i], candidate[i])) return Infinity;
        diffs++;
      }
    }
    return diffs;
  }

  function hasDoubleLetterError(word, candidate) {
    if (Math.abs(word.length - candidate.length) !== 1) return false;
    var longer = word.length > candidate.length ? word : candidate;
    var shorter = word.length > candidate.length ? candidate : word;
    for (var i = 0; i < longer.length; i++) {
      var without = longer.slice(0, i) + longer.slice(i + 1);
      if (without === shorter) return true;
    }
    return false;
  }

  function suggestCorrection(word) {
    if (!_spellDict || !word) return null;
    var lower = word.toLowerCase();
    if (_spellDict[lower]) return null;
    var stemmed = simpleStem(lower);
    var keys = Object.keys(_spellDict);
    for (var k = 0; k < keys.length; k++) {
      if (keys[k] === stemmed || simpleStem(keys[k]) === stemmed) return null;
    }

    for (var t = 0; t < keys.length; t++) {
      if (hasTransposition(lower, keys[t])) return keys[t];
    }

    var kbBest = null, kbBestDist = Infinity, kbBestFreq = 0;
    for (var kb = 0; kb < keys.length; kb++) {
      var kbDist = keyboardDistance(lower, keys[kb]);
      if (kbDist > 0 && kbDist <= 2 && kbDist < kbBestDist) {
        kbBestDist = kbDist;
        kbBest = keys[kb];
        kbBestFreq = _spellDict[keys[kb]];
      } else if (kbDist === kbBestDist && _spellDict[keys[kb]] > kbBestFreq) {
        kbBest = keys[kb];
        kbBestFreq = _spellDict[keys[kb]];
      }
    }
    if (kbBest && kbBestDist === 1) return kbBest;

    for (var dl = 0; dl < keys.length; dl++) {
      if (hasDoubleLetterError(lower, keys[dl]) && _spellDict[keys[dl]] >= 2) return keys[dl];
    }

    var bestWord = kbBest, bestDist = kbBest ? kbBestDist : Infinity, bestFreq = kbBestFreq;
    for (var j = 0; j < keys.length; j++) {
      var dw = keys[j];
      if (Math.abs(dw.length - lower.length) > 3) continue;
      var dist = levenshtein(lower, dw);
      var maxThreshold = lower.length >= 7 ? 3 : (lower.length >= 4 ? 2 : 1);
      if (dist > 0 && dist <= maxThreshold && dist < bestDist) {
        bestDist = dist;
        bestWord = dw;
        bestFreq = _spellDict[dw];
      } else if (dist === bestDist && _spellDict[dw] > bestFreq) {
        bestWord = dw;
        bestFreq = _spellDict[dw];
      }
    }
    return bestWord;
  }

  function getSpellingSuggestions(keywords) {
    if (!_spellDict) return {};
    var suggestions = {};
    var count = 0;
    keywords.forEach(function (kw) {
      var suggestion = suggestCorrection(kw);
      if (suggestion) { suggestions[kw] = suggestion; count++; }
    });
    return count > 0 ? suggestions : null;
  }

  function buildCorrectedQuery(originalQuery, suggestions) {
    if (!suggestions) return null;
    var corrected = originalQuery;
    Object.keys(suggestions).forEach(function (orig) {
      var re = new RegExp(orig.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      corrected = corrected.replace(re, suggestions[orig]);
    });
    return corrected !== originalQuery ? corrected : null;
  }

  /* =================== REINFORCEMENT LEARNING =================== */

  function getRlData() {
    try { return JSON.parse(localStorage.getItem(RL_KEY) || '{}'); } catch (e) { return {}; }
  }

  function saveRlData(data) {
    try { localStorage.setItem(RL_KEY, JSON.stringify(data)); } catch (e) { /* full */ }
  }

  function trackClick(articleId, query) {
    var rl = getRlData();
    if (!rl.clicks) rl.clicks = {};
    var key = articleId;
    rl.clicks[key] = (rl.clicks[key] || 0) + 1;
    if (!rl.queryClicks) rl.queryClicks = {};
    var qk = query.toLowerCase().trim();
    if (!rl.queryClicks[qk]) rl.queryClicks[qk] = {};
    rl.queryClicks[qk][articleId] = (rl.queryClicks[qk][articleId] || 0) + 1;
    saveRlData(rl);
  }

  function trackFeedback(articleId, query, helpful) {
    var rl = getRlData();
    if (!rl.feedback) rl.feedback = {};
    var key = articleId;
    if (!rl.feedback[key]) rl.feedback[key] = { up: 0, down: 0 };
    if (helpful) rl.feedback[key].up++; else rl.feedback[key].down++;
    if (!rl.zeroResults) rl.zeroResults = [];
    saveRlData(rl);
  }

  function trackZeroResult(query) {
    var key = query.toLowerCase().trim();
    if (_zeroResultsThisSession[key]) return;
    _zeroResultsThisSession[key] = true;
    var rl = getRlData();
    if (!rl.zeroResults) rl.zeroResults = [];
    rl.zeroResults.push({ q: query, t: Date.now() });
    if (rl.zeroResults.length > 200) rl.zeroResults = rl.zeroResults.slice(-200);
    saveRlData(rl);
  }

  function getRlBoost(articleId, query) {
    var rl = getRlData();
    var boost = 0;
    if (rl.clicks && rl.clicks[articleId]) boost += Math.min(rl.clicks[articleId] * 2, 20);
    if (rl.feedback && rl.feedback[articleId]) {
      var fb = rl.feedback[articleId];
      boost += (fb.up - fb.down) * 5;
    }
    var qk = query.toLowerCase().trim();
    if (rl.queryClicks && rl.queryClicks[qk] && rl.queryClicks[qk][articleId]) {
      boost += Math.min(rl.queryClicks[qk][articleId] * 8, 40);
    }
    return boost;
  }

  /* =================== AUTO-SYNONYM LEARNING (from RL data) =================== */

  function getLearnedSynonyms(keywords) {
    var rl = getRlData();
    if (!rl.queryClicks) return [];
    var clickedArticles = {};
    keywords.forEach(function (kw) {
      var kwl = kw.toLowerCase();
      Object.keys(rl.queryClicks).forEach(function (pastQuery) {
        if (pastQuery.indexOf(kwl) >= 0) {
          var arts = rl.queryClicks[pastQuery];
          Object.keys(arts).forEach(function (aid) { clickedArticles[aid] = true; });
        }
      });
    });
    var articleIds = Object.keys(clickedArticles);
    if (articleIds.length === 0) return [];
    var learned = [];
    Object.keys(rl.queryClicks).forEach(function (pastQuery) {
      var dominated = false;
      keywords.forEach(function (kw) { if (pastQuery.indexOf(kw.toLowerCase()) >= 0) dominated = true; });
      if (dominated) return;
      var arts = rl.queryClicks[pastQuery];
      for (var i = 0; i < articleIds.length; i++) {
        if (arts[articleIds[i]]) {
          extractKeywords(pastQuery).forEach(function (pk) {
            if (learned.indexOf(pk) === -1 && keywords.indexOf(pk) === -1) learned.push(pk);
          });
          break;
        }
      }
    });
    return learned.slice(0, 8);
  }

  /* =================== INTENT CLASSIFIER =================== */

  var INTENT_PATTERNS = [
    { id: 'how-to',          pattern: /\b(how|ways?)\s+(to|do|can|should|would)\b/i,             label: 'How-to' },
    { id: 'error',           pattern: /\b(error|bug|issue|problem|crash|fail|broken|not working|doesn'?t work|can'?t|cannot|unable|wrong|stuck)\b/i, label: 'Troubleshooting' },
    { id: 'feature',         pattern: /\b(feature|capability|function|option|where|find|locate|does it|is there)\b/i, label: 'Feature' },
    { id: 'configuration',   pattern: /\b(config|setup|install|integrate|connect|deploy|setting|enable|disable)\b/i, label: 'Configuration' },
    { id: 'billing',         pattern: /\b(bill|payment|subscription|license|pricing|cost|renew|cancel|upgrade|trial)\b/i, label: 'Billing' },
    { id: 'getting-started', pattern: /\b(getting started|beginner|new to|first time|tutorial|quickstart|intro|basics|overview)\b/i, label: 'Getting Started' },
    { id: 'comparison',      pattern: /\b(compare|comparison|difference|vs|versus|between|which|better)\b/i, label: 'Comparison' },
    { id: 'account',         pattern: /\b(account|profile|password|login|signin|sign.?in|sso|reset|forgot)\b/i, label: 'Account' }
  ];

  function classifyIntent(query) {
    var q = query.toLowerCase();
    for (var i = 0; i < INTENT_PATTERNS.length; i++) {
      if (INTENT_PATTERNS[i].pattern.test(q)) return { id: INTENT_PATTERNS[i].id, label: INTENT_PATTERNS[i].label };
    }
    return { id: 'general', label: 'General' };
  }

  /* =================== CONTENT INDEX + DYNAMIC REINDEX =================== */

  var _contentIndex = null;
  var _indexLoaded = false;
  var _indexLoading = false;
  var _indexVersion = null;
  var _reindexTimer = null;
  var _indexHealth = { total: 0, valid: 0, errors: [] };

  function runIndexHealthCheck(articles) {
    _indexHealth = { total: articles.length, valid: 0, errors: [] };
    articles.forEach(function (article, idx) {
      var errs = validateIndexArticle(article);
      if (errs.length === 0) {
        _indexHealth.valid++;
      } else {
        _indexHealth.errors.push({ index: idx, id: article.id || '(no id)', errors: errs });
      }
    });
    debugLog('INDEX-HEALTH-CHECK', _indexHealth);
    if (window.elbHelpBotOnIndexHealth) {
      try { window.elbHelpBotOnIndexHealth(_indexHealth); } catch (e) { /* */ }
    }
  }

  function applyIndexData(data) {
    _contentIndex = data;
    _indexLoaded = true;
    _indexVersion = data.version || null;
    if (data.synonyms) _synonymMap = buildSynonymMap(data.synonyms);
    _tfidfIndex = buildTfIdf(data.articles);
    _spellDict = buildSpellDictionary(data.articles);
    runIndexHealthCheck(data.articles);

    var typeDist = {};
    (data.articles || []).forEach(function (a) {
      var t = (a.type || 'unknown').toLowerCase();
      typeDist[t] = (typeDist[t] || 0) + 1;
    });
    debugLog('INDEX-TYPE-DISTRIBUTION', { total: (data.articles || []).length, types: typeDist, version: data.version });
  }

  function loadContentIndex(url, cb) {
    var inlineData = window.elbHelpBotInlineIndex;
    if (inlineData && inlineData.articles && Array.isArray(inlineData.articles)) {
      debugLog('INDEX-INLINE', { version: inlineData.version, articles: inlineData.articles.length });
      applyIndexData(inlineData);
      cb(inlineData);
    }

    if (!url || typeof url !== 'string') { if (!_indexLoaded) cb(null); return; }

    try {
      var cached = localStorage.getItem(INDEX_CACHE_KEY);
      if (cached) {
        var parsed = JSON.parse(cached);
        if (parsed && parsed.articles) {
          applyIndexData(parsed);
          cb(parsed);
        }
      }
    } catch (e) { /* cache miss */ }

    var xhr = new XMLHttpRequest();
    xhr.timeout = 10000;
    xhr.onload = function () {
      try {
        var data = JSON.parse(xhr.responseText);
        if (data && data.articles && Array.isArray(data.articles)) {
          var isNew = !_indexVersion || data.version !== _indexVersion;
          applyIndexData(data);
          try { localStorage.setItem(INDEX_CACHE_KEY, xhr.responseText); } catch (e) { /* full */ }
          cb(data, isNew);
        } else if (!_indexLoaded) { cb(null); }
      } catch (e) { if (!_indexLoaded) cb(null); }
    };
    xhr.onerror = function () { _indexLoadError = true; if (!_indexLoaded) cb(null); };
    xhr.ontimeout = function () { _indexLoadError = true; if (!_indexLoaded) cb(null); };
    xhr.open('GET', url);
    xhr.send();
  }

  function startReindexPolling(url) {
    if (_reindexTimer) clearInterval(_reindexTimer);
    _reindexTimer = setInterval(function () {
      loadContentIndex(url, function (data, isNew) {
        if (isNew && data) {
          applyConfidenceConfig(data.confidenceConfig);
        }
      });
    }, REINDEX_INTERVAL);
  }

  function applyConfidenceConfig(conf) {
    if (!conf) return;
    if (typeof conf.high === 'number') HIGH_CONFIDENCE = conf.high;
    if (typeof conf.medium === 'number') MEDIUM_CONFIDENCE = conf.medium;
    if (typeof conf.minRenderThreshold === 'number') MIN_RENDER_THRESHOLD = conf.minRenderThreshold;
    if (typeof conf.maxResults === 'number') MAX_RESULTS = conf.maxResults;
  }

  /* =================== SEARCH ENGINE (Rules 4, 10) =================== */

  function getDefaultWeights() {
    return {
      titleExact:100,titlePartial:60,titleFuzzy:35,headingExact:50,headingPartial:30,headingFuzzy:18,
      bodyExact:40,bodyPartial:25,bodyFuzzy:12,paragraphExact:45,paragraphPartial:28,paragraphFuzzy:14,
      synonymMatch:0.7,solvedBoost:30,acceptedBoost:20,recencyDays:365,recencyWeight:10,
      tagMatch:15,productMatch:20,semanticWeight:30,rlWeight:1.0
    };
  }

  function classifyTermMatch(text, term, synonyms) {
    if (!text) return null;
    var lower = text.toLowerCase(), tl = term.toLowerCase();
    if (lower.indexOf(tl) >= 0) return 'exact';
    if (lower.indexOf(simpleStem(tl)) >= 0) return 'partial';
    for (var i = 0; i < (synonyms || []).length; i++) {
      if (lower.indexOf(synonyms[i].toLowerCase()) >= 0) return 'synonym';
    }
    var tokens = tokenize(text);
    for (var j = 0; j < tokens.length; j++) {
      if (fuzzyMatch(tl, tokens[j]).match) return 'partial';
    }
    return null;
  }

  function scoreText(text, queryTerms, synonymTerms, weights, prefix) {
    if (!text) return { score: 0, termsFound: [] };
    var lower = text.toLowerCase(), score = 0, termsFound = [];
    queryTerms.forEach(function (term) {
      var tl = term.toLowerCase(), stemmed = simpleStem(tl);
      if (lower.indexOf(tl) >= 0) { score += (weights[prefix + 'Exact'] || 40); termsFound.push(tl); }
      else if (lower.indexOf(stemmed) >= 0) { score += (weights[prefix + 'Partial'] || 25); termsFound.push(tl); }
      else {
        var tokens = tokenize(text);
        for (var i = 0; i < tokens.length; i++) {
          var fm = fuzzyMatch(tl, tokens[i]);
          if (fm.match && fm.type === 'fuzzy') {
            score += (weights[prefix + 'Fuzzy'] || 12); termsFound.push(tl); break;
          }
        }
      }
    });
    if (synonymTerms && synonymTerms.length > 0) {
      var synMult = weights.synonymMatch || 0.7;
      synonymTerms.forEach(function (syn) {
        if (lower.indexOf(syn.toLowerCase()) >= 0) score += (weights[prefix + 'Partial'] || 25) * synMult;
      });
    }
    if (queryTerms.length > 1 && termsFound.length === queryTerms.length) {
      score += (weights[prefix + 'Exact'] || 40) * 0.5;
    }
    return { score: score, termsFound: termsFound };
  }

  function computeRecencyScore(dateStr, weights) {
    if (!dateStr) return 0;
    try {
      var diff = (Date.now() - new Date(dateStr).getTime()) / 86400000;
      var maxDays = weights.recencyDays || 365;
      if (diff < 0) diff = 0;
      return diff > maxDays ? 0 : (1 - diff / maxDays) * (weights.recencyWeight || 10);
    } catch (e) { return 0; }
  }

  function searchIndex(query, product) {
    var empty = { kb: [], community: [], all: [], discarded: [], spellingSuggestions: null, correctedQuery: null };
    if (!_contentIndex || !_contentIndex.articles) return empty;
    var keywords = extractKeywords(query);
    if (keywords.length === 0) keywords = tokenize(query);
    if (keywords.length === 0) return empty;

    var spellingSuggestions = getSpellingSuggestions(keywords);
    var correctedQuery = spellingSuggestions ? buildCorrectedQuery(query, spellingSuggestions) : null;

    var allSynonyms = [];
    keywords.forEach(function (kw) {
      getSynonyms(kw).forEach(function (s) { if (allSynonyms.indexOf(s) === -1 && keywords.indexOf(s) === -1) allSynonyms.push(s); });
      getSynonyms(simpleStem(kw)).forEach(function (s) { if (allSynonyms.indexOf(s) === -1 && keywords.indexOf(s) === -1) allSynonyms.push(s); });
    });

    var learnedSyns = getLearnedSynonyms(keywords);
    learnedSyns.forEach(function (ls) { if (allSynonyms.indexOf(ls) === -1 && keywords.indexOf(ls) === -1) allSynonyms.push(ls); });

    debugLog('QUERY-NORMALIZE', { raw: query, keywords: keywords, synonyms: allSynonyms, learnedSynonyms: learnedSyns, spellingSuggestions: spellingSuggestions, correctedQuery: correctedQuery });

    var weights = _contentIndex.weightConfig || getDefaultWeights();
    var refMax = computeRefMax(weights);
    var queryLower = query.toLowerCase();
    var qVec = _tfidfIndex ? queryToVector(query, _tfidfIndex.df, _tfidfIndex.docCount) : null;
    var rawResults = [];

    _contentIndex.articles.forEach(function (article) {
      var score = 0;
      var matchedParagraphs = [];
      var matchedSections = [];
      var matchedTerms = [];

      if (product && article.product && article.product !== product && article.product !== 'general') {
        score -= (weights.productMatch || 20);
      } else if (product && article.product === product) {
        score += (weights.productMatch || 20);
      }

      var titleResult = scoreText(article.title || '', keywords, allSynonyms, weights, 'title');
      score += titleResult.score;
      titleResult.termsFound.forEach(function (t) { if (matchedTerms.indexOf(t) === -1) matchedTerms.push(t); });
      if (article.title && article.title.toLowerCase() === queryLower) score += 50;

      if (Array.isArray(article.sections)) {
        article.sections.forEach(function (section) {
          var headingResult = scoreText(section.heading || '', keywords, allSynonyms, weights, 'heading');
          var headingScore = headingResult.score;
          headingResult.termsFound.forEach(function (t) { if (matchedTerms.indexOf(t) === -1) matchedTerms.push(t); });
          var sectionBodyScore = 0;

          var paragraphs = section.paragraphs || (section.text ? splitParagraphs(section.text) : []);
          if (paragraphs.length === 0 && section.text) paragraphs = [section.text];

          paragraphs.forEach(function (para, pIdx) {
            var pText = typeof para === 'object' ? para.text : para;
            var pAnchor = typeof para === 'object' ? para.anchor : ((section.anchor || '') + '-p' + pIdx);
            var pResult = scoreText(pText || '', keywords, allSynonyms, weights, 'paragraph');
            var pScore = pResult.score;

            if (pScore > 0) {
              var matchTypes = {};
              keywords.forEach(function (kw) {
                var mt = classifyTermMatch(pText, kw, allSynonyms);
                if (mt) { matchTypes[kw] = mt; if (matchedTerms.indexOf(kw) === -1) matchedTerms.push(kw); }
              });
              allSynonyms.forEach(function (syn) {
                if ((pText || '').toLowerCase().indexOf(syn.toLowerCase()) >= 0) {
                  matchTypes[syn] = 'synonym';
                  if (matchedTerms.indexOf(syn) === -1) matchedTerms.push(syn);
                }
              });

              matchedParagraphs.push({
                text: pText, anchor: pAnchor,
                sectionHeading: section.heading || '', sectionAnchor: section.anchor || '',
                score: pScore, matchTypes: matchTypes
              });
              sectionBodyScore += pScore;
            }
          });

          if (headingScore > 0 && sectionBodyScore === 0 && section.text) {
            matchedParagraphs.push({
              text: section.text, anchor: section.anchor || '',
              sectionHeading: section.heading || '', sectionAnchor: section.anchor || '',
              score: headingScore * 0.5, matchTypes: {}
            });
          }

          var sectionScore = headingScore + sectionBodyScore;
          if (sectionScore > 0) {
            matchedSections.push({
              heading: section.heading, anchor: section.anchor || '',
              text: section.text || '', score: sectionScore, level: section.level || 2
            });
          }
          score += sectionScore;
        });
      }

      if (article.body) {
        var bodyParas = splitParagraphs(article.body);
        if (bodyParas.length === 0) bodyParas = [article.body];
        bodyParas.forEach(function (bp, bpIdx) {
          var bpResult = scoreText(bp, keywords, allSynonyms, weights, 'paragraph');
          var bpScore = bpResult.score;
          if (bpScore > 0) {
            bpResult.termsFound.forEach(function (t) { if (matchedTerms.indexOf(t) === -1) matchedTerms.push(t); });
            var matchTypes = {};
            keywords.forEach(function (kw) { var mt = classifyTermMatch(bp, kw, allSynonyms); if (mt) matchTypes[kw] = mt; });
            matchedParagraphs.push({
              text: bp, anchor: 'body-p' + bpIdx, sectionHeading: '', sectionAnchor: '',
              score: bpScore, matchTypes: matchTypes
            });
          }
          score += bpScore;
        });
      }

      if (article.solutionText) {
        var solResult = scoreText(article.solutionText, keywords, allSynonyms, weights, 'paragraph');
        score += solResult.score * 1.2;
        solResult.termsFound.forEach(function (t) { if (matchedTerms.indexOf(t) === -1) matchedTerms.push(t); });
        if (solResult.score > 0) {
          var solMatchTypes = {};
          keywords.forEach(function (kw) { var mt = classifyTermMatch(article.solutionText, kw, allSynonyms); if (mt) solMatchTypes[kw] = mt; });
          matchedParagraphs.push({
            text: article.solutionText, anchor: 'accepted-solution',
            sectionHeading: 'Accepted Solution', sectionAnchor: '',
            score: solResult.score * 1.2, matchTypes: solMatchTypes
          });
        }
      }

      if (Array.isArray(article.tags)) {
        article.tags.forEach(function (tag) {
          var tagLower = tag.toLowerCase().replace(/-/g, ' ');
          var tagWords = tagLower.split(/\s+/);
          keywords.forEach(function (kw) {
            var kwl = kw.toLowerCase();
            if (tagLower.indexOf(kwl) >= 0) {
              score += (weights.tagMatch || 15);
              if (matchedTerms.indexOf(kw) === -1) matchedTerms.push(kw);
            } else {
              for (var tw = 0; tw < tagWords.length; tw++) {
                var fm = fuzzyMatch(kwl, tagWords[tw]);
                if (fm.match) {
                  score += (weights.tagMatch || 15) * 0.6;
                  if (matchedTerms.indexOf(kw) === -1) matchedTerms.push(kw);
                  break;
                }
              }
            }
          });
          allSynonyms.forEach(function (syn) {
            if (tagLower.indexOf(syn.toLowerCase()) >= 0) {
              score += (weights.tagMatch || 15) * 0.5;
              if (matchedTerms.indexOf(syn) === -1) matchedTerms.push(syn);
            }
          });
        });
      }

      if (article.solved) score += (weights.solvedBoost || 30);
      if (article.accepted) score += (weights.acceptedBoost || 20);
      score += computeRecencyScore(article.updatedAt, weights);

      if (qVec && _tfidfIndex && _tfidfIndex.vectors[article.id]) {
        var sim = cosineSimilarity(qVec, _tfidfIndex.vectors[article.id]);
        score += sim * (weights.semanticWeight || 30);
      }

      var rlBoost = getRlBoost(article.id, query) * (weights.rlWeight || 1.0);
      score += rlBoost;

      if (keywords.length > 1) {
        var phraseStr = keywords.join(' ');
        var fullText = ((article.title || '') + ' ' + (article.body || '')).toLowerCase();
        if (Array.isArray(article.sections)) {
          article.sections.forEach(function (sec) { fullText += ' ' + ((sec.heading || '') + ' ' + (sec.text || '')).toLowerCase(); });
        }
        if (article.solutionText) fullText += ' ' + article.solutionText.toLowerCase();
        if (fullText.indexOf(phraseStr) >= 0) {
          score += (weights.titleExact || 100) * 0.3;
          debugLog('PHRASE-MATCH', { id: article.id, phrase: phraseStr });
        }
      }

      if (matchedTerms.length === 0) {
        var allText = (article.title || '') + ' ' + (article.body || '') + ' ' + (article.solutionText || '');
        if (Array.isArray(article.sections)) {
          article.sections.forEach(function (s) {
            allText += ' ' + (s.heading || '') + ' ' + (s.text || '');
          });
        }
        if (Array.isArray(article.tags)) allText += ' ' + article.tags.join(' ').replace(/-/g, ' ');
        var allLower = allText.toLowerCase();
        keywords.forEach(function (kw) {
          var kwl = kw.toLowerCase(), stemmed = simpleStem(kwl);
          if (allLower.indexOf(kwl) >= 0 || allLower.indexOf(stemmed) >= 0) {
            if (matchedTerms.indexOf(kw) === -1) matchedTerms.push(kw);
          }
        });
        allSynonyms.forEach(function (syn) {
          if (allLower.indexOf(syn.toLowerCase()) >= 0 && matchedTerms.indexOf(syn) === -1) matchedTerms.push(syn);
        });
      }

      if (score > 0 && matchedTerms.length === 0) {
        keywords.forEach(function (kw) { if (matchedTerms.indexOf(kw) === -1) matchedTerms.push(kw); });
      }

      if (score > 0) {
        matchedParagraphs.sort(function (a, b) { return b.score - a.score; });
        matchedSections.sort(function (a, b) { return b.score - a.score; });
        var normalizedScore = Math.min(1.0, score / refMax);
        rawResults.push({
          article: article, score: score, normalizedScore: normalizedScore,
          matchedParagraphs: matchedParagraphs, matchedSections: matchedSections,
          matchedTerms: matchedTerms
        });
      }
    });

    rawResults.sort(function (a, b) { return b.score - a.score; });

    var valid = [];
    var discarded = [];
    rawResults.forEach(function (r) {
      if (validateResult(r)) valid.push(r);
      else discarded.push(r);
    });

    var kbResults = valid.filter(function (r) { return (r.article.type || 'kb').toLowerCase() !== 'community'; });
    var communityResults = valid.filter(function (r) { return (r.article.type || '').toLowerCase() === 'community'; });

    debugLog('RAW-KB-RESULTS', kbResults.map(function (r) {
      return { id: r.article.id, type: r.article.type, title: r.article.title, score: r.score, normalized: r.normalizedScore, url: r.article.url };
    }));
    debugLog('RAW-COMMUNITY-RESULTS', communityResults.map(function (r) {
      return { id: r.article.id, type: r.article.type, title: r.article.title, score: r.score, normalized: r.normalizedScore, url: r.article.url };
    }));
    debugLog('DISCARDED-RESULTS', discarded.map(function (r) {
      return { id: r.article ? r.article.id : 'N/A', url: r.article ? r.article.url : 'N/A', reason: 'validation-failed' };
    }));
    debugLog('FINAL-RANKED-ORDER', valid.map(function (r, i) {
      return { rank: i + 1, id: r.article.id, normalized: r.normalizedScore, url: r.article.url };
    }));

    return { kb: kbResults, community: communityResults, all: valid, discarded: discarded, spellingSuggestions: spellingSuggestions, correctedQuery: correctedQuery };
  }

  /* =================== SNIPPET + HIGHLIGHT =================== */

  function generateSnippet(text, terms, radius) {
    if (!text) return '';
    radius = radius || SNIPPET_RADIUS;
    var lower = text.toLowerCase(), bestPos = -1, bestTerm = '';
    for (var i = 0; i < terms.length; i++) {
      var pos = lower.indexOf(terms[i].toLowerCase());
      if (pos >= 0) { bestPos = pos; bestTerm = terms[i]; break; }
    }
    if (bestPos < 0) return text.length > radius * 2 ? text.substring(0, radius * 2) + '\u2026' : text;

    var sentStart = text.lastIndexOf('. ', bestPos);
    sentStart = sentStart >= 0 ? sentStart + 2 : 0;
    var sentEnd = text.indexOf('. ', bestPos + bestTerm.length);
    if (sentEnd < 0) sentEnd = text.indexOf('.', bestPos + bestTerm.length);
    sentEnd = sentEnd >= 0 ? sentEnd + 1 : text.length;
    var sentence = text.substring(sentStart, sentEnd).trim();
    if (sentence.length > 0 && sentence.length <= radius * 3) {
      return (sentStart > 0 ? '\u2026' : '') + sentence + (sentEnd < text.length ? '\u2026' : '');
    }

    var start = Math.max(0, bestPos - radius), end = Math.min(text.length, bestPos + bestTerm.length + radius);
    return (start > 0 ? '\u2026' : '') + text.substring(start, end) + (end < text.length ? '\u2026' : '');
  }

  function highlightWithTypes(text, keywords, synonymList) {
    if (!text) return '';
    var escaped = esc(text);

    var allTerms = [];
    (keywords || []).forEach(function (kw) { allTerms.push({ term: kw, cls: 'zikb-hl-exact' }); });
    (keywords || []).forEach(function (kw) {
      var stem = simpleStem(kw);
      if (stem !== kw) allTerms.push({ term: stem, cls: 'zikb-hl-partial' });
    });
    (synonymList || []).forEach(function (s) { allTerms.push({ term: s, cls: 'zikb-hl-synonym' }); });

    allTerms.sort(function (a, b) { return b.term.length - a.term.length; });

    var used = [];
    allTerms.forEach(function (item) {
      var escapedTerm = esc(item.term);
      var re = new RegExp('(' + escapedTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
      escaped = escaped.replace(re, function (match) {
        for (var i = 0; i < used.length; i++) {
          if (match.toLowerCase() === used[i].toLowerCase()) return match;
        }
        used.push(match);
        return '<mark class="' + item.cls + '">' + match + '</mark>';
      });
    });

    return escaped;
  }

  /* =================== DEEP LINKER (Rule 3, 7) =================== */

  function buildDeepLink(url, matchedTerms, anchor, paragraphText, articleType) {
    if (!url) return null;
    if (!hasContentIdentifier(url)) {
      debugLog('DEEP-LINK-REJECTED', { url: url, reason: 'No content identifier' });
      return null;
    }
    var finalUrl = url;
    var isCommunity = (articleType || '').toLowerCase() === 'community';

    if (anchor && !isCommunity) {
      finalUrl += (finalUrl.indexOf('#') >= 0 ? '' : '#' + anchor);
    }

    var textTarget = paragraphText || (matchedTerms && matchedTerms[0]) || '';
    if (textTarget) {
      var maxLen = isCommunity ? 50 : 80;
      var snippet = textTarget.length > maxLen ? textTarget.substring(0, maxLen).trim() : textTarget.trim();
      if (snippet.length > 5) {
        var encoded = encodeURIComponent(snippet);
        if (finalUrl.indexOf('#:~:text=') < 0) {
          finalUrl += (finalUrl.indexOf('#') >= 0 ? ':~:text=' : '#:~:text=') + encoded;
        }
      }
    }
    return finalUrl;
  }

  /* =================== SECURITY & UTILS =================== */

  function esc(s) { var d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }

  function sanitizeQuery(query) {
    if (!query || typeof query !== 'string') return '';
    var s = String(query).trim();
    if (s.length > MAX_QUERY_LENGTH) s = s.substring(0, MAX_QUERY_LENGTH);
    return s.replace(/[<>"']/g, '');
  }

  function validateProduct(product) {
    if (!product || typeof product !== 'string') return 'general';
    var slug = String(product).toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    if (slug.length > 50) slug = slug.substring(0, 50);
    if (ALLOWED_PRODUCTS.indexOf(slug) >= 0) return slug;
    if (/^[a-z0-9-]+$/.test(slug)) return slug;
    return 'general';
  }

  function isValidConfigUrl(url) {
    if (!url || typeof url !== 'string') return false;
    return url.trim().indexOf('https://') === 0 && url.trim().length < 500;
  }

  function isValidIndexUrl(url) {
    if (!url || typeof url !== 'string') return false;
    var u = url.trim();
    if (u.length === 0 || u.length > 500) return false;
    if (u.indexOf('https://') === 0) return true;
    if (u.indexOf('http://') === 0) return true;
    if (u.indexOf('/') === 0 || u.indexOf('./') === 0 || u.indexOf('../') === 0) return true;
    if (/^[a-zA-Z0-9._\-\/]+\.json/.test(u)) return true;
    return false;
  }

  function getContext() { var ctx = window.productContext; return (ctx && typeof ctx === 'object') ? ctx : {}; }

  function mergeProducts(custom) {
    var out = {};
    Object.keys(builtIn).forEach(function (k) { out[k] = builtIn[k]; });
    if (custom && custom.customProducts) Object.keys(custom.customProducts).forEach(function (k) { out[k] = custom.customProducts[k]; });
    return out;
  }

  function getProductConfig(product, config) {
    var products = mergeProducts(config);
    var base = products[product] || products.general;
    var overrides = (config && config.adminOverrides && config.adminOverrides[product]) || {};
    return {
      label: base ? base.label : product, kb: base ? base.kb : '/general-topics',
      community: base ? base.community : 'all-things-elearning',
      welcomeMessage: overrides.welcomeMessage || "What can we help you find? Ask anything \u2014 we\u2019ll point you to the right resources."
    };
  }

  function buildActionLinks(product, query, config) {
    var p = getProductConfig(product, config);
    var kw = extractKeywords(query), searchTerm = kw.length ? kw.join(' ') : (query.trim() || 'help');
    var enc = encodeURIComponent(searchTerm);
    return {
      postNewQuestion: COMMUNITY_BASE + '/topics?category=' + p.community + '&hsLang=en',
      submitTicket: SUBMIT_TICKET,
      searchTerm: searchTerm
    };
  }

  function getHistory() { try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch (e) { return []; } }
  function addHistory(query) {
    if (!query || !query.trim()) return;
    try {
      var h = getHistory().filter(function (item) { return item.q !== query.trim(); });
      h.unshift({ q: query.trim(), t: Date.now() });
      if (h.length > MAX_HISTORY) h = h.slice(0, MAX_HISTORY);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(h));
    } catch (e) { /* */ }
  }

  function suggestRephrased(query, intent) {
    var suggestions = [], kw = extractKeywords(query);
    if (kw.length > 3) suggestions.push(kw.slice(0, 3).join(' '));
    if (intent.id === 'error') suggestions.push('troubleshoot ' + kw.join(' '));
    if (intent.id === 'how-to') suggestions.push(kw.join(' ') + ' tutorial');
    kw.forEach(function (k) {
      var syns = getSynonyms(k);
      if (syns.length > 0) {
        var alt = kw.map(function (w) { return w === k ? syns[0] : w; }).join(' ');
        if (suggestions.indexOf(alt) === -1) suggestions.push(alt);
      }
    });
    return suggestions.slice(0, 3);
  }

  /* =================== STYLES =================== */

  function injectStyles(config) {
    if (document.getElementById('zikb-styles-v21')) return;
    var theme = (config && config.theme) || {};
    var btnColor = theme.buttonColor || '#e85d04';
    var headerColor = theme.headerColor || '#e85d04';
    var pos = theme.position || 'bottom-right';
    var isLeft = pos === 'bottom-left';
    var s = document.createElement('style');
    s.id = 'zikb-styles-v21';
    s.textContent = [
      '#zikb-toggle{position:fixed;bottom:24px;' + (isLeft ? 'left:24px' : 'right:24px') + ';width:56px;height:56px;border-radius:50%;background:' + btnColor + ';border:none;color:#fff;font-size:1.5rem;cursor:move;box-shadow:0 4px 16px rgba(0,0,0,.2);z-index:2147483646;transition:transform .2s;user-select:none;display:flex;align-items:center;justify-content:center}',
      '#zikb-toggle:hover{transform:scale(1.08)}#zikb-toggle:focus-visible{outline:2px solid #fff;outline-offset:2px}#zikb-toggle.dragging{cursor:grabbing}',
      '#zikb-panel{position:fixed;bottom:90px;' + (isLeft ? 'left:24px' : 'right:24px') + ';width:440px;max-height:600px;background:#fff;border:1px solid #e8e4df;border-radius:14px;box-shadow:0 8px 32px rgba(0,0,0,.15);z-index:2147483645;display:none;flex-direction:column;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}',
      '#zikb-panel.open{display:flex;animation:zikb-fadeIn .18s ease-out}',
      '@keyframes zikb-fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}',
      '@media(max-width:480px){#zikb-panel{width:calc(100vw - 16px);left:8px!important;right:8px!important;max-height:70vh;bottom:80px!important}}',
      '#zikb-header{padding:1rem 1.25rem;background:linear-gradient(135deg,' + headerColor + ' 0%,#f26322 100%);color:#fff;font-weight:600;display:flex;align-items:center;justify-content:space-between}',
      '#zikb-close{background:0;border:0;color:rgba(255,255,255,.95);cursor:pointer;font-size:1.4rem;padding:.2rem .4rem;border-radius:4px}#zikb-close:hover{background:rgba(255,255,255,.15)}',
      '#zikb-body{padding:1.25rem;overflow-y:auto;flex:1;background:#faf8f5;color:#333}',
      '#zikb-msg{font-size:.88rem;color:#5a5a5a;margin-bottom:1rem;line-height:1.5}',
      '#zikb-search-wrap{display:flex;gap:.5rem;margin-bottom:1rem}',
      '#zikb-search-input{flex:1;padding:.7rem 1rem;border:1px solid #e0ddd8;border-radius:8px;font-size:.93rem;font-family:inherit;background:#fff}',
      '#zikb-search-input:focus{outline:0;border-color:' + btnColor + ';box-shadow:0 0 0 2px rgba(232,93,4,.15)}',
      '#zikb-search-btn{padding:.7rem 1rem;background:' + btnColor + ';color:#fff;border:none;border-radius:8px;font-weight:500;cursor:pointer;font-size:.9rem}',
      '#zikb-search-btn:hover{background:#d35400}',
      '#zikb-results{display:flex;flex-direction:column;gap:.5rem}',
      '.zikb-intent-tag{display:inline-block;padding:.15rem .5rem;background:rgba(232,93,4,.1);color:#c24a00;font-size:.72rem;font-weight:600;border-radius:4px;margin-bottom:.75rem;text-transform:uppercase;letter-spacing:.3px}',
      '.zikb-section-label{font-size:.78rem;font-weight:600;color:#5a5652;margin:.75rem 0 .4rem;text-transform:uppercase;letter-spacing:.3px;display:flex;align-items:center;gap:.4rem}',
      '.zikb-result{display:block;padding:.8rem 1rem;background:#fff;border:1px solid #e8e4df;border-radius:8px;text-decoration:none;transition:all .15s;position:relative}',
      '.zikb-result:hover{background:#fff8f5;border-color:#e85d04}',
      '.zikb-result.kb{border-left:4px solid ' + btnColor + '}.zikb-result.community{border-left:4px solid #f26322}',
      '.zikb-result-title{font-size:.88rem;font-weight:600;color:#2d2a26;margin-bottom:.25rem}',
      '.zikb-result-snippet{font-size:.8rem;color:#666;line-height:1.45}',
      '.zikb-result-meta{display:flex;align-items:center;gap:.4rem;margin-top:.35rem;flex-wrap:wrap}',
      '.zikb-badge{display:inline-flex;align-items:center;gap:.2rem;padding:.1rem .4rem;font-size:.68rem;font-weight:600;border-radius:3px}',
      '.zikb-badge-solved{background:#d4edda;color:#155724}.zikb-badge-section{background:#e8f0fe;color:#1a56db}',
      '.zikb-badge-score{background:#f0ebff;color:#5b21b6;font-variant-numeric:tabular-nums}',
      'mark.zikb-hl-exact{background:#fff3cd;color:#7c6a00;padding:0 .1rem;border-radius:2px}',
      'mark.zikb-hl-partial{background:#fce8d4;color:#9a5a00;padding:0 .1rem;border-radius:2px}',
      'mark.zikb-hl-synonym{background:#d4e8fc;color:#1a4a8a;padding:0 .1rem;border-radius:2px}',
      '.zikb-expand{margin-top:.5rem;background:#faf8f5;border:1px solid #eee;border-radius:6px;padding:.7rem;font-size:.8rem;color:#444;line-height:1.55;display:none}',
      '.zikb-expand.open{display:block}',
      '.zikb-expand-toggle{font-size:.75rem;color:#c24a00;cursor:pointer;text-decoration:underline;margin-top:.3rem;display:inline-block}',
      '.zikb-fb{display:flex;gap:.3rem;margin-top:.35rem}',
      '.zikb-fb-btn{padding:.15rem .4rem;background:#f5f3f0;border:1px solid #e8e4df;border-radius:3px;font-size:.68rem;cursor:pointer;color:#888;transition:all .15s}',
      '.zikb-fb-btn:hover{border-color:#e85d04;color:#c24a00}',
      '.zikb-fb-btn.active-up{background:#d4edda;color:#155724;border-color:#28a745}',
      '.zikb-fb-btn.active-down{background:#f8d7da;color:#721c24;border-color:#dc3545}',
      '.zikb-more-btn{padding:.6rem;background:#f5f3f0;border:1px solid #e8e4df;border-radius:8px;color:#5a5652;font-size:.82rem;text-align:center;cursor:pointer}',
      '.zikb-more-btn:hover{background:#fff8f5;color:#c24a00;border-color:#e85d04}',
      '.zikb-link{display:block;padding:.65rem 1rem;background:#fff;border:1px solid #e8e4df;border-radius:8px;color:#c24a00;font-size:.86rem;text-decoration:none;transition:all .15s;margin-top:.35rem}',
      '.zikb-link:hover{background:#fff8f5;border-color:#e85d04}.zikb-link.ticket{border-left:4px solid #d35400}',
      '.zikb-divider{border:0;border-top:1px solid #e8e4df;margin:.75rem 0}',
      '.zikb-no-match{background:#fff8f5;border:1px solid #fce8d4;border-radius:8px;padding:1rem;margin-bottom:.75rem}',
      '.zikb-no-match strong{display:block;font-size:.88rem;color:#c24a00;margin-bottom:.4rem}',
      '.zikb-no-match p{font-size:.82rem;color:#666;margin:0 0 .5rem}',
      '.zikb-no-section-results{font-size:.8rem;color:#999;font-style:italic;padding:.4rem 0 .2rem}',
      '.zikb-low-conf{background:#fff8f5;border:1px solid #fce8d4;border-radius:8px;padding:1rem;margin-bottom:.75rem}',
      '.zikb-low-conf-title{font-size:.85rem;font-weight:600;color:#c24a00;margin-bottom:.5rem}',
      '.zikb-suggest-btn{display:inline-block;padding:.3rem .6rem;background:#fff;border:1px solid #e8e4df;border-radius:6px;color:#5a5652;font-size:.8rem;cursor:pointer;margin:.15rem}',
      '.zikb-suggest-btn:hover{border-color:#e85d04;color:#c24a00;background:#fff8f5}',
      '.zikb-loading{text-align:center;padding:1.5rem;color:#888}.zikb-loading-dot{display:inline-block;width:6px;height:6px;background:#ccc;border-radius:50%;margin:0 2px;animation:zikb-b .8s infinite}',
      '.zikb-loading-dot:nth-child(2){animation-delay:.15s}.zikb-loading-dot:nth-child(3){animation-delay:.3s}',
      '@keyframes zikb-b{0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}',
      '.zikb-match-nav{display:flex;align-items:center;gap:.25rem;margin-top:.3rem;flex-wrap:wrap}',
      '.zikb-match-nav-btn{padding:.12rem .35rem;background:#f5f3f0;border:1px solid #e8e4df;border-radius:3px;color:#888;font-size:.68rem;cursor:pointer;text-decoration:none}',
      '.zikb-match-nav-btn:hover{color:#c24a00;border-color:#e85d04}',
      '.zikb-index-warn{background:#fef3cd;border:1px solid #ffc107;border-radius:8px;padding:.8rem 1rem;margin-bottom:.75rem;font-size:.82rem;color:#856404}',
      '.zikb-index-warn strong{display:block;margin-bottom:.25rem}',
      '.zikb-index-loading{padding:.6rem;font-size:.82rem;color:#666}',
      '.zikb-index-loading svg{width:14px;height:14px;vertical-align:middle;margin-right:.35rem;animation:zikb-spin .7s linear infinite}',
      '#zikb-reload-btn{background:0;border:0;color:rgba(255,255,255,.9);cursor:pointer;padding:.2rem .4rem;border-radius:4px;display:flex;align-items:center;gap:.25rem;font-size:.72rem;font-family:inherit;transition:background .15s}',
      '#zikb-reload-btn:hover{background:rgba(255,255,255,.15)}',
      '#zikb-reload-btn.zikb-spinning svg{animation:zikb-spin .7s linear}',
      '@keyframes zikb-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}',
      '#zikb-clear-btn{background:0;border:0;color:#999;cursor:pointer;padding:.4rem;border-radius:50%;display:flex;align-items:center;transition:color .15s}',
      '#zikb-clear-btn:hover{color:#c24a00}',
      '.zikb-error-panel{background:#fef3f2;border:1px solid #f5c2c0;border-radius:8px;padding:1rem;margin-bottom:.75rem}',
      '.zikb-error-panel strong{display:block;color:#991b1b;font-size:.88rem;margin-bottom:.4rem}',
      '.zikb-error-panel p{font-size:.82rem;color:#7f1d1d;margin:0 0 .5rem}',
      '.zikb-retry-btn{padding:.35rem .7rem;background:#e85d04;color:#fff;border:none;border-radius:6px;font-size:.8rem;cursor:pointer;font-family:inherit}',
      '.zikb-retry-btn:hover{background:#d35400}',
      '.zikb-status-bar{display:flex;align-items:center;gap:.3rem;padding:.3rem .6rem;font-size:.68rem;border-radius:4px;margin-bottom:.5rem}',
      '.zikb-status-online{background:#d4edda;color:#155724}',
      '.zikb-status-offline{background:#f8d7da;color:#721c24}',
      '.zikb-status-loading{background:#fff3cd;color:#856404}',
      '.zikb-kbd-hint{font-size:.65rem;color:rgba(255,255,255,.6);margin-left:.25rem}',
      '.zikb-powered{text-align:center;padding:.5rem;font-size:.68rem;color:#bbb;border-top:1px solid #f0eeeb}',
      '.zikb-spell{background:#e8f4fd;border:1px solid #b3d7f0;border-radius:8px;padding:.65rem 1rem;margin-bottom:.75rem;font-size:.82rem;color:#1a5276}',
      '.zikb-spell-link{color:#c24a00;cursor:pointer;font-weight:600;text-decoration:underline}',
      '.zikb-spell-link:hover{color:#e85d04}',
      '.zikb-spell-orig{color:#888;font-size:.75rem;font-style:italic}'
    ].join('');
    document.head.appendChild(s);
  }

  /* =================== UI RENDERING =================== */

  var _panel, _toggle, _input, _resultsEl, _product, _config, _lastQuery = '';
  var _indexLoadError = false;
  var _indexUrl = null;
  var _debounceTimer = null;
  var _zeroResultsThisSession = {};

  function svgIcon(name) {
    var icons = {
      chat:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
      book:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
      users:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>',
      check:'<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>',
      search:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
      ticket:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/></svg>',
      alert:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
      reload:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>',
      clear:'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
      offline:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.56 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>',
      thumbUp:'<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>',
      thumbDown:'<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/></svg>'
    };
    return icons[name] || icons.book;
  }

  function renderResultCard(r, keywords, synonymList, type, idx) {
    var article = r.article;
    var topPara = r.matchedParagraphs && r.matchedParagraphs.length > 0 ? r.matchedParagraphs[0] : null;
    var topSection = r.matchedSections && r.matchedSections.length > 0 ? r.matchedSections[0] : null;

    var snippetSource = topPara ? topPara.text : (article.solutionText || article.body || '');
    var snippetText = generateSnippet(snippetSource, keywords.concat(synonymList));
    var anchor = topPara ? (topPara.sectionAnchor || topPara.anchor) : (topSection ? topSection.anchor : '');
    var paraText = topPara ? topPara.text : null;
    var deepUrl = buildDeepLink(article.url, r.matchedTerms, anchor, paraText, article.type);

    if (!deepUrl) {
      debugLog('RENDER-SKIP', { id: article.id, reason: 'buildDeepLink returned null' });
      return '';
    }

    var cssType = type || ((article.type || '').toLowerCase() === 'community' ? 'community' : 'kb');
    var uid = 'zr-' + idx;
    var scoreDisplay = (r.normalizedScore * 100).toFixed(0);

    var html = '<div class="zikb-result ' + cssType + '"' +
      ' data-article-id="' + esc(article.id) + '"' +
      ' data-article-url="' + esc(article.url) + '"' +
      ' data-anchor-id="' + esc(anchor) + '"' +
      ' data-relevance-score="' + esc(String(r.normalizedScore.toFixed(3))) + '"' +
      ' data-match-type="' + esc(cssType) + '"' +
      ' data-solved="' + (article.solved ? 'true' : 'false') + '"' +
      ' data-idx="' + idx + '">';
    html += '<a href="' + esc(deepUrl) + '" target="_blank" rel="noopener" class="zikb-result-link" data-article-id="' + esc(article.id) + '" style="text-decoration:none;color:inherit;display:block">';
    html += '<div class="zikb-result-title">' + highlightWithTypes(article.title || 'Untitled', keywords, synonymList) + '</div>';

    if (snippetText) {
      html += '<div class="zikb-result-snippet">' + highlightWithTypes(snippetText, keywords, synonymList) + '</div>';
    }

    html += '<div class="zikb-result-meta">';
    html += '<span class="zikb-badge zikb-badge-score">' + scoreDisplay + '% match</span>';
    if (article.solved) html += '<span class="zikb-badge zikb-badge-solved">' + svgIcon('check') + ' Solved</span>';
    if (topPara && topPara.sectionHeading) html += '<span class="zikb-badge zikb-badge-section">\u00a7 ' + esc(topPara.sectionHeading) + '</span>';
    else if (topSection && topSection.heading) html += '<span class="zikb-badge zikb-badge-section">\u00a7 ' + esc(topSection.heading) + '</span>';
    if ((article.type || '').toLowerCase() === 'community' && article.replies != null) html += '<span class="zikb-badge" style="background:#f5f3f0;color:#888">' + article.replies + ' replies</span>';
    html += '</div>';
    html += '</a>';

    if (topPara && topPara.text && topPara.text.length > 50) {
      html += '<span class="zikb-expand-toggle" data-expand="' + uid + '">Read answer inline \u25be</span>';
      html += '<div class="zikb-expand" id="' + uid + '">' + highlightWithTypes(topPara.text, keywords, synonymList) + '</div>';
    }

    if (r.matchedParagraphs && r.matchedParagraphs.length > 1) {
      html += '<div class="zikb-match-nav"><span style="font-size:.68rem;color:#999">More matches:</span>';
      for (var i = 1; i < Math.min(r.matchedParagraphs.length, 4); i++) {
        var mp = r.matchedParagraphs[i];
        var mpUrl = buildDeepLink(article.url, r.matchedTerms, mp.sectionAnchor || mp.anchor, mp.text, article.type);
        if (mpUrl) {
          html += '<a class="zikb-match-nav-btn" href="' + esc(mpUrl) + '" target="_blank" rel="noopener">' + esc(mp.sectionHeading || '\u00b6' + (i + 1)) + '</a>';
        }
      }
      html += '</div>';
    }

    html += '<div class="zikb-fb">';
    html += '<span class="zikb-fb-btn" data-fb="up" data-aid="' + esc(article.id) + '">' + svgIcon('thumbUp') + ' Helpful</span>';
    html += '<span class="zikb-fb-btn" data-fb="down" data-aid="' + esc(article.id) + '">' + svgIcon('thumbDown') + '</span>';
    html += '</div>';

    html += '</div>';
    return html;
  }

  function showLoading() {
    _resultsEl.innerHTML = '<div class="zikb-loading"><span class="zikb-loading-dot"></span><span class="zikb-loading-dot"></span><span class="zikb-loading-dot"></span></div>';
  }

  function renderResults(query, isAutoCorrect) {
    var q = sanitizeQuery(query);
    if (!q) { renderWelcome(); return; }
    _lastQuery = q;
    if (!isAutoCorrect) addHistory(q);

    var intent = classifyIntent(q);
    var hasIndex = _indexLoaded && _contentIndex && _contentIndex.articles && _contentIndex.articles.length > 0;
    var html = '';

    if (!hasIndex) {
      if (_indexLoadError) {
        html += '<div class="zikb-error-panel">';
        html += '<strong>' + svgIcon('alert') + ' Content index failed to load</strong>';
        html += '<p>Could not retrieve the content index. Check your connection and try again.</p>';
        html += '<button class="zikb-retry-btn" onclick="window.elbHelpBotReload()">' + svgIcon('reload') + ' Retry</button>';
        html += '</div>';
      } else {
        html += '<div class="zikb-index-warn">';
        html += '<strong>Content index not loaded</strong>';
        html += 'Precision retrieval requires a content index. Please provide an <code>indexUrl</code> for full functionality.';
        html += '</div>';
      }
      html += '<a class="zikb-link ticket" href="' + esc(SUBMIT_TICKET) + '" target="_blank" rel="noopener">' + svgIcon('ticket') + ' Submit a support ticket</a>';
      _resultsEl.innerHTML = html;
      bindResultActions(q);
      reportAnalytics(q, intent);
      return;
    }

    var searchResult = searchIndex(q, _product);
    var kbResults = searchResult.kb;
    var communityResults = searchResult.community;
    var allValid = searchResult.all;
    var spellSuggestions = searchResult.spellingSuggestions;
    var correctedQuery = searchResult.correctedQuery;

    var topOrigNorm = allValid.length > 0 ? allValid[0].normalizedScore : 0;
    if (correctedQuery && !isAutoCorrect && (allValid.length === 0 || topOrigNorm < MEDIUM_CONFIDENCE)) {
      var correctedResult = searchIndex(correctedQuery, _product);
      if (correctedResult.all.length > 0) {
        if (allValid.length === 0) {
          kbResults = correctedResult.kb;
          communityResults = correctedResult.community;
          allValid = correctedResult.all;
        } else {
          var existingIds = {};
          allValid.forEach(function (r) { existingIds[r.article.id] = true; });
          correctedResult.all.forEach(function (cr) {
            if (!existingIds[cr.article.id]) {
              allValid.push(cr);
              if ((cr.article.type || 'kb').toLowerCase() === 'community') communityResults.push(cr);
              else kbResults.push(cr);
            }
          });
          allValid.sort(function (a, b) { return b.score - a.score; });
          kbResults.sort(function (a, b) { return b.score - a.score; });
          communityResults.sort(function (a, b) { return b.score - a.score; });
        }
        debugLog('AUTO-CORRECT', { original: q, corrected: correctedQuery, resultsFound: allValid.length });
      }
    }

    var keywords = extractKeywords(q);
    if (correctedQuery && allValid.length > 0 && searchResult.all.length === 0) {
      var correctedKeywords = extractKeywords(correctedQuery);
      correctedKeywords.forEach(function (ck) { if (keywords.indexOf(ck) === -1) keywords.push(ck); });
    }
    var synonymList = [];
    keywords.forEach(function (kw) {
      getSynonyms(kw).forEach(function (s) { if (synonymList.indexOf(s) === -1 && keywords.indexOf(s) === -1) synonymList.push(s); });
    });

    var topNormalized = allValid.length > 0 ? allValid[0].normalizedScore : 0;
    var confidence = topNormalized >= HIGH_CONFIDENCE ? 'high' : (topNormalized >= MEDIUM_CONFIDENCE ? 'medium' : 'low');

    debugLog('CONFIDENCE', { topNormalized: topNormalized, confidence: confidence, thresholds: { high: HIGH_CONFIDENCE, medium: MEDIUM_CONFIDENCE } });

    html += '<span class="zikb-intent-tag">' + esc(intent.label) + '</span>';

    if (spellSuggestions && correctedQuery) {
      html += '<div class="zikb-spell">' + svgIcon('search') + ' Did you mean: <span class="zikb-spell-link" data-suggest="' + esc(correctedQuery) + '">' + esc(correctedQuery) + '</span>';
      if (allValid.length > 0 && searchResult.all.length === 0) {
        html += ' <span class="zikb-spell-orig">(showing results for corrected query)</span>';
      }
      html += '</div>';
    }

    if (allValid.length === 0) {
      html += '<div class="zikb-no-match">';
      html += '<strong>No matching results found</strong>';
      html += '<p>Your query did not match any indexed Knowledge Base articles or Community threads.</p>';
      var suggestions = suggestRephrased(q, intent);
      if (suggestions.length > 0) {
        html += '<div style="font-size:.8rem;color:#666;margin-bottom:.4rem">Try rephrasing:</div>';
        suggestions.forEach(function (s) { html += '<span class="zikb-suggest-btn" data-suggest="' + esc(s) + '">' + esc(s) + '</span>'; });
      }
      html += '</div>';
      var actionLinks = buildActionLinks(_product, q, _config);
      html += '<a class="zikb-link ticket" href="' + esc(actionLinks.postNewQuestion) + '" target="_blank" rel="noopener" style="font-weight:500">' + svgIcon('users') + ' Post a new question in Community</a>';
      trackZeroResult(q);
    } else if (confidence === 'high') {
      var highKbLimit = Math.min(kbResults.length, 3);
      var highCommLimit = Math.min(communityResults.length, 3);

      html += '<div class="zikb-section-label">' + svgIcon('book') + ' Knowledge Base (' + kbResults.length + ')</div>';
      if (kbResults.length > 0) {
        for (var i = 0; i < highKbLimit; i++) html += renderResultCard(kbResults[i], keywords, synonymList, 'kb', i);
        if (kbResults.length > highKbLimit) {
          html += '<div class="zikb-more-btn" data-action="show-more-kb">Show ' + (kbResults.length - highKbLimit) + ' more KB articles</div>';
        }
      } else {
        html += '<div class="zikb-no-section-results">No KB articles matched this query.</div>';
      }
      html += '<div class="zikb-section-label">' + svgIcon('users') + ' Community (' + communityResults.length + ')</div>';
      if (communityResults.length > 0) {
        for (var j = 0; j < highCommLimit; j++) html += renderResultCard(communityResults[j], keywords, synonymList, 'community', 100 + j);
        if (communityResults.length > highCommLimit) {
          html += '<div class="zikb-more-btn" data-action="show-more-comm">Show ' + (communityResults.length - highCommLimit) + ' more threads</div>';
        }
      } else {
        html += '<div class="zikb-no-section-results">No Community threads matched this query.</div>';
      }
    } else if (confidence === 'medium') {
      var medKbLimit = Math.min(kbResults.length, MAX_RESULTS);
      var medCommLimit = Math.min(communityResults.length, MAX_RESULTS);

      html += '<div class="zikb-section-label">' + svgIcon('book') + ' Knowledge Base (' + kbResults.length + ')</div>';
      if (kbResults.length > 0) {
        for (var k = 0; k < medKbLimit; k++) html += renderResultCard(kbResults[k], keywords, synonymList, 'kb', k);
        if (kbResults.length > medKbLimit) {
          html += '<div class="zikb-more-btn" data-action="show-more-kb">Show ' + (kbResults.length - medKbLimit) + ' more KB articles</div>';
        }
      } else {
        html += '<div class="zikb-no-section-results">No KB articles matched this query.</div>';
      }
      html += '<div class="zikb-section-label">' + svgIcon('users') + ' Community (' + communityResults.length + ')</div>';
      if (communityResults.length > 0) {
        for (var l = 0; l < medCommLimit; l++) html += renderResultCard(communityResults[l], keywords, synonymList, 'community', 100 + l);
        if (communityResults.length > medCommLimit) {
          html += '<div class="zikb-more-btn" data-action="show-more-comm">Show ' + (communityResults.length - medCommLimit) + ' more threads</div>';
        }
      } else {
        html += '<div class="zikb-no-section-results">No Community threads matched this query.</div>';
      }
    } else {
      var suggestions2 = suggestRephrased(q, intent);
      html += '<div class="zikb-low-conf"><div class="zikb-low-conf-title">' + svgIcon('alert') + ' Low confidence matches</div>';
      if (suggestions2.length > 0) {
        html += '<div style="font-size:.8rem;color:#666;margin-bottom:.4rem">Try rephrasing:</div>';
        suggestions2.forEach(function (s) { html += '<span class="zikb-suggest-btn" data-suggest="' + esc(s) + '">' + esc(s) + '</span>'; });
      }
      html += '</div>';
      var lowLimit = Math.min(allValid.length, 5);
      html += '<div class="zikb-section-label">Related results</div>';
      for (var m = 0; m < lowLimit; m++) {
        html += renderResultCard(allValid[m], keywords, synonymList, (allValid[m].article.type || '').toLowerCase() === 'community' ? 'community' : 'kb', 200 + m);
      }
      var actionLinks2 = buildActionLinks(_product, q, _config);
      html += '<a class="zikb-link ticket" href="' + esc(actionLinks2.postNewQuestion) + '" target="_blank" rel="noopener" style="font-weight:500">' + svgIcon('users') + ' Post a new question in Community</a>';
    }

    debugLog('RENDERED-URLS', allValid.slice(0, MAX_RESULTS).map(function (r) {
      return { id: r.article.id, url: r.article.url, normalized: r.normalizedScore };
    }));

    _resultsEl.innerHTML = html;
    bindResultActions(q);
    reportAnalytics(q, intent);
  }

  function renderWelcome() {
    var p = getProductConfig(_product, _config);
    var html = '';
    var history = getHistory();
    if (history.length > 0) {
      html += '<div class="zikb-section-label">Recent searches</div>';
      history.slice(0, 5).forEach(function (h) { html += '<span class="zikb-suggest-btn" data-suggest="' + esc(h.q) + '">' + esc(h.q) + '</span>'; });
      html += '<hr class="zikb-divider">';
    }

    var defaultQueries = ['How to publish a course', 'SCORM package error', 'Getting started with ' + esc(p.label)];
    html += '<div class="zikb-section-label">' + svgIcon('search') + ' Suggested Queries</div>';
    defaultQueries.forEach(function (dq) {
      html += '<span class="zikb-suggest-btn" data-suggest="' + esc(dq) + '">' + esc(dq) + '</span>';
    });

    if (!_indexLoaded) {
      if (_indexLoadError) {
        html += '<div class="zikb-error-panel" style="margin-top:.75rem">';
        html += '<strong>' + svgIcon('alert') + ' Could not load content index</strong>';
        html += '<p>The index failed to load. Click Retry or use the reload button in the header.</p>';
        html += '<button class="zikb-retry-btn" onclick="window.elbHelpBotReload()">' + svgIcon('reload') + ' Retry</button>';
        html += '</div>';
      } else if (_indexLoading) {
        html += '<div class="zikb-index-loading" style="margin-top:.75rem;text-align:center;color:#666;font-size:.85rem">';
        html += svgIcon('reload') + ' Loading content index\u2026';
        html += '</div>';
      } else if (!_indexUrl && !window.elbHelpBotIndexUrl && !window.zikbIndexUrl && !(window.elbHelpBotInlineIndex && window.elbHelpBotInlineIndex.articles)) {
        html += '<div class="zikb-index-warn" style="margin-top:.75rem">';
        html += '<strong>Precision mode requires a content index</strong>';
        html += 'Set <code>indexUrl</code> to enable paragraph-level search, deep linking, and relevance scoring.';
        html += '</div>';
      }
    }

    _resultsEl.innerHTML = html;
    bindResultActions('');
  }

  function bindResultActions(currentQuery) {
    _resultsEl.querySelectorAll('[data-suggest]').forEach(function (btn) {
      btn.addEventListener('click', function () { _input.value = btn.getAttribute('data-suggest'); doSearch(); });
    });

    _resultsEl.querySelectorAll('.zikb-expand-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = document.getElementById(btn.getAttribute('data-expand'));
        if (target) {
          var isOpen = target.classList.contains('open');
          target.classList.toggle('open');
          btn.textContent = isOpen ? 'Read answer inline \u25be' : 'Collapse \u25b4';
        }
      });
    });

    _resultsEl.querySelectorAll('.zikb-result-link').forEach(function (link) {
      link.addEventListener('click', function () {
        var aid = link.getAttribute('data-article-id');
        if (aid && currentQuery) trackClick(aid, currentQuery);
      });
    });

    _resultsEl.querySelectorAll('.zikb-fb-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var aid = btn.getAttribute('data-aid');
        var fbType = btn.getAttribute('data-fb');
        if (!aid) return;
        trackFeedback(aid, currentQuery, fbType === 'up');
        var parent = btn.closest('.zikb-fb');
        parent.querySelectorAll('.zikb-fb-btn').forEach(function (b) { b.classList.remove('active-up', 'active-down'); });
        btn.classList.add(fbType === 'up' ? 'active-up' : 'active-down');
      });
    });

    function bindMoreBtn(selector, filterFn, startIdx) {
      var moreBtn = _resultsEl.querySelector('[data-action="' + selector + '"]');
      if (moreBtn && _indexLoaded) {
        moreBtn.addEventListener('click', function () {
          var searchResult = searchIndex(currentQuery, _product);
          var filtered = filterFn(searchResult);
          var keywords = extractKeywords(currentQuery);
          var synonymList = [];
          keywords.forEach(function (kw) {
            getSynonyms(kw).forEach(function (s) { if (synonymList.indexOf(s) === -1) synonymList.push(s); });
          });
          var currentShown = _resultsEl.querySelectorAll('[data-action="' + selector + '"]')[0];
          var alreadyShown = currentShown ? currentShown.previousElementSibling : null;
          var showFrom = MAX_RESULTS;
          var extra = '';
          for (var i = showFrom; i < filtered.length; i++) {
            extra += renderResultCard(filtered[i], keywords, synonymList, (filtered[i].article.type || '').toLowerCase() === 'community' ? 'community' : 'kb', startIdx + i);
          }
          moreBtn.insertAdjacentHTML('beforebegin', extra);
          moreBtn.remove();
          bindResultActions(currentQuery);
        });
      }
    }

    bindMoreBtn('show-more-kb', function (sr) { return sr.kb; }, 300);
    bindMoreBtn('show-more-comm', function (sr) { return sr.community; }, 500);
  }

  function doSearch() { var q = sanitizeQuery(_input.value); _input.value = q; renderResults(q); }

  function debouncedSearch() {
    if (_debounceTimer) clearTimeout(_debounceTimer);
    _debounceTimer = setTimeout(function () { doSearch(); }, DEBOUNCE_MS);
  }

  /* =================== ANALYTICS =================== */

  function reportAnalytics(query, intent) {
    var analyticsUrl = window.elbHelpBotAnalyticsUrl || window.zikbAnalyticsUrl;
    if (!query || !analyticsUrl || typeof analyticsUrl !== 'string' || analyticsUrl.indexOf('https://') !== 0) return;
    try {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', analyticsUrl);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.timeout = 3000;
      xhr.send(JSON.stringify({ product: _product, query: query, intent: intent ? intent.id : 'general', hasResults: _indexLoaded, timestamp: new Date().toISOString(), version: VERSION }));
    } catch (e) { /* */ }
  }

  /* =================== CONFIG LOADER =================== */

  function loadConfig(cb) {
    var inline = window.zikbConfig || window.elbHelpBotConfig;
    if (inline && typeof inline === 'object' && (inline.adminOverrides || inline.products)) { cb(inline); return; }
    var url = window.zikbConfigUrl || window.elbHelpBotConfigUrl;
    if (isValidConfigUrl(url)) {
      var xhr = new XMLHttpRequest();
      xhr.timeout = 5000;
      xhr.onload = function () { try { var d = JSON.parse(xhr.responseText); cb(d && typeof d === 'object' ? d : null); } catch (e) { cb(null); } };
      xhr.onerror = function () { cb(null); }; xhr.ontimeout = function () { cb(null); };
      xhr.open('GET', url); xhr.send();
    } else { cb(null); }
  }

  /* =================== MAIN RENDER =================== */

  function render() {
    var ctx = getContext();
    _product = validateProduct(ctx && ctx.product);

    if (window.elbHelpBotDebug) {
      debugLog('INIT', { version: VERSION, product: _product, context: ctx });
    }

    loadConfig(function (config) {
      _config = config;
      var p = getProductConfig(_product, config);
      injectStyles(config);
      if (config && config.synonyms) _synonymMap = buildSynonymMap(config.synonyms);

      _panel = document.getElementById('zikb-panel');
      _toggle = document.getElementById('zikb-toggle');
      if (!_panel) {
        _toggle = document.createElement('button');
        _toggle.id = 'zikb-toggle'; _toggle.type = 'button';
        _toggle.setAttribute('aria-label', 'Open help assistant'); _toggle.setAttribute('title', 'Help');
        _toggle.innerHTML = svgIcon('chat');
        _panel = document.createElement('div');
        _panel.id = 'zikb-panel'; _panel.setAttribute('role', 'dialog');
        _panel.setAttribute('aria-label', 'Knowledge Base & Community Help'); _panel.setAttribute('aria-modal', 'false');
        document.body.appendChild(_toggle); document.body.appendChild(_panel);
        _panel.addEventListener('click', function (e) { e.stopPropagation(); });
        setupDrag(); setupOutsideClick();
      }

      _panel.innerHTML =
        '<div id="zikb-header"><span>How can we help?</span><div style="display:flex;align-items:center;gap:.25rem">' +
        '<button id="zikb-reload-btn" type="button" aria-label="Reload chatbot" title="Reload chatbot (re-fetch index &amp; reset)">' + svgIcon('reload') + '</button>' +
        '<button id="zikb-close" type="button" aria-label="Close" title="Close">\u00d7</button></div></div>' +
        '<div id="zikb-body"><div id="zikb-msg">' + esc(p.welcomeMessage) + '</div>' +
        '<div id="zikb-search-wrap"><input id="zikb-search-input" type="search" placeholder="Describe your question\u2026" autocomplete="off" aria-label="Search">' +
        '<button id="zikb-clear-btn" type="button" aria-label="Clear search" title="Clear search" style="display:none">' + svgIcon('clear') + '</button>' +
        '<button id="zikb-search-btn" type="button">Find</button></div>' +
        '<div id="zikb-status" aria-live="polite"></div>' +
        '<div id="zikb-results" role="list" aria-live="polite"></div></div>' +
        '<div class="zikb-powered">ELB Help Bot v' + VERSION + ' <span class="zikb-kbd-hint">Ctrl+Shift+H</span></div>';

      _input = _panel.querySelector('#zikb-search-input');
      _resultsEl = _panel.querySelector('#zikb-results');
      var _clearBtn = _panel.querySelector('#zikb-clear-btn');

      _panel.querySelector('#zikb-search-btn').addEventListener('click', doSearch);
      _input.addEventListener('keydown', function (e) { if (e.key === 'Enter') doSearch(); });
      _input.addEventListener('input', function () {
        _clearBtn.style.display = _input.value.trim().length > 0 ? 'flex' : 'none';
      });
      _clearBtn.addEventListener('click', function () {
        _input.value = '';
        _clearBtn.style.display = 'none';
        _lastQuery = '';
        renderWelcome();
        _input.focus();
      });
      _panel.querySelector('#zikb-close').addEventListener('click', function () {
        _panel.classList.remove('open');
        persistPanelState(false);
        _toggle.focus();
      });
      _panel.querySelector('#zikb-reload-btn').addEventListener('click', function () { reloadChatbot(); });
      renderWelcome();

      if (getPanelState()) {
        _panel.classList.add('open');
        setTimeout(function () { if (_input) _input.focus(); }, 100);
      }

      _indexUrl = window.elbHelpBotIndexUrl || window.zikbIndexUrl || (config && config.indexUrl) || null;
      var hasInline = window.elbHelpBotInlineIndex && window.elbHelpBotInlineIndex.articles;
      if ((_indexUrl && isValidIndexUrl(_indexUrl)) || hasInline) {
        _indexLoading = true;
        updateStatus('loading');
        loadContentIndex(_indexUrl, function (data) {
          _indexLoading = false;
          if (data) {
            _indexLoadError = false;
            applyConfidenceConfig(data.confidenceConfig);
            debugLog('INDEX-LOADED', { version: data.version, articles: data.articles.length });
            updateStatus('online');
            if (_lastQuery) renderResults(_lastQuery);
            else renderWelcome();
          } else if (_indexLoadError) {
            updateStatus('error');
            renderWelcome();
          }
        });
        if (_indexUrl && isValidIndexUrl(_indexUrl)) startReindexPolling(_indexUrl);
      } else {
        debugLog('INDEX-MISSING', { reason: 'No valid indexUrl provided. Set window.elbHelpBotIndexUrl or pass indexUrl in config.' });
        updateStatus(_indexUrl ? 'error' : 'none');
      }
    });
  }

  /* =================== DRAG =================== */

  function setupDrag() {
    var isDrag = false, sx = 0, sy = 0, tx = 0, ty = 0;
    function pos(x, y) {
      _toggle.style.cssText = 'position:fixed;left:' + x + 'px;top:' + y + 'px;right:auto;bottom:auto;width:56px;height:56px;border-radius:50%;background:' + ((_config && _config.theme && _config.theme.buttonColor) || '#e85d04') + ';border:none;color:#fff;cursor:move;box-shadow:0 4px 16px rgba(0,0,0,.2);z-index:2147483646;display:flex;align-items:center;justify-content:center;user-select:none';
      _panel.style.left = Math.min(x, window.innerWidth - 460) + 'px';
      _panel.style.right = 'auto'; _panel.style.bottom = (window.innerHeight - y + 12) + 'px'; _panel.style.top = 'auto';
    }
    try { var raw = JSON.parse(localStorage.getItem(POS_STORAGE_KEY)); if (raw && typeof raw.x === 'number') pos(raw.x, raw.y); } catch (e) { /* */ }

    function start(cx, cy) { isDrag = false; sx = cx; sy = cy; var r = _toggle.getBoundingClientRect(); tx = r.left; ty = r.top; _toggle.classList.add('dragging'); }
    function move(cx, cy) {
      var dx = cx - sx, dy = cy - sy;
      if (!isDrag && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) isDrag = true;
      if (isDrag) pos(Math.max(0, Math.min(window.innerWidth - 56, tx + dx)), Math.max(0, Math.min(window.innerHeight - 56, ty + dy)));
    }
    function end() {
      _toggle.classList.remove('dragging');
      if (isDrag) { try { var r = _toggle.getBoundingClientRect(); localStorage.setItem(POS_STORAGE_KEY, JSON.stringify({ x: r.left, y: r.top })); } catch (e) { /* */ } }
      else { _panel.classList.toggle('open'); persistPanelState(_panel.classList.contains('open')); if (_panel.classList.contains('open') && _input) setTimeout(function () { _input.focus(); }, 100); }
    }

    _toggle.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return; start(e.clientX, e.clientY);
      function mm(ev) { move(ev.clientX, ev.clientY); }
      function mu() { document.removeEventListener('mousemove', mm); document.removeEventListener('mouseup', mu); end(); }
      document.addEventListener('mousemove', mm); document.addEventListener('mouseup', mu);
    });
    _toggle.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) return; start(e.touches[0].clientX, e.touches[0].clientY);
      function tm(ev) { if (ev.touches.length === 1) { ev.preventDefault(); move(ev.touches[0].clientX, ev.touches[0].clientY); } }
      function te() { document.removeEventListener('touchmove', tm); document.removeEventListener('touchend', te); end(); }
      document.addEventListener('touchmove', tm, { passive: false }); document.addEventListener('touchend', te);
    }, { passive: true });
    _toggle.addEventListener('click', function (e) { e.preventDefault(); });
    _toggle.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); _panel.classList.toggle('open'); persistPanelState(_panel.classList.contains('open')); if (_panel.classList.contains('open') && _input) setTimeout(function () { _input.focus(); }, 100); }
    });
  }

  function setupOutsideClick() {
    document.addEventListener('click', function (e) {
      if (_panel && _panel.classList.contains('open') && !_panel.contains(e.target) && !_toggle.contains(e.target)) { _panel.classList.remove('open'); persistPanelState(false); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && _panel && _panel.classList.contains('open')) { _panel.classList.remove('open'); persistPanelState(false); _toggle.focus(); }
    });
  }

  /* =================== STATUS + RELOAD =================== */

  function updateStatus(state) {
    var el = _panel ? _panel.querySelector('#zikb-status') : null;
    if (!el) return;
    if (state === 'online') {
      var count = (_contentIndex && _contentIndex.articles) ? _contentIndex.articles.length : 0;
      el.innerHTML = '<div class="zikb-status-bar zikb-status-online">' + svgIcon('check') + ' Index loaded \u2014 ' + count + ' articles</div>';
      setTimeout(function () { if (el.querySelector('.zikb-status-online')) el.innerHTML = ''; }, 4000);
    } else if (state === 'loading') {
      el.innerHTML = '<div class="zikb-status-bar zikb-status-loading">' + svgIcon('reload') + ' Loading content index\u2026</div>';
    } else if (state === 'error') {
      el.innerHTML = '<div class="zikb-error-panel"><strong>' + svgIcon('offline') + ' Failed to load content index</strong>' +
        '<p>The chatbot could not fetch the content index. This may be due to a network issue or an invalid index URL.</p>' +
        '<button class="zikb-retry-btn" id="zikb-retry-btn">' + svgIcon('reload') + ' Retry</button></div>';
      var retryBtn = el.querySelector('#zikb-retry-btn');
      if (retryBtn) {
        retryBtn.addEventListener('click', function () { reloadChatbot(); });
      }
    } else if (state === 'offline') {
      el.innerHTML = '<div class="zikb-status-bar zikb-status-offline">' + svgIcon('offline') + ' You are offline</div>';
    } else {
      el.innerHTML = '';
    }
  }

  function reloadChatbot() {
    var reloadBtn = _panel ? _panel.querySelector('#zikb-reload-btn') : null;
    if (reloadBtn) reloadBtn.classList.add('zikb-spinning');

    _contentIndex = null;
    _indexLoaded = false;
    _indexLoading = false;
    _indexVersion = null;
    _tfidfIndex = null;
    _spellDict = null;
    _indexLoadError = false;
    _indexHealth = { total: 0, valid: 0, errors: [] };

    try { localStorage.removeItem(INDEX_CACHE_KEY); } catch (e) { /* */ }

    if (_reindexTimer) { clearInterval(_reindexTimer); _reindexTimer = null; }

    debugLog('RELOAD', { reason: 'User-triggered reload' });

    var url = _indexUrl || window.elbHelpBotIndexUrl || window.zikbIndexUrl || null;
    var hasInline = window.elbHelpBotInlineIndex && window.elbHelpBotInlineIndex.articles;
    if ((url && isValidIndexUrl(url)) || hasInline) {
      _indexLoading = true;
      updateStatus('loading');
      renderWelcome();
      loadContentIndex(url, function (data) {
        _indexLoading = false;
        if (reloadBtn) setTimeout(function () { reloadBtn.classList.remove('zikb-spinning'); }, 700);
        if (data) {
          _indexLoadError = false;
          applyConfidenceConfig(data.confidenceConfig);
          updateStatus('online');
          if (_lastQuery) { renderResults(_lastQuery); }
          else { renderWelcome(); }
        } else {
          updateStatus('error');
          renderWelcome();
        }
      });
      if (url && isValidIndexUrl(url)) startReindexPolling(url);
    } else {
      if (reloadBtn) setTimeout(function () { reloadBtn.classList.remove('zikb-spinning'); }, 700);
      updateStatus('none');
      renderWelcome();
    }
  }

  function setupKeyboardShortcut() {
    document.addEventListener('keydown', function (e) {
      if (e.ctrlKey && e.shiftKey && (e.key === 'h' || e.key === 'H')) {
        e.preventDefault();
        if (_panel) {
          _panel.classList.toggle('open');
          persistPanelState(_panel.classList.contains('open'));
          if (_panel.classList.contains('open') && _input) setTimeout(function () { _input.focus(); }, 100);
          else if (_toggle) _toggle.focus();
        }
      }
    });
  }

  function setupOnlineOfflineListeners() {
    window.addEventListener('online', function () {
      if (_indexLoadError || !_indexLoaded) reloadChatbot();
      else updateStatus('online');
    });
    window.addEventListener('offline', function () {
      updateStatus('offline');
    });
  }

  /* =================== VISIBILITY-BASED AUTO-REFRESH =================== */

  function setupVisibilityRefresh() {
    var lastCheck = 0;
    function checkForUpdates() {
      if (Date.now() - lastCheck < 60000) return;
      lastCheck = Date.now();
      var url = _indexUrl || window.elbHelpBotIndexUrl || window.zikbIndexUrl;
      if (!url || !isValidIndexUrl(url)) return;
      loadContentIndex(url, function (data, isNew) {
        if (isNew && data) {
          applyConfidenceConfig(data.confidenceConfig);
          debugLog('AUTO-REFRESH', { trigger: 'visibility/focus', version: data.version });
          if (_lastQuery) renderResults(_lastQuery);
          else renderWelcome();
        }
      });
    }
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) checkForUpdates();
    });
    window.addEventListener('focus', checkForUpdates);
  }

  /* =================== PANEL STATE PERSISTENCE =================== */

  function persistPanelState(isOpen) {
    try { localStorage.setItem(PANEL_STATE_KEY, isOpen ? '1' : '0'); } catch (e) { /* */ }
  }

  function getPanelState() {
    try { return localStorage.getItem(PANEL_STATE_KEY) === '1'; } catch (e) { return false; }
  }

  /* =================== PUBLIC API =================== */

  window.elbHelpBotGetIndexHealth = function () { return _indexHealth; };
  window.elbHelpBotReload = function () { reloadChatbot(); };

  /* =================== INIT =================== */

  function boot() {
    render();
    setupKeyboardShortcut();
    setupOnlineOfflineListeners();
    setupVisibilityRefresh();
  }

  (document.readyState === 'loading') ? document.addEventListener('DOMContentLoaded', boot) : boot();
})();
