<template>
  <div class="panel">
    <div class="face">
      <div class="item left"></div>
      <div class="item right"></div>
    </div>
    <div class="text">
      <span class="line">loading...</span>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped lang="scss">
.panel {
  display: inline-block;
  width: 80px;
}
.face {
  position: relative;
  width: 80px;
  height: 70px;
  border: 1px solid rgba(64, 129, 241, 1);
  border-radius: 50%;
  margin-bottom: 22px;
  .item {
    width: 10px;
    height: 20px;
    background: rgba(64, 129, 241, 1);
    // border-radius: 50%;
    position: absolute;
    transform: translateY(-50%);
    animation: eye_move 2s infinite ease-in-out;
  }
  .left {
    left: 20px;
    top: 30px;
  }
  .right {
    right: 20px;
    top: 30px;
  }
}
.text {
  text-align: left;
  font-size: 14px;
  color: #000;
  line-height: 16px;
  padding-left: 15px;
  .line {
    display: block;
    overflow: hidden;
    animation: text_move 1s infinite ease-in-out;
  }
}
@keyframes eye_move {
  0% {
    height: 4px;
    border-radius: 0;
  }
  13% {
    height: 4px;
    border-radius: 0;
  }
  37% {
    height: 20px;
    border-radius: 50%;
  }
  50% {
    height: 4px;
    border-radius: 25%;
  }
  63% {
    height: 20px;
    border-radius: 50%;
  }
  86% {
    height: 4px;
    border-radius: 0;
  }
  100% {
    height: 4px;
    border-radius: 0;
  }
}
@keyframes text_move {
  from {
    width: 45px;
  }
  to {
    width: 65px;
  }
}
</style>