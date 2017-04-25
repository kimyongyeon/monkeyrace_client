/* tabContainer */
$(function () {
    $(".tab_content").hide();
    $(".tab_content:first").show();
    $(".tabs_nav li a").click(function () {
        $(".tab_content").hide()
        var activeTab = $(this).attr("rel");
        $("#" + activeTab).show()
    });

    $(".subtab_content").hide();
    $(".subtab_content:first").show();
    $(".subtabs_nav li a").click(function () {
        $(".subtab_content").hide()
        var activeTab = $(this).attr("rel");
        $("#" + activeTab).show()
    });

	tab('#tab',0);	
	tab('#subtab',0);	
});

function tab(e, num){
    var num = num || 0;
    var menu = $(e).children();
    var con = $(e+'_con').children();
    var select = $(menu).eq(num);
    var i = num;

    select.addClass('on');
    con.eq(num).show();

    menu.click(function(){
        if(select!==null){
            select.removeClass("on");
            con.eq(i).hide();
        }

        select = $(this);	
        i = $(this).index();

        select.addClass('on');
        con.eq(i).show();
    });
}
/* buttom click */
$(document).ready(function(){
	$(".eh_choice02 .img_evenClick").click(function(){
		$(".even_checkd > img").show();
		$(".hole_checkd > img").hide();
	});
	$(".eh_choice02 .img_holeClick").click(function(){
		$(".hole_checkd > img").show();
		$(".even_checkd > img").hide();
	});
	
	$(".eh_choice03 .imgClick_red").click(function(){
		$(".checkd_red > img").show();
		$(".checkd_green > img, .checkd_purple > img").hide();
	});
	$(".eh_choice03 .imgClick_green").click(function(){
		$(".checkd_green > img").show();
		$(".checkd_red > img, .checkd_purple > img").hide();
	});
	$(".eh_choice03 .imgClick_purple").click(function(){
		$(".checkd_purple > img").show();
		$(".checkd_red > img, .checkd_green > img").hide();
	});
	
	$(".eh_choice04 .imgClick_red").click(function(){
		$(".checkd_red > img").show();
		$(".checkd_yellow > img, .checkd_green > img,  .checkd_purple > img").hide();
	});
	$(".eh_choice04 .imgClick_yellow").click(function(){
		$(".checkd_yellow > img").show();
		$(".checkd_red > img, .checkd_green > img, .checkd_purple > img").hide();
	});
	$(".eh_choice04 .imgClick_green").click(function(){
		$(".checkd_green > img").show();
		$(".checkd_red > img, .checkd_yellow > img, .checkd_purple > img").hide();
	});
	$(".eh_choice04 .imgClick_purple").click(function(){
		$(".checkd_purple > img").show();
		$(".checkd_red > img, .checkd_yellow > img, .checkd_green > img").hide();
	});
});