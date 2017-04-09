$(document).ready(function() {

  

  $(".s_portfolio li").click(function(){
  $(".s_portfolio li").removeClass("active");
  $(this).addClass("active"); 
  });
   

  $(".popup").magnificPopup({type:"image"});
  $(".popup_content").magnificPopup({type:"inline",midClick:true });

$(".portfolio_item").each(function(i){
  $(this).find("a").attr("href","#work_"+i);
  $(this).find(".portf_descr").attr("id","work_"+i);

  });
 

            /*====================================
                 EASING PLUGIN SCRIPTS 
                ======================================*/
            $(function () {
                $('.move-me a').bind('click', function (event) { //just pass move-me in design and start scrolling
                    var $anchor = $(this);
                    $('html, body').stop().animate({
                        scrollTop: $($anchor.attr('href')).offset().top
                    }, 1000, 'easeInOutQuad');
                    event.preventDefault();
                });
            });
});
        

         
      
        