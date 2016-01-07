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
var storedItems;
var showStored = false;
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

function toggleStored() {
  if (!showStored) {
    $("[id=search-results-stored]").show();
    showStored = true;
    $("[id=search-results-stored-items]").empty();
    if(typeof(Storage) !== "undefined") {
      storedItems = localStorage.getItem("storedTradeItems");
      if(storedItems !== null) {
        storedItems = JSON.parse(storedItems);
        $.each(storedItems, function(o) {
          $("[id=search-results-stored-items]").append(unescape(storedItems[o]))
          $("[id=search-results-stored-items]").find('[id=button-remove]').remove()
          $("[id=search-results-stored-items]").find('[id=button-add-storage]').remove()
        });
        $("[id=search-results-stored-items]").find('[class^=table-stats]').append("<a id='button-remove-storage'class='button secondary expand' onclick='removeItem(this);' style='margin:0; width:50%'>Remove from Storage</a>");
      } else {
        $("[id=search-results-stored-items]").prepend("<h2><a>You have nothing stored</a></h2>");
      }
    } else {
      console.log('No support for storage');
    }
  } else {
    $("[id=search-results-stored]").hide();
    showStored = false;
  }
}

function addItem(item) {
  if(typeof(Storage) !== "undefined") {
    if (typeof(storedItems)=='undefined' || storedItems==null) {
      storedItems = [];
    }
    storedItems.push(escape($(item).parentsUntil($("[id^=search-results]"), ".item").clone().html()));
    localStorage.setItem("storedTradeItems", JSON.stringify(storedItems));
    if (showStored) {
      toggleStored();
    }
  } else {
    $("[id=search-results-stored-items]").empty()
    $("[id=search-results-stored]").show()
    showStored = true;
    $("[id=search-results-stored-items]").prepend("<h2><a>Your Browser doesn't support storage</a></h2>");
  }
}

function removeItem(item) {
  if(typeof(Storage) !== "undefined") {
    if (typeof(storedItems)=='undefined' || storedItems==null) {
      storedItems = [];
      return;
    }
    console.log($(item).index(), $(item).parentsUntil($("[id^=search-results]"), ".item").index())
    storedItems.splice($(item).parentsUntil($("[id^=search-results]"), ".item").index())
    localStorage.setItem("storedTradeItems", JSON.stringify(storedItems));
    if (showStored) {
      showStored = false;
      toggleStored();
    }
  } else {
    $("[id=search-results-stored-items]").empty()
    $("[id=search-results-stored]").show()
    showStored = true;
    $("[id=search-results-stored-items]").prepend("<h2><a>Your Browser doesn't support storage</a></h2>");
  }
}

$( document ).ajaxComplete(function() {
  $("[id^=item-container]").find('[class^=first-cell]').append("<a id='button-remove' class='button secondary expand' onclick='itemHider(this);' style='margin:0;'>Remove</a>");
  $("[id^=item-container]").find('[class^=table-stats]').append("<a id='button-add-storage'class='button secondary expand' onclick='addItem(this);' style='margin:0; width:50%'>Add to Storage</a>");
});

var script = document.createElement('script');
script.appendChild(document.createTextNode('var showOffline='+showOffline+';'));
script.appendChild(document.createTextNode('var offline='+JSON.stringify(offline)+';'));
script.appendChild(document.createTextNode('var showStored='+showStored+';'));
script.appendChild(document.createTextNode('var storedItems;'));
script.appendChild(document.createTextNode(showItems));
script.appendChild(document.createTextNode(itemHider));
script.appendChild(document.createTextNode(showItems));
script.appendChild(document.createTextNode(exportItems));
script.appendChild(document.createTextNode(toggleOffline));
script.appendChild(document.createTextNode(toggleStored));
script.appendChild(document.createTextNode(addItem));
script.appendChild(document.createTextNode(removeItem));
(document.body || document.head || document.documentElement).appendChild(script);

$("[id^=item-container]").find('[class^=first-cell]').append("<a id='button-remove' class='button secondary expand' onclick='itemHider(this);' style='margin:0;'>Remove</a>");
$("[id^=item-container]").find('[class^=table-stats]').append("<a id='button-add-storage'class='button secondary expand' onclick='addItem(this);' style='margin:0; width:50%'>Add to Storage</a>");
$("[class^=search-results-block]").prepend("<div id='search-results-stored' style='display:none;'></div>");
$("[id=search-results-stored]").prepend("<table class='search-results' id='search-results-stored-items'>");
$("[class^=search-results-block]").prepend("<a class='button secondary expand' onclick='showItems()' style='width:25%'>Show all hidden items</a>");
$("[class^=search-results-block]").prepend("<a class='button secondary expand' onclick='exportItems()' style='width:25%'>Export shown items</a>");
$("[class^=search-results-block]").prepend("<a class='button secondary expand' onclick='toggleOffline()' style='width:25%'>Show / hide Offline</a>");
$("[class^=search-results-block]").prepend("<a class='button secondary expand' onclick='toggleStored()' style='width:25%'>Stored Items</a>");
$("[id^=mid-table").hide();
