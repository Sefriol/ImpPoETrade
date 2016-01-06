// ==UserScript==
// @name         ImPoeTrade
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Script provides small improvements to poe.trade community website
// @author       Sefriol
// @match        http://tampermonkey.net/index.php?ext=dhdg
// @match        http://poe.trade/*
// @grant        none
// @updateURL       https://github.com/Sefriol/ImpPoETrade/master/ImPoeTrade.user.js
// @downloadURL     https://github.com/Sefriol/ImpPoETrade/master/ImPoeTrade.user.js
// @homepageURL     https://github.com/Sefriol/ImpPoETrade/
// ==/UserScript==
/* jshint -W097 */
'use strict';
$("[id^=item-container]").find('[class^=first-cell]').append("<a class='button secondary expand' onclick='$(this).parent().parent().parent().hide();' style='margin:0;'>Remove</a>")
$("[id^=mid-table").hide()
