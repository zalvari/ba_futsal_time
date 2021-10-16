//#region var/const declarations;
var lastNames = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen"]
// Header
var btnLoadTeam = document.getElementById("head-team");
var btnLoadMatch = document.getElementById("head-match");
var btnSave = document.getElementById("head-save");
var btnExport = document.getElementById("head-export");
var lblLoadTeam = document.getElementById("lbl-head-team");
var lblLoadMatch = document.getElementById("lbl-head-match");
// Time
var clockMain = document.getElementById("clock-main");
var clockPlay = document.getElementById("clock-play");
var clockPer = document.getElementById("period");
var clockKickOff = document.getElementById("kick-off");
var clockBreak = document.getElementById("break");
var clockPause = document.getElementById("pause");
var clockStop = document.getElementById("stoppage");
var undo = document.getElementById("undo");
var secondsM = 0;
var minutesM = 0;
var secondsP = 0;
var minutesP = 0;
var IntervalM;
var IntervalP;
// Team
var txtHome = document.getElementById("home")
var txtAway = document.getElementById("away")
var txtHScore = document.getElementById("score-h")
var txtAScore = document.getElementById("score-a")
var btnP1 = document.getElementById("btn1");
var btnP2 = document.getElementById("btn2");
var btnP3 = document.getElementById("btn3");
var btnP4 = document.getElementById("btn4");
var btnP5 = document.getElementById("btn5");
var btnP6 = document.getElementById("btn6");
var btnP7 = document.getElementById("btn7");
var btnP8 = document.getElementById("btn8");
var btnP9 = document.getElementById("btn9");
var btnP10 = document.getElementById("btn10");
var btnP11 = document.getElementById("btn11");
var btnP12 = document.getElementById("btn12");
var btnP13 = document.getElementById("btn13");
var btnP14 = document.getElementById("btn14");
var btnP15 = document.getElementById("btn15");
var btnP16 = document.getElementById("btn16");
var btnGH = document.getElementById("goal-h");
var btnGA = document.getElementById("goal-a");
//Analysis
var tblAnl = document.getElementById("tbl-anl");