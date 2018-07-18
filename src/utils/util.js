/*
* @Author: William Chan
* @Date:   2017-05-03 15:08:07
* @Last Modified by:   Administrator
* @Last Modified time: 2017-05-29 03:40:28
*/

// import moment from 'moment';

// export const isDevelop = () => process.env.NODE_ENV !== 'production';
export const isDevelop = () => true;

export const setWechatTitle = (title) => {
  document.title = title;
  const mobile = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(mobile)) {
    const iframe = document.createElement('iframe');
    iframe.style.visibility = 'hidden';
    iframe.setAttribute('src', '/favicon.ico');
    const iframeCallback = () => {
      setTimeout(() => {
        iframe.removeEventListener('load', iframeCallback);
        document.body.removeChild(iframe);
      }, 0);
    };
    iframe.addEventListener('load', iframeCallback);
    document.body.appendChild(iframe);
  }
};

export const isInWechat = () => {
  const ua = navigator.userAgent.toLowerCase();
  return (/micromessenger/.test(ua));
};

export const popupWindow = (url, plugin) => {
  window.chrome.tabs.create({
    url: plugin ? window.chrome.extension.getURL(url) : url,
    selected: true,
  });
};

export const decodeTable = (html) => {
  const tables = [];
  const reTable = /<table[^]*?<\/table>/gi;
  let rTable = reTable.exec(html);
  while (rTable) {
    let maxColumn = 0;
    const tableHTML = rTable[0];
    const rows = [];
    const reTr = /<tr[^]*?<\/tr>/gi;
    let rTr = reTr.exec(tableHTML);
    while (rTr) {
      const trHTML = rTr[0];
      const columns = [];
      const reTd = /<td[^]*?<\/td>/gi;
      let rTd = reTd.exec(trHTML);
      while (rTd) {
        columns.push(rTd[0]);
        rTd = reTd.exec(trHTML);
      }
      if (columns.length > 1) {
        rows.push({ html: trHTML, columns });
        maxColumn = Math.max(columns.length, maxColumn);
      }
      rTr = reTr.exec(tableHTML);
    }
    if (rows.length > 0) {
      tables.push({ html: tableHTML, maxColumn, rows });
    }
    rTable = reTable.exec(html);
  }
  return tables;
};

export const regexGet = (s, re, i = 1) => {
  const r = s.match(re);
  return r ? r[i] : null;
};

export const getPureText = html => html.replace(/<[^<>]+>/ig, '');
