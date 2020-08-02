
function Vendor() {
  this.items = [];
}

Vendor.prototype.addInfo = function(name, postCode, maxCovers) {
  this.name = name;
  this.postCode = postCode;
  this.maxCovers = maxCovers;
}

Vendor.prototype.addItem = function(item) {
  this.items.push(item);
};

module.exports = Vendor;
