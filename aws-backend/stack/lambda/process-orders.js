const products = [
  {
    "name": "Small Cat Food",
    "id": "001",
    "price": 18.19,
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
    "img": "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.thomasbellcountrystore.co.uk%2Fwp-content%2Fuploads%2F2013%2F06%2Fhow-to-make-dry-dog-food-more-appealing-to-your-dog-53bacc6b81ed71.jpg&f=1&nofb=1"
  },
  {
    "name": "Big Cat Food",
    "id": "002",
    "price": 24.49,
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
    "img": "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.thomasbellcountrystore.co.uk%2Fwp-content%2Fuploads%2F2013%2F06%2Fhow-to-make-dry-dog-food-more-appealing-to-your-dog-53bacc6b81ed71.jpg&f=1&nofb=1"
  },
  {
    "name": "Vicious Cat Food",
    "id": "003",
    "price": 18.99,
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
    "img": "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.thomasbellcountrystore.co.uk%2Fwp-content%2Fuploads%2F2013%2F06%2Fhow-to-make-dry-dog-food-more-appealing-to-your-dog-53bacc6b81ed71.jpg&f=1&nofb=1"
  },
  {
    "name": "Universal Cat Food",
    "id": "004",
    "price": 9.99,
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
    "img": "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.thomasbellcountrystore.co.uk%2Fwp-content%2Fuploads%2F2013%2F06%2Fhow-to-make-dry-dog-food-more-appealing-to-your-dog-53bacc6b81ed71.jpg&f=1&nofb=1"
  },
  {
    "name": "Stray Cat Food",
    "id": "005",
    "price": 10.99,
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
    "img": "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.thomasbellcountrystore.co.uk%2Fwp-content%2Fuploads%2F2013%2F06%2Fhow-to-make-dry-dog-food-more-appealing-to-your-dog-53bacc6b81ed71.jpg&f=1&nofb=1"
  },
  {
    "name": "Small Dog Food",
    "id": "006",
    "price": 13.99,
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
    "img": "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.thomasbellcountrystore.co.uk%2Fwp-content%2Fuploads%2F2013%2F06%2Fhow-to-make-dry-dog-food-more-appealing-to-your-dog-53bacc6b81ed71.jpg&f=1&nofb=1"
  },
  {
    "name": "Big Dog Food",
    "id": "007",
    "price": 55.00,
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
    "img": "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.thomasbellcountrystore.co.uk%2Fwp-content%2Fuploads%2F2013%2F06%2Fhow-to-make-dry-dog-food-more-appealing-to-your-dog-53bacc6b81ed71.jpg&f=1&nofb=1"
  },
  {
    "name": "Vicious Dog Food",
    "id": "008",
    "price": 24.19,
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
    "img": "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.thomasbellcountrystore.co.uk%2Fwp-content%2Fuploads%2F2013%2F06%2Fhow-to-make-dry-dog-food-more-appealing-to-your-dog-53bacc6b81ed71.jpg&f=1&nofb=1"
  },
  {
    "name": "Universal Dog Food",
    "id": "009",
    "price": 19.99,
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
    "img": "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.thomasbellcountrystore.co.uk%2Fwp-content%2Fuploads%2F2013%2F06%2Fhow-to-make-dry-dog-food-more-appealing-to-your-dog-53bacc6b81ed71.jpg&f=1&nofb=1"
  },
  {
    "name": "Stray Dog Food",
    "id": "010",
    "price": 20.99,
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
    "img": "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.thomasbellcountrystore.co.uk%2Fwp-content%2Fuploads%2F2013%2F06%2Fhow-to-make-dry-dog-food-more-appealing-to-your-dog-53bacc6b81ed71.jpg&f=1&nofb=1"
  },
  {
    "name": "Small Hamster Food",
    "id": "011",
    "price": 19.19,
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
    "img": "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.thomasbellcountrystore.co.uk%2Fwp-content%2Fuploads%2F2013%2F06%2Fhow-to-make-dry-dog-food-more-appealing-to-your-dog-53bacc6b81ed71.jpg&f=1&nofb=1"
  },
  {
    "name": "Big Hamster Food",
    "id": "012",
    "price": 21.19,
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
    "img": "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.thomasbellcountrystore.co.uk%2Fwp-content%2Fuploads%2F2013%2F06%2Fhow-to-make-dry-dog-food-more-appealing-to-your-dog-53bacc6b81ed71.jpg&f=1&nofb=1"
  },
  {
    "name": "Vicious Hamster Food",
    "id": "013",
    "price": 24.19,
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
    "img": "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.thomasbellcountrystore.co.uk%2Fwp-content%2Fuploads%2F2013%2F06%2Fhow-to-make-dry-dog-food-more-appealing-to-your-dog-53bacc6b81ed71.jpg&f=1&nofb=1"
  },
  {
    "name": "Universal Hamster Food",
    "id": "014",
    "price": 19.99,
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
    "img": "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.thomasbellcountrystore.co.uk%2Fwp-content%2Fuploads%2F2013%2F06%2Fhow-to-make-dry-dog-food-more-appealing-to-your-dog-53bacc6b81ed71.jpg&f=1&nofb=1"
  },
  {
    "name": "Stray Hamster Food",
    "id": "015",
    "price": 20.99,
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
    "img": "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.thomasbellcountrystore.co.uk%2Fwp-content%2Fuploads%2F2013%2F06%2Fhow-to-make-dry-dog-food-more-appealing-to-your-dog-53bacc6b81ed71.jpg&f=1&nofb=1"
  }
]

module.exports = function(orderedItems = []) {
  const itemsMap = orderedItems.map((item) => {
    const baseProd = products.find((prod) => prod.id === item.id)
    baseProd.volume = item.volume
    return baseProd
  })
  const reducer = (acc, curr) => acc + curr
  const orderTotalPrice = itemsMap.map(item => {
    return Number(parseFloat(item.price * item.volume).toFixed(2))
  }).reduce(reducer)
  
  return {
    'mappedItems': itemsMap,
    orderTotalPrice
  }
}