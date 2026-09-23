'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { releases, type Release } from './data';

export const PREVIEW_DURATION = 30;
const bufferCache = new Map<string, AudioBuffer>();

// Original synthesized sketches keep the concept player self-contained, with no third-party music.
async function renderSketch(release: Release): Promise<AudioBuffer> {
  const cached = bufferCache.get(release.id);
  if (cached) return cached;
  const sampleRate = 22050;
  const offline = new OfflineAudioContext(2, sampleRate * PREVIEW_DURATION, sampleRate);
  const master = offline.createGain();
  master.gain.value = 0.56;
  const compressor = offline.createDynamicsCompressor();
  master.connect(compressor);
  compressor.connect(offline.destination);
  const beat = 60 / release.bpm;
  const noise = offline.createBuffer(1, sampleRate, sampleRate);
  const noiseData = noise.getChannelData(0);
  let seed = Math.round(release.root * 100);
  for (let i = 0; i < noiseData.length; i++) {
    seed = (seed * 16807) % 2147483647;
    noiseData[i] = ((seed / 2147483647) * 2 - 1) * 0.5;
  }

  const tone = (frequency: number, start: number, length: number, volume: number, type: OscillatorType = 'sine', pan = 0) => {
    const oscillator = offline.createOscillator();
    const gain = offline.createGain();
    const panner = offline.createStereoPanner();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    panner.pan.value = pan;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
    oscillator.connect(gain).connect(panner).connect(master);
    oscillator.start(start);
    oscillator.stop(start + length + 0.02);
  };

  const percussion = (start: number, isSnare: boolean) => {
    const source = offline.createBufferSource();
    const filter = offline.createBiquadFilter();
    const gain = offline.createGain();
    source.buffer = noise;
    filter.type = 'highpass';
    filter.frequency.value = isSnare ? 1500 : 7000;
    gain.gain.setValueAtTime(isSnare ? 0.18 : 0.07, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + (isSnare ? 0.13 : 0.055));
    source.connect(filter).connect(gain).connect(master);
    source.start(start);
    source.stop(start + 0.16);
  };

  for (let step = 0; step * beat / 2 < PREVIEW_DURATION - 0.5; step++) {
    const time = step * beat / 2 + (step % 2 ? 0.025 : 0);
    const position = step % 8;
    percussion(time, position === 2 || position === 6);
    if (position === 0 || position === 5) {
      const kick = offline.createOscillator();
      const gain = offline.createGain();
      kick.frequency.setValueAtTime(130, time);
      kick.frequency.exponentialRampToValueAtTime(43, time + 0.15);
      gain.gain.setValueAtTime(0.45, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.25);
      kick.connect(gain).connect(master);
      kick.start(time);
      kick.stop(time + 0.27);
    }
    const progression = [0, 5, -2, 3];
    const root = release.root * Math.pow(2, progression[Math.floor(step / 16) % 4] / 12);
    if (position === 0 || position === 3 || position === 6) tone(root / 2, time, beat * 0.8, 0.2, 'sine');
    if (step % 8 === 0) {
      [0, 3, 7, 10, 14].forEach((note, index) => tone(root * Math.pow(2, note / 12), time + index * 0.018, beat * 3.6, 0.043, 'sine', (index - 2) * 0.25));
    }
    if ([3, 7, 10, 13].includes(step % 16)) {
      const note = [14, 10, 7, 3][Math.floor(step / 3) % 4];
      tone(root * Math.pow(2, note / 12) * 2, time, beat * 1.5, 0.035, 'sine', 0.3);
    }
  }
  master.gain.setValueAtTime(0.56, PREVIEW_DURATION - 1.5);
  master.gain.linearRampToValueAtTime(0, PREVIEW_DURATION);
  const buffer = await offline.startRendering();
  bufferCache.set(release.id, buffer);
  return buffer;
}

export function useAudioPlayer(onError: (message: string) => void) {
  const [active, setActive] = useState<Release | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [muted, setMuted] = useState(false);
  const context = useRef<AudioContext | null>(null);
  const output = useRef<GainNode | null>(null);
  const source = useRef<AudioBufferSourceNode | null>(null);
  const offset = useRef(0);
  const startedAt = useRef(0);
  const request = useRef(0);

  const stopSource = useCallback(() => {
    if (source.current) {
      source.current.onended = null;
      source.current.stop();
      source.current.disconnect();
      source.current = null;
    }
  }, []);

  const start = useCallback(async (release: Release, from = 0) => {
    const currentRequest = ++request.current;
    const startOffset = from >= PREVIEW_DURATION ? 0 : Math.max(0, from);
    stopSource();
    setActive(release);
    setPlaying(false);
    setLoading(true);
    setElapsed(startOffset);
    offset.current = startOffset;
    try {
      if (!context.current) {
        context.current = new AudioContext();
        output.current = context.current.createGain();
        output.current.gain.value = muted ? 0 : 0.8;
        output.current.connect(context.current.destination);
      }
      await context.current.resume();
      const buffer = await renderSketch(release);
      if (currentRequest !== request.current || !context.current || !output.current) return;
      const node = context.current.createBufferSource();
      node.buffer = buffer;
      node.connect(output.current);
      node.onended = () => {
        node.disconnect();
        source.current = null;
        offset.current = 0;
        setPlaying(false);
        setElapsed(0);
      };
      node.start(0, startOffset);
      startedAt.current = context.current.currentTime;
      source.current = node;
      setPlaying(true);
    } catch {
      if (currentRequest === request.current) onError('Audio could not start. Please try again in a browser that supports Web Audio.');
    } finally {
      if (currentRequest === request.current) setLoading(false);
    }
  }, [muted, onError, stopSource]);

  const pause = useCallback(() => {
    ++request.current;
    if (context.current && source.current) offset.current = Math.min(PREVIEW_DURATION, offset.current + context.current.currentTime - startedAt.current);
    stopSource();
    setElapsed(offset.current);
    setPlaying(false);
    setLoading(false);
  }, [stopSource]);

  const play = useCallback((release: Release) => {
    if (active?.id === release.id && (playing || loading)) pause();
    else void start(release, active?.id === release.id ? offset.current : 0);
  }, [active, playing, loading, pause, start]);

  const seek = (time: number) => {
    const next = Math.min(Math.max(time, 0), PREVIEW_DURATION - 0.1);
    offset.current = next;
    setElapsed(next);
    if (active && playing) void start(active, next);
  };

  const close = () => {
    pause();
    offset.current = 0;
    setElapsed(0);
    setActive(null);
  };

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      if (context.current) setElapsed(Math.min(PREVIEW_DURATION, offset.current + context.current.currentTime - startedAt.current));
    }, 150);
    return () => window.clearInterval(timer);
  }, [playing]);

  useEffect(() => {
    if (output.current) output.current.gain.value = muted ? 0 : 0.8;
  }, [muted]);

  useEffect(() => () => {
    ++request.current;
    stopSource();
    void context.current?.close();
    context.current = null;
    output.current = null;
  }, [stopSource]);

  return { active, playing, loading, elapsed, muted, play, seek, close, toggleMute: () => setMuted((value) => !value), next: () => { const index = releases.findIndex((release) => release.id === active?.id); void start(releases[(index + 1) % releases.length]); } };
}

export type AudioPlayerState = ReturnType<typeof useAudioPlayer>;
