const input = document.querySelector('.input');
const posts = document.querySelector('.posts');
const enterCoords = document.querySelector('.enter-coords');
const inputCoords =document.querySelector('.input-coords');
const cancel = document.querySelector('.cancel');
const ok = document.querySelector('.ok');
const label = document.querySelector('.label');
const audioBut = document.querySelector('.audio-button');
const videoBut = document.querySelector('.video-button');
const saveBut = document.querySelector('.save-button');
const cancelBut = document.querySelector('.cancel-button');
const timer = document.querySelector('.timer');
let seconds = 0;
let minutes = 0;
let currentSource;
let srcAudio;
let recordMode;



function placeAudioVideo() {
  const {top, left} = input.getBoundingClientRect();
  audioBut.style.top = `${top - 5}px`;
  audioBut.style.left = `${left + input.offsetWidth - 100}px`;
  videoBut.style.top = `${top - 5}px`;
  videoBut.style.left = `${left + input.offsetWidth - 50}px`;
  saveBut.style.top = `${top - 5}px`;
  saveBut.style.left = `${left + input.offsetWidth - 130}px`;
  cancelBut.style.top = `${top - 5}px`;
  cancelBut.style.left = `${left + input.offsetWidth - 20}px`;
  timer.style.top = `${top - 5}px`;
  timer.style.left = `${left + input.offsetWidth - 90}px`;
}

placeAudioVideo();

function timerC() {
  seconds += 1;
  let secondsRes = seconds.toString().padStart(2,0);
  if(seconds === 60)
  {
    seconds = 0;
    secondsRes = seconds.toString().padStart(2,0);
    minutes+=1;
    minutesRes = minutes.toString().padStart(2,0)
  }
  let minutesRes = minutes.toString().padStart(2,0);
  timer.textContent = `${minutesRes}:${secondsRes}`;
}

audioBut.addEventListener('click' , () => {
  (async() => {
    if(!navigator.mediaDevices)
    {
      console.log(1)
      return;
    }
    if(!window.MediaRecorder)
    {
      console.log(1)
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      });
      const recorder = new MediaRecorder(stream);
      const chunks = [];
      recorder.addEventListener('start', () => {
        console.log('recording start');
      })
      recorder.addEventListener('dataavailable', (evt) => {
        console.log('data available');
        chunks.push(evt.data);
      });
      recorder.addEventListener('stop', () => {
        console.log('recording stop');
        if(recordMode==='save')
        {
          const blob = new Blob(chunks);
          srcAudio = URL.createObjectURL(blob);
            if(navigator.geolocation) {
              navigator.geolocation.getCurrentPosition((pos) => {
                let coordsRes = pos.coords;
                addAudio(srcAudio, coordsRes);
              }, () => {
                currentSource = 'audio';
                enterCoords.style.display = 'block';
                input.setAttribute("readonly", true);
              });
            }
            audioBut.style.display = 'block';
            videoBut.style.display = 'block';
            saveBut.style.display = 'none';
            cancelBut.style.display = 'none';
            timer.style.display = 'none';
            saveBut.removeEventListener('click', saveAudio);
        }
        else {
            audioBut.style.display = 'block';
            videoBut.style.display = 'block';
            saveBut.style.display = 'none';
            cancelBut.style.display = 'none';
            timer.style.display = 'none';
            saveBut.removeEventListener('click', saveAudio);
        }
      })
      audioBut.style.display = 'none';
      videoBut.style.display = 'none';
      saveBut.style.display = 'block';
      cancelBut.style.display = 'block';
      timer.style.display = 'block';
      let intId = setInterval(timerC,1000);
      recorder.start();
      
      function saveAudio() {
        recordMode = 'save';
          clearInterval(intId);
          minutes = 0;
          seconds = 0;
          recorder.stop();
          stream.getTracks().forEach(track => track.stop());
      }

      function cancelAudio() {
        recordMode = 'cancel';
        clearInterval(intId);
          minutes = 0;
          seconds = 0;
          recorder.stop();
          stream.getTracks().forEach(track => track.stop());
      }
      saveBut.addEventListener('click', saveAudio)
      cancelBut.addEventListener('click', cancelAudio);
    }
    catch (e) {
      console.error(e);
    }
  })()
})

cancel.addEventListener('click', () => {
  enterCoords.style.display = 'none';
});

function userCoords(string) {
  if(string !== '' && string.indexOf(',')!== -1)
  {
    //доработать логику проверки
    let latitude = string.slice(0, string.indexOf(',')).trim().replace(/\[|\]/g, '');
    let longitude = string.slice(string.indexOf(',')+1).trim().replace(/\[|\]/g, '');
    if(latitude.indexOf('.') !== -1 && longitude.indexOf('.') !== -1)
    {
      return {result: true, latitude: Number(latitude), longitude: Number(longitude) }
    }
  }
  throw new Error('Введен некорректный формат данных');
}

function coordsWidget(currentSource) {
  let string = inputCoords.value;
  try 
  {
    let obj = userCoords(string);
    if(obj.result)
    {
        if(currentSource === 'text')
        {
          addText(input.value, {latitude: obj.latitude, longitude: obj.longitude});
          enterCoords.style.display = 'none';
          inputCoords.value = '';
          input.removeAttribute("readonly", true);
        }
        else if (currentSource === 'audio') {
          addAudio(srcAudio, {latitude: obj.latitude, longitude: obj.longitude});
          enterCoords.style.display = 'none';
          inputCoords.value = '';
        }
    }
  }
  catch(e)
  {
    inputCoords.setCustomValidity(e);
    if(inputCoords.validity.customError)
    {
      alert(e);
    } 
  }
}

ok.addEventListener('click', () => {
  coordsWidget(currentSource);
})

input.addEventListener('keyup' , (evt) => {
  if(evt.keyCode === 13 && evt.target.value !== '') {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        let coordsRes = pos.coords;
        addText(evt.target.value, coordsRes);
      }, () => {
        currentSource = 'text';
        enterCoords.style.display = 'block';
        input.setAttribute("readonly", true);
      });
    }
  }
})



function addText(text,coordsRes) {
  let date = new Date().toLocaleString();
  let post = document.createElement('div');
  post.classList.add('post');
  posts.prepend(post);
  let dateEl = document.createElement('div');
  dateEl.classList.add('date');
  dateEl.textContent = date;
  post.appendChild(dateEl);
  let content = document.createElement('div');
  content.classList.add('content');
  content.textContent = text;
  post.appendChild(content);
  let coords = document.createElement('div');
  coords.classList.add('coords');
  coords.textContent = `[${coordsRes.latitude.toFixed(5)}, ${coordsRes.longitude.toFixed(5)}]`;
  post.appendChild(coords);
  let circle = document.createElement('div');
  circle.classList.add('circle');
  post.appendChild(circle);
  input.value = '';
}

function addAudio(src,coordsRes) { //
  let date = new Date().toLocaleString();
  let post = document.createElement('div');
  post.classList.add('post');
  posts.prepend(post);
  let dateEl = document.createElement('div');
  dateEl.classList.add('date');
  dateEl.textContent = date;
  post.appendChild(dateEl);
  let playBut = document.createElement('button');
  playBut.classList.add('audio-content');
  post.appendChild(playBut);
  let timeLine = document.createElement('div');
  timeLine.classList.add('time-line');
  post.appendChild(timeLine);
  let ball = document.createElement('div');
  ball.classList.add('ball');
  post.appendChild(ball);
  const {top,left} = timeLine.getBoundingClientRect();
  ball.style.top = `${top}px`;
  ball.style.left = `${left+5}px`;
  let audio = document.createElement('audio');
  audio.classList.add('audio');
  audio.src = src;
  post.appendChild(audio);
  let coords = document.createElement('div');
  coords.classList.add('coords');
  coords.textContent = `[${coordsRes.latitude.toFixed(5)}, ${coordsRes.longitude.toFixed(5)}]`;
  post.appendChild(coords);
  let circle = document.createElement('div');
  circle.classList.add('circle');
  post.appendChild(circle);
  playBut.addEventListener('click', () => {
    audio.play();
  });
  // const posMax = left + timeLine.offsetWidth;
  const iteration = timeLine.offsetWidth/audio.duration;
  function draw() {
    ball.style.left =  `${ball.style.left + iteration}px`;
  }
  audio.addEventListener('timeupdate', (evt) => {
    draw();
  })
}