<template>
<div class="root" id="root">
  <TheHeader :user="client.getUser()" />
  <TheSearchBar />
  <TheTable />
  <TheSideBar :user="client.getUser()" />
  <ModalLogin />
  <ModalOrder />
  <ModalSetting />
  <ModalAlert />
  <Loading />
</div>
</template>

<script lang="ts" src="../ts/renderer/v-app.ts">
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.root {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  font-family: -apple-system, BlinkMacSystemFont, Segoe WPC,Segoe UI, HelveticaNeue-Light, Noto Sans, Microsoft YaHei, PingFang SC, Hiragino Sans GB, Source Han Sans SC, Source Han Sans CN, Source Han Sans, sans-serif;
  padding-top: 30px;
  user-select: none;
  cursor: default;
}

button, input, option, select {
  font-family: -apple-system, BlinkMacSystemFont, Segoe WPC,Segoe UI, HelveticaNeue-Light, Noto Sans, Microsoft YaHei, PingFang SC, Hiragino Sans GB, Source Han Sans SC, Source Han Sans CN, Source Han Sans, sans-serif;
}

.modal-wrap {
  position: absolute;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.6);
  top: 0;
  width: 100%;
  height: 100%;
}

.modal-wrap > .modal {
  background-color: rgb(238, 241,248);
  border: 1px solid rgb(22, 120, 290);
  border-radius: 3px 3px 0 0;
  overflow: hidden;
}

.modal-wrap .modal-header {
  height: 30px;
  line-height: 30px;
  background: linear-gradient(rgb(56, 156, 216), rgb(22, 120, 290));
  border-bottom: 2px solid rgb(102, 200, 232);
  padding-left: 20px;
  color: rgb(229, 248, 255);
}

.modal-wrap .modal-body {
  padding: 10px 20px;
}

.modal-wrap .modal-footer {
  margin-bottom: 10px;
}

.flex {
  display: flex;
}

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.flex-between {
  display: flex;
  justify-content: space-between;
}

.flex-around {
  display: flex;
  justify-content: space-around;
}

.text-center {
  text-align: center;
}

.black {
  color: #000 !important;
}

.bold {
  font-weight: bold !important;
}

.ok {
  color: #26a306 !important;
}
</style>
