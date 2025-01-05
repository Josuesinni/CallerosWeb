//Flechas para modificar la fecha
$(".date-left").hover(function() {
    $(this).removeClass("bi-caret-left");
    $(this).addClass("bi-caret-left-fill");
}, function() {
    $(this).removeClass("bi-caret-left-fill");
    $(this).addClass("bi-caret-left");
});

$(".date-right").hover(function() {
    $(this).removeClass("bi-caret-right");
    $(this).addClass("bi-caret-right-fill");
}, function() {
    $(this).removeClass("bi-caret-right-fill");
    $(this).addClass("bi-caret-right");
});