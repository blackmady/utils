```javascript
const [SECOND, MINUTE, HOURS] = [1000, 60000, 360000];
useData("user/info", data, config);
// 持久化接口兼容vuex
useData.create({
  // 设置自动持久化到 sessionStorage,可单独配置
  persist: { store: sessionStorage, cache: 6 * HOURS },
});
// 拦截,默认拦截器接入可配置的showLoading，默认展示。跳转时以先进页面再加载为主。
useData.request.use();
useData.response.use();
useData(name, data, config);
useData("user/info", { id: 0 }, { headers: { xxx: 44 }, cache: 22, meta: {} });
```

<!-- 精准计时 -->
