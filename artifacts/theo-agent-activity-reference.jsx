// VA-T7 — Theo Agent Activity Rendering Reference (canonical surface; reproduce faithfully, do not
// redesign). The Claude-Code-style live agent view for tool-driven agents (first consumer: the Sigma
// K-1 review agent via sigma_review_agent_stream). Zero-dependency, inline-style, no Tailwind, no
// browser storage — the VA-T1 / VA-T5 idiom. Two states are shown: (A) RUNNING — a live "activity"
// panel above the answer that streams the agent's reasoning and lists each tool call the instant it
// fires; (B) DONE — the panel collapses to a one-line summary and the tool calls persist as chips on
// the finished message, with the judged answer rendered below.
//
// Event mapping (sigma_review_agent_stream SSE → this surface):
//   event: delta {kind:'thinking'} → the streaming reasoning line (muted, live cursor while running)
//   event: delta {kind:'text'}     → the answer body (below the panel)
//   event: tool {name,input}       → append a tool row (status 'running') + a persistent chip
//   event: tool_result {name,ok}   → mark that tool row done (ok ✓ / fail ✕)
//   event: done                    → collapse the panel to its summary; freeze the chips
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
  const dot = status === 'done' ? C.green : status === 'fail' ? C.red : C.coral;
  const label = input && Object.keys(input).length
    ? `${name}(${Object.values(input).map((v) => (typeof v === 'string' ? v : JSON.stringify(v))).join(', ')})`
    : `${name}()`;
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

// The live activity panel (state A: running). Collapsible; header carries a spinner + count.
function ActivityPanel({ fund, running, reasoning, tools, open, onToggle }) {
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
        <span style={{ flex: 1, fontSize: 12.5, fontWeight: 600, color: C.ink2 }}>
          {running ? `Reviewing ${fund}…` : `Checked ${fund} · ${tools.length} tool${tools.length === 1 ? '' : 's'}`}
        </span>
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

// Persistent tool chips on a finished message (state B). Deduped by name with a count.
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
function AgentMessage({ fund, running, reasoning, tools, answer, panelOpen, onToggle }) {
  return (
    <div style={{ maxWidth: 720, fontFamily: SANS, color: C.ink }}>
      <ActivityPanel fund={fund} running={running} reasoning={reasoning} tools={tools} open={panelOpen} onToggle={onToggle} />
      {answer && <div style={{ fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{answer}</div>}
      {!running && tools.length > 0 && <ToolChips tools={tools} />}
    </div>
  );
}

// The reference surface: both canonical states side by side.
export default function TheoAgentActivityReference() {
  const [openA, setOpenA] = (typeof React !== 'undefined' && React.useState) ? React.useState(true) : [true, () => {}];
  const [openB, setOpenB] = (typeof React !== 'undefined' && React.useState) ? React.useState(false) : [false, () => {}];
  const style = `
    @keyframes vaSpin { to { transform: rotate(360deg); } }
    @keyframes vaBlink { 50% { opacity: 0; } }
    @keyframes vaPulse { 50% { opacity: .35; } }
  `;
  return (
    <div style={{ background: C.bg, padding: 24, display: 'flex', flexDirection: 'column', gap: 28 }}>
      <style>{style}</style>

      {/* STATE A — RUNNING: live activity panel (reasoning streaming + tools firing), no answer yet. */}
      <section>
        <div style={{ fontFamily: MONO, fontSize: 11, color: C.ink3, marginBottom: 8 }}>STATE A — running (live)</div>
        <AgentMessage
          fund="(3) Vault Tax" running reasoning="Pulling the live state of the three crown exceptions — starting with the allocation tie-out"
          panelOpen={openA} onToggle={() => setOpenA(!openA)}
          tools={[
            { name: 'scan_errors', input: { workbook: 'output' }, status: 'done' },
            { name: 'scan_external_links', input: { workbook: 'output' }, status: 'done' },
            { name: 'recompute_control', input: { control_id: 'ALLOC.ratios-100' }, status: 'running' },
          ]}
          answer=""
        />
      </section>

      {/* STATE B — DONE: panel collapsed to a summary, judged answer, persistent tool chips. */}
      <section>
        <div style={{ fontFamily: MONO, fontSize: 11, color: C.ink3, marginBottom: 8 }}>STATE B — done</div>
        <AgentMessage
          fund="(3) Vault Tax" running={false} reasoning="Pulling the live state of the three crown exceptions — starting with the allocation tie-out"
          panelOpen={openB} onToggle={() => setOpenB(!openB)}
          tools={[
            { name: 'scan_errors', input: { workbook: 'output' }, status: 'done' },
            { name: 'scan_external_links', input: { workbook: 'output' }, status: 'done' },
            { name: 'recompute_control', input: { control_id: 'ALLOC.ratios-100' }, status: 'done' },
            { name: 'recompute_control', input: { control_id: 'ALLOC.income-eq-schk' }, status: 'done' },
          ]}
          answer={'All 6 exceptions confirmed still open. Priority order:\n\n1. [CROWN] INT.no-external-links — 22,415 external-link cells (Balance Sheet E:G, rows 3–32). Break the links (Data → Edit Links → Break Link) and hard-code the values.\n\n2. [HIGH] INT.no-broken-refs — 22 #REF! cells on Schedule M-1 (A42–A44) and the PFIC template. Rewire the shifted source ranges.'}
        />
      </section>
    </div>
  );
}
