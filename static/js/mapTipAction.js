/**
 * 地图tip
 * @constructor
 * @extends {KMap.Action.MapAction}
 * @api
 */
KMap.Action.MapTip = function(options) {
  KMap.Action.MapAction.call(this, { actionName: options.actionName });

  this.message = options.message;
  this.handerClick = options.handerClick;
};
KMap.extends(KMap.Action.MapTip, KMap.Action.MapAction);

KMap.Action.MapTip.prototype.activate = function() {
  var map = this.getMap();

  this.helpTooltipElement_ = document.createElement('div');
  this.helpTooltipElement_.className = 'hidden';
  this.helpTooltipElement_.innerHTML = '<div class="mapTip"><span></span><span>' + this.message + '</span></div>';
  this.helpTooltip_ = new KMap.Overlay({
    element: this.helpTooltipElement_,
    offset: [10, 0],
    positioning: 'center-left'
  });
  map.addOverlay(this.helpTooltip_);

  map.on('click', this.handlerSingleClickHandler_, this);
  map.on('pointermove', this.handlerPointerMove_, this);
};

KMap.Action.MapTip.prototype.deactivate = function() {
  var map = this.getMap();

  map.un('click', this.handlerSingleClickHandler_, this);
  map.un('pointermove', this.handlerPointerMove_, this);

  map.removeOverlay(this.helpTooltip_);
  this.helpTooltipElement_.parentElement.removeChild(this.helpTooltipElement_);

  delete this.helpTooltip_;
  delete this.helpTooltipElement_;
};

/**
 * Handle pointer move.
 * @param {ol.MapBrowserEvent} evt The event.
 */
KMap.Action.MapTip.prototype.handlerPointerMove_ = function(evt) {
  if (evt.dragging) {
    return;
  }
  this.helpTooltip_.setPosition(evt.coordinate);
  this.helpTooltipElement_.classList.remove('hidden');
};

KMap.Action.MapTip.prototype.handlerSingleClickHandler_ = function(evt) {
  var map = this.getMap();

  map.un('click', this.handlerSingleClickHandler_, this);
  map.un('pointermove', this.handlerPointerMove_, this);

  this.helpTooltipElement_.classList.add('hidden');
  if (this.handerClick && typeof this.handerClick == 'function') {
    this.handerClick({
      event: evt,
      target: this
    });
  }
}
