// CHETAN MAHAJAN
// vue instance for dom manipulation of showProducts.html
var app = new Vue({
  el: '#app',
  data: {
    // products objects array
    products: [],
    // vendors objects array
    vendors: [],
    // storing temporary products
    temp: [],
    // selected vendor ids
    checkSelectedBoxes: [],
    username:'',
  },
  methods: {
    // will take button event and add product to the cart with the corresponding productid
    addProductToCart(event) {
      axios.post('/api/cart', {
        productId: event.target.id
      }).then((res) => {
        alert('Product added into cart successfully')
        return
      }).catch((err) => alert(err.response.data.error))
    },
    // filter temp array bases on the selected vendors id and add filtered products to the products array
    // if no vendor selected then show all products
    filterProductsByVendor() {
      if (this.checkSelectedBoxes.length == 0) {
        this.products = this.temp
      }else {
        this.products = this.temp.filter((product) => this.checkSelectedBoxes.indexOf(product.vendor.id) > -1)
      }
    },
    // show all products and set selected vendors list to default
    showAllProducts() {
      this.products = this.temp
      this.checkSelectedBoxes = []
    },
    async getUsername(){
     var res= await axios.get('/api/users');
     this.username=res.data;
    }
  },
  // on creating this vue instance get all products from the backend stored in the database
  async created() {
    axios.get('/api/products')
      .then((res) => {
        // vendors is a set stores unique vendor strings and then convert that set to array and strings to json object
        this.products = res.data
        // stored products in a temporary array
        this.temp = this.products
        this.vendors = new Set()
        for (var product of this.products) {
          this.vendors.add(JSON.stringify(product.vendor))
        }
        // now vendors is a array containing unique objects of vendors
        this.vendors = Array.from(this.vendors).map((vendor) => JSON.parse(vendor))
        this.getUsername();
      }).catch((err) => console.log('Error getting products'))
  }

})
