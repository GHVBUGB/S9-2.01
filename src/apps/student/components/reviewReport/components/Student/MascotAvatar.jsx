import React from 'react';

export const MascotAvatar = ({ className = "" }) => {
  const [imgSrc, setImgSrc] = React.useState('/12月15日 (1)(1).gif');
  const [hasError, setHasError] = React.useState(false);

  const handleError = () => {
    console.error('图片加载失败，当前路径:', imgSrc);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 500 600" className="w-full h-full overflow-visible drop-shadow-2xl">
          <defs>
            <filter id="handDrawn" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
            </filter>
          </defs>
          <g filter="url(#handDrawn)" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="250" cy="560" rx="180" ry="20" fill="#E5E7EB" opacity="0.6" />
            <path d="M 180 250 C 150 250, 120 350, 120 450 C 120 530, 200 550, 250 550 C 300 550, 380 530, 380 450 C 380 350, 350 250, 320 250" fill="#FFFFFF" stroke="#111827" strokeWidth="8" />
            <path d="M 200 350 Q 250 320 300 350 Q 320 450 300 500 Q 250 520 200 500 Q 180 450 200 350" fill="#F9FAFB" stroke="none" />
            <path d="M 150 500 Q 140 560 170 570 Q 200 560 190 500" fill="#FFFFFF" stroke="#111827" strokeWidth="8" />
            <path d="M 310 500 Q 300 560 330 570 Q 360 560 350 500" fill="#FFFFFF" stroke="#111827" strokeWidth="8" />
            <path d="M 360 320 Q 420 300 440 250 Q 460 200 420 180 Q 380 180 380 220" fill="#FFFFFF" stroke="#111827" strokeWidth="8" />
            <path d="M 140 320 Q 80 350 70 400 Q 60 440 100 430" fill="#FFFFFF" stroke="#111827" strokeWidth="8" />
            <path d="M 130 250 C 110 150, 150 50, 250 50 C 350 50, 390 150, 370 250 C 360 280, 140 280, 130 250" fill="#FFFFFF" stroke="#111827" strokeWidth="8" />
            <path d="M 150 80 Q 120 20 180 40" fill="#FFFFFF" stroke="#111827" strokeWidth="8" />
            <path d="M 350 80 Q 380 20 320 40" fill="#FFFFFF" stroke="#111827" strokeWidth="8" />
            <circle cx="200" cy="160" r="25" fill="#111827" />
            <circle cx="210" cy="150" r="6" fill="#FFFFFF" />
            <circle cx="300" cy="160" r="22" fill="#FFFFFF" stroke="#111827" strokeWidth="4" />
            <circle cx="300" cy="160" r="5" fill="#111827" />
            <ellipse cx="250" cy="200" rx="18" ry="12" fill="#111827" />
            <path d="M 230 230 Q 250 240 270 230" stroke="#111827" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M 260 235 Q 260 260 280 255 Q 290 245 270 232" fill="#FF6B6B" stroke="#111827" strokeWidth="4" />
            <path d="M 160 200 L 180 190 M 165 210 L 185 200" stroke="#FFC0CB" strokeWidth="4" />
            <path d="M 320 190 L 340 200 M 315 200 L 335 210" stroke="#FFC0CB" strokeWidth="4" />
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <img 
        src={imgSrc}
        alt="51Talk 吉祥物" 
        className="w-full h-full object-contain animate-in zoom-in-95 duration-1000"
        style={{ 
          pointerEvents: 'none',
          filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.15))'
        }}
        onError={handleError}
      />
    </div>
  );
};
