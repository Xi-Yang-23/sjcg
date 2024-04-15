var bars = function (context) {
  var data = context.data, options = context.options, ctx = context.ctx, h = context.h, w = context.w;
  var count = data.length > options.count ? options.count : data.length;
  var percent = parseInt(h / 255 * 2, 10);
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = options.bgColor;
  ctx.fillRect(0, 0, w, h);
  var step = 0;
  var barWidth = 10;
  var barHeight;
  var x = 0;
  var gradient = options.linear;
  for (var i = 0; i < count; i++) {
    barHeight = data[i];
    ctx.fillStyle = gradient;
    ctx.fillRect(x, h - barHeight, barWidth, barHeight * percent + h / 2);
    x += step;
  }
};
export { bars as default };
