import React, { useState, useEffect } from "react";
import useSound from "use-sound";
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai";
import { BiSkipPrevious, BiSkipNext } from "react-icons/bi";
import { IconContext } from "react-icons";
import TitleBar from "./TitleBar"; // 👈 import the new title bar component

const Player = () => {
  const playlist = [
    {
      title: "Rubaiyyan",
      artist: "Qala",
      src: "/songs/rubaiyyan.mp3",
      cover: "https://picsum.photos/200?1",
    },
    {
      title: "Kesariya",
      artist: "Brahmastra",
      src: "/songs/kesariya.mp3",
      cover: "https://picsum.photos/200?2",
    },
    {
      title: "Apna Bana Le",
      artist: "Bhediya",
      src: "/songs/apna.mp3",
      cover: "https://picsum.photos/200?3",
    },
  ];

  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currTime, setCurrTime] = useState({ min: 0, sec: 0 });
  const [time, setTime] = useState({ min: 0, sec: 0 });
  const [seconds, setSeconds] = useState(0);

  const currentSong = playlist[currentSongIndex];
  const [play, { sound, duration, stop }] = useSound(currentSong.src, {
    volume: 0.5,
    interrupt: true,
    onend: () => handleNext(),
  });

  const togglePlay = () => {
    if (isPlaying) {
      sound?.pause();
      setIsPlaying(false);
    } else {
      play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    setIsPlaying(false);
    setCurrTime({ min: 0, sec: 0 });
    setTime({ min: 0, sec: 0 });
    setSeconds(0);
  }, [currentSongIndex]);

  useEffect(() => {
    let interval;
    if (sound && isPlaying) {
      interval = setInterval(() => {
        const seek = sound.seek() || 0;
        const dur = sound.duration() || 0;
        setCurrTime({
          min: Math.floor(seek / 60),
          sec: Math.floor(seek % 60),
        });
        setTime({
          min: Math.floor(dur / 60),
          sec: Math.floor(dur % 60),
        });
        setSeconds(seek);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [sound, isPlaying]);

  const handleTimelineChange = (e) => {
    const seekTime = e.target.value;
    if (sound) sound.seek(seekTime);
    setSeconds(seekTime);
  };

  const handleNext = () => {
    stop();
    setCurrentSongIndex((prev) => (prev + 1) % playlist.length);
    setIsPlaying(false);
  };

  const handlePrev = () => {
    stop();
    setCurrentSongIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    setIsPlaying(false);
  };

  const handlePlaylistClick = (index) => {
    stop();
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying) {
      play();
    }
  }, [currentSongIndex]);

  return (
    <>
      <TitleBar />
      <div className="player-container">
        <div className="playlist">
          <h2>Playlist</h2>
          {playlist.map((song, index) => (
            <div
              key={index}
              className={`playlist-item ${currentSongIndex === index ? "active" : ""}`}
              onClick={() => handlePlaylistClick(index)}
            >
              <img src={song.cover} alt="cover" className="playlist-cover" />
              <div>
                <h3>{song.title}</h3>
                <p>{song.artist}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="player">
          <h2>Now Playing</h2>
          <h3>{currentSong.title}</h3>
          <p>{currentSong.artist}</p>
          <img src={currentSong.cover} alt="cover" className="cover" />

          <div className="controls">
            <IconContext.Provider value={{ size: "3em", color: "#27AE60" }}>
              <BiSkipPrevious onClick={handlePrev} />
              {isPlaying ? (
                <AiFillPauseCircle onClick={togglePlay} />
              ) : (
                <AiFillPlayCircle onClick={togglePlay} />
              )}
              <BiSkipNext onClick={handleNext} />
            </IconContext.Provider>
          </div>

          <div className="time-controls">
            <span>
              {currTime.min}:{currTime.sec.toString().padStart(2, "0")}
            </span>
            <span>
              {time.min}:{time.sec.toString().padStart(2, "0")}
            </span>
          </div>

          <input
            type="range"
            min="0"
            max={time.min * 60 + time.sec}
            value={seconds}
            onChange={handleTimelineChange}
            className="timeline"
          />
        </div>
      </div>
    </>
  );
};

export default Player;
