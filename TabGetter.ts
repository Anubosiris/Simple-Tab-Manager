let browserInterface;
try {
    // @ts-ignore
    browserInterface = browser;
} catch {
    // @ts-ignore
    browserInterface = chrome;
}
const aboutMask: RegExp = new RegExp("about:.*");
const chromeMask: RegExp = new RegExp("chrome:.*");
const urlMask: RegExp = new RegExp("[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)");

const tabGetter = {
    tabs: [],

    async updatetabs() {
        await browserInterface.tabs.query({}, function (tab) {
            tabGetter.tabs = [];
            let newHTML: string = "";
            for (let i = 0; i < tab.length; i++) {
                if (!(tab[i].url === "undefined" || aboutMask.test(tab[i].url) || chromeMask.test(tab[i].url))) {
                    //console.warn(tab[i].url);
                    tabGetter.tabs.push(tab[i].url);
                    newHTML += "<tr><td>" + tab[i].url + "</td></tr>";
                }
            }
            //console.log(newHTML);
            document.getElementById("tabtable").innerHTML = newHTML;
        });
    },
    async copyToClipboard() {
        let newClipboardContent: string = "";
        for (let x of tabGetter.tabs) {
            newClipboardContent += x + "\n";
        }
        //console.log(newClipboardContent);
        await navigator.clipboard.writeText(newClipboardContent);
    },
    async openFromClipboard() {
        tabGetter.tabs = [];
        //alert("This feature is under development!");
        // @ts-ignore
        if (browserInterface != chrome) {
            //Firefox
            await navigator.clipboard.readText().then(content => {
                this.lineStringToTabs(content);
            }).catch(err => {
                console.error("Unable to read clipboard", err);
                alert("Failed to read clipboard, check the extension's permissions.");
            });
        } else {
            // Firefox method doesn't work with Chrome
            // --> workaround based on https://stackoverflow.com/a/18455088/4204557
            console.log("chrome detected --> workaround used for clipboard access");
            let target: HTMLTextAreaElement = document.createElement("textarea");
            target.contentEditable = "true";
            target.className = "invisible";
            target.id = "clipBoardTarget";
            document.body.appendChild(target);
            target.focus();
            document.execCommand("paste");
            let content = target.value;
            document.body.removeChild(target);
            await this.lineStringToTabs(content);
            window.close()
        }
    },
    async lineStringToTabs(lines: string) {
        let linearray: string[] = lines.split("\n");
        let newHTML: string = "";
        for (let i = 0; i < linearray.length; i++) {
            linearray[i] = linearray[i].replace("\n", "").trim();
            if (urlMask.test(linearray[i])) {
                newHTML += "<tr><td>" + linearray[i] + "</td></tr>";
                browserInterface.tabs.create({url: linearray[i]});
            }
        }
    },
    async exportToFile() {
        alert("This feature is not supported yet!  :( ");
    },
    async importFromFile() {
        alert("This feature is not supported yet!  :( ");
    },
    constructor() {
        this.tabs = [];
        this.updatetabs();
    }
}
document.getElementById("button_copy").addEventListener("click", () => {
    tabGetter.copyToClipboard();
});
document.getElementById("button_paste").addEventListener("click", () => {
    tabGetter.openFromClipboard();
});
document.getElementById("button_export").addEventListener("click", () => {
    tabGetter.exportToFile();
});
document.getElementById("button_import").addEventListener("click", () => {
    tabGetter.importFromFile();
});

tabGetter.updatetabs()