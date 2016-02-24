$("#playGround").droppable({
    drop: function () {
        if (game.checkWin()) {
            $("#win").dialog("open");
        }
    }
});

$(".Ts").draggable({
    drag: function () {

    }
});

$(function () {
    $("#welcome").dialog({
        modal: true,
        buttons: [{
            text: "Let's Go!",
            click: function () {
                $("#welcome").dialog("close");
            }
        }]
    });
    $("#win").dialog({
        autoOpen: false,
        modal: true,
        buttons: [{
            text: "Refresh",
            click: function () {
                location.reload();
            }
        }]
    });
});
$(".rotate").mousedown(function (event) {
    switch (event.which) {
        case 1:
            $(this).parent().rotate(-15);
            break;
        case 2:
        case 3:
            $(this).parent().rotate(15);
            break;
    }
    return false;
});
$(".rotate").contextmenu(function (event) {
    return false;
});

$(".rotate").dblclick(function () {
    $(this).parent().flip();
});
jQuery.fn.rotate = function (degrees) {
    degrees = Number($(this).attr("angle") || 0) + degrees;
    $(this).attr("angle", degrees);
    $(this).updateTrans();
    return $(this);
};
jQuery.fn.flip = function () {
    var flips = !($(this).attr("flip") === "true");
    $(this).attr("flip", flips);
    $(this).updateTrans();
    return $(this);
};
jQuery.fn.updateTrans = function () {
    var degrees = $(this).attr("angle") || 0;
    var flips = $(this).attr("flip") === "true";
    var flipd = flips ? 180 : 0;
    $(this).css({ '-webkit-transform': 'rotateZ(' + degrees + 'deg)' + ' rotateX(' + flipd + 'deg)',
        '-moz-transform': 'rotateZ(' + degrees + 'deg)' + ' rotateX(' + flipd + 'deg)',
        '-ms-transform': 'rotateZ(' + degrees + 'deg)' + ' rotateX(' + flipd + 'deg)',
        'transform': 'rotateZ(' + degrees + 'deg)' + ' rotateX(' + flipd + 'deg)'
    });
    return $(this);
};


$(".Ts").mousedown(function () {
    $(".Ts").zIndex(0);
    $(this).zIndex(1);
});
$(".Ts").each(function (i, e) {
    $(e).offset({ top: Math.round(Math.random() * 300), left: Math.round(Math.random() * 800) });
});

var game = {
    checkWin: function () {
        var current = this.currentState();
        var diff = _.values(subtractObjects(current, this.winState));
        diff = _.map(diff, function (val, key, lis) {
            return subtractObjects(val, lis[0]);
        });
        var ans = _.reduce(diff, sumSquareObjects);
        return _.reduce(_.map(_.values(ans), function(val){return game.epsilonFun(val);}),
                function (memo, val) { return memo && val });
    },

    currentState: function () {
        state = {};
        $(".Ts").each(function (i, e) {
            var $e = $(e);
            var pos = $e.offset();
            state[$e.attr("id")] = {
                top: pos.top,
                left: pos.left,
                angle: (Number($e.attr("angle"))+360)%360 || 0,
                flip: $e.attr("flip") === "true"
            };
        });
        return state;
    },

    winState: {
        T2: { top: 0, left: 282.7, angle: 0, flip: false },
        T3: { top: -141.4, left: 0, angle: 45, flip: false },
        T4: { top: 0, left: 0, angle: 0, flip: false },
        T5: { top: 200, left: 200, angle: 0, flip: false }
    },
    epsilon: 400,
    epsilonFun: function (val) {
        if (typeof (val) === "boolean") { return val; }
        else { return Math.abs(val) < this.epsilon; }
    }
};
var subtractObjects = function (a, b) {
    return _.mapObject(a, function (val, key) {
        if (typeof (val) === "object") {
            return subtractObjects(val, b[key]);
        }
        else if (typeof (val) === "number") {
            return val - b[key];
        }
        else if (typeof (val) === "boolean") {
            return (val ^ b[key]) === 0;
        }
        else {
            return val;
        }
    })
};

var sumSquareObjects = function (a, b) {
    return _.mapObject(a, function (val, key) {
        if (typeof (val) === "object") {
            return sumSquareObjects(val, b[key]);
        }
        else if (typeof (val) === "number") {
            return val + b[key]*b[key];
        }
        else if (typeof (val) === "boolean") {
            return val && b[key];
        }
        else {
            return val;
        }
    })
};