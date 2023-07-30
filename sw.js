const CACHE_NAME = 'TGNAVCache';

let cachelist = [];

const cachetime = 12*60*60*1000;

self.CACHE_NAME = 'SWHelperCache';
self.db = {
    read: (key, config) => {
        if (!config) { config = { type: "text" } }
        return new Promise((resolve, reject) => {
            caches.open(CACHE_NAME).then(cache => {
                cache.match(new Request(`https://LOCALCACHE/${encodeURIComponent(key)}`)).then(function (res) {
                    if (!res) resolve(null)
                    res.text().then(text => resolve(text))
                }).catch(() => {
                    resolve(null)
                })
            })
        })
    },
    write: (key, value) => {
        return new Promise((resolve, reject) => {
            caches.open(CACHE_NAME).then(function (cache) {
                cache.put(new Request(`https://LOCALCACHE/${encodeURIComponent(key)}`), new Response(value));
                resolve()
            }).catch(() => {
                reject()
            })
        })
    }
}

self.addEventListener('install', async function (installEvent) {
    self.skipWaiting();
    installEvent.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(cachelist);
            })
    );
});

self.addEventListener('fetch', async event => {
    try {
        event.respondWith(handle(event.request))
    } catch (msg) {
        event.respondWith(handleerr(event.request, msg))
    }
});
const handleerr = async (req, msg) => {
    return new Response(`<h1>Service Worker 遇到致命错误</h1>
    <b>${msg}</b>`, { headers: { "content-type": "text/html; charset=utf-8" } })
}
const lfetch = async (urls, url, init) => {
    let controller = new AbortController();
    const PauseProgress = async (res) => {
        return new Response(await (res).arrayBuffer(), { status: res.status, headers: res.headers });
    };
    if (!Promise.any) {
        Promise.any = function (promises) {
            return new Promise((resolve, reject) => {
                promises = Array.isArray(promises) ? promises : []
                let len = promises.length
                let errs = []
                if (len === 0) return reject(new AggregateError('All promises were rejected'))
                promises.forEach((promise) => {
                    promise.then(value => {
                        resolve(value)
                    }, err => {
                        len--
                        errs.push(err)
                        if (len === 0) {
                            reject(new AggregateError(errs))
                        }
                    })
                })
            })
        }
    }
    return Promise.any(urls.map(urls => {
        init = init || {}
        init.signal = controller.signal
        return new Promise((resolve, reject) => {
            fetch(urls, init)
                .then(PauseProgress)
                .then(res => {
                    if (res.status == 200) {
                        controller.abort();
                        resolve(res)
                    } else {
                        reject(null)
                    }
                })
        })
    }))
}

let gdt = {

}
const broadcast = (channel, data) => {
    let broadcast = new BroadcastChannel(channel);
    return broadcast.postMessage({ type: data })
}
const set_newest_version = async (mirror) => { 
    // 改为最新版本写入数据库
    console.log("[LOG] 开始检查更新.");
    return lfetch(mirror, mirror[0])
        .then(res => res.json())
        .then(async res => {
            let thisVersion = await db.read("blog_version");
            console.info("[INFO] 当前版本: "+ thisVersion);
            console.info("[INFO] 最新版本: "+res.version);
            if (thisVersion != res.version) {
                // 版本有更新 向页面展示
                broadcast("Blog Update", "REFRESH");
            }
            await db.write('blog_version', res.version);
            return;
        });
}

const handle = async function (req) {
    const urlStr = req.url
    const urlObj = new URL(urlStr)
    const port = urlObj.port
    const domain = urlObj.hostname;
    const urlPath = urlObj.pathname;
    let urls = []

    if (req.method == "GET" && (domain == "tgnav.github.io" || domain == "localhost")) {
        /* 是 Blog & 且资源为 Get */
        /* 根据 Blog 的路径情况修改了下 fullpath 函数 */
        const fullpath = (path) => {
            path = path.split('?')[0].split('#')[0]
            if (path.match(/\/$/)) {
                path += 'index.html'
            }
            if (!path.match(/\.[a-zA-Z]+$/)) {
                path += '/index.html'
            }
            return path
        }
    }

    return fetch(req).then(function (res) {
        if (!res) { throw 'error' } //1
        return caches.open(CACHE_NAME).then(function (cache) {
            cache.delete(req);
            cache.put(req, res.clone());
            return res;
        });
    }).catch(function (err) {
        return caches.match(req).then(function (resp) {
            return resp || caches.match(new Request('/offline/')) //2
        })
    })
}

self.addEventListener('activate', function(event) {
  var cacheWhitelist = ['v2'];

  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});