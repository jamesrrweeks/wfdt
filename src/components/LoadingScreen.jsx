import React, { useState, useEffect } from "react";
import { C, F, SPACE } from "../tokens.js";

export default function LoadingScreen() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      width: "100%",
      background: C.strokeWeak,
      gap: `${SPACE.m}px`,
    }}>

      <style>{`
        .pan {
          position: relative;
          width: 120px;
          height: 14px;
          border-radius: 0 0 15px 15px;
          background-color: #3D331A;
          box-shadow: 0 -1px 4px #5d6063 inset;
          animation: panRock 0.5s linear alternate infinite;
          transform-origin: 170px 0;
          z-index: 10;
        }

        .pan::before {
          content: '';
          position: absolute;
          left: calc(100% - 2px);
          top: 0;
          z-index: -2;
          height: 10px;
          width: 70px;
          border-radius: 0 4px 4px 0;
          background-repeat: no-repeat;
          background-image:
            linear-gradient(#6c4924, #4b2d21),
            linear-gradient(#3D331A 24px, transparent 0),
            linear-gradient(#7A7059 24px, transparent 0);
          background-size: 50px 10px, 4px 8px, 24px 4px;
          background-position: right center, 17px center, 0px center;
        }

        .pan::after {
          content: '';
          position: absolute;
          left: 50%;
          top: 0;
          z-index: -2;
          transform: translate(-50%, -20px) rotate3d(75, -2, 3, 78deg);
          width: 50px;
          height: 38px;
          background: #CDEA45;
          background-image: radial-gradient(ellipse 60% 40% at 30% 35%, rgba(255,255,255,0.35) 0%, transparent 70%);
          background-repeat: no-repeat;
          box-shadow: -2px -3px rgba(0,0,0,0.08) inset, 0 0 6px rgba(0,0,0,0.08) inset;
          border-radius: 42% 58% 55% 45% / 52% 44% 56% 48%;
          animation: toss 1s ease-out infinite;
        }

        @keyframes toss {
          0%,  100% {
            transform: translate(-50%, -20px) rotate3d(90, 0, 0, 90deg);
            opacity: 0;
            border-radius: 42% 58% 55% 45% / 52% 44% 56% 48%;
          }
          10%, 90% {
            transform: translate(-50%, -30px) rotate3d(90, 0, 0, 90deg);
            opacity: 1;
            border-radius: 42% 58% 55% 45% / 52% 44% 56% 48%;
          }
          25% {
            transform: translate(-50%, -45px) rotate3d(85, 17, 2, 70deg);
            border-radius: 38% 62% 48% 52% / 55% 45% 55% 45%;
          }
          50% {
            transform: translate(-55%, -58px) rotate3d(75, -8, 3, 50deg);
            border-radius: 50% 50% 60% 40% / 60% 40% 60% 40%;
          }
          75% {
            transform: translate(-50%, -45px) rotate3d(75, -3, 2, 70deg);
            border-radius: 45% 55% 42% 58% / 48% 52% 48% 52%;
          }
        }

        @keyframes panRock {
          0%  { transform: rotate(-5deg); }
          100% { transform: rotate(10deg); }
        }

        .progress-wrap {
          width: 280px;
          height: 5px;
          background: rgba(61, 51, 26, 0.12);
          border-radius: 99px;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          width: 0;
          background: #CDEA45;
          border-radius: 99px;
          animation: fillBar 40s linear forwards;
        }

       @keyframes fillBar {
  0%  { width: 0%; }
  60% { width: 75%; }
  85% { width: 88%; }
  100% { width: 95%; }
}

        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      <div style={{ position: "relative", width: "200px", height: "120px", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
        <div className="pan" />
      </div>

      <CopyRotator />

      <div className="progress-wrap">
        <div className="progress-bar" />
      </div>

    </div>
  );
}

function CopyRotator() {
  const lines = [
    "Finding what's in season…",
    "Checking your pantry…",
    "Writing your recipes…",
    "Coming up with ingredient alternatives..."
    "Almost there…",
  ];

  const [index, setIndex] = useState(0);
const [visible, setVisible] = useState(true);

useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex(i => (i + 1) % lines.length);
        setVisible(true);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <p style={{
      fontFamily: F,
      fontSize: "15px",
      color: C.textWeak,
      margin: 0,
      opacity: visible ? 1 : 0,
      transition: "opacity 0.4s ease",
      minHeight: "24px",
    }}>
      {lines[index]}
    </p>
  );
}
