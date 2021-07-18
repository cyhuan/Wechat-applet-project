// pages/cart/index.js
import {
  getSetting,
  chooseAddress,
  openSetting
} from "../../utils/asyncWx"
import regeneratorRuntime from "../../lib/runtime/runtime"
Page({
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    const address = wx.getStorageSync('address');
    const cart = wx.getStorageSync("cart") || [];
    this.setData({address});
    this.setCart(cart);
  },
  async handleChooseAddress() {
    try {
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      if (scopeAddress === false) {
        await openSetting();
      }
      let address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      wx.setStorageSync('address', address)
    } catch (error) {
      console.log(error);
    }
  },
  // 商品的选中
  handleItemChange(e){
    const goods_id=e.currentTarget.dataset.id;
    let {cart}=this.data;
    let index=cart.findIndex(v=>v.goods_id===goods_id);
    cart[index].checked=!cart[index].checked;
    this.setCart(cart);
  },
  // 封装购物车状态
  setCart(cart){
    let allChecked=true;
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v=>{
      if(v.checked){
        totalPrice+=v.num*v.goods_price;
        totalNum+=v.num
      }else{
        allChecked=false;
      }
    })
    allChecked=cart.length!=0?allChecked:false;
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    });
    wx.setStorageSync('cart', cart);
  },
  handleItemAllCheck(){
    let {cart,allChecked}=this.data;
    allChecked=!allChecked;
    cart.forEach(v=>v.checked=allChecked);
    this.setCart(cart);
  },
  handleItemNumEdit(){
    const {operation,id}=e.currentTarget.dataset;
    console.log();
  }
})