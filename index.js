
function click_btn(id){
    var button = document.getElementById(id)
    document.getElementById("temp").innerHTML = button.innerHTML
}

function disable_btn(num, player, color){
    var grid_elem = document.getElementById("game_id").children;
    for(var idx = 0; idx<grid_elem.length; idx++){
        if(grid_elem[idx].innerHTML == num){
            grid_elem[idx].disabled = true;
            grid_elem[idx].style.backgroundColor = color
            if(document.getElementById(player + "_grid").innerHTML){
                document.getElementById(player + "_grid").innerHTML = document.getElementById(player + "_grid").innerHTML + "," + num
            }
            else{
                document.getElementById(player + "_grid").innerHTML = num
            }
        }
    }
}

class CreateLayout{
    constructor(target_score, target_time, player_1_name, player_2_name, player_timer, grid_rows, grid_cols){
        this.target_score = target_score
        this.target_time = target_time
        this.player_1_name = player_1_name.toUpperCase()
        this.player_2_name = player_2_name.toUpperCase()
        this.player_timmer = player_timer
        this.grid_rows = grid_rows
        this.grid_cols = grid_cols
    }

    create_layout(){
        this.create_score_and_timmer_section("target", this.target_score, this.target_time)
        this.create_player(1, this.player_1_name, 0, this.player_timmer)
        this.create_player(2, this.player_2_name, 0, this.player_timmer)
        this.create_grid(this.grid_rows, this.grid_cols)
    }

    create_score_and_timmer_section(section, score, timmer_value){
        document.getElementById(section + "_score").innerHTML = score
        document.getElementById(section + "_timmer").innerHTML = timmer_value
        return this
    }

    create_player(player_num, player_name, player_score, timmer_value){
        document.getElementById("player_"+player_num).innerHTML = player_name
        return this.create_score_and_timmer_section("player_"+player_num, player_score, timmer_value)
    }

    shuffle_array(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array
    }

    create_grid(rows, cols){
        var grid_values = this.shuffle_array([ ...Array(rows*cols).keys() ].map( i => i+1));
        for(var i = 0; i< rows*cols; i++){
                var button = document.createElement("button")
                button.id = ""+i
                button.innerHTML = grid_values[i]
                button.className = "grid_item"
                button.setAttribute("onClick", "click_btn(this.id)")
                document.getElementById("game_id").appendChild(button)
        }
    }
}


class Clock{
    constructor(element_id, secs){
        this.elem = document.getElementById(element_id + "_timmer")
        this.secs = secs
        this.set_timmer()
    }

    set_timmer(){
        this.elem.innerHTML = this.secs
    }

    run_down_clock(clock_obj){
        clock_obj.set_timmer();
        var intv = setInterval(clock_obj.dec_timmer, 1000, clock_obj.elem);
        setTimeout(() => {
            clearInterval(intv);
        }, clock_obj.secs*1000)
    }

    dec_timmer(elem){
        elem.innerHTML = parseInt(elem.innerHTML) - 1;
    }
}

class Player extends Clock{
    constructor(player_num, player_intv, color){
        super("player_" + player_num, player_intv)
        this.player = "player_" + player_num
        this.player_intv = player_intv
        this.player_score = document.getElementById(this.player + "_score")
        this.timmer = document.getElementById(this.player + "_timmer")
        this.player_color = color
    }

    update_score(player_obj){
        var add_value = document.getElementById("temp").innerHTML
        disable_btn(add_value, this.player,this.player_color)
        player_obj.player_score.innerHTML =  parseInt(player_obj.player_score.innerHTML)+ parseInt(add_value)
        document.getElementById("temp").innerHTML = 0
    }
}

class Game{
    constructor(total_time, player_time, target_score){
        this.total_time = total_time
        this.player_time = player_time
        this.target_score = target_score
    }

    create_engine(){
        var ply_1_name = window.prompt("Enter player 1's name:") || "player_1"
        var ply_2_name = window.prompt("Enter player 2's name:") || "player_2"
        var create_layout_obj = new CreateLayout(this.target_score, this.total_time, ply_1_name, ply_2_name, this.player_time, 7, 7)
        create_layout_obj.create_layout()
        return this
    }

    start_game_loop(){
        var  player_queue = [new Player(1, this.player_time, "lightgreen"), new Player(2, this.player_time, "lightblue")]
        var target_clock = new Clock("target", this.total_time)
        target_clock.run_down_clock(target_clock)
        var player = player_queue.shift()
        player.run_down_clock(player)
        var intv_obj = setInterval(() => {
            player.update_score(player)
            player_queue.push(player)
            player = player_queue.shift()
            player.run_down_clock(player)
        }, this.player_time*1000)
        setTimeout(() =>{
            clearInterval(intv_obj)
            this.judge_game()
        }, this.total_time*1000)
    }

    judge_game(){
        var sc1 = parseInt(document.getElementById("player_1_score").innerHTML)
        var sc2 = parseInt(document.getElementById("player_2_score").innerHTML)
        var trg = parseInt(document.getElementById("target_score").innerHTML)
        var player_1 = document.getElementById("player_1").innerHTML
        var player_2 = document.getElementById("player_2").innerHTML
        if(sc1 < trg && sc2 < trg){
            if(trg-sc1 < trg - sc2){
                alert(player_1 + " wins")
            }
            else{
                alert(player_2 + " wins")
            }
        }
        else if (sc1 <= trg && sc2 > trg){
            alert(player_1 + " wins")
        }
        else if (sc1 > trg && sc2 <= trg){
            alert(player_2 + " wins")
        }
        else{
            alert("No one Wins")
        }
        location.reload()
    }
}

game  = new Game(31, 5, 60)
game.create_engine().start_game_loop()
