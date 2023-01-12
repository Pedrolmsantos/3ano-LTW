const $ = (id) => document.getElementById(id);
var ply1 = [];
var ply2 = [];
let a1;
let a2;
let smt;
let cav;
let turn;
let x;
let data;
let idgrupo = "6274707746";
let url = "http://twserver.alunos.dcc.fc.up.pt:8008/"; // 8008
//let url = "http://localhost:9102/";
let psw="";
let nick="";
let games;
let players;
let p1;
let p2;
let flag=0;
function login_bt() {
  let a = $('lgbt');
  if(a.innerText !== "Logout"){
    document.getElementById("myForm").style.display = "block";
  }else{
    reset();
    if(games!=null){
      leave();
    }
    nick = "";
    psw = "";
    a.innerText="Fazer Login";
    document.getElementById("myForm").style.display = "none";
  }
}
function closeForm() {
  document.getElementById("myForm").style.display = "none";
}
function openNav() {
  document.getElementById("myNav").style.width = "100%";
  document.getElementById("myForm").style.display = "none";
}
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}
function closeRank() {
  document.getElementById("RankNav").style.width = "0%";
}
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
function get_cvc(i){
  switch (i) {
    case 0: return $('c0');
    case 1: return $('c1');
    case 2: return $('c2');
    case 3: return $('c3');
    case 4: return $('c4');
    case 5: return $('c5');
    case 6: return $('c6');
    default: alert('error');
      break;
  }
}
function get_cvb(i){
  switch (i) {
    case 0: return $('b0');
    case 1: return $('b1');
    case 2: return $('b2');
    case 3: return $('b3');
    case 4: return $('b4');
    case 5: return $('b5');
    case 6: return $('b6');
    default: alert('error');
      break;
  }
}
function get_rnk(i){
  switch (i) {
    case 0: return $('r0');
    case 1: return $('r1');
    case 2: return $('r2');
    case 3: return $('r3');
    case 4: return $('r4');
    case 5: return $('r5');
    case 6: return $('r6');
    case 7: return $('r7');
    case 8: return $('r8');
    case 9: return $('r9');
    case 10: return $('r10');
    default: alert('error');
      break;
  }
}
function R_equest(type, object) {
  if (!XMLHttpRequest) {
    alert('XHR não é suportado');
    return;
  }
  const xhr = new XMLHttpRequest();
  const link = url + type;
  xhr.open('POST', link, false);
  xhr.onreadystatechange = function () {
    if (xhr.responseText === '{"error":"User registered with a different password"}') {
      alert('Palavra-passe incorreta');
      flag=1;
    }
    if (xhr.readyState === 4 && xhr.status === 200) {
      data = JSON.parse(xhr.responseText);
      //alert(data);
      console.log(data);
    }
  }
  xhr.send(JSON.stringify(object));
}
function ranking(){
  document.getElementById("RankNav").style.width = "100%";
  document.getElementById("myForm").style.display = "none";
  let parent = $('rkli');
  R_equest("ranking",{});
  let r = data.ranking;
  for(let i=0;i<10;i++){
    if(get_rnk(i)!=null) get_rnk(i).remove();
    let rk = document.createElement("li");
    rk.setAttribute("href","#");
    rk.setAttribute("id","r"+i);
    rk.innerText = "Player: " + r[i].nick + " --{ " + r[i].victories + " Victories }--{" + r[i].games + " Games }";
    parent.appendChild(rk);
  }
}
function register(){
    nick = $('lg_nick').value;
    psw = $('lg_pw').value;
    let user = {
      nick : nick,
      password: psw,
    };
    R_equest("register",user);
    let a = $('lgbt');
    if(flag===0){
      a.innerText="Logout";
      document.getElementById("myForm").style.display = "none";
    }else{
      nick = "";
      psw = "";
      label.innerText = "";
      a.innerText="Fazer Login";
      document.getElementById("myForm").style.display = "none";
      flag=0;
    }
}
function join(seed,cvd){
  let jvar = {
    group : idgrupo,
    nick: nick,
    password : psw,
    size : cvd,
    initial : seed,
  };
  R_equest("join",jvar);
  games=data.game;

}
function leave(){
  let lv = {
    group : idgrupo,
    nick: nick,
    password : psw,
  };
  R_equest("join",lv);
}
function notify(jgd){
  const url2 = "update?nick="+nick+"&game="+games;
  const link = url + url2;
  const eventSource = new EventSource(link);
  eventSource.onmessage = function(event) {
    data = JSON.parse(event.data);
    console.log(data);
    players = Object.keys(data.board.sides);
    if(players[1]===nick){
      p2=players[1];
      p1 = players[0];
    }else{
      p1=players[1];
      p2 = players[0];
    }
    for(let i=0;i<cav;i++){
      ply2[i] = data.board.sides[p2].pits[i];
      ply1[i] = data.board.sides[p1].pits[i];
    }
    a2 = data.board.sides[p2].store;
    a1 = data.board.sides[p1].store;
    if(data.winner!=null){
      let wn = data.winner;
      alert('WINNER: ' + wn);
      leave();
    }
    let label = $('turn');
    label.innerText = "Turn: " + data.board.turn;
    update_board();
  }
  let jgdvar = {
    nick: nick,
    password : psw,
    game : games,
    move: parseInt(jgd),
  };
  R_equest("notify",jgdvar);
}
function update(){

}
function cavity(cv1) {
  cav = cv1;
    var parent1 = $('cima');
    var parent2 = $('baixo');
    console.log(parent1);
    let aux = cv1;
    for(let i = 1;i<=cv1;i++){
      let cavc = document.createElement("div");
      let cavb = document.createElement("div");
      cavc.setAttribute("class","pit");
      cavb.setAttribute("class","pit");
      cavc.setAttribute("id","c" + (aux-1));
      cavb.setAttribute("id","b" + (i-1));
      parent1.appendChild(cavc);
      parent2.appendChild(cavb);
      cavc.addEventListener('click',(evento) => {
        // x=1;
        // jogo(i-1,0);
        // update_board();
      });
      cavb.addEventListener('click',(evento) => {
        if($('online').checked){
          notify(i-1);
        }else {
          if (turn === 1) {
            x = 1;
            jogo(i - 1, 1);
            update_board();
          } else {
            alert('Not your turn');
          }
        }
      });
      aux--;
    }
}
function se_update(allCavities, numSeeds){
  allCavities.innerHTML = '<span class="circle" ></span>'.repeat(numSeeds);
}
function update_board(){
  se_update($('a1'),a1);
  se_update($('a2'),a2);
  let j=cav-1;
  for(let i =0;i<cav;i++){
    let cavc = get_cvc(i);
    let cavb = get_cvb(i);
    se_update(cavc,ply1[i]);
    se_update(cavb,ply2[i]);
    /*cavc.innerText = ply1[i];
    cavb.innerText = ply2[i];
    j--;*/
  }
}
function reset(){
  a1 = 0;
  a2 = 0;
  se_update($('a1'),a1);
  se_update($('a2'),a2);
  for(let i = 0; i<cav;i++){
    let cavc = get_cvc(i);
    let cavb = get_cvb(i);
    if(cavc!= null){
      cavc.remove();
    }
    if(cavb !=null) {
      cavb.remove();
    }
  }
  while(ply1.length){
    ply1.pop();
    ply2.pop();
  }
}
function seeds(nr){
  smt = nr;
  const allCavities = document.querySelectorAll('.pit');
  const numSeeds = smt;
  const seeds = '<span class="circle" ></span>'.repeat(numSeeds);
  allCavities.forEach(cavity => {
    cavity.innerHTML = seeds;
  });
}
function bot_play(){
  let max=0;
  let index;
  for(let i=0;i<cav;i++){
    if(ply1[i]>max){
      max=ply1[i];
      index=i;
    }
  }
  x=1;
  jogo(index,0);
  update_board();
  turn=1;
}
function check_winner(){
  let sum=0;
  for(let i=0;i<cav;i++){
    sum+=ply1[i];
  }
  if(sum === 0) {
    for (let i = 0; i < cav; i++) {
      a2 += ply2[i];
      ply2[i]=0;
    }
    if(a1>a2){
      alert('Computer Wins!');
    }else if(a1 === a2){
      alert('Draw!');
    }else{
      alert('You Win!');
    }
    update_board();
    turn = -1;
    return -1;
  }
  sum=0;
  for(let i=0;i<cav;i++){
    sum+=ply2[i];
  }
  if(sum === 0) {
    for (let i = 0; i < cav; i++) {
      a1 += ply1[i];
      ply1[i]=0;
    }
    if(a1>a2){
      alert('Computer Wins!');
    }else if(a1 === a2){
      alert('Draw!');
    }else{
      alert('You Win!');
    }
    update_board();
    turn = -1;
    return -1;
  }
  return 0;
}
function jogo(cv,plyr) {
  let y;
  let z = cv;
  let md=0;
  let flag;
  if(plyr === 0){
    y = Number(ply1[cv]);
    if(y===0) return;
    flag = 0;
  }else{
    y = Number(ply2[cv]);
    if(y===0) return;
    flag = 1;
  }
  for(let i = 0; i<= Number(y);i++){
    if(i===0){
      if(plyr === 0){
        ply1[cv] = 0;//cav-cv-1
      }else{
        ply2[cv] = 0;
      }
    }else{
      if(flag === 0){
        if(z===cav){
          if(x%2!==0) {
            if (plyr === 0) {
              a1++;
            } else {
              a2++;
            }
            z=0;
            if(flag === 0){ flag=1;
              md++;
            }else if(flag === 1){ flag=0;
              md++;
            }
            x++;
            continue;
          }else{
            z=0;
            if(flag === 0) {
              ply2[0] = ply2[0] + 1;
              md++;
              flag = 1;
            }
          }
          x++;
        }else{
          ply1[z] = ply1[z]+1;
        }
      }else{
        if(z===cav){
          if(x%2!==0) {
            if (plyr === 0) {
              a1++;
            } else {
              a2++;
            }
            z=0;
            if(flag === 0){ flag=1;
              md++;
            }else if(flag === 1){ flag=0;
              md++;
            }
            x++;
            continue;
          }else {
            if(flag === 1){
              ply1[0] = ply1[0]+1;
              flag=0;
              md++;
            }
            z=0;
          }
          x++;
        }else{
          ply2[z] = ply2[z]+1;
        }
      }
    }
    z++;
  }
  if(z === 0 && x%2===0) {
    if (plyr===0) {
      turn = 0;
      alert('Computador Joga Novamente!');
      bot_play();
      turn = 1;
    } else if(plyr===1){
      turn = 1;
      alert('Jogue Novamente!');
    }
  }else{
    if(plyr===flag && cv!==(z-1)){
      if(plyr===0){
        if(ply1[z-1]===1){
          a1+= 1+ply2[cav-(z-1)-1];
          ply1[z-1]=0;
          ply2[cav-(z-1)-1]=0;
        }
        if(turn===1){
          turn = 0;
          if(check_winner()===-1){
            return;
          }
          bot_play();
        }else{ turn =1; }
      }else{
        if(ply2[z-1]===1){
          a2+= 1+ply1[cav-(z-1)-1];
          ply2[z-1]=0;
          ply1[cav-(z-1)-1]=0;
        }
        if(turn===1){
          turn = 0;
          if(check_winner()===-1){
            return;
          }
          bot_play();
        }else{ turn =1; }
      }
    }else{
      if(turn===1){
        turn = 0;
        if(check_winner()===-1){
          return;
        }
        bot_play();
      }else{ turn =1; }
    }
  }
  if(check_winner()===-1){
    return;
  }
  console.log(ply1);
  console.log(ply2);
  console.log(a1);
  console.log(a2);
}
function float2int (value) {
  return value | 0;
}
function submeter() {
  //console.log(data);
  let label = $('turn');
  label.innerText = "";
  const cavidades = $('nrcavidades');
  const sementes = $('nrsementes');
  reset();
  x=1;
  a1 = 0;
  a2 = 0;
  switch (parseInt(cavidades.value)) {
    case 3: cavity(3);
      break;
    case 4: cavity(4);
      break;
    case 5: cavity(5);
      break;
    case 6: cavity(6);
      break;
    default: break;
  }
  switch (parseInt(sementes.value)) {
    case 3: seeds('3');
      break;
    case 4: seeds('4');
      break;
    case 5: seeds('5');
      break;
    case 6: seeds('6');
      break;
    default: break;
  }
  for(let i = 0;i< cav;i++){
    ply1[i] = Number(smt);
    ply2[i] = Number(smt);
  }
  if($('online').checked){
    turn =0;
    if(nick ===""){
      alert('Login First!');
    }else{
      join(parseInt(sementes.value),parseInt(cavidades.value));
    }
  }else{
    if($('me').checked){
      turn = 1;
    }else{
      turn = 0;
      bot_play();
    }
   /* let k = getRandomArbitrary(1,20);
    if(float2int(k)%2=== 1){
      alert('Your time to start');
      turn = 1;
    }else{
      alert('Computer is starting first!');
      turn = 0;
      bot_play();
    }*/
  }
  //cavity(cv);
  // jogo();

}
