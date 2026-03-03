/**
 * ELB Assistant â€” Precision Retrieval Engine v4.10.0
 * In-product knowledge assistant: KB + Community + Product support.
 *
 * v4.10.0 - Unified Ranking, Community URL Validation & Broken Link Prevention:
 *   - Unified "All" tab: KB + Community results interleaved by strict descending match%
 *   - Community URL validator rejects category-slug paths that produce 404s
 *   - isValidCommunityUrl() blocks /topics/{category-name} from appearing in results
 *   - isStructurallyValidResult() checks community URLs before surfacing
 *   - compareSearchResults: removed 50% band, strict matchPercent ordering
 *   - Fixed 4 broken community article URLs
 *
 * v4.9.0 â€” URL Validation, Aggressive Threshold & 404 Elimination:
 *   - Fixed all 404 URLs (courseware-offeringsâ†’courseware-pricing, cenariovr-release-notes, etc.)
 *   - Stronger low-match suppression: never show <20% when â‰¥50% matches exist
 *   - Off-product results capped at 35% (was 40%); further suppressed to 15% when â‰¥2 on-product
 *   - applyRelevanceThreshold now returns only â‰¥50% when â‰¥2 high results exist (was 3)
 *   - Coverage penalty strengthened for partial keyword matches
 *
 * v4.8.0 â€” Strict Relevance Ranking & Threshold Enforcement:
 *   - compareSearchResults: â‰¥50% band always ranks above <50% band
 *   - Stronger coverage penalty: <30% â†’ cap 15%; <50% â†’ cap 25%/40%; <70% â†’ cap 49%
 *   - Strict product filtering: off-product results capped at 40% when <80%
 *   - applyRelevanceThreshold: â‰¥5 high â†’ exclude ALL low; 3-4 high â†’ high only
 *   - Low-result padding prefers product-aligned results first
 *   - compareSearchResults sort order: hardBoostTier > exactTitleMatch > matchPercent
 *   - applyRelevanceThreshold preserves exact-match ordering (no product re-sort override)
 *   - Added "Best Practices: Stock Asset Library Topics" to content index
 *
 * v4.6.1 â€” Relevance Threshold & Keyword-Coverage Precision:
 *   - applyRelevanceThreshold() â€” â‰¥50% match filter per source
 *     If â‰¥50% results exceed 5: return only â‰¥50% (no lower matches).
 *     If â‰¥50% results are fewer than 3: pad from lower matches up to 5 total.
 *   - Keyword-coverage penalty for multi-word queries
 *   - Product-aligned results prioritised within each relevance tier.
 *   - Threshold applied independently to KB and Community before merge.
 *
 * v4.6.0 â€” Full Product Coverage & Precision Search Fix:
 *   - Added 'asset-libraries' as dedicated product with proper search routing
 *   - Added 'off-the-shelf' product support
 *   - Stock Audio Library, FAQs, Account queries now route to Asset Libraries
 *   - Stronger product match boost (2.5x) and mismatch penalty (1.5x)
 *   - Quick Actions correctly detect and route to asset-libraries product
 *   - Comprehensive release notes added for all products
 *   - starredProduct logic simplified to trust queryDetected directly
 *   - Content index updated with 159 articles covering all products/categories
 *
 * v4.5.0 â€” Dynamic Product Context & Quick Actions Fix:
 *   - Quick Actions now dynamically detect product from search query + results
 *   - "Post a Question" links to correct product community form (no more 404s)
 *   - Result-based product inference when query has no explicit product name
 *   - "Additional Learning Products" as default for general/account queries
 *   - Content-based aliases: 360 video â†’ CenarioVR, gamification â†’ Training Arcade
 *   - Quick Guides header shows detected product name
 *   - Cache-buster version parameter in config loader
 *
 * v4.4.0 â€” Search Recall & Layout Fixes:
 *   - Keyword expansion: single-s-removal variant added alongside stem to fix
 *     plural queries (e.g. "arcades" now correctly produces "arcade" keyword,
 *     enabling synonym lookup and exact word matching)
 *   - Derivative match scoring improved from 0.35 to 0.55 multiplier to prevent
 *     valid partial matches from being scored too low
 *   - Non-exact-signal penalty relaxed from 0.52 to 0.72 to prevent aggressive
 *     suppression of derivative/synonym matches when exact hits exist
 *   - Loose fallback scoring ceiling raised for better recall recovery
 *   - Index: "arcade" synonym group added, Training Arcade articles tagged
 *   - Panel whitespace fix: height:fit-content on panel, accordion body
 *     max-height reduced from 3200px to 800px
 *   - All welcome sections confirmed collapsed by default on initial load
 *
 * v4.3.0 â€” Refined UI/UX Alignment & Layout Consistency:
 *   - Quick Actions & Quick Guides in search results now render in a true
 *     horizontal 2-column layout using CSS grid, structurally matching the
 *     presentation style of KB Articles & Community Posts sections
 *   - All section headers (Quick Actions, Quick Guides, KB, Community,
 *     Recent Searches) now share identical styling, padding, and count badge
 *   - Floating toggle icon enlarged to 76px with enhanced multi-stop gradient,
 *     3px white border, 34px SVG icon, improved green pulse animation
 *   - Panel fully separated from toggle: bottom:120px, 440px width, 20px radius
 *   - Welcome message area non-truncating: proper flex layout with min-height
 *   - Optimized vertical spacing: reduced gap between sections (8px),
 *     tighter accordion body margins, result cards with 10px gap
 *   - Horizontal spacing balanced: body padding 16px, section labels 12px 14px
 *   - View tabs: tighter gap (4px), pill-shaped with consistent active state
 *   - Search bar: 48px min-height, 14px font, icon scales on focus
 *   - Responsive: 480px breakpoint stacks resource grid to single column,
 *     toggle 64px, panel full-width with 16px radius
 *   - 768px breakpoint: toggle 68px, panel bottom:112px
 *
 * v4.2.0 â€” Enhanced UI/UX + Polished Visual Design:
 *   - Custom scrollbar styling on body, resource rows, and masonry layouts
 *   - Result cards: increased padding, 12px border-radius, 1.5px borders
 *   - Suggest buttons: hover lift effect, subtle shadow
 *   - All info panels (spell, error, warning, no-match, low-conf): 12px radius
 *   - Footer: subtle background tint (#fafaf8)
 *
 * v4.1.0 â€” Robust Acronym Recognition + Compact Balanced UI:
 *   - CRITICAL FIX: expandAcronyms() rewritten to use word-level splitting
 *     instead of regex with global flag. Each whitespace-delimited word is
 *     checked against _ACRONYM_MAP directly â€” no regex lastIndex issues,
 *     no silent misses. "getting started RLP" now reliably expands to
 *     "getting started rockstar learning platform".
 *   - CRITICAL FIX: Spell corrector (suggestCorrection) now skips known
 *     acronyms via isKnownAcronym() guard. Previously "rlp" could be
 *     incorrectly "corrected" to "elb" by Levenshtein distance. All
 *     _ACRONYM_MAP keys are now immune to spell correction interference.
 *   - getSpellingSuggestions() also skips acronyms in keyword list.
 *   - _ACRONYM_MAP expanded: added rslp, tlcs, cml, tta, lo, ld, vr.
 *   - _PRODUCT_ALIASES expanded: added cm, cml, lo, ld, cvr, ta, tta,
 *     mb, rl, rslp, rp, tlcs for comprehensive acronym-to-product mapping.
 *   - Welcome screen Quick Actions and Quick Guides now render in compact
 *     inline mode to reduce vertical footprint and keep KB/Community
 *     results visible without excessive scrolling.
 *   - Section balance improved: result view Quick Actions collapsed by
 *     default with compact pill toggles; KB and Community sections
 *     always expanded and prominently visible.
 *
 * v3.16.0 â€” Acronym-Aware Search + Balanced UI + Draggable Panel:
 *   - Panel is now fully draggable via the header bar (grab to move).
 *     Users can reposition the chatbot panel anywhere on screen.
 *     Position persists in localStorage across page visits.
 *   - Panel position resets gracefully on window resize to stay in viewport.
 *
 * v3.15.0 â€” Query-Isolated Product-Priority Search:
 *   - CRITICAL FIX: When a product name is explicitly mentioned in the query
 *     (e.g. "getting started coursemill"), results for that product are now
 *     strongly prioritized. Non-matching products receive a severe penalty
 *     (5x productMatch weight) so they cannot outrank matching articles
 *     even if they have broader keyword hits.
 *   - Query-detected product boost increased from 2x to 4x productMatch
 *     weight, ensuring product-specific articles dominate when intended.
 *   - RL boosts completely isolated per query: getRlBoost() only uses
 *     queryClicks for the EXACT current query string. Global click counts
 *     are fully ignored â€” previous searches cannot influence current results.
 *   - getLearnedSynonyms() fully disabled when queryDetectedProduct is set,
 *     preventing cross-product synonym contamination entirely.
 *   - Starred sections rendered with CSS sticky positioning so they remain
 *     visible at the top of the results area without requiring scroll.
 *   - Starred sections adapt to the query-detected product context.
 *   - Added CourseMill community articles for broader coverage.
 *
 * v3.13.0 â€” Redesigned Starred Sections:
 *   - Community "New Post" link updated to direct URL:
 *     https://community.elblearning.com/topics/create
 *   - Completely redesigned starred Quick Actions panel with modern card UI:
 *     gradient header accent, icon badges, hover lift effects, visual grouping
 *   - Redesigned product Quick Start Guides with pill badges, colored left
 *     borders, and highlighted "Featured" section label
 *   - Quick Actions and Guides now render as visually distinct card groups
 *     positioned alongside KB and Community references
 *   - Validation: postNewQuestion URL validated against allowlist, guide
 *     URLs validated, empty instruction arrays handled gracefully
 *   - Quick Actions and Quick Guides now render as independent IA sections
 *   - CSS: .zikb-qa-card, .zikb-qa-header, .zikb-qa-links, .zikb-guide-card,
 *     .zikb-guide-header, .zikb-guide-item with modern design tokens
 *
 * v3.12.0 â€” Starred Quick Actions & Refresh Fix:
 *   - Permanent starred "Post a New Question" community link visible on
 *     EVERY screen: welcome, high/medium/low confidence, and zero results
 *   - Reload/refresh button now clears the search input field
 *   - PRODUCT_INSTRUCTIONS map: per-product curated KB article links
 *
 * v3.11.0 â€” Instant Zero-Config Boot:
 *   - Built-in index applied SYNCHRONOUSLY at init, BEFORE first render
 *   - Eliminates ALL timing windows where "Precision mode requires" warning
 *     could appear â€” the chatbot is fully functional on first paint
 *   - No indexUrl, no elb-help-bot-index.json, no configuration of any kind needed
 *   - Just add <script src="elb-help-bot.js"></script> and everything works
 *   - Warning messages replaced with non-alarming "Initializing..." fallback
 *     (only visible if someone strips _BUILTIN_INDEX from the source)
 *   - External indexUrl still supported and overrides the built-in index
 *   - All v3.10 built-in index + v3.9 auto-discovery retained as fallbacks
 *
 * v3.10.0 â€” Built-in Content Index:
 *   - Content index (all KB + Community articles) embedded directly in the script
 *   - ZERO configuration needed: just add <script src="elb-help-bot.js"></script>
 *   - No external index files, no indexUrl, no extra setup steps
 *   - Built-in index used as automatic fallback when no external index is provided
 *   - External indexUrl still supported for custom/production indexes
 *   - All v3.9 auto-discovery still works as secondary fallback
 *
 * v3.0 â€” 12-Point Precision Enforcement:
 *   1. Precision retrieval engine â€” never navigation assistant
 *   2. Mandatory structured output fields per result
 *   3. Strict routing â€” URLs without content identifiers are discarded
 *   4. Correct search execution: normalize â†’ parallel retrieve â†’ rank
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
 *   - Fix: relative index URLs (../elb-help-bot-index.json) now load correctly
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
 * v3.3.0 enhancements â€” Spell Correction & Search Recall:
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
 * v3.4.0 enhancements â€” Expanded Index & Enhanced Recall:
 *   - Sample index expanded from 15 to 30 articles: all Lectora Actions &
 *     Variables sub-articles, Tests/Surveys/Questions articles, Web Windows,
 *     Web Objects, Custom HTML, and new community threads with solved answers
 *   - Auto-corrected search now also runs when results are LOW confidence
 *     (not only on zero results), merging corrected results with originals
 *   - Spell correction dictionary rebuilt on every index load/reload
 *   - Fuzzy match ratio threshold relaxed from 0.45 to 0.5 for wider recall
 *   - Synonym expansion includes tag-derived terms (hyphenated tags split)
 *   - "action" synonym group extended: includes "condition", "behavior"
 *   - New synonym groups: "test" â†” "quiz"/"assessment"/"exam"/"pre-test"
 *
 * v3.5.0 enhancements â€” Dynamic Self-Updating & Smart Matching:
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
 * v3.6.0 fixes â€” Community Link 404 Resolution & Comprehensive Matching:
 *   - CRITICAL: buildDeepLink text fragment separator fixed from "&:~:text="
 *     to correct ":~:text=" per the W3C Text Fragments specification.
 *     Previously all deep links with both an anchor and text fragment
 *     produced invalid URLs that broke in-page highlighting
 *   - Community-aware deep linking: buildDeepLink now accepts articleType
 *     parameter and skips adding fake section anchors (#body-p0 etc.) for
 *     community articles â€” these IDs don't exist on community pages and
 *     caused navigation failures on HubSpot-hosted community platform
 *   - solutionText now generates matchedParagraphs entries, ensuring solved
 *     community threads show their accepted answer as the primary snippet
 *     and deep link text instead of the question body
 *   - Sample index community URLs verified against live community site;
 *     two fabricated URLs (a1b2c3d4, e5f6g7h8) replaced with real threads
 *   - Added real community threads for broader coverage (10 community
 *     articles total, up from 7): includes eLearning, awards, events
 *   - Enhanced spell correction: added character transposition detection
 *     (e.g. "varaible" â†’ "variable") using Damerau distance for single
 *     transpositions; increased candidate radius for short words
 *   - Title/body/section/solutionText/tags all contribute to matchedTerms
 *     ensuring comprehensive result display across all content types
 *
 * v3.7.0 fixes â€” Community 404 Resolution & Comprehensive Search:
 *   - CRITICAL: "Post a new question in Community" link fixed from
 *     non-existent /topics/new?category= path to the real HubSpot
 *     community category page /topics?category=...&hsLang=en
 *     (verified against live community.elblearning.com)
 *   - Enhanced spell correction with keyboard-proximity awareness:
 *     adjacent-key substitutions (e.g. "lectura" â†’ "lectora") are now
 *     detected via QWERTY adjacency map, boosting correction accuracy
 *   - Double-letter and missing-letter spell patterns: "publsih" â†’
 *     "publish", "varriable" â†’ "variable" detected by specialized checks
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
 * v3.9.0 â€” Zero-Configuration Auto-Discovery (retained in v3.10 as fallback):
 *   - Auto-index discovery: when no indexUrl or inlineIndex is configured,
 *     the chatbot detects its own <script> tag's src, derives the base
 *     directory, and probes for elb-help-bot-index.json in sibling and parent
 *     paths automatically. No manual configuration required.
 *   - Eliminates the "Precision mode requires a content index" warning
 *     for 95%+ of integration scenarios â€” just drop the JS file next
 *     to elb-help-bot-index.json and everything works.
 *   - Config files updated: indexUrl defaults to 'elb-help-bot-index.json'
 *     instead of empty string, making even config-based integrations
 *     work out of the box.
 *
 * v3.8.0 fixes â€” Flicker / Panel-Close / Matching Stability:
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
 *   - Spell correction preserved from v3.3â€“v3.7: Levenshtein, Damerau
 *     transposition, QWERTY keyboard proximity, double-letter patterns.
 *
 * Zero dependencies. Single vanilla JS file. Any tech stack.
 * @version 4.3.0
 */
(function () {
  'use strict';

  var VERSION = '4.10.0';
  var MAX_QUERY_LENGTH = 200;
  var MAX_RESULTS = 10;
  var HIGH_CONFIDENCE = 0.80;
  var MEDIUM_CONFIDENCE = 0.50;
  var MIN_RENDER_THRESHOLD = 0.01;
  var SNIPPET_RADIUS = 140;
  var POS_STORAGE_KEY = 'elb-help-bot-position';
  var PANEL_STATE_KEY = 'elb-help-bot-panel-open';
  var HISTORY_KEY = 'elb-help-bot-history';
  var QUICK_GUIDE_USAGE_KEY = 'elb-help-bot-guide-usage';
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
    'rehearsal','coursemill','reviewlink','learning-creation-studio',
    'asset-libraries','off-the-shelf','general'
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
    'learning-creation-studio': { label: 'The Learning Creation Studio',kb: '/the-learning-creation-studio',community: 'additional-learning-products' },
    'asset-libraries':          { label: 'Asset Libraries',              kb: '/asset-libraries',              community: 'additional-learning-products' },
    'off-the-shelf':            { label: 'Off-the-Shelf Training',       kb: '/off-the-shelf-training',       community: 'additional-learning-products' },
    general:                    { label: 'Additional Learning Products', kb: '/general-topics',             community: 'additional-learning-products' }
  };

  var PRODUCT_INSTRUCTIONS = {
    lectora:           [{ label: 'Getting Started: Training Plan',     url: KB_BASE + '/lectora-training-plan-everything-you-need-to-know?hsLang=en', tag: 'Essentials' },
                        { label: 'Lectora & PowerPoint Quick Guide',   url: KB_BASE + '/lectora-and-powerpoint-start-here?hsLang=en', tag: 'Quick Start' },
                        { label: 'Responsive Course Design (RCD)',     url: KB_BASE + '/responsive-course-design-in-lectora?hsLang=en', tag: 'Design' },
                        { label: 'Publishing (SCORM, AICC, HTML)',     url: KB_BASE + '/19.-publishing-scorm-aicc-html?hsLang=en', tag: 'Publishing' }],
    cenariovr:         [{ label: 'Getting Started: CenarioVR',         url: KB_BASE + '/cenariovr-getting-started?hsLang=en', tag: 'Essentials' },
                        { label: '360Â° Video Best Practices',          url: KB_BASE + '/best-practices-for-creating-360-degree-video?hsLang=en', tag: 'Content' },
                        { label: 'Navigating CenarioVR Dashboard',    url: KB_BASE + '/navigating-cenariovrs-dashboard?hsLang=en', tag: 'Quick Start' }],
    'training-arcade': [{ label: 'Step-by-Step Game Tutorials',        url: KB_BASE + '/learn-how-to-build-effective-training-games?hsLang=en', tag: 'Tutorials' },
                        { label: 'Game Overview Videos',               url: KB_BASE + '/game-videos?hsLang=en', tag: 'Resources' },
                        { label: 'Adding Games to Your LMS',           url: KB_BASE + '/how-do-i-add-the-training-arcade-games-to-my-lms?hsLang=en', tag: 'LMS' }],
    microbuilder:      [{ label: 'Create a Microlearning Module',      url: KB_BASE + '/how-to-create-a-microlearning-module-in-microbuilder?hsLang=en', tag: 'Quick Start' },
                        { label: 'AI-Assisted Content Generation',     url: KB_BASE + '/ai-assisted-content-generation-in-microbuilder?hsLang=en', tag: 'AI' },
                        { label: 'Publish Your Module',                url: KB_BASE + '/publish-your-microlearning-module-in-microbuilder?hsLang=en', tag: 'Publishing' }],
    rockstar:          [{ label: 'Getting Started: Rockstar Platform', url: KB_BASE + '/guide-to-getting-started-with-knowledgelink?hsLang=en', tag: 'Essentials' },
                        { label: 'Navigating the Module Page',         url: KB_BASE + '/module-page?hsLang=en', tag: 'Quick Start' }],
    reviewlink:        [{ label: 'Getting Started with ReviewLink',    url: KB_BASE + '/getting-started-with-reviewlink?hsLang=en', tag: 'Quick Start' },
                        { label: 'ReviewLink Training Plan',           url: KB_BASE + '/reviewlink-training-plan-everything-you-need-to-know?hsLang=en', tag: 'Essentials' },
                        { label: 'ReviewLink Markup Tools',            url: KB_BASE + '/reviewlink-markup-1?hsLang=en', tag: 'Tools' }],
    coursemill:         [{ label: 'Getting Started with CourseMill',    url: KB_BASE + '/getting-started-with-coursemill?hsLang=en', tag: 'Essentials' },
                        { label: 'CourseMill Student UI Overview',     url: KB_BASE + '/coursemill-student-ui-overview?hsLang=en', tag: 'Students' },
                        { label: 'CourseMill Administrator Guide',     url: KB_BASE + '/coursemill-administrator-guide?hsLang=en', tag: 'Admin' }],
    rehearsal:         [{ label: 'Rehearsal Knowledge Base',           url: KB_BASE + '/rehearsal-knowledge-base?hsLang=en', tag: 'Quick Start' },
                        { label: 'Rehearsal Administration',           url: KB_BASE + '/rehearsal-platform-administration?hsLang=en', tag: 'Admin' },
                        { label: 'Rehearsal Mentoring',                url: KB_BASE + '/rehearsal-mentoring?hsLang=en', tag: 'Mentoring' }],
    'learning-creation-studio': [{ label: 'Learning Creation Studio Overview', url: KB_BASE + '/the-learning-creation-studio?hsLang=en', tag: 'Essentials' }],
    'asset-libraries': [{ label: 'FAQs â€” Account & Asset Library',  url: KB_BASE + '/faqs-account-management-and-asset-library?hsLang=en', tag: 'Account' },
                        { label: 'Stock Asset Library',                url: KB_BASE + '/asset-libraries?hsLang=en', tag: 'Assets' },
                        { label: 'Stock Audio Library Topics',         url: KB_BASE + '/stock-library-landing-page', tag: 'Audio' }],
    'off-the-shelf':   [{ label: 'Courseware Offerings',               url: KB_BASE + '/courseware-pricing', tag: 'Catalog' },
                        { label: 'Courseware Customizations',          url: KB_BASE + '/customizations?hsLang=en', tag: 'Custom' }],
    general:           [{ label: 'FAQs \u2014 Account & Asset Library',  url: KB_BASE + '/faqs-account-management-and-asset-library?hsLang=en', tag: 'Account' },
                        { label: 'Stock Asset Library',                url: KB_BASE + '/asset-libraries?hsLang=en', tag: 'Assets' },
                        { label: 'Stock Audio Library',                url: KB_BASE + '/stock-library-landing-page', tag: 'Audio' },
                        { label: 'Release Notes for All Software',     url: KB_BASE + '/release-notes-for-all-software?hsLang=en', tag: 'Updates' },
                        { label: 'Submit a Support Case',              url: KB_BASE + '/submit-a-case-to-customer-solutions?hsLang=en', tag: 'Support' }]
  };

  var STOP_WORDS = ['a','an','the','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','must','shall','can','need','dare','to','of','in','for','on','with','at','by','from','as','into','through','during','before','after','above','below','i','me','my','we','our','you','your','it','its','they','them','their','what','which','who','how','when','where','why','not','no','so','if','or','and','but','then','than','too','very','just','about','also','only'];

  /* =================== BUILT-IN INDEX (zero-config fallback) =================== */
  var _BUILTIN_INDEX = {"version":"4.10.0","description":"v4.10.0: ELB Assistant - Unified ranking, community URL validation, broken link prevention","updatedAt":"2026-03-03T00:00:00Z","synonyms":{"publish":["export","deploy","release","output","generate"],"error":["bug","issue","problem","crash","failure","broken"],"install":["setup","configure","download","deploy"],"create":["build","make","add","new","generate","author"],"course":["module","lesson","training","content","curriculum"],"quiz":["test","assessment","exam","evaluation"],"report":["analytics","statistics","data","metrics","dashboard"],"scorm":["xapi","tincan","cmi5","aicc","package"],"responsive":["mobile","adaptive","flexible","rcd"],"variable":["parameter","field","value","token"],"template":["layout","theme","design","preset"],"user":["student","learner","participant","member","account"],"vr":["virtual reality","immersive","360","headset"],"game":["gamification","arcade","interactive","engagement"],"arcade":["training arcade","game","gamification","training-arcade"],"release":["update","version","changelog","patch","upgrade","what\u0027s new","latest"],"notes":["changelog","updates","log","history","changes","announcements"],"release notes":["changelog","updates","what\u0027s new","latest version","version history"],"import":["upload","load","bring in","transfer","ingest"],"accessibility":["a11y","wcag","508","screen reader","ada","compliance"],"powerpoint":["pptx","slides","presentation","ppt"],"lms":["learning management system","coursemill","rockstar","platform"],"microlearning":["micro","bite-sized","micro-module","short-form","microbuilder"],"ai":["artificial intelligence","generative","machine learning","gpt","chatbot"],"rehearsal":["practice","coaching","video practice","role-play"],"review":["feedback","markup","annotation","reviewlink","comment"],"stock":["resource","media"],"audio":["sound","music","soundtrack","voiceover"],"account":["billing","subscription","license","profile"],"asset":["resource","media"]},"weightConfig":{"titleExact":120,"titlePartial":70,"titleFuzzy":35,"headingExact":50,"headingPartial":30,"headingFuzzy":18,"bodyExact":40,"bodyPartial":25,"bodyFuzzy":12,"paragraphExact":45,"paragraphPartial":28,"paragraphFuzzy":14,"synonymMatch":0.7,"solvedBoost":30,"acceptedBoost":20,"recencyDays":365,"recencyWeight":10,"tagMatch":15,"productMatch":20,"semanticWeight":30,"rlWeight":1.0},"confidenceConfig":{"high":0.80,"medium":0.50,"minRenderThreshold":0.01,"maxResults":10},"articles":[{"id":"kb-lectora-001","type":"kb","product":"lectora","title":"Getting Started: Lectora Training Plan","url":"https://knowledgebase.elblearning.com/lectora-training-plan-everything-you-need-to-know","body":"Everything you need to know to get started with Lectora. This training plan covers installation, setup, course creation, publishing, and advanced features. Follow the step-by-step guide to build your first eLearning course.","sections":[{"heading":"Installation \u0026 Setup","anchor":"installation-setup","text":"Download Lectora Desktop from the ELB Learning website. Run the installer and follow the on-screen prompts. Enter your license key when prompted. For Lectora Online, sign in at lectora.com with your ELB Learning credentials.","level":2,"paragraphs":[{"text":"Download Lectora Desktop from the ELB Learning website. Run the installer and follow the on-screen prompts.","anchor":"installation-setup-p0"},{"text":"Enter your license key when prompted. For Lectora Online, sign in at lectora.com with your ELB Learning credentials.","anchor":"installation-setup-p1"}]},{"heading":"Creating Your First Course","anchor":"creating-your-first-course","text":"Start a new project by selecting File \u003e New. Choose a template or start from scratch. Add pages, chapters, and sections. Insert text blocks, images, audio, and video. Configure navigation and transitions.","level":2,"paragraphs":[{"text":"Start a new project by selecting File \u003e New. Choose a template or start from scratch.","anchor":"creating-your-first-course-p0"},{"text":"Add pages, chapters, and sections. Insert text blocks, images, audio, and video.","anchor":"creating-your-first-course-p1"},{"text":"Configure navigation and transitions between pages for a smooth learner experience.","anchor":"creating-your-first-course-p2"}]},{"heading":"Publishing Options","anchor":"publishing-options","text":"Publish your course for different platforms. Choose SCORM 1.2, SCORM 2004, xAPI (Tin Can), AICC, or HTML5. Set output options including responsive design. Select the target LMS and configure tracking settings. Export the package and upload to your LMS.","level":2,"paragraphs":[{"text":"Publish your course for different platforms. Choose SCORM 1.2, SCORM 2004, xAPI (Tin Can), AICC, or HTML5.","anchor":"publishing-options-p0"},{"text":"Set output options including responsive design. Select the target LMS and configure tracking settings.","anchor":"publishing-options-p1"},{"text":"Export the package and upload to your LMS. Verify tracking data is correctly sent by launching the course in your LMS and completing a test run.","anchor":"publishing-options-p2"}]},{"heading":"Variables and Actions","anchor":"variables-and-actions","text":"Use variables to store and track learner data. Create custom variables for scores, completion status, and user input. Set up actions triggered by events like button clicks, page load, or timer completion. Use conditions to create branching scenarios.","level":2,"paragraphs":[{"text":"Use variables to store and track learner data. Create custom variables for scores, completion status, and user input.","anchor":"variables-and-actions-p0"},{"text":"Set up actions triggered by events like button clicks, page load, or timer completion. Use conditions to create branching scenarios.","anchor":"variables-and-actions-p1"}]}],"tags":["getting-started","training-plan","installation","publishing","variables"],"solved":false,"updatedAt":"2026-02-15"},{"id":"kb-lectora-002","type":"kb","product":"lectora","title":"Quick Guide: Lectora and PowerPoint","url":"https://knowledgebase.elblearning.com/lectora-and-powerpoint-start-here","body":"Convert PowerPoint presentations to interactive Lectora courses. Import slides, preserve animations, add interactivity, and publish as eLearning content.","sections":[{"heading":"Importing PowerPoint","anchor":"importing-powerpoint","text":"Go to File \u003e Import \u003e PowerPoint. Select your .pptx file. Choose import options: preserve layout, import animations, maintain slide order. The importer converts each slide to a Lectora page.","level":2,"paragraphs":[{"text":"Go to File \u003e Import \u003e PowerPoint. Select your .pptx file.","anchor":"importing-powerpoint-p0"},{"text":"Choose import options: preserve layout, import animations, maintain slide order. The importer converts each slide to a Lectora page.","anchor":"importing-powerpoint-p1"}]},{"heading":"Adding Interactivity","anchor":"adding-interactivity","text":"After import, enhance slides with Lectora interactivity. Add buttons, quiz questions, drag-and-drop interactions, and clickable hotspots. Use actions and triggers to control navigation flow.","level":2,"paragraphs":[{"text":"After import, enhance slides with Lectora interactivity. Add buttons, quiz questions, drag-and-drop interactions, and clickable hotspots.","anchor":"adding-interactivity-p0"},{"text":"Use actions and triggers to control navigation flow between slides and interactive elements.","anchor":"adding-interactivity-p1"}]}],"tags":["powerpoint","import","conversion","slides"],"solved":false,"updatedAt":"2026-02-10"},{"id":"kb-lectora-003","type":"kb","product":"lectora","title":"Responsive Course Design (RCD) in Lectora","url":"https://knowledgebase.elblearning.com/responsive-course-design-in-lectora","body":"Build mobile-responsive courses that adapt to any screen size. Lectora\u0027s Responsive Course Design (RCD) automatically adjusts layout for desktop, tablet, and mobile devices.","sections":[{"heading":"Enabling RCD","anchor":"enabling-rcd","text":"When creating a new title, select Responsive Design. This enables the responsive grid system. Content automatically reflows based on device width. You can also convert existing courses to responsive layout.","level":2,"paragraphs":[{"text":"When creating a new title, select Responsive Design. This enables the responsive grid system.","anchor":"enabling-rcd-p0"},{"text":"Content automatically reflows based on device width. You can also convert existing courses to responsive layout.","anchor":"enabling-rcd-p1"}]},{"heading":"Breakpoints and Layouts","anchor":"breakpoints-and-layouts","text":"RCD uses three default breakpoints: Desktop (1024px+), Tablet (768px), and Mobile (480px). Customize breakpoints in project settings. Each breakpoint can have a different layout. Use the device preview toolbar to test each view.","level":2,"paragraphs":[{"text":"RCD uses three default breakpoints: Desktop (1024px+), Tablet (768px), and Mobile (480px). Customize breakpoints in project settings.","anchor":"breakpoints-and-layouts-p0"},{"text":"Each breakpoint can have a different layout. Use the device preview toolbar to test each view.","anchor":"breakpoints-and-layouts-p1"}]},{"heading":"Mobile-Specific Settings","anchor":"mobile-specific-settings","text":"Configure touch-friendly button sizes for mobile. Adjust font sizes and spacing. Enable swipe navigation. Test gesture interactions. Ensure accessibility compliance on all devices.","level":2,"paragraphs":[{"text":"Configure touch-friendly button sizes for mobile. Adjust font sizes and spacing.","anchor":"mobile-specific-settings-p0"},{"text":"Enable swipe navigation. Test gesture interactions. Ensure accessibility compliance on all devices.","anchor":"mobile-specific-settings-p1"}]}],"tags":["responsive","rcd","mobile","adaptive","layout"],"solved":false,"updatedAt":"2026-01-28"},{"id":"kb-cenariovr-001","type":"kb","product":"cenariovr","title":"Getting Started: CenarioVR","url":"https://knowledgebase.elblearning.com/cenariovr-getting-started","body":"Learn how to create immersive virtual reality learning experiences with CenarioVR. This guide covers 360-degree video, hotspots, branching scenarios, and publishing for VR headsets.","sections":[{"heading":"Dashboard Overview","anchor":"dashboard-overview","text":"The CenarioVR dashboard shows your projects, templates, and recent activity. Create a new scenario from the dashboard. Browse the template library for pre-built VR experiences. Manage team members and sharing settings.","level":2,"paragraphs":[{"text":"The CenarioVR dashboard shows your projects, templates, and recent activity.","anchor":"dashboard-overview-p0"},{"text":"Create a new scenario from the dashboard. Browse the template library for pre-built VR experiences. Manage team members and sharing settings.","anchor":"dashboard-overview-p1"}]},{"heading":"Adding 360 Content","anchor":"adding-360-content","text":"Upload 360-degree photos or videos as scene backgrounds. Supported formats include equirectangular JPG, PNG, and MP4. Add interactive hotspots, text overlays, and navigation waypoints. Create branching paths between scenes.","level":2,"paragraphs":[{"text":"Upload 360-degree photos or videos as scene backgrounds. Supported formats include equirectangular JPG, PNG, and MP4.","anchor":"adding-360-content-p0"},{"text":"Add interactive hotspots, text overlays, and navigation waypoints. Create branching paths between scenes.","anchor":"adding-360-content-p1"}]},{"heading":"Publishing for VR","anchor":"publishing-for-vr","text":"Publish your CenarioVR experience for web browsers, Oculus Quest, HTC Vive, or mobile VR. Generate a shareable link or SCORM package for LMS integration. Configure quality settings and loading screens.","level":2,"paragraphs":[{"text":"Publish your CenarioVR experience for web browsers, Oculus Quest, HTC Vive, or mobile VR.","anchor":"publishing-for-vr-p0"},{"text":"Generate a shareable link or SCORM package for LMS integration. Configure quality settings and loading screens.","anchor":"publishing-for-vr-p1"}]}],"tags":["getting-started","vr","360","immersive","headset"],"solved":false,"updatedAt":"2026-02-05"},{"id":"kb-training-arcade-001","type":"kb","product":"training-arcade","title":"Step-by-Step Tutorials: The Training Arcade","url":"https://knowledgebase.elblearning.com/learn-how-to-build-effective-training-games","body":"Create engaging training games with The Training Arcade. Choose from multiple game templates including trivia, word search, flashcards, and more. Customize content, branding, and difficulty levels.","sections":[{"heading":"Choosing a Game Template","anchor":"choosing-a-game-template","text":"Browse the game library to select a template. Options include Jeopardy-style trivia, memory match, word search, spin the wheel, and flashcards. Each template is fully customizable with your training content.","level":2},{"heading":"Adding Content to Games","anchor":"adding-content-to-games","text":"Enter questions, answers, and feedback for each game. Support for text, images, audio, and video. Set correct answers and point values. Configure difficulty levels and time limits.","level":2},{"heading":"Publishing and LMS Integration","anchor":"publishing-and-lms-integration","text":"Export games as SCORM packages for LMS tracking. Generate shareable web links. Embed games directly in websites using iframe code. Track completion and scores through your LMS.","level":2}],"tags":["games","gamification","trivia","engagement","tutorial","arcade","training-arcade"],"solved":false,"updatedAt":"2026-02-01"},{"id":"kb-microbuilder-001","type":"kb","product":"microbuilder","title":"How To Create a Microlearning Module in MicroBuilder","url":"https://knowledgebase.elblearning.com/how-to-create-a-microlearning-module-in-microbuilder","body":"Build bite-sized learning modules quickly with MicroBuilder. The easy-to-use authoring tool lets you create microlearning content without technical skills.","sections":[{"heading":"Creating a New Module","anchor":"creating-a-new-module","text":"Click Create New from the dashboard. Choose a layout template or start blank. Add content blocks: text, images, video, quizzes, and interactive elements. Drag and drop to reorder sections.","level":2},{"heading":"AI-Assisted Content Generation","anchor":"ai-assisted-content-generation","text":"Use MicroBuilder\u0027s AI assistant to generate learning content. Provide a topic or paste existing text. The AI creates structured microlearning modules with questions and key takeaways. Review and customize the generated content.","level":2},{"heading":"Publishing Your Module","anchor":"publishing-your-module","text":"Publish your microlearning module as a web link, SCORM package, or embed code. Share via email, Slack, or your LMS. Track engagement and completion analytics from the dashboard.","level":2}],"tags":["microlearning","authoring","ai","content-creation"],"solved":false,"updatedAt":"2026-02-18"},{"id":"kb-rockstar-001","type":"kb","product":"rockstar","title":"Guide to Getting Started with Rockstar Learning Platform","url":"https://knowledgebase.elblearning.com/guide-to-getting-started-with-knowledgelink","body":"Set up and configure the Rockstar Learning Platform for your organization. Manage users, courses, learning paths, and reporting.","sections":[{"heading":"User Management","anchor":"user-management","text":"Add users individually or via bulk CSV import. Set user roles: Admin, Manager, Instructor, Learner. Configure SSO integration with your identity provider. Manage groups and departments for targeted training assignments.","level":2,"paragraphs":[{"text":"Add users individually or via bulk CSV import. Set user roles: Admin, Manager, Instructor, Learner.","anchor":"user-management-p0"},{"text":"Configure SSO integration with your identity provider. Manage groups and departments for targeted training assignments.","anchor":"user-management-p1"}]},{"heading":"Course Assignment","anchor":"course-assignment","text":"Upload SCORM, xAPI, or video courses. Create learning paths with prerequisites. Assign courses to individuals, groups, or departments. Set due dates and send automated reminders.","level":2},{"heading":"Reports and Analytics","anchor":"reports-and-analytics","text":"View completion rates, scores, and engagement metrics. Generate custom reports by user, course, or department. Export data as CSV or PDF. Schedule automated report delivery via email.","level":2}],"tags":["lms","platform","users","reports","courses"],"solved":false,"updatedAt":"2026-01-20"},{"id":"comm-lectora-001","type":"community","product":"lectora","title":"The Return of the In-Person User Conference?","url":"https://community.elblearning.com/topics/the-return-of-the-inperson-user-conference-2fca939b?hsLang=en","body":"We\u0027ve heard requests from some avid Lectora fans to bring back the Lectora User Conference (LUC). We hear you. But we want to do it right. We\u0027ve grown a ton since the Trivantis days and have many more products. So, we\u0027d like to know what you\u0027d be willing to participate in.","tags":["lectora","conference","user-group","training","community"],"solved":false,"accepted":false,"replies":9,"views":345,"updatedAt":"2023-08-02"},{"id":"comm-lectora-002","type":"community","product":"lectora","title":"Join us for In-Person Training on Lectora","url":"https://community.elblearning.com/topics/join-us-for-inperson-training-on-lectora-82b10a16?hsLang=en","body":"Join us for hands-on, in-person training sessions on Lectora. Learn from experts, get certified, and connect with fellow Lectora users and eLearning professionals.","tags":["lectora","training","in-person","certification","workshop"],"solved":false,"accepted":false,"replies":0,"views":210,"updatedAt":"2023-06-16"},{"id":"comm-cenariovr-001","type":"community","product":"general","title":"ELB\u0027s new Community Web App","url":"https://community.elblearning.com/topics/elb39s-new-quotcommunityquot-web-app-d7785aa7?hsLang=en","body":"ELB Learning has launched a new Community web app for users to connect, ask questions, share knowledge, and meet fellow learners and educators. Get involved by signing in and exploring the diverse range of topics.","tags":["community","web-app","elb-learning","networking","discussion"],"solved":false,"accepted":false,"replies":16,"views":428,"updatedAt":"2023-07-26"},{"id":"comm-rockstar-001","type":"community","product":"general","title":"ELB Learning Wins Top Content Providers for Diversity And Inclusion Training","url":"https://community.elblearning.com/topics/elb-learning-is-number-4-for-top-content-providers-for-diversity-and-inclusion-training-ae6904f3?hsLang=en","body":"ELB Learning is number 4 for Top Content Providers for Diversity And Inclusion Training! This recognition highlights our commitment to creating impactful and inclusive learning experiences for organizations worldwide.","tags":["elb-learning","awards","diversity","inclusion","content-providers"],"solved":false,"accepted":false,"replies":0,"views":189,"updatedAt":"2023-05-12"},{"id":"comm-training-arcade-001","type":"community","product":"general","title":"ELB Learning wins 2022 Top Advanced Learning Technologies Companies List","url":"https://community.elblearning.com/topics/elb-learning-wins-2022-top-advanced-learning-technologies-companies-list-29ea4075?hsLang=en","body":"ELB Learning has been recognized on the 2022 Top Advanced Learning Technologies Companies List, showcasing our suite of innovative tools including Lectora, CenarioVR, The Training Arcade, and more.","tags":["elb-learning","awards","technology","recognition","learning-tools","arcade","training-arcade"],"solved":false,"accepted":false,"replies":0,"views":95,"updatedAt":"2022-10-31"},{"id":"kb-general-001","type":"kb","product":"lectora","title":"Lectora Online Release Notes","url":"https://knowledgebase.elblearning.com/lectora-online-release-notes","body":"Stay up to date with the latest features, improvements, and bug fixes for Lectora Online. Check release notes for new capabilities, enhancements, and resolved issues across recent versions.","sections":[{"heading":"Latest Releases","anchor":"latest-releases","text":"Check back regularly for the newest updates. Each product section below lists recent changes chronologically. Major updates include new features and significant improvements. Minor updates include bug fixes and performance enhancements.","level":2}],"tags":["release-notes","updates","changelog","versions","lectora-online"],"solved":false,"updatedAt":"2026-02-20"},{"id":"kb-general-002","type":"kb","product":"lectora","title":"Lectora Desktop Release Notes","url":"https://knowledgebase.elblearning.com/lectora-desktop-release-notes","body":"View the complete history of Lectora Desktop updates including new features, bug fixes, and performance improvements. Each release is documented with version numbers and detailed change descriptions.","sections":[{"heading":"Recent Updates","anchor":"recent-updates","text":"Lectora Desktop receives regular updates with new authoring features, accessibility improvements, and publishing enhancements. Check this page for the latest version information and download links.","level":2}],"tags":["release-notes","updates","changelog","versions","lectora-desktop"],"solved":false,"updatedAt":"2026-02-22"},{"id":"kb-general-003","type":"kb","product":"cenariovr","title":"CenarioVR Release Notes","url":"https://knowledgebase.elblearning.com/release-notes-for-all-software?hsLang=en","body":"Stay up to date with CenarioVR platform updates. Release notes cover new VR authoring features, scene editor improvements, publishing updates, and bug fixes for the immersive learning platform.","sections":[{"heading":"Latest CenarioVR Updates","anchor":"latest-cenariovr-updates","text":"CenarioVR is continuously improved with new features for VR content creation. Recent updates include enhanced 360 video support, improved hotspot interactions, and new publishing options for VR headsets.","level":2}],"tags":["release-notes","updates","changelog","versions","cenariovr"],"solved":false,"updatedAt":"2026-02-18"},{"id":"kb-general-004","type":"kb","product":"rockstar","title":"Rockstar Learning Platform Release Notes","url":"https://knowledgebase.elblearning.com/release-notes","body":"Track all updates to the Rockstar Learning Platform (formerly KnowledgeLink). Release notes document new LMS features, admin panel improvements, reporting enhancements, and integration updates.","sections":[{"heading":"Platform Updates","anchor":"platform-updates","text":"The Rockstar Learning Platform is regularly updated with new features for course management, user administration, and analytics. Recent releases include enhanced reporting dashboards, improved SSO support, and mobile app updates.","level":2}],"tags":["release-notes","updates","changelog","versions","rockstar","lms"],"solved":false,"updatedAt":"2026-02-15"},{"id":"kb-general-005","type":"kb","product":"coursemill","title":"CourseMill Release Notes","url":"https://knowledgebase.elblearning.com/release-notes-for-all-software?hsLang=en","body":"View all CourseMill LMS updates and version history. Release notes cover admin panel improvements, learner experience updates, compliance tracking enhancements, and API changes.","sections":[{"heading":"CourseMill Version History","anchor":"coursemill-version-history","text":"CourseMill receives periodic updates improving course management, user administration, and reporting capabilities. Check release notes for detailed information about each version.","level":2}],"tags":["release-notes","updates","changelog","versions","coursemill","lms"],"solved":false,"updatedAt":"2026-02-12"},{"id":"kb-reviewlink-001","type":"kb","product":"reviewlink","title":"Getting Started with ReviewLink","url":"https://knowledgebase.elblearning.com/getting-started-with-reviewlink","body":"ReviewLink streamlines the content review process. Upload your eLearning content, invite reviewers, collect feedback with inline annotations, and manage review cycles.","sections":[{"heading":"Uploading Content for Review","anchor":"uploading-content","text":"Upload SCORM packages, HTML5 content, or video files to ReviewLink. The platform renders your content in a browser-based viewer. Reviewers can navigate through the content and leave contextual feedback.","level":2},{"heading":"Markup and Annotations","anchor":"markup-and-annotations","text":"Reviewers can add markup directly on the content. Use text annotations, arrows, highlights, and stamps. Each comment is pinned to a specific location on the page. Authors receive notifications and can respond to each comment.","level":2}],"tags":["review","feedback","annotations","collaboration"],"solved":false,"updatedAt":"2026-01-25"},{"id":"kb-coursemill-001","type":"kb","product":"coursemill","title":"CourseMill Student UI Overview","url":"https://knowledgebase.elblearning.com/coursemill-student-ui-overview","body":"Navigate the CourseMill learning management system as a student. Access your assigned courses, track progress, view certificates, and manage your learning profile.","sections":[{"heading":"My Learning Dashboard","anchor":"my-learning-dashboard","text":"The dashboard displays your assigned courses, completion progress, and upcoming deadlines. Filter by status: Not Started, In Progress, or Completed. Click any course tile to launch the content.","level":2,"paragraphs":[{"text":"The dashboard displays your assigned courses, completion progress, and upcoming deadlines.","anchor":"my-learning-dashboard-p0"},{"text":"Filter by status: Not Started, In Progress, or Completed. Click any course tile to launch the content.","anchor":"my-learning-dashboard-p1"}]},{"heading":"Certificates and Transcripts","anchor":"certificates-and-transcripts","text":"After completing a course, access your certificate from the Completed section. Download or print certificates. View your full learning transcript with dates, scores, and completion status for all courses.","level":2,"paragraphs":[{"text":"After completing a course, access your certificate from the Completed section. Download or print certificates.","anchor":"certificates-and-transcripts-p0"},{"text":"View your full learning transcript with dates, scores, and completion status for all courses.","anchor":"certificates-and-transcripts-p1"}]}],"tags":["lms","student","dashboard","certificates","tracking","getting-started"],"solved":false,"updatedAt":"2026-01-15"},{"id":"kb-coursemill-002","type":"kb","product":"coursemill","title":"Getting Started with CourseMill LMS","url":"https://knowledgebase.elblearning.com/getting-started-with-coursemill","body":"Get started with CourseMill, the learning management system by ELB Learning. This guide covers initial setup, user creation, course uploading, assignment configuration, and reporting basics for CourseMill administrators.","sections":[{"heading":"Initial Setup and Configuration","anchor":"initial-setup-configuration","text":"Log in to the CourseMill admin console. Configure your organization settings including branding, default language, and notification preferences. Set up authentication methods: built-in credentials, LDAP, or SSO.","level":2,"paragraphs":[{"text":"Log in to the CourseMill admin console. Configure your organization settings including branding, default language, and notification preferences.","anchor":"initial-setup-configuration-p0"},{"text":"Set up authentication methods: built-in credentials, LDAP, or SSO.","anchor":"initial-setup-configuration-p1"}]},{"heading":"Managing Users and Groups","anchor":"managing-users-groups","text":"Create user accounts individually or import via CSV. Assign roles: Administrator, Manager, Instructor, or Learner. Organize users into groups and departments for targeted course assignments and reporting.","level":2,"paragraphs":[{"text":"Create user accounts individually or import via CSV. Assign roles: Administrator, Manager, Instructor, or Learner.","anchor":"managing-users-groups-p0"},{"text":"Organize users into groups and departments for targeted course assignments and reporting.","anchor":"managing-users-groups-p1"}]},{"heading":"Uploading and Assigning Courses","anchor":"uploading-assigning-courses","text":"Upload SCORM, AICC, or xAPI course packages to CourseMill. Create learning paths with prerequisites and deadlines. Assign courses to individuals, groups, or the entire organization. Configure enrollment rules and automated reminders.","level":2,"paragraphs":[{"text":"Upload SCORM, AICC, or xAPI course packages to CourseMill. Create learning paths with prerequisites and deadlines.","anchor":"uploading-assigning-courses-p0"},{"text":"Assign courses to individuals, groups, or the entire organization. Configure enrollment rules and automated reminders.","anchor":"uploading-assigning-courses-p1"}]},{"heading":"Reports and Compliance Tracking","anchor":"reports-compliance-tracking","text":"Generate detailed reports on learner progress, course completions, and compliance status. Schedule automated report delivery. Export data in CSV or PDF format for external analysis. Use the compliance dashboard to track mandatory training deadlines.","level":2,"paragraphs":[{"text":"Generate detailed reports on learner progress, course completions, and compliance status. Schedule automated report delivery.","anchor":"reports-compliance-tracking-p0"},{"text":"Export data in CSV or PDF format for external analysis. Use the compliance dashboard to track mandatory training deadlines.","anchor":"reports-compliance-tracking-p1"}]}],"tags":["getting-started","lms","setup","admin","courses","users","reports","coursemill"],"solved":false,"updatedAt":"2026-02-18"},{"id":"kb-coursemill-003","type":"kb","product":"coursemill","title":"CourseMill Administrator Guide","url":"https://knowledgebase.elblearning.com/coursemill-administrator-guide","body":"Comprehensive guide for CourseMill administrators covering system configuration, user management, course catalog setup, compliance tracking, and advanced reporting features.","sections":[{"heading":"System Configuration","anchor":"system-configuration","text":"Access the CourseMill admin panel to configure global settings. Manage email templates for notifications. Set password policies and session timeouts. Configure integration with external systems via API.","level":2,"paragraphs":[{"text":"Access the CourseMill admin panel to configure global settings. Manage email templates for notifications.","anchor":"system-configuration-p0"},{"text":"Set password policies and session timeouts. Configure integration with external systems via API.","anchor":"system-configuration-p1"}]},{"heading":"Course Catalog Management","anchor":"course-catalog-management","text":"Organize courses into categories and catalogs. Set course visibility and enrollment rules. Enable self-enrollment or restrict to admin-assigned only. Manage course versioning and retirement.","level":2,"paragraphs":[{"text":"Organize courses into categories and catalogs. Set course visibility and enrollment rules.","anchor":"course-catalog-management-p0"},{"text":"Enable self-enrollment or restrict to admin-assigned only. Manage course versioning and retirement.","anchor":"course-catalog-management-p1"}]}],"tags":["admin","configuration","lms","catalog","management","coursemill"],"solved":false,"updatedAt":"2026-02-10"},{"id":"kb-lectora-004","type":"kb","product":"lectora","title":"Status Action Conditions","url":"https://knowledgebase.elblearning.com/status-action-conditions","body":"Learn how to use status action conditions in Lectora to control course behavior based on completion states. Configure actions that fire only when specific conditions related to question status, page status, or variable values are met.","sections":[{"heading":"Understanding Status Conditions","anchor":"understanding-status-conditions","text":"Status conditions evaluate the state of an object before executing an action. Common conditions include checking whether a page has been visited, a test has been passed, or a specific variable has reached a threshold value.","level":2,"paragraphs":[{"text":"Status conditions evaluate the state of an object before executing an action.","anchor":"understanding-status-conditions-p0"},{"text":"Common conditions include checking whether a page has been visited, a test has been passed, or a specific variable has reached a threshold value.","anchor":"understanding-status-conditions-p1"}]},{"heading":"Configuring Action Conditions","anchor":"configuring-action-conditions","text":"Add conditions to any action by opening the Action Properties panel. Click Add Condition to define the evaluation criteria. Combine multiple conditions using AND/OR logic. Test your conditions in preview mode to verify correct behavior.","level":2,"paragraphs":[{"text":"Add conditions to any action by opening the Action Properties panel. Click Add Condition to define the evaluation criteria.","anchor":"configuring-action-conditions-p0"},{"text":"Combine multiple conditions using AND/OR logic. Test your conditions in preview mode to verify correct behavior.","anchor":"configuring-action-conditions-p1"}]}],"tags":["actions","conditions","variables","status","branching"],"solved":false,"updatedAt":"2026-02-10"},{"id":"kb-lectora-005","type":"kb","product":"lectora","title":"Trigger: Device Rotation and Variable: Current View","url":"https://knowledgebase.elblearning.com/trigger-device-rotation-and-variable-current-view","body":"Use the Device Rotation trigger and Current View variable in Lectora to create responsive interactions that adapt when a learner rotates their device between portrait and landscape orientations.","sections":[{"heading":"Device Rotation Trigger","anchor":"device-rotation-trigger","text":"The Device Rotation trigger fires automatically when the learner rotates their mobile device or tablet. Attach actions to this trigger to rearrange content, show or hide elements, or change layouts when orientation changes.","level":2,"paragraphs":[{"text":"The Device Rotation trigger fires automatically when the learner rotates their mobile device or tablet.","anchor":"device-rotation-trigger-p0"},{"text":"Attach actions to this trigger to rearrange content, show or hide elements, or change layouts when orientation changes.","anchor":"device-rotation-trigger-p1"}]},{"heading":"Current View Variable","anchor":"current-view-variable","text":"The Current View system variable stores the active responsive view name (Desktop, Tablet, or Mobile). Use this variable in conditions to execute actions only for specific device views. Combine with the Device Rotation trigger for full responsive control.","level":2,"paragraphs":[{"text":"The Current View system variable stores the active responsive view name (Desktop, Tablet, or Mobile).","anchor":"current-view-variable-p0"},{"text":"Use this variable in conditions to execute actions only for specific device views. Combine with the Device Rotation trigger for full responsive control.","anchor":"current-view-variable-p1"}]}],"tags":["trigger","device-rotation","variable","current-view","responsive","mobile"],"solved":false,"updatedAt":"2026-01-30"},{"id":"kb-lectora-006","type":"kb","product":"lectora","title":"Inline Variable Replacement","url":"https://knowledgebase.elblearning.com/inline-variable-replacement","body":"Display dynamic variable values directly within text blocks in Lectora. Use inline variable replacement to personalize content by showing the learner\u0027s name, score, date, or any custom variable value inside text elements.","sections":[{"heading":"Inserting a Variable into Text","anchor":"inserting-variable-into-text","text":"Place your cursor inside a text block where you want the variable value to appear. Go to Insert \u003e Variable Reference or type the variable name wrapped in the designated tokens. At runtime the token is replaced with the current variable value.","level":2,"paragraphs":[{"text":"Place your cursor inside a text block where you want the variable value to appear.","anchor":"inserting-variable-into-text-p0"},{"text":"Go to Insert \u003e Variable Reference or type the variable name wrapped in the designated tokens. At runtime the token is replaced with the current variable value.","anchor":"inserting-variable-into-text-p1"}]},{"heading":"Common Use Cases","anchor":"common-use-cases","text":"Display the learner\u0027s name on a welcome page. Show running quiz scores. Print certificate completion dates. Present personalized feedback based on variable values. All of these use inline variable replacement to dynamically update text.","level":2,"paragraphs":[{"text":"Display the learner\u0027s name on a welcome page. Show running quiz scores. Print certificate completion dates.","anchor":"common-use-cases-p0"},{"text":"Present personalized feedback based on variable values. All of these use inline variable replacement to dynamically update text.","anchor":"common-use-cases-p1"}]}],"tags":["variable","inline","replacement","text","personalization","dynamic"],"solved":false,"updatedAt":"2026-02-08"},{"id":"kb-lectora-007","type":"kb","product":"lectora","title":"Lectora Basics: Using User-Defined Variables","url":"https://knowledgebase.elblearning.com/lectora-basics-using-user-defined-variables","body":"Learn how to create and manage user-defined variables in Lectora. Variables let you store learner data, track progress, control navigation, and build personalized branching scenarios throughout your eLearning course.","sections":[{"heading":"Creating a Variable","anchor":"creating-a-variable","text":"Open the Variable Manager from the Tools menu. Click Add Variable. Choose the variable type: Text, Number, or Boolean. Give it a meaningful name and set an initial value. Variables are available globally across all pages in your title.","level":2,"paragraphs":[{"text":"Open the Variable Manager from the Tools menu. Click Add Variable. Choose the variable type: Text, Number, or Boolean.","anchor":"creating-a-variable-p0"},{"text":"Give it a meaningful name and set an initial value. Variables are available globally across all pages in your title.","anchor":"creating-a-variable-p1"}]},{"heading":"Using Variables in Actions","anchor":"using-variables-in-actions","text":"Modify variable values through actions. Use Set Variable to assign a value, Increment to increase a number, or Toggle to flip a boolean. Combine with conditions to create branching logic: if score \u003e= 80 then show certificate page.","level":2,"paragraphs":[{"text":"Modify variable values through actions. Use Set Variable to assign a value, Increment to increase a number, or Toggle to flip a boolean.","anchor":"using-variables-in-actions-p0"},{"text":"Combine with conditions to create branching logic: if score \u003e= 80 then show certificate page.","anchor":"using-variables-in-actions-p1"}]},{"heading":"Variable Scope and Persistence","anchor":"variable-scope-persistence","text":"User-defined variables persist for the duration of a session. To retain values across sessions, enable SCORM suspend data or use LMS bookmark variables. System variables like AICC_Score and AICC_Lesson_Status are automatically tracked by the LMS.","level":2,"paragraphs":[{"text":"User-defined variables persist for the duration of a session. To retain values across sessions, enable SCORM suspend data or use LMS bookmark variables.","anchor":"variable-scope-persistence-p0"},{"text":"System variables like AICC_Score and AICC_Lesson_Status are automatically tracked by the LMS.","anchor":"variable-scope-persistence-p1"}]}],"tags":["variables","user-defined","actions","branching","lectora-basics"],"solved":false,"updatedAt":"2026-02-12"},{"id":"kb-lectora-008","type":"kb","product":"lectora","title":"Lectora Basics: How to Use the Variable Manager","url":"https://knowledgebase.elblearning.com/lectora-basics-how-to-use-the-variable-manager","body":"The Variable Manager in Lectora provides a centralized interface for creating, editing, and organizing all variables in your title. Access it to review variable types, initial values, and usage throughout your course.","sections":[{"heading":"Accessing the Variable Manager","anchor":"accessing-variable-manager","text":"Open the Variable Manager from Tools \u003e Variable Manager or press Ctrl+Shift+V. The panel lists all variables in your title grouped by type. Filter by name or type to quickly locate specific variables.","level":2,"paragraphs":[{"text":"Open the Variable Manager from Tools \u003e Variable Manager or press Ctrl+Shift+V.","anchor":"accessing-variable-manager-p0"},{"text":"The panel lists all variables in your title grouped by type. Filter by name or type to quickly locate specific variables.","anchor":"accessing-variable-manager-p1"}]},{"heading":"Editing and Organizing Variables","anchor":"editing-organizing-variables","text":"Double-click a variable to edit its name, type, or initial value. Use the search bar to find variables by name. Delete unused variables to keep your project clean. The manager also shows where each variable is referenced, making it easy to track dependencies.","level":2,"paragraphs":[{"text":"Double-click a variable to edit its name, type, or initial value. Use the search bar to find variables by name.","anchor":"editing-organizing-variables-p0"},{"text":"Delete unused variables to keep your project clean. The manager also shows where each variable is referenced, making it easy to track dependencies.","anchor":"editing-organizing-variables-p1"}]}],"tags":["variable-manager","variables","tools","lectora-basics","organization"],"solved":false,"updatedAt":"2026-02-06"},{"id":"kb-lectora-009","type":"kb","product":"lectora","title":"Utilizing Pre-Tests in your Lectora Titles","url":"https://knowledgebase.elblearning.com/utilizing-pre-tests-in-your-lectora-titles","body":"Pre-tests allow you to assess learner knowledge before they begin a course module. Based on pre-test results, Lectora can skip content the learner already knows, creating an adaptive and efficient learning path.","sections":[{"heading":"Creating a Pre-Test","anchor":"creating-a-pre-test","text":"Insert a test at the beginning of your title or chapter. Mark it as a pre-test in the test properties. Add questions that map to specific content sections. Set passing thresholds to determine which sections a learner can skip.","level":2,"paragraphs":[{"text":"Insert a test at the beginning of your title or chapter. Mark it as a pre-test in the test properties.","anchor":"creating-a-pre-test-p0"},{"text":"Add questions that map to specific content sections. Set passing thresholds to determine which sections a learner can skip.","anchor":"creating-a-pre-test-p1"}]},{"heading":"Adaptive Navigation Based on Pre-Test Results","anchor":"adaptive-navigation","text":"Use pre-test score variables in actions and conditions to control navigation. If the learner passes the pre-test for a section, automatically skip that chapter. This creates a personalized learning path that respects existing knowledge.","level":2,"paragraphs":[{"text":"Use pre-test score variables in actions and conditions to control navigation.","anchor":"adaptive-navigation-p0"},{"text":"If the learner passes the pre-test for a section, automatically skip that chapter. This creates a personalized learning path that respects existing knowledge.","anchor":"adaptive-navigation-p1"}]}],"tags":["pre-test","test","assessment","adaptive","navigation","quiz"],"solved":false,"updatedAt":"2026-01-25"},{"id":"kb-lectora-010","type":"kb","product":"lectora","title":"Working with CSV Question Files","url":"https://knowledgebase.elblearning.com/working-with-csv-question-files","body":"Import quiz questions from CSV files into Lectora to speed up test creation. The CSV format supports multiple question types including multiple choice, true/false, matching, and fill-in-the-blank.","sections":[{"heading":"CSV File Format","anchor":"csv-file-format","text":"Structure your CSV with columns for question type, question text, answer options, correct answer, and feedback. Use the provided template to ensure proper formatting. Each row represents one question.","level":2,"paragraphs":[{"text":"Structure your CSV with columns for question type, question text, answer options, correct answer, and feedback.","anchor":"csv-file-format-p0"},{"text":"Use the provided template to ensure proper formatting. Each row represents one question.","anchor":"csv-file-format-p1"}]},{"heading":"Importing Questions","anchor":"importing-questions","text":"Go to File \u003e Import \u003e CSV Questions. Select your CSV file and map columns to question fields. Preview the imported questions before confirming. Lectora creates a test with all questions from the CSV automatically.","level":2,"paragraphs":[{"text":"Go to File \u003e Import \u003e CSV Questions. Select your CSV file and map columns to question fields.","anchor":"importing-questions-p0"},{"text":"Preview the imported questions before confirming. Lectora creates a test with all questions from the CSV automatically.","anchor":"importing-questions-p1"}]}],"tags":["csv","questions","import","test","quiz","assessment"],"solved":false,"updatedAt":"2026-01-20"},{"id":"kb-lectora-011","type":"kb","product":"lectora","title":"Custom Test Results","url":"https://knowledgebase.elblearning.com/custom-test-results","body":"Customize the test results page in Lectora to display personalized feedback, scores, pass/fail messages, and remediation paths based on learner performance.","sections":[{"heading":"Designing Results Pages","anchor":"designing-results-pages","text":"Edit the default test results page or create custom result pages. Display the score using the test score variable. Show pass or fail messages based on the threshold. Add a review button to let learners revisit incorrect answers.","level":2,"paragraphs":[{"text":"Edit the default test results page or create custom result pages. Display the score using the test score variable.","anchor":"designing-results-pages-p0"},{"text":"Show pass or fail messages based on the threshold. Add a review button to let learners revisit incorrect answers.","anchor":"designing-results-pages-p1"}]},{"heading":"Score-Based Branching","anchor":"score-based-branching","text":"Use the test score variable in conditions to create different paths. High scorers can skip remediation. Low scorers are routed to review content. Middle-range learners see targeted supplemental material. This creates a truly adaptive post-test experience.","level":2,"paragraphs":[{"text":"Use the test score variable in conditions to create different paths. High scorers can skip remediation.","anchor":"score-based-branching-p0"},{"text":"Low scorers are routed to review content. Middle-range learners see targeted supplemental material. This creates a truly adaptive post-test experience.","anchor":"score-based-branching-p1"}]}],"tags":["test","results","score","feedback","remediation","quiz"],"solved":false,"updatedAt":"2026-01-18"},{"id":"kb-lectora-012","type":"kb","product":"lectora","title":"Building a Drag and Drop Question with Lectora and Lectora Online","url":"https://knowledgebase.elblearning.com/building-a-drag-and-drop-question","body":"Create interactive drag and drop questions in Lectora to assess learner understanding through hands-on interactions. Drag and drop questions engage learners by requiring them to match, sort, or place items correctly.","sections":[{"heading":"Setting Up Drag Sources and Drop Targets","anchor":"drag-sources-drop-targets","text":"Insert objects as drag sources (items the learner drags) and drop targets (areas where items are placed). Assign correct pairings in the question properties. Each drag source can accept one or multiple correct targets.","level":2,"paragraphs":[{"text":"Insert objects as drag sources (items the learner drags) and drop targets (areas where items are placed).","anchor":"drag-sources-drop-targets-p0"},{"text":"Assign correct pairings in the question properties. Each drag source can accept one or multiple correct targets.","anchor":"drag-sources-drop-targets-p1"}]},{"heading":"Feedback and Scoring","anchor":"feedback-scoring","text":"Configure correct and incorrect feedback for each pairing. Set point values for accurate placements. Enable snap-to-target so items align perfectly when dropped. Add attempts limits and retry options for additional practice.","level":2,"paragraphs":[{"text":"Configure correct and incorrect feedback for each pairing. Set point values for accurate placements.","anchor":"feedback-scoring-p0"},{"text":"Enable snap-to-target so items align perfectly when dropped. Add attempts limits and retry options for additional practice.","anchor":"feedback-scoring-p1"}]}],"tags":["drag-and-drop","question","interaction","quiz","assessment"],"solved":false,"updatedAt":"2026-01-22"},{"id":"kb-lectora-013","type":"kb","product":"lectora","title":"Creating Randomized Tests in Lectora and Lectora Online","url":"https://knowledgebase.elblearning.com/creating-randomized-tests","body":"Randomize test questions in Lectora to prevent memorization and ensure assessment integrity. Configure question pools, random selection counts, and answer shuffling for a unique test experience each time.","sections":[{"heading":"Question Pools and Randomization","anchor":"question-pools-randomization","text":"Create a question pool by adding more questions than the test will display. Set the number of questions to randomly select from the pool. Each learner receives a unique subset. Answers within each question can also be shuffled.","level":2,"paragraphs":[{"text":"Create a question pool by adding more questions than the test will display. Set the number of questions to randomly select from the pool.","anchor":"question-pools-randomization-p0"},{"text":"Each learner receives a unique subset. Answers within each question can also be shuffled.","anchor":"question-pools-randomization-p1"}]}],"tags":["randomized","test","quiz","question-pool","assessment","shuffle"],"solved":false,"updatedAt":"2026-01-16"},{"id":"kb-lectora-014","type":"kb","product":"lectora","title":"Adding Web Windows in Lectora and Lectora Online","url":"https://knowledgebase.elblearning.com/adding-web-windows-in-lectora","body":"Embed external web content directly inside your Lectora course using Web Windows. Display live websites, web applications, Google Maps, embedded videos, or any URL-based content within a course page.","sections":[{"heading":"Inserting a Web Window","anchor":"inserting-web-window","text":"Go to Insert \u003e Web Window. Enter the target URL or embed code. Resize and position the web window on your page. The content loads live at runtime, so learners see the latest version of the external resource.","level":2,"paragraphs":[{"text":"Go to Insert \u003e Web Window. Enter the target URL or embed code.","anchor":"inserting-web-window-p0"},{"text":"Resize and position the web window on your page. The content loads live at runtime, so learners see the latest version of the external resource.","anchor":"inserting-web-window-p1"}]}],"tags":["web-window","embed","iframe","external-content","html"],"solved":false,"updatedAt":"2026-01-14"},{"id":"kb-lectora-015","type":"kb","product":"lectora","title":"Web Objects in Lectora and Lectora Online","url":"https://knowledgebase.elblearning.com/web-objects-in-lectora","body":"Use Web Objects to embed custom HTML, CSS, and JavaScript directly into your Lectora course. Web Objects give you full control to create custom interactions, integrate third-party widgets, and extend Lectora functionality.","sections":[{"heading":"Creating a Web Object","anchor":"creating-web-object","text":"Go to Insert \u003e Web Object. Provide an HTML folder or a single HTML file. The web object renders inside an iframe on the page. Use the Lectora JavaScript API to communicate between the web object and the parent course for tracking and variable exchange.","level":2,"paragraphs":[{"text":"Go to Insert \u003e Web Object. Provide an HTML folder or a single HTML file. The web object renders inside an iframe on the page.","anchor":"creating-web-object-p0"},{"text":"Use the Lectora JavaScript API to communicate between the web object and the parent course for tracking and variable exchange.","anchor":"creating-web-object-p1"}]}],"tags":["web-object","html","javascript","custom","embed","api"],"solved":false,"updatedAt":"2026-01-12"},{"id":"kb-lectora-016","type":"kb","product":"lectora","title":"How to Insert Custom HTML Into Lectora","url":"https://knowledgebase.elblearning.com/how-to-insert-custom-html-into-lectora","body":"Insert custom HTML snippets into Lectora to add specialized content such as embedded forms, interactive widgets, analytics tracking codes, or custom styled elements that go beyond built-in Lectora objects.","sections":[{"heading":"Adding Custom HTML","anchor":"adding-custom-html","text":"Use the HTML Extension object to inject raw HTML into a page. Go to Insert \u003e HTML Extension. Paste your HTML code in the editor. The code is rendered inline alongside other Lectora objects on the page.","level":2,"paragraphs":[{"text":"Use the HTML Extension object to inject raw HTML into a page. Go to Insert \u003e HTML Extension.","anchor":"adding-custom-html-p0"},{"text":"Paste your HTML code in the editor. The code is rendered inline alongside other Lectora objects on the page.","anchor":"adding-custom-html-p1"}]},{"heading":"Best Practices","anchor":"best-practices","text":"Keep custom HTML lightweight to avoid performance issues. Test in all target browsers. Avoid conflicting CSS styles with Lectora\u0027s built-in styles. Use external files for complex JavaScript to keep the HTML snippet clean.","level":2,"paragraphs":[{"text":"Keep custom HTML lightweight to avoid performance issues. Test in all target browsers.","anchor":"best-practices-p0"},{"text":"Avoid conflicting CSS styles with Lectora\u0027s built-in styles. Use external files for complex JavaScript to keep the HTML snippet clean.","anchor":"best-practices-p1"}]}],"tags":["html","custom","extension","embed","code","widget"],"solved":false,"updatedAt":"2026-01-10"},{"id":"comm-general-002","type":"community","product":"general","title":"The Brain Science Behind a Psychologically Safe Learning Environment","url":"https://community.elblearning.com/topics/the-brain-science-behind-a-psychologically-safe-learning-environment-f4449466?hsLang=en","body":"Explore the neuroscience of psychological safety in learning. Understand how the brain processes threat versus reward in training scenarios and why creating a safe environment leads to better retention, engagement, and knowledge transfer.","tags":["learning","psychology","brain-science","safety","retention","engagement"],"solved":false,"accepted":false,"replies":0,"views":156,"updatedAt":"2023-01-27"},{"id":"comm-general-003","type":"community","product":"general","title":"ELB Learning Wins Top Content Providers for Team building Training 2023","url":"https://community.elblearning.com/topics/elb-learning-wins-top-content-providers-for-team-building-training-2023-4cdd2750?hsLang=en","body":"ELB Learning has been recognized as a Top Content Provider for Team Building Training in 2023. This award highlights our commitment to creating collaborative, engaging, and impactful team-building learning experiences for organizations.","tags":["elb-learning","awards","team-building","training","content-providers","2023"],"solved":false,"accepted":false,"replies":0,"views":112,"updatedAt":"2022-11-21"},{"id":"comm-general-004","type":"community","product":"general","title":"6 Tips to Transform Performance \u0026 Boost ROI with Video","url":"https://community.elblearning.com/topics/join-don-schmidt-to-learn-6-tips-to-transform-performance-ampamp-boost-roi-with-video-fd947f18?hsLang=en","body":"Learn six practical tips for using video to transform employee performance and boost training ROI. Topics include video-based learning strategies, measuring video engagement, integrating video into existing training programs, and maximizing the impact of your video content investment.","tags":["video","roi","performance","training","tips","engagement","media"],"solved":false,"accepted":false,"replies":1,"views":89,"updatedAt":"2023-01-11"},{"id":"comm-general-005","type":"community","product":"general","title":"ELB Learning Wins Bronze Excellence in E-Learning Award in the 2022 Learning in Practice Awards","url":"https://community.elblearning.com/topics/elb-learning-wins-bronze-excellence-in-elearning-award-in-the-2022-learning-in-practice-awards-8425d159?hsLang=en","body":"ELB Learning has received the Bronze Excellence in E-Learning Award at the 2022 Learning in Practice Awards. This recognition celebrates our innovative eLearning solutions and commitment to advancing the learning technology industry.","tags":["elb-learning","awards","excellence","elearning","recognition","2022"],"solved":false,"accepted":false,"replies":0,"views":74,"updatedAt":"2022-11-08"},{"id":"comm-general-006","type":"community","product":"general","title":"ELB Learning wins Top Blended Learning Content Providers for 2023","url":"https://community.elblearning.com/topics/elb-learning-wins-top-blended-learning-content-providers-for-2023-a22d5d06?hsLang=en","body":"ELB Learning is recognized as a Top Blended Learning Content Provider for 2023. Blended learning combines online digital media with traditional classroom methods, and ELB Learning\u0027s suite of tools supports both synchronous and asynchronous learning experiences.","tags":["elb-learning","awards","blended-learning","content-providers","2023"],"solved":false,"accepted":false,"replies":0,"views":67,"updatedAt":"2022-10-31"},{"id":"comm-general-007","type":"community","product":"general","title":"Recently Released eBooks and Infographics | February 2026","url":"https://community.elblearning.com/topics/recently-released-ebooks-and-infographics-february-2026-ml7z2c9r?hsLang=en","body":"Check out the latest eBooks and infographics released by ELB Learning. These resources cover topics including eLearning best practices, instructional design strategies, gamification in training, VR learning, and microlearning trends for 2026.","tags":["ebooks","infographics","resources","elearning","instructional-design","2026"],"solved":false,"accepted":false,"replies":0,"views":45,"updatedAt":"2026-02-04"},{"id":"comm-general-008","type":"community","product":"general","title":"Upcoming Webinars \u0026 Events | February 2026","url":"https://community.elblearning.com/topics/upcoming-webinars-and-events-february-2026-ml7ypecs?hsLang=en","body":"Join upcoming webinars and events hosted by ELB Learning. Topics include authoring tips for Lectora, immersive VR experiences with CenarioVR, gamification strategies with The Training Arcade, and LMS best practices with Rockstar Learning Platform.","tags":["webinars","events","training","lectora","cenariovr","gamification","arcade","training-arcade","2026"],"solved":false,"accepted":false,"replies":0,"views":38,"updatedAt":"2026-02-04"},{"id":"comm-general-009","type":"community","product":"general","title":"Summary of Recent Blog Posts | January 2026","url":"https://community.elblearning.com/topics/summary-of-recent-blog-posts-january-2026-ml7ywtf1?hsLang=en","body":"A roundup of recent blog posts from ELB Learning covering topics such as AI in eLearning, accessibility compliance, SCORM vs xAPI, mobile learning design, video-based training, and content authoring tips for Lectora and MicroBuilder.","tags":["blog","summary","ai","accessibility","scorm","xapi","mobile-learning","2026"],"solved":false,"accepted":false,"replies":0,"views":52,"updatedAt":"2026-02-04"},{"id":"comm-general-010","type":"community","product":"general","title":"Summary of Recent Blog Posts | December 2025","url":"https://community.elblearning.com/topics/summary-of-recent-blog-posts-december-2025-mk2jy77r?hsLang=en","body":"Catch up on the latest blog posts from December 2025. Topics include year-in-review for eLearning trends, new features in Lectora Online, CenarioVR updates, and how organizations are leveraging The Training Arcade for employee engagement.","tags":["blog","summary","elearning","trends","lectora-online","cenariovr","arcade","training-arcade","2025"],"solved":false,"accepted":false,"replies":0,"views":61,"updatedAt":"2026-01-06"},{"id":"comm-general-011","type":"community","product":"general","title":"Upcoming Webinars \u0026 Events | January 2026","url":"https://community.elblearning.com/topics/upcoming-webinars-and-events-january-2026-mk2jrlvb?hsLang=en","body":"Don\u0027t miss upcoming webinars and live events in January 2026. Sessions cover Lectora advanced techniques, CenarioVR immersive scenario building, ReviewLink collaboration workflows, and CourseMill LMS administration tips.","tags":["webinars","events","lectora","cenariovr","reviewlink","coursemill","2026"],"solved":false,"accepted":false,"replies":0,"views":43,"updatedAt":"2026-01-06"},{"id":"comm-coursemill-001","type":"community","product":"coursemill","title":"CourseMill LMS Tips: Managing Large User Groups","url":"https://community.elblearning.com/topics?category=coursemill\u0026hsLang=en","body":"Best practices for managing large user groups in CourseMill. Tips on bulk CSV imports, department-based assignments, automated enrollment rules, and efficient reporting for organizations with thousands of learners.","tags":["coursemill","lms","users","groups","management","tips"],"solved":true,"accepted":true,"solutionText":"Use the Department Auto-Assign feature in CourseMill Admin \u003e Settings \u003e Enrollment Rules. Create rules that automatically enroll users into courses based on their department or role. Combined with CSV bulk import, this handles thousands of users efficiently.","replies":12,"views":234,"updatedAt":"2026-02-10"},{"id":"comm-coursemill-002","type":"community","product":"coursemill","title":"Getting Started with CourseMill: Common Setup Questions","url":"https://community.elblearning.com/topics?category=coursemill\u0026hsLang=en","body":"A collection of frequently asked questions about getting started with CourseMill LMS. Covers initial configuration, SSO setup, SCORM upload troubleshooting, and dashboard customization for new administrators.","tags":["coursemill","getting-started","setup","faq","lms","admin"],"solved":true,"accepted":true,"solutionText":"For initial CourseMill setup: 1) Log into admin console 2) Go to Settings \u003e Organization to set branding 3) Configure authentication under Settings \u003e SSO 4) Upload courses via Content \u003e Add Course 5) Create user groups under Users \u003e Groups. The Getting Started with CourseMill KB article covers each step in detail.","replies":8,"views":189,"updatedAt":"2026-02-15"},{"id":"kb-lectora-017","type":"kb","product":"lectora","title":"Branching Scenarios Made Easy With Lectora Online","url":"https://knowledgebase.elblearning.com/branching-scenarios-made-easy-with-lectora-online","body":"Create engaging branching scenarios in Lectora Online. Design decision-based learning paths where learners choose their own route through content. Configure branching logic with variables and actions.","sections":[{"heading":"Setting Up Branching Logic","anchor":"setting-up-branching-logic","text":"Create decision points where learners choose between options. Each choice leads to a different content path. Use variables to track decisions and actions to navigate between branches.","level":2,"paragraphs":[{"text":"Create decision points where learners choose between options. Each choice leads to a different content path.","anchor":"setting-up-branching-logic-p0"},{"text":"Use variables to track decisions and actions to navigate between branches.","anchor":"setting-up-branching-logic-p1"}]}],"tags":["lectora","branching","scenarios","interactive"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-018","type":"kb","product":"lectora","title":"Creating Software Simulations in Lectora and Lectora Online","url":"https://knowledgebase.elblearning.com/creating-software-simulations-in-lectora-and-lectora-online","body":"Build software simulations in Lectora to train users on application workflows. Capture screenshots, add interactive hotspots, and create guided walkthroughs.","sections":[{"heading":"Capturing and Setting Up Screens","anchor":"capturing-setting-up-screens","text":"Import screenshots of the application you\u0027re training on. Add clickable hotspots over interface elements. Create step-by-step guides that mirror the actual software workflow.","level":2,"paragraphs":[{"text":"Import screenshots of the application you\u0027re training on. Add clickable hotspots over interface elements.","anchor":"capturing-setting-up-screens-p0"},{"text":"Create step-by-step guides that mirror the actual software workflow.","anchor":"capturing-setting-up-screens-p1"}]}],"tags":["lectora","simulation","software-training","interactive"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-019","type":"kb","product":"lectora","title":"Converting a Classroom Video Quick Win Tutorial","url":"https://knowledgebase.elblearning.com/converting-a-classroom-video-quick-win-tutorial","body":"Quick tutorial on converting classroom video content into interactive eLearning with Lectora. Transform recorded training sessions into engaging digital courses.","tags":["lectora","video","tutorial","conversion","quick-win"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-020","type":"kb","product":"lectora","title":"Getting Started with Tests Quick Win Tutorial","url":"https://knowledgebase.elblearning.com/getting-started-with-tests-quick-win-tutorial","body":"Quick tutorial for creating tests and assessments in Lectora. Learn the basics of adding questions, setting pass scores, and providing feedback.","tags":["lectora","quiz","test","tutorial","quick-win","assessment"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-021","type":"kb","product":"lectora","title":"Adding Style \u0026 Interactivity Quick Win Tutorial","url":"https://knowledgebase.elblearning.com/adding-style-interactivity-quick-win-tutorial","body":"Quick tutorial on enhancing your Lectora courses with visual styles and interactive elements. Add animations, transitions, hover effects, and clickable interactions.","tags":["lectora","interactivity","style","tutorial","quick-win"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-022","type":"kb","product":"lectora","title":"Getting Started in Lectora Online Quick Win Tutorial","url":"https://knowledgebase.elblearning.com/getting-started-in-lectora-online-quick-win-tutorial","body":"Quick tutorial for getting started with Lectora Online. Learn the workspace, create your first page, add content, and preview your course.","tags":["lectora","getting-started","tutorial","quick-win","lectora-online"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-023","type":"kb","product":"lectora","title":"Configuring the Image Editor Icon on the Tools Menu in Lectora Desktop","url":"https://knowledgebase.elblearning.com/configuring-the-image-icon-on-the-tools-menu-in-lectora-desktop","body":"Configure the image editor shortcut on the Lectora Desktop Tools menu. Set your preferred image editing application for quick access.","tags":["lectora","image","tools","configuration","lectora-desktop"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-024","type":"kb","product":"lectora","title":"Responsive Course Design (RCD) in Lectora Online","url":"https://knowledgebase.elblearning.com/introduction-to-responsive-course-design-rcd-in-lectora-online","body":"Introduction to Responsive Course Design in Lectora Online. Learn how RCD automatically adjusts content layout for desktop, tablet, and mobile views.","tags":["lectora","responsive","rcd","mobile","lectora-online"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-025","type":"kb","product":"lectora","title":"Publishing (SCORM, AICC, HTML)","url":"https://knowledgebase.elblearning.com/19.-publishing-scorm-aicc-html","body":"Comprehensive guide to publishing options in Lectora. Choose between SCORM 1.2, SCORM 2004, AICC, xAPI, and HTML5 output formats for your LMS.","tags":["lectora","publish","scorm","aicc","html"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-026","type":"kb","product":"lectora","title":"Work Modes in Lectora","url":"https://knowledgebase.elblearning.com/18.-work-modes","body":"Learn about different work modes in Lectora Online including Edit Mode, Preview Mode, and collaboration features for team-based course development.","tags":["lectora","work-modes","collaboration"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-027","type":"kb","product":"lectora","title":"Test and Questions in Lectora","url":"https://knowledgebase.elblearning.com/17.-test-and-questions","body":"Create tests and quiz questions in Lectora. Add multiple choice, true/false, matching, fill-in-the-blank, drag-and-drop, and short answer question types.","tags":["lectora","quiz","test","assessment","questions"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-028","type":"kb","product":"lectora","title":"Variables in Lectora","url":"https://knowledgebase.elblearning.com/16.-variables","body":"Learn about variables in Lectora. Store and manipulate learner data using text, number, and boolean variables to create dynamic, personalized courses.","tags":["lectora","variable","variables"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-029","type":"kb","product":"lectora","title":"Menu, Status Indicators, Progress Bar in Lectora","url":"https://knowledgebase.elblearning.com/15.-menu-status-indicators-progress-bar","body":"Configure the course menu, status indicators, and progress bars in Lectora to give learners clear navigation and progress tracking.","tags":["lectora","menu","progress","navigation"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-030","type":"kb","product":"lectora","title":"Media Library in Lectora","url":"https://knowledgebase.elblearning.com/14.-media-library","body":"Access and manage the media library in Lectora Online. Browse stock images, icons, characters, and templates. Upload your own media assets.","tags":["lectora","media","library","assets"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-031","type":"kb","product":"lectora","title":"Actions in Lectora","url":"https://knowledgebase.elblearning.com/13.-actions","body":"Master actions in Lectora to add interactivity. Configure triggers, conditions, and responses to create dynamic course behavior.","tags":["lectora","action","actions","interactive"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-032","type":"kb","product":"lectora","title":"Buttons in Lectora","url":"https://knowledgebase.elblearning.com/12.-buttons","body":"Create and customize buttons in Lectora. Set button states (normal, hover, active, disabled), add actions, and style with colors and images.","tags":["lectora","buttons","interactive","ui"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-033","type":"kb","product":"lectora","title":"Shapes and Lines in Lectora","url":"https://knowledgebase.elblearning.com/11.-shapes-and-lines","body":"Add shapes, lines, and geometric elements to your Lectora courses. Customize colors, borders, shadows, and use shapes as interactive containers.","tags":["lectora","shapes","design"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-034","type":"kb","product":"lectora","title":"Audio and Video in Lectora","url":"https://knowledgebase.elblearning.com/10.-audio-and-video","body":"Add audio and video to your Lectora courses. Support for MP3, MP4, WAV, and streaming formats. Configure autoplay, controls, and synchronized events.","tags":["lectora","video","audio","media"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-035","type":"kb","product":"lectora","title":"Characters in Lectora","url":"https://knowledgebase.elblearning.com/9.-characters","body":"Use character images in your Lectora courses to add a human element. Browse the character library, customize poses, and create engaging narrator-guided experiences.","tags":["lectora","characters","media","design"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-036","type":"kb","product":"lectora","title":"Images in Lectora","url":"https://knowledgebase.elblearning.com/8.-images","body":"Work with images in Lectora. Insert, resize, crop, and apply effects to images. Support for JPG, PNG, GIF, and SVG formats.","tags":["lectora","image","media"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-037","type":"kb","product":"lectora","title":"Table of Contents in Lectora","url":"https://knowledgebase.elblearning.com/7.-table-of-contents","body":"Configure the table of contents and course menu in Lectora. Set page titles, nesting, visibility, and learner navigation options.","tags":["lectora","navigation","menu","toc"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-038","type":"kb","product":"lectora","title":"Text and Links in Lectora","url":"https://knowledgebase.elblearning.com/6.-text-and-links","body":"Add and format text blocks in Lectora. Create hyperlinks to pages, URLs, or actions. Apply styles, fonts, and accessibility settings to text elements.","tags":["lectora","text","links","formatting"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-039","type":"kb","product":"lectora","title":"Chapters, Sections and Pages in Lectora","url":"https://knowledgebase.elblearning.com/5.-chapters-sections-and-pages","body":"Organize your Lectora course with chapters, sections, and pages. Configure hierarchy, navigation flow, and structural elements for well-organized courses.","tags":["lectora","structure","navigation"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-040","type":"kb","product":"lectora","title":"Design Ribbon in Lectora","url":"https://knowledgebase.elblearning.com/4.-designing-your-title","body":"Use the Design Ribbon in Lectora to customize the visual appearance of your course. Set backgrounds, colors, fonts, and global design properties.","tags":["lectora","design","ui","ribbon"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-041","type":"kb","product":"lectora","title":"Inheritance in Lectora","url":"https://knowledgebase.elblearning.com/3.4","body":"Understand object inheritance in Lectora. Objects placed on parent elements (like chapters) automatically appear on child elements (pages), allowing reuse of common elements.","tags":["lectora","inheritance","structure"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-042","type":"kb","product":"lectora","title":"Modular Development (ModDev) in Lectora","url":"https://knowledgebase.elblearning.com/moddev","body":"Use Modular Development in Lectora to build courses efficiently. Choose frameworks, themes, style packs, and page templates for rapid course assembly.","sections":[{"heading":"Course Frameworks","anchor":"course-frameworks","text":"Select a pre-built course framework that provides navigation, menu structure, and page layouts. Frameworks handle the structural foundation so you focus on content.","level":2},{"heading":"Themes and Style Packs","anchor":"themes-style-packs","text":"Apply visual themes and style packs to change colors, fonts, and design elements across your entire course at once.","level":2}],"tags":["lectora","modular","framework","template"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-043","type":"kb","product":"lectora","title":"Custom Fonts in Lectora Desktop","url":"https://knowledgebase.elblearning.com/custom-fonts-in-lectora-desktop","body":"Add custom fonts to Lectora Desktop courses. Include web fonts or embed font files for consistent typography across devices.","tags":["lectora","fonts","design","lectora-desktop"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-044","type":"kb","product":"lectora","title":"Setting Completion Variables in Lectora for SCORM","url":"https://knowledgebase.elblearning.com/setting-completion-variables-in-lectora-for-scorm-1.2-and-scorm-2004-published-courses","body":"Configure SCORM completion variables in Lectora to properly report course status to your LMS. Set completion criteria, pass/fail thresholds, and bookmark data.","sections":[{"heading":"SCORM 1.2 Completion","anchor":"scorm-12-completion","text":"Use the AICC_Lesson_Status variable to report completion. Set it to \u0027completed\u0027 or \u0027passed\u0027 when the learner meets your criteria.","level":2},{"heading":"SCORM 2004 Completion","anchor":"scorm-2004-completion","text":"SCORM 2004 separates completion from success. Use cmi.completion_status and cmi.success_status for granular tracking.","level":2}],"tags":["lectora","scorm","publish","lms","variable"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-045","type":"kb","product":"lectora","title":"Migrating to Lectora Online from Lectora Desktop","url":"https://knowledgebase.elblearning.com/migrating-to-lectora-online-from-lectora-desktop","body":"Guide to migrating your courses from Lectora Desktop to Lectora Online. Export, import, and adjust settings for the cloud-based authoring environment.","tags":["lectora","migration","lectora-online","lectora-desktop"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-046","type":"kb","product":"lectora","title":"Best Practices for Responsive Course Design (RCD)","url":"https://knowledgebase.elblearning.com/best-practices-for-responsive-course-design-rcd","body":"Best practices for creating responsive courses in Lectora. Design tips for optimal rendering on desktop, tablet, and mobile screens.","tags":["lectora","responsive","rcd","mobile","best-practices"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-047","type":"kb","product":"lectora","title":"How to Convert Flash Content in Lectora Titles","url":"https://knowledgebase.elblearning.com/how-to-convert-flash-content-in-your-lectora-titles","body":"Convert legacy Flash content in Lectora titles to modern HTML5 format. Remove Flash dependencies and update interactions for current browsers.","tags":["lectora","flash","html","conversion"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-048","type":"kb","product":"lectora","title":"SCORM 101 and a Lectora How-To","url":"https://knowledgebase.elblearning.com/scorm-101-and-a-lectora-how-to","body":"Learn SCORM fundamentals and how to publish SCORM-compliant courses in Lectora. Covers SCORM 1.2 and SCORM 2004 standards, tracking, and LMS integration.","sections":[{"heading":"What is SCORM?","anchor":"what-is-scorm","text":"SCORM (Sharable Content Object Reference Model) is a standard for eLearning interoperability. It defines how course content communicates with an LMS for tracking completion, scores, and bookmarking.","level":2},{"heading":"Publishing SCORM in Lectora","anchor":"publishing-scorm-lectora","text":"Select File \u003e Publish and choose SCORM 1.2 or SCORM 2004. Configure the manifest metadata, test identifiers, and tracking variables before publishing.","level":2}],"tags":["lectora","scorm","lms","getting-started"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-049","type":"kb","product":"lectora","title":"Using Templates in Lectora","url":"https://knowledgebase.elblearning.com/using-templates","body":"Browse and apply templates in Lectora for rapid course creation. Customize pre-built page layouts, interactions, and design elements.","tags":["lectora","template","layout","design"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-050","type":"kb","product":"lectora","title":"SCORM: The Basics and Beyond","url":"https://knowledgebase.elblearning.com/scorm-the-basics-and-beyond","body":"Deep dive into SCORM standards and advanced implementation in Lectora. Covers manifest files, SCO structure, API calls, and debugging LMS communication.","tags":["lectora","scorm","lms","advanced"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-051","type":"kb","product":"lectora","title":"Lectora Basics: Why Disinheritance Could Save Your eLearning","url":"https://knowledgebase.elblearning.com/lectora-basics-why-disinheritance-could-save-your-elearning","body":"Learn when and how to use disinheritance in Lectora to prevent inherited objects from appearing on specific pages. Essential for complex course structures.","tags":["lectora","inheritance","structure","lectora-basics"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-052","type":"kb","product":"lectora","title":"Grouping Objects and Actions in Lectora","url":"https://knowledgebase.elblearning.com/grouping-objects-and-actions-in-lectora-and-lectora-online","body":"Group objects and actions in Lectora for efficient course organization. Move, copy, and manage grouped elements as a single unit.","tags":["lectora","grouping","organization"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-053","type":"kb","product":"lectora","title":"PowerPoint Import Pre-flight Checklist","url":"https://knowledgebase.elblearning.com/powerpoint-import-pre-flight-checklist","body":"Checklist to prepare your PowerPoint presentation for import into Lectora. Ensure formatting, animations, and content transfer correctly.","tags":["lectora","powerpoint","import","checklist"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-054","type":"kb","product":"lectora","title":"Using Text Styles in Lectora","url":"https://knowledgebase.elblearning.com/using-text-styles-in-lectora-and-lectora-online","body":"Create and apply text styles in Lectora for consistent formatting across your course. Define styles for headings, body text, captions, and more.","tags":["lectora","text","styles","formatting"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-055","type":"kb","product":"lectora","title":"Lectora Online and Desktop: Superior SVG Image Support","url":"https://knowledgebase.elblearning.com/elevate-your-elearning-with-svg-support-in-lectora","body":"Use SVG images in Lectora for crisp, scalable graphics on any device. SVG support enables resolution-independent icons, illustrations, and diagrams.","tags":["lectora","svg","image","responsive"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-056","type":"kb","product":"lectora","title":"Customize Button States in Lectora","url":"https://knowledgebase.elblearning.com/customize-button-states-in-lectora-and-lectora-online","body":"Customize button states in Lectora: Normal, Hover, Down, and Disabled states. Create visually engaging buttons with state-specific styling.","tags":["lectora","buttons","interactive","ui","design"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-057","type":"kb","product":"lectora","title":"Lectora Basics: What Is a Variable","url":"https://knowledgebase.elblearning.com/lectora-basics-what-is-a-variable","body":"Introduction to variables in Lectora. Understand what variables are, their types (Text, Number, Boolean), and how they enable dynamic course behavior.","tags":["lectora","variable","lectora-basics","getting-started"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-058","type":"kb","product":"lectora","title":"Lectora Basics: About Question Variables","url":"https://knowledgebase.elblearning.com/lectora-basics-about-question-variables","body":"Learn about auto-created question variables in Lectora. Each test question generates variables for the answer, score, attempts, and status.","tags":["lectora","variable","quiz","questions","lectora-basics"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-059","type":"kb","product":"lectora","title":"How to Synchronize Events in Lectora","url":"https://knowledgebase.elblearning.com/how-to-synchronize-events-in-lectora-and-lectora-online-1","body":"Synchronize events in Lectora to coordinate animations, audio, video, and actions. Create timeline-based interactions with precise timing control.","tags":["lectora","synchronize","events","timeline","animation"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-060","type":"kb","product":"lectora","title":"Publish to SCORM or HTML","url":"https://knowledgebase.elblearning.com/publish-to-scorm-or-html","body":"Step-by-step guide to publishing Lectora courses as SCORM packages or standalone HTML. Configure output settings, test locally, and upload to your LMS.","tags":["lectora","publish","scorm","html"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-061","type":"kb","product":"lectora","title":"How To Resolve LMSSetValue errors in a SCORM Course","url":"https://knowledgebase.elblearning.com/how-to-resolve-lmssetvalue-errors-in-a-scorm-course","body":"Troubleshoot and resolve LMSSetValue errors in SCORM courses published from Lectora. Common causes include incorrect data types and exceeding field limits.","tags":["lectora","scorm","lms","troubleshooting","error"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-062","type":"kb","product":"lectora","title":"Lectora Publishing to Docebo","url":"https://knowledgebase.elblearning.com/lectora-publishing-to-docebo","body":"Configure Lectora publishing settings for Docebo LMS. Ensure proper SCORM compliance and tracking for courses deployed on the Docebo platform.","tags":["lectora","publish","docebo","lms"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-063","type":"kb","product":"lectora","title":"How to Export Your Title for Sharing","url":"https://knowledgebase.elblearning.com/how-to-export-your-title-for-sharing","body":"Export Lectora titles for sharing with other Lectora users. Create AWT packages that preserve all course elements for import into another Lectora installation.","tags":["lectora","export","sharing"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-064","type":"kb","product":"lectora","title":"Scale Published Content","url":"https://knowledgebase.elblearning.com/scale-published-content","body":"Configure scaling options for published Lectora courses. Ensure content displays correctly at various browser window sizes and resolutions.","tags":["lectora","publish","scaling","responsive"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-065","type":"kb","product":"lectora","title":"Accessibility: How to Order Title Objects in Lectora","url":"https://knowledgebase.elblearning.com/accessibility-how-to-order-title-objects-in-lectora","body":"Set the reading order of objects in Lectora for screen reader accessibility. Proper tab order ensures assistive technology users can navigate content logically.","tags":["lectora","accessibility","wcag"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-066","type":"kb","product":"lectora","title":"Tips and Tricks for Developing a 508 / WCAG Compliant Course","url":"https://knowledgebase.elblearning.com/tips-and-tricks-for-developing-a-508-/-wcag-compliant-course","body":"Best practices for creating Section 508 and WCAG compliant eLearning courses in Lectora. Covers alt text, color contrast, keyboard navigation, and ARIA attributes.","tags":["lectora","accessibility","wcag","508","compliance"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-067","type":"kb","product":"lectora","title":"How to Use Lectora to Create Accessible Courses","url":"https://knowledgebase.elblearning.com/how-to-use-lectora-to-create-accessible-courses","body":"Step-by-step guide to creating accessible eLearning courses with Lectora. Use built-in accessibility tools, testing features, and publishing settings.","tags":["lectora","accessibility","getting-started"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-068","type":"kb","product":"lectora","title":"Lectora Online Collaboration Features Training Plan","url":"https://knowledgebase.elblearning.com/lectora-online-collaboration-features-training-plan-everything-you-need-to-know","body":"Master collaboration features in Lectora Online. Share titles, assign tasks, track reviews, and work simultaneously with team members on course projects.","tags":["lectora","collaboration","lectora-online","teamwork"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-069","type":"kb","product":"lectora","title":"Containing Your Containers: Custom JavaScript Suggestions for Lectora Online","url":"https://knowledgebase.elblearning.com/containing-your-containers-custom-javascript-suggestions-for-lectora-online","body":"Best practices for using custom JavaScript in Lectora Online. Avoid scope conflicts, manage container elements, and integrate external libraries safely.","tags":["lectora","javascript","programming","advanced"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-070","type":"kb","product":"lectora","title":"How Can I Manipulate Lectora User Variables in JavaScript?","url":"https://knowledgebase.elblearning.com/how-can-i-use-user-variables-in-javascript","body":"Access and modify Lectora user variables from JavaScript. Use the Lectora JavaScript API to read, set, and manipulate variable values programmatically.","tags":["lectora","javascript","variable","programming","api"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-071","type":"kb","product":"lectora","title":"Extending Your Lectora Project with JavaScript and CSS","url":"https://knowledgebase.elblearning.com/extending-your-lectora-project-with-javascript-and-css","body":"Add custom JavaScript and CSS to extend Lectora course functionality. Inject scripts, style elements, and create custom interactions beyond built-in features.","tags":["lectora","javascript","css","programming","advanced"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-072","type":"kb","product":"lectora","title":"Utilizing Generative AI Features in Lectora Online","url":"https://knowledgebase.elblearning.com/utilizing-generative-ai-features-in-lectora","body":"Use Lectora Online\u0027s generative AI features to accelerate course creation. AI-powered text generation, content suggestions, and automated question creation.","tags":["lectora","ai","generative","lectora-online"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-073","type":"kb","product":"lectora","title":"Lectora System Requirements","url":"https://knowledgebase.elblearning.com/lectora-system-requirements","body":"System requirements for installing and running Lectora Desktop and Lectora Online. Covers supported operating systems, browsers, hardware, and network requirements.","tags":["lectora","system-requirements","installation"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-074","type":"kb","product":"lectora","title":"How Lectora License Keys and Activation Work","url":"https://knowledgebase.elblearning.com/how-lectora-license-keys-and-activation-work","body":"Understand Lectora licensing and activation. Covers license types, activation process, deactivation, and transferring licenses between computers.","tags":["lectora","license","activation"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-075","type":"kb","product":"lectora","title":"The Guide to Translation in Lectora","url":"https://knowledgebase.elblearning.com/the-guide-to-translation-in-lectora-and-lectora-online","body":"Export and import translations in Lectora for multilingual course delivery. Use the translation workflow to create courses in multiple languages.","tags":["lectora","translation","localization","multilingual"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-lectora-076","type":"kb","product":"lectora","title":"Lectora Desktop Version 21 Release Notes","url":"https://knowledgebase.elblearning.com/lectora-desktop-version-21-release-notes","body":"Release notes for Lectora Desktop version 21. New features, improvements, and bug fixes for the latest Lectora Desktop release.","tags":["lectora","release-notes","lectora-desktop"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-cenariovr-002","type":"kb","product":"cenariovr","title":"Resources: CenarioVR","url":"https://knowledgebase.elblearning.com/cenariovr-resources","body":"CenarioVR resource library with tutorials, guides, templates, and best practices for creating immersive VR learning experiences.","tags":["cenariovr","vr","resources"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-cenariovr-003","type":"kb","product":"cenariovr","title":"Best Practices: For Creating 360 Degree Video","url":"https://knowledgebase.elblearning.com/best-practices-for-creating-360-degree-video","body":"Best practices for capturing and producing 360-degree video for VR learning. Covers camera selection, filming techniques, stitching, and optimization.","tags":["cenariovr","vr","360","video","best-practices"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-cenariovr-004","type":"kb","product":"cenariovr","title":"Quick Guide: Navigating CenarioVR\u0027s Dashboard","url":"https://knowledgebase.elblearning.com/navigating-cenariovrs-dashboard","body":"Navigate the CenarioVR dashboard to manage projects, access templates, configure settings, and publish VR experiences.","tags":["cenariovr","vr","dashboard","getting-started"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-cenariovr-005","type":"kb","product":"cenariovr","title":"CenarioVR Release Notes","url":"https://knowledgebase.elblearning.com/release-notes-for-all-software?hsLang=en","body":"Stay up to date with CenarioVR platform updates. Release notes cover new VR authoring features, scene editor improvements, publishing updates, and bug fixes.","tags":["cenariovr","vr","release-notes"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-training-arcade-002","type":"kb","product":"training-arcade","title":"Resources: Game Overview Videos","url":"https://knowledgebase.elblearning.com/game-videos","body":"Watch overview videos for each Training Arcade game template. See how trivia, memory match, word search, and other game types work.","tags":["training-arcade","game","video","resources"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-training-arcade-003","type":"kb","product":"training-arcade","title":"How to Add Video, Audio, and Advanced Feedback to Training Games","url":"https://knowledgebase.elblearning.com/how-to-add-video-audio-and-advanced-feedback-to-your-training-games","body":"Enhance Training Arcade games with video, audio, and advanced feedback. Add multimedia content to questions, answers, and feedback screens.","tags":["training-arcade","game","video","audio","feedback"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-training-arcade-004","type":"kb","product":"training-arcade","title":"How do I add Training Arcade games to my LMS?","url":"https://knowledgebase.elblearning.com/how-do-i-add-the-training-arcade-games-to-my-lms","body":"Step-by-step guide to adding Training Arcade games to your LMS. Export SCORM packages, configure tracking, and deploy games for learners.","tags":["training-arcade","game","lms","scorm","publish"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-microbuilder-002","type":"kb","product":"microbuilder","title":"Questions and Quizzes in MicroBuilder","url":"https://knowledgebase.elblearning.com/creating-questions-and-quizzes-in-microbuilder","body":"Create questions and quizzes in MicroBuilder. Add multiple choice, true/false, and open-ended questions to your microlearning modules.","tags":["microbuilder","quiz","questions","microlearning"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-microbuilder-003","type":"kb","product":"microbuilder","title":"AI-assisted Content Generation in MicroBuilder","url":"https://knowledgebase.elblearning.com/ai-assisted-content-generation-in-microbuilder","body":"Use MicroBuilder\u0027s AI assistant to generate learning content from topics or existing text. Create structured modules with auto-generated questions and summaries.","tags":["microbuilder","ai","content-creation","microlearning"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-microbuilder-004","type":"kb","product":"microbuilder","title":"Publish Your Microlearning Module in MicroBuilder","url":"https://knowledgebase.elblearning.com/publish-your-microlearning-module-in-microbuilder","body":"Publish microlearning modules from MicroBuilder as web links, SCORM packages, or embed codes. Share via email, LMS, or direct URL.","tags":["microbuilder","publish","microlearning","scorm"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-rockstar-002","type":"kb","product":"rockstar","title":"Rockstar Learning Platform Domain Permissions","url":"https://knowledgebase.elblearning.com/rockstar-learning-platform-domains-to-whitelist","body":"Domain allowlist for the Rockstar Learning Platform. Configure your firewall and email filters to allow these domains for proper platform operation.","tags":["rockstar","lms","configuration","security"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-rockstar-003","type":"kb","product":"rockstar","title":"Rockstar Learning Platform Feature Requests","url":"https://knowledgebase.elblearning.com/rockstar-learning-platform-feature-requests","body":"Submit and vote on feature requests for the Rockstar Learning Platform. Help shape the future roadmap of the LMS.","tags":["rockstar","lms","feature-request","feedback"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-rockstar-004","type":"kb","product":"rockstar","title":"Navigating the User Module Page","url":"https://knowledgebase.elblearning.com/module-page","body":"Navigate the module page in Rockstar Learning Platform. Access course content, track progress, view grades, and manage your learning path.","tags":["rockstar","lms","navigation","module"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-rockstar-005","type":"kb","product":"rockstar","title":"Rockstar Learning Platform Release Notes","url":"https://knowledgebase.elblearning.com/release-notes","body":"Track all updates to the Rockstar Learning Platform. Release notes document new LMS features, admin panel improvements, and integration updates.","tags":["rockstar","lms","release-notes"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-rehearsal-001","type":"kb","product":"rehearsal","title":"Camera Missing or Not Working with Rehearsal","url":"https://knowledgebase.elblearning.com/camera-missing-or-not-working-with-rehearsal","body":"Troubleshoot camera issues in Rehearsal. Fix camera detection problems, permission errors, and browser compatibility issues.","tags":["rehearsal","troubleshooting","camera"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-rehearsal-002","type":"kb","product":"rehearsal","title":"Rehearsal Administration","url":"https://knowledgebase.elblearning.com/rehearsal-platform-administration","body":"Manage the Rehearsal platform as an administrator. Configure assignments, review settings, user roles, and analytics dashboards.","tags":["rehearsal","admin","management"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-rehearsal-003","type":"kb","product":"rehearsal","title":"Rehearsal Mentoring","url":"https://knowledgebase.elblearning.com/rehearsal-mentoring","body":"Use Rehearsal\u0027s mentoring features to provide feedback on video practice submissions. Review, annotate, and score learner recordings.","tags":["rehearsal","mentoring","feedback","video"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-rehearsal-004","type":"kb","product":"rehearsal","title":"Rehearsal Welcome Page / Getting Started","url":"https://knowledgebase.elblearning.com/rehearsal-knowledge-base","body":"Welcome to the Rehearsal knowledge base. Get started with video-based coaching and practice for soft skills development.","tags":["rehearsal","getting-started"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-reviewlink-002","type":"kb","product":"reviewlink","title":"ReviewLink Release Notes","url":"https://knowledgebase.elblearning.com/reviewlink-release-notes","body":"Track ReviewLink platform updates. Release notes cover new review features, markup tools, notification improvements, and collaboration enhancements.","tags":["reviewlink","release-notes"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-reviewlink-003","type":"kb","product":"reviewlink","title":"ReviewLink Markup","url":"https://knowledgebase.elblearning.com/reviewlink-markup-1","body":"Use ReviewLink markup tools to annotate eLearning content. Add text notes, arrows, highlights, shapes, and stamps directly on content pages.","tags":["reviewlink","markup","annotation","review"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-reviewlink-004","type":"kb","product":"reviewlink","title":"ReviewLink Training Plan","url":"https://knowledgebase.elblearning.com/reviewlink-training-plan-everything-you-need-to-know","body":"Complete training plan for ReviewLink. Covers uploading content, inviting reviewers, managing review cycles, and resolving feedback.","tags":["reviewlink","getting-started","training-plan"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-coursemill-004","type":"kb","product":"coursemill","title":"Customizing the NSUI (New Student User Interface)","url":"https://knowledgebase.elblearning.com/customizing-the-nsui-new-student-user-interface","body":"Customize the CourseMill New Student User Interface (NSUI). Modify branding, colors, logos, and layout for the learner-facing portal.","tags":["coursemill","lms","ui","customization"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-coursemill-005","type":"kb","product":"coursemill","title":"The Compliance Manager in CourseMill","url":"https://knowledgebase.elblearning.com/the-compliance-manager","body":"Use CourseMill\u0027s Compliance Manager to track mandatory training requirements. Set deadlines, monitor completion rates, and generate compliance reports.","tags":["coursemill","lms","compliance","reporting"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-coursemill-006","type":"kb","product":"coursemill","title":"CourseMill: Assigning Students to a Reporter","url":"https://knowledgebase.elblearning.com/coursemill-assigning-students-to-a-reporter","body":"Assign students to reporters in CourseMill for structured reporting hierarchies. Configure manager-learner relationships for progress tracking.","tags":["coursemill","lms","reporting","user-management"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-coursemill-007","type":"kb","product":"coursemill","title":"CourseMill Release Notes","url":"https://knowledgebase.elblearning.com/release-notes-for-all-software?hsLang=en","body":"View all CourseMill LMS updates and version history. Release notes cover admin panel improvements, learner experience updates, and API changes.","tags":["coursemill","lms","release-notes"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-studio-001","type":"kb","product":"studio","title":"The Studio Account Portal FAQs","url":"https://knowledgebase.elblearning.com/account-portal-faqs","body":"Frequently asked questions about The Learning Creation Studio account portal. Covers login, billing, permissions, and product access.","tags":["studio","faq","account"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-studio-002","type":"kb","product":"studio","title":"The Studio - Account Settings","url":"https://knowledgebase.elblearning.com/account-settings-1","body":"Manage your Learning Creation Studio account settings. Update profile, billing, team members, and product subscriptions.","tags":["studio","account","settings"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-studio-003","type":"kb","product":"studio","title":"The Studio User Guide","url":"https://knowledgebase.elblearning.com/user-guide","body":"User guide for The Learning Creation Studio. Navigate the unified platform for accessing Lectora Online, CenarioVR, MicroBuilder, and other ELB Learning tools.","tags":["studio","getting-started","user-guide"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-studio-004","type":"kb","product":"studio","title":"The Studio Account Portal - Start Here","url":"https://knowledgebase.elblearning.com/account-portal-start-here","body":"Getting started with The Learning Creation Studio account portal. Create your account, access products, and manage your workspace.","tags":["studio","getting-started","account"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-general-006","type":"kb","product":"general","title":"Release Notes for all Software","url":"https://knowledgebase.elblearning.com/release-notes-for-all-software","body":"Central hub for release notes across all ELB Learning products. Links to individual product release notes for Lectora, CenarioVR, CourseMill, Rockstar, ReviewLink, and more.","tags":["general","release-notes"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-general-007","type":"kb","product":"general","title":"Responsive Course Design in Action: What You Need to Know","url":"https://knowledgebase.elblearning.com/responsive-course-design-in-action-what-you-need-to-know","body":"Overview of responsive course design principles and how they apply across ELB Learning products. Learn how content adapts to different screen sizes.","tags":["general","responsive","rcd"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-general-008","type":"kb","product":"general","title":"Art \u0026 Science of E-Learning","url":"https://knowledgebase.elblearning.com/art-science-of-e-learning","body":"Explore the intersection of instructional design art and learning science. Best practices for creating engaging, effective eLearning content.","tags":["general","elearning","instructional-design","best-practices"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-general-009","type":"kb","product":"asset-libraries","title":"FAQs - Account Management and Asset Library","url":"https://knowledgebase.elblearning.com/faqs-account-management-and-asset-library?hsLang=en","body":"FAQs for ELB Learning asset library and account management. Covers licensing, downloading assets, compatibility, subscription questions, account setup, password reset, billing, and user permissions.","sections":[{"heading":"Account Management FAQs","text":"Account creation, login, password reset, user roles, permissions, billing, subscription management."},{"heading":"Asset Library FAQs","text":"Downloading assets, asset compatibility, licensing, stock library access, image library, audio library, template library."}],"tags":["asset-libraries","faq","account","billing","subscription"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-general-010","type":"kb","product":"asset-libraries","title":"Stock Audio Library Topics","url":"https://knowledgebase.elblearning.com/stock-library-landing-page","body":"Stock Audio Library Topics for ELB Learning. Browse audio categories: filtering options, searching with keywords, implementing audio into courseware, audio downloading, pricing, and capabilities. Part of the ELB Learning stock asset library.","sections":[{"heading":"Stock Audio Library Categories","text":"Filtering Options. Searching with Key Words. Implementing Audio into Courseware. Audio Downloading. Pricing. Capabilities."}],"tags":["asset-libraries","stock","audio","library","courseware"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-asset-libraries-stock-asset-topics","type":"kb","product":"asset-libraries","title":"Best Practices: Stock Asset Library Topics","url":"https://knowledgebase.elblearning.com/stock-asset-library-landing-page","body":"Stock Asset Library Topics for ELB Learning. Please pick from the following categories. Filtering Options, searching with keywords, implementing assets into courseware, downloading, pricing, and capabilities. Browse the stock asset library for images, icons, characters, templates, interactions, audio, and more.","sections":[{"heading":"Stock Asset Library Topics","text":"Please pick from the following categories. Filtering Options. Searching with Keywords. Implementing Assets into Courseware. Downloading. Pricing. Capabilities."},{"heading":"Filtering Options","text":"Filter and browse stock assets by category, type, keyword, and format to find the right resources for your eLearning projects."},{"heading":"Asset Downloads and Pricing","text":"Download stock assets including images, icons, characters, templates, interactions, and audio. Pricing details and subscription options."}],"tags":["asset-libraries","stock","asset","library","topics","best-practices","images","icons","templates"],"solved":false,"updatedAt":"2026-03-02"},{"id":"kb-general-011","type":"kb","product":"asset-libraries","title":"Stock Asset Library","url":"https://knowledgebase.elblearning.com/asset-libraries?hsLang=en","body":"ELB Learning Asset Libraries. Access the stock asset library with thousands of images, icons, characters, templates, interactions, and audio for your eLearning projects. Includes stock audio library, stock image library, and template library.","tags":["asset-libraries","stock","images","templates","audio","library"],"solved":false,"updatedAt":"2026-03-02"},{"id":"comm-general-012","type":"community","product":"general","title":"Summary of Recent Blog Posts | November 2025","url":"https://community.elblearning.com/topics/summary-of-recent-blog-posts-november-2025-mj7g8mxn?hsLang=en","body":"A roundup of recent blog posts from November 2025. Topics include learning trends, product updates, and instructional design strategies.","tags":["general","blog","summary","2025","announcements"],"solved":false,"accepted":false,"replies":0,"views":0,"updatedAt":"2025-11-30"},{"id":"comm-general-013","type":"community","product":"general","title":"Upcoming Webinars \u0026 Events | December 2025","url":"https://community.elblearning.com/topics/upcoming-webinars-and-events-december-2025-mj7g5owr?hsLang=en","body":"Upcoming webinars and events from ELB Learning in December 2025. Sessions on Lectora, CenarioVR, and eLearning best practices.","tags":["general","webinars","events","2025","announcements"],"solved":false,"accepted":false,"replies":0,"views":0,"updatedAt":"2025-12-01"},{"id":"comm-general-014","type":"community","product":"general","title":"Summary of Recent Blog Posts | October 2025","url":"https://community.elblearning.com/topics/summary-of-recent-blog-posts-october-2025-mj7fwt9r?hsLang=en","body":"Blog post roundup from October 2025 covering AI in learning, compliance training, and mobile-first design.","tags":["general","blog","summary","2025","announcements"],"solved":false,"accepted":false,"replies":0,"views":0,"updatedAt":"2025-10-31"},{"id":"comm-general-015","type":"community","product":"general","title":"Upcoming Webinars \u0026 Events | November 2025","url":"https://community.elblearning.com/topics/upcoming-webinars-and-events-november-2025-mj7ftrfu?hsLang=en","body":"November 2025 webinars and events from ELB Learning.","tags":["general","webinars","events","2025","announcements"],"solved":false,"accepted":false,"replies":0,"views":0,"updatedAt":"2025-11-01"},{"id":"comm-general-016","type":"community","product":"general","title":"Recently Released eBooks and Infographics | October 2025","url":"https://community.elblearning.com/topics/recently-released-ebooks-and-infographics-october-2025-mj7fofkh?hsLang=en","body":"Latest eBooks and infographics from ELB Learning covering eLearning trends, VR training, and gamification strategies.","tags":["general","ebooks","infographics","resources","2025","announcements"],"solved":false,"accepted":false,"replies":0,"views":0,"updatedAt":"2025-10-31"},{"id":"kb-asset-libraries-release-notes","type":"kb","product":"asset-libraries","title":"Asset Libraries Release Notes","url":"https://knowledgebase.elblearning.com/release-notes-for-all-software?hsLang=en","body":"Release notes for ELB Learning Asset Libraries. Updates to stock asset library, stock audio library, stock image library, and template library. Includes new content additions, bug fixes, and compatibility updates.","sections":[{"heading":"Stock Audio Library Updates","text":"New audio tracks, improved search, filtering updates, and audio format compatibility improvements."},{"heading":"Stock Image Library Updates","text":"New images, icons, characters, and illustrations added. Improved search and categorization."},{"heading":"Template Library Updates","text":"New templates, updated designs, and compatibility with latest Lectora and MicroBuilder versions."}],"tags":["asset-libraries","release-notes","stock","audio","images","templates"],"solved":false,"updatedAt":"2026-03-01"},{"id":"kb-lectora-release-notes","type":"kb","product":"lectora","title":"Lectora Release Notes","url":"https://knowledgebase.elblearning.com/lectora-desktop-release-notes","body":"Release notes for Lectora Desktop and Lectora Online. Includes new features, bug fixes, performance improvements, and compatibility updates for each version.","sections":[{"heading":"Latest Version Updates","text":"New features, UI improvements, and publishing enhancements for Lectora Desktop and Online."},{"heading":"Bug Fixes","text":"Resolved issues with course publishing, variable behavior, responsive design rendering, and SCORM tracking."}],"tags":["lectora","release-notes","updates","desktop","online"],"solved":false,"updatedAt":"2026-02-28"},{"id":"kb-cenariovr-release-notes","type":"kb","product":"cenariovr","title":"CenarioVR Release Notes","url":"https://knowledgebase.elblearning.com/release-notes-for-all-software?hsLang=en","body":"Release notes for CenarioVR. Updates include new VR features, 360-degree video improvements, headset compatibility updates, and bug fixes.","sections":[{"heading":"VR Features","text":"New immersive interaction types, improved 360 video quality settings, and headset compatibility updates."},{"heading":"Bug Fixes and Performance","text":"Resolved rendering issues, improved load times, and fixed compatibility with latest VR headsets."}],"tags":["cenariovr","release-notes","vr","360","updates"],"solved":false,"updatedAt":"2026-02-28"},{"id":"kb-rockstar-release-notes","type":"kb","product":"rockstar","title":"Rockstar Learning Platform Release Notes","url":"https://knowledgebase.elblearning.com/release-notes","body":"Release notes for the Rockstar Learning Platform. Includes module updates, user management improvements, reporting enhancements, and bug fixes.","sections":[{"heading":"Platform Updates","text":"New module features, improved user interface, enhanced reporting dashboards, and administration tools."},{"heading":"Bug Fixes","text":"Resolved enrollment issues, fixed reporting discrepancies, and improved SSO integration stability."}],"tags":["rockstar","release-notes","platform","lms","updates"],"solved":false,"updatedAt":"2026-02-28"},{"id":"kb-rehearsal-release-notes","type":"kb","product":"rehearsal","title":"Rehearsal Release Notes","url":"https://knowledgebase.elblearning.com/rehearsal-release-notes","body":"Release notes for Rehearsal. Includes video coaching updates, mentoring improvements, administration enhancements, and bug fixes.","sections":[{"heading":"Coaching Features","text":"Improved video recording quality, new feedback tools, and enhanced mentoring workflows."},{"heading":"Administration Updates","text":"New reporting options, user management improvements, and integration updates."}],"tags":["rehearsal","release-notes","coaching","video","updates"],"solved":false,"updatedAt":"2026-02-28"},{"id":"kb-coursemill-release-notes","type":"kb","product":"coursemill","title":"CourseMill Release Notes","url":"https://knowledgebase.elblearning.com/release-notes-for-all-software?hsLang=en","body":"Release notes for CourseMill LMS. Includes student UI updates, administrator improvements, compliance manager enhancements, SCORM tracking fixes, and integration updates.","sections":[{"heading":"Student UI Updates","text":"New student user interface improvements, course catalog enhancements, and mobile responsiveness updates."},{"heading":"Administrator Features","text":"Enhanced reporting, improved enrollment management, compliance tracking updates, and user permission fixes."}],"tags":["coursemill","release-notes","lms","scorm","updates"],"solved":false,"updatedAt":"2026-02-28"},{"id":"kb-reviewlink-release-notes","type":"kb","product":"reviewlink","title":"ReviewLink Release Notes","url":"https://knowledgebase.elblearning.com/reviewlink-release-notes","body":"Release notes for ReviewLink. Includes markup tool improvements, collaboration updates, review workflow enhancements, and bug fixes.","sections":[{"heading":"Markup Improvements","text":"New annotation tools, improved markup precision, and enhanced collaboration features."},{"heading":"Workflow Updates","text":"Streamlined review process, notification improvements, and sharing permission updates."}],"tags":["reviewlink","release-notes","markup","review","updates"],"solved":false,"updatedAt":"2026-02-28"},{"id":"kb-general-release-notes-all","type":"kb","product":"general","title":"Release Notes for All Software","url":"https://knowledgebase.elblearning.com/release-notes-for-all-software?hsLang=en","body":"Central hub for all ELB Learning software release notes. Find the latest updates for Lectora, CenarioVR, Training Arcade, MicroBuilder, Rockstar Learning Platform, Rehearsal, CourseMill, ReviewLink, Learning Creation Studio, and Asset Libraries.","sections":[{"heading":"Product Release Notes","text":"Lectora Release Notes. CenarioVR Release Notes. Training Arcade Release Notes. MicroBuilder Release Notes. Rockstar Learning Platform Release Notes. Rehearsal Release Notes. CourseMill Release Notes. ReviewLink Release Notes. Learning Creation Studio Release Notes."}],"tags":["general","release-notes","all-products","updates","changelog"],"solved":false,"updatedAt":"2026-03-01"},{"id":"kb-off-shelf-001","type":"kb","product":"off-the-shelf","title":"Off-the-Shelf Training: Hear From the Experts","url":"https://knowledgebase.elblearning.com/off-the-shelf-training?hsLang=en","body":"Getting started with Off-the-Shelf Training from ELB Learning. Expert-created courseware covering compliance, safety, HR, leadership, and professional development topics.","sections":[{"heading":"Courseware Categories","text":"Compliance training, workplace safety, HR fundamentals, leadership development, and professional skills."}],"tags":["off-the-shelf","courseware","compliance","training","experts"],"solved":false,"updatedAt":"2026-02-15"},{"id":"kb-off-shelf-002","type":"kb","product":"off-the-shelf","title":"Off-the-Shelf Courseware Offerings","url":"https://knowledgebase.elblearning.com/courseware-pricing","body":"Browse all available off-the-shelf courseware offerings from ELB Learning. Includes compliance courses, safety training, HR content, and leadership development modules.","sections":[{"heading":"Available Courses","text":"Full catalog of ready-made courseware including compliance, safety, HR, leadership, and soft skills training."}],"tags":["off-the-shelf","courseware","catalog","compliance","offerings"],"solved":false,"updatedAt":"2026-02-15"},{"id":"kb-off-shelf-003","type":"kb","product":"off-the-shelf","title":"Off-the-Shelf Courseware Customizations","url":"https://knowledgebase.elblearning.com/customizations?hsLang=en","body":"How to customize off-the-shelf courseware from ELB Learning. Add your branding, modify content, and tailor courses to your organization\u0027s needs.","sections":[{"heading":"Customization Options","text":"Branding, content modification, logo placement, color schemes, and organization-specific tailoring."}],"tags":["off-the-shelf","courseware","customization","branding"],"solved":false,"updatedAt":"2026-02-15"},{"id":"comm-asset-libraries-001","type":"community","product":"asset-libraries","title":"Tips on Using Stock Assets in Your Courses","url":"https://community.elblearning.com/topics?category=additional-learning-products\u0026hsLang=en","body":"Community discussion about using stock assets from ELB Learning\u0027s asset library in eLearning courses. Tips on finding the right images, audio, and templates.","tags":["asset-libraries","stock","tips","community"],"solved":false,"accepted":false,"replies":0,"views":0,"updatedAt":"2026-01-15"},{"id":"comm-off-shelf-001","type":"community","product":"off-the-shelf","title":"Off-the-Shelf Training Implementation Discussion","url":"https://community.elblearning.com/topics?category=additional-learning-products\u0026hsLang=en","body":"Community discussion about implementing and customizing off-the-shelf training content from ELB Learning.","tags":["off-the-shelf","courseware","implementation","community"],"solved":false,"accepted":false,"replies":0,"views":0,"updatedAt":"2026-01-15"}]};

  /* =================== DEBUG MODE (Rule 9) =================== */

  function debugLog(category, data) {
    if (!window.elbHelpBotDebug) return;
    try {
      console.groupCollapsed('[ELB-ASSISTANT-DEBUG] ' + category);
      if (typeof data === 'object') console.log(JSON.parse(JSON.stringify(data)));
      else console.log(data);
      console.groupEnd();
    } catch (e) {
      console.log('[ELB-ASSISTANT-DEBUG] ' + category, data);
    }
  }

  /* =================== AUTO-DISCOVERY (v3.9) =================== */

  function detectScriptBaseUrl() {
    try {
      var scripts = document.querySelectorAll('script[src]');
      for (var i = scripts.length - 1; i >= 0; i--) {
        var src = scripts[i].getAttribute('src') || '';
        if (src.indexOf('elb-help-bot') !== -1 && src.indexOf('config') === -1 && src.indexOf('include') === -1) {
          var idx = src.lastIndexOf('/');
          return idx >= 0 ? src.substring(0, idx + 1) : './';
        }
      }
    } catch (e) { /* fallback */ }
    return null;
  }

  function buildCandidateIndexUrls(base) {
    var candidates = [];
    if (base) {
      candidates.push(base + 'content-index.json');
      candidates.push(base + 'elb-help-bot-index.json');
      if (base.length > 1 && base.charAt(base.length - 1) === '/') {
        var parent = base.substring(0, base.length - 1);
        var pi = parent.lastIndexOf('/');
        if (pi >= 0) {
          candidates.push(parent.substring(0, pi + 1) + 'content-index.json');
          candidates.push(parent.substring(0, pi + 1) + 'elb-help-bot-index.json');
        }
      }
    }
    candidates.push('./content-index.json');
    candidates.push('./elb-help-bot-index.json');
    candidates.push('../content-index.json');
    candidates.push('../elb-help-bot-index.json');
    candidates.push('/content-index.json');
    candidates.push('/elb-help-bot-index.json');
    return candidates;
  }

  function probeIndexUrl(candidates, cb) {
    var tried = 0;
    function tryNext() {
      if (tried >= candidates.length) { cb(null); return; }
      var url = candidates[tried++];
      var xhr = new XMLHttpRequest();
      xhr.timeout = 3000;
      xhr.onload = function () {
        try {
          var data = JSON.parse(xhr.responseText);
          if (data && data.articles && Array.isArray(data.articles)) { cb(url, data); return; }
        } catch (e) { /* bad JSON, try next */ }
        tryNext();
      };
      xhr.onerror = function () { tryNext(); };
      xhr.ontimeout = function () { tryNext(); };
      try { xhr.open('GET', url); xhr.send(); } catch (e) { tryNext(); }
    }
    tryNext();
  }

  /* =================== VALIDATION ENGINE (Rules 2, 3, 8) =================== */

  var GENERIC_PORTAL_PATHS = ['kb', 'knowledge-base', 'knowledgebase', 'community', 'forum',
    'forums', 'topics', 'support', 'help', 'home', 'index'];

  function normalizeContentUrl(url, articleType) {
    if (!url || typeof url !== 'string') return url;
    var cleaned = url.trim().replace(/\s+/g, ' ');
    try {
      var parsed = new URL(cleaned);
      var path = parsed.pathname || '';
      var t = (articleType || '').toLowerCase();
      if (t === 'community') {
        var m = path.match(/^\/topics\/([^\/?#]+)/i);
        if (m && m[1]) {
          var slug = decodeURIComponent(m[1])
            .toLowerCase()
            .replace(/[_\s]+/g, '-')
            .replace(/[^a-z0-9-]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');
          if (slug) path = '/topics/' + slug;
        }
      } else {
        path = path.replace(/\s+/g, '-');
      }
      parsed.pathname = path;
      return parsed.toString();
    } catch (e) {
      return cleaned.replace(/\s+/g, '-');
    }
  }

  var COMMUNITY_CATEGORY_SLUGS = [
    'lectora', 'cenariovr', 'the-training-arcade', 'microbuilder',
    'rockstar-learning-platform', 'rehearsal', 'coursemill', 'reviewlink',
    'additional-learning-products', 'all-things-elearning', 'elb-learning-content',
    'announcements', 'awards-badges', 'social-lounge', 'feedback-suggestions',
    'archived-topics', 'ai-services'
  ];

  function isValidCommunityUrl(url) {
    if (!url || typeof url !== 'string') return false;
    try {
      var parsed = new URL(url);
      var host = parsed.hostname || '';
      if (host.indexOf('community.elblearning.com') === -1) return true;
      var path = parsed.pathname || '';
      var search = parsed.search || '';
      if (path === '/topics' && search.indexOf('category=') >= 0) return true;
      if (path === '/topics/create') return true;
      var topicMatch = path.match(/^\/topics\/(.+)/);
      if (!topicMatch) return false;
      var slug = topicMatch[1].replace(/\/$/, '');
      if (COMMUNITY_CATEGORY_SLUGS.indexOf(slug.toLowerCase()) >= 0) return false;
      if (slug.length < 8) return false;
      return true;
    } catch (e) {
      return url.indexOf('/topics/') >= 0 && url.length > 50;
    }
  }

  function hasContentIdentifier(url) {
    if (!url || typeof url !== 'string') return false;
    var path = url.replace(/https?:\/\/[^\/]+/, '').replace(/\?.*$/, '').replace(/#.*$/, '');
    if (/\s/.test(path)) return false;
    var segments = path.split('/').filter(function (s) { return s.length > 0; });
    if (segments.length === 0) return false;
    if (segments.length === 1) {
      return GENERIC_PORTAL_PATHS.indexOf(segments[0].toLowerCase()) === -1;
    }
    return true;
  }

  function isStructurallyValidResult(r) {
    if (!r || !r.article) {
      debugLog('VALIDATE-REJECT', { reason: 'Missing result or article object' });
      return false;
    }
    var a = r.article;
    if (a.url) a.url = normalizeContentUrl(a.url, a.type);
    if (!a.url || !hasContentIdentifier(a.url)) {
      debugLog('VALIDATE-REJECT', { id: a.id, url: a.url, reason: 'URL missing content identifier' });
      return false;
    }
    if ((a.type || '').toLowerCase() === 'community' && !isValidCommunityUrl(a.url)) {
      debugLog('VALIDATE-REJECT', { id: a.id, url: a.url, reason: 'Invalid community URL (likely 404)' });
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
    return true;
  }

  function validateResult(r) {
    if (!isStructurallyValidResult(r)) return false;
    var a = r.article;
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
    else if (!hasContentIdentifier(normalizeContentUrl(article.url, article.type))) errors.push('url lacks content identifier');
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
           (weights.titleExact || 100) * 1.5 +
           (weights.titleExact || 100) * 0.4;
  }

  /* =================== SYNONYM ENGINE =================== */

  var DEFAULT_SYNONYMS = {
    publish:['export','deploy','release','output','generate'],error:['bug','issue','problem','crash','failure','broken','fault'],
    install:['setup','configure','download','deploy','installation'],create:['build','make','add','new','generate','author'],
    delete:['remove','erase','clear','destroy','trash'],edit:['modify','change','update','alter','revise'],
    login:['signin','sign-in','authenticate','logon','access','sso'],user:['student','learner','participant','member','account','enrollee'],
    course:['module','lesson','training','content','curriculum','program'],quiz:['test','assessment','exam','evaluation','question','survey'],
    score:['grade','mark','result','points','rating','percentage'],report:['analytics','statistics','data','metrics','dashboard','tracking'],
    lms:['learning management system','platform','system'],rlp:['rockstar','rockstar learning platform','knowledgelink'],
    scorm:['xapi','tincan','cmi5','aicc','standard','package'],
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
    navigate:['browse','explore','find','locate','search'],help:['support','assist','guide','documentation','faq'],
    release:['update','version','changelog','patch','upgrade'],notes:['changelog','updates','log','history','changes'],
    'release-notes':['changelog','updates','versions','what-is-new','whats-new']
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

  function escapeRegex(text) {
    return String(text || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function hasWholeWord(text, term) {
    if (!text || !term) return false;
    var re = new RegExp('(^|[^a-z0-9])' + escapeRegex(term.toLowerCase()) + '([^a-z0-9]|$)', 'i');
    return re.test(text.toLowerCase());
  }

  function countWholeWordMatches(text, term) {
    if (!text || !term) return 0;
    var re = new RegExp('(^|[^a-z0-9])(' + escapeRegex(term.toLowerCase()) + ')(?=[^a-z0-9]|$)', 'ig');
    var m = text.toLowerCase().match(re);
    return m ? m.length : 0;
  }

  function hasDerivativeWord(text, term) {
    if (!text || !term) return false;
    var t = term.toLowerCase();
    var reSuffix = new RegExp('(^|[^a-z0-9])' + escapeRegex(t) + '[a-z0-9]+([^a-z0-9]|$)', 'i');
    var reCompound = new RegExp('(^|[^a-z0-9])[a-z0-9]+' + escapeRegex(t) + '[a-z0-9]*([^a-z0-9]|$)', 'i');
    return reSuffix.test(text.toLowerCase()) || reCompound.test(text.toLowerCase());
  }

  function hasWholePhrase(text, phrase) {
    if (!text || !phrase) return false;
    var normalizedPhrase = escapeRegex(phrase.toLowerCase().trim()).replace(/\s+/g, '\\s+');
    var re = new RegExp('(^|[^a-z0-9])' + normalizedPhrase + '([^a-z0-9]|$)', 'i');
    return re.test(text.toLowerCase());
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
    if (t === q) return { match: true, distance: 0, type: 'exact' };
    if (t.indexOf(q) >= 0 || q.indexOf(t) >= 0) return { match: true, distance: 0, type: 'contained' };
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
    if (_ACRONYM_MAP[lower]) return null;
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
      if (isKnownAcronym(kw)) return;
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
    var qk = query.toLowerCase().trim();
    if (rl.queryClicks && rl.queryClicks[qk] && rl.queryClicks[qk][articleId]) {
      boost += Math.min(rl.queryClicks[qk][articleId] * 5, 25);
    }
    return boost;
  }

  /* =================== AUTO-SYNONYM LEARNING (from RL data) =================== */

  function getLearnedSynonyms(keywords, queryProduct, queryDetectedProduct) {
    if (queryDetectedProduct) return [];
    var rl = getRlData();
    if (!rl.queryClicks) return [];
    var currentProductNames = queryProduct ? [queryProduct] : [];
    ALLOWED_PRODUCTS.forEach(function (p) {
      keywords.forEach(function (kw) {
        if (kw.toLowerCase() === p || kw.toLowerCase().replace(/-/g, '') === p.replace(/-/g, '')) {
          if (currentProductNames.indexOf(p) === -1) currentProductNames.push(p);
        }
      });
    });
    var clickedArticles = {};
    keywords.forEach(function (kw) {
      var kwl = kw.toLowerCase();
      Object.keys(rl.queryClicks).forEach(function (pastQuery) {
        if (pastQuery.indexOf(kwl) >= 0) {
          var pastProduct = detectProductFromQuery(pastQuery);
          if (currentProductNames.length > 0 && pastProduct && currentProductNames.indexOf(pastProduct) === -1) return;
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
      if (currentProductNames.length > 0) {
        var pastProd = detectProductFromQuery(pastQuery);
        if (pastProd && currentProductNames.indexOf(pastProd) === -1) return;
      }
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
    var expanded = expandAcronyms(query);
    var q = expanded.toLowerCase();
    for (var i = 0; i < INTENT_PATTERNS.length; i++) {
      if (INTENT_PATTERNS[i].pattern.test(q)) return { id: INTENT_PATTERNS[i].id, label: INTENT_PATTERNS[i].label };
    }
    var rawQ = query.toLowerCase();
    for (var j = 0; j < INTENT_PATTERNS.length; j++) {
      if (INTENT_PATTERNS[j].pattern.test(rawQ)) return { id: INTENT_PATTERNS[j].id, label: INTENT_PATTERNS[j].label };
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

  function ensureCanonicalArticles(data) {
    if (!data || !Array.isArray(data.articles)) return data;
    var ids = {};
    data.articles.forEach(function (a) { if (a && a.id) ids[a.id] = true; });
    function addIfMissing(article) {
      if (!article || !article.id || ids[article.id]) return;
      data.articles.unshift(article);
      ids[article.id] = true;
    }
    if (!ids['kb-microbuilder-release-notes-base-language']) {
      addIfMissing({
        id: 'kb-microbuilder-release-notes-base-language',
        type: 'kb',
        product: 'microbuilder',
        title: 'MicroBuilder Release Notes (Base Language Updates)',
        url: 'https://knowledgebase.elblearning.com/microbuilder-release-notes',
        body: 'MicroBuilder release notes include Base Language updates. Authors can select base language during module outline creation and manage base language behavior for translations.',
        sections: [
          {
            heading: 'Base Language option on Module Outline Creation',
            anchor: 'base-language-option-on-module-outline-creation',
            text: 'Authors can select the base language during module outline creation. Base language is detected and can be overridden by the author.',
            level: 2
          },
          {
            heading: 'Release Highlights and Key Enhancements',
            anchor: 'release-highlights-and-key-enhancements',
            text: 'Base Language selection, author override support, and improved language handling are included in release enhancements.',
            level: 2
          }
        ],
        tags: ['microbuilder', 'release notes', 'base language', 'module outline', 'translations'],
        solved: false,
        accepted: false,
        updatedAt: '2026-02-19'
      });
    }
    addIfMissing({
      id: 'kb-training-arcade-release-notes-v2572',
      type: 'kb',
      product: 'training-arcade',
      title: 'The Training Arcade v25.7.2 Release Notes',
      url: 'https://knowledgebase.elblearning.com/the-training-arcade-release-notes',
      body: 'Release notes for The Training Arcade include Arcades updates, admin/backend API improvements, and fixes for game builder visibility and integrations.',
      sections: [
        { heading: 'Arcades', anchor: 'arcades', text: 'Arcades styling fixes for tutorial and help sections, with iOS viewing improvements.', level: 2 },
        { heading: 'Admin CMS/Backend API', anchor: 'admin-cms-backend-api', text: 'Arcades data and integration behavior improved, including additional parameter support and stability fixes.', level: 2 }
      ],
      tags: ['training-arcade', 'arcades', 'release notes', 'game builder', 'backend api'],
      solved: false,
      accepted: false,
      updatedAt: '2025-07-30'
    });
    addIfMissing({
      id: 'kb-training-arcade-game-template-guides',
      type: 'kb',
      product: 'training-arcade',
      title: 'Training Arcade: Choosing and Building Game Templates',
      url: 'https://knowledgebase.elblearning.com/learn-how-to-build-effective-training-games',
      body: 'Step-by-step guidance for choosing Arcade game templates, configuring gameplay, and publishing interactive training experiences.',
      sections: [
        { heading: 'Choosing a Game Template', anchor: 'choosing-game-template', text: 'Select Arcade templates by objective, question style, and learner engagement level.', level: 2 },
        { heading: 'Adding Content to Games', anchor: 'adding-content-to-games', text: 'Add content, questions, and media to Arcade games, then publish for delivery.', level: 2 }
      ],
      tags: ['training-arcade', 'arcades', 'templates', 'tutorials', 'games'],
      solved: false,
      accepted: false,
      updatedAt: '2025-11-15'
    });
    // Avoid fabricated community slugs that may 404; only keep known index URLs.
    return data;
  }

  function applyIndexData(data) {
    data = ensureCanonicalArticles(data);
    if (data && Array.isArray(data.articles)) {
      data.articles.forEach(function (a) {
        if (a && a.url) a.url = normalizeContentUrl(a.url, a.type);
      });
    }
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

    if (!url || typeof url !== 'string') {
      if (!_indexLoaded && _BUILTIN_INDEX && _BUILTIN_INDEX.articles) {
        debugLog('INDEX-BUILTIN-FALLBACK', { version: _BUILTIN_INDEX.version, articles: _BUILTIN_INDEX.articles.length });
        applyIndexData(_BUILTIN_INDEX);
        cb(_BUILTIN_INDEX);
      } else if (!_indexLoaded) { cb(null); }
      return;
    }

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
    if (hasWholeWord(lower, tl)) return 'exact';
    if (hasDerivativeWord(lower, tl) || hasWholeWord(lower, simpleStem(tl))) return 'partial';
    for (var i = 0; i < (synonyms || []).length; i++) {
      if (hasWholeWord(lower, synonyms[i].toLowerCase())) return 'synonym';
    }
    var tokens = tokenize(text);
    for (var j = 0; j < tokens.length; j++) {
      var fm = fuzzyMatch(tl, tokens[j], tl.length >= 7 ? 2 : 1);
      if (fm.match && fm.type === 'fuzzy') return 'partial';
    }
    return null;
  }

  function scoreText(text, queryTerms, synonymTerms, weights, prefix) {
    if (!text) return { score: 0, termsFound: [], exactCount: 0, partialCount: 0, fuzzyCount: 0 };
    var lower = text.toLowerCase(), score = 0, termsFound = [];
    var exactCount = 0, partialCount = 0, fuzzyCount = 0;
    queryTerms.forEach(function (term) {
      var tl = term.toLowerCase(), stemmed = simpleStem(tl);
      var termWeight = tl.indexOf(' ') >= 0 ? 0.75 : 1.0;
      if (hasWholeWord(lower, tl)) {
        score += (weights[prefix + 'Exact'] || 40) * termWeight;
        score += Math.min(countWholeWordMatches(lower, tl), 3) * ((weights[prefix + 'Exact'] || 40) * 0.15) * termWeight;
        termsFound.push(tl);
        exactCount++;
      } else if (hasDerivativeWord(lower, tl) || (stemmed !== tl && hasWholeWord(lower, stemmed))) {
        score += (weights[prefix + 'Partial'] || 25) * 0.55 * termWeight;
        termsFound.push(tl);
        partialCount++;
      } else {
        var tokens = tokenize(text);
        for (var i = 0; i < tokens.length; i++) {
          var fm = fuzzyMatch(tl, tokens[i], tl.length >= 6 ? 2 : 1);
          if (fm.match && fm.type === 'fuzzy') {
            score += (weights[prefix + 'Fuzzy'] || 12) * 0.35 * termWeight;
            termsFound.push(tl);
            fuzzyCount++;
            break;
          }
        }
      }
    });
    if (synonymTerms && synonymTerms.length > 0) {
      var synMult = weights.synonymMatch || 0.7;
      synonymTerms.forEach(function (syn) {
        if (hasWholeWord(lower, syn.toLowerCase())) score += (weights[prefix + 'Partial'] || 25) * synMult * 0.75;
      });
    }
    if (queryTerms.length > 1 && exactCount === queryTerms.length) {
      score += (weights[prefix + 'Exact'] || 40) * 0.5;
    }
    return { score: score, termsFound: termsFound, exactCount: exactCount, partialCount: partialCount, fuzzyCount: fuzzyCount };
  }

  function buildKeywordVariants(keywords) {
    var variants = [];
    var suffixes = ['link', 'mill', 'builder', 'arcade', 'studio', 'platform', 'online', 'desktop', 'learning'];
    (keywords || []).forEach(function (kw) {
      var k = String(kw || '').toLowerCase().trim();
      if (!k) return;
      if (k.indexOf('-') >= 0) {
        var dashed = k.replace(/-/g, ' ');
        if (variants.indexOf(dashed) === -1) variants.push(dashed);
      }
      for (var i = 0; i < suffixes.length; i++) {
        var suf = suffixes[i];
        if (k.length > (suf.length + 2) && k.endsWith(suf)) {
          var prefix = k.slice(0, -suf.length);
          if (prefix && prefix.length >= 3) {
            var phrase = prefix + ' ' + suf;
            if (variants.indexOf(phrase) === -1) variants.push(phrase);
          }
        }
      }
    });
    return variants;
  }

  function charSimilarity(a, b) {
    if (!a || !b) return 0;
    var aNorm = String(a).toLowerCase().trim().replace(/\s+/g, ' ');
    var bNorm = String(b).toLowerCase().trim().replace(/\s+/g, ' ');
    if (!aNorm || !bNorm) return 0;
    if (aNorm === bNorm) return 1;
    var maxLen = Math.max(aNorm.length, bNorm.length);
    if (maxLen === 0) return 0;
    return Math.max(0, 1 - (levenshtein(aNorm, bNorm) / maxLen));
  }

  function hasLooseTermMatch(text, term) {
    if (!text || !term) return false;
    var lower = text.toLowerCase();
    var t = term.toLowerCase();
    var stem = simpleStem(t);
    if (hasWholeWord(lower, t) || hasDerivativeWord(lower, t) || (stem !== t && hasWholeWord(lower, stem))) return true;
    var tokens = tokenize(text);
    for (var i = 0; i < tokens.length; i++) {
      var fm = fuzzyMatch(t, tokens[i], t.length >= 6 ? 2 : 1);
      if (fm.match) return true;
    }
    return false;
  }

  function getReplySearchText(article) {
    if (!article) return '';
    var chunks = [];
    if (typeof article.repliesText === 'string' && article.repliesText.trim()) chunks.push(article.repliesText.trim());
    if (typeof article.replyText === 'string' && article.replyText.trim()) chunks.push(article.replyText.trim());
    if (Array.isArray(article.replies)) {
      article.replies.forEach(function (r) {
        if (!r) return;
        if (typeof r === 'string' && r.trim()) chunks.push(r.trim());
        else if (typeof r === 'object') {
          var t = r.text || r.body || r.content || r.reply || '';
          if (typeof t === 'string' && t.trim()) chunks.push(t.trim());
        }
      });
    }
    return chunks.join(' ');
  }

  function bestTermMatchType(text, term, synonyms) {
    if (!text || !term) return null;
    var lower = text.toLowerCase();
    var t = term.toLowerCase();
    var stem = simpleStem(t);
    if (hasWholeWord(lower, t)) return 'exact';
    if (hasDerivativeWord(lower, t) || (stem !== t && hasWholeWord(lower, stem))) return 'near';
    var tokens = tokenize(text);
    for (var i = 0; i < tokens.length; i++) {
      var fm = fuzzyMatch(t, tokens[i], t.length >= 6 ? 2 : 1);
      if (fm.match) return 'near';
    }
    var syns = synonyms || [];
    for (var s = 0; s < syns.length; s++) {
      var syn = String(syns[s] || '').toLowerCase();
      if (!syn) continue;
      if (hasWholeWord(lower, syn) || hasDerivativeWord(lower, syn)) return 'synonym';
    }
    return null;
  }

  function computeMatchQuality(article, queryTerms, normalizedPhraseQuery, originalKeywords) {
    var out = {
      percent: 0,
      exactCount: 0,
      nearCount: 0,
      synonymCount: 0,
      titleExactCount: 0
    };
    if (!article || !Array.isArray(queryTerms) || queryTerms.length === 0) return out;

    var titleText = article.title || '';
    var headingText = '';
    var bodyText = (article.body || '') + ' ' + (article.solutionText || '') + ' ' + getReplySearchText(article);
    if (Array.isArray(article.sections)) {
      article.sections.forEach(function (sec) {
        headingText += ' ' + (sec.heading || '') + ' ' + (sec.subheading || '') + ' ' + (sec.h2 || '') + ' ' + (sec.h3 || '');
        bodyText += ' ' + (sec.text || '');
        if (Array.isArray(sec.paragraphs)) {
          sec.paragraphs.forEach(function (p) {
            bodyText += ' ' + (typeof p === 'object' ? (p.text || '') : (p || ''));
          });
        }
      });
    }
    if (Array.isArray(article.tags)) bodyText += ' ' + article.tags.join(' ');

    var coreTerms = (originalKeywords && originalKeywords.length > 0) ? originalKeywords : queryTerms;

    var termWeights = [];
    coreTerms.forEach(function (term) {
      var syns = getSynonyms(term);
      var tt = bestTermMatchType(titleText, term, syns);
      var ht = bestTermMatchType(headingText, term, syns);
      var bt = bestTermMatchType(bodyText, term, syns);

      if (tt === 'exact') out.titleExactCount++;
      var w = 0;
      if (tt === 'exact') w = 1.0;
      else if (tt === 'near') w = 0.8;
      else if (tt === 'synonym') w = 0.5;
      else if (ht === 'exact') w = 0.75;
      else if (ht === 'near') w = 0.65;
      else if (ht === 'synonym') w = 0.4;
      else if (bt === 'exact') w = 0.55;
      else if (bt === 'near') w = 0.45;
      else if (bt === 'synonym') w = 0.3;

      var strongest = null;
      if (tt === 'exact' || ht === 'exact' || bt === 'exact') strongest = 'exact';
      else if (tt === 'near' || ht === 'near' || bt === 'near') strongest = 'near';
      else if (tt === 'synonym' || ht === 'synonym' || bt === 'synonym') strongest = 'synonym';

      if (strongest === 'exact') out.exactCount++;
      else if (strongest === 'near') out.nearCount++;
      else if (strongest === 'synonym') out.synonymCount++;
      termWeights.push(w);
    });

    var weighted = 0;
    for (var tw = 0; tw < termWeights.length; tw++) weighted += termWeights[tw];
    out.percent = Math.min(100, Math.round((weighted / coreTerms.length) * 100));

    var titleLower = (titleText || '').toLowerCase();
    if (normalizedPhraseQuery && normalizedPhraseQuery.length > 1) {
      if (titleLower === normalizedPhraseQuery || titleLower.indexOf(normalizedPhraseQuery) >= 0) {
        out.percent = 100;
      } else if (hasWholePhrase(titleLower, normalizedPhraseQuery)) {
        out.percent = Math.max(out.percent, 99);
      }
    }
    if (out.titleExactCount === coreTerms.length && coreTerms.length >= 2) {
      out.percent = Math.max(out.percent, 98);
    }
    return out;
  }

  function compareSearchResults(a, b) {
    if ((b.hardBoostTier || 0) !== (a.hardBoostTier || 0)) return (b.hardBoostTier || 0) - (a.hardBoostTier || 0);
    if ((b.exactTitleMatch || 0) !== (a.exactTitleMatch || 0)) return (b.exactTitleMatch || 0) - (a.exactTitleMatch || 0);
    if ((b.matchPercent || 0) !== (a.matchPercent || 0)) return (b.matchPercent || 0) - (a.matchPercent || 0);
    if ((b.exactPhraseTier || 0) !== (a.exactPhraseTier || 0)) return (b.exactPhraseTier || 0) - (a.exactPhraseTier || 0);
    if ((b.titleExactSignal || 0) !== (a.titleExactSignal || 0)) return (b.titleExactSignal || 0) - (a.titleExactSignal || 0);
    if ((b.exactSignal || 0) !== (a.exactSignal || 0)) return (b.exactSignal || 0) - (a.exactSignal || 0);
    return b.score - a.score;
  }

  function buildLooseFallbackResult(article, keywords, synonyms, refMax) {
    if (!article) return null;
    var matchedTerms = [];
    var looseScore = 0;

    var textPool = [];
    if (article.title) textPool.push(article.title);
    if (Array.isArray(article.sections)) {
      article.sections.forEach(function (sec) {
        if (sec.heading) textPool.push(sec.heading);
        if (sec.text) textPool.push(sec.text);
      });
    }
    if (article.body) textPool.push(article.body);
    if (article.solutionText) textPool.push(article.solutionText);
    if (Array.isArray(article.tags) && article.tags.length) textPool.push(article.tags.join(' '));
    var merged = textPool.join(' ');

    keywords.forEach(function (kw) {
      if (hasLooseTermMatch(merged, kw)) {
        if (matchedTerms.indexOf(kw) === -1) matchedTerms.push(kw);
        looseScore += 2;
      }
    });
    (synonyms || []).forEach(function (syn) {
      if (hasLooseTermMatch(merged, syn)) {
        if (matchedTerms.indexOf(syn) === -1) matchedTerms.push(syn);
        looseScore += 1;
      }
    });

    if (matchedTerms.length === 0 || looseScore <= 0) return null;

    var topSection = (Array.isArray(article.sections) && article.sections.length > 0) ? article.sections[0] : null;
    var paraText = (topSection && (topSection.text || topSection.heading)) || article.solutionText || article.body || article.title || '';
    var paraAnchor = (topSection && topSection.anchor) || 'body-p0';
    var normalizedScore = Math.max(MIN_RENDER_THRESHOLD, Math.min(0.50, 0.10 + (looseScore * 0.05)));
    var score = normalizedScore * refMax;
    var matchPercent = Math.min(55, 20 + (looseScore * 6));

    return {
      article: article,
      score: score,
      normalizedScore: normalizedScore,
      matchPercent: matchPercent,
      matchQuality: { percent: matchPercent, exactCount: 0, nearCount: 0, synonymCount: 0, titleExactCount: 0 },
      exactSignal: 0,
      titleExactSignal: 0,
      exactPhraseTier: 0,
      hardBoostTier: 0,
      matchedParagraphs: [{
        text: paraText,
        anchor: paraAnchor,
        sectionHeading: topSection ? (topSection.heading || '') : '',
        sectionAnchor: topSection ? (topSection.anchor || '') : '',
        score: score,
        matchTypes: {}
      }],
      matchedSections: topSection ? [{
        heading: topSection.heading || '',
        anchor: topSection.anchor || '',
        text: topSection.text || '',
        score: score,
        level: topSection.level || 2
      }] : [],
      matchedTerms: matchedTerms
    };
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

  /**
   * applyRelevanceThreshold â€” Filters a ranked results array per source
   * (KB or Community) with strict relevance gating.
   *
   * Rules (applied per-source independently):
   *   1. Results â‰¥50% are "high"; results <50% are "low".
   *   2. Product-aligned results are prioritised within each tier.
   *   3. If â‰¥5 high results exist  â†’ return ALL high, exclude ALL low.
   *   4. If 3-4 high results exist â†’ return all high only (no low padding).
   *   5. If <3 high results exist  â†’ pad with low results up to 5 total.
   *   6. Within each tier, sort by matchPercent desc, then score desc.
   */
  function applyRelevanceThreshold(results, effectiveProduct) {
    if (!results || results.length === 0) return results;

    var HIGH_THRESHOLD = 50;
    var MIN_HIGH_EXCLUSIVE = 2;
    var PAD_TARGET = 5;
    var LOW_FLOOR = 20;

    var high = [];
    var low = [];
    results.forEach(function (r) {
      if ((r.matchPercent || 0) >= HIGH_THRESHOLD) high.push(r);
      else low.push(r);
    });

    function relevanceSort(arr) {
      return arr.slice().sort(function (a, b) {
        var cmp = compareSearchResults(a, b);
        if (cmp !== 0) return cmp;
        if (effectiveProduct && effectiveProduct !== 'general') {
          var aProd = (a.article && a.article.product === effectiveProduct) ? 1 : 0;
          var bProd = (b.article && b.article.product === effectiveProduct) ? 1 : 0;
          if (bProd !== aProd) return bProd - aProd;
        }
        return 0;
      });
    }

    high = relevanceSort(high);
    low = relevanceSort(low);

    if (high.length > 0) {
      low = low.filter(function (r) { return (r.matchPercent || 0) >= LOW_FLOOR; });
    }

    if (high.length >= MIN_HIGH_EXCLUSIVE) return high;

    var padded = high.slice();
    for (var i = 0; i < low.length && padded.length < PAD_TARGET; i++) {
      if (effectiveProduct && effectiveProduct !== 'general') {
        if (low[i].article && low[i].article.product && low[i].article.product !== effectiveProduct && low[i].article.product !== 'general') continue;
      }
      padded.push(low[i]);
    }
    if (padded.length < PAD_TARGET) {
      for (var j = 0; j < low.length && padded.length < PAD_TARGET; j++) {
        if (padded.indexOf(low[j]) === -1) padded.push(low[j]);
      }
    }
    return padded;
  }

  function searchIndex(query, product) {
    var empty = { kb: [], community: [], all: [], discarded: [], spellingSuggestions: null, correctedQuery: null, effectiveProduct: product, queryDetectedProduct: null };
    if (!_contentIndex || !_contentIndex.articles) return empty;

    var expandedQuery = expandAcronyms(query);
    var keywords = extractKeywords(expandedQuery);
    if (keywords.length === 0) keywords = tokenize(expandedQuery);
    if (keywords.length === 0) return empty;
    var originalKeywords = keywords.slice();
    keywords.slice().forEach(function (kw) {
      var stem = simpleStem(kw);
      if (stem && stem.length > 2 && keywords.indexOf(stem) === -1) keywords.push(stem);
      var kwl = kw.toLowerCase();
      if (kwl.length > 3 && kwl.endsWith('s') && !kwl.endsWith('ss')) {
        var sOnly = kwl.slice(0, -1);
        if (sOnly !== stem && sOnly.length > 2 && keywords.indexOf(sOnly) === -1) keywords.push(sOnly);
      }
    });
    buildKeywordVariants(keywords).forEach(function (v) {
      if (keywords.indexOf(v) === -1) keywords.push(v);
    });

    debugLog('ACRONYM-EXPAND', { original: query, expanded: expandedQuery, changed: query !== expandedQuery });

    var queryDetectedProduct = detectProductFromQuery(query);
    var effectiveProduct = queryDetectedProduct || product;

    var spellingSuggestions = getSpellingSuggestions(keywords);
    var correctedQuery = spellingSuggestions ? buildCorrectedQuery(query, spellingSuggestions) : null;

    var allSynonyms = [];
    keywords.forEach(function (kw) {
      getSynonyms(kw).forEach(function (s) { if (allSynonyms.indexOf(s) === -1 && keywords.indexOf(s) === -1) allSynonyms.push(s); });
      getSynonyms(simpleStem(kw)).forEach(function (s) { if (allSynonyms.indexOf(s) === -1 && keywords.indexOf(s) === -1) allSynonyms.push(s); });
    });

    // Prevent previous-query bleed: learned cross-query synonyms are intentionally disabled.
    var learnedSyns = [];

    debugLog('QUERY-NORMALIZE', { raw: query, expanded: expandedQuery, keywords: keywords, synonyms: allSynonyms, learnedSynonyms: learnedSyns, spellingSuggestions: spellingSuggestions, correctedQuery: correctedQuery, globalProduct: product, queryDetectedProduct: queryDetectedProduct, effectiveProduct: effectiveProduct });

    var weights = _contentIndex.weightConfig || getDefaultWeights();
    var refMax = computeRefMax(weights);
    var queryLower = expandedQuery.toLowerCase();
    var hasBaseLanguageIntent = /\bbase\s+language\b/i.test(queryLower);
    var normalizedPhraseQuery = expandedQuery.toLowerCase().trim().replace(/\s+/g, ' ');
    var qVec = _tfidfIndex ? queryToVector(expandedQuery, _tfidfIndex.df, _tfidfIndex.docCount) : null;
    var rawResults = [];

    _contentIndex.articles.forEach(function (article) {
      var score = 0;
      var matchedParagraphs = [];
      var matchedSections = [];
      var matchedTerms = [];
      var exactSignal = 0;
      var titleExactSignal = 0;
      var exactPhraseTier = 0;   // Generic deterministic tier: title > heading > body
      var hardBoostTier = 0;     // Query-specific lock tier (e.g. "base language")

      if (queryDetectedProduct && effectiveProduct && effectiveProduct !== 'general') {
        if (article.product && article.product === effectiveProduct) {
          score += (weights.productMatch || 20) * 2.5;
        } else if (article.product && article.product !== effectiveProduct && article.product !== 'general') {
          score -= (weights.productMatch || 20) * 1.5;
        }
      }

      var titleResult = scoreText(article.title || '', keywords, allSynonyms, weights, 'title');
      score += titleResult.score;
      titleResult.termsFound.forEach(function (t) { if (matchedTerms.indexOf(t) === -1) matchedTerms.push(t); });
      exactSignal += titleResult.exactCount;
      titleExactSignal += titleResult.exactCount;
      if (article.title && article.title.toLowerCase() === queryLower) score += 50;
      if (article.title && queryLower.length > 1 && hasWholePhrase(article.title.toLowerCase(), queryLower)) {
        score += (weights.titleExact || 100) * 2.0;
        exactSignal += 2;
        titleExactSignal += 2;
      }
      var titleSimilarity = charSimilarity(normalizedPhraseQuery, article.title || '');
      if (titleSimilarity >= 0.95) {
        score += (weights.titleExact || 100) * 1.8;
        exactSignal += 2;
        titleExactSignal += 2;
      } else if (titleSimilarity >= 0.85) {
        score += (weights.titleExact || 100) * 1.0;
        exactSignal += 1;
      } else if (titleSimilarity >= 0.75) {
        score += (weights.titleExact || 100) * 0.45;
      }
      if (normalizedPhraseQuery.length > 1 && hasWholePhrase((article.title || '').toLowerCase(), normalizedPhraseQuery)) {
        exactPhraseTier = Math.max(exactPhraseTier, 3);
      }
      if (article.tags && Array.isArray(article.tags)) {
        var tagStr = article.tags.join(' ').replace(/-/g, ' ').toLowerCase();
        if (hasWholePhrase(tagStr, queryLower.replace(/\s+/g, ' ')) || hasWholePhrase(tagStr, queryLower)) {
          score += (weights.tagMatch || 15) * 2.0;
        }
      }

      if (Array.isArray(article.sections)) {
        article.sections.forEach(function (section) {
          var headingResult = scoreText(section.heading || '', keywords, allSynonyms, weights, 'heading');
          var headingScore = headingResult.score;
          headingResult.termsFound.forEach(function (t) { if (matchedTerms.indexOf(t) === -1) matchedTerms.push(t); });
          exactSignal += headingResult.exactCount;
          if (normalizedPhraseQuery.length > 1 && hasWholePhrase((section.heading || '').toLowerCase(), normalizedPhraseQuery)) {
            exactPhraseTier = Math.max(exactPhraseTier, 2);
          }
          var sectionBodyScore = 0;

          var paragraphs = section.paragraphs || (section.text ? splitParagraphs(section.text) : []);
          if (paragraphs.length === 0 && section.text) paragraphs = [section.text];

          paragraphs.forEach(function (para, pIdx) {
            var pText = typeof para === 'object' ? para.text : para;
            var pAnchor = typeof para === 'object' ? para.anchor : ((section.anchor || '') + '-p' + pIdx);
            var pResult = scoreText(pText || '', keywords, allSynonyms, weights, 'paragraph');
            var pScore = pResult.score;
            exactSignal += pResult.exactCount;
            if (normalizedPhraseQuery.length > 1 && hasWholePhrase((pText || '').toLowerCase(), normalizedPhraseQuery)) {
              exactPhraseTier = Math.max(exactPhraseTier, 1);
            }

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
          exactSignal += bpResult.exactCount;
          if (normalizedPhraseQuery.length > 1 && hasWholePhrase((bp || '').toLowerCase(), normalizedPhraseQuery)) {
            exactPhraseTier = Math.max(exactPhraseTier, 1);
          }
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
        exactSignal += solResult.exactCount;
        if (normalizedPhraseQuery.length > 1 && hasWholePhrase((article.solutionText || '').toLowerCase(), normalizedPhraseQuery)) {
          exactPhraseTier = Math.max(exactPhraseTier, 1);
        }
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

      var repliesText = getReplySearchText(article);
      if (repliesText) {
        var replyResult = scoreText(repliesText, keywords, allSynonyms, weights, 'paragraph');
        score += replyResult.score * 0.9;
        exactSignal += replyResult.exactCount;
        replyResult.termsFound.forEach(function (t) { if (matchedTerms.indexOf(t) === -1) matchedTerms.push(t); });
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
        var rawQueryLower = expandedQuery.toLowerCase().trim();
        var fullText = ((article.title || '') + ' ' + (article.body || '')).toLowerCase();
        if (Array.isArray(article.sections)) {
          article.sections.forEach(function (sec) { fullText += ' ' + ((sec.heading || '') + ' ' + (sec.text || '')).toLowerCase(); });
        }
        if (article.solutionText) fullText += ' ' + article.solutionText.toLowerCase();
        if (Array.isArray(article.tags)) fullText += ' ' + article.tags.join(' ').replace(/-/g, ' ').toLowerCase();

        if (hasWholePhrase(fullText, rawQueryLower)) {
          score += (weights.titleExact || 100) * 1.5;
          exactSignal += 2;
          debugLog('EXACT-PHRASE-MATCH', { id: article.id, phrase: rawQueryLower });
        } else if (hasWholePhrase(fullText, phraseStr)) {
          score += (weights.titleExact || 100) * 0.8;
          exactSignal += 1;
          debugLog('KEYWORD-PHRASE-MATCH', { id: article.id, phrase: phraseStr });
        }

        var sentences = fullText.split(/[.!?]+/).map(function (s) { return s.trim(); }).filter(function (s) { return s.length > 10; });
        for (var si = 0; si < sentences.length; si++) {
          var allInSentence = true;
          for (var ki = 0; ki < keywords.length; ki++) {
            if (!hasWholeWord(sentences[si].toLowerCase(), keywords[ki].toLowerCase())) { allInSentence = false; break; }
          }
          if (allInSentence) {
            score += (weights.titleExact || 100) * 0.4;
            debugLog('SENTENCE-MATCH', { id: article.id, sentence: sentences[si].substring(0, 60) });
            break;
          }
        }
      }

      if (hasBaseLanguageIntent) {
        var phrase = 'base language';
        var titleLower = (article.title || '').toLowerCase();
        var urlLower = (article.url || '').toLowerCase();
        var articleText = ((article.title || '') + ' ' + (article.body || '') + ' ' + (article.solutionText || '')).toLowerCase();
        var headingPhraseMatch = false;
        if (Array.isArray(article.sections)) {
          article.sections.forEach(function (sec) {
            articleText += ' ' + (sec.heading || '').toLowerCase() + ' ' + (sec.text || '').toLowerCase();
            if (!headingPhraseMatch && hasWholePhrase((sec.heading || '').toLowerCase(), phrase)) headingPhraseMatch = true;
          });
        }

        if (hasWholePhrase(articleText, phrase)) score += (weights.titleExact || 100) * 1.25;
        if (hasWholePhrase(titleLower, phrase)) score += (weights.titleExact || 100) * 2.25;
        if (urlLower.indexOf('microbuilder-release-notes') >= 0) score += (weights.titleExact || 100) * 2.75;
        if ((article.product || '').toLowerCase() === 'microbuilder') score += (weights.productMatch || 20) * 3.0;

        // Deterministic hard-lock tier for "base language":
        // title exact phrase > heading exact phrase > body exact phrase.
        if (hasWholePhrase(titleLower, phrase)) hardBoostTier = 300;
        else if (headingPhraseMatch) hardBoostTier = 200;
        else if (hasWholePhrase(articleText, phrase)) hardBoostTier = 100;
        if (urlLower.indexOf('microbuilder-release-notes') >= 0) hardBoostTier += 25;
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
        var bestSimilarity = 0;
        if (matchedParagraphs.length > 0) {
          for (var simIdx = 0; simIdx < Math.min(matchedParagraphs.length, 6); simIdx++) {
            var simText = matchedParagraphs[simIdx] && matchedParagraphs[simIdx].text ? matchedParagraphs[simIdx].text : '';
            var simVal = charSimilarity(normalizedPhraseQuery, simText);
            if (simVal > bestSimilarity) bestSimilarity = simVal;
          }
        }
        if (bestSimilarity >= 0.92) score += (weights.paragraphExact || 45) * 1.2;
        else if (bestSimilarity >= 0.82) score += (weights.paragraphExact || 45) * 0.6;

        matchedParagraphs.sort(function (a, b) { return b.score - a.score; });
        matchedSections.sort(function (a, b) { return b.score - a.score; });
        var normalizedScore = Math.min(1.0, score / refMax);
        var matchQuality = computeMatchQuality(article, keywords, normalizedPhraseQuery, originalKeywords);
        score += (weights.titleExact || 100) * (matchQuality.percent / 100) * 0.45;
        normalizedScore = Math.min(1.0, score / refMax);
        var exactTitleMatch = 0;
        if (matchQuality.percent >= 100) exactTitleMatch = 2;
        else if (matchQuality.percent >= 95) exactTitleMatch = 1;
        rawResults.push({
          article: article, score: score, normalizedScore: normalizedScore, exactSignal: exactSignal, titleExactSignal: titleExactSignal, exactPhraseTier: exactPhraseTier, hardBoostTier: hardBoostTier,
          exactTitleMatch: exactTitleMatch,
          matchPercent: matchQuality.percent, matchQuality: matchQuality,
          matchedParagraphs: matchedParagraphs, matchedSections: matchedSections,
          matchedTerms: matchedTerms
        });
      }
    });

    var hasAnyExactSignal = rawResults.some(function (r) { return (r.exactSignal || 0) > 0; });
    if (hasAnyExactSignal) {
      rawResults.forEach(function (r) {
        if ((r.exactSignal || 0) === 0) {
          r.score *= 0.72;
          r.normalizedScore = Math.min(1.0, r.score / refMax);
        }
      });
    }

    // Keyword-coverage penalty: when a multi-word query matches only a small
    // fraction of keywords in an article, penalise the score so single-word
    // partial hits cannot outrank full-query matches.
    var originalKeywordCount = originalKeywords.length;
    var hasAnyHighMatch = rawResults.some(function (r) { return (r.matchPercent || 0) >= 50; });
    if (originalKeywordCount >= 2) {
      rawResults.forEach(function (r) {
        var mq = r.matchQuality;
        if (!mq) return;
        var coverage = (mq.exactCount + mq.nearCount * 0.8 + mq.synonymCount * 0.5) / originalKeywordCount;
        if (coverage < 0.3) {
          r.score *= hasAnyHighMatch ? 0.1 : 0.2;
          r.normalizedScore = Math.min(1.0, r.score / refMax);
          r.matchPercent = Math.min(r.matchPercent, hasAnyHighMatch ? 9 : 15);
        } else if (coverage < 0.5) {
          r.score *= hasAnyHighMatch ? 0.2 : 0.5;
          r.normalizedScore = Math.min(1.0, r.score / refMax);
          r.matchPercent = Math.min(r.matchPercent, hasAnyHighMatch ? 19 : 40);
        } else if (coverage < 0.7) {
          r.score *= hasAnyHighMatch ? 0.5 : 0.7;
          r.normalizedScore = Math.min(1.0, r.score / refMax);
          r.matchPercent = Math.min(r.matchPercent, hasAnyHighMatch ? 39 : 49);
        }
      });
    }

    rawResults.sort(compareSearchResults);

    var valid = [];
    var discarded = [];
    rawResults.forEach(function (r) {
      if (validateResult(r)) valid.push(r);
      else discarded.push(r);
    });

    if (effectiveProduct && effectiveProduct !== 'general') {
      var onProduct = [];
      var offProduct = [];
      valid.forEach(function (r) {
        var p = (r.article && r.article.product) || 'general';
        if (p === effectiveProduct || p === 'general') onProduct.push(r);
        else offProduct.push(r);
      });
      var hasStrongOnProduct = onProduct.some(function (r) { return (r.matchPercent || 0) >= 50; });
      offProduct.forEach(function (r) {
        if ((r.matchPercent || 0) < 80) {
          r.matchPercent = Math.min(r.matchPercent || 0, 35);
        }
        if (hasStrongOnProduct && (r.matchPercent || 0) < 50) {
          r.matchPercent = Math.min(r.matchPercent || 0, 15);
          r.score *= 0.25;
          r.normalizedScore = Math.min(1.0, r.score / refMax);
        }
      });
      valid = onProduct.concat(offProduct);
      valid.sort(compareSearchResults);
    }

    var kbResults = valid.filter(function (r) { return (r.article.type || 'kb').toLowerCase() !== 'community'; });
    var communityResults = valid.filter(function (r) { return (r.article.type || '').toLowerCase() === 'community'; });

    kbResults = applyRelevanceThreshold(kbResults, effectiveProduct);
    communityResults = applyRelevanceThreshold(communityResults, effectiveProduct);
    var allFiltered = kbResults.concat(communityResults);
    allFiltered.sort(compareSearchResults);

    debugLog('RAW-KB-RESULTS', kbResults.map(function (r) {
      return { id: r.article.id, type: r.article.type, title: r.article.title, score: r.score, normalized: r.normalizedScore, matchPercent: r.matchPercent, url: r.article.url };
    }));
    debugLog('RAW-COMMUNITY-RESULTS', communityResults.map(function (r) {
      return { id: r.article.id, type: r.article.type, title: r.article.title, score: r.score, normalized: r.normalizedScore, matchPercent: r.matchPercent, url: r.article.url };
    }));
    debugLog('DISCARDED-RESULTS', discarded.map(function (r) {
      return { id: r.article ? r.article.id : 'N/A', url: r.article ? r.article.url : 'N/A', reason: 'validation-failed' };
    }));
    debugLog('FINAL-RANKED-ORDER', allFiltered.map(function (r, i) {
      return { rank: i + 1, id: r.article.id, normalized: r.normalizedScore, matchPercent: r.matchPercent, url: r.article.url };
    }));

    return { kb: kbResults, community: communityResults, all: allFiltered, discarded: discarded, spellingSuggestions: spellingSuggestions, correctedQuery: correctedQuery, effectiveProduct: effectiveProduct, queryDetectedProduct: queryDetectedProduct };
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
    if (sentStart === 0) {
      var nlStart = text.lastIndexOf('\n', bestPos);
      if (nlStart >= 0 && nlStart > bestPos - radius) sentStart = nlStart + 1;
    }
    var sentEnd = text.indexOf('. ', bestPos + bestTerm.length);
    if (sentEnd >= 0) {
      var nextSentEnd = text.indexOf('. ', sentEnd + 2);
      if (nextSentEnd >= 0 && nextSentEnd - sentStart < radius * 3) sentEnd = nextSentEnd + 1;
      else sentEnd = sentEnd + 1;
    } else {
      sentEnd = text.indexOf('.', bestPos + bestTerm.length);
      sentEnd = sentEnd >= 0 ? sentEnd + 1 : text.length;
    }
    var sentence = text.substring(sentStart, sentEnd).trim();
    if (sentence.length > 0 && sentence.length <= radius * 3) {
      return (sentStart > 0 ? '\u2026 ' : '') + sentence + (sentEnd < text.length ? ' \u2026' : '');
    }

    var start = Math.max(0, bestPos - radius), end = Math.min(text.length, bestPos + bestTerm.length + radius);
    var wordStart = text.lastIndexOf(' ', start);
    if (wordStart >= 0 && wordStart > start - 20) start = wordStart + 1;
    var wordEnd = text.indexOf(' ', end);
    if (wordEnd >= 0 && wordEnd < end + 20) end = wordEnd;
    return (start > 0 ? '\u2026 ' : '') + text.substring(start, end).trim() + (end < text.length ? ' \u2026' : '');
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
      var escapedTerm = esc(item.term).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      var re = new RegExp('(^|[^a-z0-9])(' + escapedTerm + ')(?=[^a-z0-9]|$)', 'gi');
      escaped = escaped.replace(re, function (match) {
        var leading = match.match(/^[^a-z0-9]*/i);
        var lead = leading ? leading[0] : '';
        var core = match.slice(lead.length);
        for (var i = 0; i < used.length; i++) {
          if (core.toLowerCase() === used[i].toLowerCase()) return match;
        }
        used.push(core);
        return lead + '<mark class="' + item.cls + '">' + core + '</mark>';
      });
    });

    return escaped;
  }

  /* =================== DEEP LINKER (Rule 3, 7) =================== */

  function buildDeepLink(url, matchedTerms, anchor, paragraphText, articleType) {
    if (!url) return null;
    url = normalizeContentUrl(url, articleType);
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

  var _ACRONYM_MAP = {
    'rlp': 'rockstar learning platform',
    'rslp': 'rockstar learning platform',
    'lcs': 'learning creation studio',
    'tlcs': 'the learning creation studio',
    'cm': 'coursemill',
    'cml': 'coursemill',
    'ta': 'training arcade',
    'tta': 'the training arcade',
    'cvr': 'cenariovr',
    'mb': 'microbuilder',
    'rl': 'reviewlink',
    'rcd': 'responsive course design',
    'kb': 'knowledge base',
    'lms': 'learning management system',
    'elb': 'elb learning',
    'sso': 'single sign on',
    'csv': 'comma separated values',
    'rp': 'rockstar platform',
    'dnd': 'drag and drop',
    'lo': 'lectora online',
    'ld': 'lectora desktop',
    'scorm': 'scorm',
    'vr': 'cenariovr'
  };

  function isKnownAcronym(word) {
    return !!_ACRONYM_MAP[(word || '').toLowerCase()];
  }

  function expandAcronyms(query) {
    if (!query || typeof query !== 'string') return query;
    var words = query.split(/(\s+)/);
    var result = [];
    for (var i = 0; i < words.length; i++) {
      var w = words[i];
      if (/^\s+$/.test(w)) { result.push(w); continue; }
      var lower = w.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (_ACRONYM_MAP[lower]) {
        result.push(_ACRONYM_MAP[lower]);
      } else {
        result.push(w);
      }
    }
    return result.join('');
  }

  var _PRODUCT_ALIASES = {
    'coursemill': 'coursemill', 'course mill': 'coursemill', 'course-mill': 'coursemill', 'coursemill lms': 'coursemill', 'cm': 'coursemill', 'cml': 'coursemill',
    'coursemill administrator': 'coursemill', 'coursemill student': 'coursemill',
    'lectora': 'lectora', 'lectora online': 'lectora', 'lectora desktop': 'lectora', 'lo': 'lectora', 'ld': 'lectora',
    'responsive course design': 'lectora', 'rcd': 'lectora', 'lectora training plan': 'lectora',
    'cenariovr': 'cenariovr', 'cenario vr': 'cenariovr', 'cenario-vr': 'cenariovr', 'cenario': 'cenariovr', 'cvr': 'cenariovr',
    '360 degree video': 'cenariovr', '360 video': 'cenariovr', '360 degree': 'cenariovr', 'vr video': 'cenariovr',
    'virtual reality': 'cenariovr', 'immersive': 'cenariovr', 'headset': 'cenariovr', '360\u00b0': 'cenariovr',
    'training arcade': 'training-arcade', 'training-arcade': 'training-arcade', 'thetrainingarcade': 'training-arcade', 'the training arcade': 'training-arcade', 'arcades': 'training-arcade', 'ta': 'training-arcade', 'tta': 'training-arcade',
    'gamification': 'training-arcade', 'training game': 'training-arcade', 'game template': 'training-arcade',
    'microbuilder': 'microbuilder', 'micro builder': 'microbuilder', 'micro-builder': 'microbuilder', 'mb': 'microbuilder',
    'microlearning': 'microbuilder', 'micro learning': 'microbuilder',
    'rockstar learning platform': 'rockstar', 'rockstar learning': 'rockstar', 'rockstar platform': 'rockstar', 'rockstar': 'rockstar', 'knowledgelink': 'rockstar', 'knowledge link': 'rockstar',
    'rlp': 'rockstar', 'rslp': 'rockstar', 'rp': 'rockstar', 'module page': 'rockstar',
    'rehearsal': 'rehearsal', 'video coaching': 'rehearsal', 'mentoring': 'rehearsal',
    'reviewlink': 'reviewlink', 'review link': 'reviewlink', 'review-link': 'reviewlink', 'rl': 'reviewlink',
    'learning creation studio': 'learning-creation-studio', 'the learning creation studio': 'learning-creation-studio', 'lcs': 'learning-creation-studio', 'tlcs': 'learning-creation-studio',
    'account management': 'asset-libraries', 'asset library': 'asset-libraries', 'stock asset library': 'asset-libraries', 'stock audio library': 'asset-libraries', 'stock library': 'asset-libraries', 'stock audio': 'asset-libraries', 'stock image': 'asset-libraries', 'stock template': 'asset-libraries',
    'faqs': 'asset-libraries', 'faq': 'asset-libraries', 'billing': 'asset-libraries', 'subscription': 'asset-libraries', 'license': 'asset-libraries', 'login issue': 'general',
    'release notes': 'general', 'e-learning best practices': 'general', 'elearning best practices': 'general', 'off-the-shelf': 'off-the-shelf', 'off the shelf': 'off-the-shelf', 'courseware': 'off-the-shelf',
    'additional learning products': 'general', 'general topics': 'general'
  };

  function inferProductFromResults(results, topN) {
    if (!results || results.length === 0) return null;
    var top = results[0];
    if (top && top.article && top.article.product) {
      if (top.matchPercent >= 90 || top.normalizedScore >= 0.80) return top.article.product;
    }
    topN = Math.min(topN || 5, results.length);
    var counts = {};
    var totalWeight = 0;
    for (var i = 0; i < topN; i++) {
      var art = results[i].article;
      if (!art || !art.product) continue;
      var w = topN - i;
      if (art.product === 'general') w = Math.max(1, Math.floor(w * 0.5));
      counts[art.product] = (counts[art.product] || 0) + w;
      totalWeight += w;
    }
    if (totalWeight === 0) return null;
    var best = null, bestScore = 0;
    for (var p in counts) {
      if (counts[p] > bestScore) { bestScore = counts[p]; best = p; }
    }
    if (bestScore / totalWeight >= 0.35) return best;
    return null;
  }

  function detectProductFromQuery(query) {
    if (!query || typeof query !== 'string') return null;
    var expanded = expandAcronyms(query);
    var q = expanded.toLowerCase().trim();
    var keys = Object.keys(_PRODUCT_ALIASES);
    keys.sort(function (a, b) { return b.length - a.length; });
    var specificMatch = null;
    var generalMatch = null;
    for (var i = 0; i < keys.length; i++) {
      if (q.indexOf(keys[i]) >= 0) {
        var mapped = _PRODUCT_ALIASES[keys[i]];
        if (mapped !== 'general') { specificMatch = mapped; break; }
        if (!generalMatch) generalMatch = mapped;
      }
    }
    if (specificMatch) return specificMatch;
    if (!specificMatch && !generalMatch) {
      var rawLower = query.toLowerCase().trim();
      for (var j = 0; j < keys.length; j++) {
        if (rawLower.indexOf(keys[j]) >= 0) {
          var mapped2 = _PRODUCT_ALIASES[keys[j]];
          if (mapped2 !== 'general') return mapped2;
          if (!generalMatch) generalMatch = mapped2;
        }
      }
    }
    return generalMatch || null;
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
      community: base ? base.community : 'additional-learning-products',
      welcomeMessage: overrides.welcomeMessage || "What can we help you find? Ask anything \u2014 we\u2019ll point you to the right resources."
    };
  }

  function buildActionLinks(product, query, config) {
    var p = getProductConfig(product, config);
    var kw = extractKeywords(query), searchTerm = kw.length ? kw.join(' ') : (query.trim() || 'help');
    var draftTitle = searchTerm;
    if (p && p.label) draftTitle += ' - ' + p.label;
    var encodedCategory = encodeURIComponent(p.community);
    var encodedTitle = encodeURIComponent(draftTitle);
    var encodedQuery = encodeURIComponent(searchTerm);
    var encodedProduct = encodeURIComponent(p.label || product || 'general');
    return {
      postNewQuestion: COMMUNITY_BASE + '/topics/create?category=' + encodedCategory + '&title=' + encodedTitle + '&hsLang=en',
      communityCategory: COMMUNITY_BASE + '/topics?category=' + (p.community || 'additional-learning-products') + '&hsLang=en',
      submitTicket: SUBMIT_TICKET,
      searchTerm: searchTerm
    };
  }

  function getQuickGuideUsage() {
    try { return JSON.parse(localStorage.getItem(QUICK_GUIDE_USAGE_KEY) || '{}'); } catch (e) { return {}; }
  }

  function trackQuickGuideUsage(guideKey) {
    if (!guideKey) return;
    try {
      var usage = getQuickGuideUsage();
      usage[guideKey] = (usage[guideKey] || 0) + 1;
      localStorage.setItem(QUICK_GUIDE_USAGE_KEY, JSON.stringify(usage));
    } catch (e) { /* */ }
  }

  function getRankedQuickGuides(product, query, instructions) {
    if (!Array.isArray(instructions) || instructions.length === 0) return [];
    var q = sanitizeQuery(query || '');
    if (!q) return instructions.slice(0);

    var weights = _contentIndex && _contentIndex.weightConfig ? _contentIndex.weightConfig : getDefaultWeights();
    var keywords = extractKeywords(q);
    if (keywords.length === 0) keywords = tokenize(q);
    var synonyms = [];
    keywords.forEach(function (kw) {
      getSynonyms(kw).forEach(function (s) { if (synonyms.indexOf(s) === -1 && keywords.indexOf(s) === -1) synonyms.push(s); });
    });
    var usage = getQuickGuideUsage();
    var detectedProduct = detectProductFromQuery(q);
    var qLower = q.toLowerCase();

    var ranked = instructions.map(function (inst, idx) {
      var hay = ((inst.label || '') + ' ' + (inst.tag || '') + ' ' + (inst.url || '')).toLowerCase();
      var textScore = scoreText(hay, keywords, synonyms, weights, 'title').score;
      var score = textScore;
      if (hay.indexOf(qLower) >= 0) score += (weights.titleExact || 100) * 0.8;
      if (detectedProduct && detectedProduct === product) score += (weights.productMatch || 20) * 1.5;
      var key = product + '|' + (inst.url || '') + '|' + (inst.label || idx);
      score += Math.min(32, (usage[key] || 0) * 4);
      return { inst: inst, score: score };
    });

    ranked.sort(function (a, b) { return b.score - a.score; });
    var filtered = ranked.filter(function (r) { return r.score > 0; });
    if (filtered.length === 0) filtered = ranked;
    return filtered.map(function (r) { return r.inst; }).slice(0, 6);
  }

  function buildQuickActionsSection(product, config, options) {
    options = options || {};
    var p = getProductConfig(product, config);
    var actionLinks = buildActionLinks(product, options.query || '', config);
    var idPrefix = options.idPrefix || 'default';
    var targetId = idPrefix + '-quick-actions-body';
    var isCollapsed = !!options.collapsedByDefault;
    var html = '<section class="zikb-ia-section zikb-ia-quick-actions zikb-tab-target zikb-tab-resources zikb-tab-all" role="region" aria-label="Quick Actions">';
    html += '<button class="zikb-section-label zikb-accordion-label" type="button" role="heading" aria-level="3" data-accordion-target="' + targetId + '" aria-expanded="' + (!isCollapsed) + '">' + svgIcon('star') + ' Quick Actions <span class="zikb-section-count">(3)</span><span class="zikb-accordion-chevron">' + svgIcon('chevronUp') + '</span></button>';
    html += '<div class="zikb-section-results zikb-accordion-body ' + (isCollapsed ? 'zikb-collapsed' : '') + '" id="' + targetId + '">';
    html += '<div class="zikb-horizontal-list zikb-horizontal-actions">';
    html += '<a class="zikb-qa-link new-post" href="' + esc(actionLinks.postNewQuestion) + '" target="_blank" rel="noopener">';
    html += '<span class="zikb-qa-icon community">' + svgIcon('users') + '</span>';
    html += '<span class="zikb-qa-text"><strong>Post a Question</strong><small>' + esc(p.label) + '</small></span>';
    html += '<span class="zikb-qa-arrow">' + svgIcon('externalLink') + '</span>';
    html += '</a>';
    html += '<a class="zikb-qa-link browse-comm" href="' + esc(actionLinks.communityCategory) + '" target="_blank" rel="noopener">';
    html += '<span class="zikb-qa-icon community">' + svgIcon('search') + '</span>';
    html += '<span class="zikb-qa-text"><strong>Browse Discussions</strong><small>' + esc(p.label) + '</small></span>';
    html += '<span class="zikb-qa-arrow">' + svgIcon('externalLink') + '</span>';
    html += '</a>';
    html += '<a class="zikb-qa-link ticket" href="' + esc(actionLinks.submitTicket) + '" target="_blank" rel="noopener">';
    html += '<span class="zikb-qa-icon ticket">' + svgIcon('ticket') + '</span>';
    html += '<span class="zikb-qa-text"><strong>Submit a Ticket</strong><small>Support team</small></span>';
    html += '<span class="zikb-qa-arrow">' + svgIcon('externalLink') + '</span>';
    html += '</a>';
    html += '</div></div>';
    html += '</section>';
    return html;
  }

  function buildQuickGuidesSection(product, config, query, options) {
    options = options || {};
    var p = getProductConfig(product, config);
    var instructions = PRODUCT_INSTRUCTIONS[product] || PRODUCT_INSTRUCTIONS.general || [];
    instructions = getRankedQuickGuides(product, query || '', instructions);
    if (instructions.length === 0) return '';
    var idPrefix = options.idPrefix || 'default';
    var targetId = idPrefix + '-quick-guides-body';
    var isCollapsed = !!options.collapsedByDefault;

    var html = '<section class="zikb-ia-section zikb-ia-quick-guides zikb-tab-target zikb-tab-resources zikb-tab-all" role="region" aria-label="Quick Guides">';
    html += '<button class="zikb-section-label zikb-accordion-label" type="button" role="heading" aria-level="3" data-accordion-target="' + targetId + '" aria-expanded="' + (!isCollapsed) + '">' + svgIcon('clipboard') + ' Quick Guides: ' + esc(p.label) + ' <span class="zikb-section-count">(' + instructions.length + ')</span><span class="zikb-accordion-chevron">' + svgIcon('chevronUp') + '</span></button>';
    html += '<div class="zikb-section-results zikb-accordion-body ' + (isCollapsed ? 'zikb-collapsed' : '') + '" id="' + targetId + '">';
    if (instructions.length > 0) {
      html += '<div class="zikb-horizontal-list zikb-horizontal-guides">';
      instructions.forEach(function (inst, idx) {
        var tagHtml = inst.tag ? '<span class="zikb-guide-tag">' + esc(inst.tag) + '</span>' : '';
        var guideKey = product + '|' + (inst.url || '') + '|' + (inst.label || idx);
        html += '<a class="zikb-guide-item" href="' + esc(inst.url) + '" target="_blank" rel="noopener" data-guide-key="' + esc(guideKey) + '">';
        html += '<span class="zikb-guide-icon">' + svgIcon('book') + '</span>';
        html += '<span class="zikb-guide-text">' + esc(inst.label) + tagHtml + '</span>';
        html += '<span class="zikb-qa-arrow">' + svgIcon('externalLink') + '</span>';
        html += '</a>';
      });
      html += '</div>';
    }

    html += '</div></section>';
    return html;
  }

  function renderRecentSearchesSection(limit, options) {
    options = options || {};
    var history = getHistory();
    if (!history.length) return '';

    var maxItems = Math.max(1, limit || 5);
    var idPrefix = options.idPrefix || 'default';
    var targetId = idPrefix + '-recent-searches-body';
    var isCollapsed = !!options.collapsedByDefault;
    var html = '<section class="zikb-ia-section zikb-ia-recent zikb-tab-target zikb-tab-resources zikb-tab-all" role="region" aria-label="Recent Searches">';
    html += '<button class="zikb-section-label zikb-accordion-label" type="button" data-accordion-target="' + targetId + '" aria-expanded="' + (!isCollapsed) + '">' + svgIcon('search') + ' Recent Searches <span class="zikb-section-count">(' + history.length + ')</span><span class="zikb-accordion-chevron">' + svgIcon('chevronUp') + '</span></button>';
    html += '<div class="zikb-accordion-body ' + (isCollapsed ? 'zikb-collapsed' : '') + '" id="' + targetId + '">';
    html += '<div class="zikb-recent-list">';
    history.slice(0, maxItems).forEach(function (h) {
      html += '<span class="zikb-suggest-btn" data-suggest="' + esc(h.q) + '">' + esc(h.q) + '</span>';
    });
    html += '</div></div></section>';
    return html;
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
      '#zikb-toggle{position:fixed;bottom:28px;' + (isLeft ? 'left:28px' : 'right:28px') + ';width:76px;height:76px;border-radius:50%;background:linear-gradient(145deg,#ff7b2e 0%,#f06410 25%,#e85d04 50%,#d14800 80%,#b83d00 100%);border:3px solid rgba(255,255,255,.9);color:#fff;cursor:move;box-shadow:0 12px 32px rgba(232,93,4,.42),0 6px 18px rgba(0,0,0,.14),inset 0 2px 4px rgba(255,255,255,.3);z-index:2147483646;transition:transform .25s cubic-bezier(.4,0,.2,1),box-shadow .25s cubic-bezier(.4,0,.2,1);user-select:none;display:flex;align-items:center;justify-content:center;-webkit-tap-highlight-color:transparent}',
      '#zikb-toggle:hover{transform:translateY(-3px) scale(1.1);box-shadow:0 16px 40px rgba(232,93,4,.48),0 8px 22px rgba(0,0,0,.16),inset 0 2px 4px rgba(255,255,255,.35)}',
      '#zikb-toggle:active{transform:scale(.93)}',
      '#zikb-toggle:focus-visible{outline:3px solid #fff;outline-offset:4px;box-shadow:0 0 0 7px rgba(232,93,4,.45)}#zikb-toggle.dragging{cursor:grabbing}',
      '#zikb-toggle svg{width:34px;height:34px;pointer-events:none;filter:drop-shadow(0 2px 3px rgba(0,0,0,.2))}',
      '#zikb-toggle::after{content:"";position:absolute;right:6px;bottom:6px;width:16px;height:16px;background:#21c45a;border-radius:50%;border:2.5px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.28);animation:zikb-pulse 2.2s ease-in-out infinite}',
      '@keyframes zikb-pulse{0%,100%{box-shadow:0 2px 6px rgba(0,0,0,.28)}50%{box-shadow:0 2px 6px rgba(0,0,0,.28),0 0 0 6px rgba(33,196,90,.22)}}',
      '#zikb-panel{position:fixed;bottom:120px;' + (isLeft ? 'left:24px' : 'right:24px') + ';width:440px;height:min(700px,calc(100vh - 140px));max-height:min(700px,calc(100vh - 140px));background:#fff;border:1px solid #e6dfd9;border-radius:20px;box-shadow:0 20px 56px rgba(0,0,0,.13),0 8px 20px rgba(0,0,0,.06);z-index:2147483645;display:none;flex-direction:column;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;transition:max-height .3s cubic-bezier(.4,0,.2,1),width .3s ease}',
      '#zikb-panel.open{display:flex;animation:zikb-fadeIn .2s ease-out}',
      '#zikb-panel.zikb-minimized{max-height:54px!important;overflow:hidden;border-radius:14px;box-shadow:0 4px 20px rgba(0,0,0,.15);transition:max-height .3s cubic-bezier(.4,0,.2,1),border-radius .2s}',
      '#zikb-panel.zikb-minimized #zikb-body,#zikb-panel.zikb-minimized .zikb-powered{display:none}',
      '#zikb-panel.zikb-minimized #zikb-header{border-radius:14px;background:linear-gradient(135deg,' + headerColor + ' 0%,#f26322 60%,#ff7b3a 100%)}',
      '#zikb-panel.zikb-maximized{width:90vw!important;max-width:920px;max-height:90vh!important;left:5vw!important;top:5vh!important;right:auto;bottom:auto;border-radius:20px;box-shadow:0 24px 80px rgba(0,0,0,.28),0 8px 32px rgba(232,93,4,.1);transition:all .35s cubic-bezier(.4,0,.2,1)}',
      '#zikb-panel.zikb-maximized #zikb-body{flex:1 1 auto;max-height:calc(90vh - 112px)}',
      '@keyframes zikb-fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}',
      '@media(max-width:768px){#zikb-panel{width:min(94vw,440px);height:calc(100vh - 128px);max-height:calc(100vh - 128px);bottom:112px!important;' + (isLeft ? 'left:12px!important;right:auto!important' : 'right:12px!important;left:auto!important') + '}#zikb-toggle{width:68px;height:68px;bottom:22px;' + (isLeft ? 'left:22px' : 'right:22px') + '}#zikb-toggle svg{width:30px;height:30px}#zikb-body{padding:10px 11px 5px}}',
      '@media(max-width:480px){#zikb-toggle{width:64px;height:64px;bottom:16px;' + (isLeft ? 'left:16px' : 'right:16px') + '}#zikb-toggle svg{width:28px;height:28px}#zikb-panel{width:calc(100vw - 16px);left:8px!important;right:8px!important;height:calc(100vh - 108px);max-height:calc(100vh - 108px);bottom:96px!important;border-radius:16px}#zikb-panel.zikb-maximized{width:100vw!important;max-width:100vw;left:0!important;top:0!important;max-height:100vh!important;height:100vh!important;border-radius:0}#zikb-header{padding:.72rem .82rem;min-height:48px}#zikb-header .zikb-header-title{font-size:.92rem}#zikb-body{padding:8px 9px 5px}.zikb-section-label{padding:.52rem .65rem;font-size:.73rem}.zikb-result{padding:.68rem .78rem}.zikb-resource-grid{grid-template-columns:1fr}.zikb-compact-resource-row{flex-direction:column}.zikb-compact-resource-row .zikb-compact-section{flex:1 1 100%;min-width:100%}}',
      '#zikb-header{padding:14px 18px;background:linear-gradient(135deg,' + headerColor + ' 0%,#f26322 55%,#ff7b3a 100%);color:#fff;font-weight:600;display:flex;align-items:center;justify-content:space-between;cursor:grab;user-select:none;min-height:54px;border-bottom:1px solid rgba(255,255,255,.12);border-radius:20px 20px 0 0}',
      '#zikb-header.zikb-dragging{cursor:grabbing}',
      '#zikb-header .zikb-header-title{display:flex;align-items:center;gap:.46rem;font-size:.97rem;letter-spacing:.01em}',
      '#zikb-header .zikb-header-title svg{width:17px;height:17px;opacity:.92}',
      '.zikb-header-actions{display:flex;align-items:center;gap:.2rem;background:rgba(0,0,0,.15);border-radius:10px;padding:.2rem .25rem;backdrop-filter:blur(4px)}',
      '.zikb-header-btn{background:none;border:none;color:rgba(255,255,255,.8);cursor:pointer;padding:.4rem;border-radius:8px;display:flex;align-items:center;justify-content:center;transition:all .2s cubic-bezier(.4,0,.2,1);position:relative}',
      '.zikb-header-btn:hover{background:rgba(255,255,255,.2);color:#fff;transform:scale(1.1)}',
      '.zikb-header-btn:active{transform:scale(.92);background:rgba(255,255,255,.3)}',
      '.zikb-header-btn:focus-visible{outline:2px solid #fff;outline-offset:1px}',
      '.zikb-header-btn svg{width:15px;height:15px}',
      '#zikb-minimize-btn{order:1}',
      '#zikb-maximize-btn{order:2}',
      '#zikb-reload-btn.zikb-header-btn{order:0}',
      '#zikb-close{color:rgba(255,255,255,.9);order:3}',
      '#zikb-close:hover{background:rgba(255,60,60,.4);color:#fff;transform:scale(1.15)}',
      '#zikb-close:active{background:rgba(255,60,60,.55)}',
      '#zikb-body{padding:10px 12px 5px;overflow-y:auto;flex:1 1 auto;min-height:0;max-height:none;background:#f9f7f4;color:#333;scroll-behavior:smooth;scrollbar-width:thin;scrollbar-color:rgba(232,93,4,.15) transparent;overscroll-behavior:contain}',
      '#zikb-body::-webkit-scrollbar{width:5px}#zikb-body::-webkit-scrollbar-thumb{background:rgba(232,93,4,.15);border-radius:3px}#zikb-body::-webkit-scrollbar-thumb:hover{background:rgba(232,93,4,.3)}',
      '#zikb-msg{font-size:.9rem;color:#4f4a45;margin-bottom:6px;line-height:1.45;padding:0 2px;flex-shrink:0}',
      '#zikb-search-wrap{display:flex;align-items:center;position:relative;margin-bottom:8px;background:linear-gradient(135deg,#fff 0%,#fefdfb 100%);border:1.5px solid #ddd5cf;border-radius:14px;transition:all .2s cubic-bezier(.4,0,.2,1);box-shadow:0 2px 6px rgba(0,0,0,.04);flex-shrink:0}',
      '#zikb-search-wrap:focus-within{border-color:' + btnColor + ';box-shadow:0 0 0 4px rgba(232,93,4,.08),0 4px 16px rgba(232,93,4,.1);background:#fff}',
      '#zikb-search-input{flex:1;padding:11px 8px 11px 12px;border:none;border-radius:14px;font-size:.9rem;font-family:inherit;background:transparent;word-wrap:break-word;overflow-wrap:break-word;min-height:42px;letter-spacing:.01em}',
      '#zikb-search-input:focus{outline:0}',
      '#zikb-search-input::placeholder{color:#b5b0ab;font-weight:400;font-size:.88rem}',
      '#zikb-search-input::-ms-clear{display:none;width:0;height:0}',
      '#zikb-search-input::-webkit-search-cancel-button{-webkit-appearance:none;appearance:none;display:none}',
      '#zikb-search-input::-webkit-search-decoration{-webkit-appearance:none;appearance:none}',
      '#zikb-search-btn{position:absolute;right:.35rem;top:50%;transform:translateY(-50%);padding:.5rem .68rem;background:linear-gradient(135deg,' + btnColor + ' 0%,#f26322 50%,#ff7b3a 100%);color:#fff;border:none;border-radius:11px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:.3rem;transition:all .2s cubic-bezier(.4,0,.2,1);font-size:.74rem;font-weight:600;font-family:inherit;box-shadow:0 2px 8px rgba(232,93,4,.22)}',
      '#zikb-search-btn:hover{background:linear-gradient(135deg,#d35400,' + btnColor + ');transform:translateY(-50%) scale(1.05);box-shadow:0 4px 14px rgba(232,93,4,.35)}',
      '#zikb-search-btn:active{transform:translateY(-50%) scale(.95);box-shadow:0 1px 4px rgba(232,93,4,.2)}',
      '#zikb-search-btn:focus-visible{outline:2px solid ' + btnColor + ';outline-offset:2px}',
      '#zikb-search-btn svg{width:14px;height:14px}',
      '[data-tooltip]{position:relative}',
      '[data-tooltip]::after{content:attr(data-tooltip);position:absolute;bottom:calc(100% + 6px);left:50%;transform:translateX(-50%);background:#333;color:#fff;padding:.3rem .6rem;border-radius:5px;font-size:.7rem;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .15s;z-index:10}',
      '[data-tooltip]:hover::after{opacity:1}',
      '#zikb-results{display:flex;flex-direction:column;gap:2px;padding-bottom:0;margin-bottom:0;transition:opacity .15s ease}',
      '#zikb-results > :last-child{margin-bottom:0!important}',
      '.zikb-view-tabs{display:flex;align-items:center;gap:4px;flex-wrap:wrap;margin:1px 0 6px;padding:0 2px}',
      '.zikb-view-tab{border:1.5px solid #e2d8cf;background:#fff;border-radius:999px;padding:6px 13px;font-size:11.5px;font-weight:600;color:#6b5d52;cursor:pointer;transition:all .18s;white-space:nowrap}',
      '.zikb-view-tab:hover{border-color:#e85d04;color:#c24a00;background:#fff8f5}',
      '.zikb-view-tab.active{background:linear-gradient(135deg,#e85d04 0%,#f26322 100%);border-color:#e85d04;color:#fff;box-shadow:0 2px 8px rgba(232,93,4,.26)}',
      '.zikb-tab-target.zikb-hidden{display:none!important}',
      '.zikb-compact-resource-row{display:flex;align-items:stretch;gap:10px;flex-wrap:nowrap;overflow-x:auto;padding:4px 0 8px;scrollbar-width:thin;scrollbar-color:rgba(232,93,4,.12) transparent}',
      '.zikb-compact-resource-row::-webkit-scrollbar{height:3px}.zikb-compact-resource-row::-webkit-scrollbar-thumb{background:rgba(232,93,4,.12);border-radius:2px}',
      '.zikb-compact-resource-row .zikb-compact-section{flex:1 1 calc(50% - 5px);min-width:calc(50% - 5px)}',
      '.zikb-compact-section{margin:0}',
      '.zikb-compact-section .zikb-section-label{margin:0;border-radius:10px;font-size:11.5px}',
      '.zikb-compact-section .zikb-accordion-body{margin-top:4px;min-width:0}',
      '.zikb-compact-pill{display:inline-flex;align-items:center;gap:6px;width:auto;min-height:34px;padding:7px 14px;border-radius:10px;background:#fff;border:1.5px solid #e5ddd7;box-shadow:0 1px 4px rgba(0,0,0,.04);font-size:12px;font-weight:700;color:#6b5d52;transition:all .18s}',
      '.zikb-compact-pill:hover{border-color:' + btnColor + ';color:#c24a00;background:#fff8f5;box-shadow:0 2px 8px rgba(232,93,4,.1)}',
      '.zikb-compact-pill[aria-expanded="true"]{background:linear-gradient(135deg,#fff8f5,#fff);border-color:#e7b08f;color:#aa3f00}',
      '.zikb-compact-pill svg{width:12px;height:12px;flex-shrink:0}',
      '.zikb-resource-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;align-items:start}',
      '.zikb-resource-grid .zikb-ia-section{margin:0}',
      '.zikb-resource-grid .zikb-section-label{font-size:11px;padding:9px 12px}',
      '.zikb-resource-grid .zikb-qa-card,.zikb-resource-grid .zikb-guide-card{margin-bottom:0}',
      '#zikb-results.zikb-results-fading{opacity:.3;pointer-events:none}',
      '.zikb-typing-hint{display:flex;align-items:center;gap:.5rem;padding:1.2rem 1rem;color:#9a9590;font-size:.84rem;justify-content:center;animation:zikb-fadeIn .2s ease-out}',
      '.zikb-typing-hint kbd{display:inline-block;padding:.18rem .5rem;background:#fff;border:1.5px solid #d4d0cc;border-radius:6px;font-size:.76rem;font-family:inherit;color:#5a5652;box-shadow:0 1px 3px rgba(0,0,0,.06)}',
      '.zikb-typing-hint strong{color:#5a5652;font-weight:600}',
      '.zikb-typing-hint svg{opacity:.5}',
      '.zikb-clear-results-bar{display:flex;align-items:center;justify-content:space-between;padding:.38rem .62rem;background:linear-gradient(135deg,#fff8f5,#fef5ee);border:1.5px solid #f0dcd0;border-radius:12px;margin-bottom:2px;font-size:.78rem;color:#8a6d5a;gap:.45rem}',
      '.zikb-clear-results-bar .zikb-clear-results-info{display:flex;align-items:center;gap:.45rem;flex:1;min-width:0}',
      '.zikb-clear-results-query{max-width:170px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600;color:#5a5652;font-size:.78rem}',
      '.zikb-clear-results-count{font-size:.73rem;color:#999;white-space:nowrap}',
      '.zikb-clear-results-btn{background:none;border:1.5px solid #e0c8b8;color:#c24a00;cursor:pointer;padding:.32rem .72rem;border-radius:8px;font-size:.74rem;font-family:inherit;font-weight:600;transition:all .18s;display:flex;align-items:center;gap:.3rem;white-space:nowrap;flex-shrink:0}',
      '.zikb-clear-results-btn:hover{background:#c24a00;color:#fff;border-color:#c24a00;box-shadow:0 2px 6px rgba(194,74,0,.2)}',
      '.zikb-intent-tag{display:inline-block;padding:.18rem .55rem;background:rgba(232,93,4,.1);color:#c24a00;font-size:.72rem;font-weight:600;border-radius:6px;margin-bottom:.75rem;text-transform:uppercase;letter-spacing:.35px}',
      '.zikb-ia-section{margin:1px 0 2px}',
      '.zikb-section-label{font-size:12px;font-weight:700;color:#2d2a26;margin:2px 0 2px;text-transform:uppercase;letter-spacing:.5px;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 12px;border-top:none;background:linear-gradient(135deg,#f8f6f3 0%,#fff 50%,#fff8f5 100%);border:1.5px solid #e8e4df;border-radius:12px;user-select:none;box-shadow:0 1px 4px rgba(0,0,0,.03);transition:all .15s}',
      '.zikb-section-label:hover{border-color:#d4cdc5;box-shadow:0 2px 8px rgba(0,0,0,.05)}',
      '.zikb-section-label-static{justify-content:flex-start;gap:8px}',
      '.zikb-section-count{font-size:.72rem;color:#8a6d5a;font-weight:600;background:rgba(232,93,4,.07);padding:2px 9px;border-radius:999px}',
      '.zikb-section-label:first-child{margin-top:0}',
      '.zikb-accordion-label{width:100%;border:1.5px solid #e8e4df;cursor:pointer;text-align:left}',
      '.zikb-accordion-chevron{display:inline-flex;align-items:center;margin-left:auto;opacity:.6;transition:opacity .15s}',
      '.zikb-section-label:hover .zikb-accordion-chevron{opacity:1}',
      '.zikb-accordion-chevron svg{width:14px;height:14px;transition:transform .2s ease}',
      '.zikb-accordion-label[aria-expanded="false"] .zikb-accordion-chevron svg{transform:rotate(180deg)}',
      '.zikb-accordion-body{overflow:hidden;transition:max-height .2s ease,opacity .2s ease;max-height:3200px;opacity:1;margin-top:1px}',
      '.zikb-accordion-body.zikb-collapsed{max-height:0;opacity:0;margin:0!important;padding:0}',
      '.zikb-result{display:block;padding:10px 12px;background:#fff;border:1.5px solid #e8e4df;border-radius:12px;text-decoration:none;transition:all .2s cubic-bezier(.4,0,.2,1);position:relative}',
      '.zikb-result:hover{background:linear-gradient(135deg,#fff8f5,#fff);border-color:#e85d04;box-shadow:0 4px 14px rgba(232,93,4,.1);transform:translateY(-1px)}',
      '.zikb-result:active{transform:translateY(0)}',
      '.zikb-result.kb{border-left:4px solid ' + btnColor + '}.zikb-result.community{border-left:4px solid #f26322}',
      '.zikb-result-title{font-size:13.5px;font-weight:600;color:#2d2a26;margin-bottom:5px;line-height:1.35}',
      '.zikb-result-snippet{font-size:12.5px;color:#555;line-height:1.55;max-height:72px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;word-break:break-word;transition:max-height .35s cubic-bezier(.4,0,.2,1)}',
      '.zikb-result:hover .zikb-result-snippet,.zikb-result:focus-within .zikb-result-snippet{max-height:12em;-webkit-line-clamp:unset;overflow-y:auto;scrollbar-width:thin;scrollbar-color:rgba(232,93,4,.2) transparent}',
      '.zikb-result:hover .zikb-result-snippet::-webkit-scrollbar{width:3px}',
      '.zikb-result:hover .zikb-result-snippet::-webkit-scrollbar-thumb{background:rgba(232,93,4,.2);border-radius:2px}',
      '.zikb-result-meta{display:flex;align-items:center;gap:.35rem;margin-top:.4rem;flex-wrap:wrap}',
      '.zikb-badge{display:inline-flex;align-items:center;gap:.2rem;padding:.15rem .45rem;font-size:.68rem;font-weight:600;border-radius:4px;line-height:1.3}',
      '.zikb-badge-solved{background:#d4edda;color:#155724}.zikb-badge-section{background:#e8f0fe;color:#1a56db}',
      '.zikb-badge-score{background:#f0ebff;color:#5b21b6;font-variant-numeric:tabular-nums}',
      'mark.zikb-hl-exact{background:#fff3cd;color:#7c6a00;padding:0 .1rem;border-radius:2px}',
      'mark.zikb-hl-partial{background:#fce8d4;color:#9a5a00;padding:0 .1rem;border-radius:2px}',
      'mark.zikb-hl-synonym{background:#d4e8fc;color:#1a4a8a;padding:0 .1rem;border-radius:2px}',
      '.zikb-expand{margin-top:.5rem;background:linear-gradient(135deg,#faf8f5,#fff);border:1.5px solid #f0e6dd;border-radius:12px;padding:.9rem;font-size:.82rem;color:#444;line-height:1.65;display:none;max-height:240px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:rgba(232,93,4,.25) transparent;animation:zikb-expandIn .35s cubic-bezier(.4,0,.2,1);box-shadow:inset 0 1px 3px rgba(0,0,0,.04)}',
      '.zikb-expand.open{display:block}',
      '@keyframes zikb-expandIn{from{opacity:0;max-height:0;transform:translateY(-4px)}to{opacity:1;max-height:240px;transform:translateY(0)}}',
      '.zikb-expand::-webkit-scrollbar{width:4px}',
      '.zikb-expand::-webkit-scrollbar-thumb{background:rgba(232,93,4,.25);border-radius:2px}',
      '.zikb-expand-toggle{font-size:.75rem;color:#c24a00;cursor:pointer;text-decoration:underline;margin-top:.3rem;display:inline-block}',
      '.zikb-fb{display:flex;gap:.3rem;margin-top:.35rem}',
      '.zikb-fb-btn{padding:.18rem .45rem;background:#f5f3f0;border:1.5px solid #e8e4df;border-radius:5px;font-size:.68rem;cursor:pointer;color:#888;transition:all .18s}',
      '.zikb-fb-btn:hover{border-color:#e85d04;color:#c24a00;background:#fff8f5}',
      '.zikb-fb-btn.active-up{background:#d4edda;color:#155724;border-color:#28a745}',
      '.zikb-fb-btn.active-down{background:#f8d7da;color:#721c24;border-color:#dc3545}',
      '.zikb-more-btn{padding:.55rem;background:#f5f3f0;border:1.5px solid #e8e4df;border-radius:10px;color:#5a5652;font-size:.8rem;text-align:center;cursor:pointer;transition:all .18s;font-weight:500}',
      '.zikb-more-btn:hover{background:#fff8f5;color:#c24a00;border-color:#e85d04;box-shadow:0 2px 6px rgba(232,93,4,.1)}',
      '.zikb-link{display:block;padding:.7rem 1rem;background:#fff;border:1.5px solid #e8e4df;border-radius:10px;color:#c24a00;font-size:.86rem;text-decoration:none;transition:all .18s;margin-top:.4rem}',
      '.zikb-link:hover{background:#fff8f5;border-color:#e85d04;box-shadow:0 2px 8px rgba(232,93,4,.08)}.zikb-link.ticket{border-left:4px solid #d35400}',
      '.zikb-divider{border:0;border-top:1.5px solid #efe9e3;margin:.25rem 0}',
      '.zikb-resource-masonry{display:flex;gap:8px;align-items:stretch;overflow-x:auto;padding-bottom:4px;scrollbar-width:thin;scrollbar-color:rgba(232,93,4,.12) transparent;scroll-snap-type:x proximity}',
      '.zikb-resource-masonry::-webkit-scrollbar{height:3px}.zikb-resource-masonry::-webkit-scrollbar-thumb{background:rgba(232,93,4,.12);border-radius:2px}',
      '.zikb-resource-masonry .zikb-ia-section{margin:0;flex:1 1 calc(50% - 4px);min-width:calc(50% - 4px);scroll-snap-align:start}',
      '.zikb-horizontal-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));align-items:stretch;gap:8px;overflow:visible;padding:6px 0 2px}',
      '.zikb-horizontal-actions{grid-template-columns:repeat(2,minmax(0,1fr))}',
      '.zikb-horizontal-guides{grid-template-columns:repeat(2,minmax(0,1fr))}',
      '.zikb-qa-link{display:flex;align-items:center;gap:8px;padding:7px 9px;border-radius:10px;text-decoration:none;color:#2d2a26;transition:all .18s;margin:0;min-width:0;background:#fff;border:1.5px solid #e8e4df}',
      '.zikb-qa-link:hover{background:#fff8f5;border-color:#e7b08f;transform:translateY(-1px)}',
      '.zikb-qa-link:active{transform:translateY(0)}',
      '.zikb-qa-icon{width:28px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0}',
      '.zikb-qa-icon.community{background:linear-gradient(135deg,#f26322,#e85d04);color:#fff}',
      '.zikb-qa-icon.ticket{background:linear-gradient(135deg,#d35400,#b34700);color:#fff}',
      '.zikb-qa-icon svg{width:15px;height:15px}',
      '.zikb-qa-text{flex:1;line-height:1.35}',
      '.zikb-qa-text strong{display:block;font-size:12.5px;font-weight:600;color:#2d2a26}',
      '.zikb-qa-text small{font-size:11px;color:#888;font-weight:400}',
      '.zikb-qa-arrow{opacity:.3;flex-shrink:0;transition:all .18s}',
      '.zikb-qa-arrow svg{width:13px;height:13px}',
      '.zikb-qa-link:hover .zikb-qa-arrow{opacity:.8;color:#e85d04;transform:translateX(2px)}',
      '.zikb-qa-inline{display:flex;align-items:center;gap:8px;padding:10px 12px;background:linear-gradient(135deg,#fff8f2,#fff);border:1.5px solid #f0dfd2;border-radius:12px;overflow-x:auto;scrollbar-width:none}',
      '.zikb-qa-inline::-webkit-scrollbar{display:none}',
      '.zikb-qa-inline-label{display:inline-flex;align-items:center;gap:5px;color:#c24a00;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.3px;white-space:nowrap;flex-shrink:0}',
      '.zikb-qa-chip{display:inline-flex;align-items:center;gap:5px;padding:7px 12px;background:#fff;border:1.5px solid #e8ddd3;border-radius:10px;color:#5a4a3e;font-size:12px;font-weight:600;text-decoration:none;white-space:nowrap;flex-shrink:0;transition:all .18s ease;box-shadow:0 1px 3px rgba(0,0,0,.03)}',
      '.zikb-qa-chip:hover{border-color:#e85d04;color:#c24a00;background:#fff8f3;box-shadow:0 2px 8px rgba(232,93,4,.1);transform:translateY(-1px)}',
      '.zikb-qa-chip svg{width:12px;height:12px;flex-shrink:0}',
      '.zikb-guide-item{display:flex;align-items:center;gap:8px;padding:7px 9px;border-radius:10px;text-decoration:none;color:#2d2a26;font-size:12.5px;transition:all .18s;border:1.5px solid #e8e4df;min-width:0;background:#fff;margin:0}',
      '.zikb-guide-item:hover{background:#fff8f5;border-color:' + btnColor + ';transform:translateY(-1px)}',
      '.zikb-guide-icon{color:' + btnColor + ';flex-shrink:0;opacity:.7}',
      '.zikb-guide-icon svg{width:14px;height:14px}',
      '.zikb-guide-text{flex:1;display:flex;align-items:center;gap:.4rem;flex-wrap:wrap}',
      '.zikb-guide-tag{display:inline-block;padding:.1rem .4rem;background:rgba(232,93,4,.08);color:#c24a00;font-size:.65rem;font-weight:600;border-radius:3px;text-transform:uppercase;letter-spacing:.3px}',
      '.zikb-guide-item:hover .zikb-qa-arrow{opacity:.8;color:' + btnColor + '}',
      '.zikb-no-match{background:#fff8f5;border:1.5px solid #fce8d4;border-radius:12px;padding:.7rem .9rem;margin-bottom:4px}',
      '.zikb-no-match strong{display:block;font-size:.88rem;color:#c24a00;margin-bottom:.4rem}',
      '.zikb-no-match p{font-size:.82rem;color:#666;margin:0 0 .5rem}',
      '.zikb-no-section-results{font-size:.8rem;color:#999;font-style:italic;padding:.5rem 0 .25rem}',
      '.zikb-low-conf{background:#fff8f5;border:1.5px solid #fce8d4;border-radius:12px;padding:.7rem .9rem;margin-bottom:4px}',
      '.zikb-low-conf-title{font-size:.85rem;font-weight:600;color:#c24a00;margin-bottom:.5rem}',
      '.zikb-suggest-list{display:flex;flex-wrap:wrap;gap:5px;padding:4px 0 4px}',
      '.zikb-suggest-btn{display:inline-block;padding:.35rem .7rem;background:#fff;border:1.5px solid #e8e4df;border-radius:8px;color:#5a5652;font-size:.8rem;cursor:pointer;transition:all .18s;box-shadow:0 1px 3px rgba(0,0,0,.03)}',
      '.zikb-suggest-btn:hover{border-color:#e85d04;color:#c24a00;background:#fff8f5;box-shadow:0 2px 8px rgba(232,93,4,.1);transform:translateY(-1px)}',
      '.zikb-loading{text-align:center;padding:1.5rem;color:#888}.zikb-loading-dot{display:inline-block;width:6px;height:6px;background:#ccc;border-radius:50%;margin:0 2px;animation:zikb-b .8s infinite}',
      '.zikb-loading-dot:nth-child(2){animation-delay:.15s}.zikb-loading-dot:nth-child(3){animation-delay:.3s}',
      '@keyframes zikb-b{0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}',
      '.zikb-match-nav{display:flex;align-items:center;gap:.25rem;margin-top:.3rem;flex-wrap:wrap}',
      '.zikb-match-nav-btn{padding:.12rem .35rem;background:#f5f3f0;border:1px solid #e8e4df;border-radius:3px;color:#888;font-size:.68rem;cursor:pointer;text-decoration:none}',
      '.zikb-match-nav-btn:hover{color:#c24a00;border-color:#e85d04}',
      '.zikb-index-warn{background:#fef3cd;border:1.5px solid #ffc107;border-radius:12px;padding:.8rem .9rem;margin-bottom:8px;font-size:.82rem;color:#856404}',
      '.zikb-index-warn strong{display:block;margin-bottom:.25rem}',
      '.zikb-index-loading{padding:.6rem;font-size:.82rem;color:#666}',
      '.zikb-index-loading svg{width:14px;height:14px;vertical-align:middle;margin-right:.35rem;animation:zikb-spin .7s linear infinite}',
      '#zikb-reload-btn{background:0;border:0;color:rgba(255,255,255,.9);cursor:pointer;padding:.2rem .4rem;border-radius:4px;display:flex;align-items:center;gap:.25rem;font-size:.72rem;font-family:inherit;transition:background .15s}',
      '#zikb-reload-btn:hover{background:rgba(255,255,255,.15)}',
      '#zikb-reload-btn.zikb-spinning svg{animation:zikb-spin .7s linear}',
      '@keyframes zikb-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}',
      '.zikb-section-results{overflow:visible}',
      '.zikb-section-results-scroll{max-height:none;overflow:visible;padding-right:0}',
      '.zikb-recent-list{display:flex;flex-wrap:wrap;gap:5px;padding:4px 0 0}',
      '@media(max-width:700px){.zikb-resource-masonry .zikb-ia-section{min-width:calc(50% - 4px)}.zikb-horizontal-list{grid-template-columns:1fr}}',
      '@media(max-width:480px){.zikb-resource-grid{grid-template-columns:1fr}}',
      '*:focus-visible{outline:2px solid ' + btnColor + ';outline-offset:2px;border-radius:3px}',
      '.zikb-result:focus-within{border-color:' + btnColor + ';box-shadow:0 0 0 2px rgba(232,93,4,.12)}',
      '.zikb-skip-link{position:absolute;top:-40px;left:0;background:' + btnColor + ';color:#fff;padding:.5rem 1rem;z-index:100;font-size:.85rem;border-radius:0 0 6px 0;transition:top .2s}',
      '.zikb-skip-link:focus{top:0}',
      '.zikb-error-panel{background:#fef3f2;border:1.5px solid #f5c2c0;border-radius:12px;padding:.9rem 1rem;margin-bottom:8px}',
      '.zikb-error-panel strong{display:block;color:#991b1b;font-size:.88rem;margin-bottom:.4rem}',
      '.zikb-error-panel p{font-size:.82rem;color:#7f1d1d;margin:0 0 .5rem}',
      '.zikb-retry-btn{padding:.35rem .7rem;background:#e85d04;color:#fff;border:none;border-radius:6px;font-size:.8rem;cursor:pointer;font-family:inherit}',
      '.zikb-retry-btn:hover{background:#d35400}',
      '.zikb-status-bar{display:flex;align-items:center;gap:.3rem;padding:.3rem .6rem;font-size:.68rem;border-radius:4px;margin-bottom:.5rem}',
      '.zikb-status-online{background:#d4edda;color:#155724}',
      '.zikb-status-offline{background:#f8d7da;color:#721c24}',
      '.zikb-status-loading{background:#fff3cd;color:#856404}',
      '.zikb-kbd-hint{font-size:.65rem;color:rgba(255,255,255,.6);margin-left:.25rem}',
      '.zikb-powered{text-align:center;padding:.32rem .6rem .38rem;font-size:.68rem;color:#bbb;border-top:1.5px solid #f0eeeb;background:#fafaf8;border-radius:0 0 20px 20px;flex:0 0 auto;line-height:1.2}',
      '@media(prefers-reduced-motion:reduce){#zikb-panel,#zikb-toggle,.zikb-result,.zikb-section-results{transition:none!important;animation:none!important}}',
      '.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}',
      '.zikb-spell{background:#e8f4fd;border:1.5px solid #b3d7f0;border-radius:12px;padding:.65rem .9rem;margin-bottom:8px;font-size:.82rem;color:#1a5276}',
      '.zikb-spell-link{color:#c24a00;cursor:pointer;font-weight:600;text-decoration:underline}',
      '.zikb-spell-link:hover{color:#e85d04}',
      '.zikb-spell-orig{color:#888;font-size:.75rem;font-style:italic}',
      '#zikb-panel.zikb-panel-dragging{opacity:.92;box-shadow:0 12px 48px rgba(0,0,0,.25);transition:none}',
      '#zikb-header .zikb-grip{opacity:.4;margin-right:.25rem;display:flex;align-items:center}',
      '#zikb-header:hover .zikb-grip{opacity:.7}'
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
      chat:'<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/><circle cx="8.5" cy="11.5" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="11.5" r="1" fill="currentColor" stroke="none"/><circle cx="15.5" cy="11.5" r="1" fill="currentColor" stroke="none"/></svg>',
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
      thumbDown:'<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/></svg>',
      star:'<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
      externalLink:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
      clipboard:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>',
      chevronDown:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>',
      chevronUp:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>',
      grip:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1.5" fill="currentColor"/><circle cx="15" cy="5" r="1.5" fill="currentColor"/><circle cx="9" cy="12" r="1.5" fill="currentColor"/><circle cx="15" cy="12" r="1.5" fill="currentColor"/><circle cx="9" cy="19" r="1.5" fill="currentColor"/><circle cx="15" cy="19" r="1.5" fill="currentColor"/></svg>',
      minimize:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="6" y1="12" x2="18" y2="12"/></svg>',
      maximize:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></svg>',
      restore:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="14" height="14" rx="2"/><path d="M7 5V3h14v14h-2"/></svg>',
      enter:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 10l-5 5 5 5"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/></svg>',
      collapseAll:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/></svg>',
      expandAll:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/></svg>'
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

    var html = '<article class="zikb-result ' + cssType + '"' +
      ' role="listitem" tabindex="0"' +
      ' data-article-id="' + esc(article.id) + '"' +
      ' data-article-url="' + esc(article.url) + '"' +
      ' data-anchor-id="' + esc(anchor) + '"' +
      ' data-relevance-score="' + esc(String(r.normalizedScore.toFixed(3))) + '"' +
      ' data-match-type="' + esc(cssType) + '"' +
      ' data-solved="' + (article.solved ? 'true' : 'false') + '"' +
      ' data-idx="' + idx + '"' +
      ' aria-label="' + esc(article.title || 'Result') + ' - ' + scoreDisplay + '% match">';
    html += '<a href="' + esc(deepUrl) + '" target="_blank" rel="noopener" class="zikb-result-link" data-article-id="' + esc(article.id) + '" style="text-decoration:none;color:inherit;display:block">';
    html += '<div class="zikb-result-title">' + highlightWithTypes(article.title || 'Untitled', keywords, synonymList) + '</div>';

    if (snippetText) {
      html += '<div class="zikb-result-snippet">' + highlightWithTypes(snippetText, keywords, synonymList) + '</div>';
    }

    var productLabel = (article.product || 'general').replace(/-/g, ' ');
    productLabel = productLabel.charAt(0).toUpperCase() + productLabel.slice(1);
    var sectionLabel = '';
    if (article.url && /release-notes/i.test(article.url)) sectionLabel = 'Release Notes';
    else if (article.url && /getting-started/i.test(article.url)) sectionLabel = 'Getting Started';

    html += '<div class="zikb-result-meta">';
    html += '<span class="zikb-badge zikb-badge-score">' + scoreDisplay + '% match</span>';
    html += '<span class="zikb-badge" style="background:#eef5ff;color:#1f4f93">' + esc(productLabel) + '</span>';
    if (sectionLabel) html += '<span class="zikb-badge" style="background:#fff0e6;color:#b45309">' + esc(sectionLabel) + '</span>';
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

    html += '<div class="zikb-fb" role="group" aria-label="Rate this result">';
    html += '<button class="zikb-fb-btn" data-fb="up" data-aid="' + esc(article.id) + '" aria-label="Mark as helpful" data-tooltip="Helpful">' + svgIcon('thumbUp') + ' <span class="sr-only">Helpful</span></button>';
    html += '<button class="zikb-fb-btn" data-fb="down" data-aid="' + esc(article.id) + '" aria-label="Mark as not helpful" data-tooltip="Not helpful">' + svgIcon('thumbDown') + '</button>';
    html += '</div>';

    html += '</article>';
    return html;
  }

  function showLoading() {
    _resultsEl.innerHTML = '<div class="zikb-loading"><span class="zikb-loading-dot"></span><span class="zikb-loading-dot"></span><span class="zikb-loading-dot"></span></div>';
  }

  function clearResultsView() {
    if (_resultsEl) {
      _resultsEl.innerHTML = '';
      _resultsEl.classList.remove('zikb-results-fading');
    }
    var body = _panel ? _panel.querySelector('#zikb-body') : null;
    if (body) body.scrollTop = 0;
  }

  function renderResults(query, isAutoCorrect) {
    var q = sanitizeQuery(query);
    if (!q) { renderWelcome(); return; }

    clearResultsView();

    _lastQuery = q;
    if (!isAutoCorrect) addHistory(q);

    var intent = classifyIntent(q);
    var hasIndex = _indexLoaded && _contentIndex && _contentIndex.articles && _contentIndex.articles.length > 0;
    var html = '';

    if (!hasIndex) {
      if (!_indexLoaded && _BUILTIN_INDEX && _BUILTIN_INDEX.articles) {
        applyIndexData(_BUILTIN_INDEX);
        applyConfidenceConfig(_BUILTIN_INDEX.confidenceConfig);
        hasIndex = true;
      }
    }
    if (!hasIndex) {
      if (_indexLoadError) {
        html += '<div class="zikb-error-panel">';
        html += '<strong>' + svgIcon('alert') + ' Content index failed to load</strong>';
        html += '<p>Could not retrieve the content index. Check your connection and try again.</p>';
        html += '<button class="zikb-retry-btn" onclick="window.elbHelpBotReload()">' + svgIcon('reload') + ' Retry</button>';
        html += '</div>';
      } else {
        html += '<div class="zikb-index-warn">';
        html += '<strong>Initializing content index\u2026</strong>';
        html += '<button class="zikb-retry-btn" onclick="window.elbHelpBotReload()" style="margin-top:.5rem">' + svgIcon('reload') + ' Retry</button>';
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
    var queryDetected = searchResult.queryDetectedProduct;
    var resultInferred = inferProductFromResults(allValid, 5);
    var starredProduct;
    if (queryDetected) {
      starredProduct = queryDetected;
    } else if (resultInferred) {
      starredProduct = resultInferred;
    } else {
      starredProduct = _product || 'general';
    }
    debugLog('PRODUCT-CONTEXT', { configuredProduct: _product, queryDetected: queryDetected, resultInferred: resultInferred, starredProduct: starredProduct });

    var topOrigNorm = allValid.length > 0 ? allValid[0].normalizedScore : 0;
    if (correctedQuery && !isAutoCorrect && allValid.length === 0) {
      var correctedResult = searchIndex(correctedQuery, _product);
      if (correctedResult.all.length > 0) {
        kbResults = correctedResult.kb;
        communityResults = correctedResult.community;
        allValid = correctedResult.all;
        var correctedDetected = correctedResult.queryDetectedProduct;
        var correctedInferred = correctedDetected || inferProductFromResults(allValid, 5);
        if (correctedInferred) starredProduct = correctedInferred;
        debugLog('AUTO-CORRECT', { original: q, corrected: correctedQuery, resultsFound: allValid.length, inferredProduct: correctedInferred });
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
    var topExactSignal = allValid.length > 0 ? (allValid[0].exactSignal || 0) : 0;
    var topHardBoostTier = allValid.length > 0 ? (allValid[0].hardBoostTier || 0) : 0;
    var confidence = topNormalized >= HIGH_CONFIDENCE ? 'high' : (topNormalized >= MEDIUM_CONFIDENCE ? 'medium' : 'low');
    if ((topExactSignal > 0 || topHardBoostTier > 0) && confidence === 'low') confidence = 'medium';

    debugLog('CONFIDENCE', { topNormalized: topNormalized, confidence: confidence, thresholds: { high: HIGH_CONFIDENCE, medium: MEDIUM_CONFIDENCE } });

    var totalResults = allValid.length;
    html += '<div class="zikb-clear-results-bar">';
    html += '<span class="zikb-clear-results-info">';
    html += '<span class="zikb-intent-tag" style="margin:0">' + esc(intent.label) + '</span>';
    html += '<span class="zikb-clear-results-query" title="' + esc(q) + '">\u201c' + esc(q) + '\u201d</span>';
    html += '<span class="zikb-clear-results-count">' + totalResults + ' result' + (totalResults !== 1 ? 's' : '') + '</span>';
    html += '</span>';
    html += '<button class="zikb-clear-results-btn" data-action="clear-results">' + svgIcon('clear') + ' Clear</button>';
    html += '</div>';

    if (spellSuggestions && correctedQuery && !((topExactSignal > 0 || topHardBoostTier > 0) && allValid.length > 0)) {
      html += '<div class="zikb-spell">' + svgIcon('search') + ' Did you mean: <span class="zikb-spell-link" data-suggest="' + esc(correctedQuery) + '">' + esc(correctedQuery) + '</span>';
      if (allValid.length > 0 && searchResult.all.length === 0) {
        html += ' <span class="zikb-spell-orig">(showing results for corrected query)</span>';
      }
      html += '</div>';
    }

    html += '<div class="zikb-view-tabs" role="tablist" aria-label="Search result sections">';
    html += '<button class="zikb-view-tab active" type="button" role="tab" data-view-tab="all" aria-selected="true">All</button>';
    html += '<button class="zikb-view-tab" type="button" role="tab" data-view-tab="kb" aria-selected="false">Knowledge Base</button>';
    html += '<button class="zikb-view-tab" type="button" role="tab" data-view-tab="community" aria-selected="false">Community</button>';
    html += '<button class="zikb-view-tab" type="button" role="tab" data-view-tab="resources" aria-selected="false">Quick Actions & Guides</button>';
    html += '</div>';
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
      trackZeroResult(q);
    } else if (confidence === 'low') {
      var suggestions2 = suggestRephrased(q, intent);
      html += '<div class="zikb-low-conf"><div class="zikb-low-conf-title">' + svgIcon('alert') + ' Low confidence matches</div>';
      if (suggestions2.length > 0) {
        html += '<div style="font-size:.8rem;color:#666;margin-bottom:.4rem">Try rephrasing:</div>';
        suggestions2.forEach(function (s) { html += '<span class="zikb-suggest-btn" data-suggest="' + esc(s) + '">' + esc(s) + '</span>'; });
      }
      html += '</div>';
    }

    var resultLimit = Math.max(MAX_RESULTS, kbResults.length, communityResults.length);
    var kbLimit = Math.min(kbResults.length, resultLimit);
    var commLimit = Math.min(communityResults.length, resultLimit);

    var allLimit = Math.min(allValid.length, resultLimit);
    html += '<section class="zikb-ia-section zikb-ia-unified zikb-tab-target zikb-tab-all" role="region" aria-label="All Results">';
    html += '<button class="zikb-section-label zikb-accordion-label" type="button" role="heading" aria-level="3" data-accordion-target="unified-section" aria-expanded="true">' + svgIcon('search') + ' All Results &mdash; Ranked by Relevance <span class="zikb-section-count">(' + allValid.length + ')</span><span class="zikb-accordion-chevron">' + svgIcon('chevronUp') + '</span></button>';
    html += '<div class="zikb-section-results zikb-accordion-body" id="unified-section" role="list" aria-label="All results ranked by relevance"><div class="zikb-section-results-scroll">';
    if (allValid.length > 0) {
      for (var u = 0; u < allLimit; u++) {
        var uType = (allValid[u].article.type || 'kb').toLowerCase() === 'community' ? 'community' : 'kb';
        html += renderResultCard(allValid[u], keywords, synonymList, uType, u);
      }
      if (allValid.length > allLimit) {
        html += '<div class="zikb-more-btn" data-action="show-more-all" data-start-from="' + allLimit + '" role="button" tabindex="0">Show ' + (allValid.length - allLimit) + ' more results</div>';
      }
    } else {
      html += '<div class="zikb-no-section-results">No results matched this query.</div>';
    }
    html += '</div></div></section>';

    html += '<section class="zikb-ia-section zikb-ia-kb zikb-tab-target zikb-tab-kb" role="region" aria-label="Knowledge Base Articles">';
    html += '<button class="zikb-section-label zikb-accordion-label" type="button" role="heading" aria-level="3" data-accordion-target="kb-section" aria-expanded="true">' + svgIcon('book') + ' Knowledge Base Articles <span class="zikb-section-count">(' + kbResults.length + ')</span><span class="zikb-accordion-chevron">' + svgIcon('chevronUp') + '</span></button>';
    html += '<div class="zikb-section-results zikb-accordion-body" id="kb-section" role="list" aria-label="Knowledge Base results"><div class="zikb-section-results-scroll">';
    if (kbResults.length > 0) {
      for (var i = 0; i < kbLimit; i++) html += renderResultCard(kbResults[i], keywords, synonymList, 'kb', i);
      if (kbResults.length > kbLimit) {
        html += '<div class="zikb-more-btn" data-action="show-more-kb" data-start-from="' + kbLimit + '" role="button" tabindex="0">Show ' + (kbResults.length - kbLimit) + ' more KB articles</div>';
      }
    } else {
      html += '<div class="zikb-no-section-results">No KB articles matched this query.</div>';
    }
    html += '</div></div></section>';

    html += '<section class="zikb-ia-section zikb-ia-community zikb-tab-target zikb-tab-community" role="region" aria-label="Community Posts, Replies, and Topics">';
    html += '<button class="zikb-section-label zikb-accordion-label" type="button" role="heading" aria-level="3" data-accordion-target="comm-section" aria-expanded="true">' + svgIcon('users') + ' Community Posts / Replies / Topics <span class="zikb-section-count">(' + communityResults.length + ')</span><span class="zikb-accordion-chevron">' + svgIcon('chevronUp') + '</span></button>';
    html += '<div class="zikb-section-results zikb-accordion-body" id="comm-section" role="list" aria-label="Community results"><div class="zikb-section-results-scroll">';
    if (communityResults.length > 0) {
      for (var j = 0; j < commLimit; j++) html += renderResultCard(communityResults[j], keywords, synonymList, 'community', 100 + j);
      if (communityResults.length > commLimit) {
        html += '<div class="zikb-more-btn" data-action="show-more-comm" data-start-from="' + commLimit + '" role="button" tabindex="0">Show ' + (communityResults.length - commLimit) + ' more threads</div>';
      }
    } else {
      html += '<div class="zikb-no-section-results">No Community threads matched this query.</div>';
    }
    html += '</div></div></section>';

    html += buildQuickActionsSection(starredProduct, _config, { compact: false, collapsedByDefault: true, idPrefix: 'sr-top', query: q });
    html += buildQuickGuidesSection(starredProduct, _config, q, { compact: false, collapsedByDefault: true, idPrefix: 'sr-top' });

    html += renderRecentSearchesSection(5, { idPrefix: 'sr', collapsedByDefault: true });

    debugLog('RENDERED-URLS', allValid.slice(0, MAX_RESULTS).map(function (r) {
      return { id: r.article.id, url: r.article.url, normalized: r.normalizedScore };
    }));

    _resultsEl.classList.remove('zikb-results-fading');
    _resultsEl.innerHTML = html;
    bindResultActions(q);
    reportAnalytics(q, intent);
  }

  function renderWelcome() {
    var p = getProductConfig(_product, _config);
    var html = '';
    if (_resultsEl) _resultsEl.classList.remove('zikb-results-fading');
    var body = _panel ? _panel.querySelector('#zikb-body') : null;
    if (body) body.scrollTop = 0;
    var recentSectionHtml = renderRecentSearchesSection(5, { idPrefix: 'welcome', collapsedByDefault: true });
    if (recentSectionHtml) {
      html += recentSectionHtml;
      html += '<hr class="zikb-divider">';
    }

    var defaultQueries = ['How to publish a course', 'SCORM package error', 'Getting started with ' + esc(p.label)];
    html += '<section class="zikb-ia-section zikb-ia-suggested" role="region" aria-label="Suggested Queries">';
    html += '<button class="zikb-section-label zikb-accordion-label" type="button" data-accordion-target="welcome-suggested-body" aria-expanded="false">' + svgIcon('search') + ' Suggested Queries <span class="zikb-accordion-chevron">' + svgIcon('chevronUp') + '</span></button>';
    html += '<div class="zikb-accordion-body zikb-collapsed" id="welcome-suggested-body">';
    html += '<div class="zikb-suggest-list">';
    defaultQueries.forEach(function (dq) {
      html += '<span class="zikb-suggest-btn" data-suggest="' + esc(dq) + '">' + esc(dq) + '</span>';
    });
    html += '</div></div></section>';

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
      } else if (!_indexLoaded && !(_BUILTIN_INDEX && _BUILTIN_INDEX.articles)) {
        html += '<div class="zikb-index-warn" style="margin-top:.75rem">';
        html += '<strong>Initializing\u2026</strong>';
        html += '<button class="zikb-retry-btn" onclick="window.elbHelpBotReload()" style="margin-top:.5rem">' + svgIcon('reload') + ' Retry</button>';
        html += '</div>';
      }
    }

    html += buildQuickActionsSection(_product, _config, { compact: false, collapsedByDefault: true, idPrefix: 'welcome', query: '' });
    html += buildQuickGuidesSection(_product, _config, '', { compact: false, collapsedByDefault: true, idPrefix: 'welcome' });

    _resultsEl.innerHTML = html;
    bindResultActions('');
  }

  function bindResultActions(currentQuery) {
    _resultsEl.querySelectorAll('[data-action="clear-results"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        _input.value = '';
        if (_debounceTimer) { clearTimeout(_debounceTimer); _debounceTimer = null; }
        _lastQuery = '';
        clearResultsView();
        renderWelcome();
        _input.focus();
      });
    });

    _resultsEl.querySelectorAll('[data-suggest]').forEach(function (btn) {
      btn.addEventListener('click', function () { _input.value = btn.getAttribute('data-suggest'); doSearch(); });
    });

    _resultsEl.querySelectorAll('[data-view-tab]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tab = btn.getAttribute('data-view-tab') || 'all';
        _resultsEl.querySelectorAll('[data-view-tab]').forEach(function (b) {
          var active = b === btn;
          b.classList.toggle('active', active);
          b.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        _resultsEl.querySelectorAll('.zikb-tab-target').forEach(function (el) {
          var shouldShow = tab === 'all' || el.classList.contains('zikb-tab-' + tab);
          el.classList.toggle('zikb-hidden', !shouldShow);
        });
      });
    });

    _resultsEl.querySelectorAll('[data-accordion-target]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetId = btn.getAttribute('data-accordion-target');
        var body = targetId ? document.getElementById(targetId) : null;
        if (!body) return;
        var isExpanded = btn.getAttribute('aria-expanded') !== 'false';
        btn.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
        body.classList.toggle('zikb-collapsed', isExpanded);
      });
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

    _resultsEl.querySelectorAll('[data-guide-key]').forEach(function (link) {
      link.addEventListener('click', function () {
        trackQuickGuideUsage(link.getAttribute('data-guide-key'));
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
          var showFrom = parseInt(moreBtn.getAttribute('data-start-from') || String(MAX_RESULTS), 10);
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

    bindMoreBtn('show-more-all', function (sr) { return sr.all; }, 200);
    bindMoreBtn('show-more-kb', function (sr) { return sr.kb; }, 300);
    bindMoreBtn('show-more-comm', function (sr) { return sr.community; }, 500);
  }

  function doSearch() {
    if (_debounceTimer) { clearTimeout(_debounceTimer); _debounceTimer = null; }
    var q = sanitizeQuery(_input.value);
    _input.value = q;
    if (_resultsEl) _resultsEl.classList.remove('zikb-results-fading');
    renderResults(q);
  }

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
        _toggle.setAttribute('aria-label', 'Open ELB Assistant');
        _toggle.setAttribute('data-tooltip', 'ELB Assistant');
        _toggle.innerHTML = svgIcon('chat');
        _panel = document.createElement('div');
        _panel.id = 'zikb-panel'; _panel.setAttribute('role', 'dialog');
        _panel.setAttribute('aria-label', 'ELB Assistant â€” Knowledge Base & Community Help');
        _panel.setAttribute('aria-modal', 'false');
        document.body.appendChild(_toggle); document.body.appendChild(_panel);
        _panel.addEventListener('click', function (e) { e.stopPropagation(); });
        setupDrag(); setupOutsideClick();
      }

      _panel.innerHTML =
        '<a class="zikb-skip-link" href="#zikb-search-input">Skip to search</a>' +
        '<header id="zikb-header" role="banner"><span class="zikb-grip" aria-hidden="true">' + svgIcon('grip') + '</span>' +
        '<span class="zikb-header-title">' + svgIcon('book') + ' ELB Assistant</span>' +
        '<div class="zikb-header-actions">' +
        '<button id="zikb-reload-btn" class="zikb-header-btn" type="button" aria-label="Reload assistant" data-tooltip="Reload">' + svgIcon('reload') + '</button>' +
        '<button id="zikb-minimize-btn" class="zikb-header-btn" type="button" aria-label="Minimize" data-tooltip="Minimize">' + svgIcon('minimize') + '</button>' +
        '<button id="zikb-maximize-btn" class="zikb-header-btn" type="button" aria-label="Maximize" data-tooltip="Maximize">' + svgIcon('maximize') + '</button>' +
        '<button id="zikb-close" class="zikb-header-btn" type="button" aria-label="Close assistant" data-tooltip="Close">' + svgIcon('clear') + '</button>' +
        '</div></header>' +
        '<main id="zikb-body" role="main"><div id="zikb-msg">' + esc(p.welcomeMessage) + '</div>' +
        '<div id="zikb-search-wrap" role="search" aria-label="Search knowledge base">' +
        '<input id="zikb-search-input" type="text" placeholder="Search knowledge base\u2026" autocomplete="off" aria-label="Search knowledge base and community" role="searchbox">' +
        '<button id="zikb-search-btn" type="button" aria-label="Search" data-tooltip="Search">' + svgIcon('search') + '</button></div>' +
        '<div id="zikb-status" aria-live="polite" role="status"></div>' +
        '<div id="zikb-results" role="region" aria-live="polite" aria-label="Search results"></div></main>' +
        '<footer class="zikb-powered" role="contentinfo">ELB Assistant v' + VERSION + ' <span class="zikb-kbd-hint">Ctrl+Shift+H</span></footer>';

      _input = _panel.querySelector('#zikb-search-input');
      _resultsEl = _panel.querySelector('#zikb-results');

      _panel.querySelector('#zikb-search-btn').addEventListener('click', doSearch);
      _input.addEventListener('keydown', function (e) { if (e.key === 'Enter') doSearch(); });
      _input.addEventListener('input', function () {
        var hasText = _input.value.trim().length > 0;

        if (!hasText && _lastQuery) {
          _lastQuery = '';
          if (_debounceTimer) { clearTimeout(_debounceTimer); _debounceTimer = null; }
          clearResultsView();
          renderWelcome();
        } else if (hasText && _lastQuery && _input.value.trim() !== _lastQuery) {
          _lastQuery = '';
          if (_debounceTimer) { clearTimeout(_debounceTimer); _debounceTimer = null; }
          clearResultsView();
          _resultsEl.innerHTML = '<div class="zikb-typing-hint">' + svgIcon('search') + ' Press <kbd>Enter</kbd> or click ' + svgIcon('enter') + ' to search</div>';
        }
      });
      _panel.querySelector('#zikb-close').addEventListener('click', function () {
        _panel.classList.remove('open', 'zikb-minimized', 'zikb-maximized');
        persistPanelState(false);
        _toggle.focus();
      });
      _panel.querySelector('#zikb-minimize-btn').addEventListener('click', function () {
        var isMinimized = _panel.classList.toggle('zikb-minimized');
        _panel.classList.remove('zikb-maximized');
        var minBtn = _panel.querySelector('#zikb-minimize-btn');
        minBtn.innerHTML = isMinimized ? svgIcon('restore') : svgIcon('minimize');
        minBtn.setAttribute('aria-label', isMinimized ? 'Restore' : 'Minimize');
        minBtn.setAttribute('data-tooltip', isMinimized ? 'Restore' : 'Minimize');
      });
      _panel.querySelector('#zikb-maximize-btn').addEventListener('click', function () {
        _panel.classList.remove('zikb-minimized');
        var isMaximized = _panel.classList.toggle('zikb-maximized');
        var maxBtn = _panel.querySelector('#zikb-maximize-btn');
        maxBtn.innerHTML = isMaximized ? svgIcon('restore') : svgIcon('maximize');
        maxBtn.setAttribute('aria-label', isMaximized ? 'Restore size' : 'Maximize');
        maxBtn.setAttribute('data-tooltip', isMaximized ? 'Restore' : 'Maximize');
      });
      _panel.querySelector('#zikb-reload-btn').addEventListener('click', function () { reloadChatbot(); });
      setupPanelDrag();

      if (!_indexLoaded && _BUILTIN_INDEX && _BUILTIN_INDEX.articles) {
        applyIndexData(_BUILTIN_INDEX);
        applyConfidenceConfig(_BUILTIN_INDEX.confidenceConfig);
        debugLog('INDEX-BUILTIN-IMMEDIATE', { version: _BUILTIN_INDEX.version, articles: _BUILTIN_INDEX.articles.length });
      }

      renderWelcome();

      if (getPanelState()) {
        _panel.classList.add('open');
        setTimeout(function () { if (_input) _input.focus(); }, 100);
      }

      _indexUrl = window.elbHelpBotIndexUrl || window.zikbIndexUrl || (config && config.indexUrl) || null;
      var hasInline = window.elbHelpBotInlineIndex && window.elbHelpBotInlineIndex.articles;

      function _bootIndex(url) {
        _indexUrl = url;
        _indexLoading = true;
        updateStatus('loading');
        renderWelcome();
        loadContentIndex(url, function (data) {
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
        if (url && isValidIndexUrl(url)) startReindexPolling(url);
      }

      if ((_indexUrl && isValidIndexUrl(_indexUrl)) || hasInline) {
        _bootIndex(_indexUrl);
      } else {
        debugLog('INDEX-AUTO-DISCOVER', { reason: 'No indexUrl configured â€” probing for content-index.json / elb-help-bot-index.json' });
        _indexLoading = true;
        updateStatus('loading');
        renderWelcome();
        var base = detectScriptBaseUrl();
        var candidates = buildCandidateIndexUrls(base);
        debugLog('INDEX-AUTO-DISCOVER-CANDIDATES', candidates);
        probeIndexUrl(candidates, function (foundUrl, data) {
          if (foundUrl && data) {
            debugLog('INDEX-AUTO-DISCOVERED', { url: foundUrl, articles: data.articles.length });
            window.elbHelpBotIndexUrl = foundUrl;
            applyIndexData(data);
            _indexUrl = foundUrl;
            _indexLoading = false;
            _indexLoadError = false;
            applyConfidenceConfig(data.confidenceConfig);
            updateStatus('online');
            if (_lastQuery) renderResults(_lastQuery);
            else renderWelcome();
            startReindexPolling(foundUrl);
          } else if (_BUILTIN_INDEX && _BUILTIN_INDEX.articles) {
            debugLog('INDEX-BUILTIN-FALLBACK', { reason: 'Auto-discovery failed, using built-in index', articles: _BUILTIN_INDEX.articles.length });
            applyIndexData(_BUILTIN_INDEX);
            _indexLoading = false;
            _indexLoadError = false;
            applyConfidenceConfig(_BUILTIN_INDEX.confidenceConfig);
            updateStatus('online');
            if (_lastQuery) renderResults(_lastQuery);
            else renderWelcome();
          } else {
            _indexLoading = false;
            debugLog('INDEX-MISSING', { reason: 'Auto-discovery failed and no built-in index available.' });
            updateStatus('none');
            renderWelcome();
          }
        });
      }
    });
  }

  /* =================== DRAG (Toggle + Panel) =================== */

  var PANEL_POS_KEY = 'elb-help-bot-panel-pos';

  function setupDrag() {
    var isDrag = false, sx = 0, sy = 0, tx = 0, ty = 0;
    function pos(x, y) {
      var color = ((_config && _config.theme && _config.theme.buttonColor) || '#e85d04');
      _toggle.style.cssText = 'position:fixed;left:' + x + 'px;top:' + y + 'px;right:auto;bottom:auto;width:76px;height:76px;border-radius:50%;background:linear-gradient(145deg,#ff7b2e 0%,#f06410 25%,' + color + ' 50%,#d14800 80%,#b83d00 100%);border:3px solid rgba(255,255,255,.9);color:#fff;cursor:move;box-shadow:0 12px 32px rgba(232,93,4,.42),0 6px 18px rgba(0,0,0,.14),inset 0 2px 4px rgba(255,255,255,.3);z-index:2147483646;display:flex;align-items:center;justify-content:center;user-select:none';
      var panelPos = getPanelSavedPos();
      if (!panelPos) {
        _panel.style.left = Math.min(x, window.innerWidth - 444) + 'px';
        _panel.style.right = 'auto'; _panel.style.bottom = (window.innerHeight - y + 12) + 'px'; _panel.style.top = 'auto';
      }
    }
    try { var raw = JSON.parse(localStorage.getItem(POS_STORAGE_KEY)); if (raw && typeof raw.x === 'number') pos(raw.x, raw.y); } catch (e) { /* */ }

    function start(cx, cy) { isDrag = false; sx = cx; sy = cy; var r = _toggle.getBoundingClientRect(); tx = r.left; ty = r.top; _toggle.classList.add('dragging'); }
    function move(cx, cy) {
      var dx = cx - sx, dy = cy - sy;
      if (!isDrag && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) isDrag = true;
      if (isDrag) pos(Math.max(0, Math.min(window.innerWidth - 76, tx + dx)), Math.max(0, Math.min(window.innerHeight - 76, ty + dy)));
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

  function getPanelSavedPos() {
    try { var r = JSON.parse(localStorage.getItem(PANEL_POS_KEY)); return (r && typeof r.x === 'number') ? r : null; } catch (e) { return null; }
  }

  function setupPanelDrag() {
    var header = _panel.querySelector('#zikb-header');
    if (!header) return;

    var savedPos = getPanelSavedPos();
    if (savedPos) {
      var sx = Math.max(0, Math.min(window.innerWidth - 440, savedPos.x));
      var sy = Math.max(0, Math.min(window.innerHeight - 200, savedPos.y));
      _panel.style.left = sx + 'px';
      _panel.style.top = sy + 'px';
      _panel.style.right = 'auto';
      _panel.style.bottom = 'auto';
    }

    var isDrag = false, startX = 0, startY = 0, origLeft = 0, origTop = 0;

    function panelStart(cx, cy) {
      isDrag = false; startX = cx; startY = cy;
      var rect = _panel.getBoundingClientRect();
      origLeft = rect.left; origTop = rect.top;
      _panel.classList.add('zikb-panel-dragging');
      header.classList.add('zikb-dragging');
    }
    function panelMove(cx, cy) {
      var dx = cx - startX, dy = cy - startY;
      if (!isDrag && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) isDrag = true;
      if (isDrag) {
        var newX = Math.max(0, Math.min(window.innerWidth - 440, origLeft + dx));
        var newY = Math.max(0, Math.min(window.innerHeight - 100, origTop + dy));
        _panel.style.left = newX + 'px';
        _panel.style.top = newY + 'px';
        _panel.style.right = 'auto';
        _panel.style.bottom = 'auto';
      }
    }
    function panelEnd() {
      _panel.classList.remove('zikb-panel-dragging');
      header.classList.remove('zikb-dragging');
      if (isDrag) {
        try {
          var rect = _panel.getBoundingClientRect();
          localStorage.setItem(PANEL_POS_KEY, JSON.stringify({ x: rect.left, y: rect.top }));
        } catch (e) { /* */ }
      }
    }

    header.addEventListener('mousedown', function (e) {
      if (e.target.closest('button')) return;
      if (e.button !== 0) return;
      e.preventDefault();
      panelStart(e.clientX, e.clientY);
      function mm(ev) { ev.preventDefault(); panelMove(ev.clientX, ev.clientY); }
      function mu() { document.removeEventListener('mousemove', mm); document.removeEventListener('mouseup', mu); panelEnd(); }
      document.addEventListener('mousemove', mm); document.addEventListener('mouseup', mu);
    });
    header.addEventListener('touchstart', function (e) {
      if (e.target.closest('button')) return;
      if (e.touches.length !== 1) return;
      panelStart(e.touches[0].clientX, e.touches[0].clientY);
      function tm(ev) { if (ev.touches.length === 1) { ev.preventDefault(); panelMove(ev.touches[0].clientX, ev.touches[0].clientY); } }
      function te() { document.removeEventListener('touchmove', tm); document.removeEventListener('touchend', te); panelEnd(); }
      document.addEventListener('touchmove', tm, { passive: false }); document.addEventListener('touchend', te);
    }, { passive: true });

    window.addEventListener('resize', function () {
      if (!_panel.classList.contains('open')) return;
      var rect = _panel.getBoundingClientRect();
      var maxX = window.innerWidth - 440, maxY = window.innerHeight - 200;
      if (rect.left > maxX || rect.top > maxY) {
        _panel.style.left = Math.max(0, Math.min(maxX, rect.left)) + 'px';
        _panel.style.top = Math.max(0, Math.min(maxY, rect.top)) + 'px';
      }
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

    if (_debounceTimer) { clearTimeout(_debounceTimer); _debounceTimer = null; }
    if (_input) { _input.value = ''; }
    _lastQuery = '';

    clearResultsView();

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
