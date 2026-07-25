-- Theo Chat Media Persistence addendum: persist an assistant turn's inline media (fetched images /
-- videos) so a reloaded chat re-renders them. ADDITIVE; idempotent. Run as pgadmin_vault. No RLS
-- change (inherits theo_messages' four ownership policies). No backfill (theo_message_stream writes
-- it on new turns going forward; pre-existing rows keep NULL -> no media on reload, as today).
ALTER TABLE public.theo_messages
  ADD COLUMN IF NOT EXISTS media jsonb;

COMMENT ON COLUMN public.theo_messages.media IS
  'Inline media rendered with an assistant turn: { image?: InlineImage, video?: InlineVideo } as emitted by the theo_message_stream tool-loop (theo_find_image/theo_find_video vault_image/vault_video frames). NULL when the turn produced no persistable media. Written by theo_message_stream at turn persist; returned by theo_get_conversation for reload re-render. Short-TTL SAS export/download is intentionally NOT persisted.';
