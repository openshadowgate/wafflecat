function addGmcpHandlers() {
    /*
    Gmcp.handle("room.info", function() {
        console.log("In room " + Gmcp.gmcp()['room']['info']['num']);
    });
    */
}

function changelog() {
    var changes = [
        "Basic working client",
        "Keypad navigation! Use your numeric keypad, with NumLock \"on\", to walk the world. Plus and Minus go down and up. 5 issues the \"look\" command."
    ]
    var version = changes.length
    var oldVersion = window.localStorage.getItem('version') || 0
    console.assert(version >= oldVersion)
    var changelog = "Changelog:\n"
    for (i = oldVersion; i < version; ++i)
        changelog += "\nv" + (i+1) + ":\n" + changes[i] + '\n'
    if (changelog != "Changelog:\n")
        alert(changelog)
    window.localStorage.setItem('version', version)
}

function start() {
    var ui = null;
    function send(text) {
        if (text[0] == ';')
            text = text.slice(1);
        else
            text = text.replace(/;/g, "\n");
        socket.send(text + "\n");
        text.split(/\n/).forEach(function(line) {
            ui.output('⇨' + line + '\n');
        });
        ui.blit();
    }
    var gmcp = Gmcp();
    var socket = null;
    ui = Ui(send);
    var socket = Socket(onMudOutput, ui.blit, gmcp);
    function onMudOutput(str) {
        ui.output(str)
    }
    var pathificator = Pathificator(send, gmcp, ui.focusOnInput);
    addGmcpHandlers();
    document.getElementById('pInput').onclick = function() { document.getElementById('pInput').select();};
    document.getElementById('pInput').oninput = function() { pathificator.findRoom('pInput', 'pList');};
    changelog();
}
