/**
 * 街景地图
 * @constructor
 * @extends {KMap.Action.MapAction}
 * @api
 */
KMap.Action.StreetView = function() {
  KMap.Action.MapAction.call(this, { actionName: "streetView" });

  this.markerSymbol = new KMap.PictureMarkerSymbol({
    src: 'images/bubble30.png',
    anchor: [0.5, 1]
  });
};
KMap.extends(KMap.Action.StreetView, KMap.Action.MapAction);

KMap.Action.StreetView.prototype.activate = function() {

  var map = this.getMap();

  this.helpTooltipElement_ = document.createElement('div');
  this.helpTooltipElement_.className = 'hidden';
  this.helpTooltipElement_.innerHTML = '<div class="mapTip"><span></span><span>点击地图主干道</br>显示街景</span></div>';
  this.helpTooltip_ = new KMap.Overlay({
    element: this.helpTooltipElement_,
    offset: [15, 0],
    positioning: 'center-left'
  });
  map.addOverlay(this.helpTooltip_);

  map.on('click', this.handlerSingleClickHandler_, this);
  map.on('pointermove', this.handlerPointerMove_, this);
};

KMap.Action.StreetView.prototype.deactivate = function() {
  var map = this.getMap();

  map.un('click', this.handlerSingleClickHandler_, this);
  map.un('pointermove', this.handlerPointerMove_, this);

  map.removeOverlay(this.helpTooltip_);
  this.helpTooltipElement_.parentElement.removeChild(this.helpTooltipElement_);

  map.getGraphics().forEach(function(g) {
    var attr = g.getAttributes();
    if (attr["resultID"] == "locateStreetViewTool") {
      map.getGraphics().remove(g);
    }
  });

  delete this.helpTooltip_;
  delete this.helpTooltipElement_;
};

/**
 * Handle pointer move.
 * @param {ol.MapBrowserEvent} evt The event.
 */
KMap.Action.StreetView.prototype.handlerPointerMove_ = function(evt) {
  if (evt.dragging) {
    return;
  }
  this.helpTooltip_.setPosition(evt.coordinate);
  this.helpTooltipElement_.classList.remove('hidden');
};

KMap.Action.StreetView.prototype.handlerSingleClickHandler_ = function(evt) {
  var map = this.getMap();

  map.un('click', this.handlerSingleClickHandler_, this);
  map.un('pointermove', this.handlerPointerMove_, this);

  //将点击位置标记在地图上
  var eventPosition = new KMap.Point(evt.coordinate);
  var locateGraphic = new KMap.Graphic();
  locateGraphic.setGeometry(eventPosition);
  locateGraphic.setSymbol(this.markerSymbol);
  locateGraphic.setAttributes({ "resultID": "locateStreetViewTool" });
  map.getGraphics().add(locateGraphic);

  this.helpTooltipElement_.classList.add('hidden');

  query.project2wgs(evt.coordinate[0], evt.coordinate[1], function(data) {
    var result = JSON.parse(data);
    var point = [result.lon, result.lat];
    var truemapObj = document.getElementById("trueMap");
    if (truemapObj !== undefined && truemapObj !== null &&
      truemapObj.contentWindow.showVisionByLngLat !== undefined && truemapObj.contentWindow.showVisionByLngLat !== null &&
      $.isFunction(truemapObj.contentWindow.showVisionByLngLat)) {
      try {
        truemapObj.contentWindow.showVisionByLngLat(point[0], point[1]);
      } catch (e) {
        console.log(e);
      }
    }
  })
}
