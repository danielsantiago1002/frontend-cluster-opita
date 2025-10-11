import React, { useCallback, useMemo, useRef, useState } from "react";
import YouTube, { type YouTubeProps } from "react-youtube";

export type YouTubePlayerProps = {
  /** The 11-char YouTube video id (e.g. "dQw4w9WgXcQ") */
  videoId: string;
  /** Optional title for accessibility */
  title?: string;
  /** Start time (in seconds) */
  start?: number;
  /** End time (in seconds) */
  end?: number;
  /** Autoplay when ready */
  autoplay?: boolean;
  /** Show native YouTube controls */
  controls?: boolean;
  /** Loop between start/end. Requires `playlist` to equal `videoId` */
  loop?: boolean;
  /** Reduce YouTube branding */
  modestBranding?: boolean;
  /** Show inlined playback on iOS */
  playsInline?: boolean;
  /** Related videos at the end */
  showRelated?: boolean;
  /** Show a simple custom UI with play/pause, mute, speed, etc. */
  showCustomUI?: boolean;
  /** Default playback rate (0.25, 0.5, 1, 1.5, 2) */
  defaultRate?: number;
  /** Default volume 0–100 */
  defaultVolume?: number;
  /** ClassName for the outer wrapper */
  className?: string;
  /** Style for the outer wrapper */
  style?: React.CSSProperties;
  /** Called when the player is ready */
  //@ts-ignore
  onReady?: (player: YT.Player) => void;
  /** Called when state changes */
  //@ts-ignore
  onStateChange?: (e: YT.OnStateChangeEvent) => void;
};

const aspectWrapper: React.CSSProperties = {
  position: "relative",
  width: "100%",
  // 16:9 aspect ratio
  paddingTop: "56.25%",
  background: "#000",
  overflow: "hidden",
  borderRadius: 12,
};

const iframeFill: React.CSSProperties = {
  position: "absolute",
  inset: 0,
};

export default function YouTubePlayer({
  videoId,
  title = "YouTube video",
  start,
  end,
  autoplay = false,
  controls = true,
  loop = false,
  modestBranding = true,
  playsInline = true,
  showRelated = false,
  showCustomUI = true,
  defaultRate = 1,
  defaultVolume = 100,
  className,
  style,
  onReady,
  onStateChange,
}: YouTubePlayerProps) {
  //@ts-ignore
  const playerRef = useRef<YT.Player | null>(null);
  const [isReady, setReady] = useState(false);
  const [isMuted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(defaultRate);
  const [volume, setVolume] = useState(defaultVolume);

  const opts: YouTubeProps["opts"] = useMemo(
    () => ({
      width: "100%",
      height: "100%",
      playerVars: {
        autoplay: autoplay ? 1 : 0,
        controls: controls ? 1 : 0,
        start,
        end,
        loop: loop ? 1 : 0,
        playlist: loop ? videoId : undefined, // required by YT for looping a single video
        modestbranding: modestBranding ? 1 : 0,
        playsinline: playsInline ? 1 : 0,
        rel: showRelated ? 1 : 0,
      },
    }), [autoplay, controls, end, loop, modestBranding, playsInline, showRelated, start, videoId]
  );

  const handleReady: YouTubeProps["onReady"] = useCallback(
    //@ts-ignore
    (e) => {
      //@ts-ignore
      const p = e.target as YT.Player;
      playerRef.current = p;
      try {
        p.setPlaybackRate(rate);
        p.setVolume(volume);
      } catch {}
      setReady(true);
      onReady?.(p);
    },
    [onReady, rate, volume]
  );

  const handleStateChange: YouTubeProps["onStateChange"] = useCallback(
    //@ts-ignore
    (e) => {
      //@ts-ignore
      setPlaying(e.data === window.YT.PlayerState.PLAYING);
      //@ts-ignore
      onStateChange?.(e as unknown as YT.OnStateChangeEvent);
    },
    [onStateChange]
  );

  // Controls API wrappers
  const play = useCallback(() => playerRef.current?.playVideo(), []);
  const pause = useCallback(() => playerRef.current?.pauseVideo(), []);
  const stop = useCallback(() => playerRef.current?.stopVideo(), []);
  const mute = useCallback(() => {
    playerRef.current?.mute();
    setMuted(true);
  }, []);
  const unmute = useCallback(() => {
    playerRef.current?.unMute();
    setMuted(false);
  }, []);
  const seek = useCallback((seconds: number) => {
    if (!playerRef.current) return;
    const clamped = Math.max(0, seconds);
    playerRef.current.seekTo(clamped, true);
  }, []);
  const changeRate = useCallback((r: number) => {
    try {
      playerRef.current?.setPlaybackRate(r);
      setRate(r);
    } catch {}
  }, []);
  const changeVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(100, v));
    playerRef.current?.setVolume(clamped);
    setVolume(clamped);
  }, []);

  return (
    <div className={className} style={{ ...aspectWrapper, ...style }}>
      <div style={iframeFill}>
        <YouTube
          videoId={videoId}
          title={title}
          opts={opts}
          onReady={handleReady}
          onStateChange={handleStateChange}
        />
      </div>

      {showCustomUI && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            gap: 8,
            alignItems: "center",
            padding: 10,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.55) 40%, rgba(0,0,0,.65) 100%)",
            color: "#fff",
            fontSize: 14,
          }}
          aria-hidden={!isReady}
        >
          <button
            onClick={playing ? pause : play}
            disabled={!isReady}
            style={buttonStyle}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? "Pause" : "Play"}
          </button>

          <button
            onClick={isMuted ? unmute : mute}
            disabled={!isReady}
            style={buttonStyle}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? "Unmute" : "Mute"}
          </button>

          <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
            Speed
            <select
              value={rate}
              onChange={(e) => changeRate(parseFloat(e.target.value))}
              disabled={!isReady}
              style={selectStyle}
              aria-label="Playback speed"
            >
              {[0.25, 0.5, 1, 1.25, 1.5, 1.75, 2].map((r) => (
                <option key={r} value={r}>
                  {r}×
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
            Vol
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={volume}
              onChange={(e) => changeVolume(parseInt(e.target.value, 10))}
              disabled={!isReady}
              aria-label="Volume"
            />
          </label>

          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button onClick={() => seek((start ?? 0))} style={buttonStyle} disabled={!isReady}>
              ↺ Restart
            </button>
            <button onClick={stop} style={buttonStyle} disabled={!isReady}>
              Stop
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const buttonStyle: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,.25)",
  background: "rgba(255,255,255,.08)",
  color: "#fff",
  padding: "6px 10px",
  borderRadius: 8,
  cursor: "pointer",
};

const selectStyle: React.CSSProperties = {
  background: "rgba(255,255,255,.08)",
  color: "#fff",
  border: "1px solid rgba(255,255,255,.25)",
  padding: "6px 10px",
  borderRadius: 8,
};

