// ==UserScript==
// @name            ImPoeTrade
// @namespace       https://github.com/Sefriol/ImpPoETrade/wiki/Improved-PoE-Trade
// @version         0.6
// @description     Script provides small improvements to poe.trade community website
// @author          Sefriol
// @match           http://tampermonkey.net/index.php?ext=dhdg
// @match           http://poe.trade/*
// @grant           none
// @updateURL       https://github.com/Sefriol/ImpPoETrade/raw/master/ImPoeTrade.user.js
// @downloadURL     https://github.com/Sefriol/ImpPoETrade/raw/master/ImPoeTrade.user.js
// @homepageURL     https://github.com/Sefriol/ImpPoETrade/wiki/Improved-PoE-Trade
// ==/UserScript==
/* jshint -W097 */
'use strict';

function itemHider(item) {
  $(item).parentsUntil($("[id^=search-results]"), ".item").hide();
}
function showItems() {
  $("[id^=item-container]").show();
}
function exportItems() {
  var messages = [];
  var list = $("[id^=item-container]").filter(function() {
    return $(this).css('display') !== "none";
  });
  $.each(list, function(o) {
    var item = $(list[o]);
    var bo = item.data("buyout") ? " listed for " + item.data("buyout") : "";
    var message="@"+item.data("ign")+" Wtb "+item.data("name")+bo+" in "+item.data("league");
    messages.push(message);
  })
  window.prompt("Copy message to clipboard by pressing Ctrl+C. Note: window.prompt limits messages to 2000 characters",messages)
}

var script = document.createElement('script');
script.appendChild(document.createTextNode(itemHider));
script.appendChild(document.createTextNode(showItems));
script.appendChild(document.createTextNode(exportItems));
(document.body || document.head || document.documentElement).appendChild(script);

$("[id^=item-container]").find('[class^=first-cell]').append("<a class='button secondary expand' onclick='itemHider(this);' style='margin:0;'>Remove</a>");
$("[class^=search-results-block]").prepend("<a class='button secondary expand' onclick='showItems()' style='width:50%'>Show all hidden items</a>")
$("[class^=search-results-block]").prepend("<a class='button secondary expand' onclick='exportItems()' style='width:50%'>Export shown items</a>")
$("[id^=mid-table").hide();
