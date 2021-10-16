

//#region Clock Functions
clockKickOff.onclick = function() {
    if (struct_time.period < struct_general.nper) {
        struct_time["period"]++;
        clockPer.innerHTML = struct_time["period"];

        for (p=0; p<struct_general.nplay+struct_general.nsub; p++) {
            if (struct_team.players[p].active==1) {
                tbl_period.Rotations[struct_time.period-1][p] = 1;
            } else {
                tbl_period.Rotations[struct_time.period-1][p] = 0;
            }
            struct_team.players[p].tplay = 0;
            struct_team.players[p].trest = 0;
        }
        updateLiveVis();

        clearInterval(IntervalM);
        clearInterval(IntervalP);
        IntervalM = setInterval(startMain, 1000);
        IntervalP = setInterval(startPlay, 1000);

        // Update Line-Up
        for (var i = 0; i<struct_team.players.length; i++) {
            if (struct_team.players[i].active==1) {
                var timeMain = parseClock(struct_time["clock_main"],0);
                var timePlay = parseClock(struct_time["clock_play"],0);
                tbl_match["index"].push(i+2);
                tbl_match["period"].push(struct_time["period"]);
                tbl_match["min_run"].push(timeMain[0]);
                tbl_match["sec_run"].push(timeMain[1]);
                tbl_match["min_eff"].push(timePlay[0]);
                tbl_match["sec_eff"].push(timePlay[1]);
                tbl_match["result"].push("lineup");
                tbl_match["player_no1"].push(struct_team["players"][i]["pno"]);
                tbl_match["last_name1"].push(struct_team["players"][i]["nlast"]);
                tbl_match["player_no2"].push(-1);
                tbl_match["last_name2"].push("");
            }
        }
        // Update Match Table
        updateTime();
        var timeMain = parseClock(struct_time["clock_main"],0);
        var timePlay = parseClock(struct_time["clock_play"],0);
        tbl_match["index"].push(tbl_match["index"].length + 1)
        tbl_match["period"].push(struct_time["period"]);
        tbl_match["min_run"].push(timeMain[0]);
        tbl_match["sec_run"].push(timeMain[1]);
        tbl_match["min_eff"].push(timePlay[0]);
        tbl_match["sec_eff"].push(timePlay[1]);
        tbl_match["result"].push("kick off");
        tbl_match["player_no1"].push(-1);
        tbl_match["last_name1"].push("");
        tbl_match["player_no2"].push(-1);
        tbl_match["last_name2"].push("");

        // Toggles
        struct_time["kickofftgl"] = 1;
        // Button Enables
        buttonEnable(clockKickOff, false)
        buttonEnable(clockBreak, true)
        buttonEnable(clockPause, true)
        buttonEnable(clockStop, true)
        buttonEnable(btnLoadTeam, false)
        buttonEnable(btnLoadMatch, false)
        buttonEnable(btnSave, false)
        buttonEnable(btnExport, false)
        toggleMatch(true)
        togglePlayers(true)
        // Button Aesthetics
        clockPer.classList.remove('break');
        clockMain.classList.remove('break');
        clockPlay.classList.remove('break');
        lblLoadTeam.classList.add('break');
        lblLoadMatch.classList.add('break');
    }
}
clockBreak.onclick = function() {
    clearInterval(IntervalM);
    clearInterval(IntervalP);

    // Update Match Table
    updateTime();
    var timeMain = parseClock(struct_time["clock_main"],0);
    var timePlay = parseClock(struct_time["clock_play"],0);
    tbl_match["index"].push(tbl_match["index"].length + 1)
    tbl_match["period"].push(struct_time["period"]);
    tbl_match["min_run"].push(timeMain[0]);
    tbl_match["sec_run"].push(timeMain[1]);
    tbl_match["min_eff"].push(timePlay[0]);
    tbl_match["sec_eff"].push(timePlay[1]);
    tbl_match["result"].push("break");
    tbl_match["player_no1"].push(-1);
    tbl_match["last_name1"].push("");
    tbl_match["player_no2"].push(-1);
    tbl_match["last_name2"].push("");

    minutesM = "0";
    secondsM = "0";
    displayClock(clockMain, minutesM, secondsM, 0, struct_time.period)

    minutesP = "0";
    secondsP = "0";
    displayClock(clockPlay, minutesP, secondsP, 1, struct_time.period)

    // Toggles
    struct_time["kickofftgl"] = 0;
    struct_time["pausetgl"] = 0;
    struct_time["stoptgl"] = 0;
    // Button Enables
    buttonEnable(clockKickOff, true)
    buttonEnable(clockBreak, false)
    buttonEnable(clockPause, false)
    buttonEnable(clockStop, false)
    buttonEnable(btnSave, true)
    buttonEnable(btnExport, true)
    toggleMatch(false)
    // Button Aesthetics
    clockPer.classList.add('break');
    clockMain.classList.add('break');
    clockPlay.classList.add('break');
    clockPause.classList.remove('toggle');
    clockStop.classList.remove('toggle');
    clockMain.classList.remove('pause');
    clockPlay.classList.remove('pause');
}
clockPause.onclick = function() {
    if(struct_time["pausetgl"]==0){
        clearInterval(IntervalM);
        clearInterval(IntervalP);
        
        struct_time["pausetgl"] = 1;

        buttonEnable(clockStop, false);
        buttonEnable(btnSave, true)
        
        clockPause.classList.add('toggle');
        clockMain.classList.add('pause');
        clockPlay.classList.add('pause');
    } else {
        IntervalM = setInterval(startMain, 1000);
        IntervalP = setInterval(startPlay, 1000);
        
        struct_time["pausetgl"] = 0;
        
        buttonEnable(btnLoadTeam, false)
        buttonEnable(btnLoadMatch, false)
        buttonEnable(clockStop, true)
        buttonEnable(btnSave, false)
        
        clockPause.classList.remove('toggle');
        clockMain.classList.remove('pause');
        clockPlay.classList.remove('pause');
        lblLoadTeam.classList.add('break');
        lblLoadMatch.classList.add('break');
    }
}
clockStop.onclick = function() {
    if(struct_time["stoptgl"]==0){
        clearInterval(IntervalP);
        struct_time["stoptgl"] = 1;

        buttonEnable(clockPause, false)
        
        clockStop.classList.add('toggle');
        clockPlay.classList.add('pause');
    } else {
        IntervalP = setInterval(startPlay, 1000);
        struct_time["stoptgl"] = 0;

        buttonEnable(clockPause, true)
        
        clockStop.classList.remove('toggle');
        clockPlay.classList.remove('pause');
    }
}



btnGH.onclick = function() {
    struct_match["score"][0]++
    txtHScore.innerHTML++;
    if (struct_team["tgl_home"]==1) {
        addGoal("goal for");
    } else {
        addGoal("goal against")
    }
}
btnGA.onclick = function() {
    struct_match["score"][1]++
    txtAScore.innerHTML++;
    if (struct_team["tgl_home"]==0) {
        addGoal("goal for");
    } else {
        addGoal("goal against")
    }
}

btnLoadTeam.onchange = function() {loadTeamInfo()};

btnP1.onclick = function(){setSelected(1); checkSub()}
btnP2.onclick = function(){setSelected(2); checkSub()}
btnP3.onclick = function(){setSelected(3); checkSub()}
btnP4.onclick = function(){setSelected(4); checkSub()}
btnP5.onclick = function(){setSelected(5); checkSub()}
btnP6.onclick = function(){setSelected(6); checkSub()}
btnP7.onclick = function(){setSelected(7); checkSub()}
btnP8.onclick = function(){setSelected(8); checkSub()}
btnP9.onclick = function(){setSelected(9); checkSub()}
btnP10.onclick = function(){setSelected(10); checkSub()}
btnP11.onclick = function(){setSelected(11); checkSub()}
btnP12.onclick = function(){setSelected(12); checkSub()}
btnP13.onclick = function(){setSelected(13); checkSub()}
btnP14.onclick = function(){setSelected(14); checkSub()}
btnP15.onclick = function(){setSelected(15); checkSub()}
btnP16.onclick = function(){setSelected(16); checkSub()}

undo.onclick = function(){ undoSub(); }