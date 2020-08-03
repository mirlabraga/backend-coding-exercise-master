
var vendorService = require('../src/vendor.service.js');
const Vendor = require('../src/model/vendor.js');

test('read a line of the vendor to be equal a array with 1 element of the vendor',
  async () => {
    const line = "Grain and Leaf;E32NY;100";
    const vendors = [];

    const vendorsResult = [
      {
        items: [],
        name: 'Grain and Leaf',
        postCode: 'E32NY',
        maxCovers: '100'
      }
    ];

    await vendorService.createVendor(line, vendors);

    expect(vendors.length).toBe(1);
    expect(vendors).toEqual(vendorsResult);
});

test('find by date, time, postcode needs to return the item',
  async () => {
    const line = "Grain and Leaf;E32NY;100";

    const vendors = [
      {
        items: [{
          name: 'Breakfast',
          allergies: [ 'gluten', 'eggs' ],
          advanceTime: '12h'
        }],
        name: 'Grain and Leaf',
        postCode: 'NW43QB',
        maxCovers: '100'
      }
    ];

    const itemsResult = await vendorService.findByDateLocation(vendors, "04/08/20", "11:00", "NW43QB", 20);

    const itemsResultWait = [{
      name: 'Breakfast',
      allergies: [ 'gluten', 'eggs' ],
      advanceTime: '12h'
    }];

    expect(itemsResult.length).toBe(1);
    expect(itemsResult).toEqual(itemsResultWait);

});



test('find by date where the postcode no match',
  async () => {
    const line = "Grain and Leaf;E32NY;100";

    const vendors = [
      {
        items: [{
          name: 'Breakfast',
          allergies: [ 'gluten', 'eggs' ],
          advanceTime: '12h'
        }],
        name: 'Grain and Leaf',
        postCode: 'E32NY',
        maxCovers: '100'
      }
    ];

    const itemsResult = await vendorService.findByDateLocation(vendors, "04/08/20", "11:00", "NW43QB", 20);

    expect(itemsResult.length).toBe(0);
    expect(itemsResult).toEqual([]);

});


test('find by date, time and postcode and the covers is biggest the in stored',
  async () => {
    const line = "Ghana Kitchen;E32NY;40";

    const vendors = [
      {
        items: [{
          name: 'Breakfast',
          allergies: [ 'gluten', 'eggs' ],
          advanceTime: '12h'
        }],
        name: 'Ghana Kitchen',
        postCode: 'NW43QB',
        maxCovers: '40'
      }
    ];

    const itemsResult = await vendorService.findByDateLocation(vendors, "04/08/20", "11:00", "NW43QB", 41);

    expect(itemsResult.length).toBe(0);
    expect(itemsResult).toEqual([]);

});


test('find by date, time and postcode and the covers is biggest the in stored',
  async () => {

    const dataInput = ["./test/example-input-test", "10/08/2020", "11", "NW43QB", "20"];
    try {
      const itemsResult = await vendorService.getItemAvailableByDateLocation(dataInput);
      console.log(itemsResult);

    } catch (error) {
      const messageResultWait = "The day is not in a valid day format that the service can support.,The time is not in a valid time format that the service can support.";
      expect(error.message).toEqual(messageResultWait);
    }
});
