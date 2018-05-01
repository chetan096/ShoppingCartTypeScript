//vue instance for dom manipulation of signup.html 
var app=new Vue({
    el:'#app',
    data:{
        username:'',
        password:''
    },
    methods:{
        //add user by sending post request on server
        addUser(){
            axios.post('/api/users/signup',{
                username:this.username,
                password:this.password
            }).then((res)=>{
               if(res.data.success){
                   alert(res.data.message);
                   alert('Welcome '+res.data.username);
                   window.location.href=res.data.redirectUrl;
               }
            })
            .catch((err)=>alert("User already exists!"))
        }
    }
})