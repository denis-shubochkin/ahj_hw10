const input = document.querySelector('.input');
const posts = document.querySelector('.posts');
const enterCoords = document.querySelector('.enter-coords');
const inputCoords =document.querySelector('.input-coords');
const cancel = document.querySelector('.cancel');
const ok = document.querySelector('.ok');
const label = document.querySelector('.label');
const audioBut = document.querySelector('.audio-button');
const videoBut = document.querySelector('.video-button');
const audio = document.querySelector('.audio');

function placeAudioVideo() {
  const {top, left} = input.getBoundingClientRect();
  audioBut.style.top = `${top - 5}px`;
  audioBut.style.left = `${left + input.offsetWidth - 100}px`;
  videoBut.style.top = `${top - 5}px`;
  videoBut.style.left = `${left + input.offsetWidth - 50}px`;
}

placeAudioVideo();

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
        const blob = new Blob(chunks);
        audio.src = URL.createObjectURL(blob);
      })
      recorder.start();
      setTimeout(()=> {
        recorder.stop();
        stream.getTracks().forEach(track => track.stop());
      },5000)
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

ok.addEventListener('click', () => {
  let string = inputCoords.value;
  try 
  {
    let obj = userCoords(string);
    if(obj.result)
    {
        addText(input.value, {latitude: obj.latitude, longitude: obj.longitude});
        enterCoords.style.display = 'none';
        inputCoords.value = '';
        input.removeAttribute("readonly", true);
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
})

input.addEventListener('keyup' , (evt) => {
  if(evt.keyCode === 13 && evt.target.value !== '') {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        let coordsRes = pos.coords;
        addText(evt.target.value, coordsRes);
      }, () => {
        enterCoords.style.display = 'block';
        input.setAttribute("readonly", true);
      })
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