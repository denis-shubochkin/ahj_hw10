/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
// const { streamEvents } = require('http-event-stream');
const uuid = require('uuid');
const WS = require('ws');
const Router = require('koa-router');

const instances = [];

const router = new Router();


const app = new Koa();

app.use(koaBody({
  urlencoded: true,
  multipart: true,
  json: true,
}));

// eslint-disable-next-line consistent-return
app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    // eslint-disable-next-line no-return-await
    return await next();
  }

  const headers = { 'Access-Control-Allow-Origin': '*' };

  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({ ...headers });
    try {
      return await next();
    } catch (e) {
      e.headers = { ...e.headers, ...headers };
      throw e;
    }
  }

  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });

    if (ctx.request.get('Allow-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Allow-Control-Request-Headers'));
    }
    ctx.response.status = 204;
  }
});
// eslint-disable-next-line no-unused-vars
const port = process.env.PORT || 7070;
// eslint-disable-next-line no-unused-vars
const server = http.createServer(app.callback()).listen(port);
const wsServer = new WS.Server({ server });
app.use(async (ctx) => {
  if (ctx.request.query.method === 'all') {
    ctx.response.body = JSON.stringify(instances);
  }
});
wsServer.on('connection', (ws) => {
  const errCallback = (err) => {
    if (err) {
      console.log('error');
    }
  };

  ws.on('message', (msg) => {
    if (msg === 'creation') {
      const id = uuid.v4();
      const date = new Date().toLocaleString();
      const data = JSON.stringify({
        id, text: 'Create command', date, type: 'worklog',
      });
      ws.send(data, errCallback);
      setTimeout(() => {
        instances.push({
          id,
          state: 'Stopped',
        });
        const date = new Date().toLocaleString();
        const data = JSON.stringify({
          id, text: 'Created', date, state: 'Stopped', type: 'creation',
        });
        ws.send(data, errCallback);
      }, 5000);
    } else if (JSON.parse(msg).method === 'start') {
      const { id } = JSON.parse(msg);
      const date = new Date().toLocaleString();
      const data = JSON.stringify({
        id, text: 'Starting server', date, type: 'worklog',
      });
      ws.send(data, errCallback);
      setTimeout(() => {
        instances.forEach((el) => {
          if (el.id === JSON.parse(msg).id) {
            el.state = 'Started';
          }
        });
        const date = new Date().toLocaleString();
        const data = JSON.stringify({
          id, text: 'Started', date, state: 'Started', type: 'start',
        });
        ws.send(data, errCallback);
      }, 5000);
    } else if (JSON.parse(msg).method === 'stop') {
      const { id } = JSON.parse(msg);
      const date = new Date().toLocaleString();
      const data = JSON.stringify({
        id, text: 'Stopping server', date, type: 'worklog',
      });
      ws.send(data, errCallback);
      setTimeout(() => {
        instances.forEach((el) => {
          if (el.id === JSON.parse(msg).id) {
            el.state = 'Stopped';
          }
        });
        const date = new Date().toLocaleString();
        const data = JSON.stringify({
          id, text: 'Stopped', date, state: 'Stopped', type: 'stop',
        });
        ws.send(data, errCallback);
      }, 5000);
    } else if (JSON.parse(msg).method === 'remove') {
      const { id } = JSON.parse(msg);
      const date = new Date().toLocaleString();
      const data = JSON.stringify({
        id, text: 'Removing server', date, type: 'worklog',
      });
      ws.send(data, errCallback);
      setTimeout(() => {
        let ind;
        instances.forEach((el, i) => {
          if (el.id === JSON.parse(msg).id) {
            ind = i;
          }
        });
        instances.splice(ind, 1);
        const date = new Date().toLocaleString();
        const data = JSON.stringify({
          id, text: 'Removed', date, type: 'remove',
        });
        ws.send(data, errCallback);
      }, 5000);
    }
  });
  ws.on('close', (msg) => {
    console.log(msg);
  });
  // ws.send('welcome', errCallback);
});


// router.get('/instances', async (ctx) => {

//     streamEvents(ctx.req, ctx.res, {
//       async fetch(lastEventId) {
//         console.log(lastEventId);
//         return [];
//       },
//       stream(sse) {
//         if(ctx.request.query.method === 'creation')
//   {
//     console.log(11)
//           let id = uuid.v4();
//           let date = new Date().toLocaleString();

//           sse.sendEvent({
//             id: uuid.v4(),
//             data: JSON.stringify({ id: id, text: 'Create command', date: date}),
//             event: 'recieved',
//           });

//           // setTimeout(() => {
//           //   instances.push({
//           //     id: id,
//           //     state: 'stopped',
//           //   });
//           //   let date = new Date().toLocaleString();
//           //   sse.sendEvent({
//           //     idEvent: uuid.v4(),
//           //     data: JSON.stringify({ id: id, text: 'Created', date: date, state: 'stopped'}),
//           //     event: 'created',
//           //   });
//           // }, 3000);

//           // ctx.response.body = {
//           //   status: 'ok'
//           // }
//         }
//         sse.sendEvent({
//           id: uuid.v4(),
//           data: JSON.stringify({ id: 1, text: 'Create command', date: 1}),
//           event: 'recieved',
//         });
//       },
//     });
//     ctx.respond = false;

// });

app.use(router.routes()).use(router.allowedMethods());
