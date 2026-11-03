---
name: smart-digital-studio-auto-edit
description: End-to-end Smart Digital Studio automatic editing workflow for uploaded wedding, cinematic, reel, event, documentary, or social footage. Analyze the source, select the strongest moments, assemble a polished editable timeline, add captions when speech exists, reframe for the requested aspect ratio, apply professional color correction, music/audio treatment when appropriate, and verify the result.
---

# Smart Digital Studio Auto Edit

Use this skill when the user asks Smart Digital Studio to automatically turn uploaded raw footage into a finished editable video.

## Goal

Do the complete edit, not merely provide ideas. The result must remain a real editable OpenChatCut timeline.

## Workflow

1. Read the current project and identify the uploaded source media.
2. Import/place the uploaded video on the timeline if it is only in the media pool.
3. Probe the source and inspect representative frames before deciding what is visually strong.
4. Detect scene changes and use visual evidence to identify usable moments.
5. If speech is present, transcribe the source and use the transcript for meaningful selection and captions.
6. Build a coherent rough cut around the requested style, target duration, and aspect ratio. Prefer strong openings, clean visual continuity, emotional/relevant moments, and a deliberate ending.
7. Remove dead time and weak/repetitive sections. Do not invent events or dialogue.
8. For 9:16 or 1:1 output, use subject-aware reframing and protect faces/text.
9. Apply automatic color correction first; use a restrained cinematic look only when it supports the selected style.
10. Add captions when speech materially contributes to the edit. Keep captions readable and clear of faces.
11. Add suitable music/audio treatment from available local resources when appropriate. Never claim a music track was added if no usable resource/provider exists.
12. Verify representative timeline frames after the major visual changes. Fix obvious framing, caption, timing, or color problems.
13. Leave the project editable and summarize what was actually changed.

## Smart Digital Studio defaults

- Wedding: emotional, elegant, premium, natural skin, restrained transitions.
- Cinematic: deliberate pacing, strong composition, controlled contrast, subtle film treatment.
- Reel: immediate hook, high retention, concise cuts, 9:16-first framing.
- Event: energetic but coherent, crowd/reaction/action balance.
- Documentary: story clarity, natural pacing, speech-led structure when applicable.

## Non-negotiable quality rules

- Preserve real faces and identities; never fabricate a visual event.
- Do not overuse transitions, zooms, effects, or LUTs.
- Keep skin tones natural.
- Use the actual footage as the source of truth.
- If a requested AI/provider capability is unavailable, complete the strongest local edit possible and report the concrete limitation.
- Do not report completion until verification has succeeded or a concrete blocker is reported.
