<template>
  <div class="pixel-editor">
    
    <div class="select-size">
      <button @click="changeCanvasSize(n)" v-for="n in pxList" v-bind:key="n" :class="{ selected: canvas_size == n }">{{ n }} x {{ n }}</button>
    </div>

    <div class="main-area">
      
      <div class="tool-box">
        <button @click="mode = 'draw'" :style="{backgroundColor: mode == 'draw' ? '#ff000054' : ''}" title="그리기"><img src="@/assets/pencil.png" width="32"><br>Draw</button>
        <button @click="mode = 'eraser'" :style="{backgroundColor: mode == 'eraser' ? '#ff000054' : ''}" title="지우개"><img src="@/assets/eraser.png" width="32"><br>Eraser</button>
        <button @click="mode = 'fill'" :style="{backgroundColor: mode == 'fill' ? '#ff000054' : ''}" title="채우기"><img src="@/assets/fill.png" class="transform-x" width="32"><br>Fill</button>
        
        <button @click="bg_disable = !bg_disable" :style="{backgroundColor: !bg_disable ? '#ff000054' : ''}" title="그리기"><img src="@/assets/background_foreground.png" width="32"><br>Trans</button>
        <hr>
        <hr>
        <button @click="dot_pixel=dot_pixel+2" title="확대"><img src="@/assets/plus-zoom.png" width="32"><br>Zoom in</button>
        <button @click="dot_pixel=dot_pixel-2" title="축소"><img src="@/assets/minus-zoom.png" width="32"><br>Zoom out</button>
        <!-- <input type="range" min="5" max="10" step="1" v-model.number="dot_pixel"> -->
        <hr>
        <hr>
        <button @click="setData(-1)" title="실행취소"><img src="@/assets/undo_redo.png" class="transform-x" width="32"><br>Undo</button>
        <button @click="setData(1)" title="다시실행"><img src="@/assets/undo_redo.png" width="32"><br>Redo</button>
        <button @click="_clear()" title="도화지 초기화"><img src="@/assets/broomstick.png" width="32"><br>Clear</button>
        <button v-if="current_backup_idx == -1" @click="saveData()" title="추가/수정"><img src="@/assets/add.png" width="32"><br>Add</button>
        <button v-else @click="saveData()" title="추가/수정"><img src="@/assets/save-disk.png" width="32"><br>Save</button>
        <hr>
        <hr>
        <button @click="setData(0)" title="초기화"><img src="@/assets/new-paper.png" width="32"><br>New</button>
        <button title="내보내기"><img src="@/assets/export.png" width="32"><br>Export</button>
      </div>

      <div class="draw-layer">
        
        <div style="display: grid; grid-template-columns: auto auto 1fr; gap: 20px;">
          <div>

            <div class="canvas" :style="{ borderColor: borderColor }">
              <div style="padding: 1px; position: relative; ">
                <canvas v-show="bgColor == ''" ref="canvas_bg" :style="{ backgroundColor: 'red', position: 'absolute', border: '1px outset black' }"></canvas>
                <div v-show="bgColor !== ''" :style="{ backgroundColor: bgColor, position: 'absolute', width: '100%', height: '100%', border: '1px outset black' }"></div>
                <canvas ref="canvas" :style="{ position: 'inherit', border: '1px outset black' }"
                  @mousedown="_mousedown($event)"
                  @mousemove="_mousemove($event)"
                  @mouseup="_mouseup($event)"
                  @mousewheel="_mousewheel($event)"
                ></canvas>
              </div>
            </div>
          </div>
          
          <canvas ref="canvas2" style="background-color: #ffffff;"></canvas>
          <!-- Canvas -->
          <!-- <div class="canvas" :style="{ borderColor: borderColor }">
            
            <div style="padding: 1px; position: relative; font-size: 11px;">
              <div :class="{'bg-disable': bg_disable}" :style="{position: 'absolute', display: 'grid', gridTemplateColumns: '1fr '.repeat(canvas_size), zIndex: 0}">
                <template v-for="i in canvas_size_row" v-bind:key="i" >
                  <template v-for="j in canvas_size" v-bind:key="j">
                    <div :row="i" :col="j" :style="{width: dot_pixel+'px', height: dot_pixel+'px', background: current_data[i + '_' + j] ? '' : bgColor ? bgColor : bg[((i % 2) + (j % 2)) % 2]}"></div>
                  </template>
                </template>
              </div>
              <div :style="{display: 'grid', gridTemplateColumns: '1fr '.repeat(canvas_size), position: 'inherit', zIndex: 2}">
                <template v-for="i in canvas_size_row" v-bind:key="i">
                  <template v-for="j in canvas_size" v-bind:key="j">
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
        <div @click="go_frame(index)" :class="{'bg-disable': bg_disable, background: true}" :style="{gridTemplateColumns: '1fr '.repeat(canvas_size)}">
          <template v-for="i in canvas_size_row" v-bind:key="i">
            <template v-for="j in canvas_size" v-bind:key="j">
              <div :style="{width: px+'px', height: px+'px', background: data[i+'_'+j] ? data[i+'_'+j] : bg[((i % 2) + (j % 2)) % 2]}"></div>
            </template>
          </template>
        </div>
        <div class="foreground" :style="{gridTemplateColumns: '1fr '.repeat(canvas_size)}">
          <template v-for="i in canvas_size_row" v-bind:key="i">
            <template v-for="j in canvas_size" v-bind:key="j">
              <div :style="{width: px+'px', height: px+'px', background: data[i+'_'+j] ? data[i+'_'+j] : ''}"></div>
            </template>
          </template>
        </div>
      </div>
    </div>
    <div class="layers">
      <div class="item" v-for="(data, index) in save_canvas_data" v-bind:key="index">
        <object :data="aasdasdsad(data)" type="text/html"></object>
        <!-- < -->
      </div>
    </div>
  </div>
</template>

<script>
// import { debounce } from 'lodash'

export default {
  components: {
  },
  data() {

    let canvas_size = 32
    let canvas_size_row = 32
    let px = parseInt(150 / canvas_size)
    let pxList = [8, 16, 24, 32, 48, 128]
    let px_to_dot_pixel = [30, 20, 15, 11, 9, 4]

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
      // dot_pixel: px_to_dot_pixel[pxList.indexOf(canvas_size)],
      pxList,
      px_to_dot_pixel,
      mode: 'draw',
      clicking: false,
      canvas_size,
      canvas_size_row,
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

      canvas2: null,
      ctx2: null,
      
      canvas_bg: null,
      ctx_bg: null,
      
      canvas: null,
      ctx: null,
      isShiftDown: false,
      isMouseOver: false,
    }
  },
  mounted() {
    window.aabb = this
    window.addEventListener('mouseup', this.mouseup)
    this.color_apply()
    this.canvas = this.$refs.canvas
    this.ctx = this.canvas.getContext('2d')

    this.canvas_bg = this.$refs.canvas_bg
    this.ctx_bg = this.canvas_bg.getContext('2d')

    this.canvas2 = this.$refs.canvas2
    this.ctx2 = this.canvas2.getContext('2d')



    window.addEventListener('keydown', function(e) {
      if (e.key === 'Shift') {
        this.isShiftDown = true;
      }
    }.bind(this));

    window.addEventListener('keyup', function(e) {
      if (e.key === 'Shift') {
        this.isShiftDown = false;
      }
    }.bind(this));
    
    // window.addEventListener('mousewheel', function(e) {
    //   // console.log(e)
    //   e.preventDefault();
    //   e.stopPropagation();
    //   // e.preventDefault()
    //   // e.stopPropagation()
    //   // if(this.isMouseOver) {
    //   //   if(e.deltaY > 0) {
    //   //     this.zoomInOut(-2)
    //   //   } else if(e.deltaY < 0) {
    //   //     this.zoomInOut(2)
    //   //   }
    //   // }
    // }.bind(this));

    this.canvas.width = this.canvas_size * this.dot_pixel
    this.canvas.height = this.canvas_size * this.dot_pixel

    this.canvas_bg.width = this.canvas_size * this.dot_pixel
    this.canvas_bg.height = this.canvas_size * this.dot_pixel

    this.canvas2.width = this.canvas_size
    this.canvas2.height = this.canvas_size



    let width = this.canvas_size
    let height = this.canvas_size
    
    for (var y=0; y<height; y++) {
      for (var x=0; x<width; x++) {
        this.draw(this.ctx_bg, x * this.dot_pixel, y * this.dot_pixel, this.bg[(y+x)%2])
      }
    }
    
  },
  watch: {
    canvas_size_row: function (vv) {
      this.canvas_size_row = parseInt(vv)
    },
    canvas_size: function (vv) {
      this.canvas_size = parseInt(vv)
      this.canvas_size_row = parseInt(vv)
      // this.current_data = {}
      // this.history = [{}]
      // this.history_idx = 0
      // this.dot_pixel = this.px_to_dot_pixel[this.pxList.indexOf(this.canvas_size)]
      console.log(this.dot_pixel)
      // if(!this.dot_pixel) {
      //   this.dot_pixel = 3
      // }
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
      this.redraw_canvas(_new, _old)
    }
  },
  methods: {
    // actionReset: debounce(function () {
    //   console.log('actionReset')
    //   this.isOverlap = false
    // }, 200),
    zoomInOut(add) {
      if((this.dot_pixel+add) >= 3 && (this.dot_pixel+add) <= 25) {
        this.dot_pixel += add
      }
    },
    _mousewheel(e) {
      e.preventDefault();
      e.stopPropagation();
      if(e.ctrlKey) {
        if(e.deltaY > 0) {
          this.zoomInOut(-2)
        } else if(e.deltaY < 0) {
          this.zoomInOut(2)
        }
      }
    },
    changeCanvasSize(n) {
      if(this.canvas_size == n || !confirm('캔버스 크기를 변경합니까? 작업 데이터가 삭제됩니다.')) {
        return
      }
      this.canvas_size = n
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
        // var _color_history = []
        // _color_history.push(...this.color_history.slice(1))
        // _color_history.push(this.color_backgroundColor)
        // this.color_history = _color_history
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
        this.canvas.width = this.canvas_size * this.dot_pixel
        this.canvas.height = this.canvas_size * this.dot_pixel
        
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

        var height=this.canvas_size * col;
        var width=this.canvas_size * col;

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
          for (var i=1; i<=this.canvas_size; i++) {
            for (var s=0; s<col; s++) {
              for (var j=1; j<=this.canvas_size; j++,idx++) {
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

        // console.log(data)
        // console.log(data.length)
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
          for(var row=2; row<=this.canvas_size_row; row++) {
            for(var col=1; col<=this.canvas_size; col++) {
              if(this.current_data.hasOwnProperty(row+'_'+col)) {
                temp[(row-1)+'_'+col] = this.current_data[row+'_'+col]
              }
            }
          }
        } else {
          for(var row=this.canvas_size_row-1; row>0; row--) {
            for(var col=1; col<=this.canvas_size; col++) {
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
          for(var row=1; row<=this.canvas_size_row; row++) {
            for(var col=2; col<=this.canvas_size; col++) {
              if(this.current_data.hasOwnProperty(row+'_'+col)) {
                temp[row+'_'+(col-1)] = this.current_data[row+'_'+col]
              }
            }
          }
        } else {
          for(var row=1; row<=this.canvas_size_row; row++) {
            for(var col=this.canvas_size-1; col>0; col--) {
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
      // this.selected_layer = this.save_data.length - 1
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
    drawFill(_row, _col, same_color, fill_color) {
      var size = this.canvas_size + 1
      var aa = [
        { row: 0, col: -1 },
        { row: 0, col: +1 },
        { row: -1, col: 0 },
        { row: -1, col: -1 },
        { row: -1, col: +1 },
        { row: 1, col: 0 },
        { row: 1, col: -1 },
        { row: 1, col: +1 },
      ]
      aa.forEach(v => {
        var __r = _row + v.row
        var __c = _col + v.col
        try {
          if (__r == 0 || __c == 0)
            return
          if (__r == size || __c == size)
            return
          var _color = this.current_data[__r + '_' + __c]
          if (_color == fill_color)
            return
          if (same_color == _color) {
            this.current_data[__r + '_' + __c] = fill_color
            this.drawFill(parseInt(__r), parseInt(__c), same_color, fill_color)
          }
        } catch (e) {
        }
      })
    },
    draw(box, _mode) {
      if(this.playing) return

      if (_mode == 'fill') {
        var same_color = this.current_data[`${box.getAttribute('row')}_${box.getAttribute('col')}`]
        this.current_data[`${box.getAttribute('row')}_${box.getAttribute('col')}`] = this.color_backgroundColor
        var fill_color = this.current_data[`${box.getAttribute('row')}_${box.getAttribute('col')}`]
        if (same_color == fill_color)
          return
        var _row = box.getAttribute('row')
        var _col = box.getAttribute('col')
        this.current_data[`${box.getAttribute('row')}_${box.getAttribute('col')}`] = fill_color
        this.drawFill(parseInt(_row), parseInt(_col), same_color, fill_color)
        this.backup()
      } else {
        if (_mode == 'draw') {
          this.current_data[`${box.getAttribute('row')}_${box.getAttribute('col')}`] = this.color_backgroundColor
        } else {
          this.current_data[`${box.getAttribute('row')}_${box.getAttribute('col')}`] = ''
        }
      }
    },
    // 도트 그리기 함수
    redraw_canvas(_new, _old) {
      

      let width = this.canvas_size
      let height = this.canvas_size
      
      // for (var y=0; y<height; y++) {
      //   for (var x=0; x<width; x++) {
      //     this.draw(this.ctx_bg, x * this.dot_pixel, y * this.dot_pixel, this.bg[(y+x)%2])
      //   }
      // }

      // 배경
      // let _oldImageData = this.ctx.getImageData(0, 0, this.canvas_bg.width, this.canvas_bg.height)
      // let width = this.canvas_bg.width / _old
      // let height = this.canvas_bg.height / _old

      this.canvas_bg.width = this.canvas_size * _new
      this.canvas_bg.height = this.canvas_size * _new

      this.ctx_bg.clearRect(0, 0, this.canvas_bg.width, this.canvas_bg.height)

      for (var y=0; y<height; y++) {
        for (var x=0; x<width; x++) {
          this.draw(this.ctx_bg, x * _new, y * _new, this.bg[(y+x)%2]);
        }
      }

      
      // 도트 이미지
      let _oldImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)

      this.canvas.width = this.canvas_size * _new
      this.canvas.height = this.canvas_size * _new

      var idx=0
      for (var y=0; y<height; y++) {
        for (var x=0; x<width; x++,idx++) {

          let ccc = this.getPixelColor(_oldImageData, x*_old, y*_old)
          this.draw222(this.ctx, x * _new, y * _new, ccc);
        }
      }
    },
    // 도트 그리기 함수
    draw222(ctx, x, y, c) {
      
      // if(c.a == 255) {
      //   console.log(x,y,c)
      // }
      let ccc = '#' + parseInt(c.r).toString(16).padStart(2, '0') +
      parseInt(c.g).toString(16).padStart(2, '0') +
      parseInt(c.b).toString(16).padStart(2, '0') +
      parseInt(c.a).toString(16).padStart(2, '0')
      ctx.fillStyle = ccc;
      x = x - (x % this.dot_pixel)
      y = y - (y % this.dot_pixel)
      ctx.fillRect(x, y, this.dot_pixel, this.dot_pixel);
    },
    // 도트 그리기 함수
    draw(ctx, x, y, color) {
      ctx.fillStyle = color;
      x = x - (x % this.dot_pixel)
      y = y - (y % this.dot_pixel)

      ctx.fillRect(x, y, this.dot_pixel, this.dot_pixel);

      // draw_1_pixel(x, y);
    },
    // draw_1_pixel(x, y) {
    //   this.ctx2.fillStyle = this.color_backgroundColor;
    //   this.ctx2.fillRect(x/this.dot_pixel, y/this.dot_pixel, 1, 1);
    // },
    _clear() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    },
    _mousedown(e) {
      if(e.button != 0) return
      if(this.isShiftDown) {
        let imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)

        let rect = e.target.getBoundingClientRect()
        let x = Math.floor(e.clientX - this.canvas.offsetLeft - rect.x )
        let y = Math.floor(e.clientY - this.canvas.offsetTop - rect.y )

        x = x - (x % this.dot_pixel)
        y = y - (y % this.dot_pixel)

        console.log(imageData.width)
        console.log(imageData.height)
        console.log(this.getPixelColor(imageData, x, y))




        // // console.log(arr)
        
        // let width = this.canvas2.width
        // let height = this.canvas2.height
        
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

      } else {
        this.isDrawing = true
        let rect = e.target.getBoundingClientRect()
        this.draw(this.ctx, Math.floor(e.clientX - this.canvas.offsetLeft - rect.x ), Math.floor(e.clientY - this.canvas.offsetTop - rect.y ), this.color_backgroundColor);
      }
    },
    _mousemove(e) {
      if(this.isDrawing && !this.isShiftDown) {
        let rect = e.target.getBoundingClientRect()
        this.draw(this.ctx, Math.floor(e.clientX - this.canvas.offsetLeft - rect.x ), Math.floor(e.clientY - this.canvas.offsetTop - rect.y ), this.color_backgroundColor);
        
      }
      // this.draw(Math.floor((e.clientX - this.canvas.offsetLeft) / 1) * 1, Math.floor((e.clientY - this.canvas.offsetTop) / 1) * 1);
    },
    _mouseup(e) {
      this.isDrawing = false
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
    mousedown(event, box) {
      if(this.playing) return

      if (this.mode == 'fill') {
        this.draw(box, 'fill')
      } else {
        this.clicking = true
        this.current_data[`${box.getAttribute('row')}_${box.getAttribute('col')}`] = this.mode === 'eraser' ? '' : this.color_backgroundColor
      }
    },
    mouseout(box) {
      box.style.boxShadow = ''
    },
    mouseover(event, box) {
      if(this.playing) return
        if(this.mode == 'eraser') {
          box.style.boxShadow = `${this.dot_pixel}px ${this.dot_pixel}px inset white`
        } else {
          box.style.boxShadow = `${this.dot_pixel}px ${this.dot_pixel}px inset ${this.color_backgroundColor}`
        }
      
      if (this.clicking) {

        if(event.shiftKey) {
          if(this.mode == 'draw') {
            this.draw(box, 'eraser')
          }
          else {
            this.draw(box, 'draw')
          }
        } else {
          this.draw(box, this.mode)
        }
      }
    },
    mouseup() {
      if (this.clicking) {
        this.backup()
      }
      this.clicking = false
      this.isDrawing = false
    },
    backup() {
      this.history = this.history.slice(0, this.history_idx + 1)
      this.history.push({ ...this.current_data })
      this.history_idx = this.history.length - 1
    },
    alert() {
    }
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