<template>
  <div class="pixel-editor">
    <div class="main-area">
      <div class="draw-layer">
        <div style="display: grid; grid-template-columns: auto auto 1fr; gap: 20px;">
          <canvas ref="canvas" style="border: 1px solid red; transform-origin: 50% 50%;"></canvas>
        </div>
      </div>
    </div>
    

  </div>
</template>

<script>
export default {
  data() {
     return {
    }
  },
  mounted() {
    this.canvas = this.$refs.canvas
    this.ctx = this.canvas.getContext('2d')

    // 캔버스 크기 지정
    this.canvas.width = 200
    this.canvas.height = 200
    
    this.ctx.rotate(0)
    this.ctx.translate(100, 100)

    this.ctx.strokeStyle = 'red'
    this.ctx.rotate(45*Math.PI/180)
    this.ctx.strokeRect(-20, -20, 40, 40)
    
    this.ctx.rotate(0)
    this.ctx.strokeStyle = 'blue'
    this.ctx.rotate(35*Math.PI/180)
    this.ctx.strokeRect(-50, -50, 10, 10)
    
    this.ctx.rotate(0)
    var img = new Image();
    img.onload = function(a) {
      // this.ctx.rotate(45*Math.PI/180)
      this.ctx.drawImage(img, -10, -10, 20, 20);
    }.bind(this)
    img.src = "http://upload.wikimedia.org/wikipedia/commons/d/d2/Svg_example_square.svg";

  },
  methods: {
  }
}
</script>

<style>
</style>