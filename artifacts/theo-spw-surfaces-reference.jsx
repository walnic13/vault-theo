// VA-T12 — Theo Shared Project Workspace (SPW) Surfaces Rendering Reference (canonical surface;
// reproduce faithfully, do not redesign). Three additions to the existing Theo chat + projects
// surface (VA-T1) that make a PUBLISHED project conversation usable by a project's participants.
// Everything else on the surface is unchanged. Zero-dependency, inline-style, no Tailwind, no browser
// storage — the VA-T1 / VA-T5 / VA-T7 / VA-T8 / VA-T9 idiom. Backends are DEPLOYED + golden-curl-verified
// (API Spec §2.2 publish contracts; Schema §11 publish substrate; theo_get_conversation returns
// per-message created_by, §2.1). Walter-approved look 2026-07-30.
//
// (A) Attributed multi-party thread — the "who said what" render of a shared conversation.
//   Each turn gains a BYLINE row above the message body: a 26px AVATAR = the author's ROSTER PHOTO
//   (Person.photo from theo_list_people, §2.9; a circular <img>, object-fit cover, 1px hairline ring),
//   with tinted INITIALS as the fallback when a person has no photo; + the author's display
//   NAME (ink, 650) resolved from message.created_by via the People roster (theo_list_people, §2.9),
//   + an optional TAG ("Owner · you" in coralSoft when the caller authored it; plain when a co-author),
//   + a muted timestamp. Theo's own turns keep a coral spiral avatar + "Theo" (coralDk). A slim
//   coral-soft "Shared in this project" BANNER sits at the top of a published thread. Under the
//   composer, a one-line note reads "You're continuing a shared thread — your reply posts as <you>".
//   For a PRIVATE (single-author) conversation the bylines are suppressed (the surface is unchanged
//   from VA-T1) — attribution appears only once a thread is shared.
//   Data: theo_get_conversation → messages[].created_by (§2.1); resolve to Person.displayName by id.
//
// (B) Publish control — the owner shares/unshares a private chat into its project.
//   A "Publish to project" item in the existing chat menu (Star / Rename / … / Delete), shown ONLY on
//   a conversation the caller OWNS that is linked to a project. It flips to "Unpublish" once shared,
//   and the chat header shows a coral state chip ("Shared in <Project>"). One-click, reversible.
//   Wiring: theoClient.publishConversation / unpublishConversation (API §2.2).
//
// (C) "Shared in this project" list — a section on the project home (beside knowledge + members).
//   Header "Shared in this project" + a count pill; each row: an initials mini-avatar (the author),
//   the conversation TITLE (600), and a muted meta line "<author> · shared <when> · updated <when>".
//   A row opens the shared conversation. Mirrors the existing "Chats in this project" section.
//   Wiring: theoClient.listPublishedProjectConversations → PublishedConversation[] (API §2.2).
//
// Palette (theo-*, inline, verbatim from VA-T1 theme.ts):
//   bg #FAF9F5, sidebar #F0EEE6, bubble #EDEAE0, card #FFFFFF, ink #28261F, ink2 #6B6A63, ink3 #94928A,
//   line #E4E1D6, line2 #D8D4C7, coral #D97757, coralDk #BD5D3A, coralSoft #F4E6DD, coralTint #EFE4DC.

import { useState } from "react";

const C = {
  bg: "#FAF9F5", sidebar: "#F0EEE6", bubble: "#EDEAE0", card: "#FFFFFF",
  ink: "#28261F", ink2: "#6B6A63", ink3: "#94928A",
  line: "#E4E1D6", line2: "#D8D4C7",
  coral: "#D97757", coralDk: "#BD5D3A", coralSoft: "#F4E6DD", coralTint: "#EFE4DC",
};
const SANS = '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif';

// ── Shared glyphs (stroke, currentColor) ───────────────────────────────────────────────────────
const IcShare = ({ s = 15 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8a3 3 0 100-6 3 3 0 000 6zM6 15a3 3 0 100-6 3 3 0 000 6zM18 22a3 3 0 100-6 3 3 0 000 6z" />
    <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
  </svg>
);
const IcSend = ({ s = 16 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
);
const IcCheck = ({ s = 12 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
);

// Avatar — the author's ROSTER PHOTO (Person.photo) as a circular <img> when present; tinted INITIALS
// fallback when a person has no photo. `photo` is the deployed identity source (theo_list_people).
const Avatar = ({ photo, initials, tint, size = 26 }) => (
  photo
    ? <img src={photo} alt="" width={size} height={size} style={{ borderRadius: 999, objectFit: "cover", flexShrink: 0, border: "1px solid rgba(40,38,31,.08)" }} />
    : <span style={{ width: size, height: size, borderRadius: 999, background: tint, color: "#fff", fontSize: size * 0.42, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, letterSpacing: ".02em" }}>{initials}</span>
);
// A portrait silhouette standing in for a real roster headshot in THIS reference (deployment passes the
// real Person.photo to Avatar's `photo` prop). Kept inline so the reference has zero external assets.
const PhotoStub = ({ tint, size = 26 }) => (
  <span style={{ width: size, height: size, borderRadius: 999, overflow: "hidden", flexShrink: 0, border: "1px solid rgba(40,38,31,.08)", display: "block", color: tint, background: C.bubble }}>
    <svg viewBox="0 0 40 40" width={size} height={size} style={{ display: "block" }}><rect width="40" height="40" fill="currentColor" /><circle cx="20" cy="15.2" r="7.2" fill="#fff" fillOpacity=".92" /><path d="M6.5 40c0-8.4 6-12.6 13.5-12.6S33.5 31.6 33.5 40Z" fill="#fff" fillOpacity=".92" /></svg>
  </span>
);
const TheoAvatar = ({ size = 26 }) => (
  <span style={{ width: size, height: size, borderRadius: 999, background: `linear-gradient(135deg, ${C.coral}, ${C.coralDk})`, color: "#fff", fontSize: size * 0.5, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✦</span>
);

// ── (A) Attributed multi-party thread ───────────────────────────────────────────────────────────
// A turn's byline + body. `author` null → Theo (assistant). `you` → the "Owner · you" tag.
function Turn({ author, initials, tint, you, owner, when, children, assistant }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        {assistant ? <TheoAvatar /> : <PhotoStub tint={tint} />}
        <span style={{ fontSize: 13, fontWeight: 650, color: assistant ? C.coralDk : C.ink }}>{assistant ? "Theo" : author}</span>
        {you && <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: ".03em", textTransform: "uppercase", padding: "1.5px 6px", borderRadius: 5, background: C.coralSoft, color: C.coralDk }}>{owner ? "Owner · you" : "You"}</span>}
        {!you && owner && <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: ".03em", textTransform: "uppercase", padding: "1.5px 6px", borderRadius: 5, background: C.bubble, color: C.ink3 }}>Owner</span>}
        <span style={{ fontSize: 12, color: C.ink3 }}>{when}</span>
      </div>
      <div style={{ fontSize: 14.5, color: assistant ? C.ink2 : C.ink, paddingLeft: 35, maxWidth: "70ch" }}>{children}</div>
    </div>
  );
}

function AttributedThread() {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, overflow: "hidden" }}>
      {/* chat header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", borderBottom: `1px solid ${C.line}`, background: C.sidebar }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 7, background: C.card, border: `1px solid ${C.line2}`, borderRadius: 999, padding: "4px 11px 4px 8px", fontSize: 12.5, color: C.ink2, fontWeight: 500 }}>
          <span style={{ width: 8, height: 8, borderRadius: 3, background: C.coral }} /> Meridian acquisition
        </span>
        <span style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>§338(h)(10) &amp; the earnout</span>
        <span style={{ flex: 1 }} />
        <button style={{ width: 30, height: 30, borderRadius: 8, border: "none", background: "transparent", color: C.ink2, cursor: "pointer", fontSize: 17 }} title="Chat menu">⋯</button>
      </div>
      {/* shared banner (only on a published thread) */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", background: C.coralSoft, borderBottom: `1px solid ${C.coralTint}`, fontSize: 12.5, color: C.coralDk, fontWeight: 500 }}>
        <IcShare s={13} /> Shared in this project · 3 participants can read and continue
      </div>
      {/* thread */}
      <div style={{ padding: "22px 20px 8px", display: "flex", flexDirection: "column", gap: 22 }}>
        <Turn author="Walter Mansfield" initials="WM" tint="#7A6A55" you owner when="2:04 PM">
          What's the cleanest structure for the Meridian asset acquisition given the contingent earnout? I'd like the buyer to get a stepped-up basis.
        </Turn>
        <Turn assistant when="2:04 PM">
          A §338(h)(10) election on a qualified stock purchase gives the buyer an asset-basis step-up while the sale is treated as a deemed asset sale for tax… the earnout is treated as additional purchase price when paid.
        </Turn>
        <Turn author="Jared Doyle" initials="JD" tint={C.coral} when="2:11 PM">
          Does the (h)(10) election survive if the earnout makes the consideration contingent? Worried about the QSP 80% test at closing.
        </Turn>
        <Turn assistant when="2:11 PM">
          Yes — the QSP test looks at stock <i>acquired</i> within the 12-month period, not the final price; a contingent earnout doesn't defeat the 80% test as long as the closing-date purchase clears it.
        </Turn>
      </div>
      {/* continue note + composer */}
      <div style={{ padding: "0 20px 4px 55px", fontSize: 12, color: C.ink3 }}>You're continuing a shared thread — your reply posts as <b style={{ color: C.ink2 }}>Walter Mansfield</b>.</div>
      <div style={{ margin: "14px 16px 16px", border: `1px solid ${C.line2}`, borderRadius: 14, background: C.card, padding: "12px 14px", display: "flex", alignItems: "flex-end", gap: 10 }}>
        <span style={{ flex: 1, color: C.ink3, fontSize: 14.5, padding: "2px 0" }}>Reply to the thread…</span>
        <button style={{ width: 34, height: 34, borderRadius: 999, background: C.coral, color: "#fff", border: "none", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }} title="Send"><IcSend /></button>
      </div>
    </div>
  );
}

// ── (B) Publish control ─────────────────────────────────────────────────────────────────────────
function MenuItem({ children, hl, danger }) {
  const [hover, setHover] = useState(false);
  const bg = hl ? C.coralSoft : hover ? C.bubble : "transparent";
  const color = hl ? C.coralDk : danger ? "#b23c3c" : C.ink;
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 14px", fontSize: 13.5, color, background: bg, fontWeight: hl ? 600 : 400, cursor: "default" }}>{children}</div>
  );
}
function PublishControl() {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: 18, display: "flex", gap: 26, flexWrap: "wrap" }}>
      <div role="menu" aria-label="Chat menu" style={{ width: 230, background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, boxShadow: "0 8px 30px rgba(40,38,31,.12)", overflow: "hidden", flexShrink: 0 }}>
        <MenuItem>★ Star</MenuItem>
        <MenuItem>✎ Rename</MenuItem>
        <MenuItem hl><IcShare s={15} /> Publish to project</MenuItem>
        <div style={{ height: 1, background: C.line, margin: "4px 0" }} />
        <MenuItem danger>🗑 Delete</MenuItem>
      </div>
      <div style={{ flex: 1, minWidth: 240, alignSelf: "center", color: C.ink2, fontSize: 13.5 }}>
        <b style={{ color: C.ink, fontWeight: 650 }}>Publish to project</b> appears only on a chat you own that's linked to a project. It turns a private conversation into a shared, continuable thread for the project's participants — reversible any time.
        <div style={{ marginTop: 10 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, background: C.coralSoft, border: `1px solid ${C.coralTint}`, color: C.coralDk, borderRadius: 999, padding: "5px 12px", fontSize: 12.5, fontWeight: 600 }}>
            <IcCheck /> Shared in Meridian acquisition · Unpublish
          </span>
        </div>
        <div style={{ marginTop: 8, color: C.ink3, fontSize: 12.5 }}>↑ once published, the menu item flips to <b>Unpublish</b> and the header shows this state.</div>
      </div>
    </div>
  );
}

// ── (C) "Shared in this project" list ───────────────────────────────────────────────────────────
function SharedRow({ initials, tint, title, meta }) {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 10, background: hover ? C.sidebar : "transparent", cursor: "default" }}>
      <PhotoStub tint={tint} size={22} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
        <div style={{ fontSize: 12, color: C.ink3, marginTop: 2 }}>{meta}</div>
      </div>
      <span style={{ color: C.ink3, flexShrink: 0 }}>→</span>
    </div>
  );
}
function SharedList() {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: "6px 8px 12px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px 6px" }}>
        <span style={{ fontSize: 13, fontWeight: 650, color: C.ink, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: C.coral, display: "inline-flex" }}><IcShare /></span> Shared in this project
        </span>
        <span style={{ fontSize: 11.5, color: C.ink3, fontWeight: 600, background: C.bubble, borderRadius: 999, padding: "1px 8px" }}>3</span>
      </div>
      <SharedRow initials="WM" tint="#7A6A55" title="§338(h)(10) &amp; the earnout" meta="Walter Mansfield · shared 2:14 PM · updated just now" />
      <SharedRow initials="JD" tint={C.coral} title="Withholding on the LP redemption" meta="Jared Doyle · shared yesterday" />
      <SharedRow initials="AR" tint="#5E8B7E" title="Transfer-pricing memo — draft outline" meta="Aisha Rahman · shared Mon" />
    </div>
  );
}

// ── Reference gallery (the three approved SPW surfaces) ─────────────────────────────────────────
export default function TheoSpwSurfacesReference() {
  const label = (n, title) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "30px 0 12px" }}>
      <span style={{ width: 22, height: 22, borderRadius: 6, background: C.coral, color: "#fff", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</span>
      <span style={{ fontSize: 16, fontWeight: 650, color: C.ink }}>{title}</span>
    </div>
  );
  return (
    <div style={{ fontFamily: SANS, background: C.bg, color: C.ink, maxWidth: 860, margin: "0 auto", padding: "32px 24px 64px", lineHeight: 1.55 }}>
      {label("A", "Attributed multi-party thread")}
      <AttributedThread />
      {label("B", "Publish control")}
      <PublishControl />
      {label("C", "Shared in this project")}
      <SharedList />
    </div>
  );
}
