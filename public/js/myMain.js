$(document).ready(() => {
    $('.add-to-cart').on('click', addToCart);
  //Voi tat ca nhung nut nao co class add-to-cart khi nguoi dung click thi goi ham
});

function addToCart() {
    var id = $(this).data('id'); //lay ra id cua san pham
    var quantity = $('#sst') ? $('#sst').val() : 1;
    $.ajax({ //call server
        url: '/cart',
        type: 'POST' ,
        data: { id, quantity },
        success: function(result){ //neu thanh cong thi tra ve totalQuanlity va update len view
            $('#cart-badge').html(result.totalQuantity);
        }
        
    })
}

function updateCart(id, quantity){
    if(quantity == 0){
        removeCartItem(id);
    }else{
        updateCartItem(id, quantity);
    }

}

function removeCartItem(id) {
    $.ajax({ 
        url: '/cart',
        type: 'DELETE' ,
        data: { id },
        success: function(result){
            $('#cart-badge').html(result.totalQuantity);
            $('#totalPrice').html('$' + result.totalPrice);
            if(result.totalQuantity > 0){
                $(`#item${id}`).remove();
            } else {
                $('#cart-body').html('<div class="alert alert-info text-center">Your cart is empty!</div>');
            }
        }
        
    })
}

function updateCartItem(id, quantity){
    $.ajax({ 
        url: '/cart',
        type: 'PUT' ,
        data: { id, quantity }, //truyen du lieu
        success: function(result){
            $('#cart-badge').html(result.totalQuantity);
            $('#totalPrice').html('$' + result.totalPrice);
            $(`#price${id}`).html('$' + result.item.price);
        }
        
    })
}

function clearCart() {
    //de bao dam nguoi dung thuc su mon xoa thi minh se hoi truoc
    if(confirm('Do you really want to remove all items?')){
        $.ajax({
            url: '/cart/all',
            type: 'DELETE', 
            //khong truyen du lieu di het
            success: function(){
                $('#cart-badge').html(0); //So luong se la 0
                $('#cart-body').html('<div class="alert alert-info text-center">Your cart is empty!</div>');
            }
        })
    }
}