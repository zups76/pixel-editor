import{_ as V,c as u,a as s,n as m,w as c,v as z,F as v,r as h,b as w,d as G,e as f,f as g,g as S,h as M,o as p,t as I}from"./index-CdnbOSWt.js";const U={components:{},data(){return{mode:"draw",clicking:!1,canvas_size:24,bg:["#e6e6e6","#ffffff"],color_backgroundColor:"",current_data:{},color_pick:"#ff0000",R:0,G:0,B:0,A:255,history:[{}],history_idx:0,save_data:[],iii_frame:0,current_backup_idx:-1,current_backup:null,intervals:[100,200,300,400,500],interval:200,playing:!1,prev_frame:!1,prev_frame_opacity:.5}},mounted(){window.aabb=this,window.addEventListener("mouseup",this.mouseup),this.color_apply()},watch:{canvas_size:function(r){this.current_data={},this.history=[{}],this.history_idx=0},R:function(r){this.color_apply()},G:function(r){this.color_apply()},B:function(r){this.color_apply()},A:function(r){this.color_apply()},color_pick:function(r){this.color_pick_apply()}},methods:{export_png(){if(!this.playing&&this.save_data.length>0){for(var r=document.createElement("canvas"),t=Math.ceil(Math.sqrt(this.save_data.length)),d=Math.ceil(this.save_data.length/t),o=this.canvas_size*t,e=this.canvas_size*t,l=new Array(d),i=0;i<d;i++){l[i]=new Array(t);for(var n=0;n<t;n++)l[i][n]=this.save_data[i*t+n]||{}}r.height=o,r.width=o;for(var a=r.getContext("2d"),_=a.createImageData(e,o),y=_.data,b=0,x=0;x<d;x++)for(var i=1;i<=this.canvas_size;i++)for(var C=0;C<t;C++)for(var n=1;n<=this.canvas_size;n++,b++){var k=l[x][C][i+"_"+n];k&&(y[b*4+0]=parseInt(k.substring(1,3),16),y[b*4+1]=parseInt(k.substring(3,5),16),y[b*4+2]=parseInt(k.substring(5,7),16),y[b*4+3]=parseInt(k.substring(7,9),16))}a.putImageData(_,0,0);var A=r.toDataURL("image/png");A.indexOf("image/png")>0&&(document.getElementById("aaa").src=A)}},move_pixel(r,t){if(r!=0){var d={};if(r==-1)for(var o=2;o<=this.canvas_size;o++)for(var e=1;e<=this.canvas_size;e++)this.current_data.hasOwnProperty(o+"_"+e)&&(d[o-1+"_"+e]=this.current_data[o+"_"+e]);else{console.log(this.canvas_size-1);for(var o=this.canvas_size-1;o>0;o--)for(var e=1;e<=this.canvas_size;e++)this.current_data.hasOwnProperty(o+"_"+e)&&(d[o+1+"_"+e]=this.current_data[o+"_"+e])}this.current_data=d}if(t!=0){var d={};if(t==-1)for(var o=1;o<=this.canvas_size;o++)for(var e=2;e<=this.canvas_size;e++)this.current_data.hasOwnProperty(o+"_"+e)&&(d[o+"_"+(e-1)]=this.current_data[o+"_"+e]);else{console.log(this.canvas_size-1);for(var o=1;o<=this.canvas_size;o++)for(var e=this.canvas_size-1;e>0;e--)this.current_data.hasOwnProperty(o+"_"+e)&&(d[o+"_"+(e+1)]=this.current_data[o+"_"+e])}this.current_data=d}},move_to(r,t){if(!this.playing)if(t==-1){if(r==0)return;t=r-1;let d={...this.save_data[r]},o={...this.save_data[t]};this.save_data[r]=o,this.save_data[t]=d}else{if(this.save_data.length-1==r)return;t=r+1;let d={...this.save_data[r]},o={...this.save_data[t]};this.save_data[r]=o,this.save_data[t]=d}},go_frame(r){this.playing||(this.current_backup_idx==-1?(this.current_backup_idx=r,this.current_backup={...this.current_data},this.current_data={...this.save_data[r]}):this.current_backup_idx==r?(this.current_backup_idx=-1,this.current_data={...this.current_backup},this.current_backup=null):(this.current_backup_idx=r,this.current_data={...this.save_data[r]}))},saveData(){this.playing||(this.current_backup_idx==-1?this.save_data.push({...this.current_data}):this.save_data[this.current_backup_idx]={...this.current_data})},delete_frame(r){if(!this.playing&&this.current_backup_idx>-1){let t=[];t.push(...this.save_data.slice(0,this.current_backup_idx)),t.push(...this.save_data.slice(this.current_backup_idx+1)),this.save_data=t}},insert_frame(r){if(!this.playing)if(r==-1){let t=[];t.push(...this.save_data.slice(0,this.iii_frame)),t.push({...this.current_data}),t.push(...this.save_data.slice(this.iii_frame)),this.save_data=t}else{let t=[];t.push(...this.save_data.slice(0,this.iii_frame+1)),t.push({...this.current_data}),t.push(...this.save_data.slice(this.iii_frame+1)),this.save_data=t}},stop(){this.playing=!1},async play(){if(this.playing)return;this.playing=!0;let r={...this.current_data};for(let t=0;t<this.save_data.length&&(this.playing&&await this.wait(this.interval,this.save_data[t]),this.save_data.length-1==t&&(t=-1),!!this.playing);t++);this.current_data=r},wait(r,t){return new Promise(d=>{this.current_data=t,setTimeout(()=>{d()},r)})},setData(r){this.playing||(r==0?(this.current_data={},this.save_data=[],this.history=[{}],this.history_idx=0):(this.history_idx+=r,this.history_idx>-1&&this.history_idx<this.history.length?this.current_data={...this.history[this.history_idx]}:this.history_idx-=r))},color_apply(){this.color_pick="#"+parseInt(this.R).toString(16).padStart(2,"0")+parseInt(this.G).toString(16).padStart(2,"0")+parseInt(this.B).toString(16).padStart(2,"0"),this.color_backgroundColor=this.color_pick+parseInt(this.A).toString(16).padStart(2,"0"),this.color_backgroundColor=this.color_pick+parseInt(this.A).toString(16).padStart(2,"0")},createData(r,t){var d=canvas.toDataURL(t);return d.indexOf(t)>0?{type:r,value:d}:!1},color_pick_apply(){var r=this.color_pick;this.R=parseInt(r.substring(1,3),16),this.G=parseInt(r.substring(3,5),16),this.B=parseInt(r.substring(5,7),16);var t=parseInt(this.A);this.color_backgroundColor=r+t.toString(16).padStart(2,"0"),this.color_text=r+t.toString(16).padStart(2,"0")},drawFill(r,t,d,o){var e=this.canvas_size+1,l=[{row:0,col:-1},{row:0,col:1},{row:-1,col:0},{row:-1,col:-1},{row:-1,col:1},{row:1,col:0},{row:1,col:-1},{row:1,col:1}];l.forEach(i=>{var n=r+i.row,a=t+i.col;try{if(n==0||a==0||n==e||a==e)return;var _=this.current_data[n+"_"+a];if(_==o)return;d==_&&(this.current_data[n+"_"+a]=o,this.drawFill(parseInt(n),parseInt(a),d,o))}catch{}})},draw(r,t){if(!this.playing)if(t=="fill"){var d=this.current_data[r.getAttribute("row")+"_"+r.getAttribute("col")];this.current_data[r.getAttribute("row")+"_"+r.getAttribute("col")]=this.color_backgroundColor;var o=this.current_data[r.getAttribute("row")+"_"+r.getAttribute("col")];if(d==o)return;var e=r.getAttribute("row"),l=r.getAttribute("col");this.current_data[r.getAttribute("row")+"_"+r.getAttribute("col")]=o,this.drawFill(parseInt(e),parseInt(l),d,o),this.backup()}else t=="draw"?this.current_data[r.getAttribute("row")+"_"+r.getAttribute("col")]=this.color_backgroundColor:this.current_data[r.getAttribute("row")+"_"+r.getAttribute("col")]=""},mousedown(r,t){this.playing||(this.mode=="fill"?this.draw(t,"fill"):(this.clicking=!0,this.current_data[t.getAttribute("row")+"_"+t.getAttribute("col")]=this.mode==="eraser"?"":this.color_backgroundColor))},mouseout(r){r.style.boxShadow=""},mouseover(r,t){this.playing||(t.style.boxShadow="2px 2px inset",this.clicking&&(r.shiftKey?this.mode=="draw"?this.draw(t,"eraser"):this.draw(t,"draw"):this.draw(t,this.mode)))},mouseup(){this.clicking&&this.backup(),this.clicking=!1},backup(){this.history=this.history.slice(0,this.history_idx+1),this.history.push({...this.current_data}),this.history_idx=this.history.length-1}}},B={style:{"background-color":"#ffffff",color:"#000000"}},D={style:{"padding-left":"15px"}},R={style:{"padding-left":"20px"}},T=["value"],F={style:{"padding-left":"20px"}},E=["value"],O={style:{display:"grid","grid-template-columns":"30px auto 1fr auto 30px",gap:"20px"}},P=s("div",null,null,-1),L={style:{display:"grid"}},N=M('<option value="8">8 x 8</option><option value="16">16 x 16</option><option value="24" selected>24 x 24</option><option value="32">32 x 32</option><option value="48">48 x 48</option>',5),q=[N],K={style:{display:"grid","grid-template-columns":"1fr 1fr"}},H=M('<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:0px;width:fit-content;border:1px solid;position:absolute;"><div style="width:20px;height:20px;background:rgb(230, 230, 230);"></div><div style="width:20px;height:20px;background:rgb(255, 255, 255);"></div><div style="width:20px;height:20px;background:rgb(230, 230, 230);"></div><div style="width:20px;height:20px;background:rgb(255, 255, 255);"></div><div style="width:20px;height:20px;background:rgb(255, 255, 255);"></div><div style="width:20px;height:20px;background:rgb(230, 230, 230);"></div><div style="width:20px;height:20px;background:rgb(255, 255, 255);"></div><div style="width:20px;height:20px;background:rgb(230, 230, 230);"></div><div style="width:20px;height:20px;background:rgb(230, 230, 230);"></div><div style="width:20px;height:20px;background:rgb(255, 255, 255);"></div><div style="width:20px;height:20px;background:rgb(230, 230, 230);"></div><div style="width:20px;height:20px;background:rgb(255, 255, 255);"></div><div style="width:20px;height:20px;background:rgb(255, 255, 255);"></div><div style="width:20px;height:20px;background:rgb(230, 230, 230);"></div><div style="width:20px;height:20px;background:rgb(255, 255, 255);"></div><div style="width:20px;height:20px;background:rgb(230, 230, 230);"></div></div>',1),J={style:{display:"grid","grid-gap":"10px","grid-template-columns":"auto 1fr"}},Q=s("span",null,"R",-1),W=s("span",null,"G",-1),X=s("span",null,"B",-1),Y=s("span",null,"A",-1),Z={style:{width:"fit-content",border:"1px solid",padding:"20px"}},j={style:{}},$=["row","col"],tt=["row","col"],et=["row","col"],it={style:{display:"flex","flex-wrap":"wrap",gap:"20px"}},rt=["onClick"],st=["onClick"],nt=["row","col","onClick"],at=s("div",{style:{"background-color":"#ffffff",padding:"50px"}},[s("img",{src:"",id:"aaa",style:{border:"1px solid"}})],-1);function ot(r,t,d,o,e,l){return p(),u(v,null,[s("div",B,[s("div",D,[s("button",{onClick:t[0]||(t[0]=i=>e.mode="draw"),class:m({enable:e.mode=="draw"})},"칠하기",2),s("button",{onClick:t[1]||(t[1]=i=>e.mode="eraser"),class:m({enable:e.mode=="eraser"})},"지우기",2),s("button",{onClick:t[2]||(t[2]=i=>e.mode="fill"),class:m({enable:e.mode=="fill"})},"채우기",2),s("button",{onClick:t[3]||(t[3]=i=>e.current_data={})},"도화지 초기화"),s("button",{onClick:t[4]||(t[4]=i=>l.setData(-1))},"실행취소"),s("button",{onClick:t[5]||(t[5]=i=>l.setData(1))},"다시실행"),s("button",{onClick:t[6]||(t[6]=i=>l.setData(0))},"초기화"),s("button",{onClick:t[7]||(t[7]=i=>l.saveData())},"저장")]),s("div",R,[c(s("select",{"onUpdate:modelValue":t[8]||(t[8]=i=>e.iii_frame=i)},[(p(!0),u(v,null,h(e.save_data,(i,n)=>(p(),u("option",{key:n,value:n},I(n),9,T))),128))],512),[[z,e.iii_frame]]),w("프레임 "),s("button",{onClick:t[9]||(t[9]=i=>l.insert_frame(-1))},"이전에 추가"),s("button",{onClick:t[10]||(t[10]=i=>l.insert_frame(1))},"이후에 추가"),s("button",{onClick:t[11]||(t[11]=i=>l.delete_frame())},"선택한 프레임 삭제")]),s("div",F,[c(s("select",{"onUpdate:modelValue":t[12]||(t[12]=i=>e.interval=i)},[(p(!0),u(v,null,h(e.intervals,i=>(p(),u("option",{key:i,value:i},I(i),9,E))),128))],512),[[z,e.interval]]),w("초 간격으로 "),s("button",{onClick:t[13]||(t[13]=i=>l.play())},"Play"),s("button",{onClick:t[14]||(t[14]=i=>l.stop())},"Stop"),s("button",{onClick:t[15]||(t[15]=i=>l.export_png())},"Export"),c(s("input",{type:"checkbox","onUpdate:modelValue":t[16]||(t[16]=i=>e.prev_frame=i)},null,512),[[G,e.prev_frame]]),w(" 이전 프레임 보기 "),c(s("input",{type:"range",min:"0",max:"1",step:"0.1","onUpdate:modelValue":t[17]||(t[17]=i=>e.prev_frame_opacity=i)},null,512),[[f,e.prev_frame_opacity]])]),s("div",O,[P,s("div",null,[s("div",L,[c(s("select",{id:"canvas_size","onUpdate:modelValue":t[18]||(t[18]=i=>e.canvas_size=i),style:{"font-size":"20px"}},q,512),[[z,e.canvas_size]]),c(s("input",{type:"text","onUpdate:modelValue":t[19]||(t[19]=i=>e.color_backgroundColor=i),style:{width:"inherit"}},null,512),[[f,e.color_backgroundColor]]),s("div",K,[H,c(s("input",{type:"color","onUpdate:modelValue":t[20]||(t[20]=i=>e.color_pick=i),onInput:t[21]||(t[21]=i=>e.color_pick=i.target.value),style:g({opacity:e.A*100/255*.01})},null,36),[[f,e.color_pick]])]),s("div",J,[Q,c(s("input",{type:"range",min:"0",max:"255","onUpdate:modelValue":t[22]||(t[22]=i=>e.R=i),onInput:t[23]||(t[23]=i=>e.R=i.target.value)},null,544),[[f,e.R]]),W,c(s("input",{type:"range",min:"0",max:"255","onUpdate:modelValue":t[24]||(t[24]=i=>e.G=i),onInput:t[25]||(t[25]=i=>e.G=i.target.value)},null,544),[[f,e.G]]),X,c(s("input",{type:"range",min:"0",max:"255","onUpdate:modelValue":t[26]||(t[26]=i=>e.B=i),onInput:t[27]||(t[27]=i=>e.B=i.target.value)},null,544),[[f,e.B]]),Y,c(s("input",{type:"range",min:"0",max:"255","onUpdate:modelValue":t[28]||(t[28]=i=>e.A=i),onInput:t[29]||(t[29]=i=>e.A=i.target.value)},null,544),[[f,e.A]])])])]),s("div",null,[s("div",Z,[s("div",j,[s("div",{style:g({display:"grid",gridTemplateColumns:"1fr ".repeat(e.canvas_size),gridGap:"0px",width:"fit-content",border:"1px solid",position:"absolute"})},[(p(!0),u(v,null,h(parseInt(e.canvas_size),i=>(p(),u(v,{key:i},[(p(!0),u(v,null,h(parseInt(e.canvas_size),n=>(p(),u("div",{key:n,style:g({width:"10px",height:"10px",background:e.bg[(i%2+n%2)%2]})},null,4))),128))],64))),128))],4),e.current_backup_idx>0&&e.prev_frame&&!e.playing&&e.save_data.length>0?(p(),u("div",{key:0,style:g({display:"grid",gridTemplateColumns:"1fr ".repeat(e.canvas_size),gridGap:"0px",width:"fit-content",border:"1px solid",position:"absolute",opacity:parseFloat(e.prev_frame_opacity)})},[(p(!0),u(v,null,h(parseInt(e.canvas_size),i=>(p(),u(v,{key:i},[(p(!0),u(v,null,h(parseInt(e.canvas_size),n=>(p(),u("div",{key:n,row:i,col:n,style:g({width:"10px",height:"10px",background:e.save_data[e.current_backup_idx-1][i+"_"+n]?e.save_data[e.current_backup_idx-1][i+"_"+n]:""}),onMousedown:t[30]||(t[30]=a=>l.mousedown(a,a.target)),onMouseover:t[31]||(t[31]=a=>l.mouseover(a,a.target)),onMouseout:t[32]||(t[32]=a=>l.mouseout(a.target))},null,44,$))),128))],64))),128))],4)):S("",!0),e.current_backup_idx==-1&&e.prev_frame&&!e.playing&&e.save_data.length>0?(p(),u("div",{key:1,style:g({display:"grid",gridTemplateColumns:"1fr ".repeat(e.canvas_size),gridGap:"0px",width:"fit-content",border:"1px solid",position:"absolute",opacity:parseFloat(e.prev_frame_opacity)})},[(p(!0),u(v,null,h(parseInt(e.canvas_size),i=>(p(),u(v,{key:i},[(p(!0),u(v,null,h(parseInt(e.canvas_size),n=>(p(),u("div",{key:n,row:i,col:n,style:g({width:"10px",height:"10px",background:e.save_data[e.save_data.length-1][i+"_"+n]?e.save_data[e.save_data.length-1][i+"_"+n]:""}),onMousedown:t[33]||(t[33]=a=>l.mousedown(a,a.target)),onMouseover:t[34]||(t[34]=a=>l.mouseover(a,a.target)),onMouseout:t[35]||(t[35]=a=>l.mouseout(a.target))},null,44,tt))),128))],64))),128))],4)):S("",!0),s("div",{style:g({display:"grid",gridTemplateColumns:"1fr ".repeat(e.canvas_size),gridGap:"0px",width:"fit-content",border:"1px solid",position:"relative"})},[(p(!0),u(v,null,h(parseInt(e.canvas_size),i=>(p(),u(v,{key:i},[(p(!0),u(v,null,h(parseInt(e.canvas_size),n=>(p(),u("div",{key:n,row:i,col:n,style:g({width:"10px",height:"10px",background:e.current_data[i+"_"+n]?e.current_data[i+"_"+n]:""}),onMousedown:t[36]||(t[36]=a=>l.mousedown(a,a.target)),onMouseover:t[37]||(t[37]=a=>l.mouseover(a,a.target)),onMouseout:t[38]||(t[38]=a=>l.mouseout(a.target))},null,44,et))),128))],64))),128))],4)]),s("button",{onClick:t[39]||(t[39]=i=>l.move_pixel(-1,0))},"상"),s("button",{onClick:t[40]||(t[40]=i=>l.move_pixel(1,0))},"하"),s("button",{onClick:t[41]||(t[41]=i=>l.move_pixel(0,-1))},"좌"),s("button",{onClick:t[42]||(t[42]=i=>l.move_pixel(0,1))},"우")])]),s("div",it,[(p(!0),u(v,null,h(e.save_data,(i,n)=>(p(),u("div",{key:n},[w(I(n)+" ",1),s("button",{onClick:a=>l.move_to(n,-1)},"이전",8,rt),s("button",{onClick:a=>l.move_to(n,1)},"다음",8,st),s("div",{class:m({outline:!0,bold:e.current_backup_idx==n}),style:g({display:"grid",gridTemplateColumns:"1fr ".repeat(e.canvas_size),gridGap:"0px",position:"absolute"})},[(p(!0),u(v,null,h(parseInt(e.canvas_size),a=>(p(),u(v,{key:a},[(p(!0),u(v,null,h(parseInt(e.canvas_size),_=>(p(),u("div",{key:_,style:g({width:"5px",height:"5px",background:e.bg[(a%2+_%2)%2]})},null,4))),128))],64))),128))],6),s("div",{class:m({outline:!0,bold:e.current_backup_idx==n}),style:g({display:"grid",gridTemplateColumns:"1fr ".repeat(e.canvas_size),gridGap:"0px",width:"fit-content",position:"relative"})},[(p(!0),u(v,null,h(parseInt(e.canvas_size),a=>(p(),u(v,{key:a},[(p(!0),u(v,null,h(parseInt(e.canvas_size),_=>(p(),u("div",{key:_,row:a,col:_,style:g({width:"5px",height:"5px",background:i[a+"_"+_]?i[a+"_"+_]:e.bg[(a%2+_%2)%2]}),onClick:y=>l.go_frame(n)},null,12,nt))),128))],64))),128))],6)]))),128))])])]),at],64)}const ut=V(U,[["render",ot]]);export{ut as default};