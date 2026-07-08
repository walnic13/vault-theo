# Ruleset v1.1 — document-grounding + anti-capitulation

Pass 1 VEP · Theo backend · Reviewer Codex · Lint PASS · HEAD 9ced7d7.

Adds the 'DOCUMENTS THE USER PROVIDES — VERIFY, DON'T INFER' block to the Operating Ruleset (v1.0→v1.1): ground claims about uploaded docs (quote the passage; say so if not found; never infer), and re-verify on challenge instead of capitulating. Doc + both handler THEO_RULESET constants updated byte-identical (verified). Deploy: premium=Walter copy-paste, stream=Claude Kudu; then Claude curls. Fixes the two behavior failures on the MicroAGI deal.
