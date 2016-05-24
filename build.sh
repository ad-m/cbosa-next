set -e;
set -x;
cp content_script.user.js mozilla/data/content_script.js;
cp content_script.user.js chrome/content_script.js;
jpm xpi --addon-dir mozilla/;
zip chrome-0.0.1.zip chrome/* -r;
rm mozilla/data/content_script.js;
rm chrome/content_script.js;
