import { useEffect, useRef } from 'react';
import { Howl } from 'howler';

const AUDIO_ASSETS = {
  ambient: '/audio/ambient_paris.mp3',
  click: '/audio/click.mp3',
  transition: '/audio/iris_whoosh.mp3',
  room: '/audio/room_hum.mp3',
};

export const useAudio = () => {
  const sounds = useRef<Record<string, Howl>>({});

  useEffect(() => {
    // Initialize sounds
    // Note: In a real app, we'd wait for user interaction to play
    sounds.current = {
      ambient: new Howl({ src: [AUDIO_ASSETS.ambient], loop: true, volume: 0.2 }),
      click: new Howl({ src: [AUDIO_ASSETS.click], volume: 0.4 }),
      transition: new Howl({ src: [AUDIO_ASSETS.transition], volume: 0.5 }),
      room: new Howl({ src: [AUDIO_ASSETS.room], loop: true, volume: 0.15 }),
    };

    return () => {
      Object.values(sounds.current).forEach(s => s.unload());
    };
  }, []);

  const play = (key: keyof typeof AUDIO_ASSETS) => {
    if (sounds.current[key]) {
      sounds.current[key].play();
    }
  };

  const fadeOut = (key: keyof typeof AUDIO_ASSETS, duration = 1000) => {
    const s = sounds.current[key];
    if (s) s.fade(s.volume(), 0, duration);
  };

  const fadeIn = (key: keyof typeof AUDIO_ASSETS, targetVol: number, duration = 1000) => {
    const s = sounds.current[key];
    if (s) {
      s.play();
      s.fade(0, targetVol, duration);
    }
  };

  return { play, fadeIn, fadeOut };
};
