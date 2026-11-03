import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { theme } from '../../theme';
import type { AiDirectorAspect, AiDirectorStyle } from '../../aiDirector/pendingJob';
import { Icon } from '../icons';

type DirectorStyle = 'wedding' | 'cinematic' | 'reel' | 'event' | 'documentary';
type Aspect = '9:16' | '16:9' | '1:1';

const STYLE_COPY: Record<DirectorStyle, { label: string; ideas: string[] }> = {
  wedding: {
    label: 'Wedding Film',
    ideas: [
      '30s emotional Reel — strongest smiles, reactions and couple moments, warm cinematic pacing.',
      '60s wedding story — opening detail shot, emotional build, vows/celebration peak and elegant ending.',
      '15s teaser — fast premium montage with 3–5 hero moments and beat-synced cuts.',
    ],
  },
  cinematic: {
    label: 'Cinematic',
    ideas: [
      '45s cinematic montage — slow opening, visual build, speed ramp into the strongest moment.',
      '30s premium film — match cuts, controlled transitions, subtle film texture and dramatic pacing.',
      '20s hero teaser — strongest visual first, rising tension, clean title card and cinematic outro.',
    ],
  },
  reel: {
    label: 'Social Reel',
    ideas: [
      '30s high-retention Reel — strongest moment in the first 2 seconds, rapid visual progression and captions.',
      '20s punchy Short — remove dead air, use beat-driven cuts and keep every shot purposeful.',
      '45s story Reel — hook, context, payoff and CTA with automatic 9:16 reframing.',
    ],
  },
  event: {
    label: 'Event Highlight',
    ideas: [
      '45s event highlight — venue opener, crowd energy, key moments and a branded finale.',
      '30s energetic recap — fastest crowd/reaction moments with music-driven transitions.',
      '60s premium recap — balanced establishing shots, people, action and closing brand frame.',
    ],
  },
  documentary: {
    label: 'Documentary',
    ideas: [
      '60s documentary short — natural pacing, strongest story beats and clean lower-thirds.',
      '90s story cut — establish the subject, build context, emotional middle and memorable ending.',
      '45s social documentary — strongest quote/hook first, supporting visuals and concise captions.',
    ],
  },
};

function formatBytes(bytes: number) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** i).toFixed(i ? 1 : 0)} ${units[i]}`;
}

export function AiDirectorPanel({ onStartAiEdit }: { onStartAiEdit: (file: File, style: AiDirectorStyle, aspect: AiDirectorAspect, duration: string) => Promise<void> }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [style, setStyle] = useState<DirectorStyle>('wedding');
  const [aspect, setAspect] = useState<Aspect>('9:16');
  const [duration, setDuration] = useState('30s');
  const [ideasVisible, setIdeasVisible] = useState(false);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const ideas = useMemo(() => STYLE_COPY[style].ideas.map((idea) => idea.replace(/9:16/g, aspect)), [style, aspect]);

  return (
    <section style={{
      marginBottom: 24,
      border: `1px solid ${theme.border}`,
      borderRadius: 18,
      overflow: 'hidden',
      background: 'linear-gradient(135deg, rgba(255,255,255,.035), rgba(255,255,255,.015))',
      boxShadow: '0 18px 50px rgba(0,0,0,.18)',
    }}>
      <div style={{ padding: '20px 22px 16px', display: 'flex', gap: 16, alignItems: 'center', borderBottom: `1px solid ${theme.border}` }}>
        <span style={{ width: 42, height: 42, borderRadius: 12, display: 'grid', placeItems: 'center', background: 'rgba(255,255,255,.06)', color: theme.accent }}>
          <Icon name="sparkles" size={21} />
        </span>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 750, color: theme.textStrong }}>AI Director</div>
          <div style={{ marginTop: 4, fontSize: 12, color: theme.textDim }}>Upload footage, choose a creative direction, and generate edit concepts before opening the professional timeline.</div>
        </div>
        <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.08em', color: theme.accent, border: `1px solid ${theme.borderLight}`, borderRadius: 999, padding: '6px 9px' }}>SMART DIGITAL STUDIO</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, .85fr) minmax(360px, 1.15fr)', gap: 20, padding: 20 }}>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="video/*"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            style={{ display: 'none' }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            style={{
              width: '100%', minHeight: 180, borderRadius: 14, border: `1px dashed ${theme.borderLight}`,
              background: 'rgba(0,0,0,.16)', color: theme.textDim, cursor: 'pointer', padding: 16,
              display: 'grid', placeItems: 'center', textAlign: 'center',
            }}
          >
            {previewUrl ? (
              <video src={previewUrl} muted playsInline controls style={{ width: '100%', maxHeight: 210, borderRadius: 10, objectFit: 'contain' }} />
            ) : (
              <span>
                <span style={{ display: 'block', marginBottom: 10, color: theme.accent }}><Icon name="upload" size={28} /></span>
                <strong style={{ display: 'block', color: theme.textStrong }}>Upload your video</strong>
                <span style={{ display: 'block', marginTop: 5, fontSize: 11.5 }}>MP4, MOV, WebM and other browser-supported video formats</span>
              </span>
            )}
          </button>
          {file && (
            <div style={{ marginTop: 9, display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 11, color: theme.textDim }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
              <span>{formatBytes(file.size)}</span>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gap: 13, alignContent: 'start' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 9 }}>
            <label style={{ fontSize: 11, color: theme.textDim }}>Style
              <select value={style} onChange={(e) => { setStyle(e.target.value as DirectorStyle); setIdeasVisible(false); }} style={selectStyle}>
                {Object.entries(STYLE_COPY).map(([value, item]) => <option key={value} value={value}>{item.label}</option>)}
              </select>
            </label>
            <label style={{ fontSize: 11, color: theme.textDim }}>Format
              <select value={aspect} onChange={(e) => setAspect(e.target.value as Aspect)} style={selectStyle}>
                <option>9:16</option><option>16:9</option><option>1:1</option>
              </select>
            </label>
            <label style={{ fontSize: 11, color: theme.textDim }}>Target
              <select value={duration} onChange={(e) => setDuration(e.target.value)} style={selectStyle}>
                <option>15s</option><option>20s</option><option>30s</option><option>45s</option><option>60s</option><option>90s</option>
              </select>
            </label>
          </div>

          <div style={{ padding: 14, borderRadius: 13, background: 'rgba(255,255,255,.035)', border: `1px solid ${theme.border}` }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: theme.textStrong }}>Creative brief</div>
            <div style={{ marginTop: 5, fontSize: 11.5, lineHeight: 1.55, color: theme.textDim }}>
              Create a {duration} {STYLE_COPY[style].label.toLowerCase()} in {aspect}. Prioritize the strongest visual moments, remove dead time, preserve natural faces and build a polished professional story.
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIdeasVisible(true)}
            disabled={!file}
            style={{ ...primaryButton, opacity: file ? 1 : .48 }}
          >
            <Icon name="sparkles" size={15} /> Generate AI Edit Ideas
          </button>

          {ideasVisible && (
            <div style={{ display: 'grid', gap: 8 }}>
              {ideas.map((idea, index) => (
                <button key={idea} type="button" onClick={() => {
                    setStarting(true);
                    void onStartAiEdit(file, style, aspect, duration).finally(() => setStarting(false));
                  }} style={ideaButton}>
                  <span style={ideaNumber}>{index + 1}</span>
                  <span style={{ flex: 1, textAlign: 'left' }}>{idea}</span>
                  <span style={{ color: theme.accent, fontSize: 10.5, fontWeight: 700 }}>{starting ? 'STARTING…' : 'USE →'}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div style={{ padding: '10px 20px', borderTop: `1px solid ${theme.border}`, fontSize: 10.5, color: theme.textDim }}>
        Next automation layer: scene detection → transcript analysis → best-moment scoring → automatic timeline assembly → captions → music → export.
      </div>
    </section>
  );
}

const selectStyle: CSSProperties = {
  display: 'block', width: '100%', marginTop: 6, boxSizing: 'border-box', borderRadius: 9,
  border: `1px solid ${theme.border}`, background: theme.surface, color: theme.textStrong, padding: '8px 9px',
  fontSize: 11.5,
};

const primaryButton: React.CSSProperties = {
  border: 'none', borderRadius: 10, background: theme.accent, color: '#111', padding: '10px 13px',
  fontWeight: 750, fontSize: 12, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
};

const ideaButton: React.CSSProperties = {
  border: `1px solid ${theme.border}`, borderRadius: 11, background: 'rgba(255,255,255,.025)', color: theme.textStrong,
  padding: '10px 11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 9, fontSize: 11.5,
};

const ideaNumber: React.CSSProperties = {
  width: 23, height: 23, flex: '0 0 auto', borderRadius: 7, display: 'grid', placeItems: 'center',
  background: 'rgba(255,255,255,.06)', color: theme.accent, fontWeight: 800, fontSize: 10.5,
};
