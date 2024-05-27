import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Fitnes1.css';
import { HomeOutlined, DashboardOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';

const Fitnes1 = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const videoRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  useEffect(() => {
    let intervalId;

    if (isCameraOpen) {
      intervalId = setInterval(() => {
        const videoElement = videoRef.current;
        if (videoElement) {
          videoElement.src = `http://127.0.0.1:5000/video_feed?timestamp=${Date.now()}`;
        }
      }, 100);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isCameraOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const startCamera = () => {
    setIsCameraOpen(true);
  };

  const stopCamera = () => {
    setIsCameraOpen(false);
  };

  return (
    <div className="fitnes1-container">
      <div className="tab-bar">
        <div
          className={`hamburger-icon ${isSidebarOpen ? 'active' : ''}`}
          onClick={toggleSidebar}
        >
          &#9776;
        </div>
        <Link to="/profile" className="profile-icon">
          <UserOutlined />
        </Link>
      </div>
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <ul>
          <li><HomeOutlined /> Home</li>
          <li><DashboardOutlined /> Dashboard</li>
          <li><CalendarOutlined /> Calendar</li>
          <li><UserOutlined /> Profile</li>
        </ul>
      </div>
      <h1>首の可動性</h1>
      <div className="description">
        <p>長時間のデスクワークやスマホの操作で悪い姿勢(ストレートネックなど)になってしまい、</p>
        <p>首回りの筋肉が硬くなってる方も多いと思います。首回りの筋肉の硬さが習慣的になると</p>
        <p>頭痛や頭部痛の原因となります。セルフチェック動画を活用し、首の可動性を確認してみましょう。</p>
      </div>
      <div className="video-container">
        <div className="video-item">
          <h2>自分の身体知っていますか？</h2>
          <p>ー 整体広沼のセルフチェック ー</p>
          <div className="video-wrapper">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/4-YHy0wMT2w"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
        <div className="video-item">
          <h2>自分の身体知っていますか？</h2>
          <p>ー 整体広沼の動作改善エクササイズ ー</p>
          <div className="video-wrapper">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/fw0DQBt3psM"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
      <div className={`video-container ${isCameraOpen ? 'camera-open' : ''}`}>
        {isCameraOpen ? (
          <div className="camera-feed">
            <img ref={videoRef} alt="Video feed" />
            <button className="stop-button" onClick={stopCamera}>
              撮影を停止する
            </button>
          </div>
        ) : (
          <button className="start-button" onClick={startCamera}>
            撮影を開始する
          </button>
        )}
      </div>
    </div>
  );
};

export default Fitnes1;