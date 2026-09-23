'use client';

import { motion } from 'motion/react';
import { LoaderCircle, Pause, Play, SkipForward, Volume2, VolumeX, X } from 'lucide-react';
import { PREVIEW_DURATION, type AudioPlayerState } from '../lib/audio';

export default function AudioPlayer({ player }: { player: AudioPlayerState }) {
  if (!player.active) return null;
  const formatTime = (time: number) => `0:${Math.floor(time).toString().padStart(2, '0')}`;
  return (
    <motion.aside className="audio-player" aria-label="Audio preview player" initial={{ y: '110%' }} animate={{ y: 0 }} exit={{ y: '110%' }} transition={{ duration: 0.3 }}>
      <div className="player-track">
        <img src={player.active.image} alt="" />
        <div><strong>{player.active.title}<span>{player.active.artist}</span></strong><p>ORIGINAL CONCEPT SKETCH / 30 SEC</p></div>
      </div>
      <div className="player-controls">
        <button className="player-play" onClick={() => player.play(player.active!)} aria-label={player.playing ? 'Pause preview' : 'Play preview'}>{player.loading ? <LoaderCircle size={18} className="spin" /> : player.playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}</button>
        <button className="icon-button player-next" onClick={player.next} aria-label="Next preview"><SkipForward size={17} /></button>
      </div>
      <div className="player-timeline"><span>{formatTime(player.elapsed)}</span><input aria-label="Playback position" type="range" min="0" max={PREVIEW_DURATION} step="0.1" value={player.elapsed} onChange={(event) => player.seek(Number(event.target.value))} /><span>0:30</span></div>
      <button className="icon-button player-volume" onClick={player.toggleMute} aria-label={player.muted ? 'Unmute' : 'Mute'}>{player.muted ? <VolumeX size={19} /> : <Volume2 size={19} />}</button>
      <button className="icon-button player-close" onClick={player.close} aria-label="Close audio player"><X size={20} /></button>
    </motion.aside>
  );
}
