// ChatView — chat scroll content + composer (VA-T1 L348–377, L479–492). The view-switched
// 54px header bar is shared chrome rendered by TheoMain (identical pixels; allowed split delta).
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { C, SANS, SERIF } from "../theme";
import { Burst } from "./icons";
import { CitedText } from "./CitedText";
import type { Message, Project } from "../types";

export interface ChatViewProps {
  messages: Message[];
  loading: boolean;
  error: string;
  draft: string;
  onDraftChange: (s: string) => void;
  onSend: (text?: string) => void;
  chatProject: Project | null;
  assistantName: string;
  greeting: string;
  starters: string[];
  renderAssistant: (content: string) => ReactNode;
}

export function ChatView(props: ChatViewProps) {
  const { messages, loading, error, draft, onDraftChange, onSend, chatProject, assistantName, greeting, starters, renderAssistant } = props;
  const scroller = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight; }, [messages, loading]);
  useEffect(() => { const ta = taRef.current; if (ta) { ta.style.height = "auto"; ta.style.height = Math.min(ta.scrollHeight, 200) + "px"; } }, [draft]);

  return (
    <>
      <div ref={scroller} className="vo-scroll" style={{ flex: 1, overflowY: "auto" }}>
        {messages.length === 0 ? (
          <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", textAlign: "center" }}>
            <Burst size={40} />
            <h1 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 32, margin: "18px 0 6px", letterSpacing: -0.2 }}>{greeting}</h1>
            <p style={{ color: C.ink2, fontSize: 15, margin: "0 0 22px" }}>{chatProject ? `Working in ${chatProject.name}.` : "How can I help with your work today?"}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 520 }}>
              {starters.map((s) => <button key={s} className="vo-chip" onClick={() => onSend(s)} style={{ background: "#fff", border: `1px solid ${C.line2}`, borderRadius: 999, padding: "8px 15px", fontSize: 13, color: C.ink2, cursor: "pointer", fontFamily: SANS }}>{s}</button>)}
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: 740, margin: "0 auto", padding: "28px 24px 8px" }}>
            {messages.map((m, i) => m.role === "user" ? (
              <div key={i} style={{ display: "flex", justifyContent: "flex-end", margin: "0 0 22px" }}>
                <div style={{ background: C.bubble, borderRadius: 16, padding: "11px 16px", maxWidth: "82%", fontSize: 15, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>{m.content}</div>
              </div>
            ) : (
              <div key={i} style={{ display: "flex", gap: 13, margin: "0 0 26px" }}>
                <div style={{ marginTop: 2, flexShrink: 0 }}><Burst size={22} /></div>
                <div style={{ fontSize: 15, paddingTop: 1, minWidth: 0, flex: 1 }}>{m.runs?.some((r) => r.citations.length) ? <CitedText runs={m.runs} /> : renderAssistant(m.content)}</div>
              </div>
            ))}
            {loading && (<div style={{ display: "flex", gap: 13, margin: "0 0 26px" }}>
              <div style={{ marginTop: 2 }}><Burst size={22} /></div>
              <div style={{ display: "flex", gap: 5, paddingTop: 9 }}>{[0, 1, 2].map((d) => <span key={d} style={{ width: 7, height: 7, borderRadius: "50%", background: C.ink3, display: "inline-block", animation: `vo-bounce 1.2s ${d * 0.16}s infinite ease-in-out` }} />)}</div>
            </div>)}
          </div>
        )}
      </div>

      <div style={{ padding: "8px 24px 16px", flexShrink: 0 }}>
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          {error && <div style={{ color: C.coralDk, fontSize: 13, marginBottom: 8, textAlign: "center" }}>{error}</div>}
          <div style={{ background: "#fff", border: `1px solid ${C.line2}`, borderRadius: 18, padding: "12px 14px", boxShadow: "0 2px 14px rgba(40,38,31,0.05)" }}>
            <textarea ref={taRef} value={draft} onChange={(e) => onDraftChange(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); } }} rows={1} placeholder={`Message ${assistantName}…`} style={{ width: "100%", border: "none", resize: "none", fontFamily: SANS, fontSize: 15, color: C.ink, background: "transparent", lineHeight: 1.5, maxHeight: 200 }} />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
              <button className="vo-send" disabled={!draft.trim() || loading} onClick={() => onSend()} style={{ width: 34, height: 34, borderRadius: 10, border: "none", background: draft.trim() && !loading ? C.coral : C.line2, color: "#fff", cursor: draft.trim() && !loading ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, transition: "background .15s" }}>↑</button>
            </div>
          </div>
          <div style={{ textAlign: "center", fontSize: 11.5, color: C.ink3, marginTop: 9 }}>{assistantName} can make mistakes. Verify tax conclusions before relying on them.</div>
        </div>
      </div>
    </>
  );
}
