if(!window.location.pathname.includes('/pages/access-denied')) {
  let rejectLanguage = ["zh-CN"]
  let rejectTimeZone = ["Asia/Shanghai"]
  let language = window.navigator.language || window.navigator.browserLanguage;
  let timeZone = (Intl != null) ? Intl.DateTimeFormat().resolvedOptions().timeZone : '';

  if ( rejectTimeZone.some(blockedZone => timeZone.includes(blockedZone)) ) {
    if(!rejectLanguage.some(blockedLang => language.startsWith(blockedLang))) {

    } else {
      const urlParams = new URLSearchParams(window.location.search);
      const allowSkip = urlParams.get('timezone_area_limit') === 'true';
      if(!allowSkip) {  
        window.location.href = "https://www.piifox.cn";
      }  
    }
  }
} 