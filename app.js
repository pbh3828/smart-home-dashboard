const $ = id => document.getElementById(id);
const state = { temp: 24.2, humid: 48, light: 412, lightOn: true, tempHistory:[23.1,23.4,23.8,24.5,24.7,24.2], humidHistory:[52,51,49,47,46,48] };

function updateClock(){
  const now=new Date();
  $('dateLabel').textContent=new Intl.DateTimeFormat('ko-KR',{month:'long',day:'numeric',weekday:'long'}).format(now).toUpperCase();
  $('updatedTime').textContent=now.toLocaleTimeString('ko-KR',{hour12:false});
}
function updateSensors(){
  state.temp=Math.max(21,Math.min(29,state.temp+(Math.random()-.48)*.16));
  state.humid=Math.max(35,Math.min(65,state.humid+(Math.random()-.5)*.7));
  state.light=Math.round(Math.max(330,Math.min(650,state.light+(Math.random()-.5)*14)));
  $('tempValue').textContent=state.temp.toFixed(1); $('humidValue').textContent=Math.round(state.humid); $('lightValue').textContent=state.light;
  $('tempBar').style.width=((state.temp-18)/12*100)+'%'; $('humidBar').style.width=state.humid+'%'; updateClock();
}
function drawChart(){
  const c=$('trendChart'),dpr=window.devicePixelRatio||1,rect=c.getBoundingClientRect(); c.width=rect.width*dpr;c.height=rect.height*dpr;
  const x=c.getContext('2d');x.scale(dpr,dpr);const w=rect.width,h=rect.height,p=10;
  x.strokeStyle=getComputedStyle(document.body).getPropertyValue('--line');x.lineWidth=1;
  for(let i=0;i<4;i++){const y=p+i*(h-2*p)/3;x.beginPath();x.moveTo(0,y);x.lineTo(w,y);x.stroke()}
  const line=(arr,color,min,max)=>{x.strokeStyle=color;x.lineWidth=2.5;x.lineCap='round';x.lineJoin='round';x.beginPath();arr.forEach((v,i)=>{const px=p+i*(w-2*p)/(arr.length-1),py=h-p-(v-min)/(max-min)*(h-2*p);i?x.lineTo(px,py):x.moveTo(px,py)});x.stroke()};
  line(state.humidHistory,'#5b91a7',35,65);line(state.tempHistory,'#e79853',20,28);
}
$('themeBtn').onclick=()=>{document.body.classList.toggle('dark');$('themeBtn').textContent=document.body.classList.contains('dark')?'☀':'☾';drawChart()};
$('autoToggle').onchange=e=>e.target.closest('.control-panel').classList.toggle('disabled',!e.target.checked);
$('armButton').onclick=e=>{
  const panel=e.currentTarget.closest('.security-panel'), armed=e.currentTarget.classList.toggle('armed');
  panel.classList.toggle('disarmed',!armed);
  e.currentTarget.innerHTML=armed?'<span>●</span> 외출 감시 중':'<span>●</span> 감시 꺼짐';
  $('securityState').textContent=armed?'이상 없음':'감시 중지';
  $('securityMessage').textContent=armed?'외출 후 감지된 움직임이 없어요.':'센서 기록과 알림을 일시 중지했어요.';
};
$('clearBtn').onclick=()=>{$('alerts').innerHTML='<p style="text-align:center;color:var(--muted);font-size:12px;padding:25px 0 10px">새로운 알림이 없어요.</p>'};
window.addEventListener('resize',drawChart);updateClock();updateSensors();drawChart();setInterval(updateSensors,3000);
