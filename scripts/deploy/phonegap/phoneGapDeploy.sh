#!/bin/sh

# phonegap appid 619681 is ECHO
# phonegap appid 785172 is ECHO Dev
# phonegap appid 785295 is ECHO Staging
PG_ECHO_PROD=619681
PG_ECHO_STAGING=785295
PG_ECHO_DEV=785172
phoneGapToken=${PHONEGAP_TOKEN}

cp ./scripts/deploy/phonegap/index--PG_iphone--.html ./tmp/www/index.html

echo "\n########################################"
echo "zip it up"
echo "########################################"
cd ./tmp
zip -r GRIDunLOCK.zip www

echo "\n########################################"
echo "uploading zip to phonegap"
echo "########################################"
#curl -X PUT -F file=@./GRIDunLOCK.zip https://build.phonegap.com/api/v1/apps/${PG_ECHO_DEV}?auth_token=$phoneGapToken

echo "\n########################################"
echo "unlock the signing key"
echo "########################################"
#curl -X PUT -d 'data={"keys":{"ios":{"id":110067,"password":"grid"}}}' https://build.phonegap.com/api/v1/apps/619681?auth_token=$phoneGapToken
#curl -X PUT -d 'data={"keys":{"ios":{"id":110067,"password":"grid"}}}' https://build.phonegap.com/api/v1/apps/708557?auth_token=$phoneGapToken

cd ../