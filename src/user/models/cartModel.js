module.exports = function Cart(oldCart, qty){
    
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;
    //this.qty = oldCart.qty || qty;
    this.add = function (item, id, qty){
        var storedItem = this.items[id];
        if (!storedItem)
        {
            storedItem = this.items[id] = {item: item, qty:0, price:0 };
        }
        //console.log(this.qty);
        storedItem.qty += qty;
        storedItem.price = parseInt(storedItem.item.basePrice) * storedItem.qty;
        this.totalQty += qty;
        this.totalPrice += parseInt(storedItem.item.basePrice)*qty;
    };
    
    this.generateArray = function (){
        var arr = [];

        for (var id in this.items)
        {
            arr.push(this.items[id]);
        }
       
        return arr;
      
    };

    this.deleteItem = function (id)
    {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        //this.qty = 0;
        //this.totalQty = 0;
        //this.totalPrice = 0;
        //console.log(this.items[id].qty);
        delete this.items[id];
        //console.log(this.items);
    }

};