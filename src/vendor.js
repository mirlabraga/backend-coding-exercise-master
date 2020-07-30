
function Vendor(name, postCode, maxCovers) {
  this.name = name;
  this.postCode = postCode;
  this.maxCovers = maxCovers;
  this.items = [];
}

Vendor.prototype.addItem = function(item) {
  this.items.push(item);
};

module.exports = Vendor;
