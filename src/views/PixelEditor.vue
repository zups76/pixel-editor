<template>
  <div class="pixel-editor">
    
    <div class="select-size">
      <button @click="changeCanvasSize(n)" v-for="n in pxList" v-bind:key="n" :class="{ selected: dot_cnt == n }">{{ n }} x {{ n }}</button>
    </div>

    <div class="main-area">
      
      <div class="tool-box">
        <button @click="modeDraw(true)" :style="{backgroundColor: isDrawMode ? '#ff000054' : ''}" title="그리기"><img src="@/assets/pencil.png" width="32"><br><span style="text-decoration: underline; text-decoration-thickness: 2px;">D</span>raw</button>
        <button @click="modeEraser(true)" :style="{backgroundColor: isEraserMode ? '#ff000054' : ''}" title="지우개"><img src="@/assets/eraser.png" width="32"><br><span style="text-decoration: underline; text-decoration-thickness: 2px;">E</span>raser</button>

        <button @click="modeFill(!isFillMode)" :style="{backgroundColor: isFillMode ? '#ff000054' : ''}" title="채우기"><img src="@/assets/fill.png" class="transform-x" width="32"><br><span style="text-decoration: underline; text-decoration-thickness: 2px;">F</span>ill</button>
        
        <button @click="modeSpoide(true)" :style="{backgroundColor: isSpoideMode ? '#ff000054' : ''}" title="그리기"><img src="@/assets/eyedropper.png" ref="_a_a_a_a" width="32"></button>
        <!-- <button @click="bg_disable = !bg_disable" :style="{backgroundColor: !bg_disable ? '#ff000054' : ''}" title="그리기"><img src="@/assets/background_foreground.png" width="32"><br>Trans</button>
        <hr> -->
        <hr>
        <hr>
          <button @click="modeSpoide(true)" :style="{backgroundColor: isSpoideMode ? '#ff000054' : ''}" title="그리기"><img src="@/assets/rect.png" ref="_a_a_a_a" width="32"></button>
          <hr>
        <hr>
        <hr>
        <button @click="zoomInOut(1)" title="확대"><img src="@/assets/plus-zoom.png" width="32"><br>Zoom in</button>
        <button @click="zoomInOut(-1)" title="축소"><img src="@/assets/minus-zoom.png" width="32"><br>Zoom out</button>
        <!-- <input type="range" min="5" max="10" step="1" v-model.number="dot_pixel"> -->
        <hr>
        <hr>
        <!-- <button @click="setData(-1)" title="실행취소"><img src="@/assets/undo_redo.png" class="transform-x" width="32"><br>Undo</button>
        <button @click="setData(1)" title="다시실행"><img src="@/assets/undo_redo.png" width="32"><br>Redo</button> -->
        <button @click="_clear(ctx)" title="도화지 초기화"><img src="@/assets/broomstick.png" width="32"><br>Clear</button>
        <button v-if="current_backup_idx == -1" @click="saveData()" title="추가"><img src="@/assets/add.png" width="32"><br>Add</button>
        <button v-else @click="saveData()" title="수정"><img src="@/assets/save-disk.png" width="32"><br>Save</button>
        <hr>
        <hr>
        <button @click="setData(0)" title="초기화"><img src="@/assets/new-paper.png" width="32"><br>New</button>
        <button @click="exportData()" title="내보내기"><img src="@/assets/export.png" width="32"><br>Export</button>
      </div>

      <div class="draw-layer">
        
        <div style="display: grid; grid-template-columns: auto auto 1fr; gap: 20px;">
          <div>
            <div class="canvas" :style="{ borderColor: borderColor }">
              <div style="padding: 0px; position: relative; border: 1px solid;">
                <canvas v-show="bgColor == ''" ref="canvas_bg" :style="{ position: 'absolute' }"></canvas>
                <div v-show="bgColor !== ''" :style="{ backgroundColor: bgColor, position: 'absolute', width: '100%', height: '100%' }"></div>
                
                <canvas v-show="showPrevFrame" ref="canvas_prev" :style="{ position: 'absolute' }"></canvas>

                <canvas ref="canvas" :style="{ position: 'absolute' }"></canvas>
                
                <canvas ref="canvas_drag" :style="{ position: 'inherit' }"
                  @mouseup="_mouseup($event)"
                  @mousedown="_mousedown($event)"
                  @mousemove="_mousemove($event)"
                  @mouseout="_mouseout($event)"
                ></canvas>
              </div>
            </div>
          </div>
          
          <!-- <canvas ref="canvas2" style="background-color: #ffffff;"></canvas> -->
          <!-- Canvas -->
          <!-- <div class="canvas" :style="{ borderColor: borderColor }">
            
            <div style="padding: 1px; position: relative; font-size: 11px;">
              <div :class="{'bg-disable': bg_disable}" :style="{position: 'absolute', display: 'grid', gridTemplateColumns: '1fr '.repeat(dot_cnt), zIndex: 0}">
                <template v-for="i in dot_cnt_row" v-bind:key="i" >
                  <template v-for="j in dot_cnt" v-bind:key="j">
                    <div :row="i" :col="j" :style="{width: dot_pixel+'px', height: dot_pixel+'px', background: current_data[i + '_' + j] ? '' : bgColor ? bgColor : bg[((i % 2) + (j % 2)) % 2]}"></div>
                  </template>
                </template>
              </div>
              <div :style="{display: 'grid', gridTemplateColumns: '1fr '.repeat(dot_cnt), position: 'inherit', zIndex: 2}">
                <template v-for="i in dot_cnt_row" v-bind:key="i">
                  <template v-for="j in dot_cnt" v-bind:key="j">
                    <div :row="i" :col="j" :style="{width: dot_pixel+'px', height: dot_pixel+'px', background: current_data[i + '_' + j] ? current_data[i + '_' + j] : '' }"
                      @mousedown="mousedown($event, $event.target)" @mouseover="mouseover($event, $event.target)"
                      @mouseout="mouseout($event.target)"
                    ></div>
                  </template>
                </template>
              </div>
            </div>
          </div> -->

          <div style="display: flex; flex-direction: column; gap: 3px;">
            <button @click="borderColor = 'black'" style="background-color: black; border: 1px solid; width: 25px; height: 25px;"></button>
            <button @click="borderColor = '#999999ff'" style="background-color: #999999ff; border: 1px solid; width: 25px; height: 25px;"></button>
            <button @click="borderColor = 'white'" style="background-color: white; border: 1px solid; width: 25px; height: 25px;"></button>
            <hr>
            <hr>
            <hr>
            <hr>
            <hr>
            <hr>
            <button @click="bgColor = 'black'" style="background-color: black; border: 1px solid; width: 25px; height: 25px;"></button>
            <button @click="bgColor = '#999999ff'" style="background-color: #999999ff; border: 1px solid; width: 25px; height: 25px;"></button>
            <button @click="bgColor = 'white'" style="background-color: white; border: 1px solid; width: 25px; height: 25px;"></button>
            <button @click="bgColor = ''" style="background-color: white; border: 1px solid; width: 25px; height: 25px;">T</button>
          </div>
          
          <div>
            <div class="color_btn" style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr 1fr; gap: 3px; margin-bottom: 5px;">
              <button v-for="(c, idx) in color_history" v-bind:key="c" @click="color(false, c)" :style="{border: '1px solid', backgroundColor: c}" :title="c" @dblclick="color_del(idx)"></button>
            </div>

            <input type="color" v-model="color_pick" @input="color_pick = $event.target.value" :style="{opacity: A * 100 / 255 * 0.01, width: '-webkit-fill-available', gridArea: 'b', height: '70px' }">
            <input type="text" v-model="color_backgroundColor">
            
            <div style="display: grid; grid-template-columns: auto 1fr; gap: 5px">
              <span>R</span><input type="range" min="0" max="255" v-model="R" @input="R = $event.target.value">
              <span>G</span><input type="range" min="0" max="255" v-model="G" @input="G = $event.target.value">
              <span>B</span><input type="range" min="0" max="255" v-model="B" @input="B = $event.target.value">
              <span>A</span><input type="range" min="0" max="255" v-model="A" @input="A = $event.target.value">
            </div>
            <button @click="color(true)" style="border: 1px solid; width: -webkit-fill-available; height: auto; margin-top: 20px;">Save Color</button>

            <div class="layer-arrow">
              <button @click="move_pixel(0, -1)" class="arrow" style="grid-row: 1 / 3;"><img src="@/assets/arrow_left.png" width="32"></button>
              <button @click="move_pixel(-1, 0)" class="arrow" style="grid-row: 1 / 2;"><img src="@/assets/arrow_up.png" width="32"></button>
              <button @click="move_pixel(1, 0)" class="arrow" style="grid-row: 2 / 2;"><img src="@/assets/arrow_up.png" class="transform-y" width="32"></button>
              <button @click="move_pixel(0, 1)" class="arrow" style="grid-row: 1 / 3;"><img src="@/assets/arrow_left.png" class="transform-y" width="32"></button>
            </div>

          </div>
        </div>
      </div>
    </div>
    
    <div class="layers-btn">
      <img @click="insert_frame(-1)" src="@/assets/import.png" width="32" title="이전에 추가" class="hand">
      <select v-model="selected_layer">
        <option v-for="(data, index) in save_data" v-bind:key="index" :value="index">Layer - {{ index + 1 }}</option>
      </select>
      <img @click="insert_frame(1)" src="@/assets/import.png" width="32" title="이후에 추가" class="transform-x hand">

      <!-- <img @click="saveData(selected_layer)" src="@/assets/save-disk.png" width="32" :style="{filter: selected_layer > -1 ? 'grayscale(0)' : 'grayscale(1)'}"><br> -->
      
      <select v-model="interval">
        <option v-for="data in intervals" v-bind:key="data" :value="data">{{ data >= 1000 ? parseInt(data/1000)+'초 ' : '' }} {{ data%1000 > 0 ? data%1000+' ms' : '' }}</option>
      </select>ms 간격으로

      <!-- this.save_data.length -->
      <img @click="play()" src="@/assets/play-button.png" width="32" title="Play" class="hand" :style="{filter: playing || save_data.length < 2 ? 'grayscale(1)' : 'grayscale(0)'}">
      <img @click="stop()" src="@/assets/stop-button.png" width="32" title="Stop" class="hand" :style="{filter: playing ? 'grayscale(0)' : 'grayscale(1)'}">
    </div>

    <div class="layers">
      <div class="item" v-for="(data, index) in save_data" v-bind:key="index">
        <div style="display: grid; grid-template-columns: 1fr auto auto; gap: 3px;">
          <span @click="go_frame(index)" :class="{title: true, selected: current_backup_idx == index}">Layer-{{ index + 1 }}</span>
          <img @click="saveData(index)" src="@/assets/save-disk.png" width="24" :style="{filter: selected_layer > -1 ? 'grayscale(0)' : 'grayscale(1)'}">
          <img @click="delete_frame(index)" src="@/assets/bin.png" :title="`Delete ${selected_layer + 1} frames`" class="hand" style="width: 24px; height: 24px;">
        </div>
        <div @click="go_frame(index)" :class="{'bg-disable': bg_disable, background: true}" :style="{gridTemplateColumns: '1fr '.repeat(dot_cnt)}">
          <template v-for="i in dot_cnt_row" v-bind:key="i">
            <template v-for="j in dot_cnt" v-bind:key="j">
              <div :style="{width: px+'px', height: px+'px', background: data[i+'_'+j] ? data[i+'_'+j] : bg[((i % 2) + (j % 2)) % 2]}"></div>
            </template>
          </template>
        </div>
        <div class="foreground" :style="{gridTemplateColumns: '1fr '.repeat(dot_cnt)}">
          <template v-for="i in dot_cnt_row" v-bind:key="i">
            <template v-for="j in dot_cnt" v-bind:key="j">
              <div :style="{width: px+'px', height: px+'px', background: data[i+'_'+j] ? data[i+'_'+j] : ''}"></div>
            </template>
          </template>
        </div>
      </div>
    </div>
    <div class="layers">
      <div class="item" v-for="(data, index) in save_canvas_data" v-bind:key="index">
        <object :data="aasdasdsad(data)" type="text/html"></object>
      </div>
    </div>
    <div>
      <img :src="image" style="border: 1px solid;" v-for="(image, idx) in imageData" v-bind:key="idx">
    </div>
    <div>
      <img :src="ani_image" :style="{ border: '1px solid', width: `${dot_cnt}px`, height: `${dot_cnt}px` }">
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash'

export default {
  components: {
  },
  data() {

    class Stack {
      constructor() {
        this.arr = [];
        this.index = 0;
      }
      push(item) {
        this.arr[this.index++] = item;
      }
      pop() {
        if (this.index <= 0) return null;
        const result = this.arr[--this.index];
        return result;
      }
    }

    let dot_cnt = 32
    let dot_cnt_row = 32
    let px = parseInt(150 / dot_cnt)
    let pxList = [8, 16, 24, 32, 48, 128]

    let color_history = ['#000000ff', '#ffffffff', '#ff0000ff', '#00ff00ff', '#0000ffff', '#ffff00ff', '#ff00ffff', '#00ffffff', '#999999ff', '#333333ff']

    let intervals = []

      for(let i=50;i<1000;i+=10) {
        intervals.push(i)
      }
      for(let i=1000;i<=5000;i+=200) {
        intervals.push(i)
      }
    return {
      color_history,
      px,
      dot_pixel: 10,
      pxList,
      dot_cnt,
      dot_cnt_row,
      bg: ['#e6e6e6', '#ffffff'],
      color_backgroundColor: '',
      current_data: {},
      bgColor: '',
      borderColor: 'black',
      color_pick: '#000000',
      R: 0,
      G: 0,
      B: 0,
      A: 255,
      history: [{}],
      history_idx: 0,
      save_data: [],
      save_canvas_data: [],
      current_backup_idx: -1,
      current_backup: null,
      intervals,
      interval: 200,
      playing: false,
      prev_frame: false,
      prev_frame_opacity: 0.5,
      selected_layer: -1,
      bg_disable: false,

      canvas_bg: null,
      ctx_bg: null,
      
      canvas: null,
      ctx: null,
      
      canvas_drag: null,
      ctx_drag: null,
      
      isMouseOver: false,
      start_point: null,
      zoom_step: 1,
      isDrawing: false,
      _Stack: new Stack(),
      _oldImageData: null,

      isDrawMode: true,
      isFillMode: false,
      isEraserMode: false,
      isSpoideMode: false,

      showPrevFrame: false,
      isExport: false,

      imageData: [],
      ani_image: null,
      isPlaying: false,

    }
  },
  mounted() {
    window.aabb = this
    this.color_apply()
    this.createCanvas()

    window.addEventListener('mouseup', this.mouseup)

    window.addEventListener('keydown', function(e) {
      switch(e.key) {
        case 'd':
          this.modeDraw(true)
          break
        case 'e':
          this.modeEraser(true)
          break
        case 'f':
          this.modeFill(!this.isFillMode)
          break
        case 'a':
          // this.play___()
          if(!this.isPlaying) {
            this.isPlaying = true
            this._play()
          }
          break
      }
    }.bind(this));

    window.addEventListener('keyup', function(e) {
      // if (e.key === 'Shift') {
      //   this.isFillMode = false;
      // }
    }.bind(this));
  },
  watch: {
    dot_cnt_row: function (vv) {
      this.dot_cnt_row = parseInt(vv)
    },
    dot_cnt: function (vv) {
      this.dot_cnt = parseInt(vv)
      this.dot_cnt_row = parseInt(vv)
    },
    R: function (vv) {
      this.color_apply()
    },
    G: function (vv) {
      this.color_apply()
    },
    B: function (vv) {
      this.color_apply()
    },
    A: function (vv) {
      this.color_apply()
    },
    color_pick: function (vv) {
      this.color_pick_apply()
    },
    color_backgroundColor: function (vv) {
      this.color_pick_apply()
    },
    dot_pixel: function (_new, _old) {
      this.createCanvas(true, _old)

      if(this.isExport) {
        this.imageData.push(this.canvas.toDataURL('image/png'))
        this.isExport = false
        this.dot_pixel = 10
      }
    }
  },
  methods: {
    async play___() {
      // var img = new Image()
      // img.onload = function (a, b, c) {
      //   // console.log(this.width)
      //   // console.log(this.height)
      //   console.log(this.aaasdasd)
      //     console.log(this)
      //     console.log(img)
      //     console.log(this.ctx)
      this.dot_pixel = 1
      await this.wait2(500)
      this.ctx.drawImage(this.$refs._a_a_a_a, 0, 0);
      this.dot_pixel = 10
      // }
      // img.src = this.$refs._a_a_a_a.src
    },
    async _play() {
      // if(this.playing || this.save_data.length < 2) return
      // this.playing = true
      // let temp = {...this.current_data}
      for(let i=0;i<this.imageData.length;i++) {
        // if(this.playing)
        this.ani_image = this.imageData[i]
        await this.wait(200)
          // await this.wait2(this.interval, this.save_data[i])
        // if(this.save_data.length-1 == i)
        //   i = -1
        // if(!this.playing)
        //   break
      }
      this.isPlaying = false
    },

    exportData() {
      this.isExport = true
      this.dot_pixel = 1
    },
    modeDraw(isDrawMode) {
      this.isDrawMode = isDrawMode;
      this.isEraserMode = false
      this.isSpoideMode = false
    },
    modeEraser(isEraserMode) {
      this.isEraserMode = isEraserMode;
      this.isDrawMode = false
      this.isSpoideMode = false
    },
    modeSpoide(isSpoideMode) {
      this.isSpoideMode = isSpoideMode
      this.isDrawMode = false
      this.isEraserMode = false
    },
    modeFill(isFillMode) {
      this.isFillMode = isFillMode;
      if(isFillMode) {
        if(this._Stack.index == 1) {
          let _pos = this._Stack.pop()
          this.draw(this.ctx, _pos.pos, undefined, _pos.color);
        }
      }
    },
    zoomInOut(plus_minus) {
      if( (this.dot_pixel + this.zoom_step * plus_minus) >= 1) {
        this.dot_pixel += (this.zoom_step * plus_minus)
      }
    },
    changeCanvasSize(n) {
      if(this.dot_cnt == n || !confirm('캔버스 크기를 변경합니까? 작업 데이터가 삭제됩니다.')) {
        return
      }
      this.dot_cnt = n
    },
    color_del(idx) {
      if(confirm('del?')) {
        var _color_history = []
        _color_history.push(...this.color_history.slice(0, idx-1))
        _color_history.push(...this.color_history.slice(idx+1))
        this.color_history = _color_history
      }
    },
    color(add, color) {
      if(add) {
        this.color_history.push(this.color_backgroundColor)
      } else {
        this.R = parseInt(color.substring(1, 3), 16)
        this.G = parseInt(color.substring(3, 5), 16)
        this.B = parseInt(color.substring(5, 7), 16)
        this.A = parseInt(color.substring(7, 9), 16)
        
        this.color_backgroundColor = color
      }
    },
    aasdasdsad(data) {
        var canvas = document.createElement('canvas');
        this.canvas.width = this.dot_cnt * this.dot_pixel
        this.canvas.height = this.dot_cnt * this.dot_pixel
        
        canvas.getContext('2d').putImageData(data, 0, 0); // at coords 0,0


        // var imageData2 = this.ctx2.createImageData(width, height);
        // var data = imageData2.data;
        
        // var idx=0
        // for (var y=0; y<height; y++) {
        //   for (var x=0; x<width; x++,idx++) {

        //     let ccc = this.getPixelColor(imageData, x*this.dot_pixel, y*this.dot_pixel)
        //     // console.log(ccc)
        //     // var color = arr[ss][s][i+'_'+j]
        //     // if(color) {
        //       data[idx*4+0] = ccc.r
        //       data[idx*4+1] = ccc.g
        //       data[idx*4+2] = ccc.b
        //       data[idx*4+3] = ccc.a
        //     // }
        //   }
        // }
        // this.ctx2.putImageData(imageData2, 0, 0); // at coords 0,0


        return canvas
    },
    export_png() {
      if(this.playing) return
      if(this.save_data.length > 0) {

        var canvas = document.createElement('canvas');

        var col = Math.ceil(Math.sqrt(this.save_data.length))
        var row = Math.ceil(this.save_data.length/col)

        var height=this.dot_cnt * col;
        var width=this.dot_cnt * col;

        var arr = new Array(row);
        for (var i = 0; i < row; i++) {
          arr[i] = new Array(col);
          for (var j = 0; j < col; j++) {
            arr[i][j] = this.save_data[i * col + j] || {}
          }
        }
        
        // console.log(arr)
        canvas.height=height;
        canvas.width=height;
        
        var context = canvas.getContext("2d");

        var imageData=context.createImageData(width, height);
        var data=imageData.data;
        
        var idx=0
        var hh = 4
        for (var ss=0; ss<row; ss++) {
          for (var i=1; i<=this.dot_cnt; i++) {
            for (var s=0; s<col; s++) {
              for (var j=1; j<=this.dot_cnt; j++,idx++) {
                var color = arr[ss][s][i+'_'+j]
                if(color) {
                  data[idx*4+0] = parseInt(color.substring(1, 3), 16)
                  data[idx*4+1] = parseInt(color.substring(3, 5), 16)
                  data[idx*4+2] = parseInt(color.substring(5, 7), 16)
                  data[idx*4+3] = parseInt(color.substring(7, 9), 16)
                }
              }
            }
          }
        }

        context.putImageData(imageData, 0, 0); // at coords 0,0

        var value = canvas.toDataURL('image/png');
        if (value.indexOf('image/png') > 0) { // we check if the format is supported
            document.getElementById("aaa").src = value
        }
      }
    },
    move_pixel(_row, _col) {
      if(_row != 0) {
        var temp = {}
        if(_row == -1) {
          for(var row=2; row<=this.dot_cnt_row; row++) {
            for(var col=1; col<=this.dot_cnt; col++) {
              if(this.current_data.hasOwnProperty(row+'_'+col)) {
                temp[(row-1)+'_'+col] = this.current_data[row+'_'+col]
              }
            }
          }
        } else {
          for(var row=this.dot_cnt_row-1; row>0; row--) {
            for(var col=1; col<=this.dot_cnt; col++) {
              if(this.current_data.hasOwnProperty(row+'_'+col)) {
                temp[(row+1)+'_'+col] = this.current_data[row+'_'+col]
              }
            }
          }
        }
        this.current_data = temp
      }
      if(_col != 0) {
        var temp = {}
        if(_col == -1) {
          for(var row=1; row<=this.dot_cnt_row; row++) {
            for(var col=2; col<=this.dot_cnt; col++) {
              if(this.current_data.hasOwnProperty(row+'_'+col)) {
                temp[row+'_'+(col-1)] = this.current_data[row+'_'+col]
              }
            }
          }
        } else {
          for(var row=1; row<=this.dot_cnt_row; row++) {
            for(var col=this.dot_cnt-1; col>0; col--) {
              if(this.current_data.hasOwnProperty(row+'_'+col)) {
                temp[row+'_'+(col+1)] = this.current_data[row+'_'+col]
              }
            }
          }
        }
        this.current_data = temp
      }

      // <button @click="move_pixel(-1, 0)">상</button>
      //     <button @click="move_pixel(1, 0)">하</button>
      //     <button @click="move_pixel(0, -1)">좌</button>
      //     <button @click="move_pixel(0, 1)">우</button>
    },
    move_to(idx, mv) {
      if(this.playing) return
      if(mv == -1) {
        if(idx == 0)
          return
        mv = idx - 1
        let aaa1 = {...this.save_data[idx]}
        let aaa2 = {...this.save_data[mv]}

        this.save_data[idx] = aaa2
        this.save_data[mv] = aaa1
      } else {
        if(this.save_data.length-1 == idx)
          return
        mv = idx + 1
        let aaa1 = {...this.save_data[idx]}
        let aaa2 = {...this.save_data[mv]}
        this.save_data[idx] = aaa2
        this.save_data[mv] = aaa1
      }
    },
    go_frame(idx) {
      if(this.playing) return
      if(this.current_backup_idx == -1) {
        this.current_backup_idx = idx
        this.current_backup = {...this.current_data}
        this.current_data = {...this.save_data[idx]}
      }
      else if(this.current_backup_idx == idx) {
        this.selected_layer = this.save_data.length - 1
        this.current_backup_idx = -1
        // this.current_data = {...this.current_backup}
        this.current_data = {...this.save_data[this.selected_layer]}
        this.current_backup = null
      }
      else {
        this.current_backup_idx = idx
        this.current_data = {...this.save_data[idx]}
      }
      this.selected_layer = this.current_backup_idx
    },
    saveData(frame) {
      if(this.playing) return
      // 특정 프레임 업데이트
      if(frame != undefined) {
        this.save_data[frame] = {...this.current_data}
      }
      // 선택 프레임 업데이트
      else if(this.selected_layer != -1) {
        this.save_data[this.selected_layer] = {...this.current_data}
      }
      // 
      else {
        if(this.current_backup_idx == -1) {
          this.save_data.push({...this.current_data})
          this.save_canvas_data.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height))
        } else {
          this.save_data[this.current_backup_idx] = {...this.current_data}
        }
      }
    },
    delete_frame(idx) {
      if(this.playing) return
      let _data = []
      _data.push(...this.save_data.slice(0, idx))
      _data.push(...this.save_data.slice(idx + 1))
      this.save_data = _data
      // 현재 선택된 프레임을 넘기면 선택이 해제됨
      this.go_frame(this.current_backup_idx)
    },
    insert_frame(idx) {
      if(this.playing) return
      if(idx == -1) {
        let _data = []
        _data.push(...this.save_data.slice(0, this.selected_layer))
        _data.push({...this.current_data})
        _data.push(...this.save_data.slice(this.selected_layer))
        this.save_data = _data
      } else {
        let _data = []
        _data.push(...this.save_data.slice(0, this.selected_layer+1))
        _data.push({...this.current_data})
        _data.push(...this.save_data.slice(this.selected_layer+1))
        this.save_data = _data
      }
      // 현재 선택된 프레임을 넘기면 선택이 해제됨
      this.go_frame(this.current_backup_idx)
    },
    async play() {
      if(this.playing || this.save_data.length < 2) return
      this.playing = true
      let temp = {...this.current_data}
      for(let i=0;i<this.save_data.length;i++) {
        if(this.playing)
          await this.wait(this.interval, this.save_data[i])
        if(this.save_data.length-1 == i)
          i = -1
        if(!this.playing)
          break
      }
      this.current_data = temp
    },
    stop() {
      this.playing = false
    },
    wait(time, data) {
      return new Promise(resolve => {
        if(data)
          this.current_data = data
        setTimeout(() => {
          resolve();
        }, time);
      });
    },
    setData(idx) {
      if(this.playing) return
      
      if (idx == 0) {
        this.current_data = {}
        this.save_data = []
        this.history = [{}]
        this.history_idx = 0

        // this.backup()
      } else {
        this.history_idx += idx
        if (this.history_idx > -1 && this.history_idx < this.history.length) {
          this.current_data = { ...this.history[this.history_idx] }
        } else {
          this.history_idx -= idx
        }
      }
    },
    color_apply() {
      this.color_pick = '#' + parseInt(this.R).toString(16).padStart(2, '0') + parseInt(this.G).toString(16).padStart(2, '0') + parseInt(this.B).toString(16).padStart(2, '0')
      this.color_backgroundColor = this.color_pick + parseInt(this.A).toString(16).padStart(2, '0')
      this.color_backgroundColor = this.color_pick + parseInt(this.A).toString(16).padStart(2, '0')
    },
    color_pick_apply() {
      var color = this.color_pick
      this.R = parseInt(color.substring(1, 3), 16)
      this.G = parseInt(color.substring(3, 5), 16)
      this.B = parseInt(color.substring(5, 7), 16)

      var alpha = parseInt(this.A)
      this.color_backgroundColor = color + alpha.toString(16).padStart(2, '0')
      this.color_text = color + alpha.toString(16).padStart(2, '0')
    },

    createData(type, mimetype) {
      var value = canvas.toDataURL(mimetype);
      if (value.indexOf(mimetype) > 0) { // we check if the format is supported
        return {
          type: type,
          value: value
        }
      } else {
        return false;
      }
    },


    createCanvas(isReset, _old) {

      // 그려져있던 데이터 임시저장
      if(isReset === true) {
        this._oldImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
        
      }
      // 캔버스 초기화
      else {
        this.canvas = this.$refs.canvas
        this.ctx = this.canvas.getContext('2d')
  
        this.canvas_bg = this.$refs.canvas_bg
        this.ctx_bg = this.canvas_bg.getContext('2d')
  
        this.canvas_drag = this.$refs.canvas_drag
        this.ctx_drag = this.canvas_drag.getContext('2d')

        this.canvas.addEventListener('mousemove', function(e) {
          this._current_point(e)
        }.bind(this));
      }

      // 캔버스 크기 지정
      this.canvas.width = this.dot_cnt * this.dot_pixel
      this.canvas.height = this.dot_cnt * this.dot_pixel

      this.canvas_bg.width = this.dot_cnt * this.dot_pixel
      this.canvas_bg.height = this.dot_cnt * this.dot_pixel

      this.canvas_drag.width = this.dot_cnt * this.dot_pixel
      this.canvas_drag.height = this.dot_cnt * this.dot_pixel

      // 배경 격자 그리기
      this._clear(this.ctx_bg)
      let width = this.dot_cnt
      let height = this.dot_cnt
      for (var y=0; y<height; y++) {
        for (var x=0; x<width; x++) {
          this.draw(this.ctx_bg, {x: x * this.dot_pixel, y: y * this.dot_pixel}, undefined, this.bg[(y+x)%2])
        }
      }

      // 확대 전 도트 이미지를 확대/축소하여 다시 그리기
      if(isReset === true) {
        for (var y=0; y<height; y++) {
          for (var x=0; x<width; x++) {
            let color = this.getPixelColor(this._oldImageData, x*_old, y*_old)
            this.draw(this.ctx, {x: x * this.dot_pixel, y: y * this.dot_pixel}, undefined, color);
          }
        }
      }
    },

    // 도트 그리기 함수
    draw(ctx, start_point, ent_point, color) {

      if(!String(color).startsWith('#')) {
        if(color.r == undefined)
          return
        color = '#' +
        color.r.toString(16).padStart(2, '0') +
        color.g.toString(16).padStart(2, '0') +
        color.b.toString(16).padStart(2, '0') +
        color.a.toString(16).padStart(2, '0')
      }

      ctx.fillStyle = color;
      start_point.x = start_point.x - (start_point.x % this.dot_pixel)
      start_point.y = start_point.y - (start_point.y % this.dot_pixel)

      if(ent_point == null || ent_point == undefined) {
        ent_point = {x: this.dot_pixel, y: this.dot_pixel}
      }

      // 투명도가 있는 경우 중첩되어 진해지는 현상을 방지한다.
      this._clear(ctx, start_point, {w: ent_point.x, h: ent_point.y})

      ctx.fillRect(start_point.x, start_point.y, ent_point.x, ent_point.y)

      // this._draw_1_pixel(start_point.x, start_point.y, color);
    },

    _draw_1_pixel(x, y, color) {
      this.ctx2.fillStyle = color;
      this.ctx2.fillRect(x/this.dot_pixel, y/this.dot_pixel, 1, 1);
    },

    _clear(ctx, s_point, e_point) {
      if(s_point == null || e_point == null) {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      } else {
        ctx.clearRect(s_point.x, s_point.y, e_point.w, e_point.h)
      }
    },

    _position(e, correct=true) {
      let rect = e.target.getBoundingClientRect()
      let x = Math.floor(e.clientX - this.canvas.offsetLeft) - rect.x
      let y = Math.floor(e.clientY - this.canvas.offsetTop) - rect.y

      if(correct) {
        x = x + (this.dot_pixel * Math.round((x % this.dot_pixel) * 0.1)) - (x % this.dot_pixel)
        y = y + (this.dot_pixel * Math.round((y % this.dot_pixel) * 0.1)) - (y % this.dot_pixel)
      } else {
        x = x - (x % this.dot_pixel)
        y = y - (y % this.dot_pixel)
      }

      return {x, y}
    },



    drawFill(data, _x, _y, same_color, fill_color, _temp) {
      var nearby_point = [
        { x: 0, y: -1 },
        { x: 0, y: +1 },
        { x: -1, y: 0 },
        { x: 1, y: 0 },
      ]
      nearby_point.forEach(v => {
        var __x = _x + this.dot_pixel * v.x
        var __y = _y + this.dot_pixel * v.y
        if(__x < 0 || __y < 0 || __x > this.canvas.width || __y > this.canvas.height) {
          // console.log('out')
        } else {
          let cc = this.getPixelColor(data, __x, __y)
          
          if (!_temp.hasOwnProperty(`${__x}_${__y}`) && JSON.stringify(cc) == JSON.stringify(same_color)) {
            _temp[`${__x}_${__y}`] = true
            this.draw(this.ctx, {x: __x, y: __y}, undefined, fill_color);
            this.drawFill(data, __x, __y, same_color, fill_color, _temp)
          }
        }
      })
    },



    _mousedown(e) {
      this._Stack.pop()
      if(e.button != 0) return
      
      if(this.isSpoideMode) {

        let _oldImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
        
        let pos = this._position(e, false)
        let color = this.getPixelColor(_oldImageData, pos.x, pos.y)

        this.R = color.r
        this.G = color.g
        this.B = color.b
        this.A = color.a
        return
      } else if(this.isDrawMode) {
        if(this.isFillMode) {
          this.start_point = this._position(e, false)

          let _oldImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
          let same_color = this.getPixelColor(_oldImageData, this.start_point.x, this.start_point.y)

          let _color = this.color_backgroundColor
          let fill_color = {
            r: parseInt(_color.substring(1, 3), 16),
            g: parseInt(_color.substring(3, 5), 16),
            b: parseInt(_color.substring(5, 7), 16),
            a: parseInt(_color.substring(7, 9), 16)
          }

          if(JSON.stringify(fill_color) != JSON.stringify(same_color)) {
            this.draw(this.ctx, this.start_point, undefined, fill_color);
            this.drawFill(_oldImageData, this.start_point.x, this.start_point.y, same_color, fill_color, {})
          }
          // this.drawFill(_oldImageData.data, this.start_point.x, this.start_point.y, same_color, this.color_backgroundColor)

        } else {
          this.draw(this.ctx, this._position(e, false), undefined, this.color_backgroundColor);
        }
      } else if(this.isEraserMode) {
        if(this.isFillMode) {
          this.start_point = this._position(e, false)

          let _oldImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
          let same_color = this.getPixelColor(_oldImageData, this.start_point.x, this.start_point.y)

          let fill_color = {
            r: 0,
            g: 0,
            b: 0,
            a: 0
          }

          if(JSON.stringify(fill_color) != JSON.stringify(same_color)) {
            this.draw(this.ctx, this.start_point, undefined, fill_color);
            this.drawFill(_oldImageData, this.start_point.x, this.start_point.y, same_color, fill_color, {})
          }
        } else {
          this._clear(this.ctx, this._position(e, false), {w: this.dot_pixel, h: this.dot_pixel})
        }
      }
      this.isDrawing = true
    },

    _mousemove(e) {
      if(this.isDrawing) {
        if(this.isDrawMode) {
          if(this.isFillMode) {
            // let pos = this._position(e)
            // this._clear(this.ctx_drag)
            // this.ctx_drag.strokeStyle = this.color_backgroundColor
            // this.ctx_drag.strokeRect(this.start_point.x, this.start_point.y, pos.x - this.start_point.x, pos.y - this.start_point.y); // 임시 사각형 그리기
          } else {
            this.draw(this.ctx, this._position(e, false), undefined, this.color_backgroundColor);
          }
        } else if(this.isEraserMode) {
          if(this.isFillMode) {
            // let pos = this._position(e)
            
            // this._clear(this.ctx_drag)
            // this.ctx_drag.strokeStyle = this.color_backgroundColor
            // this.ctx_drag.strokeRect(this.start_point.x, this.start_point.y, pos.x - this.start_point.x, pos.y - this.start_point.y); // 임시 사각형 그리기
          } else {
            let pos = this._position(e, false)
            this._clear(this.ctx, this._position(e, false), {w: this.dot_pixel, h: this.dot_pixel})
          }
        }
      }
    },

    _current_point(e) {
      if(this.isDrawing || this.isFillMode || this.isEraserMode) {
        if(this._Stack.index == 1) {
          let _pos = this._Stack.pop()
          this.draw(this.ctx, _pos.pos, undefined, _pos.color);
        }
      } else if(!this.isSpoideMode) {
        let _oldImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)

        let pos = this._position(e, false)
        let color = this.getPixelColor(_oldImageData, pos.x, pos.y)

        if(this._Stack.index == 0) {
          this._Stack.push({pos, color: color})
          this.draw(this.ctx, pos, undefined, this.color_backgroundColor);
        } else {
          let _pos = this._Stack.pop()
          if(pos.x == _pos.pos.x && pos.y == _pos.pos.y) {
            this._Stack.push({pos: _pos.pos, color: _pos.color})
          } else {
            this._Stack.push({pos, color})

            this.draw(this.ctx, _pos.pos, undefined, _pos.color);
            
            this.draw(this.ctx, pos, undefined, this.color_backgroundColor);
          }
        }
      }
    },

    _mouseup(e) {
      this.isDrawing = false

      if (!this.isSpoideMode && this.isFillMode) {
        if(this.isDrawMode) {
          let pos = this._position(e)
          this.draw(this.ctx, this.start_point, {x: pos.x - this.start_point.x, y: pos.y - this.start_point.y}, this.color_backgroundColor);
        } else if(this.isEraserMode) {
          let pos = this._position(e)
          // console.log(this.start_point, {x: pos.x - this.start_point.x, y: pos.y - this.start_point.y})
          this._clear(this.ctx, this.start_point, {w: pos.x - this.start_point.x, h: pos.y - this.start_point.y});
        }
        this._clear(this.ctx_drag)
      }
    },

    _mouseout(e) {
      if(this._Stack.index == 1) {
        let _pos = this._Stack.pop()
        this.draw(this.ctx, _pos.pos, undefined, _pos.color);
      }
    },

    // 픽셀 색상 가져오기 함수
    getPixelColor(imageData, x, y) {
        let index = (x + y * imageData.width) * 4;
        return {
            r: imageData.data[index],
            g: imageData.data[index + 1],
            b: imageData.data[index + 2],
            a: imageData.data[index + 3]
        };
    },

    backup() {
      this.history = this.history.slice(0, this.history_idx + 1)
      this.history.push({ ...this.current_data })
      this.history_idx = this.history.length - 1
    },
  }
}
</script>

<style>
.pixel-editor {
  background-color: #ffffff;
  color: #000000;
  padding: 5px 10px 10px 10px;
}
.aaa {
  button {
    margin: 5px;
    padding: 3px 5px;
  }
}
button {
  padding: 5px 5px;
  cursor: pointer;
  width: 75px;
  height: 60px;

  img.transform-x {
    transform: scaleX(-1)
  }
  img.transform-y {
    transform: scaleY(-1)
  }
}

img.transform-x {
  transform: scaleX(-1)
}
img.transform-y {
  transform: scaleY(-1)
}

.layer-arrow {
  display: grid;
  grid-template-columns: auto auto auto;
  margin-top: 20px;
}
.arrow {
  width: auto;
  height: auto;
  border: 0px;
  background-color: #00000000;
  padding: 0px !important;
  &:hover {
    background-color: #38d562;
  }
}
.draw-layer {
  display: flex; flex-direction: column;
  button {
    width: auto;
    height: auto;
  }
}

.canvas {
  /* display: grid; */
  /* grid-template-columns: auto 1fr auto; */
  width: fit-content;
  height: fit-content;
  /* border: 10px dashed; */
  /* padding: 10px; */
  line-height: 0;
  button {
    width: auto;
    height: auto;
  }
}

.layers-btn {
  margin: 20px 0;
  display: flex;
  gap: 10px;
  button {
    width: auto;
    height: auto;
  }
  select {
    width: auto;
    min-width: 50px;
  }
}
.layers {
  display: flex;
  gap: 10px;
  overflow: scroll;
  height: fit-content;
  /* width: calc(100vw - 200px); */
  flex-wrap: wrap;
  min-height: 200px;
  max-height: 400px;

  .item {
    padding: 1px; position: relative; font-size: 11px; cursor: pointer;
  }


  .title {
    cursor: pointer;
    padding: 2px;
    border: 1px solid #dddfdf;

    &:hover {
      background-color: hsl(309, 100%, 88%);
    }

    &.selected {
      background-color: #38d562;
      &::before {
        content: '●';
        margin-right: 5px;
      }
    }
  }

  .background {
    background-color: #ffffff;
    position: absolute;
    display: grid;
  }
  .foreground {
    background-color: #ffffff;
    display: grid;
  }
}

.select-size {
  display: flex;
  gap: 3px;
  margin: 10px 0;
  button {
    height: auto;
    padding: 10px 0;
    &.selected{
      background-color: #7eff9f;
    }
  }
}
.bg-disable {
  display: none !important;
}
hr {
  height: 5px;
  border: none;
}

.main-area {
  display: grid;
  grid-template-columns: auto 1fr;

  .tool-box {
    display: grid;
    grid-template-columns: auto auto;
    padding-right: 20px;
    gap: 3px;
    height: fit-content;
  }
}

.color_btn {
  button {
    width: auto;
    height: 25px;
  }
}

.hand {
  cursor: pointer;
}
</style>