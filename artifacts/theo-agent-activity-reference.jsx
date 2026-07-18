// VA-T7 — Theo Agent Activity Rendering Reference (canonical surface; reproduce faithfully, do not
// redesign). The Claude-Code-style live agent view for tool-driven agents. Zero-dependency,
// inline-style, no Tailwind, no browser storage — the VA-T1 / VA-T5 idiom. Two states are shown per
// consumer: (A) RUNNING — a live "activity" panel above the answer that streams the agent's reasoning
// and lists each tool call the instant it fires; (B) DONE — the panel collapses to a one-line summary
// and the tool calls persist as chips on the finished message, with the answer rendered below.
//
// CONSUMERS (both drive the SAME component):
//   1. the Sigma K-1 review agent (`sigma_review_agent_stream`) — states A/B below.
//   2. the general-chat tool-loop (`theo_message_stream`, DR-T11) — states C/D below. First tool:
//      `theo_export_spreadsheet`; the download card (VA-T9) renders after the answer.
//
// Event mapping (SSE → this surface):
//   event: delta {kind:'thinking'} / native thinking_delta → the streaming reasoning line (live cursor)
//   event: delta {kind:'text'} / native text_delta          → the answer body (below the panel)
//   event: tool {name}             → append a tool row (status 'running') + a persistent chip. General
//                                     chat emits this at the tool_use block OPEN (name only, no input),
//                                     so the tool-aware verb shows during the build; Sigma sends {name,input}.
//   event: tool_result {name,ok}   → mark that tool row done (ok ✓ / fail ✕)
//   event: vault_tokens {tokens}   → the live token count in the header (tabular-nums). A running
//                                     CUMULATIVE output-token count (general chat); monotonic
//                                     non-decreasing (never ticks backward). See the two-mode rule below.
//   event: done / event: vault_meta → collapse the panel to its summary; freeze the chips
//
// HEADER VERB (running):
//   - general chat uses a BLEND: a playful verb while only thinking ("Noodling…", "Number-wrangling…"),
//     switching to a context-aware verb once a tool fires ("Building your spreadsheet…").
//   - the Sigma agent uses its review-context verb ("Reviewing <fund>…").
//   Done state uses a factual summary ("Used the spreadsheet export tool" / "Checked <fund> · N tools").
//
// LIVE TOKEN COUNT — TWO-MODE TOGGLE (Claude-Code-style; general chat, via `streaming`):
//   - PROCESSING (the model is WORKING — the thinking/planning phase where it streams its reasoning
//     into the panel, AND the silent tool_use build): the climbing token count IS the progress
//     signal → SHOW it in the header. The reasoning text streams here too; the count still shows.
//   - STREAMING (the final ANSWER text is flowing): the answer is the signal → HIDE the count.
//   So the count shows THROUGHOUT thinking + building and hides ONLY while the answer streams; it
//   returns at DONE (final total). Cycles per turn (think[count] → build[count] → answer[hidden]).
//   The count shows when NOT (running && streaming). (Sigma: no toggle; count always shown.)
//
// Palette (theo-*, inline): bg #FAF9F5, surface #F0EEE6, card #FFFFFF, ink #28261F, ink2 #6B6A63,
// ink3 #94928A, line #E4E1D6, coral #D97757, green #4f7a4a, red #B23A2E.

const C = {
  bg: '#FAF9F5', surface: '#F0EEE6', card: '#FFFFFF', ink: '#28261F', ink2: '#6B6A63',
  ink3: '#94928A', line: '#E4E1D6', coral: '#D97757', green: '#4f7a4a', red: '#B23A2E',
};
const MONO = 'SFMono-Regular, ui-monospace, Menlo, Consolas, monospace';
const SANS = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

// A single tool-call row inside the activity panel.
function ToolRow({ name, input, status }) {
  const label = input && Object.keys(input).length
    ? `${name}(${Object.values(input).map((v) => (typeof v === 'string' ? v : JSON.stringify(v))).join(', ')})`
    : `${name}()`;
  const dot = status === 'done' ? C.green : status === 'fail' ? C.red : C.coral;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0', fontFamily: MONO, fontSize: 12 }}>
      <span aria-hidden style={{
        width: 6, height: 6, borderRadius: '50%', background: dot, flexShrink: 0,
        ...(status === 'running' ? { animation: 'vaPulse 1s infinite' } : {}),
      }} />
      <span style={{ color: C.ink2 }}>→</span>
      <span style={{ color: C.ink, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={label}>{label}</span>
      {status === 'done' && <span style={{ color: C.green }}>✓</span>}
      {status === 'fail' && <span style={{ color: C.red }}>✕</span>}
    </div>
  );
}

// A live token count for the header (right-aligned, tabular-nums). Hidden until > 0.
function TokenCount({ tokens }) {
  if (!tokens) return null;
  return (
    <span style={{ fontFamily: MONO, fontSize: 12, color: C.ink3, fontVariantNumeric: 'tabular-nums' }}>
      {tokens.toLocaleString()} tokens
    </span>
  );
}

// The activity panel. Collapsible; header = spinner|✓ + verb/summary + token count + chevron.
// `title` = the running verb (blend-driven for general chat); `doneLabel` = the collapsed summary.
// `streaming` = text is actively flowing → the live token count hides (the two-mode toggle above).
function ActivityPanel({ title, doneLabel, tokens, streaming, running, reasoning, tools, open, onToggle }) {
  return (
    <div style={{ border: `1px solid ${C.line}`, borderRadius: 10, background: C.surface, marginBottom: 10, overflow: 'hidden' }}>
      <button
        type="button" onClick={onToggle} aria-expanded={open}
        style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', textAlign: 'left',
          padding: '8px 12px', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: SANS }}
      >
        {running
          ? <span aria-hidden style={{ width: 12, height: 12, border: `2px solid ${C.line}`, borderTopColor: C.coral, borderRadius: '50%', animation: 'vaSpin .8s linear infinite', flexShrink: 0 }} />
          : <span aria-hidden style={{ color: C.green, fontSize: 13 }}>✓</span>}
        <span style={{ flex: 1, fontSize: 12.5, fontWeight: 600, color: C.ink2 }}>{running ? title : doneLabel}</span>
        {!(running && streaming) && <TokenCount tokens={tokens} />}
        <span aria-hidden style={{ color: C.ink3, fontSize: 12 }}>{open ? '▾' : '▸'}</span>
      </button>
      {open && (
        <div style={{ padding: '2px 12px 10px 12px' }}>
          {reasoning && (
            <div style={{ fontFamily: SANS, fontSize: 12.5, fontStyle: 'italic', color: C.ink3, marginBottom: 8, lineHeight: 1.5 }}>
              {reasoning}{running && <span aria-hidden style={{ borderRight: `2px solid ${C.coral}`, marginLeft: 1, animation: 'vaBlink 1s step-end infinite' }}>&nbsp;</span>}
            </div>
          )}
          {tools.map((t, i) => <ToolRow key={i} {...t} />)}
        </div>
      )}
    </div>
  );
}

// Persistent tool chips on a finished message (state B/D). Deduped by name with a count.
function ToolChips({ tools }) {
  const counts = tools.reduce((m, t) => ((m[t.name] = (m[t.name] || 0) + 1), m), {});
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
      {Object.entries(counts).map(([name, n]) => (
        <span key={name} style={{
          fontFamily: MONO, fontSize: 11, color: C.ink2, background: C.card,
          border: `1px solid ${C.line}`, borderRadius: 999, padding: '2px 9px',
        }}>{name}{n > 1 ? ` ×${n}` : ''}</span>
      ))}
    </div>
  );
}

// One assistant message = [activity panel] + [answer] + [persistent chips].
function AgentMessage({ title, doneLabel, tokens, streaming, running, reasoning, tools, answer, panelOpen, onToggle }) {
  return (
    <div style={{ maxWidth: 720, fontFamily: SANS, color: C.ink }}>
      <ActivityPanel title={title} doneLabel={doneLabel} tokens={tokens} streaming={streaming} running={running} reasoning={reasoning} tools={tools} open={panelOpen} onToggle={onToggle} />
      {answer && <div style={{ fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{answer}</div>}
      {!running && tools.length > 0 && <ToolChips tools={tools} />}
    </div>
  );
}

// The reference surface: both consumers, each in its canonical running + done states.
export default function TheoAgentActivityReference() {
  const useOpen = (init) => ((typeof React !== 'undefined' && React.useState) ? React.useState(init) : [init, () => {}]);
  const [openA, setOpenA] = useOpen(true);
  const [openB, setOpenB] = useOpen(false);
  const [openC0, setOpenC0] = useOpen(true);
  const [openC, setOpenC] = useOpen(true);
  const [openC2, setOpenC2] = useOpen(true);
  const [openD, setOpenD] = useOpen(false);
  const style = `
    @keyframes vaSpin { to { transform: rotate(360deg); } }
    @keyframes vaBlink { 50% { opacity: 0; } }
    @keyframes vaPulse { 50% { opacity: .35; } }
  `;
  const heading = (t) => <div style={{ fontFamily: MONO, fontSize: 11, color: C.ink3, marginBottom: 8 }}>{t}</div>;
  return (
    <div style={{ background: C.bg, padding: 24, display: 'flex', flexDirection: 'column', gap: 28 }}>
      <style>{style}</style>

      {/* ============ CONSUMER 1 — Sigma review agent ============ */}
      <section>
        {heading('SIGMA REVIEW AGENT — A · running (live)')}
        <AgentMessage
          title="Reviewing (3) Vault Tax…" doneLabel="Checked (3) Vault Tax · 3 tools" tokens={3120} running
          reasoning="Pulling the live state of the three crown exceptions — starting with the allocation tie-out"
          panelOpen={openA} onToggle={() => setOpenA(!openA)}
          tools={[
            { name: 'scan_errors', input: { workbook: 'output' }, status: 'done' },
            { name: 'scan_external_links', input: { workbook: 'output' }, status: 'done' },
            { name: 'recompute_control', input: { control_id: 'ALLOC.ratios-100' }, status: 'running' },
          ]}
          answer=""
        />
      </section>
      <section>
        {heading('SIGMA REVIEW AGENT — B · done')}
        <AgentMessage
          title="Reviewing (3) Vault Tax…" doneLabel="Checked (3) Vault Tax · 4 tools" tokens={4680} running={false}
          reasoning="Pulling the live state of the three crown exceptions — starting with the allocation tie-out"
          panelOpen={openB} onToggle={() => setOpenB(!openB)}
          tools={[
            { name: 'scan_errors', input: { workbook: 'output' }, status: 'done' },
            { name: 'scan_external_links', input: { workbook: 'output' }, status: 'done' },
            { name: 'recompute_control', input: { control_id: 'ALLOC.ratios-100' }, status: 'done' },
            { name: 'recompute_control', input: { control_id: 'ALLOC.income-eq-schk' }, status: 'done' },
          ]}
          answer={'All 6 exceptions confirmed still open. Priority order:\n\n1. [CROWN] INT.no-external-links — 22,415 external-link cells (Balance Sheet E:G, rows 3–32). Break the links and hard-code the values.'}
        />
      </section>

      {/* ============ CONSUMER 2 — general-chat tool-loop (blend verb + two-mode token toggle) ============ */}
      <section>
        {heading('GENERAL CHAT — C0 · running (PROCESSING / thinking phase): reasoning streams + token count CLIMBS; playful verb; no tool yet')}
        <AgentMessage
          title="Number-wrangling…" doneLabel="Done" tokens={480} streaming={false} running
          reasoning="The user wants the 2023 K-1 as Excel. Planning the workbook: a Schedule K-1 sheet (each reported box → a typed row), a Capital Account rollforward, and a K-3 Part II sheet for the sourcing. Columns: line, description, amount (number), notes"
          panelOpen={openC0} onToggle={() => setOpenC0(!openC0)}
          tools={[]}
          answer=""
        />
      </section>
      <section>
        {heading('GENERAL CHAT — C · running (PROCESSING): silent tool_use build → token count CLIMBS; verb tool-aware; tool row is {name}-only')}
        <AgentMessage
          title="Building your spreadsheet…" doneLabel="Used the spreadsheet export tool" tokens={1240} streaming={false} running
          reasoning="The user wants the 2023 K-1 laid out as Excel. I'll pull each reported box, the capital-account roll, and the K-3 Part II sourcing into typed columns so the amounts come through as real numbers"
          panelOpen={openC} onToggle={() => setOpenC(!openC)}
          tools={[
            { name: 'theo_export_spreadsheet', status: 'running' },
          ]}
          answer=""
        />
      </section>
      <section>
        {heading('GENERAL CHAT — C2 · running (STREAMING): answer text flowing → token count HIDDEN (the text is the signal)')}
        <AgentMessage
          title="Building your spreadsheet…" doneLabel="Used the spreadsheet export tool" tokens={1660} streaming={true} running
          reasoning="The user wants the 2023 K-1 laid out as Excel. I'll pull each reported box, the capital-account roll, and the K-3 Part II sourcing into typed columns so the amounts come through as real numbers"
          panelOpen={openC2} onToggle={() => setOpenC2(!openC2)}
          tools={[
            { name: 'theo_export_spreadsheet', status: 'done' },
          ]}
          answer={'Done — I pulled the 2023 K-1 into a workbook: a sheet per section (Schedule K-1, Capital'}
        />
      </section>
      <section>
        {heading('GENERAL CHAT — D · done (final total shows; answer + VA-T9 download card render below)')}
        <AgentMessage
          title="Building your spreadsheet…" doneLabel="Used the spreadsheet export tool" tokens={1847} streaming={false} running={false}
          reasoning="The user wants the 2023 K-1 laid out as Excel. I'll pull each reported box, the capital-account roll, and the K-3 Part II sourcing into typed columns so the amounts come through as real numbers"
          panelOpen={openD} onToggle={() => setOpenD(!openD)}
          tools={[{ name: 'theo_export_spreadsheet', status: 'done' }]}
          answer={'Done — I pulled the 2023 K-1 into a workbook: a sheet per section (Schedule K-1, Capital Account, K-3 Part II) with each box as a typed row. Your Excel file is ready:\n\n[ VA-T9 download card renders here ]'}
        />
      </section>
    </div>
  );
}
