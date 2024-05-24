<template>
  <div style="background-color: #ffffff; color: #000000;">
    <div style="padding-left: 15px;">
      <button @click="mode = 'draw'" :class="{enable: mode == 'draw'}">칠하기</button>
      <button @click="mode = 'eraser'" :class="{enable: mode == 'eraser'}">지우기</button>
      <button @click="mode = 'fill'" :class="{enable: mode == 'fill'}">채우기</button>
      <button @click="current_data = {}">도화지 초기화</button>
      <button @click="setData(-1)">실행취소</button>
      <button @click="setData(1)">다시실행</button>
      <button @click="setData(0)">초기화</button>
      <button @click="saveData()">저장</button>
    </div>
    <div style="padding-left: 20px;">
      <select v-model="iii_frame">
        <option v-for="(data, index) in save_data" v-bind:key="index" :value="index">{{ index }}</option>
      </select>프레임
      <button @click="insert_frame(-1)">이전에 추가</button>
      <button @click="insert_frame(1)">이후에 추가</button>
      <button @click="delete_frame()">선택한 프레임 삭제</button>
    </div>
    <div style="padding-left: 20px;">
      <select v-model="interval">
        <option v-for="data in intervals" v-bind:key="data" :value="data">{{ data }}</option>
      </select>초 간격으로
      <button @click="play()">Play</button>
      <button @click="stop()">Stop</button>
      <button @click="export_png()">Export</button>
      <input type="checkbox" v-model="prev_frame"> 이전 프레임 보기
      <input type="range" min="0" max="1" step="0.1" v-model="prev_frame_opacity">
    </div>
    <div style="display: grid; grid-template-columns: 30px auto 1fr auto 30px; gap: 20px;">
      <div></div>
      <div>
        <div style="display: grid;">
          <select id="canvas_size" v-model="canvas_size" style="font-size: 20px;">
            <option value="8">8 x 8</option>
            <option value="16">16 x 16</option>
            <option value="24" selected>24 x 24</option>
            <option value="32">32 x 32</option>
            <option value="48">48 x 48</option>
          </select>
          <input type="text" v-model="color_backgroundColor" style="width: inherit;">

          <div style="display: grid; grid-template-columns: 1fr 1fr;">
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 0px; width: fit-content; border: 1px solid; position: absolute;">
              <div style="width: 20px; height: 20px; background: rgb(230, 230, 230);"></div>
              <div style="width: 20px; height: 20px; background: rgb(255, 255, 255);"></div>
              <div style="width: 20px; height: 20px; background: rgb(230, 230, 230);"></div>
              <div style="width: 20px; height: 20px; background: rgb(255, 255, 255);"></div>
              
              <div style="width: 20px; height: 20px; background: rgb(255, 255, 255);"></div>
              <div style="width: 20px; height: 20px; background: rgb(230, 230, 230);"></div>
              <div style="width: 20px; height: 20px; background: rgb(255, 255, 255);"></div>
              <div style="width: 20px; height: 20px; background: rgb(230, 230, 230);"></div>
              
              <div style="width: 20px; height: 20px; background: rgb(230, 230, 230);"></div>
              <div style="width: 20px; height: 20px; background: rgb(255, 255, 255);"></div>
              <div style="width: 20px; height: 20px; background: rgb(230, 230, 230);"></div>
              <div style="width: 20px; height: 20px; background: rgb(255, 255, 255);"></div>
              
              <div style="width: 20px; height: 20px; background: rgb(255, 255, 255);"></div>
              <div style="width: 20px; height: 20px; background: rgb(230, 230, 230);"></div>
              <div style="width: 20px; height: 20px; background: rgb(255, 255, 255);"></div>
              <div style="width: 20px; height: 20px; background: rgb(230, 230, 230);"></div>
            </div>
            <input type="color" v-model="color_pick" @input="color_pick = $event.target.value" :style="{opacity: A * 100 / 255 * 0.01 }">
          </div>
          <div style="display: grid; grid-gap: 10px; grid-template-columns: auto 1fr;">
            <span>R</span><input type="range" min="0" max="255" v-model="R" @input="R = $event.target.value">
            <span>G</span><input type="range" min="0" max="255" v-model="G" @input="G = $event.target.value">
            <span>B</span><input type="range" min="0" max="255" v-model="B" @input="B = $event.target.value">
            <span>A</span><input type="range" min="0" max="255" v-model="A" @input="A = $event.target.value">
          </div>
        </div>
      </div>
      <div>

        <div style="width: fit-content; border: 1px solid; padding: 20px;">
          <div style="">
            <div
              :style="{ display: 'grid', gridTemplateColumns: '1fr '.repeat(canvas_size), gridGap: '0px', width: 'fit-content', border: '1px solid', position: 'absolute' }">
              <template v-for="i in parseInt(canvas_size)" v-bind:key="i">
                <template v-for="j in parseInt(canvas_size)" v-bind:key="j">
                  <div :style="{ width: '10px', height: '10px', background: bg[((i % 2) + (j % 2)) % 2] }"></div>
                </template>
              </template>
            </div>
            <div
              v-if="current_backup_idx > 0 && prev_frame && !playing && save_data.length > 0"
              :style="{ display: 'grid', gridTemplateColumns: '1fr '.repeat(canvas_size), gridGap: '0px', width: 'fit-content', border: '1px solid', position: 'absolute', opacity: parseFloat(prev_frame_opacity) }">
              <template v-for="i in parseInt(canvas_size)" v-bind:key="i">
                <template v-for="j in parseInt(canvas_size)" v-bind:key="j">
                  <div :row="i" :col="j"
                    :style="{ width: '10px', height: '10px', background: save_data[current_backup_idx-1][i + '_' + j] ? save_data[current_backup_idx-1][i + '_' + j] : '' }"
                    @mousedown="mousedown($event, $event.target)" @mouseover="mouseover($event, $event.target)"
                    @mouseout="mouseout($event.target)"></div>
                </template>
              </template>
            </div>
            <div
              v-if="current_backup_idx == -1 && prev_frame && !playing && save_data.length > 0"
              :style="{ display: 'grid', gridTemplateColumns: '1fr '.repeat(canvas_size), gridGap: '0px', width: 'fit-content', border: '1px solid', position: 'absolute', opacity: parseFloat(prev_frame_opacity) }">
              <template v-for="i in parseInt(canvas_size)" v-bind:key="i">
                <template v-for="j in parseInt(canvas_size)" v-bind:key="j">
                  <div :row="i" :col="j"
                    :style="{ width: '10px', height: '10px', background: save_data[save_data.length-1][i + '_' + j] ? save_data[save_data.length-1][i + '_' + j] : '' }"
                    @mousedown="mousedown($event, $event.target)" @mouseover="mouseover($event, $event.target)"
                    @mouseout="mouseout($event.target)"></div>
                </template>
              </template>
            </div>
            <div
              :style="{ display: 'grid', gridTemplateColumns: '1fr '.repeat(canvas_size), gridGap: '0px', width: 'fit-content', border: '1px solid', position: 'relative' }">
              <template v-for="i in parseInt(canvas_size)" v-bind:key="i">
                <template v-for="j in parseInt(canvas_size)" v-bind:key="j">
                  <div :row="i" :col="j"
                    :style="{ width: '10px', height: '10px', background: current_data[i + '_' + j] ? current_data[i + '_' + j] : '' }"
                    @mousedown="mousedown($event, $event.target)" @mouseover="mouseover($event, $event.target)"
                    @mouseout="mouseout($event.target)"></div>
                </template>
              </template>
            </div>
          </div>
          <button @click="move_pixel(-1, 0)">상</button>
          <button @click="move_pixel(1, 0)">하</button>
          <button @click="move_pixel(0, -1)">좌</button>
          <button @click="move_pixel(0, 1)">우</button>
        </div>
      </div>

      <div style="display: flex; flex-wrap: wrap; gap: 20px;">
        <template v-for="(data, index) in save_data" v-bind:key="index">
        <div>{{ index }}
          <button @click="move_to(index, -1)">이전</button>
          <button @click="move_to(index, 1)">다음</button>
          <div
            :class="{outline: true, bold: current_backup_idx == index}"
            :style="{ display: 'grid', gridTemplateColumns: '1fr '.repeat(canvas_size), gridGap: '0px', position: 'absolute' }">
            <template v-for="i in parseInt(canvas_size)" v-bind:key="i">
              <template v-for="j in parseInt(canvas_size)" v-bind:key="j">
                <div :style="{ width: '5px', height: '5px', background: bg[((i % 2) + (j % 2)) % 2] }"></div>
              </template>
            </template>
          </div>
          <div
            :class="{outline: true, bold: current_backup_idx == index}"
            :style="{ display: 'grid', gridTemplateColumns: '1fr '.repeat(canvas_size), gridGap: '0px', width: 'fit-content', position: 'relative' }">
            
              <template v-for="i in parseInt(canvas_size)" v-bind:key="i">
                <template v-for="j in parseInt(canvas_size)" v-bind:key="j">
                  <div :row="i" :col="j"
                    :style="{ width: '5px', height: '5px', background: data[i + '_' + j] ? data[i + '_' + j] : bg[((i % 2) + (j % 2)) % 2] }"
                    @click="go_frame(index)"
                    ></div>
                </template>
              </template>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
  <div style="background-color: #ffffff; padding: 50px;">
    <img src="" id="aaa" style="border: 1px solid;">
  </div>

  <!-- /<img src="" id="aaa">/ -->
</template>

<script>
export default {
  components: {
  },
  data() {
    return {
      mode: 'draw',
      clicking: false,
      canvas_size: 24,
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
      prev_frame_opacity: 0.5
    }
  },
  mounted() {
    window.aabb = this
    window.addEventListener('mouseup', this.mouseup)
    this.color_apply()
  },
  watch: {
    canvas_size: function (vv) {
      this.current_data = {}
      this.history = [{}]
      this.history_idx = 0
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
        var same_color = this.current_data[box.getAttribute('row') + '_' + box.getAttribute('col')]
        this.current_data[box.getAttribute('row') + '_' + box.getAttribute('col')] = this.color_backgroundColor
        var fill_color = this.current_data[box.getAttribute('row') + '_' + box.getAttribute('col')]
        if (same_color == fill_color)
          return
        var _row = box.getAttribute('row')
        var _col = box.getAttribute('col')
        this.current_data[box.getAttribute('row') + '_' + box.getAttribute('col')] = fill_color
        this.drawFill(parseInt(_row), parseInt(_col), same_color, fill_color)
        this.backup()
      } else {
        if (_mode == 'draw') {
          this.current_data[box.getAttribute('row') + '_' + box.getAttribute('col')] = this.color_backgroundColor
        } else {
          this.current_data[box.getAttribute('row') + '_' + box.getAttribute('col')] = ''
        }
      }
    },
    mousedown(event, box) {
      if(this.playing) return

      if (this.mode == 'fill') {
        this.draw(box, 'fill')
      } else {
        this.clicking = true
        this.current_data[box.getAttribute('row') + '_' + box.getAttribute('col')] = this.mode === 'eraser' ? '' : this.color_backgroundColor
      }
    },
    mouseout(box) {
      box.style.boxShadow = ''
    },
    mouseover(event, box) {
      if(this.playing) return
      
      box.style.boxShadow = '2px 2px inset'
      
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
    }
  }
}
</script>
<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
input[type=color] {
  width: 82px;
  height: 82px;
  position: 'relative';
  padding: 0px;
  border: 0px;
  margin: 0px;
  z-index: 1;
  /* ::-webkit-color-swatch-wrapper {
  } */
}
input[type="color" i]::-webkit-color-swatch-wrapper {
  padding: 0px;
  border: 0px;
  margin: 0px;
}
.outline {
  border: 1px solid;
  &.bold {
    border: 3px solid;
  }
}
button {
  padding: 2px 5px;
  margin: 2px 5px;
  &.enable {
    font-weight: bold;
    color: blue;
    background-color: yellow;
  }
}
</style>