// options
var OPT = {
    IMG_URL: "/resources/images/",
    FONT_URL: "/resources/fonts/",
    NO_OF_FRAMES: 25,
    NEXT_DELAY: 70,
    CANVAS_W: 144,
    CANVAS_H: 168
}

var rocky = Rocky.bindCanvas(document.getElementById("pebble"));
rocky.export_global_c_symbols();
rocky.update_proc = function (ctx, bounds) {

    //time 
    var date = new Date;
    var tm_hour = date.getHours();
    var tm_min = date.getMinutes();

    //background
    graphics_context_set_fill_color(ctx, GColorBlack);
    graphics_fill_rect(ctx, [0, 0, OPT.CANVAS_W, OPT.CANVAS_H]);

    // text
    graphics_context_set_text_color(ctx, GColorWhite);
    graphics_draw_text(ctx, (tm_hour < 10 ? '0' : '') + tm_hour.toString(), font, [0, 20, 144, 80], GTextOverflowModeWordWrap, GTextAlignmentCenter);
    graphics_draw_text(ctx, (tm_min < 10 ? '0' : '') + tm_min.toString(), font, [0, 90, 144, 160], GTextOverflowModeWordWrap, GTextAlignmentCenter);
    
    //rendering effectes
    effectHub.renderEffects(ctx);
};

//defining param for mask effect
var eMask = {
    text: null,
    bitmap_mask: null,
    mask_colors: [GColorWhite],
    background_color: null,
    bitmap_background_info: null
}


 // loading bitmap infos of animation frames
var bitmap_infos = new Array(OPT.NO_OF_FRAMES);
var img_url;
for (i = 1; i <= OPT.NO_OF_FRAMES; i++) {
    img_url = location.href.substring(0, location.href.lastIndexOf("/")) + OPT.IMG_URL + 'frame-0' + (i < 10 ? '0' : '') + i + '.png';
    Effects.gbitmap_get_data(img_url, function (bitmap_info, arr_index) {
        bitmap_infos[arr_index] = bitmap_info;
    }, i - 1);
 }

//loading font
var font_url = location.href.substring(0, location.href.lastIndexOf("/")) + OPT.FONT_URL + 'Futura_Extra_Bold.ttf;
var font = rocky.fonts_load_custom_font({ height: 50, url: font_url });

 //initializing effects
 var effectHub = Effects.getEffectHub(rocky, OPT.CANVAS_W, OPT.CANVAS_H);
 effectHub.addEffect(Effects.EFFECT_MASK, { x: 0, y: 0, w: OPT.CANVAS_W, h: OPT.CANVAS_H }, eMask);

 //current frame no
 var frame_no = 0;

 setInterval(function () {
     eMask.bitmap_background_info = bitmap_infos[frame_no];
     rocky.mark_dirty();
     frame_no++;
     if (frame_no == OPT.NO_OF_FRAMES) frame_no = 0;
}, OPT.NEXT_DELAY);

