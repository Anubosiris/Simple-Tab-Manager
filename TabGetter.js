var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var browserInterface;
try {
    // @ts-ignore
    browserInterface = browser;
}
catch (_a) {
    // @ts-ignore
    browserInterface = chrome;
}
var aboutMask = new RegExp("about:.*");
var chromeMask = new RegExp("chrome:.*");
var urlMask = new RegExp("[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)");
var tabGetter = {
    tabs: [],
    updatetabs: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browserInterface.tabs.query({}, function (tab) {
                            tabGetter.tabs = [];
                            var newHTML = "";
                            for (var i = 0; i < tab.length; i++) {
                                if (!(tab[i].url === "undefined" || aboutMask.test(tab[i].url) || chromeMask.test(tab[i].url))) {
                                    //console.warn(tab[i].url);
                                    tabGetter.tabs.push(tab[i].url);
                                    newHTML += "<tr><td>" + tab[i].url + "</td></tr>";
                                }
                            }
                            document.getElementById("tabtable").innerHTML = newHTML;
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    copyToClipboard: function () {
        return __awaiter(this, void 0, void 0, function () {
            var newClipboardContent, _i, _a, x;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        newClipboardContent = "";
                        for (_i = 0, _a = tabGetter.tabs; _i < _a.length; _i++) {
                            x = _a[_i];
                            newClipboardContent += x + "\n";
                        }
                        //console.log(newClipboardContent);
                        return [4 /*yield*/, navigator.clipboard.writeText(newClipboardContent)];
                    case 1:
                        //console.log(newClipboardContent);
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    openFromClipboard: function () {
        return __awaiter(this, void 0, void 0, function () {
            var target, content;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tabGetter.tabs = [];
                        if (!(browserInterface != chrome)) return [3 /*break*/, 2];
                        //Firefox
                        return [4 /*yield*/, navigator.clipboard.readText().then(function (content) {
                                _this.lineStringToTabs(content);
                                window.close();
                            })["catch"](function (err) {
                                console.error("Unable to read clipboard", err);
                                alert("Failed to read clipboard, check the extension's permissions.");
                            })];
                    case 1:
                        //Firefox
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        // Firefox method doesn't work with Chrome
                        // --> workaround based on https://stackoverflow.com/a/18455088/4204557
                        console.log("chrome detected --> workaround used for clipboard access");
                        target = document.createElement("textarea");
                        target.contentEditable = "true";
                        target.className = "invisible";
                        target.id = "clipBoardTarget";
                        document.body.appendChild(target);
                        target.focus();
                        document.execCommand("paste");
                        content = target.value;
                        document.body.removeChild(target);
                        return [4 /*yield*/, this.lineStringToTabs(content)];
                    case 3:
                        _a.sent();
                        window.close();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    lineStringToTabs: function (lines) {
        return __awaiter(this, void 0, void 0, function () {
            var linearray, newHTML, i;
            return __generator(this, function (_a) {
                linearray = lines.split("\n");
                newHTML = "";
                for (i = 0; i < linearray.length; i++) {
                    linearray[i] = linearray[i].replace("\n", "").trim();
                    if (urlMask.test(linearray[i])) {
                        newHTML += "<tr><td>" + linearray[i] + "</td></tr>";
                        browserInterface.tabs.create({ url: linearray[i] });
                    }
                }
                return [2 /*return*/];
            });
        });
    },
    exportToFile: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                alert("This feature is not supported yet!  :( ");
                return [2 /*return*/];
            });
        });
    },
    importFromFile: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                alert("This feature is not supported yet!  :( ");
                return [2 /*return*/];
            });
        });
    },
    constructor: function () {
        this.tabs = [];
        this.updatetabs();
    }
};
document.getElementById("button_copy").addEventListener("click", function () {
    tabGetter.copyToClipboard();
});
document.getElementById("button_paste").addEventListener("click", function () {
    tabGetter.openFromClipboard();
});
document.getElementById("button_export").addEventListener("click", function () {
    tabGetter.exportToFile();
});
document.getElementById("button_import").addEventListener("click", function () {
    tabGetter.importFromFile();
});
tabGetter.updatetabs();
