function fnAjaxGameRate(_callback) {
    $.ajax({
        method: "get",
        url: this.mainUrl + ":8080" + "/gameRate",
        data: {}
    }).done(function (msg) {
        _callback(JSON.parse(msg));
    });
}

function Bet(_gameItem, _url) {
    this.socket = io(_url);
    this.rev();
    this.total = 0;
    this.bet_cash = 0;
    this.credit_price = 0;
    this.expected_amounts = 0;
    this.init();
    this.initEvent(_gameItem);
    this.subTabSelected = "betTab1";
    var data = {
        fnCallback: "searchUserId",
        userId: "test"
    };
    this.send(data);
}

Bet.prototype.init = function() {
    var bet = this;
    $(".bh_list_area").empty(); // cuurentBetHistory 초기화
    $(".bettingchips_ul > li > a").removeClass("on");
    $(".credit_price").text(bet.comma(bet.credit_price));
    $(".head_desc").empty();
    var htmlText = "Bet Cash : 0 Expected Amounts : 0 current bet cash";
    $(".head_desc").text(htmlText);
    $("#betTab1").removeClass("disabled off");
    $("#betTab2").removeClass("disabled off");
    $("#betTab3").removeClass("disabled off");
    $("#betTab4").removeClass("disabled off");
    $(".btn_bet").removeClass("disabled off");
};
Bet.prototype.initEvent = function(_gameItem) {
    var bet = this;

    /**
     * 두번째 탭
     */
    $("." + _gameItem.subTab + " > li").on("click", function() {
        console.log($(this).attr("id"));
        bet.subTabSelected = $(this).attr("id");
        bet.setBetCash(0);
    });

    /**
     * 배팅 금액 선택
     */
    $("." + _gameItem.bettingPrice + " > li > a").on("click", function() {

        // 배팅 타입 고르지 않으면 popup
        if (_gameItem.gameRuleSelected === 0) {
            alert("Please choose betting type");
            return;
        }

        var betCashTemp = 0;
        if ($(this).text() == "ALL IN" ){
            alert("금액 모두 ");
        }
        else if ($(this).text() == "REBET" ){
            alert("리벳 ");
        }
        else if ($(this).text() == "RESET" ){
            bet.setBetCash(0);
            bet.setExpectedAmounts(0);
        }
        else if ($(this).text() == "50K" ){
            betCashTemp = 50000;
        }
        else if ($(this).text() == "100K" ){
            betCashTemp = 100000;
        } else {
            betCashTemp = Math.floor($(this).text().replace(/,/gi, ""));
        }

        // 배팅 금액 계산
        if (bet.subTabSelected == "betTab1") { // 짝홀
            bet.bettingTotal(betCashTemp, _gameItem.betHistoryItems[0].bettingRate);
        } else if(bet.subTabSelected == "betTab2") { // 대중소
            bet.bettingTotal(betCashTemp, _gameItem.betHistoryItems[1].bettingRate);
        } else if(bet.subTabSelected == "betTab3") { // 구간합
            bet.bettingTotal(betCashTemp, _gameItem.betHistoryItems[2].bettingRate);
        } else if(bet.subTabSelected == "betTab4") { // 파워볼
            bet.bettingTotal(betCashTemp, _gameItem.betHistoryItems[3].bettingRate);
        }
        // 화면 출력
        var betCash = bet.getBetCash();
        var expectedAmount = bet.getExpectedAmounts();
        var htmlText = "Bet Cash : "+bet.comma(betCash)+" | Expected Amounts : "+bet.comma(expectedAmount)+" current bet cash";
        $(".bet_cash_txt > em > input").val(betCash);
        $(".expected_txt > em > input").val(expectedAmount);
        $(".head_desc").text(htmlText);
    });

    /**
     * 배팅 플레이
     */
    $("." + _gameItem.betPlay).on("click", function() {

        var liLength = $(".bh_list_area").find("li").length;
        if(liLength == 5) {
            alert("betting limit end");
            return;
        }

        var selectedCash = bet.getBetCash();
        if(selectedCash == 0) {
            alert("Please bet more than minimum Minimum Bet : 5,000");
            return;
        }
        console.log("fnBetPlay");
        // betting 정보 가져오기 [ 배당율, 금액 ]
        // bettingRate 서버에서 받아 온다.
        var currentBetHistoryItems = _gameItem.betHistoryItems;

        var setCurrentBetHistoryItem = function(item) {
            currentBetHistoryItems[id].title = item.title;
            currentBetHistoryItems[id].circle = item.circle;
            currentBetHistoryItems[id].price = bet.comma(item.price);
        };

        $(this).addClass("disabled"); // 이미 건 배팅은 막아야 함.
        $(this).addClass("off");
        var id = $(this).attr("data-val");
        var marketType = "";
        if (id == 0) { // even/hole
            marketType = "EVEN/HOLE";
            $("#betTab1").addClass("disabled off");
            $(".eh_choice02 > li > a").addClass("disabled off");

            if (_gameItem.gameRuleSelected === 2) { // 짝수

                marketTypeSelected = "even";
                setCurrentBetHistoryItem({
                    title:"EVEN/HOLE",
                    circle:"circle_red",
                    price:selectedCash
                });
            } else { // 홀수
                marketTypeSelected = "hole";
                setCurrentBetHistoryItem({
                    title:"EVEN/HOLE",
                    circle:"circle_blue",
                    price:selectedCash
                });
            }
        } else if (id == 1) { // s/m/l
            marketType = "S/M/L";
            $("#betTab2").addClass("disabled off");
            $(".eh_choice03 > li > a").addClass("disabled off");

            if (_gameItem.gameRuleSelected === 1) {
                marketTypeSelected = "S";
                setCurrentBetHistoryItem({
                    title:"S/M/L",
                    circle:"circle_red",
                    price:selectedCash
                });
            } else if (_gameItem.gameRuleSelected === 2) {
                marketTypeSelected = "M";
                setCurrentBetHistoryItem({
                    title:"S/M/L",
                    circle:"circle_green",
                    price:selectedCash
                });
            } else if (_gameItem.gameRuleSelected === 3) {
                marketTypeSelected = "L";
                setCurrentBetHistoryItem({
                    title:"S/M/L",
                    circle:"circle_purple",
                    price:selectedCash
                });
            }
        } else if (id == 2) { // a/b/c/d
            marketType = "A/B/C/D";
            $("#betTab3").addClass("disabled off");
            $(".eh_choice04 > li > a").addClass("disabled off");

            if (_gameItem.gameRuleSelected === 1) {
                marketTypeSelected = "A";
                setCurrentBetHistoryItem({
                    title:"A/B/C/D",
                    circle:"circle_red",
                    price:selectedCash
                });
            } else if (_gameItem.gameRuleSelected === 2) {
                marketTypeSelected = "B";
                setCurrentBetHistoryItem({
                    title:"A/B/C/D",
                    circle:"circle_yellow",
                    price:selectedCash
                });
            } else if (_gameItem.gameRuleSelected === 3) {
                marketTypeSelected = "C";
                setCurrentBetHistoryItem({
                    title:"A/B/C/D",
                    circle:"circle_deepskyblue",
                    price:selectedCash
                });
            } else if (_gameItem.gameRuleSelected === 4) {
                marketTypeSelected = "D";
                setCurrentBetHistoryItem({
                    title:"A/B/C/D",
                    circle:"circle_purple",
                    price:selectedCash
                });
            }
        } else if (id == 3) { // powerball
            marketType = "POWERBALL";
            $("#betTab4").addClass("disabled off");
            $(".eh_choice05 > li > a").addClass("disabled off");

            if (_gameItem.gameRuleSelected === 1) {
                marketTypeSelected = "A";
                setCurrentBetHistoryItem({
                    title:"POWERBALL",
                    circle:"circle_red",
                    price:selectedCash
                });
            } else if (_gameItem.gameRuleSelected === 2) {
                marketTypeSelected = "B";
                setCurrentBetHistoryItem({
                    title:"POWERBALL",
                    circle:"circle_yellow",
                    price:selectedCash
                });
            } else if (_gameItem.gameRuleSelected === 3) {
                marketTypeSelected = "C";
                setCurrentBetHistoryItem({
                    title:"POWERBALL",
                    circle:"circle_deepskyblue",
                    price:selectedCash
                });
            } else if (_gameItem.gameRuleSelected === 4) {
                marketTypeSelected = "D";
                setCurrentBetHistoryItem({
                    title:"POWERBALL",
                    circle:"circle_purple",
                    price:selectedCash
                });
            }
        }

        var tempHtml = "<li>";
        tempHtml += "<span class='type_txt'>"+currentBetHistoryItems[id].title+"</span>";
        tempHtml += "<span class='type_circle'><i class='"+currentBetHistoryItems[id].circle+"'></i></span>";
        tempHtml += "<span class='type_price'>"+currentBetHistoryItems[id].price+"</span>";
        tempHtml += "<span class='type_batting'>"+currentBetHistoryItems[id].bettingRate+"</span>";
        tempHtml += "</li>";
        $(tempHtml).appendTo(".bh_list_area");
        setTimeout(function() {
            $('.bh_list_area > li').addClass("show")
        }, 10);

        // 서버로 업데이트 금액 확인요청
        bet.bettingPriceRequest({
            currentPrice:bet.credit_price,
            bettingPrice:bet.bet_cash,
            marketType: marketType,
            marketTypeSelected : marketTypeSelected,
            rate: currentBetHistoryItems[id].bettingRate
        });

    });

    /**
     * 홀짝 선택
     */
    $("." + _gameItem.bettingChoice[0] + " > li > a").on("click", function() {
        var selected = $(this).attr("data-val");
        if(selected === "even") {
            _gameItem.gameRuleSelected = 2;
        } else {
            _gameItem.gameRuleSelected = 1;
        }
    });

    /**
     * 대중소 선택
     */
    $("." + _gameItem.bettingChoice[1] + " > li > a").on("click", function() {
        var selected = $(this).attr("data-val");
        if(selected === "s") {
            _gameItem.gameRuleSelected = 1;
        } else if (selected === "m") {
            _gameItem.gameRuleSelected = 2;
        } else if (selected === "l") {
            _gameItem.gameRuleSelected = 3;
        }
    });

    /**
     * 구간합
     */
    $("." + _gameItem.bettingChoice[2] + " > li > a").on("click", function() {
        var selected = $(this).attr("data-val");
        if(selected === "a") {
            _gameItem.gameRuleSelected = 1;
        } else if (selected === "b") {
            _gameItem.gameRuleSelected = 2;
        } else if (selected === "c") {
            _gameItem.gameRuleSelected = 3;
        } else if (selected === "d") {
            _gameItem.gameRuleSelected = 4;
        }
    });
    // TODO: 파워볼
    $("." + _gameItem.bettingChoice[3] + " > li > a").on("click", function() {
        var selected = $(this).attr("data-val");
        if(selected === "a") {
            _gameItem.gameRuleSelected = 1;
        } else if (selected === "b") {
            _gameItem.gameRuleSelected = 2;
        } else if (selected === "c") {
            _gameItem.gameRuleSelected = 3;
        } else if (selected === "d") {
            _gameItem.gameRuleSelected = 4;
        }
    });
}
Bet.prototype.rev = function() {
    var bet = this;
    this.socket.on('server-send', function (d) { //서버에서 받음.
        console.log(d);
        var _d = JSON.parse(d);

        if(_d.fnCallback == "searchUserId") {
            if(_d.code == 1) {
                // 게임 시작
                console.log("game success");
                bet.credit_price = Math.floor(_d.price);
                $(".credit_price").text(bet.comma(_d.price));
            } else {
                // 종료
                console.log("game disconnect");
                bet.socket.emit('disconnect'); // 소켓 종료
                bet.disconnectSocket();
            }
        } else if(_d.fnCallback == "marketBetting") { // 배팅후 금액
            $(".credit_price").text(bet.comma(_d.price));
        } else if(_d.fnCallback == "gameResult") { // 게임 플레이
            if (_d.code == 109) {
                g_main.bet.init();
            }
        } else { // 마감
            if(_d.timeCount === 15) {
                var data = {
                    userId: "test",
                    fnCallback : "deadline"
                };
                bet.send(data);
            }
        }
    });
}
Bet.prototype.send = function(resultMsg) {
    this.socket.emit('client-rev', JSON.stringify(resultMsg)); //서버로 보냄
}
Bet.prototype.setBetCash = function (price) {
    this.bet_cash = price;
}
Bet.prototype.getBetCash = function() {
    return this.bet_cash;
}
Bet.prototype.setExpectedAmounts = function (price) {
    this.expected_amounts = price;
}
Bet.prototype.getExpectedAmounts = function () {
    return this.expected_amounts;
}
Bet.prototype.comma = function (num) {
    var len, point, str;

    num = num + "";
    point = num.length % 3;
    len = num.length;

    str = num.substring(0, point);
    while (point < len) {
        if (str != "") str += ",";
        str += num.substring(point, point + 3);
        point += 3;
    }

    return str;
}

Bet.prototype.bettingTotal = function (_price, _rate) {
    this.bet_cash += _price;
    this.expected_amounts += this.betCalcSum(_price, _rate);
    console.log("credit_price : " + this.credit_price);
    this.credit_price = Math.floor(this.credit_price -  this.bet_cash);

}
// 배팅 계산 및 누적
Bet.prototype.betCalcSum = function (_betPrice, betRate) {
    return _betPrice * betRate;
}
/**
 * 서버로 요청
 */
Bet.prototype.bettingPriceRequest = function (bettingInfo) {
    var data = {
        fnCallback : "marketBetting",
        userId : "test",
        currentPrice : Math.floor(bettingInfo.currentPrice), // 현재 금액
        bettingPrice : Math.floor(bettingInfo.bettingPrice), // 배팅 금액
        remainingPrice : Math.floor(Math.floor(bettingInfo.currentPrice) - Math.floor(bettingInfo.bettingPrice)), // 배팅 후 남은금액
        marketType: bettingInfo.marketType,
        marketTypeSelected : bettingInfo.marketTypeSelected,
        rate: bettingInfo.rate
    };
    console.log(">>>>>>>>>>>>>>>> " + JSON.stringify(data));
    this.send(data);
}

Bet.prototype.disconnectSocket = function () {
    console.log("socket 종료");
    this.socket.disconnect();
}