"use strict";

b4w.register("example_main", function(exports, require) {

var m_anim  = require("animation");
var m_app   = require("app");
var m_main  = require("main");
var m_data  = require("data");
var m_scenes = require("scenes");
var m_ctl   = require("controls");
var m_objs = require("objects");
var m_phy   = require("physics");
var m_cons  = require("constraints");;
var m_trans = require("transform");
var m_cfg   = require("config");
var m_preloader = require("preloader");
var _previous_selected_obj = null;


var PRELOADING = true;

var _character;
var _character_outline;
var _character_rig;
var _text_space;

var _stopped_frame;
var _anim_state;

exports.init = function() {
    m_app.init({
        canvas_container_id: "canvas3d", 
        callback: init_cb,
        physics_enabled: false,
        alpha: false,
        background_color: [1.0, 1.0, 1.0, 0.0]
    });
}

function init_cb(canvas_elem, success) {

    if (!success) {
        console.log("b4w init failure");
        return;
    }

    m_app.enable_controls();
    
    if (PRELOADING)
    	m_preloader.create_simple_preloader({
            bg_color:"#00000000",
            bar_color:"#FFF",
            background_container_id: "background_image_container",
            canvas_container_id: "canvas3d",
            preloader_fadeout: false});


  
    canvas_elem.addEventListener("mousedown", main_canvas_click, false);
    window.onresize = on_resize;
    on_resize();
    load();
}
function preloader_cb(percentage) {
    m_preloader.update_preloader(percentage);
}


function load() {
	var p_cb = PRELOADING ? preloader_cb : null;
    m_data.load("test.json", load_cb,p_cb, true);
    
}

function load_cb(data_id) {
    m_app.enable_camera_controls();
    _character = m_scenes.get_object_by_name("oldman");
    _character_outline= m_scenes.get_object_by_name("oldman_outline");
    _text_space = m_scenes.get_object_by_name("Space");
	_character_rig = m_scenes.get_object_by_name("character_rig");
	
	m_scenes.hide_object(_character_outline);
    
    m_anim.apply(_character_rig, "idle_B4W_BAKED");
    m_anim.play(_character_rig);
    m_anim.set_behavior(_character_rig, m_anim.AB_CYCLIC);
    
    _anim_state=false;
    
    
    setup_colorvariation(); 
}


function setup_colorvariation(){
	
	var key_space = m_ctl.create_keyboard_sensor(m_ctl.KEY_SPACE);
	
	var colorchange_array = [key_space];
	var colorchange_logic = function(s) {return (s[0])};
	
	
	var colorchange_cb = function(obj, manifold_id, pulse) {
	
	
		if(pulse==1){
			var materialcolor_r = Math.random(0,1);
			var materialcolor_g = Math.random(0,1);
			var materialcolor_b = Math.random(0,1);
			
			m_objs.set_nodemat_rgb(_character,["MaterialOldMan", "RGB"], materialcolor_r, materialcolor_g ,materialcolor_b);
			m_objs.set_nodemat_rgb(_text_space,["MaterialSpace", "RGB"], materialcolor_r, materialcolor_g ,materialcolor_b);
				
		}
	}
	
	 m_ctl.create_sensor_manifold(_character, "COLOR", m_ctl.CT_TRIGGER,
        colorchange_array, colorchange_logic, colorchange_cb);
	
}


function main_canvas_click(e) {
 if (e.preventDefault)
        e.preventDefault();

    var x = e.clientX;
    var y = e.clientY;

    var obj = m_scenes.pick_object(x, y);

    if (obj) {
    	m_scenes.show_object(_character_outline);
    	outline();
    
        if (_anim_state==true){
            m_anim.set_frame(_character_rig,_stopped_frame);
            m_anim.play(_character_rig);
            m_anim.set_behavior(_character_rig, m_anim.AB_CYCLIC);
            _anim_state=false;
 			
       }else if (_anim_state==false){
        	m_anim.stop(_character_rig);
       	    _stopped_frame = m_anim.get_frame(_character_rig);
            _anim_state=true;
      }
    }
 }

function outline(){
	setTimeout(function(){
	m_scenes.hide_object(_character_outline);
	},200);

}	

function on_resize() {

    var w = window.innerWidth;
    var h = window.innerHeight;
    m_main.resize(w, h);

     var html = document.getElementsByTagName("html")[0];
    html.style.height = h.toString() + "px";
    html.style.width = w.toString() + "px";

    var bkg_img = document.getElementById("background_image_container");
    if (bkg_img) {
        bkg_img.style.height = h.toString() + "px";
        bkg_img.style.width = w.toString() + "px";
    }
    var preloader = document.getElementById("simple_preloader_container");
    if (preloader) {
        preloader.style.height = h.toString() + "px";
        preloader.style.width = w.toString() + "px";
    }

    var container = document.getElementById("container");

    container.style.width = (0.5 * h).toString() + "px";
    container.style.height = (0.6 * h).toString() + "px";
    container.style.top = (0.03 * h).toString() + "px";

}





});

b4w.require("example_main").init();

