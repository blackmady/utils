interface Store{
  expire?:number // 过期时间
  data:any // 数据
}
export default {
  getItem (key:string, store:Storage = localStorage) {
    const item = store.getItem(key)
    if (item === null) return null
    let json:any
    try {
      json = JSON.parse(item)
    } catch (e) {}
    return typeof json === 'undefined' ? item : json
  },
  // time:表示缓存时间，单位为毫秒，默认为永不过期
  store (key:string, value:any, time:number = 1e14, store:Storage = localStorage) {
    const now = Date.now()
    if (typeof value === 'undefined') {
      const obj = this.getItem(key)
      if (!obj) return null
      if (obj.expire <= now) {
        // 清理当前数据
        store.removeItem(key)
        // 清除所有过期数据
        // this.clear(store)
        return null
      }
      return typeof obj.data === 'undefined' ? obj : obj.data
    } else if (value === null) {
      store.removeItem(key)
    } else {
      const nv:Store = { expire: now + time, data: value }
      store.setItem(key, JSON.stringify(nv))
    }
  },
  // localStorage
  local (key:string, value:any, time:number) {
    return this.store(key, value, time, localStorage)
  },
  // sessionStorage
  session (key:string, value:any, time:number) {
    return this.store(key, value, time, sessionStorage)
  },
  // 清理过期的storage，清理全部请直接调用localStorage.clear()或sessionStorage.clear()
  clear (store:Storage) {
    const now = Date.now()
    for (let i = 0; i < store.length; i++) {
      let key = store.key(i) as string
      let obj = this.getItem(key, store)
      if (obj && obj.expire <= now) {
        store.removeItem(key)
      }
    }
  },
  // cookie操作
  cookie(name:string, value?:string, hours?:number, path?:string, domain?:string, secure?:string) {
    if(value===null){
      hours=-1
    }else	if (typeof value==='undefined') {
			const reg=new RegExp(`(?:^|;\\s*)${name}=([^=]+)(?:;|$)`)
			return reg.test(document.cookie) ? RegExp.$1 : "";
		}
		let cdata = name + "=" + value;
		if (hours) {
			const d = new Date();
			d.setHours(d.getHours() + hours);
			cdata += "; expires=" + d.toUTCString();
		}
		cdata += path ? ("; path=" + path) : "";
		cdata += domain ? ("; domain=" + domain) : "";
		cdata += secure ? ("; secure=" + secure) : "";
		document.cookie = cdata;
	},
}
