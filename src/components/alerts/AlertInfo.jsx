import React, { useContext } from "react";
import { LanguageContext } from "@/components/contexts/LanguageContext";
import useFont from '@/hooks/useFont';

export default function AlertInfo({
  message = "NO DATA",
  // Never default this to "SYSTEM EMPTY": that string leaked onto every empty
  // / error state whose call site omitted a sub-message (NoDataInfo, the
  // artwork list, the image order page …), where it read like a crash. Pass an
  // explicit sub-message when one helps; empty renders nothing.
  subMessage = "",
  buttonText = "Back",
  onBack = null,
  isCn = null,
  messageCn = "无数据",
  subMessageCn = "",
  buttonTextCn = "返回",
}) {
  const langContext = useContext(LanguageContext);
  const { contentFontFamily, buttonFontFamily } = useFont();
  const useCn = isCn !== null ? isCn : langContext?.isCn;
  const displayMessage = useCn ? messageCn : message;
  const displaySubMessage = useCn ? subMessageCn : subMessage;
  const displayButtonText = useCn ? buttonTextCn : buttonText;

  const alertStyle = {
    textAlign: 'center',
    margin: '2rem 0',
    padding: "60px 40px",
    marginTop: "200px",
    background: 'transparent',
    color: 'var(--text-primary, #000000)',
    border: '2px solid var(--text-primary, #000000)',
    maxWidth: '500px',
    marginLeft: 'auto',
    marginRight: 'auto',
    fontWeight: 300,
    fontSize: '1.1rem',
    position: 'relative',
    overflow: 'hidden',
    animation: 'fadeInUp 0.8s cubic-bezier(.77,0,.18,1), borderGlow 4s ease-in-out infinite',
    fontFamily: contentFontFamily,
    borderRadius: '18px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    letterSpacing: '2px',
  };

  const staticNoiseStyle = {
    position: 'absolute',
    top: '20px',
    left: '20px',
    width: 'calc(100% - 40px)',
    height: 'calc(100% - 40px)',
    opacity: 0.08,
    background: `
      radial-gradient(circle at 20% 80%, transparent 20%, var(--text-primary, #000000) 21%, var(--text-primary, #000000) 21%, transparent 22%),
      radial-gradient(circle at 80% 20%, transparent 20%, var(--text-primary, #000000) 21%, var(--text-primary, #000000) 21%, transparent 22%),
      radial-gradient(circle at 40% 40%, transparent 20%, var(--text-primary, #000000) 21%, var(--text-primary, #000000) 21%, transparent 22%),
      radial-gradient(circle at 60% 60%, transparent 20%, var(--text-primary, #000000) 21%, var(--text-primary, #000000) 21%, transparent 22%),
      radial-gradient(circle at 90% 90%, transparent 20%, var(--text-primary, #000000) 21%, var(--text-primary, #000000) 21%, transparent 22%),
      radial-gradient(circle at 10% 10%, transparent 20%, var(--text-primary, #000000) 21%, var(--text-primary, #000000) 21%, transparent 22%),
      radial-gradient(circle at 30% 70%, transparent 20%, var(--text-primary, #000000) 21%, var(--text-primary, #000000) 21%, transparent 22%),
      radial-gradient(circle at 70% 30%, transparent 20%, var(--text-primary, #000000) 21%, var(--text-primary, #000000) 21%, transparent 22%)
    `,
    backgroundSize: '50px 50px, 80px 80px, 60px 60px, 40px 40px, 70px 70px, 90px 90px, 55px 55px, 65px 65px',
    animation: 'staticNoise 0.1s linear infinite',
    pointerEvents: 'none',
  };

  const glitchLinesStyle = {
    position: 'absolute',
    top: '20px',
    left: '20px',
    width: 'calc(100% - 40px)',
    height: 'calc(100% - 40px)',
    opacity: 0.2,
    background: `
      linear-gradient(0deg, transparent 98%, var(--text-primary, #000000) 98%, var(--text-primary, #000000) 100%, transparent 100%),
      linear-gradient(0deg, transparent 85%, var(--text-primary, #000000) 85%, var(--text-primary, #000000) 87%, transparent 87%),
      linear-gradient(0deg, transparent 45%, var(--text-primary, #000000) 45%, var(--text-primary, #000000) 46%, transparent 46%),
      linear-gradient(0deg, transparent 72%, var(--text-primary, #000000) 72%, var(--text-primary, #000000) 73%, transparent 73%),
      linear-gradient(90deg, transparent 95%, var(--text-primary, #000000) 95%, var(--text-primary, #000000) 97%, transparent 97%),
      linear-gradient(90deg, transparent 30%, var(--text-primary, #000000) 30%, var(--text-primary, #000000) 32%, transparent 32%),
      linear-gradient(90deg, transparent 65%, var(--text-primary, #000000) 65%, var(--text-primary, #000000) 67%, transparent 67%)
    `,
    backgroundSize: '100% 20px, 100% 35px, 100% 60px, 100% 25px, 20px 100%, 35px 100%, 60px 100%',
    animation: 'glitchLines 3s linear infinite',
    pointerEvents: 'none',
  };

  const textContainerStyle = {
    position: 'relative',
    zIndex: 2,
    padding: '40px 30px',
    margin: '0 20px',
    background: 'transparent',
  };

  const textStyle = {
    fontFamily: contentFontFamily,
    letterSpacing: '2px',
    animation: 'slideIn 0.8s cubic-bezier(.77,0,.18,1) 0.2s both',
    fontWeight: 100,
    background: 'transparent',
  };

  const scanlineStyle = {
    position: 'absolute',
    top: '20px',
    left: '20px',
    width: 'calc(100% - 40px)',
    height: '2px',
    background: 'var(--text-primary, #000000)',
    animation: 'scanline 3s linear infinite',
    opacity: 0.6,
    pointerEvents: 'none',
  };

  const buttonStyle = {
    marginTop: '32px',
    padding: '12px 36px',
    fontSize: '1.1rem',
    fontWeight: 600,
    fontFamily: buttonFontFamily,
    borderRadius: '8px',
    background: 'transparent',
    color: 'var(--text-primary, #000000)',
    border: '2px solid var(--text-primary, #000000)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    letterSpacing: '2px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    outline: 'none',
    textTransform: 'uppercase',
    position: 'relative',
    overflow: 'hidden',
  };

  const styles = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes staticNoise {
      0% {
        transform: translateX(0) translateY(0);
        background-position: 0 0, 10px 10px, 20px 20px, 30px 30px, 40px 40px, 50px 50px, 60px 60px, 70px 70px;
      }
      10% {
        transform: translateX(2px) translateY(-1px);
        background-position: 5px 5px, 15px 15px, 25px 25px, 35px 35px, 45px 45px, 55px 55px, 65px 65px, 75px 75px;
      }
      20% {
        transform: translateX(-1px) translateY(2px);
        background-position: -5px -5px, 5px 5px, 15px 15px, 25px 25px, 35px 35px, 45px 45px, 55px 55px, 65px 65px;
      }
      30% {
        transform: translateX(1px) translateY(-2px);
        background-position: 10px 10px, 20px 20px, 30px 30px, 40px 40px, 50px 50px, 60px 60px, 70px 70px, 80px 80px;
      }
      40% {
        transform: translateX(-2px) translateY(1px);
        background-position: -10px -10px, 0px 0px, 10px 10px, 20px 20px, 30px 30px, 40px 40px, 50px 50px, 60px 60px;
      }
      50% {
        transform: translateX(3px) translateY(-3px);
        background-position: 15px 15px, 25px 25px, 35px 35px, 45px 45px, 55px 55px, 65px 65px, 75px 75px, 85px 85px;
      }
      60% {
        transform: translateX(-1px) translateY(3px);
        background-position: -15px -15px, -5px -5px, 5px 5px, 15px 15px, 25px 25px, 35px 35px, 45px 45px, 55px 55px;
      }
      70% {
        transform: translateX(2px) translateY(-1px);
        background-position: 20px 20px, 30px 30px, 40px 40px, 50px 50px, 60px 60px, 70px 70px, 80px 80px, 90px 90px;
      }
      80% {
        transform: translateX(-3px) translateY(2px);
        background-position: -20px -20px, -10px -10px, 0px 0px, 10px 10px, 20px 20px, 30px 30px, 40px 40px, 50px 50px;
      }
      90% {
        transform: translateX(1px) translateY(-2px);
        background-position: 25px 25px, 35px 35px, 45px 45px, 55px 55px, 65px 65px, 75px 75px, 85px 85px, 95px 95px;
      }
      100% {
        transform: translateX(0) translateY(0);
        background-position: 0 0, 10px 10px, 20px 20px, 30px 30px, 40px 40px, 50px 50px, 60px 60px, 70px 70px;
      }
    }

    @keyframes glitchLines {
      0% {
        opacity: 0.2;
        background-position: 0 0px, 0 10px, 0 20px, 0 30px, 0px 0, 10px 0, 20px 0;
      }
      25% {
        opacity: 0.1;
        background-position: 0 5px, 0 15px, 0 25px, 0 35px, 5px 0, 15px 0, 25px 0;
      }
      50% {
        opacity: 0.3;
        background-position: 0 -5px, 0 5px, 0 15px, 0 25px, -5px 0, 5px 0, 15px 0;
      }
      75% {
        opacity: 0.15;
        background-position: 0 10px, 0 20px, 0 30px, 0 40px, 10px 0, 20px 0, 30px 0;
      }
      100% {
        opacity: 0.2;
        background-position: 0 0px, 0 10px, 0 20px, 0 30px, 0px 0, 10px 0, 20px 0;
      }
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes scanline {
      0% {
        top: 20px;
        opacity: 1;
      }
      50% {
        opacity: 0.3;
      }
      100% {
        top: calc(100% - 20px);
        opacity: 1;
      }
    }

    @keyframes textGlitch {
      0%, 90%, 100% {
        text-shadow: none;
        transform: translateX(0);
      }
      91% {
        text-shadow: 2px 0 var(--text-primary, #000000), -2px 0 var(--text-primary, #000000);
        transform: translateX(-2px);
      }
      92% {
        text-shadow: -2px 0 var(--text-primary, #000000), 2px 0 var(--text-primary, #000000);
        transform: translateX(2px);
      }
      93% {
        text-shadow: 1px 0 var(--text-primary, #000000), -1px 0 var(--text-primary, #000000);
        transform: translateX(-1px);
      }
      94% {
        text-shadow: none;
        transform: translateX(0);
      }
    }

    @keyframes borderGlow {
      0%, 100% {
        border-color: var(--text-primary, #000000);
        box-shadow: 0 0 0 0 rgba(0,0,0,0.1);
      }
      50% {
        border-color: var(--text-primary, #000000);
        box-shadow: 0 0 20px 2px rgba(0,0,0,0.2);
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div style={alertStyle}>
        <div style={staticNoiseStyle}></div>
        <div style={glitchLinesStyle}></div>
        <div style={scanlineStyle}></div>
        <div style={textContainerStyle}>
          <div style={textStyle}>
                         <div style={{ marginBottom: '20px', fontSize: '1.8rem', fontWeight: 100, letterSpacing: '6px', background: 'transparent' }}>
               {displayMessage}
             </div>
             <div style={{ 
               width: '60%', 
               height: '1px', 
               background: 'repeating-linear-gradient(to right, var(--text-primary, #000000) 0, var(--text-primary, #000000) 8px, transparent 8px, transparent 12px)',
               margin: '0 auto 20px auto',
               opacity: 0.6
             }}></div>
             <div style={{ fontSize: '0.8rem', opacity: 0.7, fontWeight: 100, letterSpacing: '3px', background: 'transparent' }}>
               {displaySubMessage}
             </div>
            {onBack && (
              <button style={buttonStyle} onClick={onBack}>{displayButtonText}</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
