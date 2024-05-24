<template>
  <div class="pixel-editor">
    
    <div class="select-size">
      <button @click="canvas_size=n" v-for="n in pxList" v-bind:key="n" :class="{ selected: canvas_size == n }">{{ n }} x {{ n }}</button>
    </div>

    <div class="main-area">
      
      <div class="tool-box">
        <button @click="mode = 'draw'" :style="{backgroundColor: mode == 'draw' ? '#ff000054' : ''}" title="그리기"><img src="@/assets/pencil.png" width="32"><br>Draw</button>
        <button @click="mode = 'eraser'" :style="{backgroundColor: mode == 'eraser' ? '#ff000054' : ''}" title="지우개"><img src="@/assets/eraser.png" width="32"><br>Eraser</button>
        <button @click="mode = 'fill'" :style="{backgroundColor: mode == 'fill' ? '#ff000054' : ''}" title="채우기"><img src="@/assets/fill.png" class="transform-x" width="32"><br>Fill</button>
        
        <button @click="bg_disable = !bg_disable" :style="{backgroundColor: !bg_disable ? '#ff000054' : ''}" title="그리기"><img src="@/assets/background_foreground.png" width="32"><br>Trans</button>
        <hr>
        <hr>
        <button @click="dot_pixel=dot_pixel+1" title="확대"><img src="@/assets/plus-zoom.png" width="32"><br>Zoom in</button>
        <button @click="dot_pixel=dot_pixel-1" title="축소"><img src="@/assets/minus-zoom.png" width="32"><br>Zoom out</button>
        <hr>
        <hr>
        <button @click="setData(-1)" title="실행취소"><img src="@/assets/undo_redo.png" class="transform-x" width="32"><br>Undo</button>
        <button @click="setData(1)" title="다시실행"><img src="@/assets/undo_redo.png" width="32"><br>Redo</button>
        <button @click="current_data = {}" title="도화지 초기화"><img src="@/assets/broomstick.png" width="32"><br>Clear</button>
        <button @click="saveData()" title="추가/수정"><img src="@/assets/add.png" width="32"><br>Add</button>
        <hr>
        <hr>
        <button @click="setData(0)" title="초기화"><img src="@/assets/new-paper.png" width="32"><br>New</button>
        <button title="내보내기"><img src="@/assets/export.png" width="32"><br>Export</button>
      </div>

      <div class="draw-layer">
        
        <div style="display: grid; grid-template-columns: auto auto 1fr; gap: 20px;">
          <!-- Canvas -->
          <div class="canvas">
            
            <div style="padding: 1px; position: relative; font-size: 11px;">
              <div :class="{'bg-disable': bg_disable}" :style="{position: 'absolute', display: 'grid', gridTemplateColumns: '1fr '.repeat(canvas_size), zIndex: 0}">
                <template v-for="i in canvas_size" v-bind:key="i">
                  <template v-for="j in canvas_size" v-bind:key="j">
                    <div :style="{width: dot_pixel+'px', height: dot_pixel+'px', background: current_data[i + '_' + j] ? '' : bg[((i % 2) + (j % 2)) % 2]}"></div>
                  </template>
                </template>
              </div>
              <div :style="{display: 'grid', gridTemplateColumns: '1fr '.repeat(canvas_size), position: 'inherit', zIndex: 2}">
                <template v-for="i in canvas_size" v-bind:key="i">
                  <template v-for="j in canvas_size" v-bind:key="j">
                    <div :row="i" :col="j" :style="{width: dot_pixel+'px', height: dot_pixel+'px', background: current_data[i + '_' + j] ? current_data[i + '_' + j] : '' }"
                      @mousedown="mousedown($event, $event.target)" @mouseover="mouseover($event, $event.target)"
                      @mouseout="mouseout($event.target)"
                    ></div>
                  </template>
                </template>
              </div>
            </div>
          </div>

          <div>
            <button @click="color(true)" style="border: 1px solid; width: -webkit-fill-available; height: auto; margin-bottom: 10px;">Save Color</button>
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
      <button @click="insert_frame(-1)">이전에 추가</button>
      <select v-model="iii_frame">
        <option v-for="(data, index) in save_data" v-bind:key="index" :value="index">Layer - {{ index }}</option>
      </select>
      <button @click="insert_frame(1)">이후에 추가</button>
      <button @click="delete_frame()">선택한 프레임 삭제</button>
    </div>
    <div class="layers">
      <div @click="select_layer(index)" class="item" v-for="(data, index) in save_data" v-bind:key="index">
        <div :class="{title: true, selected: selected_layer == index}">Layer-{{ index }}</div>
        <div :class="{'bg-disable': bg_disable, background: true}" :style="{gridTemplateColumns: '1fr '.repeat(canvas_size)}">
          <template v-for="i in canvas_size" v-bind:key="i">
            <template v-for="j in canvas_size" v-bind:key="j">
              <div :style="{width: px+'px', height: px+'px', background: data[i+'_'+j] ? data[i+'_'+j] : bg[((i % 2) + (j % 2)) % 2]}"></div>
            </template>
          </template>
        </div>
        <div class="foreground" :style="{gridTemplateColumns: '1fr '.repeat(canvas_size)}">
          <template v-for="i in canvas_size" v-bind:key="i">
            <template v-for="j in canvas_size" v-bind:key="j">
              <div :style="{width: px+'px', height: px+'px', background: data[i+'_'+j] ? data[i+'_'+j] : ''}"></div>
            </template>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  data() {

    let canvas_size = 24
    let px = parseInt(150 / canvas_size)
    let pxList = [8, 16, 24, 32, 48]
    let px_to_dot_pixel = [30, 20, 15, 11, 9]

    let color_history = ['#000000ff', '#ff0000ff', '#00ff00ff', '#0000ffff', '#ffff00ff', '#ff00ffff', '#00ffffff', '#999999ff', '#333333ff', '#00000088']

    return {
      color_history,
      px,
      dot_pixel: px_to_dot_pixel[pxList.indexOf(canvas_size)],
      pxList,
      px_to_dot_pixel,
      mode: 'draw',
      clicking: false,
      canvas_size,
      bg: ['#e6e6e6', '#ffffff'],
      color_backgroundColor: '',
      current_data: {},
      color_pick: '#ff0000',
      R: 0,
      G: 0,
      B: 0,
      A: 255,
      history: [{}],
      history_idx: 0,
      save_data: [],
      iii_frame: 0,
      current_backup_idx: -1,
      current_backup: null,
      intervals: [100, 200, 300, 400, 500],
      interval: 200,
      playing: false,
      prev_frame: false,
      prev_frame_opacity: 0.5,
      selected_layer: -1,
      bg_disable: false
    }
  },
  mounted() {
    window.aabb = this
    window.addEventListener('mouseup', this.mouseup)
    this.color_apply()
  },
  watch: {
    canvas_size: function (vv) {
      this.canvas_size = parseInt(vv)
      // this.current_data = {}
      // this.history = [{}]
      // this.history_idx = 0
      this.dot_pixel = this.px_to_dot_pixel[this.pxList.indexOf(this.canvas_size)]
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
  },
  methods: {
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
    select_layer(idx) {
      if(this.selected_layer == idx)
        this.selected_layer = -1
      else
        this.selected_layer = idx
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
          for(var row=2; row<=this.canvas_size; row++) {
            for(var col=1; col<=this.canvas_size; col++) {
              if(this.current_data.hasOwnProperty(row+'_'+col)) {
                temp[(row-1)+'_'+col] = this.current_data[row+'_'+col]
              }
            }
          }
        } else {
          console.log(this.canvas_size-1)
          for(var row=this.canvas_size-1; row>0; row--) {
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
          for(var row=1; row<=this.canvas_size; row++) {
            for(var col=2; col<=this.canvas_size; col++) {
              if(this.current_data.hasOwnProperty(row+'_'+col)) {
                temp[row+'_'+(col-1)] = this.current_data[row+'_'+col]
              }
            }
          }
        } else {
          console.log(this.canvas_size-1)
          for(var row=1; row<=this.canvas_size; row++) {
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
        this.current_backup_idx = -1
        this.current_data = {...this.current_backup}
        this.current_backup = null
      }
      else {
        this.current_backup_idx = idx
        this.current_data = {...this.save_data[idx]}
      }
    },
    saveData() {
      if(this.playing) return
      if(this.current_backup_idx == -1) {
        this.save_data.push({...this.current_data})
      } else {
        this.save_data[this.current_backup_idx] = {...this.current_data}
      }
    },
    delete_frame(idx) {
      if(this.playing) return
      if(this.current_backup_idx > -1) {
        let aa = []
        aa.push(...this.save_data.slice(0, this.current_backup_idx))
        aa.push(...this.save_data.slice(this.current_backup_idx+1))
        this.save_data = aa
      }
    },
    insert_frame(idx) {
      if(this.playing) return
      if(idx == -1) {
        let aa = []
        aa.push(...this.save_data.slice(0, this.iii_frame))
        aa.push({...this.current_data})
        aa.push(...this.save_data.slice(this.iii_frame))
        this.save_data = aa
      } else {
        let aa = []
        aa.push(...this.save_data.slice(0, this.iii_frame+1))
        aa.push({...this.current_data})
        aa.push(...this.save_data.slice(this.iii_frame+1))
        this.save_data = aa
      }
    },
    stop() {
      this.playing = false
    },
    async play() {
      if(this.playing) return
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

    color_pick_apply() {
      var color = this.color_pick
      this.R = parseInt(color.substring(1, 3), 16)
      this.G = parseInt(color.substring(3, 5), 16)
      this.B = parseInt(color.substring(5, 7), 16)

      var alpha = parseInt(this.A)
      this.color_backgroundColor = color + alpha.toString(16).padStart(2, '0')
      this.color_text = color + alpha.toString(16).padStart(2, '0')
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
        box.style.boxShadow = `${this.dot_pixel}px ${this.dot_pixel}px inset ${this.color_backgroundColor}`
      
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
  border: 2px dotted;
  padding: 10px;
  button {
    width: auto;
    height: auto;
  }
}

.layers-btn {
  margin: 20px 0;
  display: flex;
  gap: 5px;
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
</style>