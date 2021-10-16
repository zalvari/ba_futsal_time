
btnExport.onclick = function() {
    var head;
    var wb = XLSX.utils.book_new();
    wb.Props = {
        Title: "BreakAway Futsal",
        Author: "Sport Performance Analytics Inc.",
        CreatedDate: new Date()
    };

    // Match Info Tab
    var dataMatchInfo = [];
    // Header
    dataMatchInfo.push(["Team Analyzed", "Date", "Location", "Competition", "Stage", "KickOff",
    "Home Team", "Away Team", "Home Initials", "Away Initials", "Goals (Home)", "Goals (Away)"]);
    dataMatchInfo.push([struct_team["name"], struct_match["date"], struct_match["location"], struct_match["competition"],
    struct_match["stage"], struct_match["kickoff"], struct_match["teams"][0], struct_match["teams"][1],
    struct_match["initials"][0], struct_match["initials"][1], struct_match["score"][0], struct_match["score"][1]]);

    // Team Info Tab
    var dataTeamInfo = [];
    // Header
    dataTeamInfo.push(["Player ID", "Player No", "First Name", "Last Name", "Position"]);
    // Data
    for (var row=0; row<struct_team["players"].length; row++) {
        dataTeamInfo.push([
            struct_team["players"][row]["pid"],
            struct_team["players"][row]["pno"],
            struct_team["players"][row]["nfirst"],
            struct_team["players"][row]["nlast"],
            struct_team["players"][row]["position"]
        ]);
    }

    // Match Events Tab
    var dataMatchEvents = [];
    // Header
    dataMatchEvents.push(Object.keys(tbl_match));
    // Data
    if (tbl_match["index"].length > 0) {
        for (var row=0; row<tbl_match["index"].length; row++) {
            var datarow = [];
            for (var col=0; col<Object.keys(tbl_match).length; col++) {
                datarow.push(tbl_match[Object.keys(tbl_match)[col]][row])
            }
            dataMatchEvents.push(datarow.slice());
        }
    }

    // Playing Stats Tab
    var dataPlayEvents = [];
    var metrics = Object.keys(tbl_period); // Rotations, Play Time, Rest Time, W/R
    var perlbl = struct_general.per_lbl;
    // Header
    var headerrow = []
    headerrow.push('Jersey #')
    headerrow.push('Display Name')
    for (p=0; p<struct_general.nper; p++) {
        for (m=0; m<metrics.length; m++) {
            headerrow.push(perlbl[p] + '_' + metrics[m])
        }
    }
    dataPlayEvents.push(headerrow)
    // Data
    for (i=0; i<struct_team.players.length; i++) {
        var datarow = [];
        datarow.push(struct_team.players[i].pno)
        datarow.push(struct_team.players[i].nlast)
        for (p=0; p<struct_general.nper; p++) {
            for (m=0; m<metrics.length; m++) {
                if (metrics[m]=="% Total Time") {
                    datarow.push(tbl_period[metrics[m]][p][i] + ".0")
                } else {
                    datarow.push(tbl_period[metrics[m]][p][i])
                }
            }
        }
        dataPlayEvents.push(datarow.slice());
    }

    wb = pushSheet(wb, "Match Info", dataMatchInfo);
    wb = pushSheet(wb, "Team Info", dataTeamInfo);
    wb = pushSheet(wb, "Match Events", dataMatchEvents);
    wb = pushSheet(wb, "Playing Stats", dataPlayEvents);

    // Export
    var fileName = struct_match["teams"][0] + "_" + struct_match["teams"][1] + "_" + struct_match["date"] + ".xlsx";
    var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), fileName);
};
//#endregion
//#region Save Match
btnSave.onclick = function() {
    updateTime();
    var struct = {
        "general": struct_general,
        "match": struct_match,
        "time": struct_time,
        "team": struct_team,
        "tbl_match": tbl_match,
        "tbl_period": tbl_period
    }
    var blob = new Blob([JSON.stringify(struct)], {type: "text/plain;charset=utf-8"});
    var fileName = struct_match["teams"][0] + "_" + struct_match["teams"][1] + "_" + struct_match["date"] + ".txt";
    saveAs(blob, fileName);
}
//#endregion


//#region Load Match
btnLoadMatch.onchange = function() {
    let file = btnLoadMatch.files[0];
    let reader = new FileReader();
    reader.addEventListener('load', function(e) {
            let text = e.target.result;
            var match_data = JSON.parse(text);

            // UPDATE STRUCTURES
            struct_general = match_data["general"];
            struct_match = match_data["match"];
            struct_time = match_data["time"];
            struct_team = match_data["team"];
            tbl_match = match_data["tbl_match"];
            tbl_period = match_data["tbl_period"];

            // UPDATE MINUTES + SECONDS        
            var timeMain = parseClock(struct_time["clock_main"],0);
            var timePlay = parseClock(struct_time["clock_play"],1);
            minutesM = timeMain[0];
            secondsM = timeMain[1];
            minutesP = timePlay[0];
            secondsP = timePlay[1];

            // UPDATE INFO
            updateAnlUITable();
            updateLiveVis();
            updateLiveButtons();
            clockPer.innerHTML = struct_time["period"];
            clockMain.innerHTML = struct_time["clock_main"];
            clockPlay.innerHTML = struct_time["clock_play"];
            txtHScore.innerHTML = struct_match["score"][0];
            txtAScore.innerHTML = struct_match["score"][1];
            // Update Team UI Labels
            txtHome.innerHTML = struct_match.initials[0];
            txtAway.innerHTML = struct_match.initials[1];
            txtHome.style.fontSize = "2vh"
            txtAway.style.fontSize = "2vh"
            btnGH.innerHTML = struct_match.initials[0] + "\n Goal";
            btnGA.innerHTML = struct_match.initials[1] + "\n Goal";

            // UPDATE ENABLES
            if (struct_time["pausetgl"]==1) {
                buttonEnable(clockKickOff, false);
                buttonEnable(clockBreak, true);
                buttonEnable(clockPause, true);
                buttonEnable(clockStop, false);
                buttonEnable(btnSave, true);
                buttonEnable(btnExport, false);
                
                clockPause.classList.add('toggle');
                clockMain.classList.remove('break');
                clockPlay.classList.remove('break');
                clockPer.classList.remove('break');
                clockMain.classList.add('pause');
                clockPlay.classList.add('pause');

                togglePlayers(true);
                toggleMatch(true);
            } else {
                buttonEnable(btnExport, true);
            }
    });
    reader.readAsText(file);
};

//#region Export Data
function pushSheet(wb, name, data) {
    var ws = XLSX.utils.aoa_to_sheet(data);
    wb.SheetNames.push(name);
    wb.Sheets[name] = ws;

    return wb
}
function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
}


//#region Load Team
function loadTeamInfo() {
    var files = btnLoadTeam.files || [];
    if (!files.length) return;
    var file = files[0];
  
    var reader = new FileReader();
    reader.onloadend = function(event) {
      var arrayBuffer = reader.result;
 
      var options = { type: 'array' };
      var workbook = XLSX.read(arrayBuffer, options);
  
      var sheetName = workbook.SheetNames[0]
      var sheet = workbook.Sheets[sheetName]
      
      var matchInfo = {};
      for (var i=1; i<11; i++) {
        matchInfo[sheet["A"+i]["v"]] = sheet["B"+i]["v"];
      }
      var playerInfo = {
        "pid": [],
        "pno": [],
        "nfirst": [],
        "nlast": [],
        "position": []
      };
      for (var i=14; i<30; i++) {
        playerInfo["pid"].push(sheet["A"+i]["v"]);
        playerInfo["pno"].push(sheet["B"+i]["v"]);
        playerInfo["nfirst"].push(sheet["C"+i]["v"]);
        playerInfo["nlast"].push(sheet["D"+i]["v"]);
        playerInfo["position"].push(sheet["E"+i]["v"]);
        console.log(sheet["D" + i]["v"])
      }
      updateTeamInfo(matchInfo, playerInfo);
      updateAnlUITable();
    };
    reader.readAsArrayBuffer(file);
}


function updateTeamInfo(mInfo, pInfo) {
    // Match Info
    struct_match["date"] = mInfo["Match Date"];
    struct_match["location"] = mInfo["Location"];
    struct_match["competition"] = mInfo["Competition"];
    struct_match["stage"] = mInfo["Stage"];
    struct_match["kickoff"] = mInfo["Kick Off Time"];
    struct_match["teams"] = [mInfo["Home Team"], mInfo["Away Team"]];
    struct_match["initials"] = [mInfo["Home Display"], mInfo["Away Display"]];

    // Team Info
    struct_team["name"] = mInfo["Team Analyzed"];
    if (mInfo["Home Team"]==mInfo["Team Analyzed"]) {
        struct_team["tgl_home"] = 1;
    } else {
        struct_team["tgl_home"] = 0;
    }
    for(var i=0; i<(struct_general["nplay"] + struct_general["nsub"]); i++) {
        struct_team["players"][i]["pno"] = pInfo["pno"][i];
        struct_team["players"][i]["nfirst"] = pInfo["nfirst"][i];
        struct_team["players"][i]["nlast"] = pInfo["nlast"][i];
        struct_team["players"][i]["position"] = pInfo["position"][i];
    }

    // Update Team UI Labels
    txtHome.innerHTML = struct_match.initials[0];
    txtAway.innerHTML = struct_match.initials[1];
    txtHome.style.fontSize = "2vh"
    txtAway.style.fontSize = "2vh"
    btnGH.innerHTML = struct_match.initials[0] + "\n Goal";
    btnGA.innerHTML = struct_match.initials[1] + "\n Goal";

    // Update Player UI Labels
    updateLiveButtons();
}



function updateLiveButtons() {
    // Update Player UI Labels
    for (i=0; i<struct_team.players.length; i++) {
        elName = document.getElementById('name'+(i+1));
        elName.innerHTML = struct_team.players[i].nlast.substring(0,5);
        elNo = document.getElementById('no'+(i+1));
        elNo.innerHTML = struct_team.players[i].pno + '.';
    }
    for (i=1; i<=struct_team.players.length; i++) {
        el = document.getElementById("play" + i)
        if (el.classList.contains('active')) {
            el.classList.remove('active');
        }
        if (struct_team.players[i-1].active==1) {
            el.classList.add('active');
        }
    }
}