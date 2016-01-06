// ==UserScript==
// @name         Improved poe.trade
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://tampermonkey.net/index.php?ext=dhdg
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';
$("[id^=item-container]").find('[class^=first-cell]').append("<a class='button secondary expand' onclick='$(this).parent().parent().parent().hide();' style='margin:0;'>Remove</a>")
$("[id^=mid-table").hide()
// Your code here...