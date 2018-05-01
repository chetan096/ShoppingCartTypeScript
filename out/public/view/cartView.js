// CHETAN MAHAJAN
// vue instance for dom manipulation of showCart.html
var app = new Vue({
  el: '#app',
  data: {
    // store cart objects
    cart: [],
    // total amount bill
    totalAmount: 0,
    // true for increase
    increase: true,
    // false for decrease 
    decrease: false,
    flag: ''
  },
  methods: {
    // update quantity of that product with the same productid in the database if event.target.value true then add else false
    // if flag true then increase true
    updateQuantity(event) {
      // event.value return string that check if true then true else return false
      this.flag = (event.target.value == 'true')
      axios.put('/api/cart', {
        increase: this.flag,
        productId: event.target.id
      }).then((res) => {
        // new cart response with updated data
        this.cart = res.data
        this.totalAmount = 0
        // set total amount
        for (var item of this.cart) {
          this.totalAmount += item.amount
        }
      }).catch((err) => {
        alert(err.response.data.error)
      })
    }
  },
  // when created this instance then get all cart objects from backend stored in the database 
  created() {
    axios.get('/api/cart').then((res) => {
      this.cart = res.data
      // set total amount
      for (var item of this.cart) {
        this.totalAmount += item.amount
      }
    }).catch((err) => {
      alert(err.response.data.error)
    })
  }

})
