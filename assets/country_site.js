
    //获取外网ip方式1：搜狐
    function getIpBysouhu(){
        console.log("---cip---"+returnCitySN["cip"]);
        console.log("---cid---"+returnCitySN["cid"]);
        console.log("---cname---"+returnCitySN["cname"]);
    }
    //获取外网ip方式2：ipify
    function getIpByIpify(callback){
      const host = window.location.hostname;
      if (host !== 'www.piifox.com' && host !== 'piifox.com') {
          return;
      }
        $.ajax({
            url : "https://api.ipify.org/?format=json&time="+(+new Date()),
            type : "GET",
            data : {},
            dataType : "json",
            success : function(result) {
              console.log("---ip---"+result.ip, result, window);
              let storeName = 'Global Store', replace_address = 'https://www.piifox.com';
              let cache_ip = window.localStorage.getItem('Cache-SwitchSite-Ip');
              let cache_country = window.localStorage.getItem('Cache-SwitchSite-Country');
              let cache_countryCode = window.localStorage.getItem('Cache-SwitchSite-Country-Code');
              let cache_countryImg = window.localStorage.getItem('Cache-SwitchSite-Country-Img');
              console.log(cache_ip, cache_country, cache_countryCode, cache_countryImg)
              if(cache_ip && cache_country && cache_ip === result.ip) {
                if(cache_countryCode === 'CN') {
                  window.location = 'https://www.piifox.cn/'
                }
                initStore_name_address(cache_countryCode, storeName, replace_address, (storeName, replace_address) => {
                  console.log(storeName, replace_address)
                  if(window.location.origin != replace_address) {
                    console.log('redirect===>', storeName)
                    callback(cache_country, cache_countryCode, cache_countryImg, replace_address, storeName)
                  }
                })
                
              } else {
                if(result.ip) {
                  window.localStorage.setItem('Cache-SwitchSite-Ip', result.ip);
                  $.ajax({
                    url : "https://serverless.piifox.com/ipwho_func",
                    type : "POST",
                    headers: {
                        "appKey": "piifox_2025"
                    },
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({ ip: result.ip }),
                    dataType: "json",
                    success : function(result1) {
                      let res1 = typeof result1 === 'string' ? JSON.parse(result1) : result1;
                      let res = res1.data;
                      console.log("---ipwho_func res---", res)
                      const country=res.country,
                            country_code=res.country_code, // 强制转小写
                            country_img=`https://flagcdn.com/w40/${country_code.toLowerCase()}.png`;
                      // 存本地记录, 方便重复访问时直接读取本地缓存         
                      window.localStorage.setItem('Cache-SwitchSite-Country', country);
                      window.localStorage.setItem('Cache-SwitchSite-Country-Code', country_code);
                      window.localStorage.setItem('Cache-SwitchSite-Country-Img', country_img);
                      window.localStorage.setItem('Cache-Shop-Country-Code', country_code);
                      if(res.country_code === 'CN') {
                        window.location = 'https://www.piifox.cn/'
                      }
                      console.log("---res---"+ country_code);
                      initStore_name_address(country_code, storeName, replace_address, (storeName, replace_address) => {
                        console.log(storeName, replace_address)
                        if(window.location.origin != replace_address) {
                          console.log('redirect===>', storeName)
                          callback(cache_country, cache_countryCode, cache_countryImg, replace_address, storeName)
                        }
                      })
                    },
                    error : function(){}
                  });
                }
              }
              
            },
            error : function(){}
        });
    }
    function initStore_name_address(country_code, storeName, replace_address, callback) {
      let eu_ips = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'SE'];
      switch(country_code) {
          case 'CN': 
              storeName = 'CN Store'
              replace_address = 'https://www.piifox.cn'
              break;
          default:
              storeName = 'Global Store'
              window.localStorage.setItem('Cache-Shop-Country-Code', country_code);
              console.log("GLB");
              break;
      }
      callback(storeName, replace_address)
    }
    //获取内网ip方式1：
    function getIP() {
        let recode = {};
        let RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
        // 如果不存在则使用一个iframe绕过
        if (!RTCPeerConnection) {
            // 因为这里用到了iframe，所以在调用这个方法的script上必须有一个iframe标签
            // <iframe id="iframe" sandbox="allow-same-origin" style="display:none;"></iframe>
            let win = iframe.contentWindow;
            RTCPeerConnection = win.RTCPeerConnection || win.mozRTCPeerConnection || win.webkitRTCPeerConnection;
        }
 
        //创建实例，生成连接
        let pc = new RTCPeerConnection();
 
        // 匹配字符串中符合ip地址的字段
        function handleCandidate(candidate) {
            let ip_regexp = /([0-9]{1,3}(\.[0-9]{1,3}){3}|([a-f0-9]{1,4}((:[a-f0-9]{1,4}){7}|:+[a-f0-9]{1,4}){6}))/;
            let ip_isMatch = candidate.match(ip_regexp)[1];
            console.log("---ip(内)---"+ip_isMatch);
            if (!recode[ip_isMatch]) {
                recode[ip_isMatch] = true;
            }
        }
 
        //监听icecandidate事件
        pc.onicecandidate = (ice) => {
            if (ice.candidate) {
                handleCandidate(ice.candidate.candidate);
            }
        };
        //建立一个伪数据的通道
        pc.createDataChannel('');
        pc.createOffer((res) => {
            pc.setLocalDescription(res);
        }, () => {});
 
        //延迟，让一切都能完成
        setTimeout(() => {
            let lines = pc.localDescription.sdp.split('\n');
            lines.forEach(item => {
                if (item.indexOf('a=candidate:') === 0) {
                    handleCandidate(item);
                }
            })
        }, 1000);
    }