/**
 * 拦截微信网络请求，控制并发数不大于10
 * @param ifdebug 日志打印开关，默认关闭
 * ex:
 * var hackWxRequest = require("hackWxRequest.js") 
 * hackWxRequest(true);
 */

const MAX_THREAD = 10;
const orgWxRequest = wx.request;
const requestQueue = [];
let requesting = 0;
let IF_DEBUG = false;

function HackWxRequest(ifdebug = false) {
  IF_DEBUG = ifdebug;
  Object.defineProperty(wx, 'request', {
    configurable: true,
    enumerable: true,
    writable: true,
    value: function (res) {
      const orgComplete = res.complete;
      res.complete = function () {
        requesting--;
        debug(`${res.url}请求完成，当前请求数${requesting}`);
        let task = requestQueue.shift();
        if (task) {
          requesting++;
          orgWxRequest.call(wx, task);
          debug(`${task.url}从请求队列内请求，当前请求数${requesting}`);
        }
        typeof orgComplete == 'function' && orgComplete.call(this);
      }

      if (requesting < MAX_THREAD) {
        requesting++;
        orgWxRequest.call(wx, res);
        debug(`当前请求${res.url}， 当前请求数${requesting}`);
      } else {
        requestQueue.push(res);
        debug(`${res.url}push请求队列, 当前请求数${requesting}`);
      }
    }
  })
}


function debug(msg) {
  IF_DEBUG && console.log(`[request hack]: ${msg}`);
}

module.exports = HackWxRequest;
