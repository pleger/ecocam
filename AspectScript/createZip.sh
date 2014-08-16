#!/bin/sh

f=as.zip

# IF YOU ADD/REMOVE FILES, PLEASE UPDATE THE DOWNLOAD PAGE!

#version
v=`svnversion -n ../js`
echo "rev. $v" > version.txt
zip    $f version.txt

#main files
zip    $f aspectscript/*.js
zip    $f aspectscript/jst.php
zip    $f aspectscript/rewriter.html
zip -r $f aspectscript/tests -x \*.svn\*
zip -r $f aspectscript/paperExamples -x \*.svn\*

#extra
zip    $f fw-testing.js
zip    $f js

rm version.txt

#copy
echo "---------------------------------------------------------------------------"
echo "Copying to pleiad server..."
echo ""
echo "REMEMBER TO UPDATE THE SVN REVISION NUMBER IN THE DOWNLOAD PAGE --> $v"
echo "---------------------------------------------------------------------------"
scp $f pleiad@pleiad:/home/v/pleiad/www/aspectscript/data/media/aspectscript.zip
