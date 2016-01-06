// ==UserScript==
// @name            ImPoeTrade
// @namespace       https://github.com/Sefriol/ImpPoETrade/wiki/Improved-PoE-Trade
// @version         0.7
// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
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
var showOffline = true;
var offline = [];
function itemHider(item) {
  $(item).parentsUntil($("[id^=search-results]"), ".item").hide();
}
function showItems() {
  var showOffline = true;
  var offline = [];
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
  });
  window.prompt("Copy message to clipboard by pressing Ctrl+C. Note: window.prompt limits messages to 2000 characters",messages);
}

function toggleOffline(){
  if (showOffline) {
    showOffline = false;
    offline = $("[id^=item-container]").filter(function() {
      if ($(this).css('display') !== "none" && $(this).find('span.success.label').length < 1) {
        return $(this);
      } else if ($(this).css('display') !== "none" && $(this).find('span.success.label').length == 1 && $(this).find('span.success.label').text() == "corrupted") {
        return $(this);
      } else {
        return $(this).css('display') !== "none" && $(this).find('span.success.label').text() !== "online";
      }
    });
    $.each(offline, function(o) {
      $(offline[o]).hide();
    });
  } else {
    showOffline = true;
    $.each(offline, function(o) {
      $(offline[o]).show();
    });
  }
}

$( document ).ajaxComplete(function() {
  $("[id^=item-container]").find('[class^=first-cell]').append("<a class='button secondary expand' onclick='itemHider(this);' style='margin:0;'>Remove</a>");
});

var script = document.createElement('script');
script.appendChild(document.createTextNode('var showOffline='+showOffline+';'));
script.appendChild(document.createTextNode('var offline='+JSON.stringify(offline)+';'));
script.appendChild(document.createTextNode(showItems));
script.appendChild(document.createTextNode(itemHider));
script.appendChild(document.createTextNode(showItems));
script.appendChild(document.createTextNode(exportItems));
script.appendChild(document.createTextNode(toggleOffline));
(document.body || document.head || document.documentElement).appendChild(script);

$("[id^=item-container]").find('[class^=first-cell]').append("<a class='button secondary expand' onclick='itemHider(this);' style='margin:0;'>Remove</a>");
$("[class^=search-results-block]").prepend("<a class='button secondary expand' onclick='showItems()' style='width:33%'>Show all hidden items</a>");
$("[class^=search-results-block]").prepend("<a class='button secondary expand' onclick='exportItems()' style='width:33%'>Export shown items</a>");
$("[class^=search-results-block]").prepend("<a class='button secondary expand' onclick='toggleOffline()' style='width:33%'>Show / hide Offline</a>");
$("[id^=mid-table").hide();
