(function(zonefile) { 
var rnd = Math.round(Math.random()*999999);
var s = document.createElement('script'); s.type = 'text/javascript'; s.async = true;
var host = "play.turbommo.com";
if(window.location.hash=="#urlzing") { host = "//staging.urlzing.com"; }
s.src = "//" + host + "/" + zonefile + "?rnd="+rnd;
var s2=document.getElementsByTagName('script')[0];
s2.parentNode.insertBefore(s, s2);
var y="cpmstarx";
var drutObj = window[y] = window[y] || {};
window.cpmstarAPI = window["_"+zonefile] = function(o) { (drutObj.cmd = drutObj.cmd || []).push(o); }
}('bwbmf6wu6svrrcep9p0W/D/8mblvrdUe71qcjx6/on.js')); 


// (function (zonefile) {
//   var rnd = Math.round(Math.random() * 999999);
//   var s = document.createElement("script");
//   s.type = "text/javascript";
//   s.async = true;
//   var proto = document.location.protocol;
//   var host = proto == "https:" || proto == "file:" ? "https://server" : "//cdn";
//   if (window.location.hash == "#cpmstarDev") host = "//dev.server";
//   if (window.location.hash == "#cpmstarStaging") host = "//staging.server";
//   s.src = host + ".cpmstar.com/cached/zonefiles/" + zonefile + ".js?rnd=" + rnd;
//   var s2 = document.getElementsByTagName("script")[0];
//   s2.parentNode.insertBefore(s, s2);
//   var y = "cpmstarx";
//   var drutObj = (window[y] = window[y] || {});
//   window.cpmstarAPI = function (o) {
//     (drutObj.cmd = drutObj.cmd || []).push(o);
//   };
// })("198_41_gameapi");
  