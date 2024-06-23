import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Fitnes1.css';
import { HomeOutlined, DashboardOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';

const Fitnes1 = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const streamRef = useRef(null);
  const detectFrameIdRef = useRef(null);

  useEffect(() => {
    if (isCameraOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isCameraOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play();
        detectObjects();
      };
    } catch (err) {
      console.error("Error accessing the camera: ", err);
      alert("カメラへのアクセスが拒否されました。ブラウザの設定を確認してください。");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (detectFrameIdRef.current) {
      cancelAnimationFrame(detectFrameIdRef.current);
      detectFrameIdRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const detectObjects = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const detectFrame = async () => {
      if (!isCameraOpen) {
        return;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const videoFrame = canvas.toDataURL('image/jpeg', 0.8);

      try {
        const response = await fetch('http://localhost:5000/process_frame', {
          method: 'POST',
          body: JSON.stringify({ image: videoFrame }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const { processedFrame } = await response.json();

        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = processedFrame;
      } catch (err) {
        console.error('Error processing frame:', err);
      }

      detectFrameIdRef.current = requestAnimationFrame(detectFrame);
    };

    detectFrameIdRef.current = requestAnimationFrame(detectFrame);
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
            <video ref={videoRef} style={{ display: 'none' }} autoPlay muted />
            <canvas ref={canvasRef} style={{ width: '100%', height: 'auto' }} />
            <button className="stop-button" onClick={() => setIsCameraOpen(false)}>
              撮影を停止する
            </button>
          </div>
        ) : (
          <button className="start-button" onClick={() => setIsCameraOpen(true)}>
            撮影を開始する
          </button>
        )}
      </div>
    </div>
  );
};

export default Fitnes1;