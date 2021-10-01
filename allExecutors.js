//Note that iterations aren't fairly distributed with this executor, 
//and a VU that executes faster will complete more iterations than others. If you want guarantees that every VU will complete a specific, fixed number of iterations, use the per-VU iterations executor.
import { check, group } from 'k6';
import http from 'k6/http';

export let options = {
  discardResponseBodies: true,
  scenarios: {
    // shared: {
      // // A fixed amount of iterations are
      // // "shared" between a number of VUs.
    //   executor: 'shared-iterations',
    //   vus: 10,
    //   iterations: 200,
    //   maxDuration: '10s',
    // },
    perVU:{
    //	Each VU executes an exact number of iterations.
      executor:'per-vu-iterations',
      vus: 1000,
      iterations: 1,
      maxDuration:'1h30m',
    }
    // constantVUs:{ 
    //   //A fixed number of VUs execute as many
    //   //iterations as possible for a specified amount of time.
    //   executor: 'constant-vus',
    //   vus: 10,
    //   duration: '45m',
    // }
//     RampingVus:{
// //       A variable number of VUs execute as many
// // iterations as possible for a specified amount of time.
//       executor: 'ramping-vus',
//       startVUs: 0,
//       stages: [
//         { duration: '5s', target: 100 },
//         { duration: '5s', target: 0 },
//       ],
//       gracefulRampDown: '0s',
//     }
// ConstantArrivalRate: {
// //   A fixed number of iterations are executed
// // in a specified period of time.
//   executor: 'constant-arrival-rate',
//   rate: 200, // 200 RPS, since timeUnit is the default 1s
//   duration: '1m',
//   preAllocatedVUs: 50,
//   maxVUs: 100,
// },
// rampingArrivalRate: {
// //  A variable number of iterations are
// // executed in a specified period of time.
//   executor: 'ramping-arrival-rate',
//   startRate: 50,
//   timeUnit: '1s',
//   preAllocatedVUs: 50,
//   maxVUs: 100,
//   stages: [
//     { target: 200, duration: '30s' },
//     { target: 0, duration: '30s' },
//   ],
// },
  },

}

export default function () {

  group('visiting test webapp', function () {
    let url = `http://test.k6.io/`; //$ k6 run -e URL=test.k6.io allExecutors.js
    // you will need to prefix K6_ in the environment variable name in order for k6 to evaluate it as an option parameter.
    let res = http.get(url, {
      tags: { name:'01_home'}
    });
    check(res, {
      'is status 200': (r) => r.status === 200,
      // 'text verificSation' : (r) => r.body.includes("Collection of simple web-pages suitable for load testing"), 
    }, { name:'01_check'});
   
  });
}