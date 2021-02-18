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
            $(`#item${id}`).remove();
        }
        
    })
}

function updateCartItem(id, quantity){
    $.ajax({ 
        url: '/cart',
        type: 'PUT' ,
        data: { id, quantity },
        success: function(result){
            $('#cart-badge').html(result.totalQuantity);
            $('#totalPrice').html('$' + result.totalPrice);
            $(`#price${id}`).html('$' + result.item.price);
        }
        
    })
}