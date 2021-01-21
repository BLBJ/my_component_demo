<template>
  <div class="panel">
    <div class="circle" :style="style">
      <div class="box1" :style="box1_style"></div>
      <div class="box2" :style="box2_style"></div>
      <div class="box3"></div>
    </div>
    <div class="c_content"><slot>加载中...</slot></div>
  </div>
</template>

<script>
//16进制转rgb
const color2Rgb = function (color = "", type = "rgb", opacity = 1) {
  // 16进制颜色值的正则
  var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  // 把颜色值变成小写
  var color = color.toLowerCase();
  if (reg.test(color)) {
    // 如果只有三位的值，需变成六位，如：#fff => #ffffff
    if (color.length === 4) {
      var colorNew = "#";
      for (var i = 1; i < 4; i += 1) {
        colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
      }
      color = colorNew;
    }
    // 处理六位的颜色值，转为RGB
    var colorChange = [];
    for (var i = 1; i < 7; i += 2) {
      colorChange.push(parseInt("0x" + color.slice(i, i + 2)));
    }
    if (type === "rgb") return "RGB(" + colorChange.join(",") + ")";
    if (type === "rgba") {
      colorChange.push(opacity);
      return `rgba(${colorChange.join(",")})`;
    }
  } else {
    return color;
  }
};
export default {
  props: {
    width: {
      type: String,
      default: "100",
    },
    color: {
      type: String,
      default: "#4081F1",
    },
  },
  computed: {
    style() {
      return { width: `${this.width}px`, height: `${this.width}px` };
    },
    box1_style() {
      let linerStart = color2Rgb(this.color, "rgba", 1);
      let linerEnd = color2Rgb(this.color, "rgba", 0.5);
      return {
        background: `linear-gradient(${linerStart}, ${linerEnd})`,
      };
    },
    box2_style() {
      let linerStart = color2Rgb(this.color, "rgba", 0);
      let linerEnd = color2Rgb(this.color, "rgba", 0.5);
      return {
        background: `linear-gradient(${linerStart}, ${linerEnd})`,
      };
    },
  },
};
</script>

<style scoped lang="scss">
.panel {
  position: relative;
  display: inline-block;
}
.c_content {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: fit-content;
}
.circle {
  position: relative;
  animation: loading 1s linear infinite;
  .box1 {
    position: absolute;
    left: 0;
    top: 0;
    width: 50%;
    height: 100%;
    border-radius: 50px 0 0 50px;
  }
  .box2 {
    position: absolute;
    left: 50%;
    top: 0;
    width: 50%;
    height: 100%;
    border-radius: 0 50px 50px 0;
  }
  .box3 {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: calc(100% - 5px);
    height: calc(100% - 5px);
    border-radius: 50px;
    background: #fff;
  }

  @keyframes loading {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
</style>