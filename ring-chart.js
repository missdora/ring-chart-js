(function($){
  function RingChart(ele, options, data) {
    this.options = $.extend({
      width : 100,
      height : 100,
      circleWidth : 5,
      circleRadius : 50,
      animateInterval : 10,
      type : 'ring',
      colors : ['#ff6600', '#00bfff', '#ff6600', '#fcb454', '#00bfff', '#ff6600', '#00bfff', '#ff6600', '#00bfff', '#ff6600', '#00bfff']
    }, options);
    this.selector = ele;
    this.getCanvas();
    this.calculateData(data);
    //this.calculateData([555, 66, 188, 90]);
  }

  RingChart.prototype.getCanvas = function () {
    var options = this.options;
    this.selector.append('<canvas width="' + options.width + '" height="' + options.height + '"></canvas>');
    this.context = this.selector.find('canvas').get(0).getContext('2d');
    this.context.translate(options.width / 2, options.height / 2);
  };

  RingChart.prototype.calculateData = function (data) {
    var sum = 0;
    var arr = [];
    var options = this.options;

    data = data.sort(function (a, b) {
      return a < b;
    });
    for (var i = 0; i < data.length; i++) {
      sum += data[i];
    }

    for (var i = 0; i < data.length; i++) {
      if (sum && data[i]) {
        arr.push(data[i]/ sum);
      }
    }

    if (arr.length > 0) {
      var startAng = 0;
      var len = Math.min(arr.length, 10);
      for (var i = 0; i < len; i++) {
        this.animateSector(startAng * 360, (startAng + arr[i]) * 360, options.colors[i]);
        startAng += arr[i];
      }
    } else {
      this.drawSector(0, 360, '#999');
    }
  };

  RingChart.prototype.drawSector = function (startAng, endAng, color) {
    startAng = this.getAngle(startAng);
    endAng = this.getAngle(endAng);
    var options = this.options;
    this.context.beginPath();
    this.context.arc(0, 0, options.circleRadius - options.circleWidth, startAng, endAng, false);
    if (options.type === 'circle') {
      this.context.filleStyle = color;
      this.context.fill();
    }
    this.context.lineWidth = options.circleWidth;
    this.context.strokeStyle = color;
    this.context.stroke();
    this.context.closePath();
  };

  RingChart.prototype.animateSector = function (startAng, endAng, color) {
    var options = this.options;
    var self = this;
    endAng -= 5;
    var count = parseInt((endAng - startAng) / 1);
    for (var i = 0; i < count; i++) {
      var endAng2 = startAng + 1 * (i + 1);
      if (endAng2 > endAng) {
        endAng2 = endAng;
      }
      (function (sAng, eAng, time) {
        window.setTimeout(function () {
          self.drawSector(sAng, eAng, color);
        }, time);
      })(startAng, endAng2, options.animateInterval * i);
    }
  };



  RingChart.prototype.getAngle = function (angle) {
    return 2 * Math.PI * (angle / 360) - 90;
  };

  window.RingChart = RingChart;
})($);