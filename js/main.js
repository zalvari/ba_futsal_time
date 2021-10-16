
function startMain() {
    secondsM++;
    
    if (secondsM > 59) {
        minutesM++;
        secondsM = 0;
    }

    displayClock(clockMain, minutesM, secondsM, 0, struct_time.period-1)
}
function startPlay() {
    secondsP++;
    
    if (secondsP > 59) {
        minutesP++;
        secondsP = 0;
    }
    for (i=0; i<struct_team.players.length; i++) {
        if (struct_team.players[i].active==1) {
            struct_team.players[i].tplay++;
            tbl_period["Play Time"][struct_time.period-1][i]++;
        } else {
            struct_team.players[i].trest++;
            tbl_period["Rest Time"][struct_time.period-1][i]++;
        }
        updateWRPer(i)
    }
    updateLiveVis()
    updateAnlUITable()

    displayClock(clockPlay, minutesP, secondsP, 1, struct_time.period-1)
}
function displayClock(clockTxt, minutes, seconds, mode, per) {
    if (per < struct_general.nper) {
        // mode: 0 - Main Clock, 1 - Play Clock
        if (mode==0) {
            var minutesTxt = parseInt(minutes)
            var secondsTxt = parseInt(seconds)
            if(minutes<=9){
                minutesTxt = "0" + parseInt(minutes)
            }
            if(seconds<=9){
                secondsTxt = "0" + parseInt(seconds)
            }
            clockTxt.innerHTML = minutesTxt + ":" + secondsTxt;
        } else {
            var secondsTotal = 60*struct_general.per_time[per] - (parseInt(seconds) + 60*parseInt(minutes))
            if (secondsTotal>=0) {
                clockTxt.innerHTML = setClock(secondsTotal)
            } else {
                var minutesTxt = Math.ceil(secondsTotal/60);
                var secondsTxt = Math.abs(secondsTotal - 60*minutesTxt);
                if (minutesTxt>-10) {
                    minutesTxt = "-0" + Math.abs(minutesTxt);
                }
                if (secondsTxt<10) {
                    secondsTxt = "0" + secondsTxt;
                }
                clockTxt.innerHTML = minutesTxt + ":" + secondsTxt
            }
        }
    } else {
        clockTxt.innerHTML = "--:--"
    }
}
function parseClock(clockTxt, mode) {
    // 0: Main Clock, 1: Play Clock
    if (mode==0) {
        clockArr = clockTxt.split(":");
        minutes = clockArr[0];
        seconds = clockArr[1];
    } else {
        clockArr = clockTxt.split(":");
        secondsTotal = 60*struct_general.per_time[struct_time.period-1] - (60*parseInt(clockArr[0]) + parseInt(clockArr[1]));
        minutes = Math.floor(secondsTotal/60);
        seconds = secondsTotal - 60*minutes;
        if (minutes<=9) {
            minutes = "0"+minutes;
        } else {
            minutes = minutes.toString();
        }
        if (seconds<=9) {
            seconds = "0"+seconds;
        } else {
            seconds = seconds.toString();
        }
    }

    return [minutes, seconds]
}
function setClock(seconds) {
    minutes = Math.floor(seconds/60);
    sec = seconds - 60*minutes;
    if (minutes<10) {
        minutes = "0"+minutes;
    }
    if (sec<10) {
        sec = "0" + sec;
    }
    return minutes + ":" + sec
}
function updateTime() {
    struct_time["clock_main"] = clockMain.innerHTML;
    struct_time["clock_play"] = clockPlay.innerHTML;
    struct_time["period"] = clockPer.innerHTML;
}
//#endregion

//#region Analysis
function updateAnlUITable() {
    tblAnl.innerHTML = "";
    
    var table = "";
    var metrics = Object.keys(tbl_period); // Rotations, Play Time, Rest Time, W/R
    var perlbl = struct_general.per_lbl;
    var cols = struct_team.players.length;

    // METRIC COLOR SCHEME
    metCol = [  [104,108,115,24,160,251],
                [104,108,115,240,65,80], // Play Time: Slate -> Red
                [104,108,115,79,191,111], // Rest Time: Slate -> Green
                [79,191,111,24,160,251,240,65,80], // WR Ratio: Green -> Blue --> Red
                [104,108,115,24,160,251]    ] // % of Period Played: Slate -> Blue

    // TEAM ROW
    table += "<tr>";
    table += "<th style='background-color:black; text-align: right'>Team &nbsp &nbsp</th>";
    for (c=0; c<cols; c++) {
        table += "<th style='background-color:black'>" + struct_team.players[c].nlast + "</th>";
    }
    table += "</tr>";
    table = addRowSpace(table);
    // DATA ROWS
    for (var p=0; p<struct_general.nper; p++) {
        for (m=0; m<metrics.length; m++) {
            table += "<tr>";
            table += "<th style='background-color:black; text-align: right'>" + perlbl[p] + "_" + metrics[m] +" &nbsp &nbsp</th>";

            for (c=0; c<cols; c++) {
                cellData = tbl_period[metrics[m]][p][c]
                // GET METRIC FORMAT
                if (m==1 || m==2) { // Play/Rest Time
                    cellData = setClock(cellData)
                } else if (m==4) { // % Played
                    cellData += "%"
                }
                cCol = 'black'
                if (m==3) {
                    cCol = getCellColorWR(tbl_period[metrics[m]][p][c], metCol[m])
                } else {
                    cCol = getCellColor(tbl_period[metrics[m]][p], c, metCol[m])
                }

                table += "<th style=" + 
                "'background-color:" + cCol + ";" + 
                "color:var(--grey6);" + 
                "'>" + cellData + "</th>"
            }
            table += "</tr>";
        }
        table = addRowSpace(table);
        tblAnl.innerHTML = table;
    }

    function addRowSpace(table) {
        table += "<tr>";
        table += "<th style='background-color:var(--slate1)'></th>";
        for (c=0; c<cols; c++) {
            table += "<th style='background-color:var(--slate1)'></th>";
        }
        table += "</tr>";

        return table;
    }
}
function getCellColor(dataArr, idx, rgb) {
    rVal = rgb[0]+(rgb[3]-rgb[0])*(dataArr[idx] / (Math.max(...dataArr)+0.01));
    gVal = rgb[1]+(rgb[4]-rgb[1])*(dataArr[idx] / (Math.max(...dataArr)+0.01));
    bVal = rgb[2]+(rgb[5]-rgb[2])*(dataArr[idx] / (Math.max(...dataArr)+0.01));

    return "rgb(" + rVal + "," + gVal + "," + bVal + ")"
}
function getCellColorWR(wr, rgbGBR) {
    rgb = [rgbGBR[3], rgbGBR[4], rgbGBR[5]];
    if (wr<0.9) {
        rgb = [rgbGBR[0], rgbGBR[1], rgbGBR[2]];
    } else if (wr>1.1) {
        rgb = [rgbGBR[6], rgbGBR[7], rgbGBR[8]];
    }
    return "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")"
}
function getVisColorWR(wr, rgbGBR) {
    rgb = [rgbGBR[3], rgbGBR[4], rgbGBR[5]];
    if (wr<0.9) {
        rgb = [rgbGBR[0], rgbGBR[1], rgbGBR[2]];
    } else if (wr>1.1) {
        rgb = [rgbGBR[6], rgbGBR[7], rgbGBR[8]];
    }
    return "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")"
}
function updateLiveVis() {
    colG = [200,200,200,79,191,111];
    colR = [200,200,200,249,92,80];
    colGBR = [79,191,111,24,160,251,249,92,80];

    perno = struct_time.period;
    if (perno==0) {
        perno=1;
    }
    tPlayDat = getKeyArray(struct_team.players, "tplay")
    tRestDat = getKeyArray(struct_team.players, "trest")
    for (i=1; i<=struct_general.nplay + struct_general.nsub; i++) {
        // GET CLOCK COLOR
        txtRot = document.getElementById("rot" + i);
        txtRot.innerHTML = tbl_period.Rotations[perno-1][i-1];

        txtClock = document.getElementById("time" + i);
        clockDat = struct_team.players[i-1].tplay;
        cCol = getCellColor(tPlayDat, i-1, colG)
        if (struct_team.players[i-1].active==0) {
            clockDat = struct_team.players[i-1].trest;
            cCol = getCellColor(tRestDat, i-1, colR)
        }
        txtClock.innerHTML = setClock(clockDat);
        txtClock.style.color = cCol;

        wrRatio = Math.round(100*struct_team.players[i-1].tplay / (struct_team.players[i-1].trest+1))/100;
        if (wrRatio>=1) {
            
        }
        txtWR = document.getElementById("wr" + i);
        txtWR.innerHTML = wrRatio;
        txtWR.style.color = getVisColorWR(wrRatio, colGBR);
    }
}
function updateWRPer(pno) {
    tplay = tbl_period["Play Time"][struct_time.period-1][pno];
    trest = tbl_period["Rest Time"][struct_time.period-1][pno];
    wrRatio = Math.round(100*tplay / (trest+1))/100;
    perPlay = 100*Math.round(100*tplay / (60*struct_general.per_time[struct_time.period-1]))/100;

    tbl_period["W/R Ratio"][struct_time.period-1][pno] = wrRatio;
    tbl_period["% Total Time"][struct_time.period-1][pno] = perPlay;
}
//#endregion

//#region Team Actions+Passing
function setSelected(i) {
    el = document.getElementById("play" + i);
    if (struct_team["players"][i-1]["selected"]==0) {
        struct_team["players"][i-1]["selected"] = 1;
        el.classList.add('selected');
    } else {
        struct_team["players"][i-1]["selected"] = 0;
        el.classList.remove('selected');
    }
}
function checkSub() {
    var selArray = getKeyArray(struct_team["players"], "selected");

    if (arrSum(selArray)==2) {
        switchPlayers(selArray);
    }
}
function switchPlayers(selArray){

    var pID1 = getAllIndexes(selArray, 1)[0];
    var pID2 = getAllIndexes(selArray, 1)[1];

    // Determine on and off
    var onID = pID1;
    var offID = pID2;
    var validSub = false;
    if (struct_team.players[pID1].active==0 && struct_team.players[pID2].active==1) {
        onID = pID1;
        offID = pID2;
        validSub = true;
    } else if (struct_team.players[pID1].active==1 && struct_team.players[pID2].active==0) {
        onID = pID2;
        offID = pID1;
        validSub = true;
    }
    el1 = document.getElementById("play" + (onID+1));
    el2 = document.getElementById("play" + (offID+1));

    if (validSub) {

        if (histSubOn)
            histSubActions.push({"timestamp": (new Date()).getTime()
            ,"off": JSON.parse(JSON.stringify(struct_team["players"][offID]))
            ,"on": JSON.parse(JSON.stringify(struct_team["players"][onID]))
            ,"secondsM":secondsM
            ,"minutesM":minutesM
            });

        struct_team["players"][offID]["active"] = 0;
        struct_team["players"][onID]["active"] = 1;

        // Update Analysis Table
        perno = struct_time["period"];
        if (perno==0) {
            perno=1;
        }
        tbl_period.Rotations[perno-1][onID] += 1;
        //console.log(tbl_period.Rotations[perno])

        // Update Live Vis
        struct_team.players[onID].tplay = 0;
        struct_team.players[offID].trest = 0;
        updateLiveVis();

        // Update Match Table
        if (struct_time.kickofftgl==1) {
            updateTime();
            var timeMain = parseClock(struct_time["clock_main"],0);
            var timePlay = parseClock(struct_time["clock_play"],0);
            tbl_match["index"].push(tbl_match["index"].length + 1);
            tbl_match["period"].push(struct_time["period"]);
            tbl_match["min_run"].push(timeMain[0]);
            tbl_match["sec_run"].push(timeMain[1]);
            tbl_match["min_eff"].push(timePlay[0]);
            tbl_match["sec_eff"].push(timePlay[1]);
            tbl_match["result"].push("substitution");
            tbl_match["player_no1"].push(struct_team["players"][offID]["pno"]);
            tbl_match["last_name1"].push(struct_team["players"][offID]["nlast"]);
            tbl_match["player_no2"].push(struct_team["players"][onID]["pno"]);
            tbl_match["last_name2"].push(struct_team["players"][onID]["nlast"]);
        }
        // Aesthetics
        el1.classList.add('active');
        el2.classList.remove('active');
        //checkSub();
        updateAnlUITable();
    }
    struct_team.players[onID].selected = 0;
    struct_team.players[offID].selected = 0;
    el1.classList.remove('selected');
    el2.classList.remove('selected');
}

function addGoal(lbl) {
    updateTime()
    var timeMain = parseClock(struct_time["clock_main"],0);
    var timePlay = parseClock(struct_time["clock_play"],0);
    tbl_match["index"].push(tbl_match["index"].length + 1);
    tbl_match["period"].push(struct_time["period"]);
    tbl_match["min_run"].push(timeMain[0]);
    tbl_match["sec_run"].push(timeMain[1]);
    tbl_match["min_eff"].push(timePlay[0]);
    tbl_match["sec_eff"].push(timePlay[1]);
    tbl_match["result"].push(lbl);
    tbl_match["player_no1"].push(-1);
    tbl_match["last_name1"].push(-1);
    tbl_match["player_no2"].push(-1);
    tbl_match["last_name2"].push(-1);
}


//#endregion


//#region UI SET
window.onload = function() {
    toggleMatch(false);
    buttonEnable(clockBreak, false);
    buttonEnable(clockPause, false);
    buttonEnable(clockStop, false);
    buttonEnable(btnSave, false);
    buttonEnable(btnExport, false);
    updateAnlUITable();
    updateLiveVis();
}
//#endregion

function buttonEnable(button, tgl) {
    if (tgl) {
        button.disabled = false;
        button.classList.remove('disabled');
    } else {
        button.disabled = true;
        button.classList.add('disabled');
    }
}
function togglePlayers(tgl) {
    var prefix = 'play';
    for(var i = 1; i<=struct_general.nplay+struct_general.nsub; i++) {
        el = document.getElementById(prefix + i);
        buttonEnable(el, tgl)
    }
    var prefix = 'btn';
    for(var i = 1; i<=struct_general.nplay+struct_general.nsub; i++) {
        el = document.getElementById(prefix + i);
        buttonEnable(el, tgl)
    }
}
function toggleMatch(tgl) {
    buttonEnable(btnGH, tgl);
    buttonEnable(btnGA, tgl);
    if (tgl==false) {
        txtHScore.classList.add("break");
        txtAScore.classList.add("break");
    } else {
        txtHScore.classList.remove("break");
        txtAScore.classList.remove("break");
    }
}
function getKeyArray(dictname, keyname) {
    var valueArray = [];
    for (i=0; i<dictname.length; i++) {
        valueArray.push(dictname[i][keyname])
    }

    return valueArray
}
function getAllIndexes(arr, val) {
    var indexes = [];
    for(var i = 0; i < arr.length; i++)
        if (arr[i] == val)
            indexes.push(i);
    return indexes;
}


function undoSub(){
    let lastAction = histSubActions.pop();

    setSelected(lastAction["on"]["pid"]);
    setSelected(lastAction["off"]["pid"]);
    histSubOn = false;
    checkSub();
    histSubOn = true;
}