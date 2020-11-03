import black from '../pic/black.png';
import green from '../pic/green.png';
// import start from '../pic/start.png';
// import pause from '../pic/pause.png';
// import stop from '../pic/stop.png';

export default class Instances {
  constructor(url) {
    this.url = url;
    this.contentTypeHeader = { 'Content-Type': 'application/json' };
    this.list = document.querySelector('.instances-list');
    this.worklog = document.querySelector('.worklog');
  }

  showInst(o) {
    const inst = document.createElement('div');
    inst.classList.add('instance');
    inst.id = o.id;
    this.list.appendChild(inst);
    const idEl = document.createElement('div');
    idEl.classList.add('id');
    idEl.textContent = o.id;
    inst.appendChild(idEl);
    const statBlock = document.createElement('div');
    statBlock.classList.add('status-block');
    inst.appendChild(statBlock);
    const statLab = document.createElement('span');
    statLab.classList.add('status-label');
    statLab.textContent = 'Status: ';
    statBlock.appendChild(statLab);
    const statImg = document.createElement('img');
    statImg.classList.add('status-circle');
    statBlock.appendChild(statImg);
    const statName = document.createElement('span');
    statName.classList.add('status-name');
    statName.textContent = o.state;
    statBlock.appendChild(statName);
    const actionBlock = document.createElement('div');
    actionBlock.classList.add('actions-block');
    inst.appendChild(actionBlock);
    const actionsLab = document.createElement('span');
    actionsLab.classList.add('actions-label');
    actionsLab.textContent = 'Actions: ';
    actionBlock.appendChild(actionsLab);
    const pauseBut = document.createElement('button');
    pauseBut.classList.add('pause-but');
    actionBlock.appendChild(pauseBut);
    const startBut = document.createElement('button');
    startBut.classList.add('start-but');
    actionBlock.appendChild(startBut);
    const delBut = document.createElement('button');
    delBut.classList.add('delete-but');
    actionBlock.appendChild(delBut);
    if (o.state === 'Started') {
      statImg.src = green;
      pauseBut.style.display = 'block';
      startBut.style.display = 'none';
    } else {
      statImg.src = black;
      pauseBut.style.display = 'none';
      startBut.style.display = 'block';
    }
  }

  createInst(id) {
    const inst = document.createElement('div');
    inst.classList.add('instance');
    inst.id = id;
    this.list.appendChild(inst);
    const idEl = document.createElement('div');
    idEl.classList.add('id');
    idEl.textContent = id;
    inst.appendChild(idEl);
    const statBlock = document.createElement('div');
    statBlock.classList.add('status-block');
    inst.appendChild(statBlock);
    const statLab = document.createElement('span');
    statLab.classList.add('status-label');
    statLab.textContent = 'Status: ';
    statBlock.appendChild(statLab);
    const statImg = document.createElement('img');
    statImg.classList.add('status-circle');
    statImg.src = black;
    statBlock.appendChild(statImg);
    const statName = document.createElement('span');
    statName.classList.add('status-name');
    statName.textContent = 'Stopped';
    statBlock.appendChild(statName);
    const actionBlock = document.createElement('div');
    actionBlock.classList.add('actions-block');
    inst.appendChild(actionBlock);
    const actionsLab = document.createElement('span');
    actionsLab.classList.add('actions-label');
    actionsLab.textContent = 'Actions: ';
    actionBlock.appendChild(actionsLab);
    const pauseBut = document.createElement('button');
    pauseBut.classList.add('pause-but');
    actionBlock.appendChild(pauseBut);
    const startBut = document.createElement('button');
    startBut.classList.add('start-but');
    actionBlock.appendChild(startBut);
    const delBut = document.createElement('button');
    delBut.classList.add('delete-but');
    actionBlock.appendChild(delBut);
  }

  startInst(id) {
    const elem = document.getElementById(id);
    elem.querySelector('.status-circle').src = green;
    elem.querySelector('.status-name').textContent = 'Started';
    elem.querySelector('.pause-but').style.display = 'block';
    elem.querySelector('.start-but').style.display = 'none';
  }

  stopInst(id) {
    const elem = document.getElementById(id);
    elem.querySelector('.status-circle').src = black;
    elem.querySelector('.status-name').textContent = 'Stopped';
    elem.querySelector('.pause-but').style.display = 'none';
    elem.querySelector('.start-but').style.display = 'block';
  }

  removeInst(id) {
    const elem = document.getElementById(id);
    elem.remove();
  }

  addLog(obj) {
    //   <div class="log-element">
    //   <span class="date">12.01.2020 15:30</span>
    //   <div class="log-server-block">
    //     <span class="server-label">Server: </span>
    //     <span class="server-id">231321321-fsdfsdf-dsdfsdf-2323-fd</span>
    //   </div>
    //   <div class="log-info-block">
    //     <span class="info-label">INFO: </span>
    //     <span class="info-value">Created</span>
    //   </div>
    // </div>
    const logEl = document.createElement('div');
    logEl.classList.add('log-element');
    this.worklog.appendChild(logEl);
    const date = document.createElement('span');
    date.classList.add('date');
    date.textContent = obj.date;
    logEl.appendChild(date);
    const servBlock = document.createElement('div');
    servBlock.classList.add('log-server-block');
    logEl.appendChild(servBlock);
    const servLab = document.createElement('span');
    servLab.classList.add('server-label');
    servLab.textContent = 'Server: ';
    servBlock.appendChild(servLab);
    const servId = document.createElement('span');
    servId.classList.add('server-id');
    servId.textContent = obj.id;
    servBlock.appendChild(servId);
    const infoBlock = document.createElement('div');
    infoBlock.classList.add('log-info-block');
    logEl.appendChild(infoBlock);
    const infoLab = document.createElement('span');
    infoLab.classList.add('info-label');
    infoLab.textContent = 'INFO: ';
    infoBlock.appendChild(infoLab);
    const infoVal = document.createElement('span');
    infoVal.classList.add('info-value');
    infoVal.textContent = obj.text;
    infoBlock.appendChild(infoVal);
  }
}
