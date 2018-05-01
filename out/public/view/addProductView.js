// vue instance for manipulating dom of index.html
var app = new Vue({
  el: '#app',
  data: {
    productName: '',
    productPrice: '',
    selectedVendorId: null,
    vendors: []
  },
  methods: {
    // add product to the database sending post request to the server
    addProduct() {
      //price validation
      if (Number.isNaN(parseFloat(this.productPrice))){
         this.setValuesToDefault();
         return alert("Please enter valid price or Name");
      }
      else if(this.selectedVendorId==0){
        this.setValuesToDefault();
        return alert('Please select valid vendor');
      }
      axios.post('/api/products', {
        name: this.productName,
        price: this.productPrice,
        vendorId: this.selectedVendorId
      }).then((res) => {
        // setting data values of this vue to default
        this.setValuesToDefault()
        // when added successfully
        alert('Product added successfully')
        return
      })
        // when error occurs in post request
        .catch((err) => {
          this.setValuesToDefault()
          alert(err.response.data.error)
        })
    },
    setValuesToDefault(){
      this.productName = ''
      this.productPrice = ''
      this.selectedVendorId = 0
    }
  },
  // when create this vue instance get vendors as json from backend stored in the database
  created() {
    axios.get('/api/vendors').then((res) => {
      this.vendors = res.data
      this.vendors.unshift({name:'-----Please Select One-----',id:0});
      this.selectedVendorId = 0
    }).catch((err) => console.log(err))
  }
})

