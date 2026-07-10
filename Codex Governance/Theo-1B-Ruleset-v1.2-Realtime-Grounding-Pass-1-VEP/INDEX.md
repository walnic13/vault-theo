# Ruleset v1.2 — real-time / current-facts grounding

Pass 1 VEP · Theo backend · Reviewer Codex · Lint PASS · HEAD 4fcf064.

Adds the 'REAL-TIME & CURRENT FACTS — ALWAYS SEARCH, NEVER RECALL (ALL TOPICS, NOT ONLY TAX)' block to the Operating Ruleset (v1.1→v1.2): for any current / time-varying / externally-verifiable fact (live scores/results, prices, breaking news, weather, elections, "today/now/latest" anything, any topic) Theo MUST use web search this turn and cite, or say it can't verify and offer to look it up — never state a specific invented fact from memory. Generalizes the existing tax-framed GROUNDING gate to all such facts, after a test showed Theo fabricating a live football score. Built FROM the LIVE deployed v1.1 handlers (Golden Handler §5.5); doc + both handler THEO_RULESET constants updated byte-identical (verified, 6643 chars; node --check clean; diff vs LIVE = version line + block only). Deploy: premium=Walter copy-paste, stream=Claude Kudu; then Claude curls.
