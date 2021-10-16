// Helper
const arrSum = arr => arr.reduce((a,b) => a + b, 0);
//#endregion

//#region  INITIALIZATION
//#region  Initialize Dictionaries
var struct_general = {  // Generic Container
    "nplay": 5,
    "nsub": 11,
    "per_lbl": ["1H", "2H", "ET1", "ET2"],
    "nper": 4,
    "per_time": [20, 20, 5, 5]
};
var struct_time = { // Time Container
    "period": clockPer.innerHTML,
    "clock_main": clockMain.innerHTML,
    "clock_play": clockMain.innerHTML,
    "kickofftgl": 0,
    "pausetgl": 0,
    "stoptgl": 0
}
var struct_match = { // Match Information Container
    "date": [00, 00, 00], // YYYY-MM-DD
    "location": "Stadium",
    "competition": "Competition",
    "stage": "Stage",
    "kickoff": [00, 00], // 00h:00
    "score": [0, 0], // Home, Away
    "teams": ["Home Team", "Away Team"],
    "initials": ["HOME", "AWAY"]
}
var struct_team = { // Team Information Container
    "name": "Team",
    "tgl_home": 1,
    "players": []
}
for(var i = 0; i<(struct_general["nplay"] + struct_general["nsub"]); i++) {
    var pinfo = {
        "pid": i+1,
        "nfirst": "Player",
        "nlast": lastNames[i],
        "pno": i+1,
        "position": "",
        "selected": 0,
        "active": 0,
        "tplay": 0,
        "trest": 0
    }
    if (i<struct_general["nplay"]) {
        pinfo.active = 1;
    }
    struct_team["players"].push(pinfo)
}

var tbl_match = {
    "index": [1],
    "period": ["0"],
    "min_run": ["00"],
    "sec_run": ["00"],
    "min_eff": ["00"],
    "sec_eff": ["00"],
    "result": ["1-2-1"],
    "player_no1": [-1],
    "last_name1": [""],
    "player_no2": [-1],
    "last_name2": [""],
}
var tbl_period = {
    "Rotations": [],
    "Play Time": [],
    "Rest Time": [],
    "W/R Ratio": [],
    "% Total Time": []
}

var histSubActions = [];

for (i=0; i<struct_general.nper; i++) {
    tbl_period.Rotations.push([])
    tbl_period["Play Time"].push([])
    tbl_period["Rest Time"].push([])
    tbl_period["W/R Ratio"].push([])
    tbl_period["% Total Time"].push([])
    for (p=0; p<(struct_general.nplay+struct_general.nsub); p++) {
        tbl_period.Rotations[i].push(0)
        tbl_period["Play Time"][i].push(0)
        tbl_period["Rest Time"][i].push(0)
        tbl_period["W/R Ratio"][i].push(1.00)
        tbl_period["% Total Time"][i].push(0)
    }
}

var histSubOn=true;