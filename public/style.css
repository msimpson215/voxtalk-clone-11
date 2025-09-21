body {
  margin:0;
  font-family:system-ui,sans-serif;
  display:grid;
  place-items:center;
  min-height:100vh;
  background: radial-gradient(circle at 50% 20%, #dbeafe, #93c5fd 40%, #1e3a8a 90%);
}

.app { text-align:center; max-width:600px; }

h1 { margin:12px 0; font-size:24px; }

#pttBtn {
  width:160px; height:160px;
  border-radius:50%;
  border:none;
  cursor:pointer;
  background: radial-gradient(circle at 30% 30%, #1e3a8a, #0f172a);
  position: relative;
  box-shadow:0 6px 20px rgba(30,64,175,.5);
  overflow: visible;
  transition: transform 0.15s ease, box-shadow 0.3s ease;
}
#pttBtn:hover { transform: scale(1.03); }
#pttBtn:active { transform: scale(0.95); }

/* Halo layers */
.halo {
  position: absolute;
  top: 50%; left: 50%;
  width: 160px; height: 160px;
  border-radius: 50%;
  border: 2px solid rgba(147,197,253,0.5);
  transform: translate(-50%, -50%) scale(0.9);
  opacity: 0;
}

#pttBtn.speaking .halo {
  animation: ripple 3s ease-out infinite;
}
#pttBtn.speaking .halo:nth-child(1)  { animation-delay: 0s; }
#pttBtn.speaking .halo:nth-child(2)  { animation-delay: 0.3s; }
#pttBtn.speaking .halo:nth-child(3)  { animation-delay: 0.6s; }
#pttBtn.speaking .halo:nth-child(4)  { animation-delay: 0.9s; }
#pttBtn.speaking .halo:nth-child(5)  { animation-delay: 1.2s; }
#pttBtn.speaking .halo:nth-child(6)  { animation-delay: 1.5s; }
#pttBtn.speaking .halo:nth-child(7)  { animation-delay: 1.8s; }
#pttBtn.speaking .halo:nth-child(8)  { animation-delay: 2.1s; }
#pttBtn.speaking .halo:nth-child(9)  { animation-delay: 2.4s; }
#pttBtn.speaking .halo:nth-child(10) { animation-delay: 2.7s; }

@keyframes ripple {
  0%   { opacity: 0.5; transform: translate(-50%, -50%) scale(0.9); }
  80%  { opacity: 0;   transform: translate(-50%, -50%) scale(2.5); }
  100% { opacity: 0;   transform: translate(-50%, -50%) scale(2.5); }
}

#answer {
  margin-top:20px;
  padding:12px;
  border:1px solid #ccc;
  border-radius:8px;
  background:white;
  min-height:80px;
  text-align:left;
  font-size:14px;
}

.line { margin:6px 0; }
.me { color:#2563eb; font-weight:600; }
.ai { color:#065f46; font-weight:600; }
.text { color:#111; }
.muted { color:#777; font-style:italic; }
