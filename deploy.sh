#!/bin/bash
echo -- -- begin init -- --

npm config set registry http://10.12.18.181:8081/repository/registry.npm.taobao.org/
echo -- -- copy node_modules:${NODE_MODULES_PATH} -- --
cp -rf ${NODE_MODULES_PATH} ./

DIST_DIR=./script/build
echo -- -- building webapp -- --
npm run build

echo -- -- move dist to ${DIST_DIR} -- --
if [ ! -d ${DIST_DIR} ]; then
    mkdir -p ${DIST_DIR}
fi

rm -rf ${DIST_DIR}/dist
cp -r ./dist ${DIST_DIR}
echo -- -- end init -- --
