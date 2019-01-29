import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import 'hammerjs';

if (environment.staging) {
  enableProdMode();
}

const currentURI = window.location.href;

if (environment.production && !currentURI.includes('user-review')) {
  // Enable Facebook Messenger Widget for Support Chatbot.
  const script = document.createElement('script');
  script.innerHTML = `
      window.fbMessengerPlugins = window.fbMessengerPlugins || {
      init: function () {
        FB.init({
          appId            : '1678638095724206',
          autoLogAppEvents : true,
          xfbml            : true,
          version          : 'v3.0'
        });
      }, callable: []
    };
    window.fbAsyncInit = window.fbAsyncInit || function () {
      window.fbMessengerPlugins.callable.forEach(function (item) { item(); });
      window.fbMessengerPlugins.init();
    };
    setTimeout(function () {
      (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) { return; }
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk/xfbml.customerchat.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    }, 0);
    `;
    document.head.appendChild(script);

    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
