//todo: fix/unify that!!
try{
    load("jsparse.js");
    load("jsrewrite.js");
}
catch (e){
    load("../jsparse.js");
    load("../jsrewrite.js");
}

var scriptText = "";
var line = null;


var numberOfSeqEmptyLines = 0;
var MAX_NUM_OF_SEQ_EMPTY_LINES = 10;

while((line = readline()) != null){
    if(line == ""){
        if(++numberOfSeqEmptyLines >= MAX_NUM_OF_SEQ_EMPTY_LINES){
            break;
        }
    }
    else{
        numberOfSeqEmptyLines = 0;
        scriptText += (line + "\n");
    }
}

print(AspectScriptRewrite.rewrite(scriptText));
